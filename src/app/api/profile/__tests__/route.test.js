import { POST } from '../route';
import { callGemini } from '@/lib/gemini';

jest.mock('@/lib/gemini', () => ({
  callGemini: jest.fn()
}));

describe('POST /api/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'mock-key';
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new Request('http://localhost/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        jobDescription: 'test jd'
        // resume and transcript missing
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Missing required texts');
  });

  it('should return 500 if API key is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const request = new Request('http://localhost/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        jobDescription: 'test jd',
        resume: 'test resume',
        transcript: 'test transcript'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('GEMINI_API_KEY is not configured');
  });

  it('should return profile data on success', async () => {
    const mockProfile = { name: 'John Doe', skills: ['React'] };
    callGemini.mockResolvedValueOnce(mockProfile);

    const request = new Request('http://localhost/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        jobDescription: 'test jd',
        resume: 'test resume',
        transcript: 'test transcript'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockProfile);
  });
});
