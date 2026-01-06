'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';

const reportSchema = z.object({
  reportName: z.string().min(1, 'Report name is required'),
  reportType: z.enum(['PDF', 'Image', 'Other']),
  reportCategory: z.enum(['Recent', 'Archived']),
  uploadDate: z.string().min(1, 'Upload date is required'),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function UploadReportPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be a logged-in lab tech to upload a report.',
      });
      return;
    }

    try {
      // Note: In a real app, you would handle file uploads to Cloud Storage
      // and then save the URL here. For this academic demo, we'll just save the metadata.
      const reportsCollection = collection(
        firestore,
        `patients/${patientId}/medicalReports`
      );
      await addDoc(reportsCollection, {
        ...data,
        patientId: patientId,
        uploadedByLabId: user.uid,
        fileUrl: '#', // Placeholder URL
      });
      toast({
        title: 'Report Uploaded',
        description: `The report "${data.reportName}" has been added.`,
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Medical Report</CardTitle>
          <CardDescription>
            Enter the details for the medical report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input id="reportName" {...register('reportName')} />
              {errors.reportName && (
                <p className="text-sm text-destructive">
                  {errors.reportName.message}
                </p>
              )}
            </div>

             <div className="space-y-2">
                <Label>Report Type</Label>
                <Controller
                    control={control}
                    name="reportType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="Image">Image</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                 {errors.reportType && <p className="text-destructive text-sm">{errors.reportType.message}</p>}
            </div>
            
             <div className="space-y-2">
                <Label>Report Category</Label>
                <Controller
                    control={control}
                    name="reportCategory"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Recent">Recent</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                 {errors.reportCategory && <p className="text-destructive text-sm">{errors.reportCategory.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="uploadDate">Upload Date</Label>
              <Input id="uploadDate" type="date" {...register('uploadDate')} />
              {errors.uploadDate && (
                <p className="text-sm text-destructive">
                  {errors.uploadDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" disabled />
                <p className="text-sm text-muted-foreground">File upload is disabled in this academic demo.</p>
            </div>


            <Button type="submit">Upload Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
