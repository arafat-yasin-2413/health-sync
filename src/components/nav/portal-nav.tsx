"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Stethoscope, ShieldAlert, Home } from "lucide-react";

export function PortalNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Patient Portal", href: "/patient", icon: User },
        { name: "Doctor Portal", href: "/doctor", icon: Stethoscope },
        { name: "Admin Console", href: "/admin", icon: ShieldAlert },
    ];

    return (
        <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse" />
                <span className="font-bold text-slate-900 tracking-tight text-sm md:text-base">
                    Clinical<span className="text-indigo-600">Intel</span>
                </span>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                            )}>
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
