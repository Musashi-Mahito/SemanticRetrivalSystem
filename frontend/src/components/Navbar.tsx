"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Database, Fingerprint } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Search", href: "/", icon: Search },
        { name: "Ingest", href: "/ingest", icon: Database },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full px-6 py-3 shadow-2xl flex items-center gap-8 pointer-events-auto transition-all hover:border-cyan-500/30 hover:shadow-cyan-500/10">

                {/* Logo / Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                        <Fingerprint className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-100 tracking-tight hidden sm:block">Semantic</span>
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-700" />

                {/* Links */}
                <ul className="flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "relative px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                                        isActive
                                            ? "text-cyan-400 bg-cyan-950/50 shadow-inner shadow-cyan-900/20"
                                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                                    )}
                                >
                                    <Icon className={clsx("h-4 w-4", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute inset-0 rounded-full border border-cyan-500/30 animate-pulse-slow" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
