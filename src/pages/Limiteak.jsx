import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, TrendingUp, ArrowRight, Check, RefreshCw, Zap, ListOrdered, Layers, X, Target, Infinity, AlertTriangle, Brain } from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-red-100 text-red-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Preset functions for the lab ---

const PRESET_FUNCTIONS = [
  {
    label: 'x^2 - 4',
    f: (x) => x * x - 4,
    fLabel: 'f(x) = x^2 - 4',
    defaultPoint: 2,
  },
  {
    label: '(x^2 - 1)/(x - 1)',
    f: (x) => x === 1 ? NaN : (x * x - 1) / (x - 1),
    fLabel: 'f(x) = (x^2 - 1)/(x - 1)',
    defaultPoint: 1,
  },
  {
    label: 'x^3 - 8',
    f: (x) => x * x * x - 8,
    fLabel: 'f(x) = x^3 - 8',
    defaultPoint: 2,
  },
  {
    label: '(x^2 + 3x)/(x + 3)',
    f: (x) => x === -3 ? NaN : (x * x + 3 * x) / (x + 3),
    fLabel: 'f(x) = (x^2 + 3x)/(x + 3)',
    defaultPoint: -3,
  },
  {
    label: 'sin(x)/x',
    f: (x) => x === 0 ? NaN : Math.sin(x) / x,
    fLabel: 'f(x) = sin(x)/x',
    defaultPoint: 0,
  },
  {
    label: '(1 + 1/x)^x',
    f: (x) => x === 0 ? NaN : Math.pow(1 + 1 / x, x),
    fLabel: 'f(x) = (1 + 1/x)^x',
    defaultPoint: Infinity,
  },
];

// --- Limit Explorer Component ---

