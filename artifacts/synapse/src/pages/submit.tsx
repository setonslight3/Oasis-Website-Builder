import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getUser } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters." }).max(100),
  category: z.string().min(1, { message: "Please select a category." }),
  story: z.string().min(100, { message: "Story must be at least 100 characters to be helpful." }).max(2000),
  tips: z.string().optional(),
});

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Submit() {
  const [, setLocation] = useLocation();
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      story: "",
      tips: "",
    },
  });

  const storyContent = form.watch("story");

  const createExperience = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const user = getUser() || { name: "Anonymous" };
      
      const payload = {
        ...values,
        summary: values.story.substring(0, 150) + "...",
        tags: [values.category, "Student Submitted"],
        author: user.name,
        date: new Date().toISOString(),
        location: "Nigeria"
      };
      
      const response = await fetch(`${API_URL}/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create experience");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      setSuccess(true);
      setTimeout(() => {
        setLocation(`/experience/${data.id}`);
      }, 2000);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createExperience.mutate(values);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-emerald-200 bg-emerald-50/30">
          <CardContent className="pt-10 pb-8 px-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks for sharing!</h2>
            <p className="text-gray-600 mb-8">Your experience will help other Nigerian students navigate similar situations. Redirecting you to your post...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="page-submit">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3 text-gray-500">
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4 mr-2" /> Cancel & Return</Link>
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Share Your Experience</h1>
          <p className="text-lg text-gray-600">Your story could save someone from making a costly mistake or help them land their dream opportunity.</p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Catchy Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., How I Got the Canada Vanier CGS Scholarship" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormDescription>Make it clear what your story is about.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select the best fit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Scholarship">Scholarship</SelectItem>
                          <SelectItem value="Admission">Admission</SelectItem>
                          <SelectItem value="Visa">Visa</SelectItem>
                          <SelectItem value="Accommodation">Accommodation</SelectItem>
                          <SelectItem value="Job">Job / Internship</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base flex justify-between">
                        <span>Your Story</span>
                        <span className={`text-sm font-normal ${storyContent.length < 100 ? 'text-red-500' : 'text-gray-500'}`}>
                          {storyContent.length} / 2000
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Start from the beginning. What challenges did you face? What did you do right?" 
                          className="min-h-[250px] resize-y text-base p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Minimum 100 characters. Be specific with numbers, timelines, and requirements.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Key Advice (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="If you could give one piece of advice to someone in this situation, what would it be?" 
                          className="min-h-[100px] resize-y text-base" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                  <Button asChild variant="ghost" type="button">
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8" disabled={createExperience.isPending}>
                    {createExperience.isPending ? "Publishing..." : "Publish Experience"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
