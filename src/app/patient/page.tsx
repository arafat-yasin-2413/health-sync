"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseMedicalDocument } from "@/app/actions/ai";
import { appendMedicalRecord, safeGetStorage } from "@/utils/storageEngine";
import { MedicalRecord } from "@/types/medical";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    UploadCloud,
    FileText,
    Calendar,
    Activity,
    Stethoscope,
    Clock,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { PortalNav } from "@/components/nav/PortalNav";
import TopHeader from "@/components/patientPortal/TopHeader";
import { formatFileSize } from "@/utils/formatFileSize";
import { convertFileToBase64 } from "@/utils/convertFileToBase64";
import LoaderSkeleton from "@/components/patientPortal/LoaderSkeleton";

interface Patient {
    patientId: string;
    name: string;
}

export default function PatientPage() {
    const [mounted, setMounted] = useState(false);
    const [activePatientId, setActivePatientId] = useState("PAT-101");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{
        name: string;
        size: string;
        type: string;
    } | null>(null);



    // utility for loading dynamic patient list from localStorage
    useEffect(() => {
        setMounted(true);

        // getting patient data from localStorage
        const storedPatients = safeGetStorage<Patient[]>(
            "medical_patients",
            [],
        );

        if (storedPatients && storedPatients.length > 0) {
            setPatients(storedPatients);
            setActivePatientId(storedPatients[0].patientId);
        } else {
            // fallback data (when localStorage is empty)
            const defaultPatients: Patient[] = [
                { patientId: "PAT-101", name: "(D)Zubair Bin Akhtaruzzaman" },
                { patientId: "PAT-102", name: "(D)Sarah Khan" },
            ];
            setPatients(defaultPatients);
            setActivePatientId("PAT-101");
        }
    }, []);

    const loadRecords = useCallback(() => {
        const allRecords = safeGetStorage<MedicalRecord[]>(
            "medical_records",
            [],
        );
        const filtered = allRecords.filter(
            (r) => r.patientId === activePatientId,
        );
        setRecords(filtered);
    }, [activePatientId]);

    useEffect(() => {
        setMounted(true);
        loadRecords();
    }, [loadRecords]);

    // react-dropzone integration with AI execution pipeline
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            setLoading(true);
            setErrorMsg(null);

            // saving file details
            setSelectedFile({
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type.includes("pdf") ? "PDF Document" : "Image File",
            });

            try {
                const base64Data = await convertFileToBase64(file);
                const result = await parseMedicalDocument(
                    base64Data,
                    file.type,
                    activePatientId,
                );

                if (result.success && result.data) {
                    // ensuring that record is saving under current active patient
                    const safeRecord = {
                        ...result.data,
                        patientId: activePatientId, // override with current session id
                        recordId: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
                    };

                    appendMedicalRecord(safeRecord);

                    // ui and timeline instant re-render
                    loadRecords();

                    setSelectedFile(null);
                    setErrorMsg(null);
                } else {
                    setErrorMsg(
                        result.error ||
                        "AI pipeline could not parse the document structure.",
                    );
                    setSelectedFile(null);
                }
            } catch (err) {
                setErrorMsg(
                    "Error processing file or converting to base64 structural channel.",
                );
            } finally {
                setLoading(false);
            }
        },
        [activePatientId, loadRecords],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
        },
        multiple: false,
        disabled: loading,
    });

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
            <PortalNav />
            {/* Main content area */}
            <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8 flex-1">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-xs">
                    <TopHeader />

                    {/* dynamic session handler */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-xs font-semibold text-slate-500 px-1 md:px-2 whitespace-nowrap">
                            Active Session:
                        </span>
                        <select
                            value={activePatientId}
                            onChange={(e) => setActivePatientId(e.target.value)}
                            className="text-xs font-mono font-bold bg-white border border-slate-200 rounded px-2.5 py-1 text-indigo-600 focus:outline-none cursor-pointer max-w-45 sm:max-w-xs truncate">
                            {patients.map((patient) => (
                                <option
                                    key={patient.patientId}
                                    value={patient.patientId}>
                                    {patient.patientId} ({patient.name})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* react-dropzone Area */}
                <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                        <div
                            {...getRootProps()}
                            className={`p-10 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all relative cursor-pointer ${isDragActive
                                    ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                                    : "border-slate-300 hover:border-indigo-400 bg-slate-50/50"
                                } ${loading ? "pointer-events-none opacity-60" : ""}`}>
                            <input {...getInputProps()} />
                            <div className="text-center space-y-3">
                                <div className="p-4 bg-white rounded-full shadow-sm w-fit mx-auto border text-indigo-600">
                                    <UploadCloud className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {isDragActive
                                            ? "Drop the medical document here..."
                                            : "Drag & Drop prescription or report here"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Accepts PDF, PNG, and JPEG formats (Auto
                                        Base64 Pipeline)
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 border-slate-300 bg-white text-slate-700">
                                    Browse Files
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Uploaded File Details Meta Card */}
                {selectedFile && (
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between transition-all animate-in fade-in duration-200">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Conditional Icon Layout */}
                            <div
                                className={`p-2.5 rounded-lg border shrink-0 ${selectedFile.type === "PDF Document"
                                        ? "bg-rose-50 border-rose-100 text-rose-600"
                                        : "bg-blue-50 border-blue-100 text-blue-600"
                                    }`}>
                                <FileText className="h-5 w-5" />
                            </div>

                            {/* Meta Text Stack */}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate max-w-62.5 sm:max-w-md">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                    <span>{selectedFile.size}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-bold uppercase">
                                        {selectedFile.type}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Status Badge or Cancel Action */}
                        <div className="flex items-center gap-2">
                            {loading ? (
                                <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse text-[11px] font-bold">
                                    AI Extracting...
                                </Badge>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFile(null)}
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                                    ✕
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3 text-sm font-medium">
                        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        {errorMsg}
                    </div>
                )}

                {/* Beautiful Skeleton Wave Processing States */}
                {loading && <LoaderSkeleton />}

                {/* Chronological Ledger Timeline Component */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b pb-3 border-slate-200">
                        <Clock className="h-5 w-5 text-slate-500" />
                        <h2 className="text-xl font-bold text-slate-900">
                            Historical Health Ledger Timeline
                        </h2>
                        <Badge
                            variant="secondary"
                            className="ml-2 font-mono font-bold bg-slate-200 text-slate-700">
                            {records.length}{" "}
                            {records.length === 1 ? "Entry" : "Entries"}
                        </Badge>
                    </div>

                    {records.length === 0 && !loading ? (
                        <div className="text-center py-16 bg-white border rounded-xl border-slate-200 shadow-inner">
                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-slate-500">
                                No medical records indexed inside localStorage.
                            </p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 pl-6 md:pl-8 ml-4 md:ml-6 space-y-8 pb-4">
                            {records.map((record) => (
                                <div
                                    key={record.recordId}
                                    className="relative group">
                                    <span className="absolute -left-7.75 md:-left-9.75 top-1 bg-white border-2 border-indigo-600 p-1 rounded-full text-indigo-600 shadow-sm z-10">
                                        <CheckCircle2 className="h-3 w-3 fill-indigo-50" />
                                    </span>

                                    <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
                                        <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Consultation Date:{" "}
                                                    {record.date}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono ml-2 bg-white text-indigo-700 border-indigo-200">
                                                    {record.recordId}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-slate-700 bg-white border px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1.5">
                                                <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>
                                                    Physician:{" "}
                                                    <strong className="text-slate-950">
                                                        {record.doctorName}
                                                    </strong>
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-5 space-y-4 text-sm">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                                    Clinical Case Summary
                                                </span>
                                                <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    {record.patientCase}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                                <div className="bg-slate-50 p-2.5 rounded-lg border flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-slate-500 font-medium flex items-center gap-1">
                                                        <Activity className="h-3.5 w-3.5 text-blue-500" />{" "}
                                                        RR:
                                                    </span>
                                                    <span className="font-mono font-bold">
                                                        {record.respiratoryRate}
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-2.5 rounded-lg border flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-slate-500 font-medium flex items-center gap-1">
                                                        <Activity className="h-3.5 w-3.5 text-rose-500" />{" "}
                                                        BP:
                                                    </span>
                                                    <span className="font-mono font-bold">
                                                        {record.bloodPressure}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                                    Prescribed Medicines Matrix
                                                </span>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {record.medicines.map(
                                                        (med, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between p-2.5 bg-white border rounded-lg shadow-2xs">
                                                                <div>
                                                                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                                                        {
                                                                            med.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 font-mono">
                                                                        Dose:{" "}
                                                                        {
                                                                            med.dosage
                                                                        }{" "}
                                                                        |{" "}
                                                                        {
                                                                            med.duration
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <Badge className="text-[10px] font-bold uppercase">
                                                                    {
                                                                        med.category
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
