import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Home,
  Cpu,
  Globe,
  Database,
  Layers,
  GraduationCap,
  BookOpen,
  Calendar,
  Phone,
  LayoutDashboard,
  LogOut,
  User,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, user, onLogout, bannerHeight = 0, theme }) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/product-development', label: 'Product Development', icon: Cpu },
    { path: '/web-app-development', label: 'Web App Development', icon: Globe },
    { path: '/research-projects', label: 'Research Projects & Internships', icon: Database },
    { path: '/full-stack-projects', label: 'Full Stack Projects & Internships', icon: Layers },
    { path: '/training-placements', label: 'Training & Placements', icon: GraduationCap },
    { path: '/jee-eapcet-training', label: 'JEE Mains & EAPCET Training', icon: BookOpen },
    { path: '/workshops-conferences', label: 'Workshops & Conferences', icon: Calendar },
    { path: '/contact-us', label: 'Contact Us', icon: Phone },
  ];

  return (
    <aside
      className={`fixed left-0 z-40 border-r transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isOpen ? 'w-72' : 'w-20'
      }`}
      style={{
        top: bannerHeight,
        height: `calc(100vh - ${bannerHeight}px)`,
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
        color: 'var(--sidebar-text)'
      }}
    >
      {/* Top Section (Header + Scrollable Nav) */}
      <div className="flex flex-col flex-grow min-h-0">
        {/* Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b" style={{ borderBottomColor: 'var(--sidebar-border)' }}>
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <span className="font-serif text-lg font-bold tracking-widest text-theme-title whitespace-nowrap">
              DARSHI SOLUTIONS
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-full p-2 text-theme-muted hover:bg-[var(--sidebar-hover-bg)] hover:text-theme-title transition-colors"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="mt-6 flex-grow overflow-y-auto space-y-1 px-3 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-full px-4 py-3 text-xs font-semibold tracking-wide uppercase transition-all duration-200 group border ${
                    isActive
                      ? 'border-[var(--text-serif)] bg-[var(--text-serif)] text-[var(--btn-text)] shadow-sm'
                      : 'border-transparent text-theme-muted hover:bg-[var(--sidebar-hover-bg)] hover:text-theme-title'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--btn-text)]' : 'text-[var(--text-serif)]'}`} />
                    <span
                      className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                        isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t shrink-0 transition-colors duration-300" style={{ borderTopColor: 'var(--sidebar-border)', backgroundColor: theme === 'bright' ? 'rgba(0,0,0,0.02)' : 'rgba(8,9,13,0.4)' }}>
        {user ? (
          <div className="flex flex-col gap-2">
            {/* Dashboard Links */}
            {user.role === 'ADMIN' ? (
              <NavLink to="/admin-dashboard">
                {({ isActive }) => (
                  <div className={`flex items-center gap-4 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide uppercase border transition-colors ${
                    isActive ? 'border-[var(--text-serif)] bg-[var(--text-serif)] text-[var(--btn-text)]' : 'border-[var(--text-serif)] text-[var(--text-serif)] bg-transparent hover:bg-[var(--sidebar-hover-bg)]'
                  }`}>
                    <ShieldAlert className={`h-4 w-4 shrink-0 ${isActive ? 'text-[var(--btn-text)]' : 'text-[var(--text-serif)]'}`} />
                    <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
                      Admin Panel
                    </span>
                  </div>
                )}
              </NavLink>
            ) : (
              <NavLink to="/student-dashboard">
                {({ isActive }) => (
                  <div className={`flex items-center gap-4 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide uppercase border transition-colors ${
                    isActive ? 'border-[var(--text-serif)] bg-[var(--text-serif)] text-[var(--btn-text)]' : 'border-[var(--text-serif)] text-[var(--text-serif)] bg-transparent hover:bg-[var(--sidebar-hover-bg)]'
                  }`}>
                    <LayoutDashboard className={`h-4 w-4 shrink-0 ${isActive ? 'text-[var(--btn-text)]' : 'text-[var(--text-serif)]'}`} />
                    <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
                      Student Portal
                    </span>
                  </div>
                )}
              </NavLink>
            )}

            {/* Profile Info & Logout */}
            {isOpen ? (
              <div className="flex items-center justify-between gap-2 px-2 py-2 border rounded-xl border-dashed border-[var(--sidebar-border)] bg-black/5 dark:bg-white/5 transition-all duration-300">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--text-serif)] font-serif text-sm font-bold text-[var(--btn-text)] uppercase transition-colors duration-300" title={user.name}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-theme-body">{user.name}</p>
                    <p className="truncate text-[9px] font-bold text-theme-muted uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/login');
                  }}
                  className="rounded-full p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-2 transition-all duration-300">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--text-serif)] font-serif text-sm font-bold text-[var(--btn-text)] uppercase transition-colors duration-300" title={`${user.name} (${user.role})`}>
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/login');
                  }}
                  className="rounded-full p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <NavLink
              to="/login"
              className="flex items-center gap-4 rounded-full px-4 py-3 text-xs font-semibold tracking-wide uppercase text-[var(--text-serif)] hover:bg-[var(--btn-outline-hover-bg)] border border-[var(--btn-outline-border)] hover:border-[var(--text-serif)] transition-all duration-300"
            >
              <User className="h-4 w-4 shrink-0 text-[var(--text-serif)]" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
                Student Login
              </span>
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}
