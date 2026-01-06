'use client';
import Image from 'next/image';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { AlertTriangle, Droplets, HeartPulse, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function QrCodePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const patientDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `patients`, user.uid) : null),
    [firestore, user]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  const [emergencyUrl, setEmergencyUrl] = React.useState('');
  const [qrCodeUrl, setQrCodeUrl] = React.useState('');
  
  React.useEffect(() => {
    if (user) {
        const url = `${window.location.origin}/emergency/${user.uid}`;
        setEmergencyUrl(url);
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`);
    }
  }, [user]);


  if (isUserLoading || isPatientLoading) {
    return <div>Loading QR Code...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center">
        <p>No patient profile found. Please create one to generate a QR code.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/profile-edit">Create Profile</Link>
        </Button>
      </div>
    );
  }
  
  const severeAllergies = (patient.allergies || []).filter((a: any) => a.severity === 'Severe');
  const chronicIllnesses = patient.chronicIllnesses || [];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Emergency QR Access
        </h2>
        <p className="text-muted-foreground">
          Generate a QR code for your wallet or phone that gives emergency
          responders critical information without a login.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-col items-center justify-center p-8">
          <CardTitle className="mb-4">Your Emergency QR Code</CardTitle>
          <div className="bg-white p-4 rounded-lg shadow-md">
            {qrCodeUrl ? (
                <Image
                    src={qrCodeUrl}
                    alt="Emergency QR Code"
                    width={300}
                    height={300}
                    unoptimized // External image, not optimized by Next/image by default
                />
            ) : (
                <div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">
                    <p>Generating...</p>
                </div>
            )}
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Scan this code to see your public emergency profile. Print it or save
            it to your phone.
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information Shared via QR</CardTitle>
            <CardDescription>
              Only the following life-saving information is accessible through
              the QR code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <User className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Personal Info</h4>
                <p className="text-sm text-muted-foreground">
                  {patient.firstName} {patient.lastName}, {patient.age} years old
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Droplets className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Blood Group</h4>
                <p className="text-sm text-muted-foreground">
                  {patient.bloodGroup || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
              <div>
                <h4 className="font-semibold">Severe Allergies</h4>
                <p className="text-sm text-muted-foreground">
                  {severeAllergies.length > 0 ? severeAllergies.map((a: any) => a.allergen).join(', ') : 'None specified'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <HeartPulse className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Chronic Conditions</h4>
                <p className="text-sm text-muted-foreground">
                   {chronicIllnesses.length > 0 ? chronicIllnesses.map((i: any) => i.illness).join(', ') : 'None specified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
