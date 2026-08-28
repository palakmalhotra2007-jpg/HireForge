import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { PROFILE_BUILDER_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is not configured. Add it to .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    const { jobDescription, resume, transcript } = await request.json();

    if (!jobDescription || !resume || !transcript) {
      return NextResponse.json(
        { success: false, error: "Missing required texts for profile generation." },
        { status: 400 }
      );
    }

    const promptText = `
Job Description:
"""
${jobDescription}
"""

Candidate Resume:
"""
${resume}
"""

Candidate Interview Transcript:
"""
${transcript}
"""
    `;

    const profile = await callGemini(PROFILE_BUILDER_PROMPT, promptText);

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile Builder error:", error);
    const isQuotaError = error?.status === 429 || error?.message?.includes('"code":429');
    const errorMessage = isQuotaError
      ? "Gemini API quota is exhausted. Wait for the quota reset or use an API key with billing enabled."
      : error.message || "Failed to build candidate profile.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: isQuotaError ? 429 : 500 }
    );
  }
}
