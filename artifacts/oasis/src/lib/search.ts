import experiences from '@/data/experiences.json';
import flagged from '@/data/flagged.json';

export const isPhoneQuery = (query: string): boolean => /^[0-9+\-\s().]{7,}$/.test(query.trim());

export const searchExperiences = (query: string) => {
  const q = query.toLowerCase();
  return experiences.filter(exp =>
    exp.title.toLowerCase().includes(q) ||
    exp.summary.toLowerCase().includes(q) ||
    exp.category.toLowerCase().includes(q) ||
    exp.tags.some((t: string) => t.toLowerCase().includes(q)) ||
    exp.story.toLowerCase().includes(q)
  );
};

export const searchFlagged = (query: string) => {
  const q = query.toLowerCase().replace(/[\s\-\().+]/g, '');
  return flagged.filter(f =>
    f.target.toLowerCase().replace(/[\s\-\().+]/g, '').includes(q) ||
    f.target.toLowerCase().includes(query.toLowerCase())
  );
};

export const summarizeExperience = (exp: any): string => {
  const summaries: Record<string, string> = {
    Scholarship: `This experience covers applying for a ${exp.tags.join(', ')} scholarship. The author highlights key preparation steps, documentation requirements, and lessons learned from the application process.`,
    Admission: `A detailed first-hand account of the ${exp.tags[0] || 'university'} admission process, including portal tips, document requirements, and common pitfalls to avoid.`,
    Visa: `Real experience with the visa application process, covering interview preparation, required documentation, and tips for demonstrating strong ties to Nigeria.`,
    Accommodation: `Practical guide to finding student accommodation with specific pricing, location insights, and negotiation tips from someone who has done it.`,
    Job: `A success story about landing employment or internship opportunities as a Nigerian student, with actionable networking and positioning strategies.`,
  };
  return summaries[exp.category] || `An insightful student experience covering ${exp.tags.join(', ')}. The author shares practical advice and lessons that can help other Nigerian students navigate similar situations.`;
};

export const getRiskColor = (risk: string) => {
  if (risk === 'High') return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' };
  if (risk === 'Medium') return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' };
  return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' };
};
