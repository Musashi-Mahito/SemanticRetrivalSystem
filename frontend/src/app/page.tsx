"use client";
 
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { 
  Search, 
  Loader2, 
  Database, 
  Share2, 
  Copy, 
  Check, 
  GitBranch, 
  Cpu, 
  Layers, 
  FileText,
  Sparkles
} from "lucide-react";
import clsx from "clsx";
 
interface SearchResultItem {
  title: string;
  sourceType: "graph" | "vector" | "unknown";
  content: string;
}
 
const parseResult = (raw: string): SearchResultItem => {
  // Pattern 1: From Document [Title]: Content
  const graphMatch = raw.match(/^From Document \[(.*?)\]: ([\s\S]*)$/);
  if (graphMatch) {
    return {
      title: graphMatch[1],
      sourceType: "graph",
      content: graphMatch[2]
    };
  }
 
  // Pattern 2: From [Title] (Vector fallback): Content
  const vectorMatch = raw.match(/^From \[(.*?)\] \(Vector fallback\): ([\s\S]*)$/);
  if (vectorMatch) {
    return {
      title: vectorMatch[1],
      sourceType: "vector",
      content: vectorMatch[2]
    };
  }
 
  // Fallback
  return {
    title: "Document Fragment",
    sourceType: "unknown",
    content: raw
  };
};
 
function ResultCard({ result, index }: { result: string; index: number }) {
  const parsed = parseResult(result);
  const [copied, setCopied] = useState(false);
 
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parsed.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
 
  const isGraph = parsed.sourceType === "graph";
 
  return (
    <div
      className={clsx(
        "group relative p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl animate-fade-in-up",
        isGraph 
          ? "bg-slate-900/30 border-slate-800 hover:border-emerald-500/30 hover:shadow-emerald-950/5"
          : "bg-slate-900/30 border-slate-800 hover:border-cyan-500/30 hover:shadow-cyan-950/5"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background soft glow on hover */}
      <div className={clsx(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl",
        isGraph ? "bg-emerald-500/5" : "bg-cyan-500/5"
      )} />
 
      {/* Decorative vertical colored stripe */}
      <div className={clsx(
        "absolute left-0 top-6 bottom-6 w-1 rounded-r-md transition-opacity duration-300",
        isGraph ? "bg-emerald-500" : "bg-cyan-500"
      )} />
 
      <div className="space-y-4 relative z-10 pl-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850/60">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "p-2 rounded-xl border shrink-0 transition-colors",
              isGraph 
                ? "bg-emerald-900/30 border-emerald-900/30 text-emerald-400 group-hover:bg-emerald-900/20" 
                : "bg-cyan-900/30 border-cyan-900/30 text-cyan-400 group-hover:bg-cyan-900/20"
            )}>
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors tracking-tight text-base leading-tight">
                {parsed.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">Source Document</p>
            </div>
          </div>
 
          {/* Badge & Copy Action Container */}
          <div className="flex items-center self-end sm:self-auto gap-2">
            {/* Source Tag */}
            <span className={clsx(
              "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-inner",
              isGraph 
                ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/20" 
                : "text-cyan-400 bg-cyan-950/30 border-cyan-500/20"
            )}>
              {isGraph ? (
                <>
                  <GitBranch className="h-3 w-3 animate-pulse text-emerald-400" />
                  <span>Knowledge Graph (Neo4j)</span>
                </>
              ) : (
                <>
                  <Cpu className="h-3 w-3 animate-pulse text-cyan-400" />
                  <span>Vector Store (Qdrant)</span>
                </>
              )}
            </span>
 
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-100 transition-all border border-transparent hover:border-slate-700/60"
              title="Copy snippet"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
 
        {/* Content Snippet */}
        <div className="text-slate-300 leading-relaxed text-[15px] font-medium py-1 whitespace-pre-line">
          {parsed.content}
        </div>
 
        {/* Footer Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold pt-2 border-t border-slate-850">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span>Format: Semantic Chunk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span>Status: Verified</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto text-slate-600 text-[11px]">
            Index: #{index + 1}
          </div>
        </div>
      </div>
    </div>
  );
}
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
 
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const searchParams = useSearchParams();
 
  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setQuery(queryParam);
      const performSearch = async () => {
        setLoading(true);
        setError("");
        setResults([]);
        try {
          const response = await axios.get(`${API_BASE_URL}/api/search`, {
            params: { query: queryParam },
          });
          setResults(response.data);
        } catch (err: any) {
          console.error(err);
          const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to fetch results. Is the backend running?";
          setError(msg);
        } finally {
          setLoading(false);
        }
      };
      performSearch();
    }
  }, [searchParams]);
 
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
 
    setLoading(true);
    setError("");
    setResults([]);
 
    try {
      // Direct call to backend
      const response = await axios.get(`${API_BASE_URL}/api/search`, {
        params: { query },
      });
      setResults(response.data);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to fetch results. Is the backend running?";
      setError(msg);
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
              <ResultCard key={index} result={result} index={index} />
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
 
export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </main>
    }>
      <SearchComponent />
    </Suspense>
  );
}
