'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">⚡</span>
              <span className="font-bold text-lg sm:text-xl">{t.footer.brand}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground pr-0 sm:pr-4">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.courses}</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.allCourses}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.forBeginners}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.advanced}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.dashboard}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t.footer.company}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.teachers}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.contacts}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.faq}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t.footer.contacts}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <div>
                  <div className="font-medium text-foreground">{t.footer.email}:</div>
                  <a href="mailto:info@japjaryq.kz" className="hover:text-primary transition-colors">
                    info@japjaryq.kz
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <div>
                  <div className="font-medium text-foreground">{t.footer.phone}:</div>
                  <a href="tel:+77771234567" className="hover:text-primary transition-colors">
                    +7 (777) 123-45-67
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <div>
                  <div className="font-medium text-foreground">{t.footer.address}:</div>
                  <div>{t.footer.addressText}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div>
              © {new Date().getFullYear()} {t.footer.brand}. {t.footer.rights}
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
                {t.footer.policy}
              </Link>
              <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

