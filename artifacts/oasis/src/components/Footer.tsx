import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-12" data-testid="footer">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">OASIS</h3>
            <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
              The one trusted place Nigerian students come to discover opportunities, navigate admissions, and stay safe.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Universal Search</Link></li>
              <li><Link href="/submit" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Share Experience</Link></li>
              <li><Link href="/flagr" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Flagr Fraud Check</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">hello@oasis.edu.ng</li>
              <li className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full mt-2">
                Built for Nigerian students
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} OASIS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
