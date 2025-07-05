'use server';

/**
 * @fileOverview Generates a list of diverse and relevant recipes based on the identified ingredients.
 *
 * - generateRecipes - A function that handles the recipe generation process.
 * - GenerateRecipesInput - The input type for the generateRecipes function.
 * - GenerateRecipesOutput - The return type for the generateRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('An array of identified ingredients to base the recipe generation on.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

const GenerateRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      summary: z.string().describe('A short summary of the recipe.'),
    })
  ),
});
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;

export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {schema: GenerateRecipesInputSchema},
  output: {schema: GenerateRecipesOutputSchema},
  prompt: `You are a recipe expert. Generate a diverse list of recipes based on the following ingredients:

Ingredients: {{ingredients}}

Each recipe should include the recipe name and a short summary.

Format your response as a JSON object that matches the following schema: {{outputSchema}}`,
});

const generateRecipesFlow = ai.defineFlow(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: GenerateRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
