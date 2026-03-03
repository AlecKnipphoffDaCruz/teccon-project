import React from 'react';
import logo from '../../assets/logo png.png';
import redLogo from '../../assets/Made with insMind-red-bg-logo.png';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    key: 'dashboard', label: 'Dashboard', path: '/dashboard',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  },
  {
    key: 'coleta', label: 'Nova Coleta', path: '/coleta',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>,
  },
  {
    key: 'analise', label: 'Análise', path: '/analise',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" /></svg>,
  },
  {
    key: 'obras', label: 'Obras', path: '/obras',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    key: 'clientes', label: 'Clientes', path: '/clientes',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    key: 'financeiro', label: 'Financeiro', path: '/financeiro',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  },
];

interface SidebarProps {
  activeKey?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeKey = 'coleta' }) => {
  return (
    <>
      {/* ── Logo fixo canto superior direito ── */}
      <img
        src={redLogo}
        alt="Logo"
        className="fixed top-4 right-5 h-13
       w-auto object-contain z-50 pointer-events-none select-none"
      />

      <aside className="fixed top-0 left-0 h-screen w-[72px] bg-white border-r border-gray-100 shadow-sm flex flex-col items-center py-5 z-50">

        {/* Logo TECCON */}
        <div>
          <img src={logo} alt="TECCON Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Nav */}
        <nav className="flex flex-col items-center gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <a
                key={item.key}
                href={item.path}
                title={item.label}
                className={`
                  relative group w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isActive
                    ? 'bg-[#1A5FAD] text-white shadow-[0_4px_14px_rgba(26,95,173,0.30)]'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}
                `}
              >
                {item.icon}
                {/* Active dot */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-5 bg-[#C8222A] rounded-r-full" />
                )}
                {/* Tooltip */}
                <span className="absolute left-14 bg-gray-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;