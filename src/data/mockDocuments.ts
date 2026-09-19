import { DocumentItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'ctr-atlas-001',
    name: 'Atlas_Cloud_SaaS_Master_Agreement_2024.pdf',
    type: 'contract',
    fileFormat: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: '2024-08-10',
    status: 'indexed',
    extractedData: {
      title: 'Enterprise Cloud Infrastructure Master Service Agreement',
      counterparty: 'Atlas Cloud Solutions SARL',
      effectiveDate: '2023-10-01',
      expiryDate: '2024-10-05',
      daysUntilExpiry: 16,
      paymentTerms: 'Net 45 calendar days following receipt of undisputed monthly invoice. Late payments accrue interest at 1.5% per month or the maximum rate permissible by applicable commercial law.',
      supplierObligations: [
        'Maintain an operational platform availability SLA of at least 99.95% measured monthly.',
        'Execute automated geo-redundant database backups every 6 hours with a Recovery Point Objective (RPO) under 15 minutes.',
        'Provide Level 1 to Level 3 round-the-clock technical incident resolution with maximum 30-minute response time for critical Severity-1 outages.',
        'Ensure strict SOC-2 Type II, ISO 27001 compliance and data residency within local Casablanca data centers.'
      ],
      clientObligations: [
        'Pay all validated recurring compute fees within designated Net 45 schedule.',
        'Designate primary engineering point of contact for scheduled maintenance windows.'
      ],
      keyClauses: [
        {
          name: 'Section 4.2 - Payment Terms & Audit',
          text: 'Customer shall remit payment in full within Net forty-five (45) calendar days from receipt of invoice. Undisputed overdue balances are subject to a 1.5% monthly late finance charge.',
          page: 4
        },
        {
          name: 'Section 7.1 - Service Level Obligations',
          text: 'Atlas Cloud warrants that the Vector Database and Ingestion API endpoints shall maintain 99.95% monthly uptime. Failure results in liquidated service credits of 10% per hour of downtime.',
          page: 7
        },
        {
          name: 'Section 12.4 - Term & Termination',
          text: 'This agreement expires on October 5, 2024 unless renewed in writing 60 days prior to expiration. Either party may terminate with 30 days notice upon material uncured breach.',
          page: 12
        }
      ],
      summary: 'Comprehensive enterprise SaaS agreement for cloud hosting, dedicated pgvector clusters, and API orchestration with Atlas Cloud Solutions.',
      confidenceScore: 0.985,
      ocrEngine: 'PyMuPDF + Tesseract v5.3 OCR Engine',
      pydanticValidated: true,
      processingTimeMs: 412,
    },
    chunks: [
      {
        id: 'chk-atlas-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 245,
        content: 'MASTER SERVICES AGREEMENT between Enterprise Systems Corp ("Client") and Atlas Cloud Solutions SARL ("Supplier" or "Vendor"), headquartered in Boulevard d\'Anfa, Casablanca, Morocco.',
        embeddingSample: [0.042, -0.198, 0.312, 0.089, -0.054],
        clauseType: 'Preamble & Parties'
      },
      {
        id: 'chk-atlas-4',
        chunkIndex: 4,
        page: 4,
        tokenCount: 310,
        content: 'SECTION 4. PAYMENT TERMS AND BILLING SCHEDULE: Invoices for cloud infrastructure usage, vector search indexing, and managed services shall be issued on the 1st day of each billing cycle. Customer agrees to pay the total invoiced amount within Net forty-five (45) calendar days from invoice date. Any overdue unpaid amount past forty-five days shall incur interest at a rate of 1.5% per 30-day period until settled.',
        embeddingSample: [0.115, -0.084, 0.442, -0.210, 0.178],
        clauseType: 'Payment Terms'
      },
      {
        id: 'chk-atlas-7',
        chunkIndex: 7,
        page: 7,
        tokenCount: 380,
        content: 'SECTION 7. SUPPLIER OBLIGATIONS AND SERVICE LEVELS: Supplier shall guarantee high-availability multi-zone deployment with 99.95% uptime for document embedding APIs and PostgreSQL pgvector endpoints. Supplier must perform automated continuous backups to encrypted S3-compatible storage with an RPO under 15 minutes and an RTO under 2 hours. Supplier shall provide 24/7 dedicated support desk with guaranteed 30-minute initial response for critical Severity 1 incidents.',
        embeddingSample: [-0.034, 0.298, 0.395, 0.112, -0.189],
        clauseType: "Supplier's Obligations"
      },
      {
        id: 'chk-atlas-12',
        chunkIndex: 12,
        page: 12,
        tokenCount: 280,
        content: 'SECTION 12. DURATION, TERMINATION, AND EXPIRY: This Agreement is effective as of October 1, 2023, and shall expire automatically on October 5, 2024. Renewal requires written agreement by both parties. Termination for convenience requires 90 days prior written notice.',
        embeddingSample: [0.089, -0.156, 0.221, 0.312, -0.045],
        clauseType: 'Term & Expiration'
      }
    ],
    rawText: 'MASTER SERVICES AGREEMENT between Enterprise Systems Corp and Atlas Cloud Solutions SARL. Payment terms: Net 45 calendar days. Supplier guarantees 99.95% uptime, 15-minute RPO, and 24/7 support. Expiry: October 5, 2024.'
  },
  {
    id: 'ctr-maghreb-412',
    name: 'Maghreb_Facilities_Maintenance_Contract.docx',
    type: 'contract',
    fileFormat: 'docx',
    fileSize: '1.1 MB',
    uploadDate: '2024-08-14',
    status: 'indexed',
    extractedData: {
      title: 'Commercial Facilities & Infrastructure SLA Agreement',
      counterparty: 'Maghreb Facility Services SA',
      effectiveDate: '2023-09-25',
      expiryDate: '2024-09-30',
      daysUntilExpiry: 11,
      paymentTerms: 'Net 30 days upon validated monthly facilities inspection report and sign-off by operations director.',
      supplierObligations: [
        'Deploy certified on-site mechanical and electrical engineers 24/7 at Moroccan data center hubs.',
        'Execute preventive maintenance on backup diesel generators every 14 days and submit fuel quality lab reports.',
        'Guarantee a 2-hour on-site arrival SLA for any HVAC or primary electrical distribution interruption.',
        'Maintain minimum professional liability coverage of 15,000,000 MAD throughout contractual period.'
      ],
      clientObligations: [
        'Provide biometric security clearance and unhindered access to authorized facility engineers.',
        'Review and sign off on monthly maintenance logs within 5 business days of delivery.'
      ],
      keyClauses: [
        {
          name: 'Clause 3.1 - Compensation & Net 30 Terms',
          text: 'Payment terms are Net thirty (30) days from formal presentation of monthly service audit.',
          page: 2
        },
        {
          name: 'Clause 5.4 - Mandatory Supplier Obligations',
          text: 'Supplier warrants 24/7 presence of licensed engineers, quarterly thermal imaging of switchboards, and guaranteed 2-hour response for cooling emergency.',
          page: 5
        },
        {
          name: 'Clause 9.1 - Term Expiration',
          text: 'The validity of this contract concludes on September 30, 2024, subject to 30-day transition assistance.',
          page: 8
        }
      ],
      summary: 'Data center critical infrastructure and physical engineering maintenance contract with Maghreb Facility Services expiring late September 2024.',
      confidenceScore: 0.991,
      ocrEngine: 'python-docx XML Parser & Normalizer',
      pydanticValidated: true,
      processingTimeMs: 290,
    },
    chunks: [
      {
        id: 'chk-maghreb-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 220,
        content: 'FACILITY SERVICES MASTER AGREEMENT entered into by and between Enterprise Operations LLC and Maghreb Facility Services SA, Casablanca Technopark.',
        embeddingSample: [0.015, -0.210, 0.145, 0.098, -0.076],
        clauseType: 'Parties'
      },
      {
        id: 'chk-maghreb-3',
        chunkIndex: 3,
        page: 2,
        tokenCount: 290,
        content: 'CLAUSE 3. BILLING AND REMITTANCE: Compensation for routine monthly maintenance is fixed at 45,000 MAD per month. All payments shall be processed strictly on Net thirty (30) day terms following validation of the facility engineer inspection log by the client infrastructure committee.',
        embeddingSample: [0.095, -0.045, 0.380, -0.150, 0.210],
        clauseType: 'Payment Terms'
      },
      {
        id: 'chk-maghreb-5',
        chunkIndex: 5,
        page: 5,
        tokenCount: 360,
        content: "CLAUSE 5. THE SUPPLIER'S OBLIGATIONS: Maghreb Facility Services is obligated to provide 24/7 on-site certified engineering staff for uninterrupted HVAC and precision cooling. Supplier must perform bi-weekly generator stress tests and fuel stabilization. In the event of cooling circuit degradation, Supplier guarantees technician mobilization on-site in under 120 minutes. Supplier shall maintain third-party liability insurance policy of 15,000,000 MAD.",
        embeddingSample: [-0.012, 0.310, 0.410, 0.085, -0.160],
        clauseType: "Supplier's Obligations"
      },
      {
        id: 'chk-maghreb-9',
        chunkIndex: 9,
        page: 8,
        tokenCount: 260,
        content: 'CLAUSE 9. EXPIRATION AND RENEWAL NOTICES: This contract term expires on September 30, 2024. If neither party delivers a written extension notification before September 1, 2024, the services shall smoothly wind down with a 30-day knowledge transfer period.',
        embeddingSample: [0.075, -0.180, 0.260, 0.290, -0.020],
        clauseType: 'Expiration'
      }
    ],
    rawText: 'FACILITY SERVICES MASTER AGREEMENT. Supplier obligations: 24/7 on-site technicians, bi-weekly generator tests, 2-hour cooling response. Payment terms Net 30 days. Expiration date: September 30, 2024.'
  },
  {
    id: 'inv-atlas-8891',
    name: 'Invoice_INV-2024-8891_AtlasDataCenter.pdf',
    type: 'invoice',
    fileFormat: 'pdf',
    fileSize: '680 KB',
    uploadDate: '2024-08-15',
    status: 'indexed',
    extractedData: {
      title: 'Monthly Dedicated pgvector & GPU Cluster Compute Invoice',
      counterparty: 'Atlas Data Centers SARL',
      invoiceNumber: 'INV-2024-8891',
      totalAmount: 74500,
      currency: 'MAD',
      effectiveDate: '2024-08-15',
      expiryDate: '2024-09-15',
      daysUntilExpiry: 0,
      paymentTerms: 'Due upon receipt, maximum Net 30 days. Bank wire transfer to Attijariwafa Bank Casablanca.',
      summary: 'Invoice for 3x Dedicated NVIDIA L40S Vector Embeddings Server Cluster and 500GB pgvector High-IOPS NVMe storage.',
      confidenceScore: 0.994,
      ocrEngine: 'Tesseract OCR + LayoutLM Form Parser',
      pydanticValidated: true,
      processingTimeMs: 185,
    },
    chunks: [
      {
        id: 'chk-inv-8891-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 195,
        content: 'INVOICE NUMBER: INV-2024-8891 | DATE: 15-AUG-2024 | DUE DATE: 15-SEP-2024. Billed to: Enterprise Document AI Corp, Casablanca Finance City. Vendor: Atlas Data Centers SARL. Total Due: 74,500 MAD (TTC). Line Items: 1) Dedicated GPU Compute Cluster (NVIDIA L40S) - 58,000 MAD. 2) High-Throughput NVMe Vector Storage 500GB - 16,500 MAD.',
        embeddingSample: [0.180, -0.120, 0.350, 0.050, 0.220],
        clauseType: 'Invoice Line Items & Total'
      }
    ],
    rawText: 'INVOICE INV-2024-8891. Vendor: Atlas Data Centers SARL. Total Amount: 74,500 MAD. Due date: September 15, 2024. GPU Vector Cluster and NVMe Storage.'
  },
  {
    id: 'inv-oracle-9104',
    name: 'Invoice_INV-2024-9104_EnterpriseDatabaseSupport.pdf',
    type: 'invoice',
    fileFormat: 'pdf',
    fileSize: '820 KB',
    uploadDate: '2024-08-10',
    status: 'indexed',
    extractedData: {
      title: 'Quarterly High-Availability PostgreSQL Support & DB Tuning',
      counterparty: 'North Africa Digital Systems',
      invoiceNumber: 'INV-2024-9104',
      totalAmount: 128400,
      currency: 'MAD',
      effectiveDate: '2024-08-10',
      expiryDate: '2024-09-10',
      daysUntilExpiry: 0,
      paymentTerms: 'Net 30 days via direct corporate bank transfer. Subject to 20% Moroccan VAT.',
      summary: 'High availability database support, pgvector indexing tuning, and automated replica failover configuration.',
      confidenceScore: 0.988,
      ocrEngine: 'PyMuPDF + Tesseract OCR',
      pydanticValidated: true,
      processingTimeMs: 210,
    },
    chunks: [
      {
        id: 'chk-inv-9104-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 215,
        content: 'TAX INVOICE: INV-2024-9104. Issuer: North Africa Digital Systems. Total Amount: 128,400 MAD (Net: 107,000 MAD, VAT 20%: 21,400 MAD). Services: PostgreSQL 16 Enterprise HA Support, pgvector HNSW indexing optimization, and continuous replication tuning across primary and standby nodes.',
        embeddingSample: [0.210, -0.090, 0.410, 0.020, 0.180],
        clauseType: 'Invoice Header & Amounts'
      }
    ],
    rawText: 'TAX INVOICE INV-2024-9104. North Africa Digital Systems. Total: 128,400 MAD. PostgreSQL pgvector optimization.'
  },
  {
    id: 'inv-cybershield-9980',
    name: 'Invoice_INV-2024-9980_SecurityAudit.pdf',
    type: 'invoice',
    fileFormat: 'pdf',
    fileSize: '540 KB',
    uploadDate: '2024-09-02',
    status: 'indexed',
    extractedData: {
      title: 'Annual Penetration Testing & API Vulnerability Assessment',
      counterparty: 'CyberShield Maroc SARL',
      invoiceNumber: 'INV-2024-9980',
      totalAmount: 65000,
      currency: 'MAD',
      effectiveDate: '2024-09-02',
      expiryDate: '2024-10-02',
      daysUntilExpiry: 13,
      paymentTerms: 'Net 30 days. Wire transfer to Banque Populaire.',
      summary: 'External penetration testing of Document RAG FastAPI endpoints, vector database authentication, and S3 asset buckets.',
      confidenceScore: 0.992,
      ocrEngine: 'Tesseract OCR v5.3',
      pydanticValidated: true,
      processingTimeMs: 165,
    },
    chunks: [
      {
        id: 'chk-inv-9980-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 180,
        content: 'INVOICE: INV-2024-9980. CyberShield Maroc SARL. Date: 02/09/2024. Due Date: 02/10/2024. Description: Full-scope penetration testing for FastAPI microservices and PostgreSQL vector storage. Total Amount: 65,000 MAD. Payment: Net 30 days.',
        embeddingSample: [0.150, -0.160, 0.320, 0.090, 0.140],
        clauseType: 'Summary & Total'
      }
    ],
    rawText: 'INVOICE INV-2024-9980. CyberShield Maroc SARL. Total: 65,000 MAD. Scope: FastAPI & pgvector security audit.'
  },
  {
    id: 'inv-maghreb-7712',
    name: 'Invoice_INV-2024-7712_FreightLogistics.pdf',
    type: 'invoice',
    fileFormat: 'pdf',
    fileSize: '430 KB',
    uploadDate: '2024-08-20',
    status: 'indexed',
    extractedData: {
      title: 'Server Hardware Transport & Customs Clearance Casablanca Port',
      counterparty: 'Maghreb Freight Express',
      invoiceNumber: 'INV-2024-7712',
      totalAmount: 32000,
      currency: 'MAD',
      effectiveDate: '2024-08-20',
      expiryDate: '2024-09-20',
      daysUntilExpiry: 1,
      paymentTerms: 'Net 15 days upon container handover.',
      summary: 'Inter-facility logistics, secure transport of server racks, and port of Casablanca customs declaration fees.',
      confidenceScore: 0.978,
      ocrEngine: 'Tesseract OCR v5.3',
      pydanticValidated: true,
      processingTimeMs: 140,
    },
    chunks: [
      {
        id: 'chk-inv-7712-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 160,
        content: 'COMMERCIAL INVOICE: INV-2024-7712. Maghreb Freight Express. Handled shipment: Server Racks and Optical Fiber Equipment. Total Amount: 32,000 MAD. Net 15 days.',
        embeddingSample: [0.110, -0.190, 0.280, 0.120, 0.090],
        clauseType: 'Logistics Details'
      }
    ],
    rawText: 'COMMERCIAL INVOICE INV-2024-7712. Maghreb Freight Express. Total: 32,000 MAD.'
  },
  {
    id: 'inv-rabat-6500',
    name: 'Invoice_INV-2024-6500_OfficeHardware.pdf',
    type: 'invoice',
    fileFormat: 'pdf',
    fileSize: '390 KB',
    uploadDate: '2024-07-28',
    status: 'indexed',
    extractedData: {
      title: 'Ergonomic Workstations & Development Monitors',
      counterparty: 'Rabat Tech Solutions',
      invoiceNumber: 'INV-2024-6500',
      totalAmount: 14200,
      currency: 'MAD',
      effectiveDate: '2024-07-28',
      expiryDate: '2024-08-28',
      daysUntilExpiry: -22,
      paymentTerms: 'Immediate upon delivery (Settled).',
      summary: 'Dual-monitor developer setups and accessories for engineering workstation upgrades.',
      confidenceScore: 0.985,
      ocrEngine: 'Tesseract OCR v5.3',
      pydanticValidated: true,
      processingTimeMs: 120,
    },
    chunks: [
      {
        id: 'chk-inv-6500-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 140,
        content: 'RECEIPT INVOICE: INV-2024-6500. Rabat Tech Solutions. Total: 14,200 MAD. Paid in full via CMI payment gateway.',
        embeddingSample: [0.080, -0.140, 0.220, 0.070, 0.050],
        clauseType: 'Settled Invoice'
      }
    ],
    rawText: 'INVOICE INV-2024-6500. Rabat Tech Solutions. Total: 14,200 MAD. Status: Paid.'
  },
  {
    id: 'ctr-casatech-108',
    name: 'Casatech_Hardware_DarkFiber_Procurement.pdf',
    type: 'contract',
    fileFormat: 'pdf',
    fileSize: '1.9 MB',
    uploadDate: '2024-06-15',
    status: 'indexed',
    extractedData: {
      title: 'Optical Fiber Network & Dark Fiber Irrevocable Indefeasible Right of Use (IRU)',
      counterparty: 'Casatech Systems SARL',
      effectiveDate: '2024-06-01',
      expiryDate: '2025-06-01',
      daysUntilExpiry: 255,
      paymentTerms: '30% upfront upon fiber trenching survey approval, 70% within Net 60 days following optical loop dB loss certification.',
      supplierObligations: [
        'Deliver redundant dual-path 10Gbps optical dark fiber connection between Casablanca Finance City and Bouskoura Data Center.',
        'Ensure continuous optical circuit attenuation does not exceed 0.25 dB/km at 1550nm wavelength.',
        'Sub-50 millisecond automated path failover on DWDM optical protection switches in the event of conduit cut.'
      ],
      clientObligations: [
        'Furnish clean rack power and meet environmental temperature standards (18°C - 24°C) at demarcation points.'
      ],
      keyClauses: [
        {
          name: 'Section 5.2 - Milestone Payments',
          text: 'Payment terms mandate 30% mobilization fee followed by 70% payable Net 60 days upon acceptance testing.',
          page: 6
        },
        {
          name: 'Section 8.3 - Fiber Supplier Warranties',
          text: 'Casatech guarantees dual route redundancy and sub-50ms optical protection switching.',
          page: 11
        }
      ],
      summary: 'High-speed dark fiber connectivity agreement connecting primary enterprise site to disaster recovery facility.',
      confidenceScore: 0.982,
      ocrEngine: 'PyMuPDF + Tesseract v5.3',
      pydanticValidated: true,
      processingTimeMs: 380,
    },
    chunks: [
      {
        id: 'chk-casa-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 210,
        content: 'DARK FIBER IRU AGREEMENT between Client and Casatech Systems SARL. Scope: Dedicated dark fiber pair connecting Casablanca primary and secondary data points.',
        embeddingSample: [0.030, -0.180, 0.210, 0.140, -0.090],
        clauseType: 'Recitals'
      },
      {
        id: 'chk-casa-5',
        chunkIndex: 5,
        page: 6,
        tokenCount: 320,
        content: 'SECTION 5. INVOICING AND FINANCIAL TERMS: Total turnkey installation cost is 450,000 MAD. Invoicing schedule: Phase 1 (30% upfront) upon municipal right-of-way permit; Phase 2 (70%) remitted within Net sixty (60) days following formal optical test results certification.',
        embeddingSample: [0.140, -0.060, 0.390, -0.110, 0.190],
        clauseType: 'Payment Terms'
      },
      {
        id: 'chk-casa-8',
        chunkIndex: 8,
        page: 11,
        tokenCount: 340,
        content: "SECTION 8. SUPPLIER SPECIFICATIONS AND TECHNICAL OBLIGATIONS: Casatech shall guarantee optical loop redundancy with sub-50 millisecond automated failover. Mean Time to Repair (MTTR) for physical fiber cuts shall not exceed four (4) hours from dispatch notification.",
        embeddingSample: [-0.020, 0.280, 0.370, 0.090, -0.150],
        clauseType: "Supplier's Obligations"
      }
    ],
    rawText: 'DARK FIBER AGREEMENT. Casatech Systems. Payment: 30% upfront, 70% Net 60 days. Obligations: sub-50ms failover, 4-hour MTTR.'
  },
  {
    id: 'doc-rag-spec-01',
    name: 'Enterprise_FastAPI_pgvector_Architecture_Spec.docx',
    type: 'technical_doc',
    fileFormat: 'docx',
    fileSize: '3.1 MB',
    uploadDate: '2024-08-25',
    status: 'indexed',
    extractedData: {
      title: 'Enterprise Document Intelligence & pgvector RAG Architecture Specification',
      counterparty: 'Internal Engineering Team / Python & FastAPI Core',
      effectiveDate: '2024-08-01',
      summary: 'Complete technical architecture guide covering FastAPI async endpoints, Pydantic v2 data models, pgvector HNSW indexing, chunking window parameters, and AWS deployment.',
      confidenceScore: 0.998,
      ocrEngine: 'python-docx AST Extractor + Markdown Tokenizer',
      pydanticValidated: true,
      processingTimeMs: 440,
    },
    chunks: [
      {
        id: 'chk-spec-1',
        chunkIndex: 1,
        page: 1,
        tokenCount: 290,
        content: 'ARCHITECTURE OVERVIEW: The platform frontend (Next.js / React / TypeScript) interfaces with a high-throughput Python FastAPI backend. The FastAPI layer orchestrates asynchronous document parsing pipelines (PyMuPDF for PDF, python-docx for DOCX) and validates extracted structures via Pydantic v2 models.',
        embeddingSample: [0.080, -0.240, 0.310, 0.160, -0.040],
        clauseType: 'System Architecture'
      },
      {
        id: 'chk-spec-2',
        chunkIndex: 2,
        page: 2,
        tokenCount: 350,
        content: 'POSTGRESQL + PGVECTOR SPECIFICATION: Documents are split into semantic chunks using a 512-token window with 64-token overlap. Vectors are embedded via 768-dimensional models and stored in PostgreSQL with the pgvector extension. The database employs an HNSW index with parameters m=16, ef_construction=64, and utilizes cosine distance (<=>) for sub-20ms nearest-neighbor retrieval.',
        embeddingSample: [0.090, -0.220, 0.420, 0.080, -0.110],
        clauseType: 'Vector Search Benchmark'
      },
      {
        id: 'chk-spec-3',
        chunkIndex: 3,
        page: 3,
        tokenCount: 320,
        content: 'HYBRID QUERY PIPELINE: Queries combining metadata filters (e.g., invoices > 50,000 MAD, or contracts expiring <= 30 days) execute as single compound queries in PostgreSQL combining relational WHERE clauses with vector similarity ranking, followed by LLM synthesis and citation grounding.',
        embeddingSample: [0.120, -0.150, 0.380, 0.110, -0.080],
        clauseType: 'Hybrid RAG Pipeline'
      }
    ],
    rawText: 'TECHNICAL SPECIFICATION: Next.js + FastAPI + PostgreSQL pgvector. 512 token chunking, 768-dimension embeddings, HNSW index m=16, cosine distance. Hybrid metadata + vector queries.'
  }
];
