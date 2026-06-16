

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

