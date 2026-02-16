import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function ThemeToggle() {
  const [dark, toggle] = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Modu argia aktibatu' : 'Modu iluna aktibatu'}
      className="fixed bottom-5 right-5 z-50 p-3 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl text-slate-700 dark:text-yellow-300 transition-all duration-300 hover:scale-110"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
