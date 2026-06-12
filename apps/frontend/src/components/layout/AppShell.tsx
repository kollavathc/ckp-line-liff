import { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
  displayName?: string;
}

export function AppShell({ children, displayName }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [
    { to: '/products', label: 'สินค้าทั้งหมด' },
    { to: '/products#categories', label: 'หมวดหมู่' },
    { to: '/products#contact', label: 'ติดต่อร้าน' },
  ];

  function navigationClass({ isActive }: { isActive: boolean }): string {
    return `flex min-h-11 items-center rounded-xl px-4 font-semibold ${isActive ? 'bg-primary-soft text-primary' : 'text-zinc-600 hover:bg-stone-100 hover:text-zinc-950'}`;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/brand/logo.png" alt="โลโก้ซีเค ฟาร์มาซี" className="h-12 w-12 shrink-0 object-contain" />
            <div className="min-w-0">
              <p className="font-heading text-lg font-bold text-zinc-950">ซีเค ฟาร์มาซี</p>
              <p className="truncate text-xs text-zinc-500">อุปกรณ์การแพทย์สำหรับคุณและครอบครัว</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="เปิดเมนู"
            aria-expanded={menuOpen}
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-xl text-zinc-700 hover:bg-stone-100 md:hidden"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </button>
          <nav className="hidden items-center gap-2 md:flex" aria-label="เมนูหลัก">
            {navigation.map((item) => <NavLink key={item.to} to={item.to} className={navigationClass}>{item.label}</NavLink>)}
            {displayName && <span className="px-3 text-sm text-zinc-500">{displayName}</span>}
          </nav>
        </div>
        {menuOpen && (
          <nav className="border-t border-stone-200 px-4 py-3 md:hidden" aria-label="เมนูมือถือ">
            <div className="space-y-2">
              {navigation.map((item) => <NavLink key={item.to} to={item.to} className={navigationClass} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>)}
            </div>
            {displayName && <p className="px-4 pt-3 text-sm text-zinc-500">เข้าสู่ระบบโดย {displayName}</p>}
          </nav>
        )}
      </header>
      {children}
    </div>
  );
}
