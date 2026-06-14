import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getUser, getViewedExperiences } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Search, Users, ShieldCheck, ArrowRight, PlusCircle } from "lucide-react";
import { ExperienceCard } from "@/components/ExperienceCard";
import { useQuery } from "@tanstack/react-query";
import experiencesData from "@/data/experiences.json";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Dashboard() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  const { data: experiences = experiencesData, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_URL}/experiences`);
        if (!response.ok) {
          throw new Error("Failed to fetch experiences");
        }
        return response.json();
      } catch (e) {
        console.warn("Using static experiences data", e);
        return experiencesData;
      }
    },
  });

  const [recentExperiences, setRecentExperiences] = useState<any[]>([]);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    const viewedIds = getViewedExperiences();
    const recent = viewedIds
      .map(id => experiences.find((e: any) => String(e.id) === id))
      .filter(Boolean);
    setRecentExperiences(recent.slice(0, 3));
  }, [experiences]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16" data-testid="page-dashboard">
      <div className="bg-white border-b border-gray-200 pt-8 pb-12 mb-8 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome{user && user.name !== "Guest" ? ` back, ${user.name}` : ", Guest"}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Here's what's happening today in the Nigerian student community. Search for answers, verify suspicious contacts, or learn from others.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 space-y-12">
        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Universal Search</h2>
            <p className="text-gray-600 text-sm mb-6 flex-grow">Search across all scholarships, admissions guides, and our scam database in one place.</p>
            <Button asChild variant="outline" className="w-full justify-between group" data-testid="link-dashboard-search">
              <Link href="/search">
                Open Search <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:border-purple-300 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Experience Network</h2>
            <p className="text-gray-600 text-sm mb-6 flex-grow">Read first-hand accounts from senior students on how they navigated visas, housing, and more.</p>
            <Button asChild variant="outline" className="w-full justify-between group" data-testid="link-dashboard-experiences">
              <Link href="/search">
                Browse Stories <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Flagr Fraud Check</h2>
            <p className="text-gray-600 text-sm mb-6 flex-grow">Verify phone numbers, bank accounts, and websites before you send money or documents.</p>
            <Button asChild variant="outline" className="w-full justify-between group" data-testid="link-dashboard-flagr">
              <Link href="/flagr">
                Launch Flagr <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
            <Button asChild variant="ghost" className="text-blue-600 font-medium">
              <Link href="/submit">
                <PlusCircle className="w-4 h-4 mr-2" /> Share Your Story
              </Link>
            </Button>
          </div>
          
          {recentExperiences.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentExperiences.map(exp => (
                <ExperienceCard key={exp.id} {...exp} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't read any student experiences yet. Start exploring to see them here.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/search">Explore Experiences</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
