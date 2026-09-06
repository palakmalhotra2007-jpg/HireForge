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
    if (candidates.length <= 2) return;
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
  const isAllReady = isJdReady && readyCandidatesCount >= 2 && readyCandidatesCount === candidates.length;

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
    <div className="card upload-card animate-fade-in">
      <div className="upload-heading">
        <div>
          <p className="upload-eyebrow">Evidence-Led Hiring Workspace</p>
          <h2 className="text-xl">Candidate Evaluation & Deliberation Panel</h2>
          <p className="text-muted">
            Upload documents for 2 or more candidates (PDF, TXT, MD) or use preloaded sample data.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`upload-count${isAllReady ? " upload-count-ready" : ""}`}>
            {readyCandidatesCount}/{candidates.length} candidates ready
          </span>
          <span className="text-xs text-muted">{candidates.length} candidates configured</span>
        </div>
      </div>

      {/* Quick Sample Loader Banner */}
      <div className="sample-loader-banner glass-panel">
        <div className="sample-loader-info">
          <span className="sample-badge">⚡ Demo Candidates</span>
          <div>
            <strong>Preloaded Benchmark Candidates:</strong>
            <p className="text-xs text-muted">
              Rohan Malhotra (Senior AI/Backend Engineer) & Ananya Iyer (Backend → AI Engineer)
            </p>
          </div>
        </div>
        <div className="sample-loader-actions">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => handleLoadSampleData(false)}
          >
            Load 2 Demo Candidates
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => handleLoadSampleData(true)}
          >
            Load 3 Candidates (+ Vikram)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Job Description */}
        <div className="jd-section">
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
        </div>

        {/* Dynamic Candidates Grid */}
        <div className="candidates-section">
          <div className="section-heading">
            <div>
              <h3 className="text-lg text-primary">Candidate Dossiers</h3>
              <p className="text-xs text-muted">Upload Resume and Interview Transcript for each candidate</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleAddCandidate}
            >
              + Add Candidate
            </button>
          </div>

          <div className={`grid gap-6 ${candidates.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {candidates.map((cand, idx) => {
              const isCandReady = Boolean((cand.resumeFile || cand.resumeText) && (cand.transcriptFile || cand.transcriptText));
              return (
                <div key={cand.id} className={`candidate-upload-panel ${isCandReady ? "candidate-ready" : ""}`}>
                  <div className="candidate-upload-heading">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        className="candidate-name-input"
                        value={cand.name}
                        onChange={e => handleCandidateNameChange(idx, e.target.value)}
                        placeholder={`Candidate ${String.fromCharCode(65 + idx)} Name`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="candidate-upload-tag">Profile 0{idx + 1}</span>
                      {candidates.length > 2 && (
                        <button
                          type="button"
                          className="btn-remove-candidate"
                          title="Remove candidate"
                          onClick={() => handleRemoveCandidate(idx)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <FilePicker
                      id={`candidate-${idx}-resume`}
                      label="Resume"
                      description="Work experience & technical background"
                      file={cand.resumeFile}
                      textContent={cand.resumeText}
                      onChange={e => handleCandidateFileChange(idx, "resume", e)}
                    />
                    <FilePicker
                      id={`candidate-${idx}-transcript`}
                      label="Interview transcript"
                      description="Verbatim interview responses & Q&A"
                      file={cand.transcriptFile}
                      textContent={cand.transcriptText}
                      onChange={e => handleCandidateFileChange(idx, "transcript", e)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="upload-actions flex gap-4">
          <button
            type="button"
            className="btn btn-primary flex-1"
            disabled={!isAllReady}
            onClick={() => handleStartEvaluation(false)}
          >
            {isAllReady
              ? `Start AI Panel Evaluation (${candidates.length} Candidates)`
              : "Add all documents to continue"}
          </button>
          
          <button
            type="button"
            className="btn btn-instant"
            onClick={() => {
              if (!jobDescriptionText && !jobDescriptionFile) {
                handleLoadSampleData(candidates.length >= 3);
              }
              handleStartEvaluation(true);
            }}
            title="Instant multi-agent deliberation simulation with precomputed evidence"
          >
            ⚡ Instant Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
