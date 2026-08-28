"use client";

export default function AnalysisProcess({ currentStep, completedSteps }) {
  const getPhase = (text) => {
    const value = text.toLowerCase();
    if (value.includes("debate")) return "debate";
    if (value.includes("final decision")) return "decision";
    if (value.includes("agent") || value.includes("profile")) return "panel";
    return "intake";
  };
  const activePhase = currentStep ? getPhase(currentStep) : "intake";
  const phases = [
    { id: "intake", number: "01", title: "Evidence intake", detail: "Extract source documents" },
    { id: "panel", number: "02", title: "Independent panel", detail: "Four separate evaluations" },
    { id: "debate", number: "03", title: "Structured debate", detail: "Challenge and resolve key claims" },
    { id: "decision", number: "04", title: "Final decision", detail: "Choose on evidence and risk" },
  ];

  return (
    <div className="card analysis-process animate-fade-in">
      <div className="analysis-process-heading">
        <div>
          <p className="analysis-eyebrow">Evaluation in progress</p>
          <h2 className="text-xl">Analysis process</h2>
        </div>
        <div className="process-icon" style={{ backgroundColor: "var(--primary)", color: "white" }}>
          <span className="spinner"></span>
        </div>
      </div>

      <div className="phase-grid">
        {phases.map(phase => (
          <div key={phase.id} className={`phase-item phase-${phase.id}${activePhase === phase.id ? " phase-active" : ""}`}>
            <span className="phase-number">{phase.number}</span>
            <span className="phase-copy">
              <strong>{phase.title}</strong>
              <span>{phase.detail}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="debate-focus">
        <span className="debate-focus-mark">03</span>
        <div>
          <strong>Debate is the decision checkpoint</strong>
          <p>Agents challenge evidence, answer objections, and record what remains unresolved before the final decision.</p>
        </div>
      </div>

      <div className="process-log">
        <div className="process-log-label">Live activity</div>
        {completedSteps.map((step, idx) => (
          <div key={idx} className="process-step completed animate-fade-in">
            <div className="process-icon">✓</div>
            <span>{step}</span>
          </div>
        ))}
        
        {currentStep && (
          <div className="process-step active animate-fade-in">
            <div className="process-icon">...</div>
            <span>{currentStep}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
