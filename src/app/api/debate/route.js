import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { DEBATE_ENGINE_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { profile, jobDescription, opinions } = await request.json();

    if (!profile || !jobDescription || !opinions) {
      return NextResponse.json(
        { success: false, error: "Missing required inputs for debate engine." },
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

Independent Opinions Generated Before Debate:
"""
${JSON.stringify(opinions, null, 2)}
"""

Please run the debate engine according to your rules.
    `;

    const startedAt = Date.now();
    const debateResult = await callGemini(DEBATE_ENGINE_PROMPT, promptText);
    console.log(`Debate engine completed in ${Date.now() - startedAt}ms`);

    return NextResponse.json({ success: true, data: debateResult });
  } catch (error) {
    console.error("Debate Engine error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to run debate engine." },
      { status: 500 }
    );
  }
}
