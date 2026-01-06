'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Siren } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';

export default function PatientDashboard() {
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
  
  const reportsQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `patients/${user.uid}/medicalReports`)) : null),
    [firestore, user]
  );
  const { data: labReports, isLoading: areReportsLoading } = useCollection(reportsQuery);

  if (isUserLoading || isPatientLoading || arePrescriptionsLoading || areReportsLoading) {
    return <div>Loading dashboard...</div>;
  }
  
  if (!patient) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Welcome to MediPort!</CardTitle>
                <CardDescription>It looks like your patient profile isn't set up yet.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Create your profile to start managing your health information securely.</p>
                <Button asChild>
                    <Link href="/dashboard/profile-edit">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Your Profile
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const allergies = patient.allergies || [];

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Welcome back, {patient.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Here's a summary of your medical portfolio.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/profile-edit">
              <PlusCircle className="mr-2 h-4 w-4" /> Edit Your Profile
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Group</CardTitle>
            <Siren className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patient.bloodGroup || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Critical for emergencies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allergies.length}</div>
            <p className="text-xs text-muted-foreground">
              {allergies.filter((a: any) => a.severity === 'Severe').length} severe
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(currentPrescriptions || []).length}</div>
            <p className="text-xs text-muted-foreground">
              Prescribed by various doctors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-code">{patient.medicalPortfolioId}</div>
            <p className="text-xs text-muted-foreground">
              Your unique portfolio ID
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
            <CardDescription>
              You have {(currentPrescriptions || []).length} active prescriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Prescribed By
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(currentPrescriptions || []).length > 0 ? (
                  currentPrescriptions?.map((med: any) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-medium">{med.medicationName}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {med.doctorName}
                      </TableCell>
                       <TableCell className="hidden md:table-cell">
                        {med.startDate}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No prescriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Lab Reports</CardTitle>
            <CardDescription>
              You have {(labReports || []).length} reports in total.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {(labReports || []).length > 0 ? (
                <div className=" space-y-4">
                {labReports?.map((report: any) => (
                    <div key={report.id} className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{report.reportName}</p>
                        <p className="text-sm text-muted-foreground">Date: {report.uploadDate}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                        <Link href={report.fileUrl}>View</Link>
                    </Button>
                    </div>
                ))}
                </div>
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    No lab reports found.
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
