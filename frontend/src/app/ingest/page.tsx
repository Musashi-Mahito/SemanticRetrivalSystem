"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud, CheckCircle, Loader2, FileText } from "lucide-react";

export default function IngestPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleIngest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        setStatus("idle");

        try {
            await axios.post(`http://localhost:8080/api/ingest`, { title, content });
            setStatus("success");
            setTitle("");
            setContent("");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-8 font-sans overflow-hidden relative">
            {/* Background Gradient Blob */}
            <div className="absolute top-[-20%] right-[20%] w-[50%] h-[50%] bg-blue-700/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slower" />

            <div className="w-full max-w-3xl space-y-12 pt-12 relative z-10">

                <div className="text-center space-y-4 animate-fade-in-up">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Knowledge Ingestion
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Feed the Semantic Retrieval System with new knowledge.
                    </p>
                </div>

                <form onSubmit={handleIngest} className="space-y-8 animate-fade-in-up delay-100">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">

                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-cyan-400" /> Document Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl 
                                               focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
                                               transition-all text-slate-100 placeholder-slate-600"
                                    placeholder="e.g. The Future of AI Agents"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-400" /> Content
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl 
                                               focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
                                               transition-all h-64 resize-none text-slate-100 placeholder-slate-600 leading-relaxed"
                                    placeholder="Paste the full text content here..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                                   text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                                   flex justify-center items-center gap-3 shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><UploadCloud className="h-6 w-6" /> Ingest Knowledge</>}
                    </button>

                    {status === "success" && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 animate-fade-in-up">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Document successfully indexed into Vector Store & Knowledge Graph!</span>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center animate-shake">
                            Failed to ingest document. Ensure backend is running.
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}
