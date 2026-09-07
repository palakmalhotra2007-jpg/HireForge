"use client";
import { useState } from "react";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_CANDIDATE_A, SAMPLE_CANDIDATE_B, SAMPLE_CANDIDATE_C } from "@/lib/sample-data";

function FilePicker({ id, label, description, file, textContent, featured = false, onChange, onClear }) {
  const handleLabelClick = (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
    const input = document.getElementById(id);
    if (input) input.click();
  };

  const isSelected = Boolean(file || textContent);
  const displayDesc = file ? file.name : (textContent ? "Text loaded from sample data" : description);

  return (
    <div className={`file-field${featured ? " file-field-featured" : ""}`}>
      <label
        htmlFor={id}
        className={`file-picker${isSelected ? " file-picker-selected" : ""}`}
        onClick={handleLabelClick}
      >
        <span className="file-picker-icon" aria-hidden="true" />
        <span className="file-picker-copy">
          <span className="file-picker-label">{label}</span>
          <span className="file-picker-description">{displayDesc}</span>
        </span>
        <span className="file-picker-action">{isSelected ? "Replace" : "Choose PDF / TXT"}</span>
        <input
          id={id}
          type="file"
          accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
          className="file-input"
          onChange={onChange}
        />
      </label>
    </div>
  );
}

