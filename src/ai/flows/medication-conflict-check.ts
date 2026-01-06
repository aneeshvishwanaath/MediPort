'use server';

/**
 * @fileOverview Medication conflict check AI agent.
 *
 * - medicationConflictCheck - A function that handles the medication conflict check process.
 * - MedicationConflictCheckInput - The input type for the medicationConflictCheck function.
 * - MedicationConflictCheckOutput - The return type for the medicationConflictCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationConflictCheckInputSchema = z.object({
  currentPrescriptions: z
    .string()
    .describe('The patient\'s current list of prescriptions.'),
  pastMedications: z.string().describe('The patient\'s past medications.'),
  allergies: z.string().describe('The patient\'s allergies.'),
  healthConditions: z
    .string()
    .describe(
      'The patient\'s health conditions (heart/brain conditions, pregnancy status, reproductive health constraints).' + 
      'If patient is NOT pregnant, you can safely ignore pregnancy status during conflict checking.'
    ),
  newMedication: z.string().describe('The new medication being prescribed.'),
});
export type MedicationConflictCheckInput = z.infer<
  typeof MedicationConflictCheckInputSchema
>;

const MedicationConflictCheckOutputSchema = z.object({
  conflicts: z
    .string()
    .describe(
      'A detailed description of any potential conflicts between the new medication and the patient\'s current prescriptions, past medications, allergies, and health conditions. If no conflicts exist, explicitly state that no conflicts were found.'
    ),
});

export type MedicationConflictCheckOutput = z.infer<
  typeof MedicationConflictCheckOutputSchema
>;

export async function medicationConflictCheck(
  input: MedicationConflictCheckInput
): Promise<MedicationConflictCheckOutput> {
  return medicationConflictCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationConflictCheckPrompt',
  input: {schema: MedicationConflictCheckInputSchema},
  output: {schema: MedicationConflictCheckOutputSchema},
  prompt: `You are a highly experienced pharmacist specializing in identifying medication conflicts.

You will be provided with a patient's current prescriptions, past medications, allergies, health conditions, and a new medication being prescribed.

Your task is to analyze this information and identify any potential conflicts between the new medication and the patient's existing medical profile.

Be as specific as possible in describing the conflicts, including the specific medications or conditions involved and the potential consequences.

If no conflicts are found, explicitly state that no conflicts were identified.

Patient's Current Prescriptions: {{{currentPrescriptions}}}

Patient's Past Medications: {{{pastMedications}}}

Patient's Allergies: {{{allergies}}}

Patient's Health Conditions: {{{healthConditions}}}

New Medication Being Prescribed: {{{newMedication}}}`,
});

const medicationConflictCheckFlow = ai.defineFlow(
  {
    name: 'medicationConflictCheckFlow',
    inputSchema: MedicationConflictCheckInputSchema,
    outputSchema: MedicationConflictCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
