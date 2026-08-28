import concurrent.futures
import os
from typing import Any

import requests
import streamlit as st


API_BASE_URL = os.getenv("INTERVIEW_PANEL_API_URL", "http://localhost:3000").rstrip("/")
FILE_KEYS = {
    "job_description": "Job description",
    "candidate_a_resume": "Candidate A resume",
    "candidate_a_transcript": "Candidate A interview transcript",
    "candidate_b_resume": "Candidate B resume",
    "candidate_b_transcript": "Candidate B interview transcript",
}


def api_error(response: requests.Response, fallback: str) -> str:
    try:
        payload = response.json()
        return payload.get("error", fallback)
    except ValueError:
        return fallback


def post_json(path: str, payload: dict[str, Any], timeout: int = 90) -> dict[str, Any]:
    response = requests.post(f"{API_BASE_URL}{path}", json=payload, timeout=timeout)
    if not response.ok:
        raise RuntimeError(api_error(response, f"Request failed: {path}"))
    data = response.json()
    if not data.get("success") or not data.get("data"):
        raise RuntimeError(data.get("error", f"Request failed: {path}"))
    return data["data"]


def extract_documents(files: dict[str, Any]) -> dict[str, Any]:
    multipart = {
        key: (file.name, file.getvalue(), "application/pdf")
        for key, file in files.items()
    }
    response = requests.post(f"{API_BASE_URL}/api/extract", files=multipart, timeout=90)
    if not response.ok:
        raise RuntimeError(api_error(response, "Document extraction failed."))
    data = response.json()
    if not data.get("success"):
        raise RuntimeError(data.get("error", "Document extraction failed."))
    return data["data"]


def evaluate_candidate(name: str, docs: dict[str, Any]) -> dict[str, Any]:
    prefix = name.lower().replace(" ", "_")
    profile = post_json(
        "/api/profile",
        {
            "jobDescription": docs["job_description"]["text"],
            "resume": docs[f"{prefix}_resume"]["text"],
            "transcript": docs[f"{prefix}_transcript"]["text"],
        },
    )
    personas = ["technical", "hr", "manager", "skeptic"]
    agent_payload = {
        "profile": profile,
        "resume": docs[f"{prefix}_resume"]["text"],
        "transcript": docs[f"{prefix}_transcript"]["text"],
        "jobDescription": docs["job_description"]["text"],
    }
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(post_json, "/api/agents", {**agent_payload, "persona": persona}): persona
            for persona in personas
        }
        opinions = {}
        for future in concurrent.futures.as_completed(futures):
            persona = futures[future]
            opinions[persona] = future.result()

    debate = post_json(
        "/api/debate",
        {
            "profile": profile,
            "jobDescription": docs["job_description"]["text"],
            "opinions": opinions,
        },
        timeout=120,
    )
    final_decision = post_json(
        "/api/final-decision",
        {
            "profile": profile,
            "jobDescription": docs["job_description"]["text"],
            "opinions": opinions,
            "debateResult": debate,
        },
    )
    return {"profile": profile, "opinions": opinions, "debateResult": debate, "finalDecision": final_decision}


def recommendation_rank(candidate: dict[str, Any]) -> tuple[int, int]:
    ranks = {
        "STRONG HIRE": 6,
        "HIRE": 5,
        "LEANING HIRE": 4,
        "LEANING NO-HIRE": 3,
        "NO-HIRE": 2,
        "INSUFFICIENT EVIDENCE": 1,
    }
    decision = candidate.get("finalDecision", {})
    return ranks.get(decision.get("final_recommendation"), 0), int(decision.get("final_confidence") or 0)


def render_candidate(name: str, result: dict[str, Any]) -> None:
    decision = result["finalDecision"]
    st.subheader(name)
    st.metric("Recommendation", decision.get("final_recommendation", "Unavailable"), f"{decision.get('final_confidence', 0)}% confidence")
    with st.expander("Decision criteria and reasoning", expanded=True):
        st.write(decision.get("reasoning", "No reasoning returned."))
        for criterion in decision.get("decision_criteria", []):
            st.markdown(f"**{criterion.get('criterion', 'Criterion')}**: {criterion.get('assessment', 'Unknown')}")
            st.caption(criterion.get("debate_impact", "No debate impact recorded."))
    with st.expander("Structured debate", expanded=True):
        for resolution in result["debateResult"].get("issue_resolutions", []):
            st.markdown(f"**{resolution.get('issue', 'Issue')}** · `{resolution.get('status', 'unresolved')}`")
            st.write(resolution.get("resolution", "No resolution recorded."))
            st.caption(f"Impact: {resolution.get('decision_impact', 'Not recorded')}")
        for message in result["debateResult"].get("debate", []):
            st.markdown(f"**Round {message.get('round', '?')} · {message.get('speaker', 'Agent')}**")
            st.write(message.get("message", ""))
            if message.get("evidence"):
                st.caption(f"Evidence: {message['evidence']}")
    with st.expander("Evidence trail"):
        for evidence in decision.get("key_evidence", []):
            st.markdown(f"**{evidence.get('claim', 'Claim')}**")
            st.code(evidence.get("quote", "No direct evidence provided."))
            st.caption(evidence.get("reasoning", ""))


def main() -> None:
    st.set_page_config(page_title="AI Interview Panel Simulator", page_icon=":mag:", layout="wide")
    st.title("AI Interview Panel Simulator")
    st.caption("Evidence intake → independent panel → structured debate → one-seat decision")

    with st.sidebar:
        st.header("Evaluation setup")
        st.info("The Streamlit interface reuses the existing Next.js API and keeps all four evaluators independent.")
        st.caption(f"API: {API_BASE_URL}")

    uploaded = {}
    for key, label in FILE_KEYS.items():
        uploaded[key] = st.file_uploader(label, type=["pdf"], key=key)

    ready = all(uploaded.values())
    if not ready:
        st.warning("Upload all five PDF documents to begin.")
        return

    if st.button("Run interview panel", type="primary", use_container_width=True):
        try:
            with st.status("Running evidence-first evaluation", expanded=True) as status:
                st.write("Evidence intake: extracting PDFs")
                docs = extract_documents(uploaded)
                st.write("Independent panel: running four evaluators per candidate")
                with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                    futures = {
                        executor.submit(evaluate_candidate, name, docs): name
                        for name in ["Candidate A", "Candidate B"]
                    }
                    results = {}
                    for future in concurrent.futures.as_completed(futures):
                        name = futures[future]
                        results[name] = future.result()
                        st.write(f"{name}: complete")
                status.update(label="Evaluation complete", state="complete", expanded=False)
            st.session_state["results"] = results
        except Exception as error:
            st.error(str(error))

    results = st.session_state.get("results")
    if not results:
        return

    candidate_a = results["Candidate A"]
    candidate_b = results["Candidate B"]
    recommended_name = "Candidate A" if recommendation_rank(candidate_a) >= recommendation_rank(candidate_b) else "Candidate B"
    st.success(f"Recommended hire for the single opening: {recommended_name}")
    st.caption("Relative comparison prioritizes recommendation strength, then confidence. Individual evidence remains visible below.")
    left, right = st.columns(2)
    with left:
        render_candidate("Candidate A", candidate_a)
    with right:
        render_candidate("Candidate B", candidate_b)


if __name__ == "__main__":
    main()
