import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setUser } from "@/lib/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setUser({ name: email.split('@')[0], email });
      setLocation("/dashboard");
    }
  };

  const handleGuest = () => {
    setUser({ name: "Guest", email: "guest@synapse.edu.ng" });
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 py-12" data-testid="page-login">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-3 text-center pb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500 mb-2">
            SYNAPSE
          </Link>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="student@university.edu.ng" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-login">
              Sign In
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue without account</span>
            </div>
          </div>
          
          <Button variant="outline" type="button" className="w-full" onClick={handleGuest} data-testid="button-guest">
            Continue as Guest
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link href="#" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
