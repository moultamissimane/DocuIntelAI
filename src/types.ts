export type DocumentType = 'contract' | 'invoice' | 'technical_doc' | 'specification';
export type FileFormat = 'pdf' | 'docx' | 'txt';

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  page: number;
  content: string;
  tokenCount: number;
  embeddingSample: number[];
  clauseType?: string;
}

export interface ExtractedMetadata {
  title: string;
  counterparty?: string;
  invoiceNumber?: string;
  totalAmount?: number;
  currency?: 'MAD' | 'USD' | 'EUR';
  effectiveDate?: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
  paymentTerms?: string;
  supplierObligations?: string[];
  clientObligations?: string[];
  keyClauses?: { name: string; text: string; page: number }[];
  summary: string;
  confidenceScore: number;
  ocrEngine: string;
  pydanticValidated: boolean;
  processingTimeMs: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  fileFormat: FileFormat;
  fileSize: string;
  uploadDate: string;
  status: 'indexed' | 'processing' | 'error';
  extractedData: ExtractedMetadata;
  chunks: DocumentChunk[];
  rawText: string;
}

export interface RagCitation {
  docId: string;
  docTitle: string;
  docType: DocumentType;
  chunkId: string;
  page: number;
  similarityScore: number;
  textExcerpt: string;
}

export interface RagQuery {
  id: string;
  question: string;
  timestamp: string;
  answer: string;
  citations: RagCitation[];
  generatedSql?: string;
  matchedCount?: number;
  vectorSearchDetails: {
    metric: 'cosine' | 'l2' | 'inner_product';
    topK: number;
    latencyMs: number;
    matchedChunks: number;
    embeddingModel: string;
    pgvectorIndex: string;
  };
}

export interface FilterState {
  search: string;
  docType: 'all' | DocumentType;
  currency: 'all' | 'MAD' | 'USD' | 'EUR';
  minAmount: number | null;
  maxAmount: number | null;
  expiringWithin30Days: boolean;
}
