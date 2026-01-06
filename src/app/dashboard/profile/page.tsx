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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Edit, BookUser, Dna, Factory, Leaf, MapPin, Stethoscope, FileText, Anchor } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const patientDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `patients`, user.uid) : null),
    [firestore, user]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  const DetailItem = ({
    label,
    value,
    icon: Icon
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

  if (isUserLoading || isPatientLoading) {
    return <div>Loading profile...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center">
        <p>No patient profile found. Please create one.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/profile-edit">Create Profile</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return '';
    if (!lastName) return firstName.charAt(0);
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }
  
  const emergencyContacts = patient.emergencyContacts || [];
  const familyHistory = patient.familyHistory || [];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Patient Profile
        </h2>
        <Button variant="outline" asChild>
          <Link href="/dashboard/profile-edit">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.photoURL || undefined} alt={`${patient.firstName} ${patient.lastName}`} />
                <AvatarFallback>{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
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
              <DetailItem label="Height" value={`${patient.height || 'N/A'} cm`} />
              <Separator />
              <DetailItem label="Weight" value={`${patient.weight || 'N/A'} kg`} />
              <Separator />
              <DetailItem label="BMI" value={patient.bmi} />
              <Separator />
              <DetailItem label="Blood Group" value={patient.bloodGroup} />
               <Separator />
              <DetailItem label="Occupation" value={patient.occupation} icon={Stethoscope} />
               <Separator />
              <DetailItem label="Village/Locality" value={patient.village} icon={MapPin} />
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Identification</CardTitle>
            </CardHeader>
            <CardContent>
               <DetailItem label="Visible Marks" value={patient.identificationMarks} icon={Anchor}/>
            </CardContent>
          </Card>

        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal & Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailItem label="Personal History" value={patient.personalHistory} icon={BookUser} />
              <Separator />
              <DetailItem label="Cancer History" value={patient.cancerHistory} icon={Factory} />
               <Separator />
              <DetailItem label="Genetic History" value={patient.geneticHistory} icon={Dna} />
              <Separator />
              <DetailItem label="Alternative Medicines" value={patient.otherMedicines} icon={Leaf} />
              <Separator />
              <DetailItem label="Bowel Habits" value={patient.bowelHabits} icon={FileText} />
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
              ))) : (
                <p className='text-sm text-muted-foreground'>No emergency contacts added.</p>
              )}
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
                <p className='text-sm text-muted-foreground'>No family history recorded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
