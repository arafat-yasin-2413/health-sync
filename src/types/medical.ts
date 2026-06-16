

export interface Medicine {
    name: string;
    dosage: string;
    duration: string;
    category: 'Antibiotic' | 'Vitamin' | 'Calcium' | 'Gastric' | 'Other';
}

export interface DiagnosticTest {
    testName: string;
    value: string;
}

export interface MedicalRecord {
    recordId: string;
    patientId: string;
    patientName: string;
    date: string;
    doctorName: string;
    patientCase: string;
    respiratoryRate: string;
    bloodPressure: string;
    medicines: Medicine[];
    testResults: DiagnosticTest[];
}

export interface PatientProfile {
    patientId: string;
    name: string;
    status: 'Active' | 'Suspended';
}