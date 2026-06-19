"use client";

import { useState, useEffect } from "react";
import { safeGetStorage, safeSetStorage } from "@/utils/storageEngine";
import { AuditLog, PatientProfile } from "@/types/medical";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Database,
    ShieldAlert,
    Terminal,
    RefreshCw,
    Trash2,
} from "lucide-react";
import { PortalNav } from "@/components/nav/PortalNav";

export default function AdminConsole() {
    const [mounted, setMounted] = useState(false);
    const [patients, setPatients] = useState<PatientProfile[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);

    const loadAdminState = () => {
        const initialPatients: PatientProfile[] = [
            {
                patientId: "PAT-101",
                name: "Zubair Bin Akhtaruzzaman",
                status: "Active" as const,
            },
            {
                patientId: "PAT-102",
                name: "Sarah Khan",
                status: "Active" as const,
            },
            {
                patientId: "PAT-103",
                name: "Rahim Al-Hasan",
                status: "Suspended" as const,
            },
        ];

        const storedPatients = safeGetStorage<PatientProfile[]>(
            "medical_patients",
            [],
        );
        if (storedPatients.length === 0) {
            safeSetStorage("medical_patients", initialPatients);
            setPatients(initialPatients);
        } else {
            setPatients(storedPatients);
        }

        setLogs(safeGetStorage<AuditLog[]>("medical_audit_logs", []));
    };

    useEffect(() => {
        setMounted(true);
        loadAdminState();
    }, []);

    if (!mounted) return null;

    const toggleStatus = (id: string) => {
        const updated: PatientProfile[] = patients.map((p) =>
            p.patientId === id
                ? {
                      ...p,
                      status:
                          p.status === "Active"
                              ? ("Suspended" as const)
                              : ("Active" as const),
                  }
                : p,
        );

        safeSetStorage("medical_patients", updated);
        setPatients(updated);

        // audit log tracking
        const target = patients.find((p) => p.patientId === id);
        const newLog: AuditLog = {
            id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date()
                .toISOString()
                .replace("T", " ")
                .substring(0, 16),
            action: "USER_MODIFICATION",
            details: `Profile flag changed for ${id}. State updated to ${target?.status === "Active" ? "Suspended" : "Active"}.`,
        };
        const updatedLogs = [newLog, ...logs];
        safeSetStorage("medical_audit_logs", updatedLogs);
        setLogs(updatedLogs);
    };

    // instant mock data injection engine
    const handleInjectMockData = () => {
        const mockDataset = [
            {
                recordId: "REC-884012",
                patientId: "PAT-101",
                date: "2026-03-12",
                doctorName: "Dr. Arman Ahmed",
                patientCase:
                    "Patient complaining of sharp lower abdomen ache and minor gastric irritation.",
                respiratoryRate: "18 bpm",
                bloodPressure: "120/80",
                medicines: [
                    {
                        name: "Sergel 20mg",
                        dosage: "1+0+1",
                        duration: "14 days",
                        category: "Gastric",
                    },
                    {
                        name: "Azithromycin 500mg",
                        dosage: "1+0+0",
                        duration: "5 days",
                        category: "Antibiotic",
                    },
                ],
                testResults: [
                    {
                        testName: "USG of Lower Abdomen",
                        value: "Normal Appendix Condition",
                    },
                ],
            },
            {
                recordId: "REC-332109",
                patientId: "PAT-101",
                date: "2025-11-05",
                doctorName: "Dr. Laila Noor",
                patientCase:
                    "Generalized physical bone soreness and severe Vitamin deficiency fatigue.",
                respiratoryRate: "16 bpm",
                bloodPressure: "115/75",
                medicines: [
                    {
                        name: "Coralcal D",
                        dosage: "0+1+0",
                        duration: "30 days",
                        category: "Calcium",
                    },
                    {
                        name: "Multivitamin Gold",
                        dosage: "0+0+1",
                        duration: "30 days",
                        category: "Vitamin",
                    },
                ],
                testResults: [
                    {
                        testName: "Serum Vitamin D3",
                        value: "15.4 ng/mL (Deficient)",
                    },
                ],
            },
        ];

        safeSetStorage("medical_records", mockDataset);

        const newLog: AuditLog = {
            id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date()
                .toISOString()
                .replace("T", " ")
                .substring(0, 16),
            action: "SYS_DATA_INJECTION",
            details:
                "Injected 2 multi-year highly structured mock medical records under user profile PAT-101.",
        };
        const updatedLogs = [newLog, ...logs];
        safeSetStorage("medical_audit_logs", updatedLogs);
        setLogs(updatedLogs);

        alert(
            "Mock Multi-Year Dataset Injected Successfully into localStorage!",
        );
    };

    // local storage reset utility
    const handleClearStorage = () => {
        if (
            confirm(
                "Are you sure you want to clear all data records and audit lines from localStorage?",
            )
        ) {
            localStorage.removeItem("medical_records");
            localStorage.removeItem("medical_audit_logs");
            localStorage.removeItem("medical_patients");
            setPatients([]);
            setLogs([]);
            alert("Storage Flushed Clean.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
            <PortalNav />
            <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8 flex-1">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                    Root Administrative Panel
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Block: Developer Utilities Button Matrix */}
                    <div className="space-y-6">
                        <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-indigo-600">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                    Developer Grading Utilities
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    One-click data management scripts for rapid
                                    assessment auditing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={handleInjectMockData}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 text-xs">
                                    <RefreshCw className="h-4 w-4" /> Inject
                                    Mock Grading Dataset
                                </Button>
                                <Button
                                    onClick={handleClearStorage}
                                    variant="outline"
                                    className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 font-medium flex items-center justify-center gap-2 text-xs">
                                    <Trash2 className="h-4 w-4" /> Hard Reset
                                    LocalStorage
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Block: User Management Table & Audit Streams */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Patient Profile Controls */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Database className="h-5 w-5 text-indigo-600" />{" "}
                                    Registered Patient Matrices
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-xs md:text-sm">
                                        <thead className="bg-slate-50 text-slate-500 border-b">
                                            <tr>
                                                <th className="p-3 pl-4">
                                                    Patient Key
                                                </th>
                                                <th className="p-3">
                                                    Full Legal Name
                                                </th>
                                                <th className="p-3">
                                                    Current Status
                                                </th>
                                                <th className="p-3 text-right pr-4">
                                                    Execution Guard
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {patients.map((p) => (
                                                <tr
                                                    key={p.patientId}
                                                    className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-3 pl-4 font-mono font-bold text-slate-700">
                                                        {p.patientId}
                                                    </td>
                                                    <td className="p-3 font-semibold text-slate-900">
                                                        {p.name}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            className={
                                                                p.status ===
                                                                "Active"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                                            }>
                                                            {p.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-right pr-4">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                toggleStatus(
                                                                    p.patientId,
                                                                )
                                                            }
                                                            className="text-xs h-7 border-slate-300">
                                                            Toggle Flag
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Complete System Parse Stats / Audit Logs */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Terminal className="h-5 w-5 text-slate-700" />{" "}
                                    Pipeline Security Audit Stream
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                                {logs.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic text-center py-4">
                                        No tracking logs compiled on this system
                                        buffer yet.
                                    </p>
                                ) : (
                                    logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-lg border border-slate-800 space-y-1">
                                            <div className="flex justify-between items-center text-indigo-400 font-bold">
                                                <span>[{log.action}]</span>
                                                <span className="text-slate-500 text-[10px]">
                                                    {log.timestamp}
                                                </span>
                                            </div>
                                            <div className="text-slate-300">
                                                {log.details}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

// "use client";

// import { useState, useEffect } from "react";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//     premiumMockPatients,
//     premiumMockRecords,
//     premiumMockAuditLogs,
//     defaultPatients,
//     defaultDoctors,
// } from "@/utils/mockData";
// import { Database, CheckCircle, Trash2, ShieldAlert } from "lucide-react";
// import { PortalNav } from "@/components/nav/portal-nav";

// export default function AdminPage() {
//     const [statusMsg, setStatusMsg] = useState<{
//         type: "success" | "danger";
//         text: string;
//     } | null>(null);

//     const injectData = () => {
//         localStorage.setItem(
//             "medical_patients",
//             JSON.stringify(premiumMockPatients),
//         );
//         localStorage.setItem(
//             "medical_records",
//             JSON.stringify(premiumMockRecords),
//         );
//         localStorage.setItem(
//             "medical_audit_logs",
//             JSON.stringify(premiumMockAuditLogs),
//         );
//         setStatusMsg({
//             type: "success",
//             text: "Premium medical histories & chronological records injected successfully!",
//         });
//     };

//     const clearStorage = () => {
//         localStorage.setItem(
//             "medical_patients",
//             JSON.stringify(defaultPatients),
//         );
//         localStorage.setItem("medical_doctors", JSON.stringify(defaultDoctors));
//         localStorage.setItem("medical_records", JSON.stringify([]));
//         localStorage.setItem("medical_audit_logs", JSON.stringify([]));
//         setStatusMsg({
//             type: "danger",
//             text: "Local storage sanitized back to default baseline states.",
//         });
//     };

//     return (
//         <div className="min-h-screen bg-slate-50">
//             <main className="max-w-4xl mx-auto p-6 mt-8">
//                 <div className="flex items-center gap-3 mb-8">
//                     <ShieldAlert className="h-8 w-8 text-amber-500" />
//                     <div>
//                         <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
//                             Admin Control Panel
//                         </h1>
//                         <p className="text-sm text-slate-500">
//                             Configure global mock variables and inject instant
//                             database schemas for live evaluation.
//                         </p>
//                     </div>
//                 </div>

//                 <Card className="border-slate-200 bg-white shadow-sm mb-6">
//                     <CardHeader>
//                         <CardTitle className="text-lg flex items-center gap-2">
//                             <Database className="h-5 w-5 text-indigo-600" />
//                             Developer System Mock Configuration
//                         </CardTitle>
//                         <CardDescription>
//                             Use these shortcuts to skip clinical document
//                             scanning and immediately populate all doctor
//                             analytics graphs and historical charts.
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent className="flex flex-col sm:flex-row gap-4">
//                         <Button
//                             onClick={injectData}
//                             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex-1 flex items-center justify-center gap-2">
//                             <CheckCircle className="h-4 w-4" />
//                             Inject Pre-made Multi-Year Mock Dataset
//                         </Button>
//                         <Button
//                             onClick={clearStorage}
//                             variant="destructive"
//                             className="font-medium flex-1 flex items-center justify-center gap-2">
//                             <Trash2 className="h-4 w-4" />
//                             Wipe & Reset LocalStorage
//                         </Button>
//                     </CardContent>
//                 </Card>

//                 {statusMsg && (
//                     <div
//                         className={`p-4 rounded-lg border text-sm font-medium ${
//                             statusMsg.type === "success"
//                                 ? "bg-emerald-50 border-emerald-200 text-emerald-800"
//                                 : "bg-rose-50 border-rose-200 text-rose-800"
//                         }`}>
//                         {statusMsg.text}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }
