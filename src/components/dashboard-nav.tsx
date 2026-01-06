'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Pill,
  Stethoscope,
  QrCode,
  FileText,
  FlaskConical,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userData } = useDoc(userDocRef);

  const patientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/history', label: 'Medical History', icon: FileText },
    { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill },
    { href: '/dashboard/surgeries', label: 'Surgeries', icon: Stethoscope },
    { href: '/dashboard/qr-code', label: 'Emergency QR', icon: QrCode },
  ];

  const doctorLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/add-doctor', label: 'My Profile', icon: Stethoscope },
    { href: '/dashboard/add-patient', label: 'Add Patient', icon: User },
  ];

  const chemistLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/add-pharmacy', label: 'My Pharmacy', icon: Building },
  ];

  const labLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/add-lab', label: 'My Lab', icon: FlaskConical },
  ];

  let links = [];
  switch (userData?.role) {
    case 'patient':
      links = patientLinks;
      break;
    case 'doctor':
      links = doctorLinks;
      break;
    case 'chemist':
      links = chemistLinks;
      break;
    case 'lab':
      links = labLinks;
      break;
    default:
      links = [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
  }


  return (
    <nav className="grid items-start gap-1">
      {links.map((link) => (
        <Button
          key={link.href}
          asChild
          variant={pathname === link.href ? 'default' : 'ghost'}
          className="justify-start"
        >
          <Link href={link.href}>
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
