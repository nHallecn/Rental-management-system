"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building, Users, ShieldAlert, CreditCard, LogOut, Home, FileText, Settings } from 'lucide-react';

// --- Sidebar Component ---
const Sidebar = ({ role }) => {
  const pathname = usePathname();

  const landlordLinks = [
    { href: '/landlord/dashboard', icon: Building, label: 'Minicités' },
    { href: '/landlord/tenants', icon: Users, label: 'Tenants' },
    { href: '/landlord/payments', icon: CreditCard, label: 'Payments' },
    { href: '/landlord/issues', icon: ShieldAlert, label: 'Issues' },
  ];

  const tenantLinks = [
    { href: '/tenant/dashboard', icon: Home, label: 'My Dashboard' },
    { href: '/tenant/bills', icon: FileText, label: 'Bills' },
    { href: '/tenant/issues', icon: ShieldAlert, label: 'Report Issue' },
  ];

  const navLinks = role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <aside className="w-64 bg-[#3A2A1A] text-white flex flex-col">
      <div className="p-6">
        <img src="/bantus-logo-white.svg" alt="Bantus Rental" className="h-8" />
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
            pathname.startsWith(href) ? 'bg-orange-500/20 text-white' : 'text-gray-300 hover:bg-white/10'
          }`}>
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/login" className="flex items-center px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/10">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

// --- Main Dashboard Layout ---
export default function DashboardLayout({ children }) {
  // A simple way to determine role. In a real app, this would come from the AuthContext.
  const pathname = usePathname();
  const role = pathname.includes('/landlord') ? 'landlord' : 'tenant';

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar role={role} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </AuthProvider>
  );
}
