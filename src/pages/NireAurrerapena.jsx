import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const TOPICS = {
  'int': { title: 'Zenbaki Osoak', link: '/zenbaki-osoak', category: 'Aritmetika' },
  'erag-konb': { title: 'Eragiketa Konbinatuak', link: '/eragiketa-konbinatuak', category: 'Aritmetika' },
  'zatigarri': { title: 'Zatigarritasuna', link: '/zatigarritasuna', category: 'Aritmetika' },
  'zen-hamar': { title: 'Zenbaki Hamartarrak', link: '/zenbaki-hamartarrak', category: 'Aritmetika' },
  'frac': { title: 'Zatikiak', link: '/zatikiak', category: 'Aritmetika' },
  'zatiki-sortzailea': { title: 'Zatiki Sortzailea', link: '/zatiki-sortzailea', category: 'Aritmetika' },
  'unitate-aldaketak': { title: 'Unitate Aldaketak', link: '/unitate-aldaketak', category: 'Aritmetika' },
  'pot': { title: 'Berreturak eta Erroak', link: '/berreturak-erroak', category: 'Aritmetika' },
  'prop': { title: 'Proportzionaltasuna', link: '/proportzionaltasuna', category: 'Aritmetika' },
  'num-sys': { title: 'Zenbaki Sistemak', link: '/zenbaki-sistemak', category: 'Aritmetika' },
  'logaritmoak': { title: 'Logaritmoak', link: '/logaritmoak', category: 'Aritmetika' },
  'ecu-1': { title: 'Lehen Mailako Ekuazioak', link: '/lehen-mailakoa', category: 'Aljebra' },
  'ecu-2': { title: 'Bigarren Mailako Ekuazioak', link: '/bigarren-mailakoa', category: 'Aljebra' },
  'polinom': { title: 'Polinomioak', link: '/polinomioak', category: 'Aljebra' },
  'produktu-nabar': { title: 'Produktu Nabarmenak', link: '/produktu-nabarmenak', category: 'Aljebra' },
  'sys-2x2': { title: 'Ekuazio Sistemak (2x2)', link: '/sistemak-2x2', category: 'Aljebra' },
  'sys-3x3': { title: '3x3 Sistemak', link: '/sistemak-3x3', category: 'Aljebra' },
  'inekuazioak': { title: 'Inekuazioak', link: '/inekuazioak', category: 'Aljebra' },
  'matriz': { title: 'Matrizeak', link: '/matrizeak', category: 'Aljebra' },
  'sexagesimal': { title: 'Sistema Sexagesimala', link: '/sistema-sexagesimala', category: 'Geometria' },
  'area': { title: 'Azalerak eta Bolumenak', link: '/azalerak-bolumenak', category: 'Geometria' },
  'antzekotasuna': { title: 'Antzekotasuna - Tales', link: '/antzekotasuna-tales', category: 'Geometria' },
  'trig': { title: 'Trigonometria', link: '/trigonometria', category: 'Geometria' },
  'vec': { title: 'Bektoreak', link: '/bektoreak', category: 'Geometria' },
  'stat': { title: 'Estatistika', link: '/estatistika', category: 'Analisia' },
  'func': { title: 'Funtzioen Azterketa', link: '/funtzioak', category: 'Analisia' },
  'segidak': { title: 'Segidak', link: '/segidak', category: 'Analisia' },
  'limiteak': { title: 'Limiteak', link: '/limiteak', category: 'Analisia' },
  'deriv': { title: 'Deribatuak', link: '/deribatuak', category: 'Analisia' },
  'integ': { title: 'Integralak', link: '/integralak', category: 'Analisia' },
  'logika-bool': { title: 'Logika Boolearra', link: '/logika-boolearra', category: 'PK' },
  'algoritmoak': { title: 'Algoritmoak', link: '/algoritmoak', category: 'PK' },
  'kriptografia': { title: 'Kriptografia', link: '/kriptografia', category: 'PK' },
};

const CATEGORY_COLORS = {
  'Aritmetika': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'Aljebra': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', bar: 'bg-indigo-500' },
  'Geometria': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' },
  'Analisia': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', bar: 'bg-rose-500' },
  'PK': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', bar: 'bg-cyan-500' },
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('mate-progress')) || {};
  } catch {
    return {};
  }
}

