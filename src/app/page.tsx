"use client";

import { useEffect } from "react";

import { defaultPatients, defaultDoctors } from "@/utils/mockData";
import { Sparkles } from "lucide-react";
import PatientPortalCard from "@/components/home/PatientPortalCard";
import DoctorPortalCard from "@/components/home/DoctorPortalCard";
import AdminPortalCard from "@/components/home/AdminPortalCard";

export default function Home() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("medical_patients")) {
                localStorage.setItem(
                    "medical_patients",
                    JSON.stringify(defaultPatients),
                );
            }

            if (!localStorage.getItem("medical_doctors")) {
                localStorage.setItem(
                    "medical_doctors",
                    JSON.stringify(defaultDoctors),
                );
            }

            if (!localStorage.getItem("medical_records")) {
                localStorage.setItem("medical_records", JSON.stringify([]));
            }

            if (!localStorage.getItem("medical_audit_logs")) {
                localStorage.setItem("medical_audit_logs", JSON.stringify([]));
            }
        }
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Background decorative glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 h-1 w-150 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-125 w-125 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px]" />
            </div>

            <div className="relative flex flex-col items-center justify-center min-h-screen p-6 max-w-7xl mx-auto">
                {/* Premium Quick-Access Banner */}
                <div className="w-full bg-linear-to-r from-indigo-50 via-white to-indigo-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-500/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-xl text-white shrink-0 shadow-md shadow-indigo-500/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                                Quick-Access Mode
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                The system has auto-initialized default local
                                storage profiles for seamless testing.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                        <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg shadow-sm text-slate-700 dark:text-slate-300">
                            Demo Patient:{" "}
                            <strong className="text-indigo-600 dark:text-indigo-400">PAT-101</strong>
                        </span>
                        <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg shadow-sm text-slate-700 dark:text-slate-300">
                            Demo Doctor:{" "}
                            <strong className="text-indigo-600 dark:text-indigo-400">DOC-202</strong>
                        </span>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <h2 className="bg-clip-text text-transparent bg-linear-to-b from-indigo-600 via-purple-600 to-slate-900 dark:from-indigo-400 dark:via-purple-400 dark:to-white text-3xl md:text-5xl lg:text-7xl font-sans py-2 md:py-6 relative z-20 font-bold tracking-tight leading-tight">
                        AI Clinical Intelligence Portal
                    </h2>
                    <div className="max-w-xl mx-auto">
                        <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            A high-performance client-side medical architecture
                            utilizing automated AI structural extraction and custom
                            cross-portal data states.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <div className="h-px w-12 bg-linear-to-r from-transparent to-indigo-300 dark:to-indigo-700" />
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                        <div className="h-px w-12 bg-linear-to-l from-transparent to-indigo-300 dark:to-indigo-700" />
                    </div>
                </div>

                {/* Portals Gateway Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-14">
                    <PatientPortalCard />
                    <DoctorPortalCard />
                    <AdminPortalCard />
                </div>
            </div>
        </div>
    );
}
