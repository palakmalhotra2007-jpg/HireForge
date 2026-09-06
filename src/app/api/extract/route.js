import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";
export const maxDuration = 60;

const require = createRequire(import.meta.url);
let workerConfigured = false;

function configurePdfWorker() {
  if (workerConfigured) return;

  const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  workerConfigured = true;
}

export async function POST(request) {
  try {
    configurePdfWorker();

    const formData = await request.formData();

    // We expect 5 files: job_description, candidate_a_resume, candidate_a_transcript, candidate_b_resume, candidate_b_transcript
    const extractedData = {};
    const fileKeys = [
      "job_description",
      "candidate_a_resume",
      "candidate_a_transcript",
      "candidate_b_resume",
      "candidate_b_transcript"
    ];

    const missingFiles = fileKeys.filter((key) => {
      const file = formData.get(key);
      return !file || typeof file === "string";
    });

    if (missingFiles.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing PDF files: ${missingFiles.join(", ")}.` },
        { status: 400 }
      );
    }

    for (const key of fileKeys) {
      const file = formData.get(key);

      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      if (buffer.length === 0) {
        return NextResponse.json(
          { success: false, error: `The uploaded file for ${key} is empty.` },
          { status: 400 }
        );
      }
      
      // Parse PDF
      const parser = new PDFParse({ data: buffer });
      try {
        const parsed = await parser.getText();
        extractedData[key] = {
          name: file.name,
          text: parsed.text,
          pages: parsed.total,
        };
      } finally {
        await parser.destroy();
      }
    }

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error) {
    console.error("PDF Extraction error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to extract text from PDFs." },
      { status: 500 }
    );
  }
}
