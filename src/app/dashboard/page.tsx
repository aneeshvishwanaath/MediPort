'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import PatientDashboard from '@/components/dashboards/patient-dashboard';
import DoctorDashboard from '@/components/dashboards/doctor-dashboard';
import ChemistDashboard from '@/components/dashboards/chemist-dashboard';
import LabDashboard from '@/components/dashboards/lab-dashboard';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  if (isUserLoading || isUserDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const renderDashboard = () => {
    switch (userData?.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'chemist':
        return <ChemistDashboard />;
      case 'lab':
        return <LabDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p>No role assigned. Please contact support.</p>
          </div>
        );
    }
  };

  return <div className="h-full">{renderDashboard()}</div>;
}
