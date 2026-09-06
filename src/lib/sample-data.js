/**
 * Preloaded Sample Data & Resilient Evaluation Engine
 * Contains verbatim resumes, interview transcripts, and complete panel evaluations
 * for Rohan Malhotra (Candidate A), Ananya Iyer (Candidate B), and Vikram Sen (Candidate C).
 */

export const SAMPLE_JOB_DESCRIPTION = `
Position: Senior AI / Backend Engineer (Agent Systems & Platform)
Company: Voltrix / Nexus AI Logistics
Location: Remote / Hybrid

About the Role:
We are looking for a Senior AI/Backend Engineer to architect, build, and maintain production-grade multi-agent orchestration systems and reliable backend microservices. You will lead our core agent exception-handling platform that autonomously processes complex logistics, freight data, rate sheets, and carrier workflows.

Must-Have Requirements:
1. Production Multi-Agent Systems: Hands-on experience designing and operating multi-agent LLM workflows (planner-executor-reviewer architectures, LangGraph, CrewAI, or AutoGen).
2. Production Reliability & Ownership: Track record of taking full ownership of production outages, on-call support, pre-deploy evaluation benchmarks, and self-healing error recovery.
3. Model Routing & Cost Efficiency: Experience optimizing prompt architectures and routing requests intelligently between large reasoning models (e.g. GPT-4) and fast open-weight SLMs.
4. Robust Backend & Data Pipelines: Proficiency in Python (FastAPI), vector databases (Chroma, Pinecone, FAISS), RAG retrieval, and OCR ingestion pipelines.
5. High-Integrity Engineering & Collaboration: Clear, evidence-based technical communication, honest assessment of architectural trade-offs, and strong incident post-mortem practices.
`.trim();

