"use client";
 
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { 
    BookOpen, 
    Compass, 
    Database, 
    ArrowRight, 
    Check, 
    Loader2, 
    X, 
    Sparkles, 
    HelpCircle,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import clsx from "clsx";
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
 
interface TutorialExample {
    title: string;
    content: string;
    queries: string[];
    tag: string;
    color: string;
}
 
const EXAMPLES: TutorialExample[] = [
    {
        title: "The Nature of Space-Time and Gravity",
        content: "Albert Einstein's General Theory of Relativity describes gravity not as an attractive force, but as a geometric curvature of space-time caused by mass and energy. Massive objects like stars and planets warp the fabric of space-time around them. This warping dictates how other objects move, which we perceive as gravity. Extreme warpings of space-time can lead to the formation of black holes, regions where gravity is so strong that not even light can escape.",
        queries: [
            "How does gravity relate to space-time curvature?",
            "What happens to light near a black hole?"
        ],
        tag: "Astrophysics",
        color: "from-purple-500 to-indigo-500"
    },
    {
        title: "Artificial Intelligence and Neural Networks",
        content: "Artificial Intelligence (AI) has been revolutionized by Deep Learning, which utilizes Artificial Neural Networks. These networks are inspired by the biological structure of the human brain. They consist of layers of interconnected nodes, or artificial neurons, that process and transmit signals. Through a process called backpropagation, neural networks learn to identify complex patterns in massive datasets, powering modern applications from autonomous driving to generative AI systems.",
        queries: [
            "What biological structure inspired deep learning?",
            "How do artificial neural networks learn?"
        ],
        tag: "Computer Science",
        color: "from-cyan-500 to-blue-500"
    }
];
 
export default function TutorialPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [ingestingIndex, setIngestingIndex] = useState<number | null>(null);
    const [ingestedStatus, setIngestedStatus] = useState<Record<number, "success" | "error">>({});
    const [errorMessage, setErrorMessage] = useState("");
 
    const router = useRouter();
    const pathname = usePathname();
 
    const handleExampleIngest = async (index: number) => {
        const example = EXAMPLES[index];
        setIngestingIndex(index);
        setErrorMessage("");
 
        try {
            await axios.post(`${API_BASE_URL}/api/ingest`, {
                title: example.title,
                content: example.content
            });
            setIngestedStatus(prev => ({ ...prev, [index]: "success" }));
            setActiveStep(3); // Auto-advance to search step once ingested!
        } catch (err: any) {
            console.error(err);
            setIngestedStatus(prev => ({ ...prev, [index]: "error" }));
            const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Ingestion failed.";
            setErrorMessage(msg);
        } finally {
            setIngestingIndex(null);
        }
    };
 
    const handleQueryClick = (query: string) => {
        // Close tutorial panel on mobile, navigate to search page
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
        
        // Navigate to home page with query param
        const searchParams = new URLSearchParams();
        searchParams.set("query", query);
        router.push(`/?${searchParams.toString()}`);
    };
 
    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-semibold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border border-cyan-400/30 animate-bounce-slow"
            >
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                <span>Quick Tutorial</span>
            </button>
 
            {/* Overlay Backdrop */}
            <div
                onClick={() => setIsOpen(false)}
                className={clsx(
                    "fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
                )}
            />
 
            {/* Sidebar Panel */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-slate-950/95 border-l border-slate-800/80 shadow-2xl z-50 transition-all duration-300 ease-out flex flex-col font-sans text-slate-100",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-950/50 rounded-xl border border-cyan-900/30">
                            <Sparkles className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-lg text-slate-100">Interactive Tutorial</h2>
                            <p className="text-xs text-slate-400">Master Hybrid Search in 3 steps</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
 
                {/* Steps Indicator Bar */}
                <div className="px-6 py-4 bg-slate-900/20 border-b border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                    {[1, 2, 3].map((step) => (
                        <button
                            key={step}
                            onClick={() => setActiveStep(step)}
                            className={clsx(
                                "flex items-center gap-1.5 pb-1 border-b-2 transition-all",
                                activeStep === step 
                                    ? "text-cyan-400 border-cyan-500" 
                                    : "text-slate-500 border-transparent hover:text-slate-300"
                            )}
                        >
                            <span className={clsx(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                                activeStep === step ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30" : "bg-slate-900 text-slate-500"
                            )}>
                                {step}
                            </span>
                            {step === 1 ? "Core Concept" : step === 2 ? "1. Ingest" : "2. Search"}
                        </button>
                    ))}
                </div>
 
                {/* Scrollable Step Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-cyan-400" />
                                    What is Hybrid Search?
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    This app connects **Neo4j** (a knowledge graph database) and **Qdrant** (a vector search engine) via **Google Gemini** embeddings.
                                </p>
                            </div>
 
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">How the Pipeline Works</h4>
                                <div className="space-y-3">
                                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-200">Text is Chunked</h5>
                                            <p className="text-xs text-slate-400 mt-1">Paragraphs are split to maintain distinct semantic contexts.</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-200">Gemini Vectorization</h5>
                                            <p className="text-xs text-slate-400 mt-1">The system passes chunks to Gemini to compute high-dimensional semantic vectors.</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-200">Graph & Vector Storage</h5>
                                            <p className="text-xs text-slate-400 mt-1">Vectors populate Qdrant, and structured chunks link to document parent nodes in Neo4j.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
 
                            <button
                                onClick={() => setActiveStep(2)}
                                className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800/80 transition-all"
                            >
                                <span>Go to Ingestion Step</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
 
                    {activeStep === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                    <Database className="h-4 w-4 text-cyan-400" />
                                    Step 1: Index Knowledge
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Click **"Ingest this Example"** below to automatically feed a curated document to Qdrant and Neo4j.
                                </p>
                            </div>
 
                            <div className="space-y-4">
                                {EXAMPLES.map((example, idx) => {
                                    const status = ingestedStatus[idx];
                                    const isIngesting = ingestingIndex === idx;
                                    return (
                                        <div 
                                            key={idx}
                                            className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700/60 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r",
                                                    example.color
                                                )}>
                                                    {example.tag}
                                                </span>
                                                {status === "success" && (
                                                    <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                                                        <Check className="h-3.5 w-3.5" /> Ingested
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-200">{example.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{example.content}</p>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleExampleIngest(idx)}
                                                disabled={isIngesting || status === "success"}
                                                className={clsx(
                                                    "w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border",
                                                    status === "success"
                                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                        : "bg-slate-950 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-slate-100"
                                                )}
                                            >
                                                {isIngesting ? (
                                                    <>
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        <span>Ingesting...</span>
                                                    </>
                                                ) : status === "success" ? (
                                                    <span>Successfully Ingested</span>
                                                ) : (
                                                    <>
                                                        <span>Ingest this Example</span>
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
 
                            {errorMessage && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs leading-relaxed break-words">
                                    <strong>Error:</strong> {errorMessage}
                                </div>
                            )}
                        </div>
                    )}
 
                    {activeStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                    <Compass className="h-4 w-4 text-cyan-400" />
                                    Step 2: Semantic Search
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Click any query below. It will automatically load the search page and perform a **vector similarity match** in Qdrant!
                                </p>
                            </div>
 
                            <div className="space-y-4">
                                {EXAMPLES.map((example, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{example.title}</h4>
                                        <div className="grid gap-2">
                                            {example.queries.map((query, qidx) => (
                                                <button
                                                    key={qidx}
                                                    onClick={() => handleQueryClick(query)}
                                                    className="p-3 bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 text-left text-xs font-medium text-slate-300 hover:text-cyan-400 rounded-xl transition-all flex justify-between items-center group"
                                                >
                                                    <span className="line-clamp-1">{query}</span>
                                                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-cyan-400" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
 
                            <div className="p-4 bg-slate-900/20 border border-slate-800/80 rounded-2xl space-y-2 text-xs">
                                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                                    What makes this special?
                                </div>
                                <p className="text-slate-500 leading-relaxed">
                                    Standard search looks for literal keyword matches (e.g. searching "curved" only matches "curved"). 
                                    **Semantic Search** understands that "warping space-time" is conceptualized by gravity, returning relevant knowledge chunks even with completely different wording!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
 
                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-800/80 bg-slate-900/30 flex justify-between items-center">
                    <button
                        onClick={() => {
                            if (activeStep > 1) setActiveStep(activeStep - 1);
                        }}
                        disabled={activeStep === 1}
                        className="px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                        Back
                    </button>
                    
                    <button
                        onClick={() => {
                            if (activeStep < 3) {
                                setActiveStep(activeStep + 1);
                            } else {
                                setIsOpen(false);
                            }
                        }}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-1.5"
                    >
                        <span>{activeStep === 3 ? "Complete Tutorial" : "Next Step"}</span>
                        {activeStep < 3 && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>
        </>
    );
}
