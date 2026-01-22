'use client';
import { useState, useEffect } from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import ChatInterface from '@/components/ChatInterface';
import { FileText, MessageSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newDoc) => {
    loadDocuments();
    setSelectedDoc(newDoc);
  };

  const deleteDocument = async (docId) => {
    if (!confirm('Delete this document?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;
      
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }
      
      loadDocuments();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document AI</h1>
          <p className="text-gray-600">Upload documents and ask questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Document List & Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Documents ({documents.length}/5)
              </h2>

              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No documents yet
                </p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDoc?.id === doc.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id);
                          }}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {documents.length < 5 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold mb-4">Upload New</h3>
                <DocumentUpload onUploadComplete={handleUploadComplete} />
              </div>
            )}

            {documents.length >= 5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Free tier limit reached. Delete documents or upgrade to Pro.
                </p>
              </div>
            )}
          </div>

          {/* Right: Chat Interface */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <ChatInterface
                documentId={selectedDoc.id}
                documentName={selectedDoc.name}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a document to start asking questions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
