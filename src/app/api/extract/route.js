import path from "node:path";
import { pathToFileURL } from "node:url";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";
export const maxDuration = 60;

let workerConfigured = false;

function configurePdfWorker() {
  if (workerConfigured) return;

  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs"
  );
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  workerConfigured = true;
}

async function extractFile(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    const error = new Error(`The uploaded file for ${file.name} is empty.`);
    error.status = 400;
    throw error;
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const parsed = await parser.getText();
    return {
      name: file.name,
      text: parsed.text,
      pages: parsed.total,
    };
  } finally {
    await parser.destroy();
  }
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

    const extractedEntries = await Promise.all(
      fileKeys.map(async (key) => [key, await extractFile(formData.get(key))])
    );
    for (const [key, data] of extractedEntries) extractedData[key] = data;

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error) {
    console.error("PDF Extraction error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to extract text from PDFs." },
      { status: error?.status || 500 }
    );
  }
}
