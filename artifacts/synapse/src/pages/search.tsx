import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, History, X } from "lucide-react";
import { addRecentSearch, getRecentSearches } from "@/lib/storage";

export default function Search() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      setLocation(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChipClick = (q: string) => {
    addRecentSearch(q);
    setLocation(`/results?q=${encodeURIComponent(q)}`);
  };

  const handleClearRecent = () => {
    localStorage.removeItem('synapse_recent_searches');
    setRecent([]);
  };

  const exampleChips = [
    "Canada scholarship", "FUPRE admission", "UK visa", "08123456789", "Commonwealth scholarship"
  ];

  return (
    <div className="min-h-screen bg-white pt-12 pb-24" data-testid="page-search">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">What are you looking for?</h1>
          <p className="text-lg text-gray-500">Search experiences, admission guides, or check suspicious numbers.</p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-10 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <SearchIcon className="h-6 w-6" />
          </div>
          <Input
            type="text"
            className="w-full pl-14 pr-4 py-8 text-xl rounded-2xl border-2 border-gray-200 bg-gray-50 focus-visible:bg-white focus-visible:ring-0 focus-visible:border-blue-500 shadow-sm transition-all"
            placeholder="Search scholarships, admissions, phone numbers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            data-testid="input-search"
          />
          <Button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            disabled={!query.trim()}
            data-testid="button-submit-search"
          >
            Search
          </Button>
        </form>

        <div className="mb-12">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Try searching for</h3>
          <div className="flex flex-wrap gap-2">
            {exampleChips.map(chip => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                data-testid={`chip-${chip.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {recent.length > 0 && (
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</h3>
              <button onClick={handleClearRecent} className="text-sm text-gray-500 hover:text-red-500 flex items-center">
                <X className="w-4 h-4 mr-1" /> Clear
              </button>
            </div>
            <ul className="space-y-1">
              {recent.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleChipClick(item)}
                    className="w-full flex items-center px-4 py-3 hover:bg-gray-50 rounded-lg text-left transition-colors group"
                  >
                    <History className="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-500 transition-colors" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
