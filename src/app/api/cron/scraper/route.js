import { NextResponse } from 'next/server';
import { scanAllSources } from '@/lib/scraper';

export async function GET(request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting regulatory scan...');
    const changes = await scanAllSources();

    return NextResponse.json({
      success: true,
      changesDetected: changes.length,
      changes: changes.map(c => ({
        authority: c.authority,
        url: c.url,
      })),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Scan failed' },
      { status: 500 }
    );
  }
}

// For local testing
export async function POST(request) {
  if (process.env.NODE_ENV === 'development') {
    return GET(request);
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
