import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import {
  TECHNICAL_AGENT_PROMPT,
  HR_AGENT_PROMPT,
  MANAGER_AGENT_PROMPT,
  SKEPTIC_AGENT_PROMPT
} from "@/lib/prompts";

const AGENT_PROMPTS = {
  technical: TECHNICAL_AGENT_PROMPT,
  hr: HR_AGENT_PROMPT,
  manager: MANAGER_AGENT_PROMPT,
  skeptic: SKEPTIC_AGENT_PROMPT
};

export const maxDuration = 60;

export async function POST(request) {
  let persona;

  try {
    const requestBody = await request.json();
    ({ persona } = requestBody);
    const { profile, resume, transcript, jobDescription } = requestBody;

    if (!persona || !profile || !resume || !transcript || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Missing required inputs for agent evaluation." },
        { status: 400 }
      );
    }

    const systemPrompt = AGENT_PROMPTS[persona];
    if (!systemPrompt) {
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