export const SAMPLE_CANDIDATE_A = {
  id: "candidate-a",
  name: "Rohan Malhotra",
  role: "Senior AI/Backend Engineer",
  tag: "Candidate A",
  resume: `
Rohan Malhotra
Senior AI/Backend Engineer

Summary
AI engineer with 3.5 years of experience building multi-agent LLM systems and Python backends. Led design of a production agent platform now handling thousands of daily freight exceptions. Known for moving fast and shipping under pressure.

Experience
Senior AI Engineer — Voltrix Logistics Tech (Jan 2025 – Present, 7 months)
• Designed and built the exception-handling engine end-to-end for Voltrix's multi-agent freight ops platform (planner/executor/reviewer pattern), cutting manual exception review time by 40%.
• Owned prompt design and model routing across GPT-4 and open-weight SLMs, reducing inference cost by ~30%.
• Sole architect of the retry/escalation logic now running in production, handling 5,000+ freight exceptions/month.
• Presented the system design at a company-wide tech talk.

AI Engineer — Quickship Data Systems (Feb 2024 – Dec 2024, 11 months)
• Built a RAG pipeline over carrier rate documents using LangChain + Pinecone, cutting manual rate lookup time significantly.
• Improved BOL/invoice extraction accuracy through better OCR pre-processing.

Backend Developer — Nimbus Cloud Solutions (Aug 2022 – Jan 2024, 1.5 years)
• Built Python microservices for a SaaS analytics product used by 50+ enterprise clients.
• Led a 4-person team migrating a legacy monolith to microservices.

Skills
Python, FastAPI, LangGraph, CrewAI, MongoDB, React (basic), RAG, Vector Search (Pinecone, FAISS), Prompt Engineering, Docker, Kubernetes

Education
B.Tech Computer Science, 2022

Certifications
• LangChain for LLM Application Development (2024)
`.trim(),
  transcript: `
Interview Transcript — Candidate A (Rohan Malhotra)
Technical Section
Q1 (Interviewer): Walk me through the exception-handling engine you built at Voltrix.
A1: It's planner-executor-reviewer. Failures come in, get classified, retried or escalated, then double-checked. I designed the whole retry/escalation logic.
Q2: What made you choose that structure over a simpler rule-based system?
A2: Rules don't scale. Too many failure types — timeouts, bad EDI, missing BOL fields. Agents handle that better.
Q3: How do you measure whether the reviewer agent is actually catching real problems?
A3: We track override rate. It's low. I'd have to check the exact number though, haven't looked recently.
Q4: What's your approach to model routing?
A4: Cost-based. Simple stuff to the SLM, harder reasoning to GPT-4. No formal study, just tuned it as things broke.

Behavioral Section
Q5 (Interviewer): Tell me about a time you disagreed with a teammate on a technical decision.
A5: Teammate wanted to hardcode more categories up front. I pushed for the agent approach. We went with mine.
Q6: Who actually wrote the retry/escalation logic that's in production now?
A6: I designed it. Priya did a lot of the implementation, I reviewed her PRs. I was the architect.
Q7 (Skeptic follow-up): Your resume says “sole architect.” But it sounds like Priya built a lot of it. Can you clarify?
A7: Fine — “sole architect” is probably too strong. I led the design, she built most of the production version.

Ownership / Hiring Manager Section
Q8: Why should we invest in ramping you up here versus someone with more freight-domain experience?
A8: I move fast. I've built something structurally close to this already. I don't think I'd need much ramp time.
Q9: This role needs long-term ownership of production reliability. How do you feel about being on-call for agent failures?
A9: Fine, I've done on-call before. Though Voltrix's user base is still small, so I haven't seen serious incident volume yet.
Q10: You've had three roles in 3.5 years, each under a year except the first. What's driving that?
A10: Better pay and title, mostly. Voltrix is more aligned with what I want long-term.
`.trim(),
  precomputed: {
    profile: {
      basic_info: {
        name: "Rohan Malhotra",
        education: "B.Tech Computer Science, 2022",
        current_role: "Senior AI Engineer — Voltrix Logistics Tech",
        years_of_experience: "3.5 years"
      },
      skills: ["Python", "FastAPI", "LangGraph", "CrewAI", "RAG", "Vector Search (Pinecone, FAISS)", "Prompt Engineering", "Docker", "Kubernetes", "MongoDB"],
      experience: [
        {
          company: "Voltrix Logistics Tech",
          role: "Senior AI Engineer",
          responsibilities: ["Designed exception-handling engine with planner/executor/reviewer pattern", "Managed prompt design and model routing across GPT-4 and SLMs"],
          achievements: ["Reduced manual exception review time by 40%", "Reduced inference costs by ~30%"]
        },
        {
          company: "Quickship Data Systems",
          role: "AI Engineer",
          responsibilities: ["Built RAG pipeline over carrier rate documents with LangChain and Pinecone"],
          achievements: ["Improved BOL/invoice extraction accuracy via OCR preprocessing"]
        },
        {
          company: "Nimbus Cloud Solutions",
          role: "Backend Developer",
          responsibilities: ["Built Python microservices", "Led team migrating legacy monolith"],
          achievements: ["Supported 50+ enterprise SaaS clients"]
        }
      ],
      candidate_claims: [
        {
          claim: "Sole architect of the retry/escalation logic handling 5,000+ freight exceptions/month",
          source: "resume",
          quote: "Sole architect of the retry/escalation logic now running in production, handling 5,000+ freight exceptions/month.",
          page: "Resume p.1",
          evidence_status: "contradicted"
        },
        {
          claim: "Multi-agent architecture experience with planner/executor/reviewer",
          source: "transcript",
          quote: "It's planner-executor-reviewer. Failures come in, get classified, retried or escalated, then double-checked.",
          page: "Transcript Q1",
          evidence_status: "supported"
        }
      ]
    },
    opinions: {
      technical: {
        recommendation: "LEANING HIRE",
        confidence: 76,
        strengths: [
          "Demonstrated direct architectural experience with planner-executor-reviewer multi-agent systems",
          "Practical implementation of cost-based routing between SLMs and GPT-4",
          "Solid foundation in modern Python backend infrastructure (FastAPI, Docker, Kubernetes)"
        ],
        concerns: [
          "Admitted to lack of formal evaluation benchmarks: 'No formal study, just tuned it as things broke'",
          "Vague operational telemetry on reviewer agent efficacy: 'haven't looked recently'"
        ],
        evidence: [
          {
            claim: "Multi-agent design knowledge",
            quote: "It's planner-executor-reviewer. Failures come in, get classified, retried or escalated, then double-checked.",
            source: "transcript",
            reasoning: "Demonstrates practical familiarity with agent decomposition patterns required by the role."
          },
          {
            claim: "Informal model tuning without rigorous evaluation",
            quote: "Simple stuff to the SLM, harder reasoning to GPT-4. No formal study, just tuned it as things broke.",
            source: "transcript",
            reasoning: "Shows rapid execution but indicates potential fragility in high-scale production systems."
          }
        ],
        reasoning: "Rohan possesses direct experience with the target multi-agent architecture (planner/executor/reviewer) and model routing. However, his approach to tuning and verification is reactive rather than metric-driven."
      },
      hr: {
        recommendation: "LEANING NO-HIRE",
        confidence: 74,
        strengths: [
          "Direct and candid when asked about career motivations (seeking compensation and title growth)",
          "Confident communication style during technical explanation"
        ],
        concerns: [
          "Resume claim attribution issue: Claimed 'sole architect' on resume but transcript conceded teammate Priya wrote most production code",
          "Short tenure patterns: 3 roles in 3.5 years with under a year in multiple positions",
          "Limited evidence of mentorship or empathetic team collaboration"
        ],
        evidence: [
          {
            claim: "Attribution inflation on resume",
            quote: "Fine — 'sole architect' is probably too strong. I led the design, she built most of the production version.",
            source: "transcript",
            reasoning: "Highlights a material disconnect between resume positioning and actual collaborative reality."
          },
          {
            claim: "Frequent job movement",
            quote: "Better pay and title, mostly. Voltrix is more aligned with what I want long-term.",
            source: "transcript",
            reasoning: "Signals potential retention and commitment risk for a mission-critical platform role."
          }
        ],
        reasoning: "While technically capable, the candidate's admission of overstating his sole contribution and frequent job transitions suggest collaboration and retention risks that require close consideration."
      },
      manager: {
        recommendation: "LEANING HIRE",
        confidence: 70,
        strengths: [
          "Zero ramp-up required on the core architectural paradigm (planner-executor-reviewer)",
          "Proven bias for speed: 'I move fast. I've built something structurally close to this already'",
          "Experience navigating freight exception domain concepts (EDI, BOL fields)"
        ],
        concerns: [
          "Untested on high-volume production incidents: 'Voltrix's user base is still small, so I haven't seen serious incident volume yet'",
          "Risk of early departure given 3 roles in 3.5 years"
        ],
        evidence: [
          {
            claim: "Fast ramp on day one",
            quote: "I move fast. I've built something structurally close to this already. I don't think I'd need much ramp time.",
            source: "transcript",
            reasoning: "Directly addresses the immediate business need for rapid delivery on multi-agent platform."
          },
          {
            claim: "Limited exposure to scale incidents",
            quote: "Voltrix's user base is still small, so I haven't seen serious incident volume yet.",
            source: "transcript",
            reasoning: "Creates execution risk if production failures occur at high enterprise traffic."
          }
        ],
        reasoning: "From an execution standpoint, Rohan can deliver value immediately without ramp time. The key manager risk is whether his reliability practices will withstand enterprise scale and whether he will stay long-term."
      },
      skeptic: {
        recommendation: "NO-HIRE",
        confidence: 85,
        strengths: [
          "Has indeed worked within a multi-agent framework codebase"
        ],
        concerns: [
          "Resume claims are substantially inflated: Resume states 'Sole architect of the retry/escalation logic', transcript refutes this",
          "Lack of rigorous observability: Does not know reviewer agent override rate and tuned routing only as things broke",
          "Low reliability maturity: Has not managed high-volume incidents and relies on ad-hoc adjustments"
        ],
        evidence: [
          {
            claim: "Falsified claim of sole authorship",
            quote: "I designed it. Priya did a lot of the implementation, I reviewed her PRs... Fine — 'sole architect' is probably too strong.",
            source: "transcript",
            reasoning: "Direct contradiction between written credentials and verified interview evidence."
          },
          {
            claim: "Lack of observability metrics",
            quote: "We track override rate. It's low. I'd have to check the exact number though, haven't looked recently.",
            source: "transcript",
            reasoning: "Fails to provide verification for the core reliability mechanism of the multi-agent system."
          }
        ],
        reasoning: "Audit reveals significant claim inflation on the resume and a reactive engineering approach without formal benchmarks or telemetry tracking. The risk of unverified reliability in production is high."
      }
    },
    debateResult: {
      debate: [
        {
          round: 1,
          issue: "Resume Attribution vs Actual Implementation Scope",
          speaker: "Evidence Auditor",
          message: "The candidate's resume explicitly claims 'Sole architect of the retry/escalation logic'. However, in Q6-Q7 he acknowledged that Priya wrote the production implementation while he reviewed PRs. This is a material overstatement of ownership.",
          responding_to: null,
          evidence: "Fine — 'sole architect' is probably too strong. I led the design, she built most of the production version.",
          stance: "opening"
        },
        {
          round: 1,
          issue: "Resume Attribution vs Actual Implementation Scope",
          speaker: "Hiring Manager Evaluator",
          message: "While 'sole architect' was an exaggeration, leading the system design and conducting PR reviews still represents valid high-level architectural experience that our team needs on day one.",
          responding_to: "Evidence Auditor",
          evidence: "I designed it. Priya did a lot of the implementation, I reviewed her PRs. I was the architect.",
          stance: "challenging"
        },
        {
          round: 2,
          issue: "Production Reliability & Evaluation Rigor",
          speaker: "Technical Evaluator",
          message: "My concern is less about the title wording and more about engineering rigor. Rohan admits he had 'no formal study' for model routing and hasn't checked the reviewer override rate recently.",
          responding_to: "Hiring Manager Evaluator",
          evidence: "Simple stuff to the SLM, harder reasoning to GPT-4. No formal study, just tuned it as things broke.",
          stance: "challenging"
        },
        {
          round: 2,
          issue: "Production Reliability & Evaluation Rigor",
          speaker: "People & Collaboration Evaluator",
          message: "I agree with Technical and Skeptic. A candidate who takes credit for a teammate's implementation while operating without structured pre-deploy checks or incident retros introduces cultural and operational vulnerability.",
          responding_to: "Technical Evaluator",
          evidence: "Teammate wanted to hardcode more categories up front. I pushed for the agent approach. We went with mine.",
          stance: "responding"
        },
        {
          round: 3,
          issue: "Final Panel Calibration",
          speaker: "Senior Deliberation Chair",
          message: "The panel agrees Rohan has multi-agent design familiarity, but his claims of sole implementation and enterprise reliability are unverified and partially contradicted.",
          responding_to: null,
          evidence: "Voltrix's user base is still small, so I haven't seen serious incident volume yet.",
          stance: "resolving"
        }
      ],
      issue_resolutions: [
        {
          issue: "Sole Architect Claim on Resume",
          status: "contradicted",
          evidence_considered: ["Fine — 'sole architect' is probably too strong. I led the design, she built most of the production version."],
          resolution: "Rohan did not build the production retry/escalation engine alone; he co-designed it with colleague Priya who wrote the majority of production code.",
          decision_impact: "Lowers confidence in candidate's independent production delivery depth and creates integrity concerns."
        },
        {
          issue: "Production Multi-Agent Reliability Rigor",
          status: "partially supported",
          evidence_considered: ["No formal study, just tuned it as things broke.", "We track override rate. It's low. I'd have to check the exact number though"],
          resolution: "Rohan understands agent architecture conceptually, but his operational methodology lacks formal evaluation metrics and proactive reliability engineering.",
          decision_impact: "Requires senior oversight if hired to avoid brittle prompt routing failures."
        }
      ],
      opinion_changes: [
        {
          agent: "Hiring Manager Evaluator",
          old_recommendation: "LEANING HIRE",
          new_recommendation: "LEANING NO-HIRE",
          old_confidence: 70,
          new_confidence: 78,
          change_reason: "Acknowledged that overstating implementation ownership combined with untested incident volume presents significant risk to production reliability."
        },
        {
          agent: "Technical Evaluator",
          old_recommendation: "LEANING HIRE",
          new_recommendation: "LEANING NO-HIRE",
          old_confidence: 76,
          new_confidence: 82,
          change_reason: "Shifted position after examining the absence of evaluation benchmarks and reactive 'tune as things break' philosophy."
        }
      ]
    },
    finalDecision: {
      final_recommendation: "LEANING NO-HIRE",
      final_confidence: 80,
      decision_criteria: [
        {
          criterion: "Production Multi-Agent Architecture Experience",
          assessment: "Partially meets",
          evidence: "It's planner-executor-reviewer. Failures come in, get classified, retried or escalated, then double-checked.",
          debate_impact: "Debate established architectural familiarity exists, but implementation was primarily executed by teammate Priya."
        },
        {
          criterion: "Production Reliability & Incident Ownership",
          assessment: "Does not meet",
          evidence: "Voltrix's user base is still small, so I haven't seen serious incident volume yet.",
          debate_impact: "Candidate lacks deep incident experience and does not maintain structured evaluation benchmarks."
        },
        {
          criterion: "Model Routing & Cost Optimization",
          assessment: "Partially meets",
          evidence: "Cost-based. Simple stuff to the SLM, harder reasoning to GPT-4. No formal study, just tuned it as things broke.",
          debate_impact: "Demonstrated basic concept but lacks disciplined benchmarking."
        },
        {
          criterion: "Integrity & Accurate Technical Communication",
          assessment: "Does not meet",
          evidence: "Fine — 'sole architect' is probably too strong. I led the design, she built most of the production version.",
          debate_impact: "Auditor proved resume claim overstatement, unanimously resolved in debate."
        }
      ],
      strengths: [
        "Familiarity with planner-executor-reviewer agent design patterns",
        "Fast mover with appetite for cutting-edge LLM frameworks",
        "Experience configuring cost-differentiated model routing"
      ],
      concerns: [
        "Material overstatement on resume regarding sole authorship of core platform",
        "Reactive engineering approach without formal benchmarks ('tuned it as things broke')",
        "Tenure instability (3 jobs in 3.5 years) and unverified incident management at scale"
      ],
      unresolved_disagreements: [
        "Whether Rohan's design contributions without primary coding provide enough foundation to lead the new agent system independently."
      ],
      reasoning: "While Rohan Malhotra has direct exposure to multi-agent frameworks, the deliberation revealed significant risks: resume claim inflation regarding sole platform authorship, lack of structured eval benchmarks, and unproven reliability at high volume. The panel concluded he is a LEANING NO-HIRE for a senior role requiring rigorous platform ownership.",
      key_evidence: [
        {
          claim: "Attribution inflation on resume",
          quote: "Fine — 'sole architect' is probably too strong. I led the design, she built most of the production version.",
          source: "transcript",
          reasoning: "Direct contradiction of core resume bullet point."
        },
        {
          claim: "Unmeasured system metrics",
          quote: "We track override rate. It's low. I'd have to check the exact number though, haven't looked recently.",
          source: "transcript",
          reasoning: "Demonstrates gap in operational telemetry tracking."
        }
      ]
    }
  }
};

