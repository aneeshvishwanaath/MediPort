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
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const doctorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  hospitalId: z.string().min(1, 'Hospital ID is required'),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export default function AddDoctorPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const doctorDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'doctors', user.uid) : null),
    [firestore, user]
  );
  const { data: doctorData, isLoading: isDoctorLoading } = useDoc(doctorDocRef);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
  });

  useEffect(() => {
    if (doctorData) {
      reset(doctorData);
    }
  }, [doctorData, reset]);

  const onSubmit = async (data: DoctorFormData) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add or edit a doctor profile.',
      });
      return;
    }

    try {
      await setDoc(doc(firestore, 'doctors', user.uid), {
        ...data,
        id: user.uid,
        updatedAt: new Date(),
      }, { merge: true });
      toast({
        title: 'Profile Updated',
        description: 'Your doctor profile has been created/updated successfully.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  if (isDoctorLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
          <CardDescription>
            Enter or update your professional details. This will be visible to patients and other professionals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" {...register('specialization')} />
              {errors.specialization && (
                <p className="text-sm text-destructive">{errors.specialization.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospitalId">Hospital ID</Label>
              <Input id="hospitalId" {...register('hospitalId')} />
              {errors.hospitalId && (
                <p className="text-sm text-destructive">{errors.hospitalId.message}</p>
              )}
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
