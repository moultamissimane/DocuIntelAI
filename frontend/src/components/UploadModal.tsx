import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  FileCode, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { DocumentItem, DocumentType } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('contract');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Quick enterprise demo templates
  const demoTemplates = [
    {
      name: 'Sahara_Logistics_Haulage_Agreement_2024.pdf',
      type: 'contract' as DocumentType,
      title: 'Heavy Logistics Transport & Haulage Master Agreement',
      counterparty: 'Sahara Freight & Haulage SARL',
      amount: null,
      currency: 'MAD' as const,
      paymentTerms: 'Net 30 days following freight delivery confirmation by Casablanca warehouse manager.',
      expiry: '2024-10-18',
      days: 29,
      text: 'HAULAGE MASTER AGREEMENT. Supplier Sahara Freight & Haulage SARL guarantees temperature-controlled reefer fleet, 99.5% delivery integrity, and 24-hour dispatch. Payment terms: Net 30 days upon inspection. Expiration date: October 18, 2024.'
    },
    {
      name: 'Invoice_INV-2024-9420_SolarPanelsCasablanca.pdf',
      type: 'invoice' as DocumentType,
      title: 'Solar Photovoltaic Inverter & Battery Bank Delivery',
      counterparty: 'Maroc Solar Energy SA',
      amount: 88500,
      currency: 'MAD' as const,
      paymentTerms: 'Net 45 days. Attijariwafa Bank wire transfer.',
      expiry: '2024-10-15',
      days: 26,
      text: 'COMMERCIAL INVOICE INV-2024-9420. Maroc Solar Energy SA. Total: 88,500 MAD (TTC). Scope: 40kW Inverter systems and lithium battery energy storage rack. Due date: October 15, 2024.'
    },
    {
      name: 'API_Async_Ingestion_Pipeline_Guide.docx',
      type: 'technical_doc' as DocumentType,
      title: 'High-Throughput Asynchronous Ingestion & pgvector HNSW Guide',
      counterparty: 'Data Platform Architecture Team',
      amount: null,
      currency: 'USD' as const,
      paymentTerms: 'Internal Architecture Specification',
      expiry: undefined,
      days: undefined,
      text: 'INGESTION SPECIFICATION: Python FastAPI with Celery / Redis broker handles file upload streams. Chunks are generated using 512-token RecursiveSplitter. Vectors stored in PostgreSQL with pgvector extension.'
    }
  ];

  const simulateProcessing = async (
    filename: string,
    type: DocumentType,
    title: string,
    counterparty: string,
    rawText: string,
    amount: number | null,
    paymentTerms: string,
    expiry?: string,
    days?: number
  ) => {
    setIsProcessing(true);

    setCurrentStep('1/4 Parsing PDF/DOCX binary stream (PyMuPDF & python-docx)...');
    await new Promise(r => setTimeout(r, 450));

    setCurrentStep('2/4 Validating Pydantic v2 metadata schema & entities...');
    await new Promise(r => setTimeout(r, 400));

    setCurrentStep('3/4 Generating 768-dim embeddings with RecursiveTextSplitter...');
    await new Promise(r => setTimeout(r, 450));

    setCurrentStep('4/4 Indexing chunks into PostgreSQL pgvector HNSW table...');
    await new Promise(r => setTimeout(r, 350));

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: filename,
      type,
      fileFormat: filename.endsWith('.docx') ? 'docx' : 'pdf',
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'indexed',
      extractedData: {
        title,
        counterparty,
        invoiceNumber: type === 'invoice' ? `INV-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        totalAmount: amount || undefined,
        currency: 'MAD',
        effectiveDate: new Date().toISOString().split('T')[0],
        expiryDate: expiry,
        daysUntilExpiry: days,
        paymentTerms,
        supplierObligations: type === 'contract' ? [
          'Maintain 99.8% SLA on agreed services and provide monthly executive reports.',
          'Execute emergency response protocol within 2 hours for critical disruption.',
          'Comply with Moroccan commercial and labor standards.'
        ] : undefined,
        summary: `Extracted ${type} document for ${counterparty}. Structured entities parsed via FastAPI Pydantic validator.`,
        confidenceScore: 0.987,
        ocrEngine: 'PyMuPDF + Tesseract v5.3 / python-docx',
        pydanticValidated: true,
        processingTimeMs: 380,
      },
      chunks: [
        {
          id: `chk-${Date.now()}-1`,
          chunkIndex: 1,
          page: 1,
          tokenCount: 260,
          content: rawText,
          embeddingSample: [0.082, -0.194, 0.381, 0.114, -0.045],
          clauseType: type === 'contract' ? 'Terms & Obligations' : type === 'invoice' ? 'Amounts & Remittance' : 'System Overview'
        },
        {
          id: `chk-${Date.now()}-2`,
          chunkIndex: 2,
          page: 2,
          tokenCount: 220,
          content: `${paymentTerms}. Applicable under Moroccan commercial jurisdiction.`,
          embeddingSample: [0.125, -0.098, 0.412, -0.180, 0.195],
          clauseType: 'Payment Terms & Enforcement'
        }
      ],
      rawText
    };

    onDocumentAdded(newDoc);
    setIsProcessing(false);
    setCurrentStep(null);
    onClose();
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isDocx = file.name.endsWith('.docx');
    const isPdf = file.name.endsWith('.pdf');
    const type: DocumentType = file.name.toLowerCase().includes('invoice') 
      ? 'invoice' 
      : file.name.toLowerCase().includes('contract') 
      ? 'contract' 
      : selectedType;

    simulateProcessing(
      file.name,
      type,
      file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
      'Custom Enterprise Partner',
      `Custom uploaded enterprise file: ${file.name}. Processed via Document Processing pipeline. Payment terms Net 30 days.`,
      type === 'invoice' ? 62000 : null,
      'Net 30 days upon delivery confirmation.',
      type === 'contract' ? '2024-10-12' : undefined,
      type === 'contract' ? 23 : undefined
    );
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
          
          {/* Live Ingestion Pipeline Status */}
          {isProcessing ? (
            <div className="bg-slate-950 border border-cyan-800 rounded-xl p-6 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-white text-sm">Processing Document Pipeline</h4>
                <p className="text-xs font-mono text-cyan-300 mt-1">{currentStep}</p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden max-w-md mx-auto">
                <div className="bg-cyan-500 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    simulateProcessing(
                      file.name,
                      selectedType,
                      file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                      'Uploaded Enterprise Partner',
                      `Extracted content from ${file.name}. Payment terms Net 30 days.`,
                      selectedType === 'invoice' ? 55000 : null,
                      'Net 30 days upon invoice validation.',
                      selectedType === 'contract' ? '2024-10-10' : undefined,
                      selectedType === 'contract' ? 21 : undefined
                    );
                  }
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
                      onClick={() => simulateProcessing(
                        tpl.name,
                        tpl.type,
                        tpl.title,
                        tpl.counterparty,
                        tpl.text,
                        tpl.amount,
                        tpl.paymentTerms,
                        tpl.expiry,
                        tpl.days
                      )}
                      className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-700/60 rounded-xl p-3.5 text-left transition-all group flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs truncate group-hover:text-cyan-300">
                              {tpl.title}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {tpl.type}
                            </span>
                            {tpl.amount && (
                              <span className="text-[10px] font-bold text-emerald-400">
                                {tpl.amount.toLocaleString()} {tpl.currency}
                              </span>
                            )}
                            {tpl.days && (
                              <span className="text-[10px] text-amber-400">
                                {tpl.days}d expiry
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {tpl.counterparty} • {tpl.name}
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
          <span>FastAPI Python Backend: Active</span>
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