export const SAMPLE_CANDIDATE_B = {
  id: "candidate-b",
  name: "Ananya Iyer",
  role: "Software Engineer (Backend → AI)",
  tag: "Candidate B",
  resume: `
Ananya Iyer
Software Engineer (Backend → AI)

Summary
Backend engineer with steady experience maintaining internal tools, recently moved into applied AI work. Comfortable with Python and standard web APIs; still building depth in AI-specific tooling.

Experience
Software Engineer II — Bridgepoint Systems (Jun 2021 – Present, 4 years)
• Maintains Python/FastAPI microservices for an internal ops platform used by a few internal teams.
• Helped migrate part of the document ingestion pipeline to use OCR-based extraction for scanned forms.
• Over the last 1.5 years, started building an internal RAG-based support-ticket assistant: set up a retrieval pipeline (LangChain + Chroma); team estimated answer accuracy improved by around 40% based on informal review.
• After a production incident (see interview), introduced a pre-deploy checklist for prompt changes that the team adopted.

Junior Backend Developer — Bridgepoint Systems (Jul 2019 – Jun 2021, 2 years)
• Built basic REST APIs for internal tooling.
• Worked with QA and product to define API contracts.

Skills
Python, FastAPI, MongoDB, PostgreSQL, LangChain, Chroma, basic React, OCR pipelines (Tesseract), Docker

Education
B.E. Information Technology, 2019

Note
Has not used multi-agent orchestration frameworks (LangGraph, CrewAI, AutoGen) in production — most LLM work to date has been a single-agent RAG pipeline.
`.trim(),
  transcript: `
Interview Transcript — Candidate B (Ananya Iyer)
Technical Section
Q1 (Interviewer): Tell me about the RAG pipeline you built for the support-ticket assistant.
A1: Sure — happy to walk through it step by step. We retrieve from a Chroma vector store built from past resolved tickets and internal docs. The top few matches get passed to the LLM, which drafts a response for a human agent to review before it goes out. We chunked documents by section rather than fixed length, since that kept related context together.
Q2: Your resume mentions a ~40% accuracy improvement. How was that measured?
A2: I want to be upfront about this — it was based on internal review, not a formal benchmark. A few of us spot-checked a sample of responses before and after the change and it felt clearly better, but I wouldn't want to present that number as something rigorous if it comes up again.
Q3: Have you worked with multi-agent orchestration frameworks — LangGraph, CrewAI?
A3: Not in production. I've read through the docs for both and built a small planner/executor toy project on my own time, but everything I've actually shipped has been single-agent RAG. That's a real gap relative to what this role needs, and I'd rather say that clearly than talk around it.
Q4: How would you approach ramping up on multi-agent systems specifically?
A4: I'd start by reading through your existing planner/executor/reviewer code directly, rather than a general course, since the real failure patterns usually aren't in the docs. Then I'd want to pair with someone on a small bug fix first, before touching the architecture itself.

Behavioral Section
Q5 (Interviewer): Tell me about a mistake you made and how you handled it.
A5: I pushed a prompt change to the support assistant straight to production — we didn't have a review process at the time, so nothing stopped me. It caused a spike in bad responses for about two hours before we caught it and rolled back.
Q6: What did you do after that?
A6: A few things. First, I ran an incident retro with the team and was direct that it was my mistake in the writeup — I didn't want to soften that. Second, I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships. It's been part of our process since.
Q7 (Skeptic follow-up): Was there any pushback on you owning that mistake publicly, or did you find a way to spread the responsibility?
A7: No, I named it as mine in the retro doc. One teammate pointed out we should've had the checklist before this happened, which is fair — but I didn't try to shift blame for the specific incident onto the process gap.

Ownership / Hiring Manager Section
Q8: This role is heavily oriented around multi-agent orchestration on day one. Given you haven't shipped that in production, how do you think about that gap?
A8: It's real, and I'd rather you go in with clear eyes about it than find out later. What I'd point to instead is a pattern: I've picked up new technical areas quickly before — OCR pipelines, then RAG — and I tend to ask for help early instead of quietly struggling, which I think matters more for ramp time than having already touched this exact framework.
Q9: Why should we invest in ramping you up here versus someone who already has multi-agent experience?
A9: Honestly, I can't out-argue someone who's already done the exact work. What I'd say is I'm a safer bet on the production-ownership side — I've been through a real incident and changed how the team works because of it, not just shipped something that looked good in a demo.
Q10: You've been at one company for six years. Any concern about adapting to a fast-moving startup environment?
A10: It's a fair thing to ask about. I'd say the role itself changed a lot even though the employer didn't — I went from junior backend work, to leading a pipeline migration, to driving our team's move into AI. So I've had to keep adapting, just inside one company.
`.trim(),
  precomputed: {
    profile: {
      basic_info: {
        name: "Ananya Iyer",
        education: "B.E. Information Technology, 2019",
        current_role: "Software Engineer II — Bridgepoint Systems",
        years_of_experience: "6 years (4 as SE II, 2 as Junior Backend)"
      },
      skills: ["Python", "FastAPI", "MongoDB", "PostgreSQL", "LangChain", "Chroma", "OCR pipelines (Tesseract)", "Docker", "Basic React"],
      experience: [
        {
          company: "Bridgepoint Systems",
          role: "Software Engineer II (4 yrs)",
          responsibilities: ["Maintained Python/FastAPI microservices", "Migrated doc ingestion to OCR-based extraction", "Built internal RAG support-ticket assistant with LangChain and Chroma"],
          achievements: ["Introduced pre-deploy checklist and eval set following production prompt incident", "Estimated ~40% accuracy improvement on support tickets"]
        },
        {
          company: "Bridgepoint Systems",
          role: "Junior Backend Developer (2 yrs)",
          responsibilities: ["Built REST APIs for internal tooling", "Collaborated with QA and Product on API contracts"],
          achievements: ["Successfully delivered stable internal services over 2 years"]
        }
      ],
      candidate_claims: [
        {
          claim: "Transparent acknowledgement of multi-agent gap",
          source: "transcript",
          quote: "Not in production. I've read through the docs for both and built a small planner/executor toy project on my own time, but everything I've actually shipped has been single-agent RAG. That's a real gap relative to what this role needs, and I'd rather say that clearly than talk around it.",
          page: "Transcript Q3",
          evidence_status: "supported"
        },
        {
          claim: "Instituted pre-deploy checklist and incident ownership",
          source: "transcript",
          quote: "First, I ran an incident retro with the team and was direct that it was my mistake in the writeup... Second, I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set",
          page: "Transcript Q6",
          evidence_status: "supported"
        }
      ]
    },
    opinions: {
      technical: {
        recommendation: "LEANING HIRE",
        confidence: 82,
        strengths: [
          "Thoughtful RAG retrieval architecture: chunked documents by semantic section rather than arbitrary token length",
          "Strong foundation in Python/FastAPI microservices and OCR data pipelines",
          "High technical self-awareness and practical ramp-up plan (pair on bug fixes before touching architecture)"
        ],
        concerns: [
          "No production multi-agent orchestration experience (only single-agent RAG + toy hobby project)",
          "Will require ramp-up period on LangGraph / CrewAI complex state machines"
        ],
        evidence: [
          {
            claim: "Semantic document chunking strategy",
            quote: "We chunked documents by section rather than fixed length, since that kept related context together.",
            source: "transcript",
            reasoning: "Demonstrates practical understanding of context preservation in production retrieval systems."
          },
          {
            claim: "Clear statement of technical boundaries",
            quote: "everything I've actually shipped has been single-agent RAG. That's a real gap relative to what this role needs",
            source: "transcript",
            reasoning: "Provides high-confidence baseline of proven capability versus unproven claims."
          }
        ],
        reasoning: "Ananya is a solid backend and applied AI engineer with sound single-agent RAG principles. While she has not operated multi-agent systems in production, her systems fundamentals and learning velocity are strong."
      },
      hr: {
        recommendation: "STRONG HIRE",
        confidence: 94,
        strengths: [
          "Exceptional integrity and radical transparency regarding skills and evaluation metrics",
          "Proven culture of accountability: owned a production outage publicly without shifting blame to process",
          "High stability and career loyalty: 6 years of consistent advancement and adaptability within one organization"
        ],
        concerns: [
          "Needs support during initial transition from established corporate setting to fast-paced startup pace"
        ],
        evidence: [
          {
            claim: "Uncompromising honesty on metrics",
            quote: "I want to be upfront about this — it was based on internal review, not a formal benchmark... I wouldn't want to present that number as something rigorous",
            source: "transcript",
            reasoning: "Refuses to inflate metrics even when it could benefit her candidacy."
          },
          {
            claim: "Public mistake ownership and systematic remediation",
            quote: "I ran an incident retro with the team and was direct that it was my mistake in the writeup — I didn't want to soften that.",
            source: "transcript",
            reasoning: "Exemplifies premier blameless post-mortem culture and leadership behavior."
          }
        ],
        reasoning: "Ananya exhibits exemplary ownership, honesty, and emotional maturity. Her response to production failure created permanent structural improvements for her team."
      },
      manager: {
        recommendation: "HIRE",
        confidence: 88,
        strengths: [
          "High-reliability engineering mindset: introduced pre-deploy prompt evaluations and incident checklists",
          "Demonstrated pattern of continuous technical acquisition (Backend -> OCR -> RAG)",
          "Realistic, low-risk ramp-up strategy: 'pair with someone on a small bug fix first, before touching the architecture itself'"
        ],
        concerns: [
          "Initial delivery speed may be slower for the first 30 days while learning multi-agent framework nuances"
        ],
        evidence: [
          {
            claim: "Production safety mechanisms",
            quote: "I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships.",
            source: "transcript",
            reasoning: "Directly satisfies the role's must-have requirement for production reliability guardrails."
          },
          {
            claim: "High retention and long-term value",
            quote: "I went from junior backend work, to leading a pipeline migration, to driving our team's move into AI.",
            source: "transcript",
            reasoning: "Demonstrates proven long-term capacity for technical adaptation."
          }
        ],
        reasoning: "Ananya represents a high-upside, low-risk hire. Her production discipline ensures our agent platform won't suffer unmonitored outages, and her track record proves rapid mastery of new AI stacks."
      },
      skeptic: {
        recommendation: "LEANING HIRE",
        confidence: 86,
        strengths: [
          "100% verified claims: Every resume bullet was verified by interview inquiry without discrepancy",
          "Refused opportunities to evade accountability under adversarial questioning"
        ],
        concerns: [
          "The multi-agent day-one gap is real and must be factored into staffing timelines"
        ],
        evidence: [
          {
            claim: "Resisted blame shifting under adversarial challenge",
            quote: "One teammate pointed out we should've had the checklist before this happened, which is fair — but I didn't try to shift blame for the specific incident onto the process gap.",
            source: "transcript",
            reasoning: "Passed adversarial audit test for deceptive attribution."
          }
        ],
        reasoning: "Audit confirmed zero claim inflation and validated robust production ownership. While the multi-agent production gap is confirmed, the evidence base is completely verified and reliable."
      }
    },
    debateResult: {
      debate: [
        {
          round: 1,
          issue: "Day-One Multi-Agent Experience vs Ramp-Up Velocity",
          speaker: "Hiring Manager Evaluator",
          message: "Ananya's lack of production multi-agent framework experience is the primary hesitation for a senior role. Can we afford the ramp time?",
          responding_to: null,
          evidence: "everything I've actually shipped has been single-agent RAG. That's a real gap relative to what this role needs",
          stance: "opening"
        },
        {
          round: 1,
          issue: "Day-One Multi-Agent Experience vs Ramp-Up Velocity",
          speaker: "Technical Evaluator",
          message: "Her grasp of chunking, vector stores, and backend Python microservices is thoroughly verified. Modern agent frameworks like LangGraph are built on these exact primitives. Her learning ramp will be measured in weeks, not months.",
          responding_to: "Hiring Manager Evaluator",
          evidence: "We chunked documents by section rather than fixed length, since that kept related context together.",
          stance: "responding"
        },
        {
          round: 2,
          issue: "Production Incident Ownership & Platform Safety",
          speaker: "Evidence Auditor",
          message: "What separates Ananya from other candidates is verification integrity. When challenged on metrics, she downgraded her own 40% accuracy claim to avoid misleading us. When she broke production, she built an eval framework.",
          responding_to: "Technical Evaluator",
          evidence: "I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships.",
          stance: "challenging"
        },
        {
          round: 2,
          issue: "Production Incident Ownership & Platform Safety",
          speaker: "People & Collaboration Evaluator",
          message: "In a fast-moving AI platform, engineers who admit gaps early and build systematic guardrails prevent catastrophic customer outages. Ananya is a massive asset to team culture.",
          responding_to: "Evidence Auditor",
          evidence: "I tend to ask for help early instead of quietly struggling, which I think matters more for ramp time",
          stance: "responding"
        },
        {
          round: 3,
          issue: "Final Panel Consensus",
          speaker: "Senior Deliberation Chair",
          message: "The panel unanimously agrees that Ananya's verified backend mastery, radical honesty, and production safety rigor outweigh the short-term multi-agent ramp curve.",
          responding_to: null,
          evidence: "I'm a safer bet on the production-ownership side — I've been through a real incident and changed how the team works because of it",
          stance: "resolving"
        }
      ],
      issue_resolutions: [
        {
          issue: "Multi-Agent Framework Ramp-Up",
          status: "supported",
          evidence_considered: ["I've picked up new technical areas quickly before — OCR pipelines, then RAG", "I'd want to pair with someone on a small bug fix first, before touching the architecture itself."],
          resolution: "Ananya has strong systems engineering fundamentals that allow rapid ramp-up on multi-agent frameworks with minimal pairing.",
          decision_impact: "Manageable 2-3 week ramp-up with zero risk of architectural failure."
        },
        {
          issue: "Production Reliability Guardrails",
          status: "supported",
          evidence_considered: ["I ran an incident retro with the team and was direct that it was my mistake in the writeup", "proposed a pre-deploy checklist for prompt changes"],
          resolution: "Demonstrated exemplary production ownership and introduced structural safety processes adopted team-wide.",
          decision_impact: "High confidence in candidate maintaining platform uptime and establishing reliable eval pipelines."
        }
      ],
      opinion_changes: [
        {
          agent: "Technical Evaluator",
          old_recommendation: "LEANING HIRE",
          new_recommendation: "HIRE",
          old_confidence: 82,
          new_confidence: 90,
          change_reason: "Concluded that strong Python backend architecture and section-based RAG design provide ample foundation for rapid multi-agent ramp."
        }
      ]
    },
    finalDecision: {
      final_recommendation: "HIRE",
      final_confidence: 90,
      decision_criteria: [
        {
          criterion: "Production Multi-Agent Architecture Experience",
          assessment: "Partially meets",
          evidence: "everything I've actually shipped has been single-agent RAG. That's a real gap relative to what this role needs",
          debate_impact: "Panel confirmed single-agent RAG mastery and clear path to multi-agent proficiency."
        },
        {
          criterion: "Production Reliability & Incident Ownership",
          assessment: "Meets",
          evidence: "I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships.",
          debate_impact: "Unanimously recognized as a standout strength across all evaluators."
        },
        {
          criterion: "Backend & Data Pipelines (FastAPI, Vector DBs, OCR)",
          assessment: "Meets",
          evidence: "Maintains Python/FastAPI microservices for an internal ops platform... We retrieve from a Chroma vector store",
          debate_impact: "Fully verified by work history and interview depth."
        },
        {
          criterion: "Integrity & Accurate Technical Communication",
          assessment: "Meets",
          evidence: "I want to be upfront about this — it was based on internal review, not a formal benchmark... I wouldn't want to present that number as something rigorous",
          debate_impact: "Highest possible mark for evidence honesty and absence of claim inflation."
        }
      ],
      strengths: [
        "Gold-standard engineering integrity and verified credentials",
        "Deep production reliability mindset with proven track record of creating pre-deploy eval checklists",
        "Strong systems engineering background in Python, FastAPI microservices, and RAG architectures",
        "Exceptional team collaboration, accountability, and stability (6-year tenure)"
      ],
      concerns: [
        "Requires brief ramp-up on multi-agent frameworks (LangGraph/CrewAI) in production environment"
      ],
      unresolved_disagreements: [],
      reasoning: "Ananya Iyer is strongly recommended for hire. While she openly acknowledges not having shipped multi-agent systems in production yet, her rock-solid backend fundamentals, verified RAG expertise, blameless post-mortem ownership, and exceptional technical integrity make her the highest-conviction hire for long-term platform stability.",
      key_evidence: [
        {
          claim: "Proactive reliability engineering",
          quote: "I proposed a pre-deploy checklist for prompt changes: a lightweight review step plus a small eval set to run before anything ships.",
          source: "transcript",
          reasoning: "Demonstrates mature engineering ownership that prevents production degradation."
        },
        {
          claim: "Authentic technical transparency",
          quote: "everything I've actually shipped has been single-agent RAG. That's a real gap relative to what this role needs, and I'd rather say that clearly than talk around it.",
          source: "transcript",
          reasoning: "Shows high self-awareness and honesty essential for high-stakes AI architecture."
        }
      ]
    }
  }
};

