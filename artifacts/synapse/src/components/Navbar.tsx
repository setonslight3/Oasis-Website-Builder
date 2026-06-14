import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const navLinks = [
    { name: "Search", href: "/search" },
    { name: "Experiences", href: "/experience" },
    { name: "Flagr", href: "/flagr" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
      data-testid="navbar"
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity" data-testid="link-home">
            SYNAPSE
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.startsWith(link.href) && link.href !== "/" ? "text-blue-600" : "text-gray-600"
              }`}
              data-testid={`link-nav-${link.name.toLowerCase()}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer" data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-signin-nav">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 pb-4 px-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block py-2 text-base font-medium ${
                location.startsWith(link.href) && link.href !== "/" ? "text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-gray-900">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
