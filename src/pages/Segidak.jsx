import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, TrendingUp, ArrowRight, Check, RefreshCw, Zap, ListOrdered, X } from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Sequence Helpers ---

const generateArithmeticTerms = (a1, d, count = 10) => {
  const terms = [];
  for (let i = 0; i < count; i++) {
    terms.push(a1 + i * d);
  }
  return terms;
};

const generateGeometricTerms = (a1, r, count = 10) => {
  const terms = [];
  for (let i = 0; i < count; i++) {
    terms.push(a1 * Math.pow(r, i));
  }
  return terms;
};

const arithmeticNthTerm = (a1, d, n) => a1 + (n - 1) * d;
const arithmeticSum = (a1, d, n) => {
  const an = arithmeticNthTerm(a1, d, n);
  return (n * (a1 + an)) / 2;
};
const geometricNthTerm = (a1, r, n) => a1 * Math.pow(r, n - 1);
const geometricSum = (a1, r, n) => {
  if (r === 1) return a1 * n;
  return a1 * (1 - Math.pow(r, n)) / (1 - r);
};

const formatNum = (n) => {
  if (Number.isNaN(n) || !Number.isFinite(n)) return '---';
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2);
};

// --- Sequence Visualizer (Bar Chart) ---

const SequenceChart = ({ terms, color = 'rose' }) => {
  if (!terms || terms.length === 0) return null;

  const maxAbsVal = Math.max(...terms.map(t => Math.abs(t)), 1);
  const chartHeight = 200;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-end justify-around gap-1" style={{ height: chartHeight }}>
        {terms.map((term, i) => {
          const barHeight = Math.abs(term) / maxAbsVal * (chartHeight - 40);
          const isNegative = term < 0;
          return (
            <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {formatNum(term)}
              </span>
              <div
                className={`w-full max-w-[40px] rounded-t-md transition-all duration-300 ${
                  isNegative ? 'bg-red-400' : `bg-rose-400`
                }`}
                style={{ height: Math.max(barHeight, 4) }}
              />
              <span className="text-xs text-slate-400 font-mono">a<sub>{i + 1}</sub></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Sequence Points Visualization ---

const SequencePoints = ({ terms, color = 'rose' }) => {
  if (!terms || terms.length === 0) return null;

  const width = 500;
  const height = 200;
  const padding = 40;
  const plotW = width - 2 * padding;
  const plotH = height - 2 * padding;

  const minVal = Math.min(...terms);
  const maxVal = Math.max(...terms);
  const range = maxVal - minVal || 1;

  const getX = (i) => padding + (i / (terms.length - 1 || 1)) * plotW;
  const getY = (v) => padding + plotH - ((v - minVal) / range) * plotH;

  const linePoints = terms.map((t, i) => `${getX(i)},${getY(t)}`).join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + plotH * (1 - frac)}
            x2={width - padding}
            y2={padding + plotH * (1 - frac)}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Connecting line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke="#fb7185"
          strokeWidth="2"
          strokeDasharray="6,3"
        />

        {/* Points */}
        {terms.map((t, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(t)} r="6" fill="#f43f5e" />
            <circle cx={getX(i)} cy={getY(t)} r="3" fill="white" />
            <text
              x={getX(i)}
              y={getY(t) - 12}
              textAnchor="middle"
              className="text-xs font-mono"
              fill="#64748b"
              fontSize="10"
            >
              {formatNum(t)}
            </text>
            <text
              x={getX(i)}
              y={height - 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
            >
              a{i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// --- Lab Component ---

const SequenceLab = () => {
  const [seqType, setSeqType] = useState('arithmetic');
  const [a1, setA1] = useState(2);
  const [d, setD] = useState(3);
  const [r, setR] = useState(2);
  const [vizType, setVizType] = useState('bars');

  const terms = seqType === 'arithmetic'
    ? generateArithmeticTerms(a1, d, 10)
    : generateGeometricTerms(a1, r, 10);

  const nthTerm = seqType === 'arithmetic'
    ? arithmeticNthTerm(a1, d, 10)
    : geometricNthTerm(a1, r, 10);

  const sumN = seqType === 'arithmetic'
    ? arithmeticSum(a1, d, 10)
    : geometricSum(a1, r, 10);

  return (
    <div className="space-y-6">
      {/* Sequence type toggle */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSeqType('arithmetic')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            seqType === 'arithmetic'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
          }`}
        >
          Segida Aritmetikoa
        </button>
        <button
          onClick={() => setSeqType('geometric')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            seqType === 'geometric'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
          }`}
        >
          Segida Geometrikoa
        </button>
      </div>

      {/* Input controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">
            Lehen terminoa (a{'\u2081'})
          </p>
          <input
            type="number"
            value={a1}
            onChange={(e) => setA1(parseFloat(e.target.value) || 0)}
            className="w-full text-center p-3 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:outline-none font-mono font-bold text-lg"
          />
        </div>
        {seqType === 'arithmetic' ? (
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">
              Diferentzia komuna (d)
            </p>
            <input
              type="number"
              value={d}
              onChange={(e) => setD(parseFloat(e.target.value) || 0)}
              className="w-full text-center p-3 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:outline-none font-mono font-bold text-lg"
            />
          </div>
        ) : (
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">
              Arrazoia (r)
            </p>
            <input
              type="number"
              step="0.1"
              value={r}
              onChange={(e) => setR(parseFloat(e.target.value) || 0)}
              className="w-full text-center p-3 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:outline-none font-mono font-bold text-lg"
            />
          </div>
        )}
      </div>

      {/* Visualization type toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setVizType('bars')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            vizType === 'bars'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Barra-diagrama
        </button>
        <button
          onClick={() => setVizType('points')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            vizType === 'points'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Puntuak
        </button>
      </div>

      {/* Visualization */}
      {vizType === 'bars' ? (
        <SequenceChart terms={terms} />
      ) : (
        <SequencePoints terms={terms} />
      )}

      {/* Terms list */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Lehen 10 terminoak</p>
        <div className="flex flex-wrap gap-2">
          {terms.map((t, i) => (
            <div key={i} className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-center min-w-[60px]">
              <p className="text-xs text-slate-400 font-mono">a<sub>{i + 1}</sub></p>
              <p className="font-mono font-bold text-slate-800 text-sm">{formatNum(t)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">10. terminoa (a{'\u2081\u2080'})</p>
          <p className="font-mono font-bold text-rose-700 text-2xl">{formatNum(nthTerm)}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Lehen 10en batura (S{'\u2081\u2080'})</p>
          <p className="font-mono font-bold text-rose-700 text-2xl">{formatNum(sumN)}</p>
        </div>
      </div>

      {/* Formula being used */}
      <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center space-y-2">
        {seqType === 'arithmetic' ? (
          <>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Erabilitako formulak</p>
            <p className="text-lg">a<sub>n</sub> = <span className="text-rose-400">{a1}</span> + (n-1) {'\u00B7'} <span className="text-rose-400">{d}</span></p>
            <p className="text-lg">S<sub>n</sub> = n {'\u00B7'} (a<sub>1</sub> + a<sub>n</sub>) / 2</p>
          </>
        ) : (
          <>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Erabilitako formulak</p>
            <p className="text-lg">a<sub>n</sub> = <span className="text-rose-400">{a1}</span> {'\u00B7'} <span className="text-rose-400">{r}</span><sup>n-1</sup></p>
            <p className="text-lg">S<sub>n</sub> = a<sub>1</sub> {'\u00B7'} (1 - r<sup>n</sup>) / (1 - r)</p>
          </>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Segidak() {
  const [activeTab, setActiveTab] = useState('teoria');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('segidak');

  const generateProblem = useCallback(() => {
    const types = ['arith_nth', 'arith_sum', 'geo_nth', 'geo_sum', 'identify'];
    const type = types[Math.floor(Math.random() * types.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let prob;

    if (type === 'arith_nth') {
      const a1 = randInt(1, 10);
      const d = randInt(2, 8);
      const n = randInt(5, 15);
      const answer = arithmeticNthTerm(a1, d, n);
      prob = {
        type,
        display: `Segida aritmetikoa: a\u2081 = ${a1}, d = ${d}\n\nKalkulatu a\u2080${n} (${n}. terminoa)`,
        solution: answer,
        hint: `a\u2099 = a\u2081 + (n-1)\u00B7d = ${a1} + (${n}-1)\u00B7${d} = ${a1} + ${(n - 1) * d} = ${answer}`
      };
    } else if (type === 'arith_sum') {
      const a1 = randInt(1, 5);
      const d = randInt(1, 5);
      const n = randInt(5, 10);
      const answer = arithmeticSum(a1, d, n);
      const an = arithmeticNthTerm(a1, d, n);
      prob = {
        type,
        display: `Segida aritmetikoa: a\u2081 = ${a1}, d = ${d}\n\nKalkulatu S\u2080${n} (lehen ${n} terminoen batura)`,
        solution: answer,
        hint: `a\u2099 = ${an}, S\u2099 = n\u00B7(a\u2081+a\u2099)/2 = ${n}\u00B7(${a1}+${an})/2 = ${n}\u00B7${a1 + an}/2 = ${answer}`
      };
    } else if (type === 'geo_nth') {
      const a1 = randInt(1, 5);
      const r = randInt(2, 4);
      const n = randInt(3, 6);
      const answer = geometricNthTerm(a1, r, n);
      prob = {
        type,
        display: `Segida geometrikoa: a\u2081 = ${a1}, r = ${r}\n\nKalkulatu a\u2080${n} (${n}. terminoa)`,
        solution: answer,
        hint: `a\u2099 = a\u2081\u00B7r\u207F\u207B\u00B9 = ${a1}\u00B7${r}^${n - 1} = ${a1}\u00B7${Math.pow(r, n - 1)} = ${answer}`
      };
    } else if (type === 'geo_sum') {
      const a1 = randInt(1, 4);
      const r = randInt(2, 3);
      const n = randInt(3, 5);
      const answer = geometricSum(a1, r, n);
      prob = {
        type,
        display: `Segida geometrikoa: a\u2081 = ${a1}, r = ${r}\n\nKalkulatu S\u2080${n} (lehen ${n} terminoen batura)`,
        solution: answer,
        hint: `S\u2099 = a\u2081\u00B7(1 - r\u207F)/(1 - r) = ${a1}\u00B7(1 - ${Math.pow(r, n)})/(1 - ${r}) = ${a1}\u00B7${1 - Math.pow(r, n)}/${1 - r} = ${answer}`
      };
    } else {
      // Identify type
      const isArith = Math.random() > 0.5;
      let seq;
      let correctAnswer;
      if (isArith) {
        const a1 = randInt(1, 10);
        const d = randInt(2, 6);
        seq = generateArithmeticTerms(a1, d, 5);
        correctAnswer = 1; // 1 = arithmetic
      } else {
        const a1 = randInt(1, 4);
        const r = randInt(2, 4);
        seq = generateGeometricTerms(a1, r, 5);
        correctAnswer = 2; // 2 = geometric
      }
      prob = {
        type: 'identify',
        display: `Segida hau identifikatu:\n\n${seq.join(', ')}, ...\n\nIdatzi 1 aritmetikoa bada, 2 geometrikoa bada.`,
        solution: correctAnswer,
        hint: isArith
          ? `Termino bakoitzaren arteko diferentzia berdina da: ${seq[1] - seq[0]}. Beraz, aritmetikoa da (1).`
          : `Termino bakoitzaren arteko zatidura berdina da: ${seq[1] / seq[0]}. Beraz, geometrikoa da (2).`
      };
    }

    setProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  }, []);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  const checkAnswer = () => {
    if (!problem) return;
    const val = parseFloat(userInput);
    if (isNaN(val)) { setFeedback('invalid'); return; }
    if (Math.abs(val - problem.solution) < 0.5) {
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-colors ${
                  tab.id === 'praktika'
                    ? `px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-sm shadow-rose-200`
                    : `hover:text-rose-600 ${activeTab === tab.id ? 'text-rose-600' : ''}`
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Segidak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Segida aritmetikoak eta geometrikoak: terminoak, formulak eta haien propietateak. Zenbaki-segiden mundua ezagutu.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: TEORIA ==================== */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* What is a sequence */}
            <Section title="Zer da segida bat?" icon={BookOpen} className="border-rose-200 ring-4 ring-rose-50/30">
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Segida</strong> bat zenbakien zerrenda ordenatu bat da, arau jakin bati jarraituz sortua. Segida bateko zenbaki bakoitzari <strong>termino</strong> deritzo. Terminoak a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, ... bezala adierazten dira.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Segida orokorra</p>
                    <div className="font-mono text-2xl md:text-4xl">
                      <span className="text-rose-400">a<sub>1</sub></span>
                      <span className="text-slate-600">, </span>
                      <span className="text-rose-400">a<sub>2</sub></span>
                      <span className="text-slate-600">, </span>
                      <span className="text-rose-400">a<sub>3</sub></span>
                      <span className="text-slate-600">, ... , </span>
                      <span className="text-pink-400">a<sub>n</sub></span>
                      <span className="text-slate-600">, ...</span>
                    </div>
                    <p className="text-slate-500 mt-4 text-sm">
                      n-garren terminoa: segidako n. posizioko balioa
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <TrendingUp size={16} className="text-rose-500" />
                      Segida Aritmetikoa
                    </h3>
                    <p className="text-sm text-slate-600">Ondoz ondoko terminoen arteko <strong>diferentzia konstantea</strong> da.</p>
                    <p className="font-mono text-sm text-rose-700 font-bold mt-2">2, 5, 8, 11, 14, ... (d = 3)</p>
                  </div>
                  <div className="p-4 bg-pink-50 border border-pink-100 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Zap size={16} className="text-pink-500" />
                      Segida Geometrikoa
                    </h3>
                    <p className="text-sm text-slate-600">Ondoz ondoko terminoen arteko <strong>zatidura konstantea</strong> da.</p>
                    <p className="font-mono text-sm text-pink-700 font-bold mt-2">3, 6, 12, 24, 48, ... (r = 2)</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Arithmetic Sequences */}
            <Section title="Segida Aritmetikoak" icon={TrendingUp}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  Segida aritmetiko batean, termino bakoitza aurrekoari <strong>diferentzia komun</strong> bat (d) gehituz lortzen da. Diferentzia positiboa bada segida goranzkoa da, negatiboa bada beheranzkoa.
                </p>

                <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-hidden">
                  <div className="bg-rose-50 p-4 border-b border-rose-100">
                    <h3 className="font-bold text-lg text-rose-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono font-bold text-rose-600">n</div>
                      n-garren terminoaren formula
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center">
                      <p className="text-2xl md:text-3xl font-bold">
                        a<sub>n</sub> = a<sub>1</sub> + (n - 1) {'\u00B7'} d
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800">a<sub>n</sub></p>
                        <p className="text-slate-500">n-garren terminoa</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800">a<sub>1</sub></p>
                        <p className="text-slate-500">Lehen terminoa</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800">d</p>
                        <p className="text-slate-500">Diferentzia komuna</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-hidden">
                  <div className="bg-rose-50 p-4 border-b border-rose-100">
                    <h3 className="font-bold text-lg text-rose-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono font-bold text-rose-600">S</div>
                      n lehen terminoen batura
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center">
                      <p className="text-2xl md:text-3xl font-bold">
                        S<sub>n</sub> = n {'\u00B7'} (a<sub>1</sub> + a<sub>n</sub>) / 2
                      </p>
                    </div>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-rose-600">Ohartu:</strong> Lehen eta azken terminoaren batez bestekoa, n aldiz biderkatuta.
                    </div>
                  </div>
                </div>

                {/* Example */}
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl">
                  <h4 className="font-bold text-rose-800 mb-3 flex items-center gap-2">
                    <ArrowRight size={16} /> Adibidea
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>Segida: <strong className="font-mono">3, 7, 11, 15, 19, ...</strong></p>
                    <p>Lehen terminoa: a<sub>1</sub> = 3, Diferentzia: d = 7 - 3 = <strong>4</strong></p>
                    <p className="mt-2">20. terminoa: a<sub>20</sub> = 3 + (20-1){'\u00B7'}4 = 3 + 76 = <strong className="text-rose-700 text-base">79</strong></p>
                    <p>Lehen 20en batura: S<sub>20</sub> = 20{'\u00B7'}(3+79)/2 = 20{'\u00B7'}41 = <strong className="text-rose-700 text-base">820</strong></p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Geometric Sequences */}
            <Section title="Segida Geometrikoak" icon={Zap}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  Segida geometriko batean, termino bakoitza aurrekoa <strong>arrazoi</strong> (r) batez biderkatuz lortzen da. Arrazoia positiboa eta 1 baino handiagoa bada segida esponentzialki hazten da.
                </p>

                <div className="bg-white rounded-2xl border-2 border-pink-100 overflow-hidden">
                  <div className="bg-pink-50 p-4 border-b border-pink-100">
                    <h3 className="font-bold text-lg text-pink-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono font-bold text-pink-600">n</div>
                      n-garren terminoaren formula
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center">
                      <p className="text-2xl md:text-3xl font-bold">
                        a<sub>n</sub> = a<sub>1</sub> {'\u00B7'} r<sup>n-1</sup>
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800">a<sub>n</sub></p>
                        <p className="text-slate-500">n-garren terminoa</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800">a<sub>1</sub></p>
                        <p className="text-slate-500">Lehen terminoa</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="font-bold text-slate-800">r</p>
                        <p className="text-slate-500">Arrazoia (ratio)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-pink-100 overflow-hidden">
                  <div className="bg-pink-50 p-4 border-b border-pink-100">
                    <h3 className="font-bold text-lg text-pink-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono font-bold text-pink-600">S</div>
                      n lehen terminoen batura
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center">
                      <p className="text-2xl md:text-3xl font-bold">
                        S<sub>n</sub> = a<sub>1</sub> {'\u00B7'} (1 - r<sup>n</sup>) / (1 - r)
                      </p>
                      <p className="text-slate-400 text-sm mt-3">r {'\u2260'} 1 denean</p>
                    </div>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-pink-600">Kontuz:</strong> r = 1 denean, S<sub>n</sub> = n {'\u00B7'} a<sub>1</sub> (termino guztiak berdinak dira).
                    </div>
                  </div>
                </div>

                {/* Example */}
                <div className="p-5 bg-pink-50 border border-pink-200 rounded-xl">
                  <h4 className="font-bold text-pink-800 mb-3 flex items-center gap-2">
                    <ArrowRight size={16} /> Adibidea
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>Segida: <strong className="font-mono">2, 6, 18, 54, 162, ...</strong></p>
                    <p>Lehen terminoa: a<sub>1</sub> = 2, Arrazoia: r = 6/2 = <strong>3</strong></p>
                    <p className="mt-2">6. terminoa: a<sub>6</sub> = 2{'\u00B7'}3<sup>5</sup> = 2{'\u00B7'}243 = <strong className="text-pink-700 text-base">486</strong></p>
                    <p>Lehen 6en batura: S<sub>6</sub> = 2{'\u00B7'}(1-3<sup>6</sup>)/(1-3) = 2{'\u00B7'}(1-729)/(-2) = <strong className="text-pink-700 text-base">728</strong></p>
                  </div>
                </div>

                {/* Difference between arithmetic and geometric */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-800 mb-3">Desberdintasun nagusia</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                      <p className="font-bold text-rose-700 mb-1">Aritmetikoa</p>
                      <p className="text-slate-600">Termino batetik hurrengora <strong>batzen</strong> da (d gehitzen).</p>
                      <p className="font-mono text-xs text-slate-500 mt-1">a<sub>n+1</sub> = a<sub>n</sub> + d</p>
                    </div>
                    <div className="p-3 bg-pink-50 border border-pink-100 rounded-lg">
                      <p className="font-bold text-pink-700 mb-1">Geometrikoa</p>
                      <p className="text-slate-600">Termino batetik hurrengora <strong>biderkatzen</strong> da (r-z biderkatzen).</p>
                      <p className="font-mono text-xs text-slate-500 mt-1">a<sub>n+1</sub> = a<sub>n</sub> {'\u00B7'} r</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== TAB 2: LABORATEGIA ==================== */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Segida Esploratzailea" icon={TrendingUp}>
              <SequenceLab />
            </Section>
          </div>
        )}

        {/* ==================== TAB 3: FORMULAK ==================== */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Arithmetic Formulas */}
            <Section title="Segida Aritmetikoaren Formulak" icon={ListOrdered}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-hidden">
                  <div className="bg-rose-50 p-4 border-b border-rose-100">
                    <h3 className="font-bold text-rose-800 text-center">n-garren terminoa</h3>
                  </div>
                  <div className="p-6 text-center">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono">
                      <p className="text-xl md:text-2xl font-bold">
                        a<sub>n</sub> = a<sub>1</sub> + (n-1){'\u00B7'}d
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 space-y-1">
                      <p><strong>a<sub>1</sub></strong> = lehen terminoa</p>
                      <p><strong>d</strong> = diferentzia komuna</p>
                      <p><strong>n</strong> = terminoaren posizioa</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-hidden">
                  <div className="bg-rose-50 p-4 border-b border-rose-100">
                    <h3 className="font-bold text-rose-800 text-center">n lehen terminoen batura</h3>
                  </div>
                  <div className="p-6 text-center">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono">
                      <p className="text-xl md:text-2xl font-bold">
                        S<sub>n</sub> = n{'\u00B7'}(a<sub>1</sub> + a<sub>n</sub>) / 2
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 space-y-1">
                      <p><strong>S<sub>n</sub></strong> = lehen n terminoen batura</p>
                      <p><strong>a<sub>n</sub></strong> = n-garren terminoa</p>
                    </div>
                    <div className="mt-3 bg-rose-50 p-3 rounded-lg text-xs text-rose-700">
                      Baliokidea: S<sub>n</sub> = n{'\u00B7'}(2a<sub>1</sub> + (n-1){'\u00B7'}d) / 2
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Geometric Formulas */}
            <Section title="Segida Geometrikoaren Formulak" icon={Zap}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border-2 border-pink-100 overflow-hidden">
                  <div className="bg-pink-50 p-4 border-b border-pink-100">
                    <h3 className="font-bold text-pink-800 text-center">n-garren terminoa</h3>
                  </div>
                  <div className="p-6 text-center">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono">
                      <p className="text-xl md:text-2xl font-bold">
                        a<sub>n</sub> = a<sub>1</sub> {'\u00B7'} r<sup>n-1</sup>
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 space-y-1">
                      <p><strong>a<sub>1</sub></strong> = lehen terminoa</p>
                      <p><strong>r</strong> = arrazoia (ratio)</p>
                      <p><strong>n</strong> = terminoaren posizioa</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-pink-100 overflow-hidden">
                  <div className="bg-pink-50 p-4 border-b border-pink-100">
                    <h3 className="font-bold text-pink-800 text-center">n lehen terminoen batura (finitua)</h3>
                  </div>
                  <div className="p-6 text-center">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono">
                      <p className="text-xl md:text-2xl font-bold">
                        S<sub>n</sub> = a<sub>1</sub>{'\u00B7'}(1 - r<sup>n</sup>) / (1 - r)
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 space-y-1">
                      <p><strong>r {'\u2260'} 1</strong> izan behar du</p>
                      <p>r = 1 bada: S<sub>n</sub> = n{'\u00B7'}a<sub>1</sub></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infinite geometric sum */}
              <div className="mt-6 bg-white rounded-2xl border-2 border-purple-100 overflow-hidden">
                <div className="bg-purple-50 p-4 border-b border-purple-100">
                  <h3 className="font-bold text-purple-800 text-center">Segida geometriko infinituaren batura</h3>
                </div>
                <div className="p-6 text-center space-y-4">
                  <div className="bg-slate-900 text-white rounded-xl p-5 font-mono">
                    <p className="text-xl md:text-2xl font-bold">
                      S<sub>{'\u221E'}</sub> = a<sub>1</sub> / (1 - r)
                    </p>
                    <p className="text-slate-400 text-sm mt-3">|r| {'<'} 1 denean soilik</p>
                  </div>
                  <div className="text-sm text-slate-600 bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="mb-2"><strong className="text-purple-700">Baldintza:</strong> Arrazoi absolutuaren balioa 1 baino txikiagoa izan behar da (|r| {'<'} 1) batura infinitua konbergentea izan dadin.</p>
                    <p><strong>Adibidea:</strong> a<sub>1</sub> = 4, r = 1/2 {'\u2192'} S<sub>{'\u221E'}</sub> = 4 / (1 - 0.5) = 4 / 0.5 = <strong className="text-purple-700">8</strong></p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Summary table */}
            <Section title="Formula Guztien Laburpena" icon={BookOpen}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left p-3 text-xs text-slate-400 uppercase">Formula</th>
                      <th className="text-left p-3 text-xs text-slate-400 uppercase">Aritmetikoa</th>
                      <th className="text-left p-3 text-xs text-slate-400 uppercase">Geometrikoa</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-800">n-garren terminoa</td>
                      <td className="p-3 text-rose-700">a<sub>1</sub> + (n-1){'\u00B7'}d</td>
                      <td className="p-3 text-pink-700">a<sub>1</sub>{'\u00B7'}r<sup>n-1</sup></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-800">Batura (finitua)</td>
                      <td className="p-3 text-rose-700">n{'\u00B7'}(a<sub>1</sub>+a<sub>n</sub>)/2</td>
                      <td className="p-3 text-pink-700">a<sub>1</sub>{'\u00B7'}(1-r<sup>n</sup>)/(1-r)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-800">Batura (infinitua)</td>
                      <td className="p-3 text-slate-400">Ez da konbergitzen</td>
                      <td className="p-3 text-pink-700">a<sub>1</sub>/(1-r), |r|{'<'}1</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-800">Erlazioa</td>
                      <td className="p-3 text-rose-700">a<sub>n+1</sub> = a<sub>n</sub> + d</td>
                      <td className="p-3 text-pink-700">a<sub>n+1</sub> = a<sub>n</sub>{'\u00B7'}r</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== TAB 4: PRAKTIKA ==================== */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Zap} className="border-rose-200 ring-4 ring-rose-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center gap-4 mb-6">
                  <div className="bg-rose-50 border border-rose-100 px-6 py-2 rounded-full text-sm font-bold text-rose-700">
                    Puntuazioa: {score} / {total}
                  </div>
                  {total > 0 && (
                    <div className="bg-slate-50 border border-slate-200 px-6 py-2 rounded-full text-sm font-bold text-slate-600">
                      {Math.round((score / total) * 100)}%
                    </div>
                  )}
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'arith_nth' ? 'Segida aritmetikoa - Terminoa' :
                         problem.type === 'arith_sum' ? 'Segida aritmetikoa - Batura' :
                         problem.type === 'geo_nth' ? 'Segida geometrikoa - Terminoa' :
                         problem.type === 'geo_sum' ? 'Segida geometrikoa - Batura' :
                         'Segida mota identifikatu'}
                      </div>
                      <div className="text-lg md:text-xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input
                          type="number"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors text-lg font-bold"
                        />
                      </div>
                    </div>

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
                             `Gaizki. Erantzun zuzena: ${problem.solution}`}
                          </span>
                        </div>
                        {feedback === 'incorrect' && !showHint && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Nola ebazten da?
                          </button>
                        )}
                      </div>
                    )}

                    {showHint && (feedback === 'incorrect' || feedback === 'correct') && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in text-left">
                        <strong>Ebazpena:</strong> {problem.hint}
                      </div>
                    )}

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
                          className="px-8 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-400 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          <ArrowRight size={18} /> Hurrengo ariketa
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

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-500">Be&ntilde;at Erezuma</a></p>
      </footer>

    </div>
  );
}
