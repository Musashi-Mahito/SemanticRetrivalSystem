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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-8 font-sans">
      <div className="w-full max-w-3xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-4 pt-16">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Semantic Retrieval
          </h1>
          <p className="text-slate-400 text-lg">
            Hybrid Search with Vector Embeddings (Qdrant) & Knowledge Graph (Neo4j)
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl 
                       text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 
                       transition-all shadow-lg shadow-black/50"
            placeholder="Ask a question or search for concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg 
                       font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.length > 0 && <h2 className="text-xl font-semibold text-slate-200">Search Results</h2>}

          <div className="grid gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-cyan-900/20 transition-colors">
                    <Database className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-300 leading-relaxed">{result}</p>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> Semantic Match</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && !loading && query && !error && (
              <div className="text-center py-12 text-slate-500">
                No results found. Try ingesting some documents first.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
