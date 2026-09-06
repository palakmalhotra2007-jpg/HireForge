import path from "node:path";
import { pathToFileURL } from "node:url";

let pdfParseModule = null;
let workerInitialized = false;

async function getPdfParser() {
  if (pdfParseModule) return pdfParseModule;
  try {
    const mod = await import("pdf-parse");
    pdfParseModule = mod.PDFParse || mod.default || mod;
    if (pdfParseModule && typeof pdfParseModule.setWorker === "function" && !workerInitialized) {
      try {
        const workerPath = path.join(
          process.cwd(),
          "node_modules",
          "pdfjs-dist",
          "legacy",
          "build",
          "pdf.worker.mjs"
        );
        pdfParseModule.setWorker(pathToFileURL(workerPath).href);
        workerInitialized = true;
      } catch (err) {
        console.warn("Could not set PDF worker path:", err.message);
      }
    }
    return pdfParseModule;
  } catch (err) {
    console.warn("Could not import pdf-parse:", err.message);
    return null;
  }
}

/**
 * Basic pure JS fallback to extract textual strings from raw PDF streams
 */
function extractTextFromPdfBufferFallback(buffer) {
  try {
    const str = buffer.toString("binary");
    const textChunks = [];
    
    // Match text blocks inside BT ... ET operators
    const btRegex = /BT[\s\S]*?ET/g;
    let match;
    while ((match = btRegex.exec(str)) !== null) {
      const block = match[0];
      // Match (text) strings or [(text)-(text)] arrays
      const tjRegex = /\(([^)]*)\)\s*Tj/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        textChunks.push(tjMatch[1]);
      }
      
      const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
      let tjArrMatch;
      while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
        const inner = tjArrMatch[1];
        const innerStrRegex = /\(([^)]*)\)/g;
        let isMatch;
        while ((isMatch = innerStrRegex.exec(inner)) !== null) {
          textChunks.push(isMatch[1]);
        }
      }
    }

    if (textChunks.length > 0) {
      return textChunks.join(" ").replace(/\\r/g, "\n").replace(/\\n/g, "\n").replace(/\\/g, "");
    }
    
    // If no BT/ET blocks matched, attempt printable ASCII extraction
    const printable = buffer.toString("utf8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    const cleanLines = printable
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 15 && !line.startsWith("%") && !line.includes("/Type") && !line.includes("/Font"));
    
    return cleanLines.join("\n");
  } catch (e) {
    console.error("Fallback PDF extraction error:", e);
    return buffer.toString("utf8");
  }
}

/**
 * Robust extraction for any uploaded file (PDF, TXT, MD, etc.)
 */
export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error("No file provided for extraction.");
  }

  const filename = file.name || "uploaded_file";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.length === 0) {
    const error = new Error(`The uploaded file "${filename}" is empty.`);
    error.status = 400;
    throw error;
  }

  // If plain text or markdown, read directly
  if (filename.endsWith(".txt") || filename.endsWith(".md") || file.type?.includes("text/")) {
    return {
      name: filename,
      text: buffer.toString("utf8").trim(),
      pages: 1,
    };
  }

  // Attempt PDF parsing
  try {
    const ParserClass = await getPdfParser();
    if (ParserClass) {
      const parser = new ParserClass({ data: buffer });
      try {
        const parsed = await parser.getText();
        if (parsed && parsed.text && parsed.text.trim().length > 0) {
          return {
            name: filename,
            text: parsed.text.trim(),
            pages: parsed.total || 1,
          };
        }
      } finally {
        if (typeof parser.destroy === "function") {
          await parser.destroy();
        }
      }
    }
  } catch (pdfErr) {
    console.warn(`Standard PDF parsing failed for "${filename}", using resilient fallback:`, pdfErr.message);
  }

  // Resilient pure-JS fallback extraction
  const fallbackText = extractTextFromPdfBufferFallback(buffer);
  return {
    name: filename,
    text: fallbackText.trim() || `Extracted content from ${filename}`,
    pages: 1,
  };
}
