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

  // Single candidate mode
  const isSingleCandidate = candidateList.length === 1;

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
          <p className="comparison-eyebrow">
            {isSingleCandidate ? "Single Candidate Panel Deliberation · Individual Assessment" : "Multi-Candidate Panel Deliberation · Comparative Synthesis"}
          </p>
          <h2 className="text-2xl font-bold text-primary">
            {isSingleCandidate ? "Candidate Assessment Report" : "Candidate Comparison & Ranking Matrix"}
          </h2>
          <p className="text-xs text-muted">
            Evaluated across 4 independent lenses, adversarial debate cross-examination, and decision synthesis.
          </p>
        </div>
        {winner && (
          <div className="comparison-winner">
            <span className="text-xs text-muted font-semibold uppercase">
              {isSingleCandidate ? "Overall Assessment" : "Top Recommended Hire"}
            </span>
            <strong className="text-xl text-success">{winner.name}</strong>
            <span className="text-xs text-muted">
              {winner.finalDecision?.final_recommendation || "HIRE"} · {winner.finalDecision?.final_confidence}% Confidence
            </span>
          </div>
        )}
      </div>

      {/* Comparative Verdict Banner */}
      {winner && !isSingleCandidate && (
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

      {/* Single Candidate Assessment Banner */}
      {winner && isSingleCandidate && (
        <div className="comparison-verdict single-candidate-assessment">
          <strong>Individual Assessment Summary: </strong>
          <span>
            <strong>{winner.name}</strong> received a {winner.finalDecision?.final_recommendation || "HIRE"} recommendation with {winner.finalDecision?.final_confidence}% confidence. 
            {" "}The candidate was evaluated on {winner.finalDecision?.decision_criteria?.length || 4} key criteria, 
            meeting {winner.finalDecision?.decision_criteria?.filter(c => c.assessment === "Meets").length || 0} of them.
            {winner.finalDecision?.unresolved_disagreements?.length > 0 ? 
              ` However, ${winner.finalDecision.unresolved_disagreements.length} concern(s) require attention.` : 
              " All evaluator concerns were successfully addressed during panel deliberation."}
          </span>
        </div>
      )}

      {/* Single Candidate Detailed View or Multi-Candidate Grid */}
      {isSingleCandidate ? (
        <div className="single-candidate-detailed-view">
          {rankedCandidates.map((candidate, idx) => {
            const strengthAreas = candidate?.finalDecision?.strengths || [];
            const concernAreas = candidate?.finalDecision?.concerns || [];
            const criteria = candidate?.finalDecision?.decision_criteria || [];
            const metCriteria = criteria.filter(c => c.assessment === "Meets");
            const notMetCriteria = criteria.filter(c => c.assessment !== "Meets");

            return (
              <div key={candidate.id || idx} className="glass-panel single-candidate-panel" style={{ padding: "2rem" }}>
                <div className="single-candidate-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{candidate.name}</h3>
                    <p className="text-sm text-muted mb-3">{candidate.profile?.basic_info?.current_role || "Candidate Profile"}</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.profile?.skills?.slice(0, 5).map((skill, i) => (
                        <span key={i} className="badge badge-neutral text-xs">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="candidate-decision-box glass-panel p-4 min-w-[200px]">
                    <div className="text-center">
                      <div className="text-sm text-muted mb-2">Final Decision</div>
                      {renderBadge(candidate?.finalDecision?.final_recommendation)}
                      <div className="text-3xl font-bold text-primary mt-2">{candidate?.finalDecision?.final_confidence || 0}%</div>
                      <div className="text-xs text-muted mt-1">Confidence</div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="metric-card glass-panel p-4">
                    <div className="text-xs text-muted mb-1">Must-Haves Met</div>
                    <div className="text-2xl font-bold text-primary">{getMustHavesMet(candidate)}</div>
                  </div>
                  <div className="metric-card glass-panel p-4">
                    <div className="text-xs text-muted mb-1">Evidence Items</div>
                    <div className="text-2xl font-bold">{getEvidenceCount(candidate)}</div>
                  </div>
                  <div className="metric-card glass-panel p-4">
                    <div className="text-xs text-muted mb-1">Strengths</div>
                    <div className="text-2xl font-bold text-success">{strengthAreas.length}</div>
                  </div>
                  <div className="metric-card glass-panel p-4">
                    <div className="text-xs text-muted mb-1">Concerns</div>
                    <div className="text-2xl font-bold text-warning">{concernAreas.length}</div>
                  </div>
                </div>

                {/* Standout Areas */}
                <div className="standout-section mb-6">
                  <h4 className="text-lg font-bold mb-3 text-primary">🌟 Where This Candidate Stands Out</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-4 border-l-4 border-success">
                      <h5 className="font-bold text-success mb-2">Key Strengths</h5>
                      <ul className="space-y-2">
                        {strengthAreas.slice(0, 5).map((strength, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-panel p-4 border-l-4 border-warning">
                      <h5 className="font-bold text-warning mb-2">Areas of Concern</h5>
                      <ul className="space-y-2">
                        {concernAreas.length > 0 ? concernAreas.slice(0, 5).map((concern, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <span className="text-warning mr-2">⚠</span>
                            <span>{concern}</span>
                          </li>
                        )) : (
                          <li className="text-sm text-muted italic">No major concerns identified</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Criteria Breakdown */}
                <div className="criteria-breakdown">
                  <h4 className="text-lg font-bold mb-3">Decision Criteria Assessment</h4>
                  <div className="space-y-3">
                    {criteria.map((criterion, i) => (
                      <div key={i} className={`criterion-item glass-panel p-3 border-l-4 ${criterion.assessment === "Meets" ? "border-success" : "border-warning"}`}>
                        <div className="flex justify-between items-start mb-1">
                          <strong className="text-sm">{criterion.criterion}</strong>
                          <span className={`badge text-xs ${criterion.assessment === "Meets" ? "badge-hire" : "badge-warning"}`}>
                            {criterion.assessment}
                          </span>
                        </div>
                        <p className="text-xs text-muted">{criterion.debate_impact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {onSelectCandidate && (
                  <button
                    type="button"
                    className="btn btn-primary mt-6 w-full"
                    onClick={() => onSelectCandidate(candidate.name)}
                  >
                    View Full Evaluation & Debate Transcript →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
}
