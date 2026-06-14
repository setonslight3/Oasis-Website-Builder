import { useEffect, useState } from "react";
import { Link } from "wouter";
import { isPhoneQuery, searchExperiences, searchFlagged } from "@/lib/search";
import { getUserExperiences } from "@/lib/storage";
import { ExperienceCard } from "@/components/ExperienceCard";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, CheckCircle, Search, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Results() {
  const [query, setQuery] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [flaggedResults, setFlaggedResults] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || "";
    setQuery(q);
    
    if (q) {
      const phoneCheck = isPhoneQuery(q);
      setIsPhone(phoneCheck);
      
      if (phoneCheck) {
        setFlaggedResults(searchFlagged(q));
      } else {
        const allExperiences = [...searchExperiences(q), ...getUserExperiences().filter(exp => 
          exp.title.toLowerCase().includes(q.toLowerCase()) || 
          exp.summary.toLowerCase().includes(q.toLowerCase())
        )];
        // remove duplicates by id
        const unique = Array.from(new Map(allExperiences.map(item => [item.id, item])).values());
        setResults(unique);
      }
    }
  }, [window.location.search]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">No search query provided</h2>
        <Button asChild><Link href="/search">Go back to search</Link></Button>
      </div>
    );
  }

  const renderPhoneResults = () => {
    if (flaggedResults.length > 0) {
      const highestRisk = flaggedResults.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current);
      
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <RiskScoreCard 
            target={query}
            risk={highestRisk.risk}
            confidence={highestRisk.confidence}
            reports={flaggedResults.reduce((acc, curr) => acc + curr.reports, 0)}
            date={highestRisk.date}
          />
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Reports</h3>
            <div className="space-y-4">
              {flaggedResults.map(report => (
                <Card key={report.id} className="border-gray-200 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">{report.category}</Badge>
                      <span className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{report.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" /> Help protect others
            </h4>
            <p className="text-blue-800 text-sm mb-4">Have you interacted with this number? Add your report to help keep the student community safe.</p>
            <Button variant="outline" className="bg-white text-blue-700 hover:bg-blue-50">Report this number</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-50 mx-auto flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No reports found</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          We haven't received any fraud reports for <strong>{query}</strong>. However, this does not guarantee it is safe. Always exercise caution when sending money or personal documents.
        </p>
        <Button asChild variant="outline">
          <Link href="/flagr">Check another number</Link>
        </Button>
      </div>
    );
  };

  const renderTextResults = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-white p-2 rounded-lg shadow-sm">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">AI Summary</h3>
                <p className="text-blue-800 leading-relaxed">
                  Based on your search for "{query}", we found {results.length} related experiences. Most students suggest starting preparations early and paying close attention to specific document requirements. Gathering authentic information ahead of time is critical.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              Student Experiences <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{results.length}</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(exp => (
                <ExperienceCard key={exp.id} {...exp} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No experiences found yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any stories matching "{query}". Be the first to share your experience on this topic!
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/submit">Share Your Experience</Link>
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" data-testid="page-results">
      <div className="bg-white border-b border-gray-200 pt-6 pb-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3 text-gray-500 hover:text-gray-900">
            <Link href="/search"><ArrowLeft className="w-4 h-4 mr-2" /> Back to search</Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 truncate">
            {isPhone ? `Fraud Check: ${query}` : `Results for "${query}"`}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {isPhone ? renderPhoneResults() : renderTextResults()}
      </div>
    </div>
  );
}
