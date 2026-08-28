import { POST } from '../route';
import { callGemini } from '@/lib/gemini';

jest.mock('@/lib/gemini', () => ({
  callGemini: jest.fn()
}));

describe('POST /api/final-decision', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new Request('http://localhost/api/final-decision', {
      method: 'POST',
      body: JSON.stringify({
        profile: {}
        // jobDescription, opinions, and debateResult missing
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing required inputs');
  });

  it('should return final decision on success', async () => {
    const mockDecision = { final_recommendation: 'HIRE', final_confidence: 90 };
    callGemini.mockResolvedValueOnce(mockDecision);

    const request = new Request('http://localhost/api/final-decision', {
      method: 'POST',
      body: JSON.stringify({
        profile: {},
        jobDescription: 'test jd',
        opinions: {},
        debateResult: {}
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockDecision);
  });
});
