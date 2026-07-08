import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ArrowRight, ShieldAlert, Stethoscope, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function PatientPortalCard() {
    return (
        <>
            <Card className="flex flex-col justify-between border-slate-200 shadow-sm bg-white hover:border-indigo-200 transition-all">
                <CardHeader>
                    <div className="p-2.5 w-fit bg-indigo-50 rounded-lg mb-2 text-indigo-600">
                        <User className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">
                        Patient Portal
                    </CardTitle>
                    <CardDescription className="text-slate-500 pt-1 text-sm leading-relaxed">
                        Upload diagnostic documents, run Gemini/OpenAI
                        structural parser workflows, and build an encrypted
                        chronological medical ledger.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <Link href="/patient" className="w-full">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 group cursor-pointer">
                            Enter Patient Hub
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    {/* <CustomButton text="Enter Patient Hub" hyperlink="/patient" background="bg-amber-500"/> */}
                </CardContent>
            </Card>
        </>
    );
}
