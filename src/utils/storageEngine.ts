import { MedicalRecord, AuditLog, PatientProfile } from "@/types/medical";
import { json } from "node:stream/consumers";

// utitlity for reading local storage data
export function safeGetStorage<T>(key: string, defaultValue: T): T{
    if(typeof window === "undefined") return defaultValue;

    try{
        const item = localStorage.getItem(key);
        return item? JSON.parse(item) : defaultValue;
    }
    catch(error) {
        console.error(`LocalStorage retrieval error for key ${key}`, error);
        return defaultValue;
    }
}

// utility for writing local storage data
export function safeSetStorage<T>(key: string, value: T) :void{
    if(typeof window === "undefined") return ;

    try{
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch(error) {
        console.error(`LocalStorage commit error for key ${key}`, error);
    }
}

// utility for appending new medical record
export function appendMedicalRecord(record: MedicalRecord): void{
    const currentRecords = safeGetStorage<MedicalRecord[]>("medical_records", []);

    // organizing records. newest at top.
    const updatedRecords = [record, ...currentRecords];
    safeSetStorage("medical_records", updatedRecords);

    // tracking system audit log
    const currentLogs = safeGetStorage<AuditLog[]>("medical_audit_logs",[]);
    const newLog: AuditLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T',' ').substring(0, 16),
        action: "AI PARSE SUCCESS",
        details: `Successfully compiled clinical record ${record.recordId} for Patient ${record.patientId}.`
    };

    safeSetStorage("medical_audit_logs", [newLog, ...currentLogs]);
}

// utility for checking patient status
export function isPatientActive (patientId: string):boolean {
    const patients = safeGetStorage<PatientProfile[]>("medical_patients", []);
    const found = patients.find(p => p.patientId === patientId);
    return found ? found.status === "Active" : true;
}