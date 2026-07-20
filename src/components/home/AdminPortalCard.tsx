import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function AdminPortalCard() {
    return (
        <Card className="relative flex flex-col justify-between border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-amber-100/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 hover:border-amber-300/50 transition-all duration-300 overflow-hidden group/card">
            <div className="absolute inset-0 bg-linear-to-br from-amber-50/80 via-transparent to-transparent dark:from-amber-900/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <CardHeader>
                    <div className="p-3 w-fit bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-xl mb-4 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-amber-500/20 group-hover/card:scale-110 transition-transform duration-300">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Admin Console
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 pt-2 text-sm leading-relaxed">
                        Manage system permissions, register/suspend IDs, audit
                        structural engine parsing, and trigger instant premium mock
                        data injections.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <Link href="/admin" className="w-full">
                        <Button className="w-full bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-white font-medium flex items-center justify-center gap-2 group shadow-md shadow-amber-500/20 transition-all duration-300 border-0">
                            Open Control Panels
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Button>
                    </Link>
                </CardContent>
            </div>
        </Card>
    );
}
