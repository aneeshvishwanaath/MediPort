export type Patient = {
  id: string;
  mpi: string; // Medical Portfolio ID
  personalInfo: {
    name: string;
    dob: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    avatarUrl: string;
  };
  vitals: {
    height: string;
    weight: string;
    bmi: string;
  };
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
  familyHistory: string[];
  medicalHistory: {
    hospitalizations: {
      date: string;
      reason: string;
      hospital: string;
      notes: string;
    }[];
    labReports: {
      id: string;
      date: string;
      name: string;
      type: 'PDF' | 'Image';
      url: string;
    }[];
    chronicIllnesses: {
      illness: string;
      diagnosed: string;
      notes: string;
    }[];
    allergies: {
      allergen: string;
      severity: 'Mild' | 'Moderate' | 'Severe';
      triggers: string;
    }[];
  };
  medications: {
    current: {
      name: string;
      dosage: string;
      frequency: string;
      prescribedBy: string;
    }[];
    past: {
      name: string;
      dosage: string;
      reason: string;
      discontinued: string;
    }[];
  };
  surgeries: {
    past: {
      date: string;
      procedure: string;
      surgeon: string;
      notes: string;
    }[];
    upcoming: {
      date: string;
      procedure: string;
      surgeon: string;
      instructions: string;
    }[];
  };
  healthConditions: string; // For AI conflict check
};

export const samplePatient: Patient = {
  id: 'patient-001',
  mpi: 'MPI-2024-8A3B9C',
  personalInfo: {
    name: 'Jane Doe',
    dob: '1985-05-15',
    age: 39,
    gender: 'Female',
    bloodGroup: 'O+',
    avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
  },
  vitals: {
    height: '165 cm',
    weight: '68 kg',
    bmi: '24.9',
  },
  emergencyContacts: [
    {
      name: 'John Doe',
      relation: 'Spouse',
      phone: '+1-202-555-0182',
    },
    {
      name: 'Emily White',
      relation: 'Sister',
      phone: '+1-202-555-0191',
    },
  ],
  familyHistory: ['Hypertension (Father)', 'Diabetes Type 2 (Mother)'],
  medicalHistory: {
    hospitalizations: [
      {
        date: '2022-11-20',
        reason: 'Appendicitis',
        hospital: 'City General Hospital',
        notes: 'Successful appendectomy.',
      },
    ],
    labReports: [
      {
        id: 'lab-01',
        date: '2023-08-10',
        name: 'Annual Blood Panel',
        type: 'PDF',
        url: '#',
      },
      {
        id: 'lab-02',
        date: '2021-03-05',
        name: 'X-Ray Right Wrist',
        type: 'Image',
        url: '#',
      },
    ],
    chronicIllnesses: [
      {
        illness: 'Mild Asthma',
        diagnosed: '2005',
        notes: 'Managed with an inhaler as needed.',
      },
    ],
    allergies: [
      {
        allergen: 'Penicillin',
        severity: 'Severe',
        triggers: 'Ingestion of penicillin-based antibiotics.',
      },
      {
        allergen: 'Pollen',
        severity: 'Moderate',
        triggers: 'Seasonal, primarily in Spring.',
      },
    ],
  },
  medications: {
    current: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedBy: 'Dr. Alan Grant',
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        prescribedBy: 'Dr. Ellie Sattler',
      },
    ],
    past: [
      {
        name: 'Amoxicillin',
        dosage: '250mg',
        reason: 'Childhood ear infection',
        discontinued: '1995 (allergy discovered)',
      },
    ],
  },
  surgeries: {
    past: [
      {
        date: '2022-11-20',
        procedure: 'Appendectomy',
        surgeon: 'Dr. Ian Malcolm',
        notes: 'Laparoscopic procedure, quick recovery.',
      },
    ],
    upcoming: [],
  },
  healthConditions: 'Hypertension, Pre-diabetic, Patient is not pregnant.'
};
