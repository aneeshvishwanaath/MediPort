'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { medicationConflictCheck, MedicationConflictCheckInput, MedicationConflictCheckOutput } from '@/ai/flows/medication-conflict-check';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';

const formSchema = z.object({
  newMedication: z.string().min(2, { message: 'Medication name must be at least 2 characters.' }),
});

type ConflictCheckerProps = {
  patient: any; 
};

export function MedicationConflictChecker({ patient }: ConflictCheckerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MedicationConflictCheckOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const firestore = useFirestore();

  const prescriptionsQuery = useMemoFirebase(
    () => (patient ? query(collection(firestore, `patients/${patient.id}/prescriptions`)) : null),
    [firestore, patient]
  );
  const { data: currentPrescriptions } = useCollection(prescriptionsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newMedication: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    if (!patient) {
        setError('Patient data is not available.');
        setIsLoading(false);
        return;
    }

    const input: MedicationConflictCheckInput = {
      currentPrescriptions: (currentPrescriptions || []).map((m: any) => m.medicationName).join(', ') || 'None',
      pastMedications: (patient.pastMedications || []).map((m: any) => m.name).join(', ') || 'None',
      allergies: (patient.allergies || []).map((a: any) => a.allergen).join(', ') || 'None',
      healthConditions: [patient.personalHistory, patient.cancerHistory, patient.geneticHistory].filter(Boolean).join(', ') || 'None specified',
      newMedication: values.newMedication,
    };
    
    try {
      const response = await medicationConflictCheck(input);
      setResult(response);
    } catch (e) {
      setError('An error occurred while checking for conflicts. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const noConflictsFound = result?.conflicts.toLowerCase().includes('no conflict');

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Medication Conflict Check</CardTitle>
        <CardDescription>Check for potential conflicts with a new medication. This is an academic tool and does not replace professional medical advice.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newMedication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ibuprofen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || !patient}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check for Conflicts'
              )}
            </Button>
          </form>
        </Form>
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <Alert variant={noConflictsFound ? 'default' : 'destructive'} className="mt-6">
             {noConflictsFound ? (
                <CheckCircle2 className="h-4 w-4" />
             ) : (
                <AlertTriangle className="h-4 w-4" />
             )}
            <AlertTitle>{noConflictsFound ? "No Conflicts Found" : "Potential Conflicts Detected"}</AlertTitle>
            <AlertDescription>
                <div className="text-sm">{result.conflicts}</div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
