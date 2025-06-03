// src/ai/flows/organize-user-content.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to organize user-generated content for a memorial page.
 *
 * - organizeUserContent - A function that takes user-generated content and returns an organized structure for the memorial page.
 * - OrganizeUserContentInput - The input type for the organizeUserContent function.
 * - OrganizeUserContentOutput - The output type for the organizeUserContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrganizeUserContentInputSchema = z.object({
  biography: z.string().describe('The biography of the deceased.'),
  tributes: z.array(z.string()).describe('A list of tributes to the deceased.'),
  stories: z.array(z.string()).describe('A list of stories about the deceased.'),
  photosDataUris: z
    .array(z.string())
    .describe(
      'A list of photos of the deceased, as data URIs that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type OrganizeUserContentInput = z.infer<typeof OrganizeUserContentInputSchema>;

const OrganizeUserContentOutputSchema = z.object({
  organizedContent: z.object({
    biography: z.string().describe('The organized biography of the deceased.'),
    tributes: z.array(z.string()).describe('The organized list of tributes to the deceased.'),
    stories: z.array(z.string()).describe('The organized list of stories about the deceased.'),
    photoGallery: z
      .array(z.string())
      .describe('The organized list of photo data URIs for the deceased.'),
  }).describe('The organized content for the memorial page.'),
});
export type OrganizeUserContentOutput = z.infer<typeof OrganizeUserContentOutputSchema>;

export async function organizeUserContent(input: OrganizeUserContentInput): Promise<OrganizeUserContentOutput> {
  return organizeUserContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'organizeUserContentPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: OrganizeUserContentInputSchema},
  output: {schema: OrganizeUserContentOutputSchema},
  prompt: `You are an AI assistant that helps organize user-generated content for a memorial page.

  You will receive the biography, tributes, stories, and photos of the deceased. You will then organize the content into a well-structured and easy-to-navigate format.

  Here is the user-generated content:

  Biography: {{{biography}}}
  Tributes: {{#each tributes}}{{{this}}}{{/each}}
  Stories: {{#each stories}}{{{this}}}{{/each}}
  Photos: {{#each photosDataUris}}{{media url=this}}{{/each}}

  Return the organized content in the following JSON format:
  {{json organizedContent}}
  `,
});

const organizeUserContentFlow = ai.defineFlow(
  {
    name: 'organizeUserContentFlow',
    inputSchema: OrganizeUserContentInputSchema,
    outputSchema: OrganizeUserContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
