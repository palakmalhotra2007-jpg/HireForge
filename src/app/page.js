"use client";

import { useState } from "react";
import UploadScreen from "@/components/UploadScreen";
import AnalysisProcess from "@/components/AnalysisProcess";
import CandidateDashboard from "@/components/CandidateDashboard";
import ComparisonView from "@/components/ComparisonView";

export default function Home() {
  const [pipelineState, setPipelineState] = useState("upload"); // upload, processing, results
  const [files, setFiles] = useState(null);
  const [results, setResults] = useState({
    candidateA: null,
    candidateB: null,
  });
  
  // Track granular steps for UI
  const [currentStep, setCurrentStep] = useState("");
  const [completedSteps, setCompletedSteps] = useState([]);

  const addCompletedStep = (step) => {
    setCompletedSteps(prev => [...prev, step]);
  };

  const timedFetch = async (label, url, options) => {
    const startedAt = performance.now();
    const response = await fetch(url, options);
    const elapsedSeconds = ((performance.now() - startedAt) / 1000).toFixed(1);
    console.info(`${label} completed in ${elapsedSeconds}s`);
    return response;
  };

  const runPipeline = async (uploadedFiles) => {
    setFiles(uploadedFiles);
    setPipelineState("processing");
    setCompletedSteps([]);
    
    try {
      // 1. Extract Documents
      setCurrentStep("Extracting text from documents...");
      const formData = new FormData();
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const extractRes = await timedFetch("Document extraction", "/api/extract", { method: "POST", body: formData });
      const extractData = await extractRes.json();
      if (!extractRes.ok || !extractData.success) {
        throw new Error(extractData.error || "Extraction failed");
      }
      const docs = extractData.data;
      addCompletedStep("Documents processed");

      // Evaluate both candidates concurrently; each candidate still runs its own
      // profile, independent agents, debate, and final decision sequence.
      const [candAResult, candBResult] = await Promise.all([
        processCandidate(
          "Candidate A",
          docs.job_description?.text,
          docs.candidate_a_resume?.text,
          docs.candidate_a_transcript?.text
        ),
        processCandidate(
          "Candidate B",
          docs.job_description?.text,
          docs.candidate_b_resume?.text,
          docs.candidate_b_transcript?.text
        ),
      ]);

      setResults({
        candidateA: candAResult,
        candidateB: candBResult,
      });

      setPipelineState("results");
    } catch (error) {
      console.error(error);
      alert("Pipeline failed: " + error.message);
      setPipelineState("upload");
    }
  };

  const processCandidate = async (name, jd, resume, transcript) => {
    if (!resume || !transcript) return null;
    
    setCurrentStep(`[${name}] Generating Candidate Profile...`);
    const profileRes = await timedFetch(`${name} profile`, "/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jd, resume, transcript })
    });
    const profileData = await profileRes.json();
    if (!profileRes.ok || !profileData.success || !profileData.data) {
      throw new Error(profileData.error || `${name} profile generation failed`);
    }
    const profile = profileData.data;
    addCompletedStep(`[${name}] Candidate Profile generated`);

    // Run Agents Independently in parallel
    setCurrentStep(`[${name}] Running Independent Agents...`);
    const personas = ["technical", "hr", "manager", "skeptic"];
    const agentPromises = personas.map(p => 
      timedFetch(`${name} ${p} agent`, "/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: p, profile, resume, transcript, jobDescription: jd })
      }).then(res => res.json())
    );

    const agentResults = await Promise.all(agentPromises);
    const failedAgent = agentResults.find(result => !result.success || !result.data);
    if (failedAgent) {
      throw new Error(failedAgent.error || `${name} agent evaluation failed`);
    }
    const opinions = {};
    agentResults.forEach(res => {
      opinions[res.persona] = res.data;
      addCompletedStep(`[${name}] ${res.persona} Agent completed`);
    });
    addCompletedStep(`[${name}] Independent opinions locked`);

    // Run Debate
    setCurrentStep(`[${name}] Running Debate Engine...`);
    const debateRes = await timedFetch(`${name} debate`, "/api/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, jobDescription: jd, opinions })
    });
    const debateData = await debateRes.json();
    if (!debateRes.ok || !debateData.success || !debateData.data) {
      throw new Error(debateData.error || `${name} debate failed`);
    }
    const debateResult = debateData.data;
    addCompletedStep(`[${name}] Debate finished (${debateResult.debate?.length || 0} rounds)`);
    if (debateResult.opinion_changes && debateResult.opinion_changes.length > 0) {
      addCompletedStep(`[${name}] Opinions changed based on debate!`);
    }

    // Final Decision
    setCurrentStep(`[${name}] Generating Final Decision...`);
    const finalRes = await timedFetch(`${name} final decision`, "/api/final-decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, jobDescription: jd, opinions, debateResult })
    });
    const finalData = await finalRes.json();
    if (!finalRes.ok || !finalData.success || !finalData.data) {
      throw new Error(finalData.error || `${name} final decision failed`);
    }
    addCompletedStep(`[${name}] Final decision generated`);
    
    return {
      profile,
      opinions,
      debateResult,
      finalDecision: finalData.data
    };
  };

  return (
    <div className="container">
      <header className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h1 className="text-2xl text-primary">AI Interview Panel Simulator</h1>
        <p className="text-muted">Multi-Agent Candidate Evaluation System</p>
      </header>

      {pipelineState === "upload" && <UploadScreen onStart={runPipeline} />}
      
      {pipelineState === "processing" && (
        <AnalysisProcess currentStep={currentStep} completedSteps={completedSteps} />
      )}
      
      {pipelineState === "results" && (
        <div className="flex flex-col gap-8 animate-fade-in">
          {results.candidateA && results.candidateB && (
            <ComparisonView candidateA={results.candidateA} candidateB={results.candidateB} />
          )}
          
          {results.candidateA && (
            <CandidateDashboard name="Candidate A" data={results.candidateA} />
          )}
          
          {results.candidateB && (
            <CandidateDashboard name="Candidate B" data={results.candidateB} />
          )}
        </div>
      )}
    </div>
  );
}
