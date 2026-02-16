import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, Sigma, ArrowRight, Check, RefreshCw, Zap, ListOrdered, X, Grid, Calculator, Award } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Superscript Utility ---

const toSuperscript = (n) => {
  const map = { '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079', '-': '\u207B' };
  return String(n).split('').map(c => map[c] || c).join('');
};

// --- Geometric Area Model ---

const AreaModel = ({ a, b, type = 'sum-square', showLabels = true }) => {
  const total = Math.abs(a) + Math.abs(b);
  const aRatio = (Math.abs(a) / total) * 100;
  const bRatio = (Math.abs(b) / total) * 100;

  if (type === 'sum-square') {
    // (a+b)² = a² + 2ab + b²
    return (
      <div className="bg-white rounded-xl border-2 border-purple-200 p-4">
        {showLabels && (
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 text-center">
            Azalera eredua: (a+b){toSuperscript(2)}
          </p>
        )}
        <div className="relative aspect-square max-w-xs mx-auto border-2 border-slate-700 rounded-lg overflow-hidden">
          {/* Top-left: a² */}
          <div
            className="absolute top-0 left-0 bg-purple-400 flex items-center justify-center text-white font-bold text-sm"
            style={{ width: `${aRatio}%`, height: `${aRatio}%` }}
          >
            a{toSuperscript(2)} = {a * a}
          </div>
          {/* Top-right: ab */}
          <div
            className="absolute top-0 bg-pink-300 flex items-center justify-center text-pink-900 font-bold text-xs"
            style={{ left: `${aRatio}%`, width: `${bRatio}%`, height: `${aRatio}%` }}
          >
            ab = {a * b}
          </div>
          {/* Bottom-left: ab */}
          <div
            className="absolute left-0 bg-pink-300 flex items-center justify-center text-pink-900 font-bold text-xs"
            style={{ top: `${aRatio}%`, width: `${aRatio}%`, height: `${bRatio}%` }}
          >
            ab = {a * b}
          </div>
          {/* Bottom-right: b² */}
          <div
            className="absolute bg-violet-400 flex items-center justify-center text-white font-bold text-sm"
            style={{ top: `${aRatio}%`, left: `${aRatio}%`, width: `${bRatio}%`, height: `${bRatio}%` }}
          >
            b{toSuperscript(2)} = {b * b}
          </div>
        </div>
        {showLabels && (
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-400 rounded-sm"></span> a{toSuperscript(2)}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-pink-300 rounded-sm"></span> 2ab</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-400 rounded-sm"></span> b{toSuperscript(2)}</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'diff-square') {
    // (a-b)² = a² - 2ab + b²
    return (
      <div className="bg-white rounded-xl border-2 border-purple-200 p-4">
        {showLabels && (
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 text-center">
            Azalera eredua: (a-b){toSuperscript(2)}
          </p>
        )}
        <div className="relative aspect-square max-w-xs mx-auto border-2 border-slate-700 rounded-lg overflow-hidden bg-slate-100">
          {/* Full a² square */}
          <div className="absolute top-0 left-0 w-full h-full bg-purple-200 opacity-50"></div>
          {/* The (a-b)² square - top left */}
          <div
            className="absolute top-0 left-0 bg-purple-400 flex items-center justify-center text-white font-bold text-xs z-10"
            style={{ width: `${aRatio}%`, height: `${aRatio}%` }}
          >
            (a-b){toSuperscript(2)} = {(a - b) * (a - b)}
          </div>
          {/* Right strip: b(a-b) */}
          <div
            className="absolute top-0 bg-red-300 flex items-center justify-center text-red-900 font-bold text-xs z-10 opacity-70"
            style={{ left: `${aRatio}%`, width: `${bRatio}%`, height: `${aRatio}%` }}
          >
            b(a-b)
          </div>
          {/* Bottom strip: b(a-b) */}
          <div
            className="absolute left-0 bg-red-300 flex items-center justify-center text-red-900 font-bold text-xs z-10 opacity-70"
            style={{ top: `${aRatio}%`, width: `${aRatio}%`, height: `${bRatio}%` }}
          >
            b(a-b)
          </div>
          {/* Corner: b² */}
          <div
            className="absolute bg-violet-400 flex items-center justify-center text-white font-bold text-xs z-10"
            style={{ top: `${aRatio}%`, left: `${aRatio}%`, width: `${bRatio}%`, height: `${bRatio}%` }}
          >
            b{toSuperscript(2)}
          </div>
        </div>
        {showLabels && (
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-400 rounded-sm"></span> (a-b){toSuperscript(2)}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 rounded-sm"></span> Kendutakoa</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-400 rounded-sm"></span> b{toSuperscript(2)}</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'difference-of-squares') {
    // (a+b)(a-b) = a² - b²
    return (
      <div className="bg-white rounded-xl border-2 border-purple-200 p-4">
        {showLabels && (
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 text-center">
            Azalera eredua: a{toSuperscript(2)} - b{toSuperscript(2)}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          {/* a² square with b² removed */}
          <div className="relative aspect-square w-40 border-2 border-slate-700 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-purple-300"></div>
            <div
              className="absolute bottom-0 right-0 bg-red-300 flex items-center justify-center text-red-900 font-bold text-xs border-l-2 border-t-2 border-slate-700"
              style={{ width: `${bRatio}%`, height: `${bRatio}%` }}
            >
              b{toSuperscript(2)}
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-400">=</div>
          {/* Rearranged as (a+b)(a-b) rectangle */}
          <div
            className="bg-purple-400 rounded-lg border-2 border-slate-700 flex items-center justify-center text-white font-bold text-sm"
            style={{ width: '160px', height: `${((Math.abs(a) - Math.abs(b)) / total) * 160}px`, minHeight: '40px' }}
          >
            (a+b)(a-b)
          </div>
        </div>
        {showLabels && (
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-300 rounded-sm"></span> a{toSuperscript(2)}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 rounded-sm"></span> b{toSuperscript(2)} (kenduta)</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// --- Interactive Calculator ---

const ProduktuKalkulagailua = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);

  const aVal = parseFloat(a) || 0;
  const bVal = parseFloat(b) || 0;

  const sumSquare = {
    result: (aVal + bVal) * (aVal + bVal),
    a2: aVal * aVal,
    twoAB: 2 * aVal * bVal,
    b2: bVal * bVal
  };

  const diffSquare = {
    result: (aVal - bVal) * (aVal - bVal),
    a2: aVal * aVal,
    minus2AB: -2 * aVal * bVal,
    b2: bVal * bVal
  };

  const diffOfSquares = {
    result: aVal * aVal - bVal * bVal,
    aPlusB: aVal + bVal,
    aMinusB: aVal - bVal
  };

  return (
    <div className="space-y-8">
      {/* Input controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">a balioa</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-lg"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">b balioa</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-lg"
          />
        </div>
      </div>

      {/* Formula 1: (a+b)² */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">1. Binomioaren karratua (batuketa)</p>
        <div className="text-center space-y-3">
          <p className="font-mono text-xl text-white">
            ({aVal} + {bVal}){toSuperscript(2)}
          </p>
          <p className="font-mono text-sm text-purple-300">
            = {aVal}{toSuperscript(2)} + 2 · {aVal} · {bVal} + {bVal}{toSuperscript(2)}
          </p>
          <p className="font-mono text-sm text-pink-300">
            = {sumSquare.a2} + {sumSquare.twoAB} + {sumSquare.b2}
          </p>
          <p className="font-mono text-2xl font-bold text-amber-400">
            = {sumSquare.result}
          </p>
        </div>
      </div>

      {/* Formula 2: (a-b)² */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">2. Binomioaren karratua (kenketa)</p>
        <div className="text-center space-y-3">
          <p className="font-mono text-xl text-white">
            ({aVal} - {bVal}){toSuperscript(2)}
          </p>
          <p className="font-mono text-sm text-violet-300">
            = {aVal}{toSuperscript(2)} - 2 · {aVal} · {bVal} + {bVal}{toSuperscript(2)}
          </p>
          <p className="font-mono text-sm text-purple-300">
            = {diffSquare.a2} + ({diffSquare.minus2AB}) + {diffSquare.b2}
          </p>
          <p className="font-mono text-2xl font-bold text-amber-400">
            = {diffSquare.result}
          </p>
        </div>
      </div>

      {/* Formula 3: (a+b)(a-b) */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-violet-500"></div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">3. Batuketa eta kenketaren biderkadura</p>
        <div className="text-center space-y-3">
          <p className="font-mono text-xl text-white">
            ({aVal} + {bVal})({aVal} - {bVal})
          </p>
          <p className="font-mono text-sm text-fuchsia-300">
            = {aVal}{toSuperscript(2)} - {bVal}{toSuperscript(2)}
          </p>
          <p className="font-mono text-sm text-violet-300">
            = {sumSquare.a2} - {sumSquare.b2 || 0}
          </p>
          <p className="font-mono text-2xl font-bold text-amber-400">
            = {diffOfSquares.result}
          </p>
        </div>
      </div>

      {/* Geometric Area Models */}
      <div className="grid md:grid-cols-2 gap-6">
        <AreaModel a={aVal} b={bVal} type="sum-square" />
        <AreaModel a={aVal} b={bVal} type="difference-of-squares" />
      </div>
    </div>
  );
};

// --- Practice Problem Generator ---

const generatePracticeProblem = () => {
  const types = ['expand-sum-square', 'expand-diff-square', 'expand-product', 'factor-diff-squares', 'identify-formula', 'expand-with-numbers'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'expand-sum-square') {
    const coeff = Math.floor(Math.random() * 6) + 1;
    const constant = Math.floor(Math.random() * 8) + 1;
    // (coeff·x + constant)² => coeff²·x² + 2·coeff·constant·x + constant²
    const a2 = coeff * coeff;
    const twoAB = 2 * coeff * constant;
    const b2 = constant * constant;
    return {
      type,
      display: `Garatu: (${coeff === 1 ? '' : coeff}x + ${constant})${toSuperscript(2)}`,
      question: `Zein da x-ren koefizientea (erdiko terminoa)?`,
      solution: twoAB,
      hint: `(a+b)${toSuperscript(2)} = a${toSuperscript(2)} + 2ab + b${toSuperscript(2)}. Hemen a=${coeff}x, b=${constant}. Erdiko terminoa: 2 · ${coeff} · ${constant} = ${twoAB}`,
      fullAnswer: `${a2}x${toSuperscript(2)} + ${twoAB}x + ${b2}`
    };
  }

  if (type === 'expand-diff-square') {
    const coeff = Math.floor(Math.random() * 5) + 1;
    const constant = Math.floor(Math.random() * 7) + 1;
    const a2 = coeff * coeff;
    const twoAB = 2 * coeff * constant;
    const b2 = constant * constant;
    return {
      type,
      display: `Garatu: (${coeff === 1 ? '' : coeff}x - ${constant})${toSuperscript(2)}`,
      question: `Zein da x-ren koefizientea (erdiko terminoa)?`,
      solution: -twoAB,
      hint: `(a-b)${toSuperscript(2)} = a${toSuperscript(2)} - 2ab + b${toSuperscript(2)}. Hemen a=${coeff}x, b=${constant}. Erdiko terminoa: -2 · ${coeff} · ${constant} = ${-twoAB}`,
      fullAnswer: `${a2}x${toSuperscript(2)} - ${twoAB}x + ${b2}`
    };
  }

  if (type === 'expand-product') {
    const constant = Math.floor(Math.random() * 9) + 1;
    // (x+c)(x-c) = x² - c²
    const c2 = constant * constant;
    return {
      type,
      display: `Garatu: (x + ${constant})(x - ${constant})`,
      question: `Zein da termino askea (x-rik gabeko terminoa)?`,
      solution: -c2,
      hint: `(a+b)(a-b) = a${toSuperscript(2)} - b${toSuperscript(2)}. Hemen a=x, b=${constant}. Emaitza: x${toSuperscript(2)} - ${c2}`,
      fullAnswer: `x${toSuperscript(2)} - ${c2}`
    };
  }

  if (type === 'factor-diff-squares') {
    const base = Math.floor(Math.random() * 9) + 2;
    const b2 = base * base;
    return {
      type,
      display: `Faktorizatu: x${toSuperscript(2)} - ${b2}`,
      question: `Zein da b-ren balioa, jakinik x${toSuperscript(2)} - b${toSuperscript(2)} = (x+b)(x-b)?`,
      solution: base,
      hint: `${b2} = ${base}${toSuperscript(2)}, beraz x${toSuperscript(2)} - ${b2} = (x+${base})(x-${base})`,
      fullAnswer: `(x + ${base})(x - ${base})`
    };
  }

  if (type === 'identify-formula') {
    const formulas = [
      {
        expr: `x${toSuperscript(2)} + 10x + 25`,
        answer: 1,
        explanation: `x${toSuperscript(2)} + 10x + 25 = (x+5)${toSuperscript(2)} → (a+b)${toSuperscript(2)} formula`
      },
      {
        expr: `x${toSuperscript(2)} - 6x + 9`,
        answer: 2,
        explanation: `x${toSuperscript(2)} - 6x + 9 = (x-3)${toSuperscript(2)} → (a-b)${toSuperscript(2)} formula`
      },
      {
        expr: `x${toSuperscript(2)} - 49`,
        answer: 3,
        explanation: `x${toSuperscript(2)} - 49 = (x+7)(x-7) → (a+b)(a-b) formula`
      },
      {
        expr: `4x${toSuperscript(2)} + 12x + 9`,
        answer: 1,
        explanation: `4x${toSuperscript(2)} + 12x + 9 = (2x+3)${toSuperscript(2)} → (a+b)${toSuperscript(2)} formula`
      },
      {
        expr: `9x${toSuperscript(2)} - 16`,
        answer: 3,
        explanation: `9x${toSuperscript(2)} - 16 = (3x+4)(3x-4) → (a+b)(a-b) formula`
      },
    ];
    const chosen = formulas[Math.floor(Math.random() * formulas.length)];
    return {
      type,
      display: `Zein produktu nabarmen da?\n${chosen.expr}`,
      question: `1 = (a+b)${toSuperscript(2)}, 2 = (a-b)${toSuperscript(2)}, 3 = (a+b)(a-b). Idatzi zenbakia:`,
      solution: chosen.answer,
      hint: chosen.explanation,
      fullAnswer: chosen.explanation
    };
  }

  // expand-with-numbers
  const a = Math.floor(Math.random() * 7) + 2;
  const b = Math.floor(Math.random() * 6) + 1;
  const result = (a + b) * (a + b);
  return {
    type,
    display: `Kalkulatu (${a} + ${b})${toSuperscript(2)} produktu nabarmenaren formula erabiliz`,
    question: `Zein da emaitza?`,
    solution: result,
    hint: `(${a}+${b})${toSuperscript(2)} = ${a}${toSuperscript(2)} + 2·${a}·${b} + ${b}${toSuperscript(2)} = ${a * a} + ${2 * a * b} + ${b * b} = ${result}`,
    fullAnswer: `${a * a} + ${2 * a * b} + ${b * b} = ${result}`
  };
};

// --- Main Component ---

export default function ProduktuNabarmenak() {
  useDocumentTitle('Produktu Nabarmenak');
  const [activeTab, setActiveTab] = useState('teoria');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('produktu-nabar');

  useEffect(() => {
    setProblem(generatePracticeProblem());
  }, []);

  const generateProblem = () => {
    setProblem(generatePracticeProblem());
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const val = parseFloat(userInput);
    if (isNaN(val)) {
      setFeedback('invalid');
      return;
    }
    if (val === problem.solution) {
      addCorrect();
      setFeedback('correct');
    } else {
      addIncorrect();
      setFeedback('incorrect');
    }
  };

  const tabs = [
    { id: 'teoria', label: 'Teoria' },
    { id: 'laborategia', label: 'Laborategia' },
    { id: 'formulak', label: 'Formulak' },
    { id: 'praktika', label: 'Praktika' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-colors ${
                  tab.id === 'praktika'
                    ? `px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 shadow-sm shadow-purple-200`
                    : `hover:text-purple-600 ${activeTab === tab.id ? 'text-purple-600' : ''}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Produktu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Nabarmenak
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Binomioaren karratua, karratuen diferentzia eta haien froga geometrikoak. Aljebraren oinarrizko identitate aipagarriak.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================= */}
        {/* TAB 1: TEORIA                             */}
        {/* ========================================= */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Introduction */}
            <Section title="Zer dira Produktu Nabarmenak?" icon={BookOpen} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Produktu nabarmenak</strong> (edo identitate aipagarriak) biderkatze algebraiko bereziak dira, modu zuzenean garatu daitezkeenak formula baten bidez. Formulak buruz ikasteak kalkulu algebraikoak azkartu eta sinplifikatzen ditu.
                </p>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                  <strong>Zergatik dira garrantzitsuak?</strong> Faktorizazioan, ekuazioen ebazpenean, eta kalkulu aurreratuan etengabe erabiltzen dira. Oinarri sendoa ematen dute aljebra guztiaren gainean.
                </div>
              </div>
            </Section>

            {/* Formula 1: (a+b)² */}
            <Section title="1. Binomioaren karratua (batuketa)" icon={Sigma}>
              <div className="space-y-6">
                {/* Formula display */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Formula</p>
                    <div className="text-3xl md:text-5xl font-mono font-bold">
                      <span className="text-purple-400">(a + b)</span>
                      <span className="text-pink-400">{toSuperscript(2)}</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-purple-300">a{toSuperscript(2)}</span>
                      <span className="text-pink-300"> + 2ab</span>
                      <span className="text-violet-300"> + b{toSuperscript(2)}</span>
                    </div>
                    <p className="text-slate-400 mt-6 text-sm">
                      "Lehenengoaren karratua, gehi bikoitza biderkaturik, gehi bigarrenaren karratua"
                    </p>
                  </div>
                </div>

                {/* Step by step explanation */}
                <div className="bg-white border-2 border-purple-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Nola garatzen da?</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <p className="text-slate-700">(a + b){toSuperscript(2)} = (a + b) · (a + b)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <p className="text-slate-700">= a·a + a·b + b·a + b·b</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <p className="text-slate-700">= a{toSuperscript(2)} + ab + ab + b{toSuperscript(2)}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                      <p className="text-purple-700 font-bold">= a{toSuperscript(2)} + 2ab + b{toSuperscript(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Geometric proof */}
                <div className="grid md:grid-cols-2 gap-6">
                  <AreaModel a={4} b={3} type="sum-square" />
                  <div className="flex flex-col justify-center space-y-4">
                    <h3 className="font-bold text-slate-800">Froga geometrikoa</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Imajinatu (a+b) aldeko karratu bat. Bere azalera (a+b){toSuperscript(2)} da. Karratu hori lau zatitan bana dezakegu:
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-400 rounded-sm shrink-0"></span>
                        <span><strong>a{toSuperscript(2)}</strong> azalerako karratu bat (goi-ezkerran)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-pink-300 rounded-sm shrink-0"></span>
                        <span><strong>ab</strong> azalerako bi laukizuzen (bikoitz terminoa)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-violet-400 rounded-sm shrink-0"></span>
                        <span><strong>b{toSuperscript(2)}</strong> azalerako karratu bat (behe-eskuinean)</span>
                      </li>
                    </ul>
                    <p className="text-sm text-purple-700 font-bold">
                      Guztira: a{toSuperscript(2)} + ab + ab + b{toSuperscript(2)} = a{toSuperscript(2)} + 2ab + b{toSuperscript(2)}
                    </p>
                  </div>
                </div>

                {/* Example */}
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                  <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3">Adibidea</p>
                  <div className="font-mono text-slate-800 space-y-1">
                    <p>(x + 3){toSuperscript(2)} = x{toSuperscript(2)} + 2·x·3 + 3{toSuperscript(2)} = <strong className="text-purple-700">x{toSuperscript(2)} + 6x + 9</strong></p>
                    <p>(2x + 5){toSuperscript(2)} = (2x){toSuperscript(2)} + 2·2x·5 + 5{toSuperscript(2)} = <strong className="text-purple-700">4x{toSuperscript(2)} + 20x + 25</strong></p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Formula 2: (a-b)² */}
            <Section title="2. Binomioaren karratua (kenketa)" icon={Sigma}>
              <div className="space-y-6">
                {/* Formula display */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Formula</p>
                    <div className="text-3xl md:text-5xl font-mono font-bold">
                      <span className="text-violet-400">(a - b)</span>
                      <span className="text-purple-400">{toSuperscript(2)}</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-violet-300">a{toSuperscript(2)}</span>
                      <span className="text-red-400"> - 2ab</span>
                      <span className="text-purple-300"> + b{toSuperscript(2)}</span>
                    </div>
                    <p className="text-slate-400 mt-6 text-sm">
                      "Lehenengoaren karratua, ken bikoitza biderkaturik, gehi bigarrenaren karratua"
                    </p>
                  </div>
                </div>

                {/* Step by step */}
                <div className="bg-white border-2 border-violet-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Nola garatzen da?</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <p className="text-slate-700">(a - b){toSuperscript(2)} = (a - b) · (a - b)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <p className="text-slate-700">= a·a + a·(-b) + (-b)·a + (-b)·(-b)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <p className="text-slate-700">= a{toSuperscript(2)} - ab - ab + b{toSuperscript(2)}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-violet-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                      <p className="text-violet-700 font-bold">= a{toSuperscript(2)} - 2ab + b{toSuperscript(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Geometric proof */}
                <div className="grid md:grid-cols-2 gap-6">
                  <AreaModel a={5} b={2} type="diff-square" />
                  <div className="flex flex-col justify-center space-y-4">
                    <h3 className="font-bold text-slate-800">Froga geometrikoa</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Has gaitezen a aldeko karratu batetik (a{toSuperscript(2)} azalera). b zabaleko bi zerrenda kentzen badizkiogu (baina b{toSuperscript(2)} txikina birritan kentzen da):
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-400 rounded-sm shrink-0"></span>
                        <span><strong>(a-b){toSuperscript(2)}</strong> azalera geratzen da (goi-ezkerran)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-300 rounded-sm shrink-0"></span>
                        <span>Bi zerrenda kendutakoak: <strong>2 · b · (a-b)</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-violet-400 rounded-sm shrink-0"></span>
                        <span>Txokoko karratua: <strong>b{toSuperscript(2)}</strong></span>
                      </li>
                    </ul>
                    <p className="text-sm text-violet-700 font-bold">
                      a{toSuperscript(2)} = (a-b){toSuperscript(2)} + 2b(a-b) + b{toSuperscript(2)}, beraz (a-b){toSuperscript(2)} = a{toSuperscript(2)} - 2ab + b{toSuperscript(2)}
                    </p>
                  </div>
                </div>

                {/* Important warning */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <Zap className="shrink-0 text-yellow-600" size={20} />
                  <div>
                    <p><strong>Kontuz!</strong> (a - b){toSuperscript(2)} ez da a{toSuperscript(2)} - b{toSuperscript(2)}! Erdiko terminoa (-2ab) ahaztu ohi da. Gogoratu beti hiru termino daudela emaitzean.</p>
                  </div>
                </div>

                {/* Example */}
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
                  <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-3">Adibidea</p>
                  <div className="font-mono text-slate-800 space-y-1">
                    <p>(x - 4){toSuperscript(2)} = x{toSuperscript(2)} - 2·x·4 + 4{toSuperscript(2)} = <strong className="text-violet-700">x{toSuperscript(2)} - 8x + 16</strong></p>
                    <p>(3x - 2){toSuperscript(2)} = (3x){toSuperscript(2)} - 2·3x·2 + 2{toSuperscript(2)} = <strong className="text-violet-700">9x{toSuperscript(2)} - 12x + 4</strong></p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Formula 3: (a+b)(a-b) */}
            <Section title="3. Batuketa eta kenketaren biderkadura" icon={Sigma}>
              <div className="space-y-6">
                {/* Formula display */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Formula</p>
                    <div className="text-3xl md:text-5xl font-mono font-bold">
                      <span className="text-fuchsia-400">(a + b)</span>
                      <span className="text-violet-400">(a - b)</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-fuchsia-300">a{toSuperscript(2)}</span>
                      <span className="text-red-400"> - </span>
                      <span className="text-violet-300">b{toSuperscript(2)}</span>
                    </div>
                    <p className="text-slate-400 mt-6 text-sm">
                      "Batuketa bider kenketa = karratuen diferentzia"
                    </p>
                  </div>
                </div>

                {/* Step by step */}
                <div className="bg-white border-2 border-fuchsia-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Nola garatzen da?</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-fuchsia-100 text-fuchsia-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <p className="text-slate-700">(a + b) · (a - b)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-fuchsia-100 text-fuchsia-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <p className="text-slate-700">= a·a + a·(-b) + b·a + b·(-b)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-fuchsia-100 text-fuchsia-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <p className="text-slate-700">= a{toSuperscript(2)} <span className="text-red-500">- ab + ab</span> - b{toSuperscript(2)}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-fuchsia-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                      <p className="text-fuchsia-700 font-bold">= a{toSuperscript(2)} - b{toSuperscript(2)} <span className="text-slate-400 font-normal">(erdiko terminoak elkar ezabatzen dira!)</span></p>
                    </div>
                  </div>
                </div>

                {/* Geometric proof */}
                <div className="grid md:grid-cols-2 gap-6">
                  <AreaModel a={5} b={2} type="difference-of-squares" />
                  <div className="flex flex-col justify-center space-y-4">
                    <h3 className="font-bold text-slate-800">Froga geometrikoa</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Has gaitezen a aldeko karratu batetik. Behe-eskuineko txokoari b aldeko karratu bat kentzen badiogu, geratzen den L formako irudia bi zatitan moztu eta laukizuzen bat osatu dezakegu:
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-300 rounded-sm shrink-0"></span>
                        <span>Karratu handiaren azalera: <strong>a{toSuperscript(2)}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-300 rounded-sm shrink-0"></span>
                        <span>Kendutako karratua: <strong>b{toSuperscript(2)}</strong></span>
                      </li>
                    </ul>
                    <p className="text-sm text-fuchsia-700 font-bold">
                      Geratzen den azalera = a{toSuperscript(2)} - b{toSuperscript(2)} = (a+b) zabaleko eta (a-b) altuerako laukizuzena
                    </p>
                  </div>
                </div>

                {/* Example */}
                <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-5">
                  <p className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-3">Adibidea</p>
                  <div className="font-mono text-slate-800 space-y-1">
                    <p>(x + 5)(x - 5) = x{toSuperscript(2)} - 5{toSuperscript(2)} = <strong className="text-fuchsia-700">x{toSuperscript(2)} - 25</strong></p>
                    <p>(3x + 4)(3x - 4) = (3x){toSuperscript(2)} - 4{toSuperscript(2)} = <strong className="text-fuchsia-700">9x{toSuperscript(2)} - 16</strong></p>
                  </div>
                </div>

                {/* Factoring tip */}
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                  <strong>Faktorizatzeko oso erabilgarria:</strong> Bi karratuen diferentzia ikusten duzunean (adib: x{toSuperscript(2)} - 9), beti faktorizatu dezakezu: x{toSuperscript(2)} - 9 = (x+3)(x-3). Hau da identitate honen alderantzizko aplikazioa!
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: LABORATEGIA                        */}
        {/* ========================================= */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Produktu Nabarmen Kalkulagailua" icon={Calculator}>
              <p className="text-slate-600 mb-6">
                Sartu <strong>a</strong> eta <strong>b</strong> balioak eta ikusi hiru formulen emaitzak pauso bakoitzean. Azalera eredua ere eguneratzen da automatikoki.
              </p>
              <ProduktuKalkulagailua />
            </Section>

            <Section title="Konprobazio Azkarra" icon={Zap}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Formulen baliokidetasuna zenbakiekin egiaztatu dezakegu. Adibidez, a=7 eta b=3 balioekin:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-purple-500 uppercase mb-2">(7+3){toSuperscript(2)}</p>
                    <p className="font-mono text-2xl font-bold text-purple-700">100</p>
                    <p className="text-xs text-slate-500 mt-1">49 + 42 + 9 = 100</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-violet-500 uppercase mb-2">(7-3){toSuperscript(2)}</p>
                    <p className="font-mono text-2xl font-bold text-violet-700">16</p>
                    <p className="text-xs text-slate-500 mt-1">49 - 42 + 9 = 16</p>
                  </div>
                  <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-fuchsia-500 uppercase mb-2">(7+3)(7-3)</p>
                    <p className="font-mono text-2xl font-bold text-fuchsia-700">40</p>
                    <p className="text-xs text-slate-500 mt-1">49 - 9 = 40</p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <Zap className="shrink-0 text-yellow-600" size={20} />
                  <p><strong>Trikimailua:</strong> 97 x 103 kalkulatu nahi? 97 = 100-3, 103 = 100+3. Beraz: (100+3)(100-3) = 100{toSuperscript(2)} - 3{toSuperscript(2)} = 10000 - 9 = <strong>9991</strong>. Azkarragoa!</p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: FORMULAK                           */}
        {/* ========================================= */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Formula Txartelak" icon={ListOrdered}>
              <div className="space-y-6">

                {/* Main 3 formulas */}
                <div className="grid gap-4">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-purple-200 text-xs uppercase font-bold tracking-widest mb-1">Binomioaren karratua (batuketa)</p>
                        <p className="font-mono text-2xl md:text-3xl font-bold">(a + b){toSuperscript(2)} = a{toSuperscript(2)} + 2ab + b{toSuperscript(2)}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <p className="font-mono text-sm">(x + 3){toSuperscript(2)} = x{toSuperscript(2)} + 6x + 9</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-violet-200 text-xs uppercase font-bold tracking-widest mb-1">Binomioaren karratua (kenketa)</p>
                        <p className="font-mono text-2xl md:text-3xl font-bold">(a - b){toSuperscript(2)} = a{toSuperscript(2)} - 2ab + b{toSuperscript(2)}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <p className="font-mono text-sm">(x - 4){toSuperscript(2)} = x{toSuperscript(2)} - 8x + 16</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-fuchsia-200 text-xs uppercase font-bold tracking-widest mb-1">Batuketa bider kenketa</p>
                        <p className="font-mono text-2xl md:text-3xl font-bold">(a + b)(a - b) = a{toSuperscript(2)} - b{toSuperscript(2)}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <p className="font-mono text-sm">(x + 5)(x - 5) = x{toSuperscript(2)} - 25</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hedapenak</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Extended formulas */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* (a+b)³ */}
                  <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">Batuketa baten kuboa</p>
                    <p className="font-mono text-lg font-bold text-slate-800 mb-3">
                      (a + b){toSuperscript(3)} = a{toSuperscript(3)} + 3a{toSuperscript(2)}b + 3ab{toSuperscript(2)} + b{toSuperscript(3)}
                    </p>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <p className="font-mono text-sm text-slate-600">
                        (x + 2){toSuperscript(3)} = x{toSuperscript(3)} + 6x{toSuperscript(2)} + 12x + 8
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Kuboa + 3·(lehen{toSuperscript(2)})·bigarren + 3·lehen·(bigarren{toSuperscript(2)}) + kuboa
                    </p>
                  </div>

                  {/* (a-b)³ */}
                  <div className="bg-white border-2 border-violet-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-2">Kenketa baten kuboa</p>
                    <p className="font-mono text-lg font-bold text-slate-800 mb-3">
                      (a - b){toSuperscript(3)} = a{toSuperscript(3)} - 3a{toSuperscript(2)}b + 3ab{toSuperscript(2)} - b{toSuperscript(3)}
                    </p>
                    <div className="bg-violet-50 p-3 rounded-lg border border-violet-100">
                      <p className="font-mono text-sm text-slate-600">
                        (x - 1){toSuperscript(3)} = x{toSuperscript(3)} - 3x{toSuperscript(2)} + 3x - 1
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Berdin karratuaren kasuan bezala, baina zeinuak txandakatzen dira: +, -, +, -
                    </p>
                  </div>

                  {/* a³+b³ */}
                  <div className="bg-white border-2 border-fuchsia-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-2">Kuboen batuketa</p>
                    <p className="font-mono text-lg font-bold text-slate-800 mb-3">
                      a{toSuperscript(3)} + b{toSuperscript(3)} = (a + b)(a{toSuperscript(2)} - ab + b{toSuperscript(2)})
                    </p>
                    <div className="bg-fuchsia-50 p-3 rounded-lg border border-fuchsia-100">
                      <p className="font-mono text-sm text-slate-600">
                        x{toSuperscript(3)} + 8 = (x + 2)(x{toSuperscript(2)} - 2x + 4)
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Faktorizatzeko erabilgarria: kuboen batuketa bi faktoretan banatzen da
                    </p>
                  </div>

                  {/* a³-b³ */}
                  <div className="bg-white border-2 border-pink-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2">Kuboen kenketa</p>
                    <p className="font-mono text-lg font-bold text-slate-800 mb-3">
                      a{toSuperscript(3)} - b{toSuperscript(3)} = (a - b)(a{toSuperscript(2)} + ab + b{toSuperscript(2)})
                    </p>
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                      <p className="font-mono text-sm text-slate-600">
                        x{toSuperscript(3)} - 27 = (x - 3)(x{toSuperscript(2)} + 3x + 9)
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Kuboen kenketarako: lehen faktorea kenketa, bigarrenean zeinu guztiak +
                    </p>
                  </div>
                </div>

                {/* Quick reference summary */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Laburpena</p>
                  <div className="grid gap-3 font-mono text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-purple-300">(a + b){toSuperscript(2)}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">a{toSuperscript(2)} + 2ab + b{toSuperscript(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                      <span className="text-violet-300">(a - b){toSuperscript(2)}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">a{toSuperscript(2)} - 2ab + b{toSuperscript(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-fuchsia-400 rounded-full"></span>
                      <span className="text-fuchsia-300">(a + b)(a - b)</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">a{toSuperscript(2)} - b{toSuperscript(2)}</span>
                    </div>
                    <div className="h-px bg-slate-700 my-1"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-purple-300">(a + b){toSuperscript(3)}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">a{toSuperscript(3)} + 3a{toSuperscript(2)}b + 3ab{toSuperscript(2)} + b{toSuperscript(3)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                      <span className="text-violet-300">(a - b){toSuperscript(3)}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">a{toSuperscript(3)} - 3a{toSuperscript(2)}b + 3ab{toSuperscript(2)} - b{toSuperscript(3)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-fuchsia-400 rounded-full"></span>
                      <span className="text-fuchsia-300">a{toSuperscript(3)} + b{toSuperscript(3)}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">(a+b)(a{toSuperscript(2)}-ab+b{toSuperscript(2)})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      <span className="text-pink-300">a{toSuperscript(3)} - b{toSuperscript(3)}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-white">(a-b)(a{toSuperscript(2)}+ab+b{toSuperscript(2)})</span>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* ========================================= */}
        {/* TAB 4: PRAKTIKA                           */}
        {/* ========================================= */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Award} className="border-purple-200 ring-4 ring-purple-50/50">
              <div className="max-w-xl mx-auto">

                {/* Score */}
                <div className="flex justify-center mb-6">
                  <div className="bg-purple-50 border border-purple-100 px-6 py-2 rounded-full text-sm font-bold text-purple-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{total}</span>
                    {total > 0 && (
                      <span className="text-xs text-purple-400">
                        ({Math.round((score / total) * 100)}%)
                      </span>
                    )}
                  </div>
                {total > 0 && (
                  <button onClick={() => reset()} className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors">
                    Puntuazioa berrezarri
                  </button>
                )}
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    {/* Problem display */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'expand-sum-square' ? 'Garatu (a+b)\u00B2' :
                         problem.type === 'expand-diff-square' ? 'Garatu (a-b)\u00B2' :
                         problem.type === 'expand-product' ? 'Garatu (a+b)(a-b)' :
                         problem.type === 'factor-diff-squares' ? 'Faktorizatu' :
                         problem.type === 'identify-formula' ? 'Identifikatu formula' :
                         'Kalkulatu'}
                      </div>
                      <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                      <p className="text-sm text-slate-500 mt-4">{problem.question}</p>
                    </div>

                    {/* Answer input */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input
                          type="number"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg font-bold"
                        />
                      </div>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                      <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${
                        feedback === 'correct' ? 'bg-green-100 text-green-700' :
                        feedback === 'invalid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {feedback === 'correct' ? <Check /> : feedback === 'invalid' ? <RefreshCw /> : <X />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Ondo egin duzu.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             `Oker. Erantzun zuzena: ${problem.solution}`}
                          </span>
                        </div>
                        {feedback === 'correct' && problem.fullAnswer && (
                          <p className="text-sm text-green-600 font-mono mt-1">
                            Emaitza osoa: {problem.fullAnswer}
                          </p>
                        )}
                        {feedback === 'incorrect' && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Azalpena ikusi?
                          </button>
                        )}
                      </div>
                    )}

                    {/* Hint */}
                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in text-left">
                        <strong>Azalpena:</strong> {problem.hint}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-4 justify-center mt-6">
                      {!feedback && (
                        <button
                          onClick={checkAnswer}
                          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0"
                        >
                          Egiaztatu
                        </button>
                      )}
                      {feedback && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-600 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          <ArrowRight size={18} /> Hurrengoa
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

      </main>

      {/* Footer */}
      <RelatedTopics currentId="produktu-nabar" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-500">Be&ntilde;at Erezuma</a></p>
      </footer>

    </div>
  );
}
