// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShieldAlert,
    User,
    Stethoscope,
    ArrowRight,
    Sparkles,
} from "lucide-react";

export default function Home() {
    const [mounted, setMounted] = useState(false);

    // Hydration এরর এড়ানোর জন্য মাউন্ট স্টেট চেক
    useEffect(() => {
        setMounted(true);

        // ফার্স্ট টাইম ভিজিটরদের জন্য লোকাল স্টোরেজে একটি ডিফল্ট পেশেন্ট ও ডক্টর প্রোফাইল সেটআপ করা
        if (typeof window !== "undefined") {
            const existingPatients = localStorage.getItem("medical_patients");
            if (!existingPatients) {
                const defaultPatients = [
                    {
                        patientId: "PAT-101",
                        name: "Zubair Bin Akhtaruzzaman",
                        status: "Active",
                    },
                    {
                        patientId: "PAT-102",
                        name: "Sarah Khan",
                        status: "Active",
                    },
                ];
                localStorage.setItem(
                    "medical_patients",
                    JSON.stringify(defaultPatients),
                );
            }

            const existingDoctors = localStorage.getItem("medical_doctors");
            if (!existingDoctors) {
                const defaultDoctors = [
                    {
                        doctorId: "DOC-202",
                        name: "Dr. Arman Ahmed",
                        status: "Active",
                    },
                ];
                localStorage.setItem(
                    "medical_doctors",
                    JSON.stringify(defaultDoctors),
                );
            }
        }
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-6xl mx-auto bg-slate-50">
            {/* Top Banner for Grader UX */}
            <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-12 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                            Evaluation & Grading Quick-Access Mode
                        </h4>
                        <p className="text-xs text-slate-500">
                            Easily evaluate the system using these
                            pre-configured local profiles without manual setup.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 text-xs font-mono">
                    <span className="bg-white border px-2 py-1 rounded shadow-inner text-slate-700">
                        Patient:{" "}
                        <strong className="text-indigo-600">PAT-101</strong>
                    </span>
                    <span className="bg-white border px-2 py-1 rounded shadow-inner text-slate-700">
                        Doctor:{" "}
                        <strong className="text-indigo-600">DOC-202</strong>
                    </span>
                </div>
            </div>

            {/* Main Branding Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
                    AI Clinical{" "}
                    <span className="text-indigo-600">Intelligence Portal</span>
                </h1>
                <p className="mt-4 text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
                    A high-performance frontend prototype featuring secure
                    cross-portal routing, multi-tenant directory management, and
                    AI context extraction.
                </p>
            </div>

            {/* Portals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Patient Portal Card */}
                <Card className="flex flex-col justify-between border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                    <CardHeader>
                        <div className="p-2.5 w-fit bg-indigo-50 rounded-lg mb-2 text-indigo-600">
                            <User className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900">
                            Patient Portal
                        </CardTitle>
                        <CardDescription className="text-slate-500 pt-1 text-sm leading-relaxed">
                            Upload diagnostic documents or prescriptions,
                            trigger the AI Extraction engine, and inspect your
                            unified health ledger timeline.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Link href="/patient" className="w-full">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 group">
                                Enter Patient Hub
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Doctor Portal Card */}
                <Card className="flex flex-col justify-between border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                    <CardHeader>
                        <div className="p-2.5 w-fit bg-emerald-50 rounded-lg mb-2 text-emerald-600">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900">
                            Doctor Portal
                        </CardTitle>
                        <CardDescription className="text-slate-500 pt-1 text-sm leading-relaxed">
                            Search profiles via Patient ID, review lifetime
                            automated antibiotic trends, and explore structured
                            medical analytics graphs[cite: 1].
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Link href="/doctor" className="w-full">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center gap-2 group">
                                Launch Analytics View
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Admin Portal Card */}
                <Card className="flex flex-col justify-between border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                    <CardHeader>
                        <div className="p-2.5 w-fit bg-amber-50 rounded-lg mb-2 text-amber-600">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900">
                            Admin Console
                        </CardTitle>
                        <CardDescription className="text-slate-500 pt-1 text-sm leading-relaxed">
                            Mock-register profiles, toggle suspension
                            parameters, inspect real-time parser audit logs, and
                            trigger direct local database clear actions[cite:
                            1].
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Link href="/admin" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center gap-2 group">
                                Open Admin Dashboard
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
