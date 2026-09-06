"use client";

export default function ComparisonView({ candidates = [], candidateA, candidateB, onSelectCandidate }) {
  // Normalize candidate list to handle both array and legacy props
  const candidateList = candidates.length > 0 
    ? candidates 
    : [candidateA, candidateB].filter(Boolean).map((c, i) => ({
        ...c,
        name: c.name || `Candidate ${String.fromCharCode(65 + i)}`,
        tag: `Candidate ${String.fromCharCode(65 + i)}`,
      }));

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
    return rank * 1000 + supportedCriteria * 20 + confidence - unresolvedRisks * 15;
  };

  const getEvidenceCount = (candidate) => {
    const decisionEvidence = candidate?.finalDecision?.key_evidence?.length || 0;
    const agentEvidence = Object.values(candidate?.opinions || {}).reduce(
      (total, opinion) => total + (opinion?.evidence?.length || 0),
      0
    );
    return decisionEvidence + agentEvidence;
  };

  const getMustHavesMet = (candidate) => {
    const criteria = candidate?.finalDecision?.decision_criteria || [];
    const met = criteria.filter(c => c.assessment === "Meets").length;
    return `${met}/${criteria.length || 4}`;
  };

  // Sort candidates by score descending
  const rankedCandidates = [...candidateList].sort((a, b) => getDecisionScore(b) - getDecisionScore(a));
  const winner = rankedCandidates[0];
  const runnersUp = rankedCandidates.slice(1);

  const renderBadge = (recommendation) => {
    if (!recommendation) return null;
    const lower = recommendation.toLowerCase();
    let badgeClass = "badge-neutral";
    if (lower.includes("strong hire")) badgeClass = "badge-strong-hire";
    else if (lower.includes("no-hire")) badgeClass = "badge-no-hire";
    else if (lower.includes("leaning hire")) badgeClass = "badge-leaning-hire";
    else if (lower.includes("hire")) badgeClass = "badge-hire";
    
    return <span className={`badge ${badgeClass}`}>{recommendation}</span>;
  };

  return (
    <div className="card comparison-card" style={{ borderColor: "var(--primary)" }}>
      {/* Header */}
      <div className="comparison-heading card-header">
        <div>
          <p className="comparison-eyebrow">Multi-Candidate Panel Deliberation · Comparative Synthesis</p>
          <h2 className="text-2xl font-bold text-primary">Candidate Comparison & Ranking Matrix</h2>
          <p className="text-xs text-muted">
            Evaluated across 4 independent lenses, adversarial debate cross-examination, and decision synthesis.
          </p>
        </div>
        {winner && (
          <div className="comparison-winner">
            <span className="text-xs text-muted font-semibold uppercase">Top Recommended Hire</span>
            <strong className="text-xl text-success">{winner.name}</strong>
            <span className="text-xs text-muted">
              {winner.finalDecision?.final_recommendation || "HIRE"} · {winner.finalDecision?.final_confidence}% Confidence
            </span>
          </div>
        )}
      </div>

      {/* Comparative Verdict Banner */}
      {winner && (
        <div className="comparison-verdict">
          <strong>Panel Synthesis: </strong>
          <span>
            <strong>{winner.name}</strong> achieved the highest panel ranking ({winner.finalDecision?.final_recommendation || "HIRE"}) across the pool of {candidateList.length} candidates.
            {runnersUp.length > 0 && (
              <> Ranking above {runnersUp.map(r => `${r.name} (${r.finalDecision?.final_recommendation || "N/A"})`).join(", ")}. The ranking prioritizes demonstrated evidence, debate resolutions, verified must-haves, and low unresolved risk.</>
            )}
          </span>
        </div>
      )}

      {/* Multi-Candidate Grid */}
      <div className={`grid gap-6 ${candidateList.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {rankedCandidates.map((candidate, idx) => {
          const isTop = idx === 0;
          return (
            <div 
              key={candidate.id || idx} 
              className={`glass-panel comparison-candidate-card ${isTop ? "winner-card" : ""}`}
              style={{ padding: "1.5rem", position: "relative" }}
            >
              <div className="candidate-card-header flex justify-between items-start mb-4">
                <div>
                  <span className={`rank-badge ${isTop ? "rank-top" : ""}`}>
                    Rank #{idx + 1} {isTop ? "· Top Pick" : ""}
                  </span>
                  <h3 className="text-lg font-bold mt-1">{candidate.name}</h3>
                  <span className="text-xs text-muted">{candidate.profile?.basic_info?.current_role || "Candidate Profile"}</span>
                </div>
                <div>
                  {renderBadge(candidate?.finalDecision?.final_recommendation)}
                </div>
              </div>

              <div className="candidate-metrics-grid mb-4">
                <div className="metric-row flex justify-between items-center py-1">
                  <span className="text-sm text-muted">Decision Confidence:</span>
                  <span className="font-bold text-primary">{candidate?.finalDecision?.final_confidence || 0}%</span>
                </div>
                <div className="metric-row flex justify-between items-center py-1">
                  <span className="text-sm text-muted">Must-Haves Met:</span>
                  <span className="font-semibold">{getMustHavesMet(candidate)}</span>
                </div>
                <div className="metric-row flex justify-between items-center py-1">
                  <span className="text-sm text-muted">Citations & Evidence:</span>
                  <span className="font-semibold">{getEvidenceCount(candidate)} items</span>
                </div>
                <div className="metric-row flex justify-between items-center py-1">
                  <span className="text-sm text-muted">Unresolved Risks:</span>
                  <span className={`font-semibold ${candidate?.finalDecision?.unresolved_disagreements?.length ? "text-warning" : "text-success"}`}>
                    {candidate?.finalDecision?.unresolved_disagreements?.length || 0}
                  </span>
                </div>
              </div>

              <div className="candidate-summary-snippet">
                <p className="text-xs text-muted line-clamp-3">
                  {candidate?.finalDecision?.reasoning || "Panel evaluation completed."}
                </p>
              </div>

              {onSelectCandidate && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline mt-4 w-full"
                  onClick={() => onSelectCandidate(candidate.name)}
                >
                  View Full Dossier & Debate →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
