import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Search from "@/pages/search";
import Results from "@/pages/results";
import Experience from "@/pages/experience";
import Submit from "@/pages/submit";
import Flagr from "@/pages/flagr";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isLandingPage = location === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {!isLandingPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/search" component={Search} />
      <Route path="/results" component={Results} />
      <Route path="/experience/:id" component={Experience} />
      <Route path="/submit" component={Submit} />
      <Route path="/flagr" component={Flagr} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppLayout>
            <Router />
          </AppLayout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
