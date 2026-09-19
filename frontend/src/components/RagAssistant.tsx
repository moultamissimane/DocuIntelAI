import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Database, 
  Cpu, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { DocumentItem, RagQuery, RagCitation } from '../types';
import { executeQueryEngine } from '../utils/ragEngine';

async function fetchRagAnswer(question: string, selectedDocId: string | undefined): Promise<RagQuery> {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, selectedDocId }),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}

interface RagAssistantProps {
  documents: DocumentItem[];
  history: RagQuery[];
  setHistory: React.Dispatch<React.SetStateAction<RagQuery[]>>;
  onOpenDocWithChunk: (docId: string, chunkId: string) => void;
  selectedDocId?: string;
  setSelectedDocId: (id?: string) => void;
}

export const RagAssistant: React.FC<RagAssistantProps> = ({
  documents,
  history,
  setHistory,
  onOpenDocWithChunk,
  selectedDocId,
  setSelectedDocId,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<string | null>(null);
  const [expandedSql, setExpandedSql] = useState<{ [queryId: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    {
      title: 'Payment Terms',
      query: 'What are the payment terms in this contract?',
      badge: 'Contracts',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-800'
    },
    {
      title: 'High-Value Invoices',
      query: 'Show me all invoices above 50,000 MAD.',
      badge: 'Invoices > 50k MAD',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
    },
    {
      title: 'Upcoming Expirations',
      query: 'Which contracts expire within 30 days?',
      badge: '< 30 Days Expiry',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800'
    },
    {
      title: 'Supplier Obligations',
      query: "Summarize the supplier's obligations.",
      badge: 'Deliverables & SLAs',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isProcessing) return;

    setInputQuery('');
    setIsProcessing(true);

    // Live pipeline stage indicators while we await the FastAPI backend
    setActivePipelineStep('1. FastAPI Python Route: POST /api/query');
    await new Promise(r => setTimeout(r, 150));

    setActivePipelineStep('2. PostgreSQL pgvector: 768d HNSW Cosine Similarity Query');

    try {
      let finalResult: RagQuery;
      try {
        finalResult = await fetchRagAnswer(q, selectedDocId);
      } catch (err) {
        console.warn('Backend unreachable, falling back to offline RAG engine:', err);
        finalResult = executeQueryEngine(q, documents, selectedDocId);
      }

      setActivePipelineStep('3. LLM Synthesis & Citation Grounding');
      setHistory(prev => [...prev, finalResult]);
    } catch (e) {
      console.error('RAG Query error:', e);
    } finally {
      setIsProcessing(false);
      setActivePipelineStep(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isProcessing]);

  const selectedDoc = selectedDocId ? documents.find(d => d.id === selectedDocId) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col min-h-[calc(100vh-5rem)]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Hybrid RAG Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">FastAPI + pgvector + Gemini</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Enterprise Document Intelligence Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Extract facts, cross-compare contract deliverables, audit payment terms, and filter invoices exceeding 50,000 MAD with verifiable chunk citations.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Selected Document Filter Pill */}
        {selectedDoc && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-300">
            <span className="flex items-center gap-1.5 truncate">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              Scoped to single document: <strong>{selectedDoc.extractedData.title || selectedDoc.name}</strong>
            </span>
            <button
              onClick={() => setSelectedDocId(undefined)}
              className="text-slate-400 hover:text-white underline ml-2 shrink-0"
            >
              Search all documents
            </button>
          </div>
        )}
      </div>

      {/* Suggested Prompt Recommendations */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Recommended Queries (Project 3 Specification)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(item.query)}
              disabled={isProcessing}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-700/60 rounded-xl p-3 text-left transition-all group flex flex-col justify-between shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors line-clamp-1 italic">
                "{item.query}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Query / Chat Conversation Flow */}
      <div className="space-y-6 flex-1">
        {history.length === 0 && !isProcessing && (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-cyan-400 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Ask anything across your enterprise corpus</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select one of the query suggestions above or type your question below. The platform leverages PostgreSQL pgvector HNSW cosine similarity to synthesize answers with source citations.
            </p>
          </div>
        )}

        {history.map((q) => {
          const isSqlOpen = expandedSql[q.id];

          return (
            <div key={q.id} className="space-y-3">
              
              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-2xl text-xs sm:text-sm font-medium shadow-lg shadow-cyan-950/30">
                  <p>{q.question}</p>
                  <span className="text-[10px] text-cyan-200/80 block text-right mt-1 font-mono">
                    {q.timestamp}
                  </span>
                </div>
              </div>

              {/* RAG Assistant Answer */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                
                {/* Answer Content */}
                <div className="prose prose-invert prose-xs max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {q.answer}
                </div>

                {/* Citations Block */}
                {q.citations && q.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Grounded Source Citations ({q.citations.length})
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Click citation to inspect document chunk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.citations.map((cit, idx) => (
                        <button
                          key={idx}
                          onClick={() => onOpenDocWithChunk(cit.docId, cit.chunkId)}
                          className="text-left bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-600/60 rounded-xl p-3 transition-all group space-y-1 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
                              {cit.docTitle}
                            </span>
                            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded shrink-0">
                              {(cit.similarityScore * 100).toFixed(0)}% match
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight italic">
                            "{cit.textExcerpt}"
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                            <span>Page {cit.page} • Chunk #{cit.chunkId}</span>
                            <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                              View Chunk <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SQL & Vector Pipeline Query Accordion */}
                {q.generatedSql && (
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedSql(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 py-1 font-mono transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        PostgreSQL + pgvector Execution Query ({q.vectorSearchDetails.latencyMs}ms)
                      </span>
                      {isSqlOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isSqlOpen && (
                      <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1.5">
                          <span>Index: {q.vectorSearchDetails.pgvectorIndex}</span>
                          <span>Metric: {q.vectorSearchDetails.metric} distance</span>
                        </div>
                        <pre className="text-[11px] font-mono text-cyan-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                          {q.generatedSql}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">
                    Model: {q.vectorSearchDetails.embeddingModel}
                  </span>
                  <button
                    onClick={() => handleCopy(q.answer, q.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedId === q.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === q.id ? 'Copied' : 'Copy Answer'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {/* Live Multi-Stage Processing State */}
        {isProcessing && (
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-5 shadow-xl space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
              <span className="text-sm font-bold text-white">
                Processing Query via AI Pipeline...
              </span>
            </div>
            {activePipelineStep && (
              <div className="text-xs font-mono text-cyan-300 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
                {activePipelineStep}
              </div>
            )}
            <div className="grid grid-cols-4 gap-1 pt-1">
              <div className="h-1 rounded bg-cyan-500"></div>
              <div className="h-1 rounded bg-cyan-500"></div>
              <div className="h-1 rounded bg-cyan-500 animate-pulse"></div>
              <div className="h-1 rounded bg-slate-800"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-4 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-2 ring-1 ring-white/5 focus-within:border-cyan-500 transition-all"
        >
          <input
            type="text"
            placeholder="Ask anything: 'What are the payment terms?', 'Invoices above 50,000 MAD', 'Contracts expiring in 30 days'..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-cyan-950/40"
          >
            <span>Ask RAG</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
