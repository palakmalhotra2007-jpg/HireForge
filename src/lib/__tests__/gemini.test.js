import { callGemini } from '../gemini';

// Mock the @google/genai module
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockImplementation(async ({ contents }) => {
            if (contents.includes('return error')) {
              throw new Error('API Error');
            }
            if (contents.includes('invalid json')) {
              return {
                text: 'this is not valid json'
              };
            }
            return {
              text: JSON.stringify({ result: 'success', data: 'mocked data' })
            };
          })
        }
      };
    })
  };
});

describe('callGemini', () => {
  it('should successfully return parsed JSON from Gemini API', async () => {
    const systemPrompt = 'System instruction';
    const promptText = 'Describe the candidate';

    const result = await callGemini(systemPrompt, promptText);
    expect(result).toEqual({ result: 'success', data: 'mocked data' });
  });

  it('should throw an error if the API call throws an error', async () => {
    const systemPrompt = 'System instruction';
    const promptText = 'return error';

    await expect(callGemini(systemPrompt, promptText)).rejects.toThrow('API Error');
  });

  it('should throw an error if the response is not valid JSON', async () => {
    const systemPrompt = 'System instruction';
    const promptText = 'invalid json';

    await expect(callGemini(systemPrompt, promptText)).rejects.toThrow('Invalid JSON returned from model');
  });

  it('should resolve function-backed Gemini text responses before parsing JSON', async () => {
    const systemPrompt = 'System instruction';
    const promptText = 'function response';

    const { GoogleGenAI } = jest.requireMock('@google/genai');
    const mockGenerateContent = GoogleGenAI.mock.results[0].value.models.generateContent;
    mockGenerateContent.mockResolvedValueOnce({
      text: () => Promise.resolve(JSON.stringify({ result: 'success', fromFunction: true }))
    });

    const result = await callGemini(systemPrompt, promptText);
    expect(result).toEqual({ result: 'success', fromFunction: true });
  });
});
