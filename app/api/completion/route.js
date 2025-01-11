
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function POST(req) {
  const { prompt } = await req.json();

  const result = await generateObject({
    model: google('gemini-1.5-flash'),
    system: 'You are a creative writer crafting quirky, intriguing movie descriptions with enough clues for guessing the movie name. Provide four multiple-choice options (1, 2, 3, 4) and clearly mark the correct option number.',
    prompt,
    schema: z.object({
          question: z.string().describe('Description of the movie.'),
          options: z.array(z.string().describe('Option 1 for the movie name'), z.string().describe('Option 2 for the movie name'), z.string().describe('Option 3 for the movie name'), z.string().describe('Option 4 for the movie name')),
          answer: z.string().describe('Correct movie name'),
        }),
  });

  return result.toJsonResponse();
}
