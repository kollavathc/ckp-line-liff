import { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface AppShellProps {
  displayName: string;
  children: ReactNode;
}

export function AppShell({ displayName, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-zinc-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-heading text-lg font-bold text-zinc-950">ซีเค ฟาร์มาซี</p>
            <p className="text-xs text-zinc-500">ระบบบันทึกอุปกรณ์การแพทย์</p>
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
            <NavLink to="/" className="rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">รายการอุปกรณ์</NavLink>
            <span className="px-3 text-sm text-zinc-500">{displayName}</span>
          </nav>
        </div>
        {menuOpen && (
          <nav className="border-t border-stone-200 px-4 py-3 md:hidden" aria-label="เมนูมือถือ">
            <NavLink to="/" className="flex min-h-11 items-center rounded-xl bg-emerald-50 px-4 font-semibold text-emerald-700" onClick={() => setMenuOpen(false)}>
              รายการอุปกรณ์
            </NavLink>
            <p className="px-4 pt-3 text-sm text-zinc-500">เข้าสู่ระบบโดย {displayName}</p>
          </nav>
        )}
      </header>
      {children}
    </div>
  );
}
