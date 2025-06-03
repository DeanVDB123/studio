// src/ai/flows/generate-biography-draft.ts
'use server';
/**
 * @fileOverview An AI agent that generates an initial draft of a biography for a memorial page.
 *
 * - generateBiographyDraft - A function that generates the biography draft.
 * - GenerateBiographyDraftInput - The input type for the generateBiographyDraft function.
 * - GenerateBiographyDraftOutput - The return type for the generateBiographyDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBiographyDraftInputSchema = z.object({
  name: z.string().describe('The name of the deceased person.'),
  birthDate: z.string().describe('The birth date of the deceased person.'),
  deathDate: z.string().describe('The death date of the deceased person.'),
  lifeSummary: z.string().describe('A summary of the life of the deceased person.'),
});
export type GenerateBiographyDraftInput = z.infer<typeof GenerateBiographyDraftInputSchema>;

const GenerateBiographyDraftOutputSchema = z.object({
  biographyDraft: z.string().describe('The generated biography draft.'),
});
export type GenerateBiographyDraftOutput = z.infer<typeof GenerateBiographyDraftOutputSchema>;

export async function generateBiographyDraft(input: GenerateBiographyDraftInput): Promise<GenerateBiographyDraftOutput> {
  return generateBiographyDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBiographyDraftPrompt',
  input: {schema: GenerateBiographyDraftInputSchema},
  output: {schema: GenerateBiographyDraftOutputSchema},
  prompt: `You are a professional biographer who specializes in writing respectful and heartfelt biographies for memorial pages.

  Based on the information provided, write an initial draft of a biography for the deceased person.

  Name: {{{name}}}
  Birth Date: {{{birthDate}}}
  Death Date: {{{deathDate}}}
  Life Summary: {{{lifeSummary}}}

  Biography Draft:`,
});

const generateBiographyDraftFlow = ai.defineFlow(
  {
    name: 'generateBiographyDraftFlow',
    inputSchema: GenerateBiographyDraftInputSchema,
    outputSchema: GenerateBiographyDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
