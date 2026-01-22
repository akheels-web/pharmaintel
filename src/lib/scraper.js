import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase';
import { summarizeRegulatoryChange } from './llm';

// Regulatory sources to monitor
export const REGULATORY_SOURCES = [
  {
    authority: 'FDA',
    url: 'https://www.fda.gov/drugs/drug-safety-and-availability/drug-recalls',
    selector: '.main-content',
  },
  {
    authority: 'FDA',
    url: 'https://www.fda.gov/drugs/development-approval-process-drugs/drug-approvals-and-databases',
    selector: '.main-content',
  },
  {
    authority: 'EMA',
    url: 'https://www.ema.europa.eu/en/medicines/field_ema_web_categories%253Aname_field/Human/ema_group_types/ema_medicine',
    selector: '.main-content',
  },
  {
    authority: 'CDSCO',
    url: 'https://cdsco.gov.in/opencms/opencms/en/Drugs/New-Drugs/',
    selector: '.content',
  },
];

// Fetch and parse webpage
export async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PharmaIntel-Bot/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

// Extract main content from HTML
export function extractContent(html, selector = 'body') {
  const $ = cheerio.load(html);
  
  // Remove scripts, styles, and navigation
  $('script, style, nav, header, footer').remove();
  
  const content = $(selector).text().trim();
  return content.replace(/\s+/g, ' ');
}

// Generate hash of content
export function hashContent(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Check if content has changed
export async function checkForChanges(source) {
  const html = await fetchPage(source.url);
  if (!html) return null;
  
  const content = extractContent(html, source.selector);
  const newHash = hashContent(content);
  
  // Get stored source
  const { data: storedSource } = await supabaseAdmin
    .from('regulatory_sources')
    .select('*')
    .eq('url', source.url)
    .single();
  
  if (!storedSource) {
    // First time seeing this source
    await supabaseAdmin.from('regulatory_sources').insert({
      authority: source.authority,
      url: source.url,
      content_hash: newHash,
      last_checked: new Date().toISOString(),
    });
    return null;
  }
  
  // Update last checked
  await supabaseAdmin
    .from('regulatory_sources')
    .update({ last_checked: new Date().toISOString() })
    .eq('id', storedSource.id);
  
  // Check if content changed
  if (storedSource.content_hash !== newHash) {
    // Content changed!
    await supabaseAdmin
      .from('regulatory_sources')
      .update({ content_hash: newHash })
      .eq('id', storedSource.id);
    
    return {
      authority: source.authority,
      url: source.url,
      oldContent: '', // We don't store old content to save space
      newContent: content,
    };
  }
  
  return null;
}

// Scan all sources for changes
export async function scanAllSources() {
  const changes = [];
  
  for (const source of REGULATORY_SOURCES) {
    console.log(`Checking ${source.authority}: ${source.url}`);
    const change = await checkForChanges(source);
    
    if (change) {
      changes.push(change);
      
      // Generate AI summary of changes
      const summary = await summarizeRegulatoryChange('', change.newContent);
      
      // Create alert for all users
      await supabaseAdmin.from('alerts').insert({
        authority: change.authority,
        title: `Update detected on ${change.authority}`,
        summary: summary,
        url: change.url,
      });
    }
    
    // Be nice to servers - wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return changes;
}
