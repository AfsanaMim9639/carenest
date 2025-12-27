import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CreditCard, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

export default async function AdminLayout({ children }) {
  const session = await getServerSession();
  
  // Check if user is admin
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-theme-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-theme-300/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 glass-card-hover border-r border-white/10">
          <div className="p-6">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-theme-100 to-theme-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Care.xyz</h1>
                <p className="text-xs text-theme-200">Admin Dashboard</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2">
              <NavLink href="/admin" icon={<LayoutDashboard size={20} />}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/payments" icon={<CreditCard size={20} />}>
                Payments
              </NavLink>
              <NavLink href="/admin/bookings" icon={<Calendar size={20} />}>
                Bookings
              </NavLink>
              <NavLink href="/admin/users" icon={<Users size={20} />}>
                Users
              </NavLink>
              <NavLink href="/admin/settings" icon={<Settings size={20} />}>
                Settings
              </NavLink>
            </nav>
          </div>

          {/* User Info */}
          <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-theme-200 to-theme-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-theme-200">Administrator</p>
              </div>
              <button className="text-theme-200 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
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

function NavLink({ href, icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-theme-100 hover:bg-white/5 hover:text-white transition-all group"
    >
      <span className="text-theme-300 group-hover:text-theme-100 transition-colors">
        {icon}
      </span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}