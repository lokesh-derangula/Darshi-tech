import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Phone
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
      className={`fixed left-0 z-40 border-r transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl md:shadow-none ${
        isOpen ? 'w-72 translate-x-0' : 'w-72 md:w-20 -translate-x-full md:translate-x-0'
      }`}
      style={{
        top: bannerHeight,
        height: `calc(100vh - ${bannerHeight}px)`,
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
        color: 'var(--sidebar-text)'
      }}
    >
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

      {/* Scrollable Container (Nav + Footer) */}
      <div className="flex-grow overflow-y-auto flex flex-col justify-between min-h-0 scrollbar-thin">
        {/* Navigation Items */}
        <nav className="mt-6 space-y-1 px-3">
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
    </aside>
  );
}
