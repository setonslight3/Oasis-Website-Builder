import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface ExperienceCardProps {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  summary: string;
}

export function ExperienceCard({ id, category, title, author, date, summary }: ExperienceCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'scholarship': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'admission': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case 'visa': return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
      case 'accommodation': return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
      case 'job': return 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const truncatedSummary = summary.length > 120 ? summary.substring(0, 120) + '...' : summary;

  return (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-gray-200 bg-white" data-testid={`card-experience-${id}`}>
      <CardHeader className="p-5 pb-0 space-y-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`${getCategoryColor(category)} border font-medium px-2.5 py-0.5`}>
            {category}
          </Badge>
        </div>
        <h3 className="text-lg font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {truncatedSummary}
        </p>
        <div className="flex items-center text-xs text-gray-500 gap-3">
          <span className="font-medium text-gray-700">{author}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <Button asChild variant="ghost" className="w-full justify-between px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Link href={`/experience/${id}`}>
            Read full experience <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
