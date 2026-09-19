import React, { useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Calendar, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  FileCode
} from 'lucide-react';
import { DocumentItem, DocumentType, FilterState } from '../types';

interface DocumentListProps {
  documents: DocumentItem[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectDocument: (doc: DocumentItem) => void;
  onAskQuestion: (question: string, docId?: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  filterState,
  setFilterState,
  onSelectDocument,
  onAskQuestion,
}) => {
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Type filter
      if (filterState.docType !== 'all' && doc.type !== filterState.docType) {
        return false;
      }

      // Currency filter
      if (filterState.currency !== 'all' && doc.extractedData.currency !== filterState.currency) {
        return false;
      }

      // Min amount filter
      if (filterState.minAmount !== null) {
        if ((doc.extractedData.totalAmount || 0) < filterState.minAmount) {
          return false;
        }
      }

      // Expiring in 30 days filter
      if (filterState.expiringWithin30Days) {
        if (doc.type !== 'contract') return false;
        const days = doc.extractedData.daysUntilExpiry;
        if (days === undefined || days < 0 || days > 30) return false;
      }

      // Search text
      if (filterState.search.trim()) {
        const query = filterState.search.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesTitle = (doc.extractedData.title || '').toLowerCase().includes(query);
        const matchesCounterparty = (doc.extractedData.counterparty || '').toLowerCase().includes(query);
        const matchesSummary = (doc.extractedData.summary || '').toLowerCase().includes(query);
        if (!matchesName && !matchesTitle && !matchesCounterparty && !matchesSummary) {
          return false;
        }
      }

      return true;
    });
  }, [documents, filterState]);

  const contractCount = documents.filter((d) => d.type === 'contract').length;
  const invoiceCount = documents.filter((d) => d.type === 'invoice').length;
  const techCount = documents.filter((d) => d.type === 'technical_doc').length;
  const expiringCount = documents.filter((d) => d.type === 'contract' && (d.extractedData.daysUntilExpiry ?? -1) >= 0 && (d.extractedData.daysUntilExpiry ?? 999) <= 30).length;
  const highInvoiceCount = documents.filter((d) => d.type === 'invoice' && (d.extractedData.totalAmount ?? 0) >= 50000 && d.extractedData.currency === 'MAD').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Fast Filter Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Indexed Enterprise Document Corpus
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            PostgreSQL pgvector repository with automated Pydantic schema extraction, 768-dim embeddings, and OCR normalization.
          </p>
        </div>

        {/* Quick Question Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFilterState(prev => ({ ...prev, docType: 'all', expiringWithin30Days: false, minAmount: 50000, currency: 'MAD' }));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterState.minAmount === 50000
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-700/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filter: Invoices &gt; 50,000 MAD ({highInvoiceCount})</span>
          </button>

          <button
            onClick={() => {
              setFilterState(prev => ({ ...prev, docType: 'contract', expiringWithin30Days: !prev.expiringWithin30Days, minAmount: null }));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterState.expiringWithin30Days
                ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-950/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-700/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter: Expiring &le; 30 Days ({expiringCount})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, vendor, counterparty, contract terms..."
              value={filterState.search}
              onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Reset Filters */}
          {(filterState.search || filterState.docType !== 'all' || filterState.minAmount !== null || filterState.expiringWithin30Days || filterState.currency !== 'all') && (
            <button
              onClick={() => setFilterState({
                search: '',
                docType: 'all',
                currency: 'all',
                minAmount: null,
                maxAmount: null,
                expiringWithin30Days: false
              })}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              Reset Filters
            </button>
          )}

        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>

          <button
            onClick={() => setFilterState(prev => ({ ...prev, docType: 'all', expiringWithin30Days: false }))}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterState.docType === 'all' && !filterState.expiringWithin30Days
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Documents ({documents.length})
          </button>

          <button
            onClick={() => setFilterState(prev => ({ ...prev, docType: 'contract', expiringWithin30Days: false }))}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterState.docType === 'contract' && !filterState.expiringWithin30Days
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Contracts ({contractCount})
          </button>

          <button
            onClick={() => setFilterState(prev => ({ ...prev, docType: 'invoice', minAmount: null }))}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterState.docType === 'invoice' && filterState.minAmount === null
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Invoices ({invoiceCount})
          </button>

          <button
            onClick={() => setFilterState(prev => ({ ...prev, docType: 'technical_doc', minAmount: null, expiringWithin30Days: false }))}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterState.docType === 'technical_doc'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Technical Specs ({techCount})
          </button>
        </div>

      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No documents match the active filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or removing the amount/expiration filters to view all documents.
          </p>
          <button
            onClick={() => setFilterState({
              search: '',
              docType: 'all',
              currency: 'all',
              minAmount: null,
              maxAmount: null,
              expiringWithin30Days: false
            })}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isContract = doc.type === 'contract';
            const isInvoice = doc.type === 'invoice';
            const isExpiring = isContract && (doc.extractedData.daysUntilExpiry ?? 999) <= 30 && (doc.extractedData.daysUntilExpiry ?? -1) >= 0;
            const isOver50k = isInvoice && (doc.extractedData.totalAmount ?? 0) >= 50000;

            return (
              <div
                key={doc.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-700 hover:shadow-xl group relative ${
                  isExpiring
                    ? 'border-amber-800/70 bg-gradient-to-b from-amber-950/10 to-slate-900'
                    : isOver50k
                    ? 'border-emerald-800/70 bg-gradient-to-b from-emerald-950/10 to-slate-900'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        isContract
                          ? 'bg-blue-950 text-blue-400 border-blue-800/80'
                          : isInvoice
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
                          : 'bg-purple-950 text-purple-400 border-purple-800/80'
                      }`}>
                        {doc.type}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {doc.fileFormat}
                      </span>
                    </div>

                    {isExpiring && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" />
                        Expires in {doc.extractedData.daysUntilExpiry}d
                      </span>
                    )}

                    {isOver50k && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        &gt; 50k MAD
                      </span>
                    )}
                  </div>

                  {/* Title & Counterparty */}
                  <h3 className="font-bold text-white text-sm leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1">
                    {doc.extractedData.title || doc.name}
                  </h3>

                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
                    <span className="font-medium text-slate-300 truncate">
                      {doc.extractedData.counterparty || 'Internal Specification'}
                    </span>
                  </p>

                  {/* Specific Entity Highlights */}
                  {isInvoice && doc.extractedData.totalAmount && (
                    <div className="mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Total Due:</span>
                      <span className="text-sm font-bold text-emerald-300 font-mono">
                        {doc.extractedData.totalAmount.toLocaleString()} {doc.extractedData.currency}
                      </span>
                    </div>
                  )}

                  {isContract && doc.extractedData.paymentTerms && (
                    <div className="mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Payment Clause:</span>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {doc.extractedData.paymentTerms}
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {doc.extractedData.summary}
                  </p>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    {doc.chunks.length} chunks • {doc.fileSize}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectDocument(doc)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Inspect extracted Pydantic schema and semantic chunks"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => {
                        if (isContract) {
                          onAskQuestion("What are the payment terms in this contract?", doc.id);
                        } else if (isInvoice) {
                          onAskQuestion("Show me all invoices above 50,000 MAD.", doc.id);
                        } else {
                          onAskQuestion(`Summarize key architectural specifications in ${doc.name}`, doc.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/80 transition-all"
                      title="Ask AI questions about this document"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