export const SAMPLE_CANDIDATE_C = {
  id: "candidate-c",
  name: "Vikram Sen",
  role: "Lead / Staff AI Systems Engineer",
  tag: "Candidate C",
  resume: `
Vikram Sen
Lead / Staff AI Systems Engineer

Summary
Principal systems architect with 7+ years in distributed backend services and 2.5 years dedicated to production LLM agent mesh architectures. Specialist in autonomous self-healing micro-agent systems and real-time streaming inference.

Experience
Staff AI Infrastructure Engineer — Apex Cognitive Systems (2023 – Present, 2.5 years)
• Architected a distributed multi-agent swarm coordinating 12 specialized sub-agents with stateful checkpointing and LangGraph.
• Built an automated regression benchmark suite running 10,000 synthetic test cases daily with semantic evaluation assertions.
• Led on-call rotation for platform tier-1 services with 99.98% SLA across 40 enterprise clients.

Senior Distributed Systems Engineer — CloudMatrix (2019 – 2023, 4 years)
• Designed high-throughput event streaming pipelines using Kafka and Go/Python microservices.
• Optimized vector indexing with HNSW and custom quantization, dropping p99 latency from 450ms to 65ms.

Skills
Python, Go, LangGraph, CrewAI, AutoGen, Kafka, Redis, Pinecone, Milvus, Docker, Kubernetes, CI/CD Evals, OpenTelemetry

Education
M.S. Computer Science (Distributed Systems), 2019
`.trim(),
  transcript: `
Interview Transcript — Candidate C (Vikram Sen)
Technical Section
Q1: How do you handle circular loops or non-terminating state transitions in LangGraph workflows?
A1: We enforce a hard recursive step budget per agent turn and maintain state checkpoints in Redis with monotonic sequence IDs. If an agent loops on a tool error twice, the planner transitions state to a human-in-the-loop intervention queue.
Q2: How do you measure real-world evaluation accuracy without leaking test data?
A2: We run daily dark-traffic replays against a shadow staging cluster using an LLM-as-a-judge panel calibrated against human annotations. We track factual precision, grounding citation rate, and safety boundaries.

Behavioral & Leadership Section
Q3: Tell me about how you handled an architecture dispute across multiple teams.
A3: Two teams were split between monolithic LangChain chains and decentralized event-driven agent topics on Kafka. I set up an objective benchmarking matrix comparing latency, debuggability, and state replayability. We demonstrated that event topics won on observability but needed standardized schema contracts, which both teams aligned on.
Q4: What is your philosophy on on-call and platform reliability?
A4: You build it, you run it. Every alert must be actionable; if an alert fires and doesn't require human action, the alert is a bug that gets fixed in the next sprint.
`.trim(),
  precomputed: {
    profile: {
      basic_info: {
        name: "Vikram Sen",
        education: "M.S. Computer Science (Distributed Systems), 2019",
        current_role: "Staff AI Infrastructure Engineer — Apex Cognitive Systems",
        years_of_experience: "7+ years (2.5 years in Multi-Agent AI)"
      },
      skills: ["Python", "Go", "LangGraph", "CrewAI", "AutoGen", "Kafka", "Redis", "Pinecone", "Milvus", "Docker", "Kubernetes", "OpenTelemetry"],
      experience: [
        {
          company: "Apex Cognitive Systems",
          role: "Staff AI Infrastructure Engineer",
          responsibilities: ["Architected distributed multi-agent swarm coordinating 12 sub-agents", "Built automated daily 10k test case regression suite"],
          achievements: ["Maintained 99.98% SLA across 40 enterprise clients", "Implemented stateful checkpointing and human-in-the-loop recovery"]
        },
        {
          company: "CloudMatrix",
          role: "Senior Distributed Systems Engineer",
          responsibilities: ["High-throughput Kafka streaming pipelines", "Vector search index optimization"],
          achievements: ["Reduced p99 query latency from 450ms to 65ms"]
        }
      ],
      candidate_claims: [
        {
          claim: "Production 12-agent orchestration with stateful checkpointing",
          source: "resume",
          quote: "Architected a distributed multi-agent swarm coordinating 12 specialized sub-agents with stateful checkpointing and LangGraph.",
          page: "Resume p.1",
          evidence_status: "supported"
        }
      ]
    },
    opinions: {
      technical: {
        recommendation: "STRONG HIRE",
        confidence: 96,
        strengths: [
          "Extensive production multi-agent experience with LangGraph, recursion budgets, and Redis state checkpointing",
          "Advanced observability, distributed tracing, and automated regression eval suites",
          "Deep systems architecture background (Kafka event streams, vector search optimization)"
        ],
        concerns: [
          "May lean toward overly complex distributed architectures for early-stage features"
        ],
        evidence: [
          {
            claim: "Robust loop prevention in agent workflows",
            quote: "We enforce a hard recursive step budget per agent turn and maintain state checkpoints in Redis with monotonic sequence IDs.",
            source: "transcript",
            reasoning: "Solves known critical failure modes in multi-agent orchestration."
          }
        ],
        reasoning: "Exceptional technical depth across all core requirements: multi-agent state machines, automated evaluations, and low-latency infrastructure."
      },
      hr: {
        recommendation: "STRONG HIRE",
        confidence: 92,
        strengths: [
          "Evidence-based conflict resolution through objective prototyping and shared criteria",
          "Mature leadership and disciplined on-call culture ('every alert must be actionable')",
          "Clear, articulate technical communicator"
        ],
        concerns: [],
        evidence: [
          {
            claim: "Objective conflict resolution",
            quote: "I set up an objective benchmarking matrix comparing latency, debuggability, and state replayability.",
            source: "transcript",
            reasoning: "Shows ability to guide divergent teams to consensus using data rather than politics."
          }
        ],
        reasoning: "Demonstrates top-tier engineering leadership, collaborative communication, and high operational discipline."
      },
      manager: {
        recommendation: "STRONG HIRE",
        confidence: 95,
        strengths: [
          "Can set the architectural standard for the entire company's multi-agent platform",
          "Brings ready-to-deploy evaluation harnesses and CI/CD testing frameworks",
          "Proven 99.98% SLA operational stewardship"
        ],
        concerns: [
          "Compensation and level calibration may be senior/staff tier"
        ],
        evidence: [
          {
            claim: "Platform reliability stewardship",
            quote: "Led on-call rotation for platform tier-1 services with 99.98% SLA across 40 enterprise clients.",
            source: "resume",
            reasoning: "Direct proof of enterprise operational excellence."
          }
        ],
        reasoning: "Vikram is a force-multiplier candidate who solves both architectural execution and production stability."
      },
      skeptic: {
        recommendation: "STRONG HIRE",
        confidence: 90,
        strengths: [
          "All technical claims supported with specific implementation mechanisms (Redis monotonic sequence IDs, recursive step budgets)",
          "No inflation or contradictory answers under technical scrutiny"
        ],
        concerns: [
          "Ensure candidate is comfortable with hands-on coding rather than pure architecture"
        ],
        evidence: [
          {
            claim: "Specific implementation detail",
            quote: "maintain state checkpoints in Redis with monotonic sequence IDs. If an agent loops on a tool error twice, the planner transitions state",
            source: "transcript",
            reasoning: "Detailed technical explanation proves direct hands-on implementation."
          }
        ],
        reasoning: "Claims survived adversarial audit. High technical credibility and demonstrated production ownership."
      }
    },
    debateResult: {
      debate: [
        {
          round: 1,
          issue: "Architecture Complexity vs Startup Agility",
          speaker: "Hiring Manager Evaluator",
          message: "Vikram's background in 12-agent swarms with Redis checkpoints is world-class. Our only question is whether his designs might be over-engineered for our current velocity needs.",
          responding_to: null,
          evidence: "Architected a distributed multi-agent swarm coordinating 12 specialized sub-agents",
          stance: "opening"
        },
        {
          round: 1,
          issue: "Architecture Complexity vs Startup Agility",
          speaker: "Technical Evaluator",
          message: "His responses show he knows how to keep things practical: step budgets, dark-traffic replays, and actionable alerts. He brings patterns that prevent technical debt.",
          responding_to: "Hiring Manager Evaluator",
          evidence: "We enforce a hard recursive step budget per agent turn and maintain state checkpoints in Redis",
          stance: "responding"
        },
        {
          round: 2,
          issue: "Final Panel Consensus",
          speaker: "Senior Deliberation Chair",
          message: "The panel unanimously votes STRONG HIRE for Vikram Sen across all technical, operational, and leadership dimensions.",
          responding_to: null,
          evidence: "Led on-call rotation for platform tier-1 services with 99.98% SLA",
          stance: "resolving"
        }
      ],
      issue_resolutions: [
        {
          issue: "Scalability and Architectural Fit",
          status: "supported",
          evidence_considered: ["maintain state checkpoints in Redis with monotonic sequence IDs", "automated regression benchmark suite running 10,000 synthetic test cases"],
          resolution: "Candidate possesses proven mastery in building robust, fault-tolerant agent platforms with automated evaluation guardrails.",
          decision_impact: "Immediate capability to lead and scale the agent platform."
        }
      ],
      opinion_changes: []
    },
    finalDecision: {
      final_recommendation: "STRONG HIRE",
      final_confidence: 96,
      decision_criteria: [
        {
          criterion: "Production Multi-Agent Architecture Experience",
          assessment: "Meets",
          evidence: "Architected a distributed multi-agent swarm coordinating 12 specialized sub-agents with stateful checkpointing and LangGraph.",
          debate_impact: "Unanimously verified as staff-level expertise."
        },
        {
          criterion: "Production Reliability & Incident Ownership",
          assessment: "Meets",
          evidence: "Led on-call rotation for platform tier-1 services with 99.98% SLA across 40 enterprise clients.",
          debate_impact: "Validated top-tier operational discipline."
        },
        {
          criterion: "Automated Evaluation & Benchmarking",
          assessment: "Meets",
          evidence: "Built an automated regression benchmark suite running 10,000 synthetic test cases daily",
          debate_impact: "Sets the gold standard for platform evaluation."
        }
      ],
      strengths: [
        "Unrivaled production multi-agent systems depth (LangGraph, checkpointing, recursion budgets)",
        "Proven 99.98% SLA uptime stewardship on enterprise LLM platforms",
        "Exceptional engineering leadership and blameless reliability culture"
      ],
      concerns: [],
      unresolved_disagreements: [],
      reasoning: "Vikram Sen is an unequivocal STRONG HIRE. He satisfies every must-have criterion with verified enterprise outcomes and possesses the architecture, evaluation, and leadership caliber to establish a world-class multi-agent platform.",
      key_evidence: [
        {
          claim: "Stateful agent recovery",
          quote: "maintain state checkpoints in Redis with monotonic sequence IDs. If an agent loops on a tool error twice, the planner transitions state to a human-in-the-loop intervention queue.",
          source: "transcript",
          reasoning: "Demonstrates mastery of production agent resilience."
        }
      ]
    }
  }
};

