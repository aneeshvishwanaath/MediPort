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

const pharmacySchema = z.object({
  name: z.string().min(1, 'Pharmacy name is required'),
  address: z.string().min(1, 'Address is required'),
});

type PharmacyFormData = z.infer<typeof pharmacySchema>;

export default function AddPharmacyPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const pharmacyDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'pharmacies', user.uid) : null),
    [firestore, user]
  );
  const { data: pharmacyData, isLoading: isPharmacyLoading } = useDoc(pharmacyDocRef);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacySchema),
  });

  useEffect(() => {
    if (pharmacyData) {
      reset(pharmacyData);
    }
  }, [pharmacyData, reset]);

  const onSubmit = async (data: PharmacyFormData) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add or edit pharmacy details.',
      });
      return;
    }

    try {
      await setDoc(doc(firestore, 'pharmacies', user.uid), {
        ...data,
        id: user.uid,
        updatedAt: new Date(),
      }, { merge: true });
      toast({
        title: 'Pharmacy Details Saved',
        description: 'Your pharmacy details have been saved successfully.',
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
  
  if (isPharmacyLoading) {
    return <div>Loading details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Pharmacy Details</CardTitle>
          <CardDescription>
            Enter or update the details for your pharmacy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pharmacy Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
            <Button type="submit">Save Details</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
