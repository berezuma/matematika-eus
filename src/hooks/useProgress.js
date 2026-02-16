import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mate-progress';

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function useProgress(topicId) {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const addCorrect = useCallback(() => {
    setScore(s => s + 1);
    setTotal(t => t + 1);
  }, []);

  const addIncorrect = useCallback(() => {
    setTotal(t => t + 1);
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setTotal(0);
  }, []);

  // Save best session to localStorage whenever score/total change
  useEffect(() => {
    if (total === 0) return;
    const all = loadAll();
    const prev = all[topicId] || {};
    const pct = Math.round((score / total) * 100);

    if (!prev.bestTotal || pct > (prev.bestPct || 0) || (pct === prev.bestPct && total > prev.bestTotal)) {
      all[topicId] = {
        bestScore: score,
        bestTotal: total,
        bestPct: pct,
        lastVisited: new Date().toISOString().slice(0, 10),
      };
    } else {
      all[topicId] = { ...prev, lastVisited: new Date().toISOString().slice(0, 10) };
    }

    saveAll(all);
  }, [score, total, topicId]);

  return { score, total, addCorrect, addIncorrect, reset };
}