function ProgressBar({ pct, colorClass }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function NireAurrerapena() {
  useDocumentTitle('Nire Aurrerapena');
  const [progress, setProgress] = useState(loadProgress);

  const stats = useMemo(() => {
    const entries = Object.entries(progress)
      .filter(([id]) => TOPICS[id])
      .map(([id, data]) => ({
        id,
        ...TOPICS[id],
        ...data,
      }));

    const totalTopics = Object.keys(TOPICS).length;
    const practicedCount = entries.length;
    const avgPct = entries.length > 0
      ? Math.round(entries.reduce((sum, e) => sum + (e.bestPct || 0), 0) / entries.length)
      : 0;
    const perfectCount = entries.filter(e => e.bestPct === 100).length;

    // Group by category
    const byCategory = {};
    for (const entry of entries) {
      const cat = entry.category;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(entry);
    }

    // Sort entries by last visited (most recent first)
    const sorted = [...entries].sort((a, b) =>
      (b.lastVisited || '').localeCompare(a.lastVisited || '')
    );

    // Streak: consecutive days with activity
    const visitDays = new Set(entries.map(e => e.lastVisited).filter(Boolean));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (visitDays.has(key)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return { entries, sorted, totalTopics, practicedCount, avgPct, perfectCount, byCategory, streak };
  }, [progress]);

  const clearAll = () => {
    if (window.confirm('Aurrerapen guztiak ezabatu nahi dituzu? Ekintza hau ezin da desegin.')) {
      localStorage.removeItem('mate-progress');
      localStorage.removeItem('mate-session');
      setProgress({});
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Hasierara
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nire Aurrerapena</h1>
          <p className="text-indigo-200">Zure ikasketa-ibilbidearen jarraipena</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 -mt-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.practicedCount}/{stats.totalTopics}</p>
            <p className="text-xs text-slate-500 font-medium">Ikasgai landuta</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.avgPct}%</p>
            <p className="text-xs text-slate-500 font-medium">Batez besteko nota</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.perfectCount}</p>
            <p className="text-xs text-slate-500 font-medium">%100 lortuta</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.streak}</p>
            <p className="text-xs text-slate-500 font-medium">Egun jarraian</p>
          </div>
        </div>

        {stats.practicedCount === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Oraindik ez duzu ariketarik egin</h2>
            <p className="text-slate-500 mb-6">Hasi ikasgai bat praktikatzen eta hemen agertuko da zure aurrerapena.</p>
            <Link to="/#topics" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Hasi orain
            </Link>
          </div>
        ) : (
          <>
            {/* Category breakdown */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Arlo bakoitzeko aurrerapena</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => {
                  const catEntries = stats.byCategory[cat] || [];
                  const catTotal = Object.values(TOPICS).filter(t => t.category === cat).length;
                  const catAvg = catEntries.length > 0
                    ? Math.round(catEntries.reduce((s, e) => s + (e.bestPct || 0), 0) / catEntries.length)
                    : 0;
                  return (
                    <div key={cat} className={`${colors.bg} ${colors.border} border rounded-xl p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-bold text-sm ${colors.text}`}>{cat}</span>
                        <span className="text-xs text-slate-500">{catEntries.length}/{catTotal} landuta</span>
                      </div>
                      <ProgressBar pct={catAvg} colorClass={colors.bar} />
                      <p className="text-xs text-slate-500 mt-1">{catAvg}% batez bestekoa</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent activity / all topics */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Ikasgaien zerrenda</h2>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {stats.sorted.map((entry, idx) => {
                  const colors = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS['Aritmetika'];
                  return (
                    <Link
                      key={entry.id}
                      to={entry.link}
                      className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${idx > 0 ? 'border-t border-slate-100' : ''}`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        {entry.bestPct === 100 ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <span className={`text-sm font-bold ${colors.text}`}>{entry.bestPct}%</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{entry.title}</p>
                        <p className="text-xs text-slate-500">
                          <span className={`${colors.text} font-medium`}>{entry.category}</span>
                          {' · '}
                          {entry.bestScore}/{entry.bestTotal} zuzen
                          {entry.lastVisited && ` · ${entry.lastVisited}`}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-24">
                        <ProgressBar pct={entry.bestPct || 0} colorClass={colors.bar} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Clear progress */}
            <div className="text-center">
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Aurrerapen guztiak ezabatu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
