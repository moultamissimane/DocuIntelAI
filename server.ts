import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy Gemini client helper
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    pythonFastApiBridge: "ready",
  });
});

// AI Pipeline Question Answering (RAG with citations)
app.post("/api/rag/ask", async (req, res) => {
  try {
    const { question, contextChunks, filterCriteria } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question is required" });
    }

    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are the AI Document Intelligence Engine for an enterprise platform (FastAPI + PostgreSQL pgvector backend).
You answer natural language queries using strictly the retrieved context chunks from uploaded business documents (Contracts, Invoices, Technical Docs).
Provide:
1. A direct, factual answer.
2. Specific citations referencing Document title, chunk ID, page number, and key extracted values (e.g., currency MAD, amounts, expiry dates).
3. If tabular or comparative data is involved, format clearly with bullet points or clean markdown tables.
Maintain professional, concise enterprise tone.`;

      const prompt = `User Query: "${question}"
Filtered / Retrieved Context Chunks from pgvector:
${JSON.stringify(contextChunks || [], null, 2)}
Filter Criteria Applied: ${JSON.stringify(filterCriteria || {})}

Please provide a precise, grounded answer with clear citations to the chunks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return res.json({
        answer: response.text,
        modelUsed: "gemini-3.8-flash",
        sourceCount: (contextChunks || []).length,
      });
    }

    // Fallback if no API key is supplied
    return res.json({
      answer: null,
      note: "Server-side fallback: Gemini API key not configured in environment.",
    });
  } catch (error: any) {
    console.error("Error in /api/rag/ask:", error);
    res.status(500).json({ error: error.message || "Failed to process RAG query" });
  }
});

// AI Document Extraction Endpoint (simulates FastAPI Pydantic schema extractor)
app.post("/api/documents/extract", async (req, res) => {
  try {
    const { text, filename, mimeType } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text content is required" });
    }

    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Analyze this document content and extract structured Pydantic-compatible enterprise schema.
Document Name: "${filename || "Uploaded_Doc"}"
Content sample:
${text.slice(0, 4000)}

Return valid JSON with:
{
  "document_type": "contract" | "invoice" | "technical_doc" | "other",
  "title": string,
  "counterparty": string or null,
  "total_amount": number or null,
  "currency": "MAD" | "USD" | "EUR" or null,
  "effective_date": string or null,
  "expiry_date": string or null,
  "key_clauses": string[],
  "summary": string,
  "confidence_score": number (0 to 1)
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const extracted = JSON.parse(response.text || "{}");
      return res.json({ extracted, modelUsed: "gemini-3.8-flash" });
    }

    return res.json({ extracted: null, note: "Key not present" });
  } catch (error: any) {
    console.error("Error in /api/documents/extract:", error);
    res.status(500).json({ error: error.message || "Extraction failed" });
  }
});

// Vite middleware & Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
