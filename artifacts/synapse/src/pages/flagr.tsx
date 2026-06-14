import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Phone, User, Globe, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import flaggedData from "@/data/flagged.json";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Flagr() {
  const [activeTab, setActiveTab] = useState("phone");
  const [inputValue, setInputValue] = useState("");
  const [bank, setBank] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["flagged", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      try {
        const response = await fetch(`${API_URL}/flagged/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error("Failed to search flagged reports");
        }
        return response.json();
      } catch (e) {
        console.warn("Using static flagged data", e);
        return flaggedData.filter(flag => flag.target.includes(searchQuery));
      }
    },
    enabled: !!searchQuery,
  });

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    
    setHasSearched(true);
    let query = inputValue;
    if (activeTab === 'account' && bank) {
      query = `${inputValue} ${bank}`;
    }
    setSearchQuery(query);
  };

  const resetForm = (tab: string) => {
    setActiveTab(tab);
    setInputValue("");
    setBank("");
    setHasSearched(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24" data-testid="page-flagr">
      <div className="bg-emerald-900 text-white pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-800 rounded-2xl mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Check before you trust.</h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto">
            Verify phone numbers, bank accounts, and websites against our community-sourced database of reported scams before you send money.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl -mt-12 relative z-20">
        <Card className="border-0 shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
          <Tabs defaultValue="phone" onValueChange={resetForm} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-14 bg-gray-100 p-1 rounded-none border-b border-gray-200">
              <TabsTrigger value="phone" className="data-[state=active]:bg-white rounded-md text-sm font-medium">
                <Phone className="w-4 h-4 mr-2" /> Phone
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-white rounded-md text-sm font-medium">
                <User className="w-4 h-4 mr-2" /> Account
              </TabsTrigger>
              <TabsTrigger value="website" className="data-[state=active]:bg-white rounded-md text-sm font-medium">
                <Globe className="w-4 h-4 mr-2" /> Website
              </TabsTrigger>
            </TabsList>

            <div className="p-6 md:p-8 bg-white">
              <form onSubmit={handleCheck} className="space-y-6">
                <TabsContent value="phone" className="m-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="e.g. 08012345678" 
                      className="h-12 text-lg"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="account" className="m-0 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="accountName" className="text-base font-semibold">Account Name / Number</Label>
                      <Input 
                        id="accountName" 
                        placeholder="John Doe or 0123456789" 
                        className="h-12 text-lg"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank" className="text-base font-semibold">Bank</Label>
                      <Select value={bank} onValueChange={setBank}>
                        <SelectTrigger id="bank" className="h-12 text-base">
                          <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gtbank">GTBank</SelectItem>
                          <SelectItem value="access">Access Bank</SelectItem>
                          <SelectItem value="firstbank">First Bank</SelectItem>
                          <SelectItem value="zenith">Zenith Bank</SelectItem>
                          <SelectItem value="uba">UBA</SelectItem>
                          <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                          <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
                          <SelectItem value="polaris">Polaris Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="website" className="m-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-base font-semibold">Website URL</Label>
                    <Input 
                      id="website" 
                      placeholder="e.g. scholarship-portal.xyz" 
                      className="h-12 text-lg"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Label htmlFor="desc" className="text-gray-500 font-normal">Describe the suspicious activity (Optional)</Label>
                  <Textarea 
                    id="desc" 
                    placeholder="Why are you checking this?" 
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!inputValue}>
                  Check Database
                </Button>
              </form>
            </div>
          </Tabs>
        </Card>

        {hasSearched && (
          <div className="mt-10 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            {results.length > 0 ? (
              <>
                <div className="flex items-center gap-3 text-red-600 mb-6">
                  <AlertTriangle className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Matches Found in Database</h2>
                </div>
                
                <RiskScoreCard 
                  target={inputValue}
                  risk={results[0].risk}
                  confidence={results[0].confidence}
                  reports={results.reduce((acc, curr) => acc + curr.reports, 0)}
                  date={results[0].date}
                />
                
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">User Reports</h3>
                  {results.map(report => (
                    <Card key={report.id} className="border-gray-200">
                      <CardContent className="p-5">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-900">{report.category}</span>
                          <span className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700">{report.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">No Reports Found</h3>
                  <p className="text-emerald-800">
                    We don't have any fraud reports for <strong>{inputValue}</strong> in our database. However, this does not mean it is 100% safe. Always verify through official university or embassy channels before making any payments.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
