import React, { useState } from 'react';
import { Header } from './components/Header';
import { RagAssistant } from './components/RagAssistant';
import { DocumentList } from './components/DocumentList';
import { ArchitectureView } from './components/ArchitectureView';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { UploadModal } from './components/UploadModal';
import { INITIAL_DOCUMENTS } from './data/mockDocuments';
import { DocumentItem, FilterState, RagQuery } from './types';

export default function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [activeView, setActiveView] = useState<'rag' | 'documents' | 'architecture'>('rag');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Inspection modal state
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);
  const [highlightedChunkId, setHighlightedChunkId] = useState<string | undefined>(undefined);

  // Scoped search doc in RAG
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);

  // RAG query conversation history
  const [ragHistory, setRagHistory] = useState<RagQuery[]>([]);

  // Document list filters
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    docType: 'all',
    currency: 'all',
    minAmount: null,
    maxAmount: null,
    expiringWithin30Days: false,
  });

  // Open Document Inspector with specific chunk highlighted (e.g. from citation click)
  const handleOpenDocWithChunk = (docId: string, chunkId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setHighlightedChunkId(chunkId);
      setInspectingDoc(doc);
    }
  };

  // Direct ask question shortcut
  const handleAskQuestion = (question: string, docId?: string) => {
    setSelectedDocId(docId);
    setActiveView('rag');
  };

  // Document added from upload flow
  const handleDocumentAdded = (newDoc: DocumentItem) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Platform Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenArchitecture={() => setActiveView('architecture')}
        documentCount={documents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'rag' && (
          <RagAssistant
            documents={documents}
            history={ragHistory}
            setHistory={setRagHistory}
            onOpenDocWithChunk={handleOpenDocWithChunk}
            selectedDocId={selectedDocId}
            setSelectedDocId={setSelectedDocId}
          />
        )}

        {activeView === 'documents' && (
          <DocumentList
            documents={documents}
            filterState={filterState}
            setFilterState={setFilterState}
            onSelectDocument={(doc) => {
              setHighlightedChunkId(undefined);
              setInspectingDoc(doc);
            }}
            onAskQuestion={handleAskQuestion}
          />
        )}

        {activeView === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Document Inspector Modal */}
      {inspectingDoc && (
        <DocumentViewerModal
          document={inspectingDoc}
          initialChunkId={highlightedChunkId}
          onClose={() => {
            setInspectingDoc(null);
            setHighlightedChunkId(undefined);
          }}
          onAskAboutDoc={handleAskQuestion}
        />
      )}

      {/* Upload & Ingestion Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentAdded={handleDocumentAdded}
      />

    </div>
  );
}
