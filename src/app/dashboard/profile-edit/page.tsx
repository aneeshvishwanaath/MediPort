'use client';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodGroup: z.string().optional(),
  occupation: z.string().optional(),
  village: z.string().optional(),
  personalHistory: z.string().optional(),
  cancerHistory: z.string().optional(),
  otherMedicines: z.string().optional(),
  bowelHabits: z.string().optional(),
  geneticHistory: z.string().optional(),
  identificationMarks: z.string().optional(),
  emergencyContacts: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    relation: z.string().min(1, "Relation is required"),
    phone: z.string().min(1, "Phone is required"),
  })).optional(),
  familyHistory: z.array(z.object({ value: z.string() })).optional(),
  allergies: z.array(z.object({
    allergen: z.string().min(1, "Allergen is required"),
    severity: z.string().min(1, "Severity is required"),
    triggers: z.string().optional(),
  })).optional(),
  chronicIllnesses: z.array(z.object({
    illness: z.string().min(1, "Illness is required"),
    diagnosed: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
   pastMedications: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    reason: z.string().optional(),
    discontinued: z.string().optional(),
  })).optional(),
  surgeries: z.array(z.object({
    procedureName: z.string().min(1, "Procedure is required"),
    date: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const patientDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `patients`, user.uid) : null),
    [firestore, user]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = form;

  useEffect(() => {
    if (patient) {
      reset({
        ...patient,
        height: patient.height?.toString(),
        weight: patient.weight?.toString(),
        familyHistory: (patient.familyHistory || []).map((value: string) => ({ value }))
      });
    }
  }, [patient, reset]);
  
  const { fields: emergencyContactFields, append: appendEmergencyContact, remove: removeEmergencyContact } = useFieldArray({ control, name: "emergencyContacts" });
  const { fields: familyHistoryFields, append: appendFamilyHistory, remove: removeFamilyHistory } = useFieldArray({ control, name: "familyHistory" });
  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({ control, name: "allergies" });
  const { fields: chronicIllnessFields, append: appendChronicIllness, remove: removeChronicIllness } = useFieldArray({ control, name: "chronicIllnesses" });
  const { fields: pastMedicationFields, append: appendPastMedication, remove: removePastMedication } = useFieldArray({ control, name: "pastMedications" });
  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = useFieldArray({ control, name: "surgeries" });


  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to edit your profile.',
      });
      return;
    }

    try {
        const patientRef = doc(firestore, `patients`, user.uid);
        const dataToSave = {
          ...data,
          height: data.height ? parseFloat(data.height) : null,
          weight: data.weight ? parseFloat(data.weight) : null,
          familyHistory: data.familyHistory?.map(item => item.value).filter(Boolean), // transform back to array of strings
          id: user.uid,
          ownerId: user.uid, // The patient owns their own record
          medicalPortfolioId: patient?.medicalPortfolioId || `MPI-${user.uid.substring(0, 8).toUpperCase()}`,
          age: new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear(),
          updatedAt: new Date(),
        };

        await setDoc(patientRef, dataToSave, { merge: true });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      router.push('/dashboard/profile');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  if (isPatientLoading) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Patient Profile</CardTitle>
            <CardDescription>Update your personal and medical information. All fields are optional except where marked.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                      {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" {...register('gender')} />
                      {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                  </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" {...register('occupation')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="village">Village/Locality</Label>
                    <Input id="village" {...register('village')} />
                </div>
              </div>
               <div className="space-y-2">
                    <Label htmlFor="identificationMarks">Identification Marks</Label>
                    <Textarea id="identificationMarks" {...register('identificationMarks')} />
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Vitals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input id="height" type="number" {...register('height')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" type="number" {...register('weight')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" {...register('bloodGroup')} />
                    </div>
                </div>
            </div>
            
            <Separator />

             <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical & Personal History</h3>
                <div className="space-y-2">
                    <Label htmlFor="personalHistory">Personal History</Label>
                    <Textarea id="personalHistory" {...register('personalHistory')} placeholder="e.g., smoker, alcoholic, etc." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cancerHistory">Cancer History</Label>
                    <Textarea id="cancerHistory" {...register('cancerHistory')} placeholder="Details of any cancer diagnosis or treatment." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="geneticHistory">Genetic History</Label>
                    <Textarea id="geneticHistory" {...register('geneticHistory')} placeholder="Details of any known genetic conditions." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="otherMedicines">Alternative Medicines</Label>
                    <Textarea id="otherMedicines" {...register('otherMedicines')} placeholder="e.g., Ayurveda, Homeopathy" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bowelHabits">Bowel Habits</Label>
                    <Textarea id="bowelHabits" {...register('bowelHabits')} />
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Emergency Contacts</h3>
                {emergencyContactFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <Input {...register(`emergencyContacts.${index}.name`)} placeholder="Name" />
                        <Input {...register(`emergencyContacts.${index}.relation`)} placeholder="Relation" />
                        <Input {...register(`emergencyContacts.${index}.phone`)} placeholder="Phone" />
                        <Button type="button" variant="destructive" onClick={() => removeEmergencyContact(index)}><Trash2 /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendEmergencyContact({ name: '', relation: '', phone: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
                </Button>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Family Medical History</h3>
                {familyHistoryFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                        <Input {...register(`familyHistory.${index}.value`)} placeholder="e.g., Diabetes (Mother)" />
                        <Button type="button" variant="destructive" onClick={() => removeFamilyHistory(index)}><Trash2 /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendFamilyHistory({ value: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add History
                </Button>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Allergies</h3>
                {allergyFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <Input {...register(`allergies.${index}.allergen`)} placeholder="Allergen (e.g., Penicillin)" />
                        <Input {...register(`allergies.${index}.severity`)} placeholder="Severity (e.g., Severe)" />
                        <Input {...register(`allergies.${index}.triggers`)} placeholder="Triggers" />
                        <Button type="button" variant="destructive" onClick={() => removeAllergy(index)}><Trash2 /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendAllergy({ allergen: '', severity: '', triggers: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Allergy
                </Button>
            </div>
            
             <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Chronic Illnesses</h3>
                {chronicIllnessFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <Input {...register(`chronicIllnesses.${index}.illness`)} placeholder="Illness (e.g., Asthma)" />
                        <Input type="date" {...register(`chronicIllnesses.${index}.diagnosed`)} placeholder="Date Diagnosed" />
                        <Input {...register(`chronicIllnesses.${index}.notes`)} placeholder="Notes" />
                        <Button type="button" variant="destructive" onClick={() => removeChronicIllness(index)}><Trash2 /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendChronicIllness({ illness: '', diagnosed: '', notes: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Illness
                </Button>
            </div>

             <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Past Medications</h3>
                {pastMedicationFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <Input {...register(`pastMedications.${index}.name`)} placeholder="Medication Name" />
                        <Input {...register(`pastMedications.${index}.reason`)} placeholder="Reason for taking" />
                        <Input {...register(`pastMedications.${index}.discontinued`)} placeholder="Date Discontinued" />
                        <Button type="button" variant="destructive" onClick={() => removePastMedication(index)}><Trash2 /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendPastMedication({ name: '', reason: '', discontinued: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Past Medication
                </Button>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Surgeries</h3>
                {surgeryFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <Input {...register(`surgeries.${index}.procedureName`)} placeholder="Procedure Name" />
                        <Input type="date" {...register(`surgeries.${index}.date`)} />
                        <Input {...register(`surgeries.${index}.notes`)} placeholder="Notes" />
                        <Button type="button" variant="destructive" onClick={() => removeSurgery(index)}><Trash2 /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendSurgery({ procedureName: '', date: '', notes: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Surgery
                </Button>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit">Save All Changes</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
