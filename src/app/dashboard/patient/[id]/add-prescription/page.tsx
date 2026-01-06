'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

const prescriptionSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export default function AddPrescriptionPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const doctorDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'doctors', user.uid) : null),
    [firestore, user]
  );
  const { data: doctorData, isLoading: isDoctorLoading } = useDoc(doctorDocRef);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    if (!user || !doctorData) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be a logged-in doctor to add a prescription.',
      });
      return;
    }

    try {
      const prescriptionsCollection = collection(
        firestore,
        `patients/${patientId}/prescriptions`
      );
      await addDoc(prescriptionsCollection, {
        ...data,
        patientId: patientId,
        doctorId: user.uid,
        doctorName: `${doctorData.firstName} ${doctorData.lastName}`,
        createdAt: new Date(),
      });
      toast({
        title: 'Prescription Added',
        description: `${data.medicationName} has been prescribed successfully.`,
      });
      router.push(`/dashboard/patient/${patientId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };
  
   if (isUserLoading || isDoctorLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Prescription</CardTitle>
          <CardDescription>
            Enter the details for the new prescription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicationName">Medication Name</Label>
              <Input id="medicationName" {...register('medicationName')} />
              {errors.medicationName && (
                <p className="text-sm text-destructive">
                  {errors.medicationName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage (e.g., 10mg)</Label>
              <Input id="dosage" {...register('dosage')} />
              {errors.dosage && (
                <p className="text-sm text-destructive">{errors.dosage.message}</p>
              )}
            </div>
             <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (e.g., Once a day)</Label>
              <Textarea id="frequency" {...register('frequency')} />
              {errors.frequency && (
                <p className="text-sm text-destructive">{errors.frequency.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register('endDate')} />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>
            <Button type="submit">Add Prescription</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
