"use client";

export default function EvidenceExplorer({ data }) {
  const { opinions, finalDecision, debateResult } = data;

  // Aggregate all evidence from all agents and final decision
  const allEvidence = [];
  
  if (finalDecision?.key_evidence) {
    finalDecision.key_evidence.forEach(e => allEvidence.push({ ...e, used_by: "Final Decision Engine" }));
  }

  Object.entries(opinions).forEach(([persona, op]) => {
    if (op.evidence) {
      op.evidence.forEach(e => allEvidence.push({ ...e, used_by: `${persona} Agent` }));
    }
  });

  if (finalDecision?.decision_criteria) {
    finalDecision.decision_criteria.forEach(criterion => {
      allEvidence.push({
        claim: criterion.criterion,
        quote: criterion.evidence,
        source: "decision trace",
        reasoning: criterion.debate_impact,
        used_by: "Final Decision Criteria",
      });
    });
  }

  if (debateResult?.issue_resolutions) {
    debateResult.issue_resolutions.forEach(resolution => {
      resolution.evidence_considered?.forEach(quote => {
        allEvidence.push({
          claim: resolution.issue,
          quote,
          source: "debate",
          reasoning: `${resolution.resolution} Impact: ${resolution.decision_impact}`,
          used_by: "Debate Resolution",
        });
      });
    });
  }

  if (allEvidence.length === 0) {
    return <div className="text-muted p-4">No specific evidence items found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg">Evidence Explorer</h3>
      <p className="text-sm text-muted">Trace conclusions back to the source documents.</p>
      
      <div className="flex flex-col gap-4">
        {allEvidence.map((ev, i) => (
          <div key={i} className="glass-panel" style={{ padding: "1.5rem" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-neutral">{ev.source || "Unknown Source"}</span>
              <span className="text-sm text-primary font-bold">Used by: <span className="capitalize">{ev.used_by}</span></span>
            </div>
            
            <h4 className="font-bold mb-2">{ev.claim}</h4>
            
            <div className="bg-black p-4 rounded mb-2 text-sm text-muted" style={{ fontFamily: "monospace" }}>
              &quot;{ev.quote}&quot;
            </div>
            
            <p className="text-sm"><strong>Reasoning:</strong> {ev.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
