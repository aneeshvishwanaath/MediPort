'use client';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SurgeriesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const patientDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `patients`, user.uid) : null),
    [firestore, user]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  if (isUserLoading || isPatientLoading) {
    return <div>Loading surgery history...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center">
        <p>No patient profile found. Please create one to view surgery history.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/profile-edit">Create Profile</Link>
        </Button>
      </div>
    );
  }
  
  const allSurgeries = patient.surgeries || [];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Surgeries & Procedures
        </h2>
        <p className="text-muted-foreground">
          A log of your past and upcoming procedures. You can add more from the 'Edit Profile' page.
        </p>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Procedure History</CardTitle>
            <CardDescription>
              Records of completed and scheduled surgical procedures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSurgeries.length > 0 ? (
                  allSurgeries.map((surgery: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {surgery.date}
                      </TableCell>
                      <TableCell>{surgery.procedureName}</TableCell>
                      <TableCell>{surgery.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No surgeries recorded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
