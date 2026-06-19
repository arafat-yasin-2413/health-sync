"use client";

import { useState, useEffect, useCallback } from "react";
import { safeGetStorage } from "@/utils/storageEngine";
import { MedicalRecord, Medicine } from "@/types/medical";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Search,
    ShieldAlert,
    Activity,
    Pill,
    TrendingUp,
    FileText,
    Maximize2,
} from "lucide-react";
import { PortalNav } from "@/components/nav/PortalNav";

export default function DoctorDashboard() {
    const [mounted, setMounted] = useState(false);
    const [searchId, setSearchId] = useState("PAT-101");
    const [activeRecords, setActiveRecords] = useState<MedicalRecord[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = useCallback(() => {
        const allRecords = safeGetStorage<MedicalRecord[]>(
            "medical_records",
            [],
        );
        const filtered = allRecords.filter(
            (r) => r.patientId.toUpperCase() === searchId.trim().toUpperCase(),
        );
        setActiveRecords(filtered);
        setHasSearched(true);
    }, [searchId]);

    useEffect(() => {
        setMounted(true);
        handleSearch(); // Fail-safe hydration load
    }, [handleSearch]);

    if (!mounted) return null;

    // 1. Antibiotic Tracker Calculation
    const antibioticMedicines = activeRecords
        .flatMap((r) => r.medicines)
        .filter((m) => m.category === "Antibiotic");
    const uniqueAntibioticsCount = new Set(
        antibioticMedicines.map((m) => m.name.toLowerCase()),
    ).size;

    // 2. Medication Categorization Helper
    const getMedicinesByCategory = (
        category: "Vitamin" | "Calcium" | "Gastric" | "Other",
    ) => {
        return activeRecords
            .flatMap((r) => r.medicines.map((m) => ({ ...m, date: r.date })))
            .filter((m) => m.category === category);
    };

    // 3. Diagnostic Test Flat Matrix
    const diagnosticTests = activeRecords.flatMap((r) =>
        (r.testResults || []).map((t) => ({ ...t, date: r.date })),
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
            <PortalNav />

            <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8 flex-1">
                {/* Top Search Index Bar */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Enter Patient ID Lookup (e.g., PAT-101, PAT-102)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="pl-9 font-mono uppercase border-slate-200"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                            Query Clinical Ledger
                        </Button>
                    </CardContent>
                </Card>

                {hasSearched && activeRecords.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 p-12 text-center bg-white">
                        <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-slate-800">
                            No Patient Records Indexed
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            This ID is either invalid or has no historical
                            timeline uploaded yet.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: Metrics & Antibiotic Tracker */}
                        <div className="space-y-6">
                            <Card className="bg-white border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                                        Antibiotic Tracker Card
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black font-mono tracking-tight text-slate-900">
                                        {antibioticMedicines.length}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Total cumulative prescriptions issued
                                        containing core antimicrobial agents.
                                    </p>

                                    {antibioticMedicines.length > 0 && (
                                        <div className="mt-4 space-y-2 border-t pt-3 border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">
                                                Distinct Molecules Detected (
                                                {uniqueAntibioticsCount}):
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {Array.from(
                                                    new Set(
                                                        antibioticMedicines.map(
                                                            (m) => m.name,
                                                        ),
                                                    ),
                                                ).map((name, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="destructive"
                                                        className="bg-rose-50 hover:bg-rose-50 text-rose-700 border-rose-100 font-medium text-[10px]">
                                                        {name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Patient Basic Context Summary */}
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <Activity className="h-4 w-4 text-indigo-500" />
                                        Clinical Record Density
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center text-sm border-b pb-2 border-slate-100">
                                        <span className="text-slate-500">
                                            Total Consultation Blocks:
                                        </span>
                                        <span className="font-mono font-bold text-slate-900">
                                            {activeRecords.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">
                                            Last Encounter Date:
                                        </span>
                                        <span className="font-mono font-bold text-slate-900">
                                            {activeRecords[0]?.date || "N/A"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Medication Tabs & Diagnostic Table */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Medication Categorization Tabs */}
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Pill className="h-5 w-5 text-emerald-500" />
                                        Medication Categorization Matrices
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Segregated historical drug catalogs
                                        mapped via LLM taxonomy.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <Tabs
                                        defaultValue="Gastric"
                                        className="w-full">
                                        <TabsList className="grid grid-cols-4 w-full bg-slate-100 border">
                                            <TabsTrigger
                                                value="Gastric"
                                                className="text-xs font-semibold">
                                                Gastric
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="Vitamin"
                                                className="text-xs font-semibold">
                                                Vitamins
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="Calcium"
                                                className="text-xs font-semibold">
                                                Calcium
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="Other"
                                                className="text-xs font-semibold">
                                                Other
                                            </TabsTrigger>
                                        </TabsList>

                                        {(
                                            [
                                                "Gastric",
                                                "Vitamin",
                                                "Calcium",
                                                "Other",
                                            ] as const
                                        ).map((cat) => (
                                            <TabsContent
                                                key={cat}
                                                value={cat}
                                                className="space-y-2 mt-4">
                                                {getMedicinesByCategory(cat)
                                                    .length === 0 ? (
                                                    <p className="text-xs text-slate-400 italic py-4 text-center">
                                                        No prescribed instances
                                                        matching category "{cat}
                                                        " found.
                                                    </p>
                                                ) : (
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <table className="w-full text-left text-xs">
                                                            <thead className="bg-slate-50 text-slate-500 border-b">
                                                                <tr>
                                                                    <th className="p-2.5 pl-4">
                                                                        Drug
                                                                        Formulation
                                                                    </th>
                                                                    <th className="p-2.5">
                                                                        Dosage
                                                                        Regimen
                                                                    </th>
                                                                    <th className="p-2.5 text-right pr-4">
                                                                        Encounter
                                                                        Date
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                                {getMedicinesByCategory(
                                                                    cat,
                                                                ).map(
                                                                    (
                                                                        med,
                                                                        i,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="hover:bg-slate-50/50">
                                                                            <td className="p-2.5 pl-4 font-bold text-slate-900">
                                                                                {
                                                                                    med.name
                                                                                }
                                                                            </td>
                                                                            <td className="p-2.5 font-mono text-slate-600">
                                                                                {
                                                                                    med.dosage
                                                                                }{" "}
                                                                                (
                                                                                {
                                                                                    med.duration
                                                                                }

                                                                                )
                                                                            </td>
                                                                            <td className="p-2.5 text-right font-mono text-slate-500 pr-4">
                                                                                {
                                                                                    med.date
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </CardContent>
                            </Card>

                            {/* Diagnostic Test History Table */}
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                                        Diagnostic Metrics & Lab History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {diagnosticTests.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic text-center py-4">
                                            No diagnostic reports recorded.
                                        </p>
                                    ) : (
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 text-slate-500 border-b">
                                                    <tr>
                                                        <th className="p-2.5 pl-4">
                                                            Investigation Test
                                                            Name
                                                        </th>
                                                        <th className="p-2.5">
                                                            Observed Metric
                                                            Value
                                                        </th>
                                                        <th className="p-2.5 text-right pr-4">
                                                            Timeline Index
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                    {diagnosticTests.map(
                                                        (test, i) => (
                                                            <tr
                                                                key={i}
                                                                className="hover:bg-slate-50/50">
                                                                <td className="p-2.5 pl-4 font-bold text-slate-900">
                                                                    {
                                                                        test.testName
                                                                    }
                                                                </td>
                                                                <td className="p-2.5 font-mono font-bold text-indigo-600">
                                                                    {test.value}
                                                                </td>
                                                                <td className="p-2.5 text-right font-mono text-slate-500 pr-4">
                                                                    {test.date}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Deep-Dive Shadcn Modal Layout */}
                            <div className="flex justify-end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-1.5">
                                            <Maximize2 className="h-3.5 w-3.5" />{" "}
                                            Open Complete Raw Medical Folder
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-indigo-600" />
                                                Clinical Consultation
                                                Longitudinal Logs
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 mt-2">
                                            {activeRecords.map((r, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                                                    <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-500 border-b pb-1">
                                                        <span>
                                                            RECORD: {r.recordId}
                                                        </span>
                                                        <span>
                                                            DATE: {r.date}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-slate-800">
                                                        Physician Note:{" "}
                                                        {r.doctorName}
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 border rounded">
                                                        {r.patientCase}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
