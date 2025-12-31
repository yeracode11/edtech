'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useEffect, useState } from 'react';

export function Header() {
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="text-xl sm:text-2xl">⚡</span>
          <span className="hidden xs:inline">JapJaryq Academy</span>
          <span className="xs:hidden">JapJaryq</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/courses" className="text-sm hover:text-primary transition-colors">
            {t.nav.courses}
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                {t.nav.dashboard}
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm hover:text-primary transition-colors">
                  {t.nav.admin}
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                {t.common.logout}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  {t.common.login}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  {t.common.register}
                </Button>
              </Link>
            </>
          )}

          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-4 space-y-3">
            <Link 
              href="/courses" 
              className="block py-2 hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {t.nav.courses}
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block py-2 hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  {t.nav.dashboard}
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="block py-2 hover:text-primary transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t.nav.admin}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-2 hover:text-primary transition-colors"
                >
                  {t.common.logout}
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  onClick={closeMobileMenu}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    {t.common.login}
                  </Button>
                </Link>
                <Link 
                  href="/auth/register"
                  onClick={closeMobileMenu}
                >
                  <Button className="w-full">
                    {t.common.register}
                  </Button>
                </Link>
              </>
            )}

            <div className="pt-3 border-t">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

