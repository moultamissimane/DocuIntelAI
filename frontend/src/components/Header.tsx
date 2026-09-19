import React from 'react';
import { 
  FileText, 
  Layers, 
  Database, 
  Cpu, 
  UploadCloud, 
  Code2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface HeaderProps {
  onOpenUpload: () => void;
  onOpenArchitecture: () => void;
  activeView: 'rag' | 'documents' | 'architecture';
  setActiveView: (view: 'rag' | 'documents' | 'architecture') => void;
  documentCount: number;
  backendOnline: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onOpenArchitecture,
  activeView,
  setActiveView,
  documentCount,
  backendOnline,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-lg tracking-tight">DocuIntel AI</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  Project 3 Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Document Intelligence • FastAPI + PostgreSQL pgvector RAG
              </p>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('rag')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === 'rag'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>RAG Engine</span>
            </button>
            <button
              onClick={() => setActiveView('documents')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === 'documents'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Corpus ({documentCount})</span>
            </button>
            <button
              onClick={() => setActiveView('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === 'architecture'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Architecture</span>
            </button>
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className={`w-2 h-2 rounded-full ${
                backendOnline === null ? 'bg-slate-500' : backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}></span>
              <span className="font-mono text-slate-300">
                {backendOnline === null ? 'Checking backend...' : backendOnline ? 'FastAPI + pgvector: online' : 'Offline demo mode'}
              </span>
            </div>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-cyan-900/30 active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Doc</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
