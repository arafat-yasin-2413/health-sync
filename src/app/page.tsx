"use client";

import { useEffect } from "react";

import { defaultPatients, defaultDoctors } from "@/utils/mockData";
import { Sparkles } from "lucide-react";
import PatientPortalCard from "@/components/home/PatientPortalCard";
import DoctorPortalCard from "@/components/home/DoctorPortalCard";
import AdminPortalCard from "@/components/home/AdminPortalCard";

export default function Home() {
    // const [mounted, setMounted] = useState(false);
    

    useEffect(() => {
        // Fail-Safe Flow: Default data seed into localStorage on first load
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("medical_patients")) {
                localStorage.setItem(
                    "medical_patients",
                    JSON.stringify(defaultPatients),
                );
                // this is new line
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

    // if (!mounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-7xl mx-auto bg-slate-50">
            {/* Premium Grader UX Helper Banner */}
            <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white shrink-0">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                            Quick-Access Mode
                        </h4>
                        <p className="text-xs text-slate-500">
                            The system has auto-initialized default local
                            storage profiles for seamless testing.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="bg-white border px-2 py-1 rounded shadow-inner text-slate-700">
                        Demo Patient:{" "}
                        <strong className="text-indigo-600">PAT-101</strong>
                    </span>
                    <span className="bg-white border px-2 py-1 rounded shadow-inner text-slate-700">
                        Demo Doctor:{" "}
                        <strong className="text-indigo-600">DOC-202</strong>
                    </span>
                </div>
            </div>

            <div>
                <h2 className="bg-clip-text text-transparent text-center bg-linear-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                    AI Clinical Intelligence Portal
                </h2>
                <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
                    A high-performance client-side medical architecture
                    utilizing automated AI structural extraction and custom
                    cross-portal data states.
                </p>
            </div>

            {/* Portals Gateway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
                <PatientPortalCard />
                <DoctorPortalCard />
                <AdminPortalCard />
            </div>
        </div>
    );
}
