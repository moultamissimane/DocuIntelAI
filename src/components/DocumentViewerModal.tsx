import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  Layers, 
  Database, 
  Sparkles, 
  ChevronRight,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  initialChunkId?: string;
  onClose: () => void;
  onAskAboutDoc: (question: string, docId: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  initialChunkId,
  onClose,
  onAskAboutDoc,
}) => {
  if (!document) return null;

  const [activeTab, setActiveTab] = useState<'entities' | 'chunks' | 'raw'>('entities');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isContract = document.type === 'contract';
  const isInvoice = document.type === 'invoice';
  const isExpiringSoon = isContract && (document.extractedData.daysUntilExpiry ?? 999) <= 30 && (document.extractedData.daysUntilExpiry ?? -1) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate">
                  {document.extractedData.title || document.name}
                </h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  isContract 
                    ? 'bg-blue-950/80 text-blue-400 border-blue-800' 
                    : isInvoice
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                    : 'bg-purple-950/80 text-purple-400 border-purple-800'
                }`}>
                  {document.type}
                </span>
                {isExpiringSoon && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires in {document.extractedData.daysUntilExpiry}d
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {document.name} • {document.fileSize} • Uploaded {document.uploadDate} • Confidence: {(document.extractedData.confidenceScore * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all ml-4 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/40">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('entities')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'entities'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Extracted Entities & Pydantic Schema
            </button>
            <button
              onClick={() => setActiveTab('chunks')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'chunks'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Semantic Chunks ({document.chunks.length})</span>
              {initialChunkId && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'raw'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Extracted Text
            </button>
          </div>

          {/* Quick Question Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {isContract && (
              <button
                onClick={() => {
                  onAskAboutDoc("What are the payment terms in this contract?", document.id);
                  onClose();
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                Ask Payment Terms
              </button>
            )}
            {isInvoice && (
              <button
                onClick={() => {
                  onAskAboutDoc(`Confirm total invoice amount and due date for ${document.name}`, document.id);
                  onClose();
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                Query Invoice
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          
          {/* TAB 1: Entities */}
          {activeTab === 'entities' && (
            <div className="space-y-6">
              
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] text-slate-400 block font-medium">Counterparty</span>
                  <span className="font-bold text-white text-sm mt-0.5 block truncate">
                    {document.extractedData.counterparty || 'N/A'}
                  </span>
                </div>

                {isInvoice && (
                  <div className="bg-slate-950/80 border border-emerald-800/60 rounded-xl p-3">
                    <span className="text-[11px] text-emerald-400 block font-medium">Total Amount</span>
                    <span className="font-bold text-emerald-300 text-base mt-0.5 block">
                      {document.extractedData.totalAmount?.toLocaleString()} {document.extractedData.currency || 'MAD'}
                    </span>
                  </div>
                )}

                {isContract && (
                  <div className={`bg-slate-950/80 border rounded-xl p-3 ${isExpiringSoon ? 'border-amber-800/80' : 'border-slate-800/80'}`}>
                    <span className="text-[11px] text-slate-400 block font-medium">Expiry Date</span>
                    <span className={`font-bold text-sm mt-0.5 block ${isExpiringSoon ? 'text-amber-300' : 'text-white'}`}>
                      {document.extractedData.expiryDate || 'Perpetual'}
                    </span>
                  </div>
                )}

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] text-slate-400 block font-medium">Pydantic Validation</span>
                  <span className="font-bold text-emerald-400 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Validated v2
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] text-slate-400 block font-medium">OCR Extraction Time</span>
                  <span className="font-mono text-cyan-300 text-xs mt-1 block">
                    {document.extractedData.processingTimeMs} ms
                  </span>
                </div>
              </div>

              {/* Payment Terms Callout */}
              {document.extractedData.paymentTerms && (
                <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Contractual Payment Terms</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {document.extractedData.paymentTerms}
                  </p>
                </div>
              )}

              {/* Supplier Obligations */}
              {document.extractedData.supplierObligations && document.extractedData.supplierObligations.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">
                    <Layers className="w-4 h-4" />
                    <span>Supplier Deliverables & Obligations ({document.extractedData.supplierObligations.length})</span>
                  </div>
                  <div className="space-y-2">
                    {document.extractedData.supplierObligations.map((ob, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded bg-cyan-950 border border-cyan-800/80 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{ob}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Clauses */}
              {document.extractedData.keyClauses && document.extractedData.keyClauses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Important Contractual Clauses
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {document.extractedData.keyClauses.map((clause, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 text-xs">{clause.name}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            Page {clause.page}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          "{clause.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Summary */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  AI Synthesized Summary
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {document.extractedData.summary}
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: Semantic Chunks */}
          {activeTab === 'chunks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span>Total Chunks: <strong>{document.chunks.length}</strong> (512 token window, 64 token stride)</span>
                <span>Embedding Dimensions: <strong>768 (pgvector)</strong></span>
              </div>

              <div className="space-y-3">
                {document.chunks.map((chunk) => {
                  const isHighlighted = initialChunkId === chunk.id;
                  return (
                    <div 
                      key={chunk.id} 
                      className={`border rounded-xl p-4 transition-all ${
                        isHighlighted 
                          ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/50' 
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            Chunk #{chunk.chunkIndex}
                          </span>
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                            Page {chunk.page} • {chunk.tokenCount} tokens
                          </span>
                          {chunk.clauseType && (
                            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                              {chunk.clauseType}
                            </span>
                          )}
                        </div>
                        {isHighlighted && (
                          <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            Referenced in Citation
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3">
                        {chunk.content}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Vector Sample: [{chunk.embeddingSample.map(n => n.toFixed(3)).join(', ')}, ...]</span>
                        <button
                          onClick={() => handleCopy(chunk.content)}
                          className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Raw Text */}
          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Extracted text stream via {document.extractedData.ocrEngine}</span>
                <button
                  onClick={() => handleCopy(document.rawText)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {document.rawText}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>OCR Pipeline: {document.extractedData.ocrEngine}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
