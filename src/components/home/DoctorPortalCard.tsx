import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function DoctorPortalCard() {
    return (
        <Card className="relative flex flex-col justify-between border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-emerald-100/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 hover:border-emerald-300/50 transition-all duration-300 overflow-hidden group/card">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50/80 via-transparent to-transparent dark:from-emerald-900/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <CardHeader>
                    <div className="p-3 w-fit bg-linear-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30 rounded-xl mb-4 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20 group-hover/card:scale-110 transition-transform duration-300">
                        <Stethoscope className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Doctor Portal
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 pt-2 text-sm leading-relaxed">
                        Query records via Patient ID index, track antibiotic
                        consumption graphs, and explore categorized tabs for medical
                        safety validation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <Link href="/doctor" className="w-full">
                        <Button className="w-full bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium flex items-center justify-center gap-2 group shadow-md shadow-emerald-500/20 transition-all duration-300 border-0">
                            Launch Analytics View
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Button>
                    </Link>
                </CardContent>
            </div>
        </Card>
    );
}
