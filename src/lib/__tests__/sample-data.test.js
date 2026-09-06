import {
  SAMPLE_CANDIDATE_A,
  SAMPLE_CANDIDATE_B,
  SAMPLE_CANDIDATE_C,
  getSampleOrFallbackEvaluation,
  generateDynamicFallback
} from '../sample-data';

describe('Sample Data & Dynamic Fallback Engine', () => {
  it('should have complete precomputed evaluation for Candidate A (Rohan)', () => {
    expect(SAMPLE_CANDIDATE_A.name).toBe('Rohan Malhotra');
    expect(SAMPLE_CANDIDATE_A.precomputed.profile).toBeDefined();
    expect(SAMPLE_CANDIDATE_A.precomputed.opinions.technical).toBeDefined();
    expect(SAMPLE_CANDIDATE_A.precomputed.opinions.hr).toBeDefined();
    expect(SAMPLE_CANDIDATE_A.precomputed.opinions.manager).toBeDefined();
    expect(SAMPLE_CANDIDATE_A.precomputed.opinions.skeptic).toBeDefined();
    expect(SAMPLE_CANDIDATE_A.precomputed.debateResult.debate.length).toBeGreaterThan(0);
    expect(SAMPLE_CANDIDATE_A.precomputed.finalDecision.final_recommendation).toBe('LEANING NO-HIRE');
  });

  it('should have complete precomputed evaluation for Candidate B (Ananya)', () => {
    expect(SAMPLE_CANDIDATE_B.name).toBe('Ananya Iyer');
    expect(SAMPLE_CANDIDATE_B.precomputed.profile).toBeDefined();
    expect(SAMPLE_CANDIDATE_B.precomputed.opinions.hr.recommendation).toBe('STRONG HIRE');
    expect(SAMPLE_CANDIDATE_B.precomputed.finalDecision.final_recommendation).toBe('HIRE');
  });

  it('should have complete precomputed evaluation for Candidate C (Vikram)', () => {
    expect(SAMPLE_CANDIDATE_C.name).toBe('Vikram Sen');
    expect(SAMPLE_CANDIDATE_C.precomputed.finalDecision.final_recommendation).toBe('STRONG HIRE');
    expect(SAMPLE_CANDIDATE_C.precomputed.finalDecision.final_confidence).toBe(96);
  });

  it('should resolve sample candidate evaluations by name accurately', () => {
    const rohanEval = getSampleOrFallbackEvaluation('Rohan Malhotra');
    expect(rohanEval.profile.basic_info.name).toBe('Rohan Malhotra');

    const ananyaEval = getSampleOrFallbackEvaluation('Ananya Iyer');
    expect(ananyaEval.profile.basic_info.name).toBe('Ananya Iyer');

    const vikramEval = getSampleOrFallbackEvaluation('Vikram Sen');
    expect(vikramEval.profile.basic_info.name).toBe('Vikram Sen');
  });

  it('should generate robust dynamic fallback for arbitrary custom candidates', () => {
    const customEval = generateDynamicFallback(
      'Alex Johnson',
      'Senior Systems Engineer with 5 years experience in Python and microservices.',
      'Walked through architectural trade-offs and team collaboration.'
    );

    expect(customEval.profile.basic_info.name).toBe('Alex Johnson');
    expect(customEval.opinions.technical).toBeDefined();
    expect(customEval.opinions.hr).toBeDefined();
    expect(customEval.opinions.manager).toBeDefined();
    expect(customEval.opinions.skeptic).toBeDefined();
    expect(customEval.debateResult.debate.length).toBeGreaterThan(0);
    expect(customEval.finalDecision.final_recommendation).toBe('HIRE');
  });
});
