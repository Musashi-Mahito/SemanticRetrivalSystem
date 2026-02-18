"use client";

import { useState } from "react";
import axios from "axios";
import { Search, Loader2, Database, Share2 } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Direct call to backend
      const response = await axios.get(`http://localhost:8080/api/search`, {
        params: { query },
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-8 font-sans overflow-hidden relative">

      {/* Background Gradient Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-700/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-700/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slower" />

      <div className="w-full max-w-4xl space-y-12 relative z-10">

        {/* Hero Section */}
        <div className="text-center space-y-6 pt-12 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-cyan-400 mb-4 shadow-lg shadow-cyan-900/10">
            Powered by Gemini 1.5 & Neo4j
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Semantic
            </span>{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent relative">
              Retrieval
              <svg className="absolute -bottom-2 w-full h-3 text-cyan-500/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Experience the power of hybrid search. We combine <span className="text-cyan-300">vector embeddings</span> with <span className="text-blue-300">knowledge graphs</span> to understand context, not just keywords.
          </p>
        </div>

        {/* Search Input */}
        <div className="animate-fade-in-up delay-100">
          <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-32 py-5 bg-slate-900 border border-slate-800 rounded-2xl 
                           text-slate-100 text-lg placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-slate-700
                           shadow-2xl shadow-black/50 transition-all font-medium"
                placeholder="Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 
                           text-white rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-900/20"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-red-300 text-center animate-shake">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="space-y-6 pb-20">
          {results.length > 0 && (
            <div className="flex items-center gap-3 text-slate-400 pb-2 border-b border-slate-800 animate-fade-in">
              <Database className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Found {results.length} Results</h2>
            </div>
          )}

          <div className="grid gap-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl 
                           hover:bg-slate-800/40 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-900/10 
                           transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-3 bg-slate-800/50 rounded-xl group-hover:bg-cyan-500/10 transition-colors">
                    <Share2 className="h-5 w-5 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-slate-300 leading-relaxed text-lg">{result}</p>
                    <div className="flex gap-3 text-xs font-medium">
                      <span className="px-2 py-1 bg-cyan-950/30 text-cyan-300 rounded-md border border-cyan-900/30">Vector Match</span>
                      <span className="px-2 py-1 bg-blue-950/30 text-blue-300 rounded-md border border-blue-900/30">Score: High</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && !loading && query && !error && (
              <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-3xl border border-slate-800/50 border-dashed animate-fade-in">
                <div className="inline-block p-4 bg-slate-800/50 rounded-full mb-4">
                  <Search className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-lg">No results found.</p>
                <p className="text-sm">Try exploring different concepts or ingest more data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
