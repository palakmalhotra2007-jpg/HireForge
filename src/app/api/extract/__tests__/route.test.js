import { POST } from '../route';

// Mock pdf-parse
jest.mock('pdf-parse', () => {
  const mockPDFParse = jest.fn().mockImplementation(() => {
    return {
      getText: jest.fn().mockResolvedValue({
        text: 'Mocked PDF Content Text',
        total: 1
      }),
      destroy: jest.fn().mockResolvedValue(undefined)
    };
  });
  mockPDFParse.setWorker = jest.fn(); // static method mock
  return {
    PDFParse: mockPDFParse
  };
});

describe('POST /api/extract', () => {
  it('should successfully handle missing or string fields in form data', async () => {
    const formData = new FormData();
    formData.append('job_description', 'not-a-file'); // should be ignored

    const request = new Request('http://localhost/api/extract', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.job_description).toBeNull();
  });

  it('should parse PDF files and return extracted text', async () => {
    const formData = new FormData();
    const mockFile = new Blob(['%PDF-1.4...'], { type: 'application/pdf' });
    formData.append('job_description', mockFile, 'job_description.pdf');
    formData.append('candidate_a_resume', mockFile, 'resume_a.pdf');
    formData.append('candidate_a_transcript', mockFile, 'transcript_a.pdf');
    formData.append('candidate_b_resume', mockFile, 'resume_b.pdf');
    formData.append('candidate_b_transcript', mockFile, 'transcript_b.pdf');

    const request = new Request('http://localhost/api/extract', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.job_description.text).toBe('Mocked PDF Content Text');
    expect(data.data.job_description.pages).toBe(1);
    expect(data.data.job_description.name).toBe('job_description.pdf');
  });
});
