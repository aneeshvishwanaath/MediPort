'use client';
import { useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, HeartPulse, ShieldAlert, Syringe, Phone, Dna, Factory } from 'lucide-react';
import { MediPortLogo } from '@/components/icons';
import { useParams } from 'next/navigation';

export default function EmergencyPage() {
  const firestore = useFirestore();
  const params = useParams();
  const patientId = params.id as string;
  
  const patientDocRef = useMemoFirebase(
    () => (patientId ? doc(firestore, `patients`, patientId) : null),
    [firestore, patientId]
  );
  const { data: patient, isLoading: isPatientLoading } = useDoc(patientDocRef);

  const prescriptionsQuery = useMemoFirebase(
    () => (patientId ? query(collection(firestore, `patients/${patientId}/prescriptions`)) : null),
    [firestore, patientId]
  );
  const { data: currentMedications, isLoading: areMedicationsLoading } = useCollection(prescriptionsQuery);

  const isLoading = isPatientLoading || areMedicationsLoading;

  if (isLoading) {
    return (
        <div className="min-h-screen bg-destructive text-destructive-foreground flex flex-col items-center justify-center p-4">
            <p>Loading emergency information...</p>
        </div>
    );
  }

  if (!patient) {
     return (
        <div className="min-h-screen bg-destructive text-destructive-foreground flex flex-col items-center justify-center p-4">
             <AlertCircle className="h-16 w-16 mb-4" />
             <h1 className="text-4xl font-bold text-center font-headline">Patient Not Found</h1>
             <p className='mt-4'>The requested medical profile could not be found.</p>
        </div>
    );
  }
  
  const severeAllergies = (patient.allergies || []).filter((a: any) => a.severity === 'Severe');
  const chronicIllnesses = patient.chronicIllnesses || [];
  const emergencyContacts = patient.emergencyContacts || [];


  return (
    <div className="min-h-screen bg-destructive text-destructive-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="flex flex-col items-center mb-6">
          <AlertCircle className="h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold text-center font-headline">Emergency Medical Information</h1>
        </header>

        <main className="space-y-4">
          <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="text-2xl text-destructive-foreground/90">{patient.firstName} {patient.lastName}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="font-bold">Blood Group</p>
                <p className="text-3xl font-mono">{patient.bloodGroup || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold">Date of Birth</p>
                <p>{patient.dateOfBirth} ({patient.age} years old)</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive-foreground/90"><ShieldAlert /> Critical Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              {severeAllergies.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside">
                    {severeAllergies.map((allergy: any) => (
                    <li key={allergy.allergen} className="text-lg">
                        <span className="font-bold">{allergy.allergen}</span> - Severity: {allergy.severity}
                    </li>
                    ))}
                </ul>
              ) : (
                <p className='text-lg'>No severe allergies recorded.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive-foreground/90"><HeartPulse /> Chronic Conditions</CardTitle>
            </CardHeader>
            <CardContent>
               {chronicIllnesses.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside">
                        {chronicIllnesses.map((illness: any) => (
                        <li key={illness.illness} className="text-lg">{illness.illness}</li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-lg'>No chronic conditions recorded.</p>
                )}
            </CardContent>
          </Card>
          
           <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive-foreground/90"><Factory /> Cancer History</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-lg'>{patient.cancerHistory || 'No cancer history recorded.'}</p>
            </CardContent>
          </Card>

           <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive-foreground/90"><Dna /> Genetic History</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-lg'>{patient.geneticHistory || 'No genetic history recorded.'}</p>
            </CardContent>
          </Card>

          <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive-foreground/90"><Syringe /> Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              {(currentMedications || []).length > 0 ? (
                <ul className="space-y-2 list-disc list-inside">
                    {currentMedications?.map((med: any) => (
                    <li key={med.id} className="text-lg">{med.medicationName} ({med.dosage})</li>
                    ))}
                </ul>
               ) : (
                <p className='text-lg'>No current medications recorded.</p>
               )}
            </CardContent>
          </Card>
          
           <Card className="bg-destructive-foreground/10 border-destructive-foreground/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive-foreground/90"><Phone /> Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
               {emergencyContacts.length > 0 ? (
                <ul className="space-y-2">
                    {emergencyContacts.map((contact: any) => (
                    <li key={contact.name} className="text-lg">
                        <span className="font-bold">{contact.name}</span> ({contact.relation}): <a href={`tel:${contact.phone}`} className="underline">{contact.phone}</a>
                    </li>
                    ))}
                </ul>
                ) : (
                    <p className='text-lg'>No emergency contacts recorded.</p>
                )}
            </CardContent>
          </Card>

        </main>
        
        <footer className="text-center mt-8 text-destructive-foreground/70">
          <p className="flex items-center justify-center gap-2">Powered by <MediPortLogo className="w-5 h-5" /> MediPort</p>
          <p className="text-xs mt-2">MPI: {patient.medicalPortfolioId}</p>
        </footer>
      </div>
    </div>
  );
}
