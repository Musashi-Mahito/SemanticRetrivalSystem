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
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-8 font-sans">
            <div className="w-full max-w-2xl space-y-8 pt-16">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Document Ingestion</h1>
                    <p className="text-slate-400">Add documents to the knowledge base (Graph + Vector Store)</p>
                </div>

                <form onSubmit={handleIngest} className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Document Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="e.g. Overview of AI Agents"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors h-48 resize-none"
                            placeholder="Paste document content here..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UploadCloud className="h-5 w-5" /> Ingest Document</>}
                    </button>

                    {status === "success" && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            Document ingested successfully!
                        </div>
                    )}

                    {status === "error" && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                            Failed to ingest document. Check backend logs.
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}
