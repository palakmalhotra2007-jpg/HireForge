import { POST } from '../route';
import { callGemini } from '@/lib/gemini';

jest.mock('@/lib/gemini', () => ({
  callGemini: jest.fn()
}));

describe('POST /api/agents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new Request('http://localhost/api/agents', {
      method: 'POST',
      body: JSON.stringify({
        persona: 'technical'
        // other fields missing
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing required inputs');
  });

  it('should return 400 if invalid persona is specified', async () => {
    const request = new Request('http://localhost/api/agents', {
      method: 'POST',
      body: JSON.stringify({
        persona: 'invalid-persona',
        profile: {},
        resume: 'test resume',
        transcript: 'test transcript',
        jobDescription: 'test jd'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid persona');
  });

  it('should return agent opinion on success', async () => {
    const mockOpinion = { score: 80, reasoning: 'Strong candidate' };
    callGemini.mockResolvedValueOnce(mockOpinion);

    const request = new Request('http://localhost/api/agents', {
      method: 'POST',
      body: JSON.stringify({
        persona: 'technical',
        profile: {},
        resume: 'test resume',
        transcript: 'test transcript',
        jobDescription: 'test jd'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockOpinion);
    expect(data.persona).toBe('technical');
  });

  it('should return JSON when the evaluator fails', async () => {
    callGemini.mockRejectedValueOnce(new Error('Gemini request failed'));

    const request = new Request('http://localhost/api/agents', {
      method: 'POST',
      body: JSON.stringify({
        persona: 'technical',
        profile: {},
        resume: 'test resume',
        transcript: 'test transcript',
        jobDescription: 'test jd'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: 'Failed to generate agent opinion.'
    });
  });

  it('should use a distinct evaluator prompt for each persona', async () => {
    callGemini.mockResolvedValue({ recommendation: 'INSUFFICIENT EVIDENCE' });

    for (const persona of ['technical', 'hr', 'manager', 'skeptic']) {
      const request = new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          persona,
          profile: {},
          resume: 'test resume',
          transcript: 'test transcript',
          jobDescription: 'test jd'
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    }

    const prompts = callGemini.mock.calls.map(([systemPrompt]) => systemPrompt);
    expect(new Set(prompts).size).toBe(4);
    expect(prompts[0]).toContain('Technical Evaluator');
    expect(prompts[1]).toContain('People and Collaboration Evaluator');
    expect(prompts[2]).toContain('Hiring Manager Evaluator');
    expect(prompts[3]).toContain('Adversarial Evidence Auditor');
  });
});
