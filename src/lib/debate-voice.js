export function getDebateVoiceProfile(speaker = "") {
  const normalized = speaker.toLowerCase();

  if (normalized.includes("technical")) return { pitch: 1.1, rate: 0.92 };
  if (normalized.includes("adversarial") || normalized.includes("auditor")) return { pitch: 0.92, rate: 0.9 };
  if (normalized.includes("people") || normalized.includes("collaboration")) return { pitch: 1.2, rate: 0.96 };
  if (normalized.includes("hiring") || normalized.includes("manager")) return { pitch: 0.98, rate: 0.94 };

  return { pitch: 1.0, rate: 0.95 };
}

export function buildDebateSpeechScript(debateResult = {}) {
  const debateEntries = Array.isArray(debateResult?.debate) ? debateResult.debate : [];

  if (!debateEntries.length) {
    return 'The debate transcript is empty.';
  }

  return debateEntries
    .map((entry, index) => {
      const round = entry?.round ?? index + 1;
      const speaker = entry?.speaker || 'Panelist';
      const responseTarget = entry?.responding_to ? ` I am responding to ${entry.responding_to}.` : '';
      const issue = entry?.issue ? ` The issue is ${entry.issue}.` : '';
      const message = entry?.message ? entry.message.trim() : '';
      const normalizedMessage = message && !/^I\b|^My\b|^I am\b|^I believe\b|^I think\b|^I want\b|^I would\b|^I see\b/.test(message)
        ? ` I believe ${message.charAt(0).toLowerCase()}${message.slice(1)}`
        : ` ${message}`;
      const evidence = entry?.evidence ? ` My evidence is ${entry.evidence}.` : '';

      return `Round ${round}. ${speaker}: ${responseTarget}${issue}${normalizedMessage}${evidence}`;
    })
    .join(' ');
}
