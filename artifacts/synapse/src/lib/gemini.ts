import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: In Vite, env variables need to be prefixed with VITE_
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const model = genAI ? genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" }) : null;

// Fallback mock summaries for when API failures
const fallbackSummaries: Record<string, string> = {
  Scholarship: `This experience covers applying for a scholarship. The author highlights key preparation steps, documentation requirements, and lessons learned from the application process. Start contacting supervisors early, preparing transcripts and organizing documents carefully, and budgeting for application fees. A helpful guide for any Nigerian student applying for international scholarships!`,
  Admission: `A detailed first-hand account of the university admission process, including portal tips, document requirements, and common pitfalls to avoid. Make sure to upload all required documents early before the deadline, and double-check everything you have all official documents. Great for Nigerian students seeking university admissions!`,
  Visa: `Real experience with the visa application process, covering interview preparation, required documentation, and tips for demonstrating strong ties to Nigeria. Be confident, know your course details thoroughly, and explain your plan to return home after your studies! A must-read for Nigerian students going through visa interviews!`,
  Accommodation: `Practical guide to finding student accommodation with specific pricing, location insights, and negotiation tips from someone who has done it. Start searching 6 weeks before resumption, bring a trusted adult when viewing places, and always get a signed agreement! Super helpful for Nigerian students looking for safe, affordable housing!`,
  Job: `A success story about landing employment or internship opportunities as a Nigerian student, with actionable networking and positioning strategies. Network consistently, show your thinking, not just credentials, and use platforms like LinkedIn and Twitter (X)!`,
};

export async function summarizeExperience(text: string, category?: string): Promise<string> {
  if (!model) {
    return fallbackSummaries[category || ''] || fallbackSummaries.Scholarship;
  }
  try {
    const prompt = `Summarize the following student experience in under 100 words. Write for a Nigerian student audience. Be clear, encouraging and helpful:\n\n${text}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    return fallbackSummaries[category || ''] || fallbackSummaries.Scholarship;
  }
}

export async function extractTags(text: string, existingTags?: string[]): Promise<string[]> {
  if (!model) {
    return existingTags?.slice(0, 5) || [];
  }
  try {
    const prompt = `Extract 3-5 relevant tags from this student experience. Return ONLY a comma-separated list of tags, nothing else:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const tags = result.response.text().split(",").map(t => t.trim()).filter(t => t.length > 0);
    return tags.slice(0, 5);
  } catch (error) {
    console.error("Error extracting tags:", error);
    return existingTags?.slice(0, 5) || [];
  }
}
