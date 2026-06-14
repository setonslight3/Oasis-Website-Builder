import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "wouter";
import { addViewedExperience } from "@/lib/storage";
import { summarizeExperience, extractTags } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles, Clock, MapPin, ThumbsUp, ThumbsDown, Share2, Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Experience() {
  const { id } = useParams();
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiTags, setAiTags] = useState<string[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { data: exp, isLoading: expLoading } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`${API_URL}/experiences/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch experience");
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Load AI content when experience data is available
  const loadAiContent = useCallback(async () => {
    if (!exp) return;
    setIsAiLoading(true);
    try {
      const [summary, tags] = await Promise.all([
        summarizeExperience(exp.story, exp.category),
        extractTags(`${exp.story} ${exp.title} ${exp.tags?.join(' ') || ''}`, exp.tags)
      ]);
      setAiSummary(summary);
      setAiTags(tags.length > 0 ? tags : exp.tags || []);
    } catch (error) {
      console.error("Failed to load AI content:", error);
      // Fallback to original tags if AI tags fail
      setAiTags(exp.tags || []);
    } finally {
      setIsAiLoading(false);
    }
  }, [exp]);

  useEffect(() => {
    if (exp) {
      addViewedExperience(String(exp.id));
      
      // Check helpfulness in localstorage
      const savedHelpful = localStorage.getItem(`helpful_${exp.id}`);
      if (savedHelpful) setHelpful(savedHelpful === 'yes');

      // Load AI content
      loadAiContent();
    }
  }, [exp, loadAiContent]);

  if (expLoading || !exp) return null;

  const handleHelpful = (isHelpful: boolean) => {
    setHelpful(isHelpful);
    localStorage.setItem(`helpful_${exp.id}`, isHelpful ? 'yes' : 'no');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'scholarship': return 'bg-blue-100 text-blue-800';
      case 'admission': return 'bg-purple-100 text-purple-800';
      case 'visa': return 'bg-emerald-100 text-emerald-800';
      case 'accommodation': return 'bg-amber-100 text-amber-800';
      case 'job': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Split story into paragraphs
  const paragraphs = exp.story.split('\n\n');
  const displayTags = aiTags || exp.tags || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24" data-testid={`page-experience-${id}`}>
      <div className="bg-white border-b border-gray-200 py-8 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3 text-gray-500 hover:text-gray-900">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
          </Button>
          
          <div className="mb-4">
            <Badge className={`${getCategoryColor(exp.category)} hover:${getCategoryColor(exp.category)} font-medium px-3 py-1 shadow-none border-0`}>
              {exp.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {exp.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700 font-bold">
                {exp.author.charAt(0)}
              </div>
              <span>Shared by {exp.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{new Date(exp.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {exp.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{exp.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl mt-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 shadow-sm mb-10">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="bg-white p-3 rounded-xl shadow-sm h-fit shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-indigo-950 text-lg">AI Summary</h3>
                  <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 font-medium text-xs">
                    ✨ AI Generated
                  </Badge>
                </div>
                {isAiLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-indigo-200" />
                    <Skeleton className="h-4 w-3/4 bg-indigo-200" />
                    <Skeleton className="h-4 w-5/6 bg-indigo-200" />
                  </div>
                ) : (
                  <p className="text-indigo-900 leading-relaxed">
                    {aiSummary || "Loading AI summary..."}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose prose-lg prose-blue max-w-none mb-12">
          {paragraphs.map((p: string, i: number) => (
            <p key={i} className="text-gray-800 leading-relaxed mb-6">{p}</p>
          ))}
          
          {exp.tips && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl mt-10">
              <h3 className="text-emerald-900 text-xl font-bold mt-0 mb-3 flex items-center">
                Key Advice
              </h3>
              <p className="text-emerald-800 font-medium mb-0">{exp.tips}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {isAiLoading ? (
              <>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </>
            ) : (
              displayTags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="bg-white text-gray-600 border-gray-200">
                  {tag}
                </Badge>
              ))
            )}
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-600 pl-3">Helpful?</span>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleHelpful(true)}
                className={helpful === true ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}
              >
                <ThumbsUp className="w-4 h-4 mr-2" /> Yes
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleHelpful(false)}
                className={helpful === false ? 'text-red-600 bg-red-50' : 'text-gray-500'}
              >
                <ThumbsDown className="w-4 h-4 mr-2" /> No
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-6">
          <Button variant="outline" className="text-gray-600 font-medium">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-red-600">
            <Flag className="w-4 h-4 mr-2" /> Report this experience
          </Button>
        </div>
      </div>
    </div>
  );
}
