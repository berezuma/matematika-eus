import { useState, useEffect } from 'react';

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('mate-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mate-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}
