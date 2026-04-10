import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found in .env');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // The SDK doesn't have a direct listModels, but we can try a fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    console.log('--- AVAILABLE MODELS BY GOOGLE AI STUDIO ---');
    if (data.models) {
      data.models.forEach(
        (m: { name: string; supportedGenerationMethods: string[] }) => {
          console.log(
            `- ${m.name} (Methods: ${m.supportedGenerationMethods?.join(', ')})`,
          );
        },
      );
    } else {
      console.log(
        'No models returned. API Key might be invalid or restricted.',
      );
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
    console.log('--------------------------------------------');
  } catch (e: unknown) {
    console.error('Error listing models:', (e as Error).message);
  }
}

listModels();
