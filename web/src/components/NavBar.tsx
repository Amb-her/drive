'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

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
      <nav className="sticky top-0 z-50 bg-cream-100/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="text-base font-bold text-warm-900">
            NutriDrive
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'text-warm-500 hover:text-warm-700 hover:bg-cream-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop user */}
          <button
            onClick={logout}
            className="hidden md:block text-xs text-warm-400 hover:text-warm-700 transition-colors"
          >
            Quitter
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-full hover:bg-cream-200 transition-colors"
            aria-label="Menu"
          >
            <span className={`block w-5 h-[2px] bg-warm-900 rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-warm-900 rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-warm-900 rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="absolute top-14 left-0 right-0 bg-cream-50 border-b border-cream-200 shadow-lg p-5 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'text-warm-700 hover:bg-cream-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-cream-200 pt-3 mt-3">
              {user?.firstName && (
                <p className="text-sm text-warm-400 px-4 mb-2">{user.firstName}</p>
              )}
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm text-warm-400 hover:bg-cream-200 transition-colors"
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
