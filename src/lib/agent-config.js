export const AGENT_CONFIG = [
  {
    key: "technical",
    label: "Technical Evaluator",
    remit: "Technical depth, architecture, implementation, and problem solving"
  },
  {
    key: "hr",
    label: "People & Collaboration Evaluator",
    remit: "Communication, collaboration, feedback, reliability, and leadership behavior"
  },
  {
    key: "manager",
    label: "Hiring Manager Evaluator",
    remit: "Role outcomes, scope, ownership, execution, and delivery risk"
  },
  {
    key: "skeptic",
    label: "Evidence Auditor",
    remit: "Contradictions, unsupported claims, evidence gaps, and hiring risk"
  }
];

export const AGENT_PERSONAS = AGENT_CONFIG.map(agent => agent.key);

export const AGENT_LABELS = Object.fromEntries(
  AGENT_CONFIG.map(agent => [agent.key, agent.label])
);