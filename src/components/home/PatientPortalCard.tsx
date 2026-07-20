import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function PatientPortalCard() {
    return (
        <Card className="relative flex flex-col justify-between border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-indigo-100/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 hover:border-indigo-300/50 transition-all duration-300 overflow-hidden group/card">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-transparent to-transparent dark:from-indigo-900/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <CardHeader>
                    <div className="p-3 w-fit bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-xl mb-4 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/20 group-hover/card:scale-110 transition-transform duration-300">
                        <User className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Patient Portal
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 pt-2 text-sm leading-relaxed">
                        Upload diagnostic documents, run Gemini/OpenAI
                        structural parser workflows, and build an encrypted
                        chronological medical ledger.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <Link href="/patient" className="w-full">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium flex items-center justify-center gap-2 group shadow-md shadow-indigo-500/20 transition-all duration-300 border-0">
                            Enter Patient Hub
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Button>
                    </Link>
                </CardContent>
            </div>
        </Card>
    );
}
