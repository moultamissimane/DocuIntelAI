import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { DocumentItem, DocumentType } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: DocumentItem) => void;
}

// Quick enterprise demo templates: real .txt files sent through the same
// upload/extraction/embedding pipeline as any user-provided document.
const demoTemplates: { name: string; type: DocumentType; text: string }[] = [
  {
    name: 'Sahara_Logistics_Haulage_Agreement_2024.txt',
    type: 'contract',
    text: 'HAULAGE MASTER AGREEMENT between Client and Sahara Freight & Haulage SARL. Supplier guarantees temperature-controlled reefer fleet, 99.5% delivery integrity, and 24-hour dispatch. Payment terms: Net 30 days upon inspection by Casablanca warehouse manager. Expiration date: 2026-10-18.',
  },
  {
    name: 'Invoice_INV-2024-9420_SolarPanelsCasablanca.txt',
    type: 'invoice',
    text: 'COMMERCIAL INVOICE INV-2024-9420. Maroc Solar Energy SA. Total: 88,500 MAD (TTC). Scope: 40kW Inverter systems and lithium battery energy storage rack. Payment terms: Net 45 days. Due date: 2026-10-15.',
  },
  {
    name: 'API_Async_Ingestion_Pipeline_Guide.txt',
    type: 'technical_doc',
    text: 'INGESTION SPECIFICATION: Python FastAPI handles file upload streams. Chunks are generated using a 400-word recursive splitter with 50-word overlap. Vectors stored in PostgreSQL with the pgvector extension using an HNSW cosine index.',
  },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('contract');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const uploadFile = async (file: File, type: DocumentType) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(`Uploading ${file.name} to /api/documents/upload...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_type', type);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || `Upload failed with status ${response.status}`);
      }

      setStatusMessage('Parsing, chunking, and embedding document...');
      const newDoc: DocumentItem = await response.json();

      onDocumentAdded(newDoc);
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err.message?.includes('fetch')
          ? 'Could not reach the backend at /api/documents/upload. Is the FastAPI server running?'
          : err.message || 'Upload failed.'
      );
    } finally {
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type: DocumentType = file.name.toLowerCase().includes('invoice')
      ? 'invoice'
      : file.name.toLowerCase().includes('contract')
      ? 'contract'
      : selectedType;

    uploadFile(file, type);
  };

  const handleDemoTemplate = (tpl: (typeof demoTemplates)[number]) => {
    const blob = new Blob([tpl.text], { type: 'text/plain' });
    const file = new File([blob], tpl.name, { type: 'text/plain' });
    uploadFile(file, tpl.type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload & Ingest Document</h3>
              <p className="text-xs text-slate-400">
                PDF, DOCX, Invoices, Contracts, Technical Documentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-slate-300">

          {errorMessage && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Ingestion Pipeline Status */}
          {isProcessing ? (
            <div className="bg-slate-950 border border-cyan-800 rounded-xl p-6 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-white text-sm">Processing Document Pipeline</h4>
                <p className="text-xs font-mono text-cyan-300 mt-1">{statusMessage}</p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden max-w-md mx-auto">
                <div className="bg-cyan-500 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Document Type Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Document type:</span>
                {(['contract', 'invoice', 'technical_doc'] as DocumentType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedType === t
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files[0];
                  if (file) uploadFile(file, selectedType);
                }}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                  dragActive
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">
                  Drag and drop your file here, or browse
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Supports PDF (PyMuPDF / OCR) and DOCX (python-docx) up to 25MB
                </p>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all border border-slate-700">
                  <span>Browse Files</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Pre-built Enterprise Demo Templates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Or Ingest a Pre-Formatted Enterprise Document:
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {demoTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => handleDemoTemplate(tpl)}
                      className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-700/60 rounded-xl p-3.5 text-left transition-all group flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs truncate group-hover:text-cyan-300">
                              {tpl.name}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {tpl.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {tpl.text.slice(0, 70)}...
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 font-medium">
                        <span>Ingest</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>FastAPI Python Backend</span>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
