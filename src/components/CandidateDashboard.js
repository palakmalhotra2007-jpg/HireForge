"use client";
import { useState } from "react";
import EvidenceExplorer from "./EvidenceExplorer";

export default function CandidateDashboard({ name, data }) {
  const [activeTab, setActiveTab] = useState("overview");

  const { profile, opinions, debateResult, finalDecision } = data;

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
    <div className="card animate-fade-in" style={{ borderColor: "var(--primary)" }}>
      <div className="card-header flex items-center justify-between">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted">Final Decision</div>
            <div className="text-xl font-bold">{renderBadge(finalDecision?.final_recommendation)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted">Confidence</div>
            <div className="text-xl font-bold text-primary">{finalDecision?.final_confidence}%</div>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label={`${name} analysis views`} className="flex gap-4 mb-6" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
          {["overview", "debate", "panel", "evidence", "profile"].map(tab => (
          <button 
            key={tab}
            id={`tab-${name.replace(/\s+/g, '-').toLowerCase()}-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${name.replace(/\s+/g, '-').toLowerCase()}-${tab}`}
            className={`btn ${activeTab === tab ? "text-primary font-bold" : "text-muted"}`}
            style={{ padding: "0.5rem", background: "transparent" }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div 
          role="tabpanel" 
          id={`panel-${name.replace(/\s+/g, '-').toLowerCase()}-overview`} 
          aria-labelledby={`tab-${name.replace(/\s+/g, '-').toLowerCase()}-overview`} 
          className="grid grid-cols-2 gap-8"
        >
          <div className="flex flex-col gap-4">
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <h3 className="text-lg text-success mb-2">Strengths</h3>
              <ul style={{ paddingLeft: "1.2rem" }}>
                {finalDecision?.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <h3 className="text-lg text-warning mb-2">Concerns</h3>
              <ul style={{ paddingLeft: "1.2rem" }}>
                {finalDecision?.concerns?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="text-lg mb-2">Final Reasoning</h3>
            <p className="text-muted">{finalDecision?.reasoning}</p>

            {finalDecision?.decision_criteria?.length > 0 && (
              <div className="decision-criteria">
                <h4 className="text-primary mb-2">Decision criteria</h4>
                <div className="flex flex-col gap-2">
                  {finalDecision.decision_criteria.map((criterion, i) => (
                    <div key={i} className="decision-criterion">
                      <div className="flex justify-between gap-2">
                        <strong>{criterion.criterion}</strong>
                        <span className="text-sm text-muted">{criterion.assessment}</span>
                      </div>
                      <p className="text-sm text-muted">{criterion.debate_impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {finalDecision?.unresolved_disagreements?.length > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                <h4 className="text-danger mb-2">Unresolved Disagreements</h4>
                <ul style={{ paddingLeft: "1.2rem" }} className="text-sm">
                  {finalDecision.unresolved_disagreements.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div 
          role="tabpanel" 
          id={`panel-${name.replace(/\s+/g, '-').toLowerCase()}-profile`} 
          aria-labelledby={`tab-${name.replace(/\s+/g, '-').toLowerCase()}-profile`} 
          className="flex flex-col gap-6"
        >
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="text-lg mb-4">Basic Info</h3>
            <p><strong>Role:</strong> {profile?.basic_info?.current_role}</p>
            <p><strong>Experience:</strong> {profile?.basic_info?.years_of_experience}</p>
            <p><strong>Education:</strong> {profile?.basic_info?.education}</p>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="text-lg mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((s, i) => (
                <span key={i} className="badge badge-neutral">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "panel" && (
        <div 
          role="tabpanel" 
          id={`panel-${name.replace(/\s+/g, '-').toLowerCase()}-panel`} 
          aria-labelledby={`tab-${name.replace(/\s+/g, '-').toLowerCase()}-panel`}
        >
          <h3 className="text-lg mb-4">Independent Opinions (Before Debate)</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(opinions).map(([persona, op]) => (
              <div key={persona} className="glass-panel" style={{ padding: "1rem" }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold capitalize">{persona} Agent</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">{op.confidence}%</span>
                    {renderBadge(op.recommendation)}
                  </div>
                </div>
                <p className="text-sm text-muted">{op.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "debate" && (
        <div 
          role="tabpanel" 
          id={`panel-${name.replace(/\s+/g, '-').toLowerCase()}-debate`} 
          aria-labelledby={`tab-${name.replace(/\s+/g, '-').toLowerCase()}-debate`} 
          className="flex flex-col gap-6"
        >
          {debateResult?.issue_resolutions?.length > 0 && (
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <h3 className="text-lg mb-4">Decision-critical issues</h3>
              <div className="flex flex-col gap-4">
                {debateResult.issue_resolutions.map((resolution, i) => (
                  <div key={i} className="debate-resolution">
                    <div className="flex justify-between gap-2">
                      <h4>{resolution.issue}</h4>
                      <span className="badge badge-neutral">{resolution.status}</span>
                    </div>
                    <p className="text-sm text-muted">{resolution.resolution}</p>
                    <p className="text-sm text-primary">Impact: {resolution.decision_impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="text-lg mb-4">Debate transcript</h3>
            <div className="flex flex-col gap-4">
              {debateResult?.debate?.map((msg, i) => (
                <div key={i} style={{ borderLeft: "3px solid var(--primary)", paddingLeft: "1rem" }}>
                  <div className="text-sm text-muted mb-1 font-bold">Round {msg.round || i + 1} · {msg.speaker} {msg.responding_to ? `→ ${msg.responding_to}` : ""}</div>
                  {msg.issue && <div className="text-xs text-primary mb-1">{msg.issue}</div>}
                  <p>{msg.message}</p>
                  {msg.evidence && (
                    <div className="mt-2 text-xs text-muted bg-black p-2 rounded">
                      <em>&quot;{msg.evidence}&quot;</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {debateResult?.opinion_changes?.length > 0 && (
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <h3 className="text-lg mb-4">Opinion Changes</h3>
              <div className="flex flex-col gap-4">
                {debateResult.opinion_changes.map((change, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="font-bold">{change.agent}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="line-through text-muted">{change.old_recommendation} ({change.old_confidence}%)</span>
                      <span>→</span>
                      <span className="text-primary">{change.new_recommendation} ({change.new_confidence}%)</span>
                    </div>
                    <p className="text-sm text-muted">{change.change_reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "evidence" && (
        <div 
          role="tabpanel" 
          id={`panel-${name.replace(/\s+/g, '-').toLowerCase()}-evidence`} 
          aria-labelledby={`tab-${name.replace(/\s+/g, '-').toLowerCase()}-evidence`}
        >
          <EvidenceExplorer data={data} />
        </div>
      )}
    </div>
  );
}
