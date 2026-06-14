import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Users, ShieldCheck, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-white" data-testid="page-landing">
      {/* Hero Section */}
      <section className="relative flex-grow flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px] opacity-30"></div>
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-500 blur-[120px] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block mb-4">
            <span className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              SYNAPSE
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            One place you will never <br className="hidden md:block"/> have to leave.
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Discover opportunities, share experiences, and stay safe from scams. Built specifically for Nigerian students.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
              <Link href="/dashboard">Try Demo <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need to succeed</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Stop browsing dozens of forums and nairaland threads. Find vetted, structured information in one place.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Universal Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find scholarships, admission requirements, and accommodation guides with one powerful search engine.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Experience Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Read authentic stories from senior students. Learn what they did right and the mistakes they made.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flagr Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Check phone numbers, bank accounts, and websites against our database of reported student scams.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