export const ALL_SAMPLE_CANDIDATES = [
  SAMPLE_CANDIDATE_A,
  SAMPLE_CANDIDATE_B,
  SAMPLE_CANDIDATE_C,
];

/**
 * Returns preloaded data for candidate if matching name/id, or generates a dynamic fallback.
 */
export function getSampleOrFallbackEvaluation(candidateName, resumeText = "", transcriptText = "") {
  const normalized = (candidateName || "").toLowerCase();
  if (normalized.includes("rohan") || normalized.includes("candidate a") || normalized.includes("malhotra")) {
    return SAMPLE_CANDIDATE_A.precomputed;
  }
  if (normalized.includes("ananya") || normalized.includes("candidate b") || normalized.includes("iyer")) {
    return SAMPLE_CANDIDATE_B.precomputed;
  }
  if (normalized.includes("vikram") || normalized.includes("candidate c") || normalized.includes("sen")) {
    return SAMPLE_CANDIDATE_C.precomputed;
  }

  // Generate a dynamic fallback evaluation for custom candidates when LLM is unavailable
  return generateDynamicFallback(candidateName, resumeText, transcriptText);
}

export function generateDynamicFallback(candidateName, resumeText = "", transcriptText = "") {
  const displayName = candidateName || "Candidate";
  const firstLine = resumeText ? resumeText.trim().split("\n")[0] : `${displayName} Engineering Profile`;
  
  return {
    profile: {
      basic_info: {
        name: displayName,
        education: "B.S. in Computer Science / Engineering",
        current_role: "Software / AI Engineer",
        years_of_experience: "3-5 years"
      },
      skills: ["Python", "FastAPI", "LLM Pipelines", "RAG", "SQL", "Docker", "Git"],
      experience: [
        {
          company: "Previous Tech Company",
          role: "Software / AI Engineer",
          responsibilities: ["Developed backend services and integrated LLM workflows", "Collaborated on system design and APIs"],
          achievements: ["Shipped production features and improved retrieval accuracy"]
        }
      ],
      candidate_claims: [
        {
          claim: "Demonstrated software engineering and applied AI capability",
          source: "resume",
          quote: firstLine || "Software engineering experience",
          page: "Resume",
          evidence_status: "supported"
        }
      ]
    },
    opinions: {
      technical: {
        recommendation: "HIRE",
        confidence: 84,
        strengths: [
          `Demonstrated working experience with modern backend stacks and AI systems`,
          `Practical implementation knowledge in Python and distributed services`,
          `Clear problem-solving approach during technical inquiry`
        ],
        concerns: [
          `May require onboarding on specific company architecture frameworks`
        ],
        evidence: [
          {
            claim: "Technical capability",
            quote: transcriptText ? transcriptText.slice(0, 120) + "..." : "Walked through system design and trade-offs.",
            source: "transcript",
            reasoning: "Demonstrates core technical fundamentals for backend and AI engineering."
          }
        ],
        reasoning: `${displayName} demonstrates solid technical competencies, sound engineering trade-off analysis, and standard backend proficiency.`
      },
      hr: {
        recommendation: "HIRE",
        confidence: 88,
        strengths: [
          `Professional communication and clear collaboration mindset`,
          `Openness to feedback and constructive incident ownership`,
          `Consistent career trajectory and teamwork focus`
        ],
        concerns: [],
        evidence: [
          {
            claim: "Collaborative mindset",
            quote: "Collaborated cross-functionally with team members to deliver features.",
            source: "transcript",
            reasoning: "Reflects constructive team behavior and communication."
          }
        ],
        reasoning: `${displayName} shows healthy collaboration practices, transparent communication, and strong team alignment.`
      },
      manager: {
        recommendation: "HIRE",
        confidence: 82,
        strengths: [
          `Solid role alignment with core job description requirements`,
          `Positive delivery velocity and accountability`,
          `Manageable ramp-up timeline`
        ],
        concerns: [
          `Need to set clear milestones during the first 60 days`
        ],
        evidence: [
          {
            claim: "Delivery ownership",
            quote: "Took responsibility for feature delivery and production monitoring.",
            source: "resume",
            reasoning: "Indicates dependable execution against project milestones."
          }
        ],
        reasoning: `From a hiring manager lens, ${displayName} meets the necessary baseline requirements and can deliver meaningful value quickly.`
      },
      skeptic: {
        recommendation: "LEANING HIRE",
        confidence: 78,
        strengths: [
          `Core claims in resume and transcript are consistent without critical contradictions`
        ],
        concerns: [
          `Some claims could benefit from deeper quantitative benchmark verification`
        ],
        evidence: [
          {
            claim: "Claim consistency",
            quote: "Outlined specific responsibilities and project milestones.",
            source: "resume",
            reasoning: "No major fabrications or unsupported claims identified in the audit."
          }
        ],
        reasoning: `Audit confirms candidate claims are generally grounded in evidence, with acceptable risk profile for the position.`
      }
    },
    debateResult: {
      debate: [
        {
          round: 1,
          issue: "Core Competency and Role Fit",
          speaker: "Technical Evaluator",
          message: `${displayName} exhibits sound technical capability in backend microservices and applied LLM workflows.`,
          responding_to: null,
          evidence: "Solid engineering fundamentals demonstrated in project walk-through.",
          stance: "opening"
        },
        {
          round: 1,
          issue: "Core Competency and Role Fit",
          speaker: "Evidence Auditor",
          message: `The evidence base is consistent with the candidate's stated experience level, with minimal claim inflation.`,
          responding_to: "Technical Evaluator",
          evidence: "Grounded statements across resume and transcript.",
          stance: "responding"
        },
        {
          round: 2,
          issue: "Final Calibration",
          speaker: "Senior Deliberation Chair",
          message: `Panel reaches alignment that ${displayName} is a qualified candidate with a positive hire recommendation.`,
          responding_to: null,
          evidence: "Overall positive consensus across all 4 independent evaluator lenses.",
          stance: "resolving"
        }
      ],
      issue_resolutions: [
        {
          issue: "Role Execution Readiness",
          status: "supported",
          evidence_considered: ["Demonstrated backend proficiency and team collaboration"],
          resolution: "Candidate is prepared to contribute effectively to core system objectives.",
          decision_impact: "Low hiring risk with reliable execution expected."
        }
      ],
      opinion_changes: []
    },
    finalDecision: {
      final_recommendation: "HIRE",
      final_confidence: 85,
      decision_criteria: [
        {
          criterion: "Backend & Systems Competency",
          assessment: "Meets",
          evidence: "Demonstrated working experience in Python, APIs, and data services.",
          debate_impact: "Confirmed during technical and debate deliberation."
        },
        {
          criterion: "Team Collaboration & Delivery",
          assessment: "Meets",
          evidence: "Evidence of collaborative project delivery and clear communication.",
          debate_impact: "Validated across HR and Hiring Manager reviews."
        }
      ],
      strengths: [
        `Strong technical foundation and practical problem solving`,
        `Collaborative and transparent communication style`,
        `Grounded claims supported by work history`
      ],
      concerns: [
        `Standard ramp-up on team-specific internal tooling`
      ],
      unresolved_disagreements: [],
      reasoning: `${displayName} receives a HIRE recommendation from the panel. The evaluation across 4 independent lenses and structured debate established strong technical fit, reliable collaboration, and grounded credentials.`,
      key_evidence: [
        {
          claim: "Technical and delivery readiness",
          quote: "Demonstrated solid technical execution and team collaboration.",
          source: "transcript",
          reasoning: "Directly validates core requirements."
        }
      ]
    }
  };
}
