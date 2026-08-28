"use client";

export default function ComparisonView({ candidateA, candidateB }) {
  const recommendationRank = {
    "STRONG HIRE": 6,
    HIRE: 5,
    "LEANING HIRE": 4,
    "LEANING NO-HIRE": 3,
    "NO-HIRE": 2,
    "INSUFFICIENT EVIDENCE": 1,
  };

  const getDecisionScore = (candidate) => {
    const decision = candidate?.finalDecision;
    const rank = recommendationRank[decision?.final_recommendation] || 0;
    const confidence = Number(decision?.final_confidence) || 0;
    const criteria = decision?.decision_criteria || [];
    const supportedCriteria = criteria.filter(item => item.assessment === "Meets").length;
    const unresolvedRisks = decision?.unresolved_disagreements?.length || 0;
    return rank * 1000 + supportedCriteria * 10 + confidence - unresolvedRisks;
  };

  const getEvidenceCount = (candidate) => {
    const decisionEvidence = candidate?.finalDecision?.key_evidence?.length || 0;
    const agentEvidence = Object.values(candidate?.opinions || {}).reduce(
      (total, opinion) => total + (opinion?.evidence?.length || 0),
      0
    );
    return decisionEvidence + agentEvidence;
  };

  const candidateAWins = getDecisionScore(candidateA) >= getDecisionScore(candidateB);
  const recommendedName = candidateAWins ? "Candidate A" : "Candidate B";
  const recommendedCandidate = candidateAWins ? candidateA : candidateB;
  const otherCandidate = candidateAWins ? candidateB : candidateA;

  const renderBadge = (recommendation) => {
    if (!recommendation) return null;
    const lower = recommendation.toLowerCase();
    let badgeClass = "badge-neutral";
    if (lower.includes("no-hire")) badgeClass = "badge-no-hire";
    else if (lower.includes("leaning hire")) badgeClass = "badge-leaning-hire";
    else if (lower.includes("hire")) badgeClass = "badge-hire";
    
    return <span className={`badge ${badgeClass}`}>{recommendation}</span>;
  };

  return (
    <div className="card" style={{ borderColor: "var(--primary)" }}>
      <div className="comparison-heading card-header">
        <div>
          <p className="comparison-eyebrow">One role · comparative decision</p>
          <h2 className="text-xl font-bold text-primary">Candidate comparison</h2>
        </div>
        <div className="comparison-winner">
          <span className="text-sm text-muted">Recommended hire</span>
          <strong>{recommendedName}</strong>
          <span className="text-xs text-muted">Stronger relative fit for this opening</span>
        </div>
      </div>

      <div className="comparison-verdict">
        <strong>{recommendedName}</strong> is the stronger choice for the single available role. Their panel outcome ({recommendedCandidate?.finalDecision?.final_recommendation || "not available"}) ranks above {otherCandidate === candidateA ? "Candidate A" : "Candidate B"}&apos;s outcome. The comparison prioritizes recommendation strength, then must-have criteria met, confidence, and unresolved risk.
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 className="text-lg font-bold mb-4">Candidate A</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted">Recommendation:</span>
            {renderBadge(candidateA?.finalDecision?.final_recommendation)}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted">Confidence:</span>
            <span className="font-bold text-primary">{candidateA?.finalDecision?.final_confidence}%</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted">Evidence items:</span>
            <span className="font-bold">{getEvidenceCount(candidateA)}</span>
          </div>
          <p className="text-sm text-muted line-clamp-3">
            {candidateA?.finalDecision?.reasoning}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 className="text-lg font-bold mb-4">Candidate B</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted">Recommendation:</span>
            {renderBadge(candidateB?.finalDecision?.final_recommendation)}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted">Confidence:</span>
            <span className="font-bold text-primary">{candidateB?.finalDecision?.final_confidence}%</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted">Evidence items:</span>
            <span className="font-bold">{getEvidenceCount(candidateB)}</span>
          </div>
          <p className="text-sm text-muted line-clamp-3">
            {candidateB?.finalDecision?.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
