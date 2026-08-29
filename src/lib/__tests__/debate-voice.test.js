import { buildDebateSpeechScript } from '@/lib/debate-voice';

describe('buildDebateSpeechScript', () => {
  it('creates a readable spoken script from the debate transcript', () => {
    const debateResult = {
      debate: [
        {
          round: 1,
          speaker: 'Technical Evaluator',
          issue: 'System design',
          message: 'The candidate explains trade-offs clearly.',
          evidence: 'References to architecture decisions were concrete.'
        },
        {
          round: 2,
          speaker: 'Hiring Manager',
          message: 'I want evidence of stakeholder communication.'
        }
      ]
    };

    const result = buildDebateSpeechScript(debateResult);

    expect(result).toContain('Round 1');
    expect(result).toContain('Technical Evaluator');
    expect(result).toContain('The issue is System design.');
    expect(result).toContain('I believe the candidate explains trade-offs clearly.');
    expect(result).toContain('My evidence is References to architecture decisions were concrete.');
    expect(result).toContain('Hiring Manager');
  });
});