const LimitExplorer = () => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [pointInput, setPointInput] = useState('2');
  const [approachPoint, setApproachPoint] = useState(2);
  const [isInfinity, setIsInfinity] = useState(false);

  const preset = PRESET_FUNCTIONS[selectedPreset];

  useEffect(() => {
    const dp = preset.defaultPoint;
    if (dp === Infinity) {
      setIsInfinity(true);
      setPointInput('inf');
      setApproachPoint(Infinity);
    } else {
      setIsInfinity(false);
      setPointInput(String(dp));
      setApproachPoint(dp);
    }
  }, [selectedPreset, preset.defaultPoint]);

  const handlePointChange = (val) => {
    setPointInput(val);
    if (val === 'inf' || val === 'Infinity') {
      setIsInfinity(true);
      setApproachPoint(Infinity);
    } else {
      setIsInfinity(false);
      const num = parseFloat(val);
      if (!isNaN(num)) setApproachPoint(num);
    }
  };

  // Generate approach values
  const generateApproachValues = () => {
    if (isInfinity) {
      const rightValues = [10, 100, 1000, 10000, 100000, 1000000];
      return {
        left: [],
        right: rightValues.map(x => ({
          x,
          fx: preset.f(x),
        })),
        isInfinity: true,
      };
    }

    const offsets = [1, 0.5, 0.1, 0.01, 0.001, 0.0001];
    const leftValues = offsets.map(d => ({
      x: approachPoint - d,
      fx: preset.f(approachPoint - d),
    })).reverse();
    const rightValues = offsets.map(d => ({
      x: approachPoint + d,
      fx: preset.f(approachPoint + d),
    }));

    return { left: leftValues, right: rightValues, isInfinity: false };
  };

  const approach = generateApproachValues();

  const formatNum = (n) => {
    if (n === undefined || n === null) return '---';
    if (isNaN(n)) return 'Ez dago';
    if (!isFinite(n)) return n > 0 ? '+inf' : '-inf';
    if (Math.abs(n) < 0.00001 && n !== 0) return n.toExponential(4);
    return n.toFixed(6);
  };

  const formatX = (n) => {
    if (isNaN(n)) return '---';
    if (!isFinite(n)) return n > 0 ? '+inf' : '-inf';
    return n.toString();
  };

  // Estimate the limit from the approach values
  const estimateLimit = () => {
    if (isInfinity) {
      const vals = approach.right;
      if (vals.length < 2) return '---';
      const last = vals[vals.length - 1].fx;
      const prev = vals[vals.length - 2].fx;
      if (isNaN(last) || isNaN(prev)) return 'Ez dago';
      if (!isFinite(last)) return last > 0 ? '+inf' : '-inf';
      if (Math.abs(last - prev) < 0.001) return last.toFixed(4);
      return '---';
    }
    const leftVals = approach.left;
    const rightVals = approach.right;
    if (leftVals.length === 0 || rightVals.length === 0) return '---';
    const lastLeft = leftVals[leftVals.length - 1].fx;
    const lastRight = rightVals[0].fx;
    if (isNaN(lastLeft) || isNaN(lastRight)) return 'Ez dago';
    if (!isFinite(lastLeft) || !isFinite(lastRight)) return 'Ez dago (inf)';
    if (Math.abs(lastLeft - lastRight) < 0.01) {
      return ((lastLeft + lastRight) / 2).toFixed(4);
    }
    return 'Ez dago (ezker != eskuin)';
  };

  return (
    <div className="space-y-6">
      {/* Preset selector */}
      <div>
        <p className="text-sm font-bold text-slate-600 mb-3">Aukeratu funtzio bat:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_FUNCTIONS.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedPreset(i)}
              className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                selectedPreset === i
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-red-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current function display */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
        <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Funtzioa</p>
        <p className="text-xl md:text-2xl font-mono font-bold text-red-400">{preset.fLabel}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-slate-400 text-sm">Limitea x =</span>
          <input
            type="text"
            value={pointInput}
            onChange={(e) => handlePointChange(e.target.value)}
            className="w-24 text-center bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 font-mono font-bold text-white focus:border-red-500 focus:outline-none"
            placeholder="0"
          />
          <span className="text-slate-400 text-sm">puntuan</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Idatzi "inf" infinituko limiterako</p>
      </div>

      {/* Approach tables */}
      <div className={`grid ${isInfinity ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
        {/* Left approach */}
        {!isInfinity && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight size={16} className="text-blue-500" />
              <h4 className="font-bold text-slate-700">Ezkerretik hurbiltzea (x &lt; {formatX(approachPoint)})</h4>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-4 py-2 text-left font-bold text-blue-800">x</th>
                    <th className="px-4 py-2 text-right font-bold text-blue-800">f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {approach.left.map((row, i) => (
                    <tr key={i} className={`border-t border-blue-100 ${i === approach.left.length - 1 ? 'bg-blue-100/50 font-bold' : ''}`}>
                      <td className="px-4 py-2 font-mono text-slate-700">{formatNum(row.x)}</td>
                      <td className="px-4 py-2 font-mono text-right text-blue-700">{formatNum(row.fx)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Right approach / Infinity approach */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={16} className="text-emerald-500 rotate-180" />
            <h4 className="font-bold text-slate-700">
              {isInfinity ? 'Infiniturantz hurbiltzea (x -> +inf)' : `Eskuinetik hurbiltzea (x > ${formatX(approachPoint)})`}
            </h4>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-emerald-100">
                  <th className="px-4 py-2 text-left font-bold text-emerald-800">x</th>
                  <th className="px-4 py-2 text-right font-bold text-emerald-800">f(x)</th>
                </tr>
              </thead>
              <tbody>
                {approach.right.map((row, i) => (
                  <tr key={i} className={`border-t border-emerald-100 ${i === 0 && !isInfinity ? 'bg-emerald-100/50 font-bold' : ''} ${i === approach.right.length - 1 && isInfinity ? 'bg-emerald-100/50 font-bold' : ''}`}>
                    <td className="px-4 py-2 font-mono text-slate-700">{formatX(row.x)}</td>
                    <td className="px-4 py-2 font-mono text-right text-emerald-700">{formatNum(row.fx)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Estimated limit */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
        <p className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Estimatutako limitea</p>
        <p className="text-3xl font-mono font-bold text-red-700">
          lim f(x) = {estimateLimit()}
        </p>
        <p className="text-xs text-red-400 mt-2">x -&gt; {isInfinity ? '+inf' : formatX(approachPoint)}</p>
      </div>

      {/* Number line visualization */}
      {!isInfinity && (
        <div>
          <h4 className="font-bold text-slate-700 mb-3">Zenbaki-lerroko bistaratzea</h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="relative h-16">
              {/* Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-300 -translate-y-1/2"></div>

              {/* Center point */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: '50%' }}
              >
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-red-600 whitespace-nowrap">
                  x = {formatX(approachPoint)}
                </span>
              </div>

              {/* Left arrows */}
              {[35, 30, 25, 20, 15, 10].map((pos, i) => (
                <div
                  key={`l-${i}`}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${pos}%` }}
                >
                  <div className={`w-2 h-2 bg-blue-500 rounded-full ${i >= 4 ? 'animate-pulse' : ''}`}
                    style={{ opacity: 0.3 + i * 0.12 }}
                  ></div>
                </div>
              ))}

              {/* Right arrows */}
              {[65, 70, 75, 80, 85, 90].map((pos, i) => (
                <div
                  key={`r-${i}`}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${pos}%` }}
                >
                  <div className={`w-2 h-2 bg-emerald-500 rounded-full ${i <= 1 ? 'animate-pulse' : ''}`}
                    style={{ opacity: 1 - i * 0.12 }}
                  ></div>
                </div>
              ))}

              {/* Labels */}
              <span className="absolute bottom-0 left-4 text-xs text-blue-500 font-bold">Ezkerretik</span>
              <span className="absolute bottom-0 right-4 text-xs text-emerald-500 font-bold">Eskuinetik</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Practice problem generators ---

const generateLimitProblem = () => {
  const types = ['polynomial', 'rational_zero', 'rational_inf', 'infinity_poly', 'notable'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'polynomial') {
    // Simple polynomial limit: lim (ax^2 + bx + c) as x -> d
    const a = Math.floor(Math.random() * 3) + 1;
    const b = Math.floor(Math.random() * 7) - 3;
    const c = Math.floor(Math.random() * 7) - 3;
    const d = Math.floor(Math.random() * 5) - 2;
    const result = a * d * d + b * d + c;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    return {
      type: 'Limite polinomikoa',
      display: `lim (${a === 1 ? '' : a}x^2 ${bStr}x ${cStr})\nx -> ${d}`,
      solution: result,
      options: generateOptions(result),
      hint: `Polinomio baten limitea kalkulatzeko, balioa zuzenean ordezkatzen da: f(${d}) = ${a}*(${d})^2 + (${b})*(${d}) + (${c}) = ${result}`,
    };
  }

  if (type === 'rational_zero') {
    // (x^2 - a^2) / (x - a) as x -> a = a + a = 2a (0/0 form)
    const a = Math.floor(Math.random() * 4) + 1;
    const result = 2 * a;
    return {
      type: 'Forma indeterminatua 0/0',
      display: `lim (x^2 - ${a * a}) / (x - ${a})\nx -> ${a}`,
      solution: result,
      options: generateOptions(result),
      hint: `0/0 forma indeterminatua da. Faktorizatu: (x^2 - ${a * a}) = (x - ${a})(x + ${a}). Sinplifikatu (x - ${a}) eta ordeztu: x + ${a} = ${a} + ${a} = ${result}`,
    };
  }

  if (type === 'rational_inf') {
    // (ax^2 + bx) / (cx^2 + d) as x -> inf = a/c
    const a = Math.floor(Math.random() * 4) + 1;
    const c = Math.floor(Math.random() * 4) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const d = Math.floor(Math.random() * 5) + 1;
    const result = a / c;
    return {
      type: 'Limite infinituan (grad. berdinak)',
      display: `lim (${a === 1 ? '' : a}x^2 + ${b}x) / (${c === 1 ? '' : c}x^2 + ${d})\nx -> inf`,
      solution: result,
      options: generateOptions(result),
      hint: `Gradu berdineko polinomioak infinituan: koefiziente nagusien zatidura = ${a}/${c} = ${result}`,
    };
  }

  if (type === 'infinity_poly') {
    // lim (ax^2 + bx) / (cx^3 + d) as x -> inf = 0 (menor grado arriba)
    const a = Math.floor(Math.random() * 3) + 1;
    const c = Math.floor(Math.random() * 3) + 1;
    const b = Math.floor(Math.random() * 5);
    const d = Math.floor(Math.random() * 5) + 1;
    return {
      type: 'Limite infinituan (gradu ezberdinak)',
      display: `lim (${a === 1 ? '' : a}x^2 + ${b}) / (${c === 1 ? '' : c}x^3 + ${d})\nx -> inf`,
      solution: 0,
      options: generateOptions(0),
      hint: `Zenbakigaiaren gradua (2) < izendatzailearena (3) denean, limitea = 0 da infinituan.`,
    };
  }

  // Notable limit: sin(x)/x -> 1 as x -> 0
  const notables = [
    {
      display: 'lim sin(x) / x\nx -> 0',
      solution: 1,
      hint: 'Limite nabarmena: lim sin(x)/x = 1 denean x -> 0.',
    },
    {
      display: 'lim (1 - cos(x)) / x^2\nx -> 0',
      solution: 0.5,
      hint: 'Limite nabarmena: lim (1 - cos(x))/x^2 = 1/2 denean x -> 0.',
    },
    {
      display: 'lim sin(3x) / x\nx -> 0',
      solution: 3,
      hint: 'lim sin(kx)/x = k. Kasu honetan k = 3, beraz limitea = 3.',
    },
  ];
  const notable = notables[Math.floor(Math.random() * notables.length)];
  return {
    type: 'Limite nabarmena',
    display: notable.display,
    solution: notable.solution,
    options: generateOptions(notable.solution),
    hint: notable.hint,
  };
};

const generateOptions = (correct) => {
  const opts = new Set();
  opts.add(correct);
  while (opts.size < 4) {
    let distractor;
    const rand = Math.random();
    if (rand < 0.3) {
      distractor = correct + Math.floor(Math.random() * 5) + 1;
    } else if (rand < 0.6) {
      distractor = correct - Math.floor(Math.random() * 5) - 1;
    } else if (rand < 0.8) {
      distractor = correct * 2;
    } else {
      distractor = -correct;
    }
    // Round to avoid float weirdness
    distractor = Math.round(distractor * 100) / 100;
    if (distractor !== correct) opts.add(distractor);
  }
  return [...opts].sort(() => Math.random() - 0.5);
};

// --- Main Component ---

export default function Limiteak() {
  const [activeTab, setActiveTab] = useState('teoria');
  const [problem, setProblem] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('limiteak');

  useEffect(() => {
    setProblem(generateLimitProblem());
  }, []);

  const handleAnswer = (answer) => {
    if (feedback) return;
    setSelectedAnswer(answer);
    if (Math.abs(answer - problem.solution) < 0.01) {
      addCorrect();
      setFeedback('correct');
    } else {
      addIncorrect();
      setFeedback('incorrect');
    }
  };

  const nextProblem = () => {
    setProblem(generateLimitProblem());
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);
  };

  const tabs = [
    { key: 'teoria', label: 'Teoria' },
    { key: 'laborategia', label: 'Laborategia' },
    { key: 'formulak', label: 'Formulak' },
    { key: 'praktika', label: 'Praktika' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-100 selection:text-red-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.map(t => (
              t.key === 'praktika' ? (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-sm shadow-red-200">
                  {t.label}
                </button>
              ) : (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`hover:text-red-600 transition-colors ${activeTab === t.key ? 'text-red-600' : ''}`}>
                  {t.label}
                </button>
              )
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Limiteen{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">Kalkulua</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Funtzioen portaera puntu jakin batean edo infinituan. Kalkuluaren oinarrizko kontzeptua, deribatuak eta integralak ulertzeko ezinbestekoa.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.key ? 'bg-red-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================ */}
        {/* TAB 1: TEORIA                               */}
        {/* ============================================ */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* What is a limit - intuitive */}
            <Section title="Zer da limite bat?" icon={BookOpen} className="border-red-200 ring-4 ring-red-50/30">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-red-100 rounded-xl p-6">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Target size={18} className="text-red-500" />
                      Definizio Intuitiboa
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Funtzio baten <strong>limitea</strong> x puntu batera hurbiltzen denean, funtzioaren balioa zein baliotara hurbiltzen den adierazten du, nahiz eta puntu horretan funtzioak baliorik ez izan.
                    </p>
                    <div className="bg-red-50 p-4 rounded-lg text-sm text-red-800">
                      <p><strong>Adibidea:</strong> f(x) = (x^2 - 1)/(x - 1) funtzioak x = 1 puntuan ez du baliorik (0/0), baina x = 1era hurbiltzen denean, f(x) balioa 2ra hurbiltzen da.</p>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Layers size={18} className="text-red-500" />
                      Definizio Formala (epsilon-delta)
                    </h3>
                    <div className="bg-slate-900 text-white p-4 rounded-xl text-center mb-3">
                      <p className="font-mono text-sm">
                        lim f(x) = L
                      </p>
                      <p className="font-mono text-xs text-slate-400">x -&gt; a</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Edozein epsilon &gt; 0 emanik, existitzen da delta &gt; 0 non:
                      </p>
                      <p className="font-mono text-sm text-red-400 mt-1">
                        0 &lt; |x - a| &lt; delta =&gt; |f(x) - L| &lt; epsilon
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      Hau da: x-ren eta a-ren arteko distantzia nahikoa txikia bada, f(x) eta L arteko distantzia nahi bezain txikia izan daiteke.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* One-sided limits */}
            <Section title="Alde bakarreko limiteak" icon={ArrowRight}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Batzuetan funtzioak modu desberdinean portatzen da puntu batera ezkerretik edo eskuinetik hurbiltzean. Orduan <strong>alde bakarreko limiteak</strong> erabiltzen ditugu.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <h4 className="font-bold text-blue-800 mb-2">Ezkerreko limitea</h4>
                    <div className="bg-white p-3 rounded-lg font-mono text-center text-blue-700 font-bold mb-3">
                      lim f(x) = L<sup>-</sup>
                      <br />
                      <span className="text-xs text-blue-400">x -&gt; a<sup>-</sup></span>
                    </div>
                    <p className="text-sm text-blue-700">
                      x &lt; a diren balioetatik hurbiltzen garenean (ezkerretik).
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                    <h4 className="font-bold text-emerald-800 mb-2">Eskuineko limitea</h4>
                    <div className="bg-white p-3 rounded-lg font-mono text-center text-emerald-700 font-bold mb-3">
                      lim f(x) = L<sup>+</sup>
                      <br />
                      <span className="text-xs text-emerald-400">x -&gt; a<sup>+</sup></span>
                    </div>
                    <p className="text-sm text-emerald-700">
                      x &gt; a diren balioetatik hurbiltzen garenean (eskuinetik).
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Garrantzitsua:</strong> Limitea existitzen da <strong>soilik</strong> bi alde bakarreko limiteak berdinak direnean: L<sup>-</sup> = L<sup>+</sup> = L</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Limits at infinity */}
            <Section title="Limiteak infinituan" icon={Infinity}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  x infiniturarantz joaten denean funtzioaren portaera aztertzen dugu. Emaitza finitu bat, infinitu edo existitzen ez dena izan daiteke.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">Gradu berdina</h4>
                    <div className="bg-white p-3 rounded-lg font-mono text-sm text-center font-bold mb-2">
                      <span className="text-red-600">3</span>x^2 + 5x
                      <hr className="my-1 border-slate-300" />
                      <span className="text-red-600">2</span>x^2 + 1
                    </div>
                    <p className="text-xs text-slate-500 text-center">Limitea = <strong className="text-red-600">3/2</strong></p>
                    <p className="text-xs text-slate-400 mt-1">Koefiziente nagusien zatidura</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">Goiko gradu handiagoa</h4>
                    <div className="bg-white p-3 rounded-lg font-mono text-sm text-center font-bold mb-2">
                      x<sup>3</sup> + 2x
                      <hr className="my-1 border-slate-300" />
                      x^2 + 1
                    </div>
                    <p className="text-xs text-slate-500 text-center">Limitea = <strong className="text-red-600">+/- inf</strong></p>
                    <p className="text-xs text-slate-400 mt-1">Zenbakigaiaren gradua handiagoa</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">Beheko gradu handiagoa</h4>
                    <div className="bg-white p-3 rounded-lg font-mono text-sm text-center font-bold mb-2">
                      x^2 + 1
                      <hr className="my-1 border-slate-300" />
                      x<sup>3</sup> + 2x
                    </div>
                    <p className="text-xs text-slate-500 text-center">Limitea = <strong className="text-red-600">0</strong></p>
                    <p className="text-xs text-slate-400 mt-1">Izendatzailearen gradua handiagoa</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Indeterminate forms */}
            <Section title="Forma indeterminatuak" icon={Zap}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Limite bat zuzenean kalkulatzean forma indeterminatu bat agertzen denean, ezin dugu balio zuzena jakin. Teknika bereziak erabili behar dira.
                </p>

                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { form: '0/0', desc: 'Zenbakigaia eta izendatzailea 0 dira', color: 'red' },
                    { form: 'inf/inf', desc: 'Biak infinitu dira', color: 'orange' },
                    { form: 'inf - inf', desc: 'Bi infinituren arteko kenketa', color: 'amber' },
                    { form: '0 * inf', desc: 'Zero bider infinitu', color: 'yellow' },
                    { form: '1^inf', desc: 'Bat ber infinitu', color: 'lime' },
                  ].map((item, i) => (
                    <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-xl p-4 text-center`}>
                      <p className={`text-2xl font-mono font-bold text-${item.color}-700 mb-2`}>{item.form}</p>
                      <p className={`text-xs text-${item.color}-600`}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-slate-800 text-lg mt-6">Nola ebatzi forma indeterminatu bakoitza</h3>

                {/* 0/0 */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-red-800 flex items-center gap-2">
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-mono">0/0</span>
                    Faktorizazioa edo L'Hopital
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">1. Faktorizazioa</p>
                      <div className="font-mono text-sm text-slate-700 space-y-1">
                        <p>lim (x^2 - 4) / (x - 2)</p>
                        <p className="text-slate-400">x -&gt; 2</p>
                        <p className="text-red-600">= lim (x-2)(x+2) / (x-2)</p>
                        <p className="text-red-600">= lim (x+2) = <strong>4</strong></p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">2. L'Hopital-en erregela</p>
                      <div className="font-mono text-sm text-slate-700 space-y-1">
                        <p>lim f(x)/g(x) = lim f'(x)/g'(x)</p>
                        <p className="text-slate-400">x -&gt; a (0/0 bada)</p>
                        <p className="text-red-600">lim (x^2-4)/(x-2) = lim 2x/1 = <strong>4</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* inf/inf */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-orange-800 flex items-center gap-2">
                    <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-mono">inf/inf</span>
                    Gradu handienaz zatitu
                  </h4>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-mono text-sm text-slate-700 space-y-1">
                      <p>lim (3x^2 + 5x) / (2x^2 + 1)</p>
                      <p className="text-slate-400">x -&gt; inf</p>
                      <p className="text-orange-600">= lim (3 + 5/x) / (2 + 1/x^2)</p>
                      <p className="text-orange-600 font-bold">= 3/2</p>
                    </div>
                    <p className="text-xs text-orange-600 mt-2">x^2-z zatitu zenbakigaia eta izendatzailea, eta infinituan 1/x -&gt; 0 erabili.</p>
                  </div>
                </div>

                {/* inf - inf */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-amber-800 flex items-center gap-2">
                    <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-mono">inf - inf</span>
                    Izendatzaile komunera eraman
                  </h4>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-mono text-sm text-slate-700 space-y-1">
                      <p>lim (1/(x-1) - 1/(x^2-1))</p>
                      <p className="text-slate-400">x -&gt; 1</p>
                      <p className="text-amber-600">= lim ((x+1) - 1) / (x^2-1)</p>
                      <p className="text-amber-600">= lim x / ((x-1)(x+1))</p>
                      <p className="text-amber-600 font-bold">Edo izendatzaile komunera batu eta sinplifikatu.</p>
                    </div>
                  </div>
                </div>

                {/* 0 * inf */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-yellow-800 flex items-center gap-2">
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-mono">0 * inf</span>
                    Zatidura bihurtu
                  </h4>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-mono text-sm text-slate-700 space-y-1">
                      <p>lim x * ln(x)</p>
                      <p className="text-slate-400">x -&gt; 0+</p>
                      <p className="text-yellow-700">= lim ln(x) / (1/x)</p>
                      <p className="text-yellow-700">Orain inf/inf da, L'Hopital aplika daiteke.</p>
                      <p className="text-yellow-700 font-bold">= lim (1/x) / (-1/x^2) = lim (-x) = 0</p>
                    </div>
                  </div>
                </div>

                {/* 1^inf */}
                <div className="bg-lime-50 border border-lime-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-lime-800 flex items-center gap-2">
                    <span className="bg-lime-200 text-lime-800 px-3 py-1 rounded-full text-sm font-mono">1^inf</span>
                    e-ren definizioa erabili
                  </h4>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-mono text-sm text-slate-700 space-y-1">
                      <p>lim (1 + 1/n)^n = e</p>
                      <p className="text-slate-400">n -&gt; inf</p>
                      <p className="text-lime-700 mt-2">Orokorrean: lim (1 + k/x)^(mx) denean</p>
                      <p className="text-lime-700 font-bold">= e^(k*m)</p>
                    </div>
                    <p className="text-xs text-lime-600 mt-2">Logaritmo nepertarra hartu eta exponentziala berrerabili.</p>
                  </div>
                </div>

                {/* L'Hopital general note */}
                <div className="p-4 bg-slate-900 text-white rounded-xl">
                  <h4 className="font-bold text-red-400 mb-2">L'Hopital-en erregela (orokorra)</h4>
                  <div className="font-mono text-center text-lg mb-3">
                    <span className="text-slate-300">lim f(x)/g(x)</span> = <span className="text-red-400">lim f'(x)/g'(x)</span>
                  </div>
                  <p className="text-sm text-slate-400 text-center">
                    0/0 edo inf/inf forma indeterminatua denean, zenbakigaiaren eta izendatzailearen deribatuak kalkulatu eta limitea berriro ebaluatu.
                  </p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================ */}
        {/* TAB 2: LABORATEGIA                          */}
        {/* ============================================ */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Limite Esploratzailea (Interaktiboa)" icon={TrendingUp}>
              <LimitExplorer />
            </Section>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB 3: FORMULAK                             */}
        {/* ============================================ */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Limit properties */}
            <Section title="Limiteen Propietateak" icon={ListOrdered}>
              <div className="space-y-3">
                {[
                  {
                    name: 'Batuketa',
                    formula: 'lim [f(x) + g(x)] = lim f(x) + lim g(x)',
                    example: 'lim (x^2 + 3x) = lim x^2 + lim 3x = 4 + 6 = 10 (x->2)',
                    color: 'red',
                  },
                  {
                    name: 'Kenketa',
                    formula: 'lim [f(x) - g(x)] = lim f(x) - lim g(x)',
                    example: 'lim (x^2 - x) = 4 - 2 = 2 (x->2)',
                    color: 'orange',
                  },
                  {
                    name: 'Biderkadura',
                    formula: 'lim [f(x) * g(x)] = lim f(x) * lim g(x)',
                    example: 'lim (x * x^2) = 2 * 4 = 8 (x->2)',
                    color: 'amber',
                  },
                  {
                    name: 'Zatidura',
                    formula: 'lim [f(x) / g(x)] = lim f(x) / lim g(x)  (lim g(x) != 0)',
                    example: 'lim (x^2 / x) = 4 / 2 = 2 (x->2)',
                    color: 'yellow',
                  },
                  {
                    name: 'Konstantea',
                    formula: 'lim [k * f(x)] = k * lim f(x)',
                    example: 'lim (5x) = 5 * lim x = 5*3 = 15 (x->3)',
                    color: 'lime',
                  },
                  {
                    name: 'Berretura',
                    formula: 'lim [f(x)]^n = [lim f(x)]^n',
                    example: 'lim x^3 = (lim x)^3 = 2^3 = 8 (x->2)',
                    color: 'green',
                  },
                  {
                    name: 'Erro karratu',
                    formula: 'lim sqrt(f(x)) = sqrt(lim f(x))  (lim f(x) >= 0)',
                    example: 'lim sqrt(x+5) = sqrt(4+5) = 3 (x->4)',
                    color: 'emerald',
                  },
                ].map((r, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-${r.color}-50 border border-${r.color}-100 hover:border-${r.color}-300 transition-colors`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="md:w-28 shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase">{r.name}</span>
                      </div>
                      <div className="flex-1 font-mono text-sm font-bold text-slate-700">{r.formula}</div>
                      <div className="flex-1">
                        <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs text-slate-600">
                          {r.example}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Notable limits */}
            <Section title="Limite Nabarmenak" icon={Zap}>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Limite nabarmena #1</p>
                    <div className="text-center">
                      <p className="text-2xl font-mono font-bold">
                        lim <span className="text-red-400">sin(x)</span> / <span className="text-amber-400">x</span> = <span className="text-emerald-400">1</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">x -&gt; 0</p>
                    </div>
                    <p className="text-sm text-slate-400 mt-4">
                      Hau kalkuluaren oinarrizko limitea da. sin(x) eta x ia berdinak dira x txikia denean.
                    </p>
                  </div>
                  <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Limite nabarmena #2</p>
                    <div className="text-center">
                      <p className="text-2xl font-mono font-bold">
                        lim <span className="text-red-400">(1 + 1/n)</span><sup className="text-amber-400">n</sup> = <span className="text-emerald-400">e</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">n -&gt; inf</p>
                    </div>
                    <p className="text-sm text-slate-400 mt-4">
                      e zenbakiaren (Euler-en zenbakia, 2.71828...) definizioa. Hazkuntza esponentzialaren oinarria.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <p className="font-mono text-sm font-bold text-slate-700 mb-1">lim (1 - cos(x)) / x^2</p>
                    <p className="text-xs text-slate-400">x -&gt; 0</p>
                    <p className="text-lg font-bold text-red-600 mt-2">= 1/2</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <p className="font-mono text-sm font-bold text-slate-700 mb-1">lim tan(x) / x</p>
                    <p className="text-xs text-slate-400">x -&gt; 0</p>
                    <p className="text-lg font-bold text-red-600 mt-2">= 1</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <p className="font-mono text-sm font-bold text-slate-700 mb-1">lim (e^x - 1) / x</p>
                    <p className="text-xs text-slate-400">x -&gt; 0</p>
                    <p className="text-lg font-bold text-red-600 mt-2">= 1</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <p className="font-mono text-sm font-bold text-slate-700 mb-1">lim ln(1 + x) / x</p>
                    <p className="text-xs text-slate-400">x -&gt; 0</p>
                    <p className="text-lg font-bold text-red-600 mt-2">= 1</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <p className="font-mono text-sm font-bold text-slate-700 mb-1">lim sin(kx) / x</p>
                    <p className="text-xs text-slate-400">x -&gt; 0</p>
                    <p className="text-lg font-bold text-red-600 mt-2">= k</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <p className="font-mono text-sm font-bold text-slate-700 mb-1">lim (1 + k/x)^x</p>
                    <p className="text-xs text-slate-400">x -&gt; inf</p>
                    <p className="text-lg font-bold text-red-600 mt-2">= e^k</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Indeterminate form resolution strategies */}
            <Section title="Forma Indeterminatuen Estrategiak" icon={Brain}>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-red-50">
                        <th className="px-4 py-3 text-left font-bold text-red-800 border-b border-red-100">Forma</th>
                        <th className="px-4 py-3 text-left font-bold text-red-800 border-b border-red-100">Estrategia</th>
                        <th className="px-4 py-3 text-left font-bold text-red-800 border-b border-red-100">Teknika</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-mono font-bold text-red-600">0/0</td>
                        <td className="px-4 py-3 text-slate-700">Faktorizatu eta sinplifikatu</td>
                        <td className="px-4 py-3 text-slate-500">Ruffini, identitate nabarmenak, L'Hopital</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-mono font-bold text-orange-600">inf/inf</td>
                        <td className="px-4 py-3 text-slate-700">Gradu handienaz zatitu</td>
                        <td className="px-4 py-3 text-slate-500">x^n-z zatitu, L'Hopital</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-mono font-bold text-amber-600">inf - inf</td>
                        <td className="px-4 py-3 text-slate-700">Izendatzaile komunera</td>
                        <td className="px-4 py-3 text-slate-500">Zatidura bakar bihurtu, konjugatua</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-mono font-bold text-yellow-600">0 * inf</td>
                        <td className="px-4 py-3 text-slate-700">Zatidura bihurtu</td>
                        <td className="px-4 py-3 text-slate-500">f*g = f/(1/g) edo g/(1/f) idatzi</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono font-bold text-lime-600">1^inf</td>
                        <td className="px-4 py-3 text-slate-700">e-ren definizioa erabili</td>
                        <td className="px-4 py-3 text-slate-500">Logaritmoa hartu, e^(lim) kalkulatu</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================ */}
        {/* TAB 4: PRAKTIKA                             */}
        {/* ============================================ */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua: Limiteak" icon={Brain} className="border-red-200 ring-4 ring-red-50/50">
              <div className="max-w-xl mx-auto">

                {/* Score */}
                <div className="flex justify-center mb-6">
                  <div className="bg-red-50 border border-red-100 px-6 py-2 rounded-full text-sm font-bold text-red-700 flex items-center gap-4">
                    <span>Puntuazioa: {score}/{total}</span>
                    {total > 0 && (
                      <span className="text-xs text-red-400">
                        ({Math.round((score / total) * 100)}%)
                      </span>
                    )}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    {/* Problem display */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type}
                      </div>
                      <div className="text-lg md:text-xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                    </div>

                    {/* Multiple choice options */}
                    <div className="grid grid-cols-2 gap-3">
                      {problem.options.map((opt, i) => {
                        let btnClass = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-red-300 hover:bg-red-50';
                        if (feedback) {
                          if (Math.abs(opt - problem.solution) < 0.01) {
                            btnClass = 'bg-green-100 border-2 border-green-400 text-green-800';
                          } else if (selectedAnswer === opt && feedback === 'incorrect') {
                            btnClass = 'bg-red-100 border-2 border-red-400 text-red-800';
                          } else {
                            btnClass = 'bg-slate-50 border-2 border-slate-100 text-slate-400';
                          }
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => handleAnswer(opt)}
                            disabled={!!feedback}
                            className={`p-4 rounded-xl font-mono font-bold text-lg transition-all ${btnClass} ${!feedback ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            {typeof opt === 'number' ? (Number.isInteger(opt) ? opt : opt.toFixed(2)) : opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    {feedback && (
                      <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${
                        feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {feedback === 'correct' ? <Check /> : <X />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Ondo egin duzu.' : 'Oker! Saiatu berriro hurrengoan.'}
                          </span>
                        </div>
                        {feedback === 'incorrect' && !showHint && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Pista bat ikusi?
                          </button>
                        )}
                      </div>
                    )}

                    {/* Hint */}
                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 text-left animate-in fade-in">
                        <strong>Pista:</strong> {problem.hint}
                      </div>
                    )}

                    {/* Next button */}
                    {feedback && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={nextProblem}
                          className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center gap-2 animate-in fade-in hover:-translate-y-1 active:translate-y-0"
                        >
                          <RefreshCw size={18} /> Hurrengo ariketa
                        </button>
                      </div>
                    )}

                    {/* Reset score */}
                    {total >= 5 && (
                      <div className="mt-4">
                        <button
                          onClick={() => { reset(); nextProblem(); }}
                          className="text-xs text-slate-400 hover:text-red-500 underline transition-colors"
                        >
                          Puntuazioa berrezarri
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
