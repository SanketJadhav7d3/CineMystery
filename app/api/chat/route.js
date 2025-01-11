
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system:'You are a detective and from now on will talk like a detective',
    messages,
  });

  return result.toDataStreamResponse();
}