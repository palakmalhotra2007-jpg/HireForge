import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/pdf-parser";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle JSON payloads (e.g. pre-extracted or direct text)
    if (contentType.includes("application/json")) {
      const json = await request.json();
      return NextResponse.json({ success: true, data: json });
    }

    const formData = await request.formData();

    // Check for job_description
    const jdFile = formData.get("job_description");
    if (!jdFile || typeof jdFile === "string") {
      return NextResponse.json(
        { success: false, error: "Missing PDF files: job_description." },
        { status: 400 }
      );
    }

    const extractedData = {};
    const extractedJd = await extractTextFromFile(jdFile);
    extractedData.job_description = extractedJd;

    // Check if this is legacy candidate_a/candidate_b format or dynamic candidate_N format
    const legacyKeys = [
      "candidate_a_resume",
      "candidate_a_transcript",
      "candidate_b_resume",
      "candidate_b_transcript"
    ];

    const hasLegacyKeys = legacyKeys.some(k => formData.has(k));
    const dynamicCandidateIndices = new Set();

    for (const key of formData.keys()) {
      const match = key.match(/^candidate_(\d+)_(resume|transcript|name)$/);
      if (match) {
        dynamicCandidateIndices.add(parseInt(match[1], 10));
      }
    }

    // Process legacy format if present
    if (hasLegacyKeys) {
      const missingLegacy = legacyKeys.filter(key => {
        const file = formData.get(key);
        return !file || typeof file === "string";
      });

      if (missingLegacy.length > 0) {
        return NextResponse.json(
          { success: false, error: `Missing PDF files: ${missingLegacy.join(", ")}.` },
          { status: 400 }
        );
      }

      for (const key of legacyKeys) {
        const file = formData.get(key);
        extractedData[key] = await extractTextFromFile(file);
      }

      // Structure legacy into candidate list too
      extractedData.candidates = [
        {
          id: "candidate-a",
          name: "Candidate A",
          resume: extractedData.candidate_a_resume,
          transcript: extractedData.candidate_a_transcript
        },
        {
          id: "candidate-b",
          name: "Candidate B",
          resume: extractedData.candidate_b_resume,
          transcript: extractedData.candidate_b_transcript
        }
      ];
    } else if (dynamicCandidateIndices.size > 0) {
      // Process dynamic N-candidates format
      const sortedIndices = Array.from(dynamicCandidateIndices).sort((a, b) => a - b);
      const candidates = [];

      for (const idx of sortedIndices) {
        const resumeFile = formData.get(`candidate_${idx}_resume`);
        const transcriptFile = formData.get(`candidate_${idx}_transcript`);
        const nameVal = formData.get(`candidate_${idx}_name`) || `Candidate ${String.fromCharCode(65 + idx)}`;

        if (!resumeFile || typeof resumeFile === "string" || !transcriptFile || typeof transcriptFile === "string") {
          return NextResponse.json(
            { success: false, error: `Missing files for Candidate ${idx + 1}. Both Resume and Transcript are required.` },
            { status: 400 }
          );
        }

        const resumeExtracted = await extractTextFromFile(resumeFile);
        const transcriptExtracted = await extractTextFromFile(transcriptFile);

        candidates.push({
          id: `candidate-${idx}`,
          name: typeof nameVal === "string" ? nameVal : `Candidate ${String.fromCharCode(65 + idx)}`,
          resume: resumeExtracted,
          transcript: transcriptExtracted
        });
      }

      extractedData.candidates = candidates;
      // Populate legacy aliases for first 2 if exists
      if (candidates[0]) {
        extractedData.candidate_a_resume = candidates[0].resume;
        extractedData.candidate_a_transcript = candidates[0].transcript;
      }
      if (candidates[1]) {
        extractedData.candidate_b_resume = candidates[1].resume;
        extractedData.candidate_b_transcript = candidates[1].transcript;
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Missing candidate files. Please provide at least 2 candidates." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error) {
    console.error("PDF Extraction error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to extract text from PDFs." },
      { status: error?.status || 500 }
    );
  }
}
