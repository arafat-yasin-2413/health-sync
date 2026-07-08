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
import CustomButton from "../shared/CustomButton";

export default function DoctorPortalCard() {
    return (
        <Card className="flex flex-col justify-between border-slate-200 shadow-sm bg-white hover:border-emerald-200 transition-all">
            <CardHeader>
                <div className="p-2.5 w-fit bg-emerald-50 rounded-lg mb-2 text-emerald-600">
                    <Stethoscope className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                    Doctor Portal
                </CardTitle>
                <CardDescription className="text-slate-500 pt-1 text-sm leading-relaxed">
                    Query records via Patient ID index, track antibiotic
                    consumption graphs, and explore categorized tabs for medical
                    safety validation.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <Link href="/doctor" className="w-full">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 group cursor-pointer">
                            Launch Analytics View
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                {/* <CustomButton
                    text="Launch Analytics View"
                    hyperlink="/doctor"
                    background="bg-blue-500"
                /> */}
            </CardContent>
        </Card>
    );
}
