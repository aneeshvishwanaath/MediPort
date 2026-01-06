'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MedicationConflictChecker } from '@/components/medication-conflict-checker';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrescriptionsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const patientDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `patients`, user.uid) : null),
    [firestore, user]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  const prescriptionsQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `patients/${user.uid}/prescriptions`)) : null),
    [firestore, user]
  );
  const { data: currentPrescriptions, isLoading: arePrescriptionsLoading } = useCollection(prescriptionsQuery);


  if (isUserLoading || isPatientLoading || arePrescriptionsLoading) {
    return <div>Loading prescriptions...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center">
        <p>No patient profile found. Please create one to manage prescriptions.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/profile-edit">Create Profile</Link>
        </Button>
      </div>
    );
  }
  
  const pastMedications = patient.pastMedications || [];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Medication & Prescription Hub
        </h2>
        <p className="text-muted-foreground">
          Manage your prescriptions and check for medication conflicts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Prescribed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(currentPrescriptions || []).length > 0 ? (
                    currentPrescriptions?.map((med: any) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.medicationName}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.doctorName}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No current prescriptions.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Discontinued</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastMedications.length > 0 ? (
                    pastMedications.map((med: any) => (
                      <TableRow key={med.name}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.reason}</TableCell>
                        <TableCell>{med.discontinued}</TableCell>
                      </TableRow>
                    ))
                   ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No past medications recorded.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <MedicationConflictChecker patient={patient} />
        </div>
      </div>
    </div>
  );
}
