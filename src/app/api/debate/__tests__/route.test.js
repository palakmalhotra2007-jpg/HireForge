import { POST } from '../route';
import { callGemini } from '@/lib/gemini';

jest.mock('@/lib/gemini', () => ({
  callGemini: jest.fn()
}));

describe('POST /api/debate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new Request('http://localhost/api/debate', {
      method: 'POST',
      body: JSON.stringify({
        profile: {}
        // jobDescription and opinions missing
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing required inputs');
  });

  it('should return debate result on success', async () => {
    const mockDebateResult = { debate: [], issue_resolutions: [] };
    callGemini.mockResolvedValueOnce(mockDebateResult);

    const request = new Request('http://localhost/api/debate', {
      method: 'POST',
      body: JSON.stringify({
        profile: {},
        jobDescription: 'test jd',
        opinions: {}
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockDebateResult);
  });
});
