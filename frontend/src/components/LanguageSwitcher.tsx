'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setLanguage('ru')}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          language === 'ru'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        РУ
      </button>
      <button
        onClick={() => setLanguage('kk')}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          language === 'kk'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        ҚЗ
      </button>
    </div>
  );
}

