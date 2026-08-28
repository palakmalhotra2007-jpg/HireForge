import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { FINAL_DECISION_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { profile, jobDescription, opinions, debateResult } = await request.json();

    if (!profile || !jobDescription || !opinions || !debateResult) {
      return NextResponse.json(
        { success: false, error: "Missing required inputs for final decision." },
        { status: 400 }
      );
    }

    const promptText = `
Job Description:
"""
${jobDescription}
"""

Candidate Profile:
"""
${JSON.stringify(profile, null, 2)}
"""

Initial Independent Opinions:
"""
${JSON.stringify(opinions, null, 2)}
"""

Debate Transcript & Opinion Changes:
"""
${JSON.stringify(debateResult, null, 2)}
"""

Please make the final hiring decision according to your rules.
    `;

    const finalDecision = await callGemini(FINAL_DECISION_PROMPT, promptText);

    return NextResponse.json({ success: true, data: finalDecision });
  } catch (error) {
    console.error("Final Decision Engine error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run final decision engine." },
      { status: 500 }
    );
  }
}
