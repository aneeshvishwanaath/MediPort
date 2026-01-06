'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

export default function LabDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();
  const router = useRouter();

  const patientsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'patients')) : null),
    [firestore]
  );
  const { data: patients, isLoading: isPatientsLoading } = useCollection(patientsQuery);

  const filteredPatients = (patients || []).filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.medicalPortfolioId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Lab Dashboard
        </h2>
        <Button asChild>
          <Link href="/dashboard/add-lab">
            <PlusCircle className="mr-2 h-4 w-4" /> Add/Edit Lab Details
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
          <CardDescription>
            Find a patient to upload or manage their lab reports.
          </CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or MPI..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>MPI</TableHead>
                <TableHead>Age</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPatientsLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient: any) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                    <TableCell><Badge variant="secondary">{patient.medicalPortfolioId}</Badge></TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell className="text-right">
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/patient/${patient.id}/upload-report`)}
                      >
                        Upload Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No patients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
