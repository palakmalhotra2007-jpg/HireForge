"use client";
import { useState } from "react";

function FilePicker({ id, label, description, file, featured = false, onChange }) {
  return (
    <div className={`file-field${featured ? " file-field-featured" : ""}`}>
      <label htmlFor={id} className={`file-picker${file ? " file-picker-selected" : ""}`}>
        <span className="file-picker-icon" aria-hidden="true" />
        <span className="file-picker-copy">
          <span className="file-picker-label">{label}</span>
          <span className="file-picker-description">{file ? file.name : description}</span>
        </span>
        <span className="file-picker-action">{file ? "Replace" : "Choose PDF"}</span>
      </label>
      <input
        id={id}
        type="file"
        accept=".pdf,application/pdf"
        className="file-input"
        onChange={onChange}
      />
    </div>
  );
}

export default function UploadScreen({ onStart }) {
  const [files, setFiles] = useState({
    job_description: null,
    candidate_a_resume: null,
    candidate_a_transcript: null,
    candidate_b_resume: null,
    candidate_b_transcript: null,
  });

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const isReady = Object.values(files).every(f => f !== null);

  return (
    <div className="card upload-card animate-fade-in">
      <div className="upload-heading">
        <div>
          <p className="upload-eyebrow">Evaluation workspace</p>
          <h2 className="text-xl">Upload documents</h2>
          <p className="text-muted">Add the five PDFs used by the interview panel.</p>
        </div>
        <span className={`upload-count${isReady ? " upload-count-ready" : ""}`}>
          {Object.values(files).filter(Boolean).length}/5 ready
        </span>
      </div>
      
      <div className="flex flex-col gap-6">
        <FilePicker id="job-description" label="Job description" description="The role requirements and success criteria" file={files.job_description} featured onChange={e => handleFileChange(e, "job_description")} />

        <div className="grid grid-cols-2 gap-6">
          <div className="candidate-upload-panel">
            <div className="candidate-upload-heading">
              <h3 className="text-lg text-primary">Candidate A</h3>
              <span className="candidate-upload-tag">Profile 01</span>
            </div>
            <div className="flex flex-col gap-4">
              <FilePicker id="candidate-a-resume" label="Resume" description="Candidate background and experience" file={files.candidate_a_resume} onChange={e => handleFileChange(e, "candidate_a_resume")} />
              <FilePicker id="candidate-a-transcript" label="Interview transcript" description="Responses from the interview" file={files.candidate_a_transcript} onChange={e => handleFileChange(e, "candidate_a_transcript")} />
            </div>
          </div>

          <div className="candidate-upload-panel">
            <div className="candidate-upload-heading">
              <h3 className="text-lg text-primary">Candidate B</h3>
              <span className="candidate-upload-tag">Profile 02</span>
            </div>
            <div className="flex flex-col gap-4">
              <FilePicker id="candidate-b-resume" label="Resume" description="Candidate background and experience" file={files.candidate_b_resume} onChange={e => handleFileChange(e, "candidate_b_resume")} />
              <FilePicker id="candidate-b-transcript" label="Interview transcript" description="Responses from the interview" file={files.candidate_b_transcript} onChange={e => handleFileChange(e, "candidate_b_transcript")} />
            </div>
          </div>
        </div>

        <div className="upload-submit">
          <button 
            className="btn btn-primary" 
            disabled={!isReady} 
            onClick={() => onStart(files)}
          >
            {isReady ? "Start AI panel evaluation" : "Add all documents to continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
