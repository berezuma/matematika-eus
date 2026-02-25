import { useState, useEffect } from 'react';

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('mate-theme');
      if (stored) return stored === 'dark';
    } catch { /* localStorage not available */ }
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try { localStorage.setItem('mate-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}
