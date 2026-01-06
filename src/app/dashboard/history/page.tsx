'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { FileDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const patientDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `patients`, user.uid) : null),
    [firestore, user]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  const reportsQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `patients/${user.uid}/medicalReports`)) : null),
    [firestore, user]
  );
  const { data: labReports, isLoading: areReportsLoading } = useCollection(reportsQuery);

  if (isUserLoading || isPatientLoading || areReportsLoading) {
    return <div>Loading medical history...</div>;
  }
  
  if (!patient) {
     return (
      <div className="text-center">
        <p>No patient profile found. Please create one to view history.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/profile-edit">Create Profile</Link>
        </Button>
      </div>
    );
  }
  
  const allergies = patient.allergies || [];
  const chronicIllnesses = patient.chronicIllnesses || [];
  const hospitalizations = patient.hospitalizations || [];


  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Medical History
        </h2>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Upload Report (Disabled)
        </Button>
      </div>

      <Tabs defaultValue="allergies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="chronic_illnesses">Chronic Illnesses</TabsTrigger>
          <TabsTrigger value="lab_reports">Lab Reports</TabsTrigger>
          <TabsTrigger value="hospitalizations">Hospitalizations</TabsTrigger>
        </TabsList>
        <TabsContent value="allergies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allergy Tracker</CardTitle>
              <CardDescription>
                A record of all known allergies and their severity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Allergen</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Triggers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allergies.length > 0 ? (
                    allergies.map((allergy: any) => (
                      <TableRow key={allergy.allergen}>
                        <TableCell className="font-medium">
                          {allergy.allergen}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              allergy.severity === 'Severe'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {allergy.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{allergy.triggers}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No allergies recorded.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chronic_illnesses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chronic Illness Timeline</CardTitle>
              <CardDescription>
                Long-term health conditions being managed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Illness</TableHead>
                    <TableHead>Date Diagnosed</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chronicIllnesses.length > 0 ? (
                    chronicIllnesses.map((illness: any) => (
                      <TableRow key={illness.illness}>
                        <TableCell className="font-medium">
                          {illness.illness}
                        </TableCell>
                        <TableCell>{illness.diagnosed}</TableCell>
                        <TableCell>{illness.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No chronic illnesses recorded.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lab_reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Reports</CardTitle>
              <CardDescription>
                Uploaded reports from diagnostic labs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(labReports || []).length > 0 ? (
                    labReports?.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.reportName}
                        </TableCell>
                        <TableCell>{report.uploadDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.reportType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={report.fileUrl}>
                              <FileDown className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No lab reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hospitalizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospitalization History</CardTitle>
              <CardDescription>Record of hospital admissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitalizations.length > 0 ? (
                    hospitalizations.map((item: any) => (
                      <TableRow key={item.date}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell>{item.hospital}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{item.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No hospitalizations recorded.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
