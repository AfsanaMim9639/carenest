// app/admin/layout.js
"use client";
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CreditCard, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7aabb8]"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#7aabb8]/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#a3c4e0]/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col">
          <div className="p-6 flex-1">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7aabb8] to-[#4d8a9b] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CareNest</h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            </Link>

            {/* Back to Home Button */}
            <Link 
              href="/"
              className="flex items-center space-x-3 px-4 py-3 mb-6 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all group border border-white/10 hover:border-[#7aabb8]/50"
            >
              <ArrowLeft size={18} className="text-white/50 group-hover:text-[#7aabb8] transition-colors" />
              <span className="font-medium text-sm">Back to Home</span>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2">
              <NavLink 
                href="/admin" 
                icon={<LayoutDashboard size={20} />}
                active={pathname === '/admin'}
              >
                Dashboard
              </NavLink>
              <NavLink 
                href="/admin/bookings" 
                icon={<Calendar size={20} />}
                active={pathname?.startsWith('/admin/bookings')}
              >
                Bookings
              </NavLink>
              <NavLink 
                href="/admin/users" 
                icon={<Users size={20} />}
                active={pathname?.startsWith('/admin/users')}
              >
                Users
              </NavLink>
              <NavLink 
                href="/admin/services" 
                icon={<Users size={20} />}
                active={pathname?.startsWith('/admin/services')}
              >
                Services
              </NavLink>
              <NavLink 
                href="/admin/payments" 
                icon={<CreditCard size={20} />}
                active={pathname?.startsWith('/admin/payments')}
              >
                Payments
              </NavLink>
              <NavLink 
                href="/admin/settings" 
                icon={<Settings size={20} />}
                active={pathname?.startsWith('/admin/settings')}
              >
                Settings
              </NavLink>
            </nav>
          </div>

          {/* User Info */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-white/60">Administrator</p>
              </div>
              <Link href="/" className="text-white/60 hover:text-red-400 transition-colors" title="Back to Home">
                <LogOut size={18} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, icon, children, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
        active 
          ? 'bg-[#7aabb8]/20 text-white border border-[#7aabb8]/50' 
          : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <span className={`transition-colors ${
        active ? 'text-[#7aabb8]' : 'text-white/50 group-hover:text-[#7aabb8]'
      }`}>
        {icon}
      </span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}