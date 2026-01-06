'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  BookUser,
  Dna,
  Factory,
  Leaf,
  MapPin,
  Stethoscope,
  FileText,
  Anchor,
  ArrowLeft,
  PlusCircle,
  Upload,
  HeartPulse,
  Siren,
} from 'lucide-react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import PrescriptionsView from './_components/prescriptions-view';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function PatientProfileViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const patientId = params.id as string;
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const patientDocRef = useMemoFirebase(
    () => (patientId ? doc(firestore, `patients`, patientId) : null),
    [firestore, patientId]
  );
  const {
    data: patient,
    isLoading: isPatientLoading,
    error,
  } = useDoc(patientDocRef);

  const view = searchParams.get('view');

  const DetailItem = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string | number | undefined | React.ReactNode;
    icon?: React.ElementType;
  }) => (
    <div className="flex justify-between py-3">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-right">{value || 'N/A'}</span>
    </div>
  );

  if (isAuthLoading || isPatientLoading || isUserDataLoading) {
    return <div>Loading profile...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center">
        <p>Patient profile not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (view === 'prescriptions') {
    return (
      <PrescriptionsView
        patient={patient}
        patientId={patientId}
        userRole={userData?.role}
      />
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return '';
    if (!lastName) return firstName.charAt(0);
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const emergencyContacts = patient.emergencyContacts || [];
  const familyHistory = patient.familyHistory || [];
  const pastMedications = patient.pastMedications || [];
  const surgeries = patient.surgeries || [];
  const allergies = patient.allergies || [];
  const chronicIllnesses = patient.chronicIllnesses || [];


  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          {userData?.role === 'doctor' && (
            <Button
              onClick={() =>
                router.push(`/dashboard/patient/${patientId}/add-prescription`)
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Prescription
            </Button>
          )}
          {userData?.role === 'lab' && (
            <Button
              onClick={() =>
                router.push(`/dashboard/patient/${patientId}/upload-report`)
              }
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Report
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={patient.avatarUrl || undefined}
                  alt={`${patient.firstName} ${patient.lastName}`}
                />
                <AvatarFallback>
                  {getInitials(patient.firstName, patient.lastName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold font-headline">{`${patient.firstName} ${patient.lastName}`}</h3>
              <p className="text-muted-foreground">{patient.age} years old</p>
              <Badge variant="secondary" className="mt-2">
                {patient.medicalPortfolioId}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vitals & Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailItem
                label="Height"
                value={`${patient.height || 'N/A'} cm`}
              />
              <Separator />
              <DetailItem
                label="Weight"
                value={`${patient.weight || 'N/A'} kg`}
              />
              <Separator />
              <DetailItem label="BMI" value={patient.bmi} />
              <Separator />
              <DetailItem label="Blood Group" value={patient.bloodGroup} />
              <Separator />
              <DetailItem
                label="Occupation"
                value={patient.occupation}
                icon={Stethoscope}
              />
              <Separator />
              <DetailItem
                label="Village/Locality"
                value={patient.village}
                icon={MapPin}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailItem
                label="Visible Marks"
                value={patient.identificationMarks}
                icon={Anchor}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal & Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailItem
                label="Personal History"
                value={patient.personalHistory}
                icon={BookUser}
              />
              <Separator />
              <DetailItem
                label="Cancer History"
                value={patient.cancerHistory}
                icon={Factory}
              />
              <Separator />
              <DetailItem
                label="Genetic History"
                value={patient.geneticHistory}
                icon={Dna}
              />
              <Separator />
              <DetailItem
                label="Alternative Medicines"
                value={patient.otherMedicines}
                icon={Leaf}
              />
              <Separator />
              <DetailItem
                label="Bowel Habits"
                value={patient.bowelHabits}
                icon={FileText}
              />
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Siren className="text-destructive" />Allergies
              </CardTitle>
              <CardDescription>Known allergies and their severity.</CardDescription>
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

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse />Chronic Illnesses
              </CardTitle>
              <CardDescription>Long-term health conditions being managed.</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {emergencyContacts.length > 0 ? (
                emergencyContacts.map((contact: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between py-2">
                      <span className="text-sm font-medium">
                        {contact.name}{' '}
                        <Badge variant="outline">{contact.relation}</Badge>
                      </span>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-sm text-primary hover:underline font-mono"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    {index < emergencyContacts.length - 1 && <Separator />}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No emergency contacts added.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Past Medications</CardTitle>
              <CardDescription>Medications the patient is no longer taking.</CardDescription>
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
          
           <Card>
            <CardHeader>
              <CardTitle>Surgeries</CardTitle>
              <CardDescription>Record of past surgical procedures.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surgeries.length > 0 ? (
                    surgeries.map((surgery: any) => (
                      <TableRow key={surgery.procedureName}>
                        <TableCell className="font-medium">{surgery.procedureName}</TableCell>
                        <TableCell>{surgery.date}</TableCell>
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

          <Card>
            <CardHeader>
              <CardTitle>Family Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              {familyHistory.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside">
                  {familyHistory.map((item: string) => (
                    <li key={item} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No family history recorded.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    