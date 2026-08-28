import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import {
  TECHNICAL_AGENT_PROMPT,
  HR_AGENT_PROMPT,
  MANAGER_AGENT_PROMPT,
  SKEPTIC_AGENT_PROMPT
} from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { persona, profile, resume, transcript, jobDescription } = await request.json();

    if (!persona || !profile || !resume || !transcript || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Missing required inputs for agent evaluation." },
        { status: 400 }
      );
    }

    let systemPrompt = "";
    switch (persona) {
      case "technical":
        systemPrompt = TECHNICAL_AGENT_PROMPT;
        break;
      case "hr":
        systemPrompt = HR_AGENT_PROMPT;
        break;
      case "manager":
        systemPrompt = MANAGER_AGENT_PROMPT;
        break;
      case "skeptic":
        systemPrompt = SKEPTIC_AGENT_PROMPT;
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid persona specified." },
          { status: 400 }
        );
    }

    const promptText = `
Job Description:
"""
${jobDescription}
"""

Candidate Profile (Shared Context):
"""
${JSON.stringify(profile, null, 2)}
"""

Candidate Resume:
"""
${resume}
"""

Candidate Interview Transcript:
"""
${transcript}
"""

Please evaluate the candidate according to your Persona rules.
    `;

    const opinion = await callGemini(systemPrompt, promptText);

    return NextResponse.json({ success: true, data: opinion, persona });
  } catch (error) {
    console.error(`Agent (${persona}) error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to generate agent opinion." },
      { status: 500 }
    );
  }
}