export default function UploadScreen({ onStart, onInstantSimulation }) {
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");

  const [candidates, setCandidates] = useState([
    {
      id: "candidate-0",
      name: "Rohan Malhotra",
      tag: "Candidate A",
      resumeFile: null,
      resumeText: "",
      transcriptFile: null,
      transcriptText: "",
    },
    {
      id: "candidate-1",
      name: "Ananya Iyer",
      tag: "Candidate B",
      resumeFile: null,
      resumeText: "",
      transcriptFile: null,
      transcriptText: "",
    },
  ]);

  const handleAddCandidate = () => {
    const nextIdx = candidates.length;
    const letter = String.fromCharCode(65 + nextIdx);
    setCandidates(prev => [
      ...prev,
      {
        id: `candidate-${Date.now()}`,
        name: `Candidate ${letter}`,
        tag: `Candidate ${letter}`,
        resumeFile: null,
        resumeText: "",
        transcriptFile: null,
        transcriptText: "",
      }
    ]);
  };

  const handleRemoveCandidate = (index) => {
    if (candidates.length <= 1) return;
    setCandidates(prev => prev.filter((_, i) => i !== index));
  };

  const handleCandidateNameChange = (index, name) => {
    setCandidates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const handleCandidateFileChange = (index, field, e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setCandidates(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [`${field}File`]: file,
        [`${field}Text`]: "", // file overrides text
      };
      return updated;
    });
    e.target.value = "";
  };

  const handleLoadSampleData = (includeThird = false) => {
    setJobDescriptionFile(null);
    setJobDescriptionText(SAMPLE_JOB_DESCRIPTION);

    const baseCandidates = [
      {
        id: "candidate-0",
        name: SAMPLE_CANDIDATE_A.name,
        tag: "Candidate A",
        resumeFile: null,
        resumeText: SAMPLE_CANDIDATE_A.resume,
        transcriptFile: null,
        transcriptText: SAMPLE_CANDIDATE_A.transcript,
      },
      {
        id: "candidate-1",
        name: SAMPLE_CANDIDATE_B.name,
        tag: "Candidate B",
        resumeFile: null,
        resumeText: SAMPLE_CANDIDATE_B.resume,
        transcriptFile: null,
        transcriptText: SAMPLE_CANDIDATE_B.transcript,
      }
    ];

    if (includeThird) {
      baseCandidates.push({
        id: "candidate-2",
        name: SAMPLE_CANDIDATE_C.name,
        tag: "Candidate C",
        resumeFile: null,
        resumeText: SAMPLE_CANDIDATE_C.resume,
        transcriptFile: null,
        transcriptText: SAMPLE_CANDIDATE_C.transcript,
      });
    }

    setCandidates(baseCandidates);
  };

  const isJdReady = Boolean(jobDescriptionFile || jobDescriptionText);
  const readyCandidatesCount = candidates.filter(
    c => (c.resumeFile || c.resumeText) && (c.transcriptFile || c.transcriptText)
  ).length;
  const isAllReady = isJdReady && readyCandidatesCount >= 1 && readyCandidatesCount === candidates.length;

  const handleStartEvaluation = (instant = false) => {
    const payload = {
      jobDescription: {
        file: jobDescriptionFile,
        text: jobDescriptionText,
      },
      candidates: candidates.map(c => ({
        id: c.id,
        name: c.name,
        tag: c.tag,
        resume: { file: c.resumeFile, text: c.resumeText },
        transcript: { file: c.transcriptFile, text: c.transcriptText },
      }))
    };

    if (instant) {
      onInstantSimulation(payload);
    } else {
      onStart(payload);
    }
  };

  return (
    <div className="setup-page animate-fade-in">
      <section className="setup-stepper" aria-label="Evaluation setup progress">
        {[
          ["01", "Role specification"],
          ["02", "Candidate records"],
          ["03", "Evaluator panel"],
          ["04", "Final deliberation"],
        ].map(([number, label], index) => (
          <div className="setup-step" key={number}>
            <div className={`setup-step-marker${index === 0 ? " setup-step-active" : ""}`}>
              {number}
            </div>
            <div>
              <span className="setup-step-number">Step {number}</span>
              <strong>{label}</strong>
            </div>
            {index < 3 && <span className="setup-step-line" aria-hidden="true" />}
          </div>
        ))}
      </section>

      <section className="setup-intro">
        <div className="setup-intro-meta">
          <span>New evaluation · sequence 01/04</span>
          <span className="setup-id">ID: EVAL-89241</span>
        </div>
        <h2>Step 1 of 4: Set up candidate evaluation</h2>
        <p>Upload the role specification and candidate records. HireForge will reconcile the evidence before dispatching the evaluator panel.</p>
      </section>

      <section className="setup-context">
        <div className="setup-section-label">Context envelope</div>
        <div className="setup-context-grid">
          <div className="setup-context-item">
            <span className="setup-context-icon">R</span>
            <div><strong>Role specification</strong><span>{isJdReady ? "Role requirements loaded" : "JD upload pending"}</span></div>
          </div>
          <div className="setup-context-item">
            <span className="setup-context-icon">C</span>
            <div><strong>{candidates.length} candidate dossiers</strong><span>{readyCandidatesCount} ready for evaluation</span></div>
          </div>
        </div>
      </section>

      <section className="setup-panel">
        <div className="setup-panel-heading">
          <div>
            <span className="setup-section-label">01 · Role specification</span>
            <h3>Upload the job description</h3>
          </div>
          <span className={`setup-status${isJdReady ? " setup-status-ready" : ""}`}>{isJdReady ? "Ready" : "Required"}</span>
        </div>
        <FilePicker
          id="job-description"
          label="Job description"
          description="Role requirements, technical must-haves, and success criteria"
          file={jobDescriptionFile}
          textContent={jobDescriptionText}
          featured
          onChange={e => {
            const file = e.target.files?.[0] || null;
            setJobDescriptionFile(file);
            setJobDescriptionText("");
            e.target.value = "";
          }}
        />
      </section>

      <section className="setup-panel">
        <div className="setup-panel-heading">
          <div>
            <span className="setup-section-label">02 · Candidate records</span>
            <h3>Resume and interview transcript</h3>
          </div>
          <button type="button" className="btn btn-sm btn-secondary" onClick={handleAddCandidate}>+ Add candidate</button>
        </div>

        <div className="setup-candidates">
          {candidates.map((cand, idx) => {
            const isCandReady = Boolean((cand.resumeFile || cand.resumeText) && (cand.transcriptFile || cand.transcriptText));
            return (
              <div key={cand.id} className={`candidate-upload-panel setup-candidate${isCandReady ? " candidate-ready" : ""}`}>
                <div className="candidate-upload-heading">
                  <div className="setup-candidate-title">
                    <span className="setup-candidate-number">0{idx + 1}</span>
                    <input
                      type="text"
                      className="candidate-name-input"
                      value={cand.name}
                      onChange={e => handleCandidateNameChange(idx, e.target.value)}
                      placeholder={`Candidate ${String.fromCharCode(65 + idx)} Name`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`candidate-upload-tag${isCandReady ? " setup-status-ready" : ""}`}>{isCandReady ? "Ready" : "Pending"}</span>
                    {candidates.length > 1 && <button type="button" className="btn-remove-candidate" title="Remove candidate" onClick={() => handleRemoveCandidate(idx)}>×</button>}
                  </div>
                </div>
                <div className="setup-file-stack">
                  <FilePicker id={`candidate-${idx}-resume`} label="Resume" description="Work experience & technical background" file={cand.resumeFile} textContent={cand.resumeText} onChange={e => handleCandidateFileChange(idx, "resume", e)} />
                  <FilePicker id={`candidate-${idx}-transcript`} label="Interview transcript" description="Verbatim interview responses & Q&A" file={cand.transcriptFile} textContent={cand.transcriptText} onChange={e => handleCandidateFileChange(idx, "transcript", e)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="setup-demo-row">
        <div><span className="setup-section-label">Benchmark workspace</span><strong>Preloaded sample candidates</strong><span>Use the existing benchmark records to preview the full panel.</span></div>
        <div className="sample-loader-actions">
          <button type="button" className="btn btn-sm btn-outline" onClick={() => handleLoadSampleData(false)}>Load 2 demos</button>
          <button type="button" className="btn btn-sm btn-outline" onClick={() => handleLoadSampleData(true)}>Load 3 demos</button>
        </div>
      </section>

      <section className="setup-actions upload-actions">
        <button type="button" className="btn btn-primary" disabled={!isAllReady} onClick={() => handleStartEvaluation(false)}>
          {isAllReady ? `Continue to evaluator panel (${candidates.length})` : "Add all documents to continue"}
        </button>
        <button type="button" className="btn btn-instant" onClick={() => { if (!jobDescriptionText && !jobDescriptionFile) handleLoadSampleData(candidates.length >= 3); handleStartEvaluation(true); }} title="Instant multi-agent deliberation simulation with precomputed evidence">
          Instant simulation
        </button>
      </section>
    </div>
  );
}
