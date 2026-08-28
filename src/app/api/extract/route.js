import path from "node:path";
import { pathToFileURL } from "node:url";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const workerPath = path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs");
PDFParse.setWorker(pathToFileURL(workerPath).href);

export async function POST(request) {
  try {
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

    for (const key of fileKeys) {
      const file = formData.get(key);
      if (!file || typeof file === 'string') {
        extractedData[key] = null;
        continue;
      }

      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
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
      { success: false, error: "Failed to extract text from PDFs." },
      { status: 500 }
    );
  }
}
