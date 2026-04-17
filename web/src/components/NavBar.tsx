'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/recipes',   label: 'Recettes'  },
  { href: '/shopping',  label: 'Courses'   },
];

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'var(--nav)' }}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-base font-bold text-t1">
            NutriDrive
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    active ? 'bg-brand-500 text-white' : 'text-t2 hover:text-t1 hover:bg-card2'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="text-xs text-t3 hover:text-t1 transition-colors">
              Quitter
            </button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-full hover:bg-card2 transition-colors"
              aria-label="Menu"
            >
              <span style={{ display:'block', width:20, height:2, borderRadius:9999, background:'var(--t1)', transform: open ? 'rotate(45deg) translateY(7px)' : undefined, transition:'transform 0.3s' }} />
              <span style={{ display:'block', width:20, height:2, borderRadius:9999, background:'var(--t1)', opacity: open ? 0 : 1, transition:'opacity 0.3s' }} />
              <span style={{ display:'block', width:20, height:2, borderRadius:9999, background:'var(--t1)', transform: open ? 'rotate(-45deg) translateY(-7px)' : undefined, transition:'transform 0.3s' }} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-14 left-0 right-0 border-b shadow-lg p-5 space-y-2"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active ? 'bg-brand-500 text-white' : 'text-t1 hover:bg-card2'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border)' }}>
              {user?.firstName && <p className="text-sm text-t3 px-4 mb-2">{user.firstName}</p>}
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm text-t3 hover:bg-card2 transition-colors"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
