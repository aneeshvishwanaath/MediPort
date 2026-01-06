'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type PrescriptionsViewProps = {
  patient: any;
  patientId: string;
  userRole?: string;
};

export default function PrescriptionsView({ patient, patientId, userRole }: PrescriptionsViewProps) {
  const router = useRouter();
  const firestore = useFirestore();

  const prescriptionsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, `patients/${patientId}/prescriptions`))
        : null,
    [firestore, patientId]
  );
  const { data: prescriptions, isLoading: isLoadingPrescriptions } = useCollection(prescriptionsQuery);
  
  const pastMedications = patient.pastMedications || [];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
         <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            {patient.firstName}'s Prescriptions
          </h2>
          <p className="text-muted-foreground">
            Manage prescriptions and check for medication conflicts.
          </p>
        </div>
        {userRole === 'doctor' && (
          <Button onClick={() => router.push(`/dashboard/patient/${patientId}/add-prescription`)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Prescription
          </Button>
        )}
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
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPrescriptions ? (
                     <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (prescriptions || []).length > 0 ? (
                    prescriptions?.map((med: any) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">
                          {med.medicationName}
                        </TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.doctorName || 'N/A'}</TableCell>
                        <TableCell>{med.startDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
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
