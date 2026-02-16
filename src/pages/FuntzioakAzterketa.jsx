import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import {
  BookOpen,
  Check,
  RefreshCw,
  Brain,
  ArrowRight,
  AlertTriangle,
  Layers,
  ListOrdered,
  X,
  TrendingUp,
  Thermometer,
  Car,
  Banknote,
  Eye,
  ArrowUpDown
} from 'lucide-react';

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

// --- Function Definitions ---

const FUNCTIONS = {
  linear: {
    label: 'Lineala',
    formula: (a, b) => `f(x) = ${a}x + ${b === 0 ? '' : (b > 0 ? ' + ' + b : ' - ' + Math.abs(b))}`,
    eval: (x, a, b) => a * x + b,
    params: [
      { name: 'a (malda)', key: 'a', min: -5, max: 5, step: 0.5, default: 2 },
      { name: 'b (y-ebakidura)', key: 'b', min: -5, max: 5, step: 1, default: 1 },
    ],
    color: '#f43f5e',
  },
  quadratic: {
    label: 'Koadratikoa',
    formula: (a, b, c) => `f(x) = ${a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
    eval: (x, a, b, c) => a * x * x + b * x + c,
    params: [
      { name: 'a', key: 'a', min: -3, max: 3, step: 0.5, default: 1 },
      { name: 'b', key: 'b', min: -5, max: 5, step: 1, default: 0 },
      { name: 'c', key: 'c', min: -5, max: 5, step: 1, default: -2 },
    ],
    color: '#8b5cf6',
  },
  cubic: {
    label: 'Kubikoa',
    formula: (a, b) => `f(x) = ${a === 1 ? '' : a}x³ ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}`,
    eval: (x, a, b) => a * x * x * x + b,
    params: [
      { name: 'a', key: 'a', min: -2, max: 2, step: 0.5, default: 1 },
      { name: 'b', key: 'b', min: -5, max: 5, step: 1, default: 0 },
    ],
    color: '#06b6d4',
  },
  abs: {
    label: 'Balio Absolutua',
    formula: (a, b) => `f(x) = ${a === 1 ? '' : a}|x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}|`,
    eval: (x, a, b) => a * Math.abs(x + b),
    params: [
      { name: 'a', key: 'a', min: -3, max: 3, step: 0.5, default: 1 },
      { name: 'b (desplazamendua)', key: 'b', min: -5, max: 5, step: 1, default: 0 },
    ],
    color: '#f59e0b',
  },
  sqrt: {
    label: 'Erro karratua',
    formula: (a) => `f(x) = ${a === 1 ? '' : a}√x`,
    eval: (x, a) => x >= 0 ? a * Math.sqrt(x) : NaN,
    params: [
      { name: 'a', key: 'a', min: -3, max: 3, step: 0.5, default: 1 },
    ],
    color: '#10b981',
  },
  inverse: {
    label: 'Alderantzizkoa',
    formula: (a) => `f(x) = ${a}/x`,
    eval: (x, a) => x !== 0 ? a / x : NaN,
    params: [
      { name: 'a', key: 'a', min: -5, max: 5, step: 1, default: 1 },
    ],
    color: '#ec4899',
  },
};

// --- Function Graph ---

const FunctionGraph = ({ funcType, params, showGrid = true, showAnalysis = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 30;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (showGrid) {
      // Grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = cx % scale; x < w; x += scale) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = cy % scale; y < h; y += scale) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
      ctx.moveTo(0, cy); ctx.lineTo(w, cy);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      for (let i = -Math.floor(cx / scale); i <= Math.floor(cx / scale); i++) {
        if (i === 0) continue;
        const px = cx + i * scale;
        ctx.fillText(i.toString(), px, cy + 14);
      }
      ctx.textAlign = 'right';
      for (let i = -Math.floor(cy / scale); i <= Math.floor(cy / scale); i++) {
        if (i === 0) continue;
        const py = cy - i * scale;
        ctx.fillText(i.toString(), cx - 6, py + 4);
      }
    }

    const fn = FUNCTIONS[funcType];
    if (!fn) return;

    const paramValues = fn.params.map(p => params[p.key] ?? p.default);
    const evaluate = (x) => fn.eval(x, ...paramValues);

    // Draw function
    ctx.strokeStyle = fn.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let drawing = false;

    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      const y = evaluate(x);
      if (isNaN(y) || !isFinite(y) || Math.abs(y) > 100) {
        drawing = false;
        continue;
      }
      const py = cy - y * scale;
      if (py < -200 || py > h + 200) { drawing = false; continue; }
      if (!drawing) { ctx.moveTo(px, py); drawing = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Analysis markers
    if (showAnalysis) {
      // Find roots (y=0 crossings)
      ctx.fillStyle = '#ef4444';
      for (let px = 1; px < w; px++) {
        const x1 = (px - 1 - cx) / scale;
        const x2 = (px - cx) / scale;
        const y1 = evaluate(x1);
        const y2 = evaluate(x2);
        if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
          if ((y1 >= 0 && y2 < 0) || (y1 < 0 && y2 >= 0)) {
            const rootX = x1 - y1 * (x2 - x1) / (y2 - y1);
            const rpx = cx + rootX * scale;
            ctx.beginPath();
            ctx.arc(rpx, cy, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`x≈${rootX.toFixed(1)}`, rpx, cy + 20);
          }
        }
      }

      // Y-intercept
      const y0 = evaluate(0);
      if (!isNaN(y0) && isFinite(y0)) {
        const py0 = cy - y0 * scale;
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(cx, py0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`(0, ${y0 % 1 === 0 ? y0 : y0.toFixed(1)})`, cx + 8, py0 - 8);
      }

      // Find local extrema (approximate)
      ctx.fillStyle = '#10b981';
      for (let px = 2; px < w - 2; px++) {
        const x0 = (px - 1 - cx) / scale;
        const x1 = (px - cx) / scale;
        const x2 = (px + 1 - cx) / scale;
        const y0 = evaluate(x0);
        const y1 = evaluate(x1);
        const y2 = evaluate(x2);
        if (isNaN(y0) || isNaN(y1) || isNaN(y2)) continue;
        if (!isFinite(y0) || !isFinite(y1) || !isFinite(y2)) continue;
        if ((y1 > y0 && y1 > y2) || (y1 < y0 && y1 < y2)) {
          const epy = cy - y1 * scale;
          if (epy > 10 && epy < h - 10) {
            ctx.beginPath();
            ctx.arc(px, epy, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            const label = y1 > y0 ? 'Max' : 'Min';
            ctx.fillText(`${label}(${x1.toFixed(1)}, ${y1.toFixed(1)})`, px, epy - 10);
          }
        }
      }
    }

  }, [funcType, params, showGrid, showAnalysis]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />
  );
};

// --- Main Component ---

export default function FuntzioakAzterketa() {
  const [activeTab, setActiveTab] = useState('concept');

  // Lab state
  const [selectedFunc, setSelectedFunc] = useState('quadratic');
  const [funcParams, setFuncParams] = useState({ a: 1, b: 0, c: -2 });
  const [showAnalysis, setShowAnalysis] = useState(true);

  // Practice state
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('func');

  useEffect(() => { generateProblem(); }, []);

  // Reset params when function type changes
  const handleFuncChange = (type) => {
    setSelectedFunc(type);
    const newParams = {};
    FUNCTIONS[type].params.forEach(p => { newParams[p.key] = p.default; });
    setFuncParams(newParams);
  };

  const generateProblem = () => {
    const types = ['domain', 'image', 'intercept', 'growth', 'evaluate'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'domain') {
      const subtypes = [
        {
          display: 'f(x) = √(x - 3)\nEremuaren hasiera = ? (x ≥ ...)',
          solution: 3,
          hint: 'Erro karratua: barrualdea ≥ 0 behar du. x - 3 ≥ 0 → x ≥ 3'
        },
        {
          display: 'f(x) = 1/(x - 5)\nZein balioan EZ dago definituta?',
          solution: 5,
          hint: 'Zatiketa: izendatzailea ≠ 0. x - 5 = 0 → x = 5 puntuan ez dago definituta.'
        },
        {
          display: 'f(x) = √(x + 2)\nEremuaren hasiera = ? (x ≥ ...)',
          solution: -2,
          hint: 'x + 2 ≥ 0 → x ≥ -2'
        },
        {
          display: 'f(x) = 1/(x + 4)\nZein balioan EZ dago definituta?',
          solution: -4,
          hint: 'x + 4 = 0 → x = -4'
        },
      ];
      prob = { type, ...subtypes[Math.floor(Math.random() * subtypes.length)] };
    } else if (type === 'image') {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 7) - 3;
      const x = Math.floor(Math.random() * 7) - 3;
      const result = a * x + b;
      prob = {
        type,
        display: `f(x) = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}\nf(${x}) = ?`,
        solution: result,
        hint: `f(${x}) = ${a}·(${x}) + (${b}) = ${a * x} + (${b}) = ${result}`
      };
    } else if (type === 'intercept') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 11) - 5;
      // y-intercept: f(0) = b
      prob = {
        type,
        display: `f(x) = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}\ny-ebakidura (ordenatuaren jatorria) = ?`,
        solution: b,
        hint: `y-ebakidura = f(0) = ${a}·0 + (${b}) = ${b}`
      };
    } else if (type === 'growth') {
      // Is the function growing or decreasing at a point?
      const a = [2, 3, -1, -2, -3, 1, 4, -4][Math.floor(Math.random() * 8)];
      const b = Math.floor(Math.random() * 7) - 3;
      // For linear: if a > 0 growing, if a < 0 decreasing
      prob = {
        type,
        display: `f(x) = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}\nMalda = ?`,
        solution: a,
        hint: `Funtzio lineal batean, malda = x-ren koefizientea = ${a}. ${a > 0 ? 'Positiboa → gorakorra' : 'Negatiboa → beherakorra'}`
      };
    } else {
      // Evaluate quadratic
      const a = [1, -1, 2, -2][Math.floor(Math.random() * 4)];
      const c = Math.floor(Math.random() * 7) - 3;
      const x = Math.floor(Math.random() * 5) - 2;
      const result = a * x * x + c;
      prob = {
        type,
        display: `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}\nf(${x}) = ?`,
        solution: result,
        hint: `f(${x}) = ${a}·(${x})² + (${c}) = ${a}·${x * x} + (${c}) = ${a * x * x} + (${c}) = ${result}`
      };
    }

    setProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const val = parseFloat(userInput);
    if (isNaN(val)) { setFeedback('invalid'); return; }
    if (Math.abs(val - problem.solution) < 0.1) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-rose-600 transition-colors ${activeTab === 'concept' ? 'text-rose-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-rose-600 transition-colors ${activeTab === 'viz' ? 'text-rose-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('types')} className={`hover:text-rose-600 transition-colors ${activeTab === 'types' ? 'text-rose-600' : ''}`}>Funtzio Motak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all shadow-sm shadow-rose-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Funtzioen <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Azterketa</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eremua, ibilbidea, jarraitutasuna, gorakortasuna eta mutur erlatiboak. Funtzioak irakurtzen ikasi.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'types', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'types' ? 'Funtzio Motak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zertarako balio du?" icon={BookOpen} className="border-rose-200 ring-4 ring-rose-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Thermometer size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Tenperatura</h3>
                  <p className="text-sm text-slate-600">
                    Eguneko tenperatura funtzio bat da denborarekiko. Noiz egiten du beroena? Noiz hotzena? Hori funtzio azterketa da.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Car size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Abiadura</h3>
                  <p className="text-sm text-slate-600">
                    Auto baten posizioa f(t) bada, noiz gelditzen da? Noiz azeleratzen? Funtzioak irakurtzen jakin behar da.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Banknote size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Finantza</h3>
                  <p className="text-sm text-slate-600">
                    Akzioen prezioak funtzioak dira. Hazten ari da? Noiz da maximoa? Saltzeko momentu onena aurkitzea analisi hutsa da.
                  </p>
                </div>
              </div>
            </Section>

            {/* What is a function */}
            <Section title="Zer da funtzio bat?" icon={Layers}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Definizioa</p>
                    <p className="text-2xl md:text-3xl font-bold text-rose-300 mb-4">
                      f : X → Y
                    </p>
                    <p className="text-slate-300 max-w-lg mx-auto">
                      Funtzio bat erlazio bat da: <strong className="text-rose-400">x</strong> balio bakoitzari <strong className="text-rose-400">y balio bakarra</strong> dagokio.
                    </p>
                    <div className="mt-6 flex justify-center gap-8">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Sarrera</p>
                        <p className="text-xl font-mono text-rose-400">x</p>
                      </div>
                      <div className="text-slate-500 text-2xl self-center">→</div>
                      <div className="bg-slate-800 px-6 py-3 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase">Makina</p>
                        <p className="text-xl font-mono text-white">f</p>
                      </div>
                      <div className="text-slate-500 text-2xl self-center">→</div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Irteera</p>
                        <p className="text-xl font-mono text-pink-400">y = f(x)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-sm text-rose-800">
                  <strong>Proba bertikala:</strong> Grafiko batean lerro bertikal bat marrazten badugu eta kurba puntu <strong>bakarrean</strong> ebakitzen badu, funtzioa da. Bi puntutan ebakitzen badu, ez da funtzioa.
                </div>
              </div>
            </Section>

            {/* Key concepts */}
            <Section title="Kontzeptu Nagusiak" icon={ListOrdered}>
              <div className="space-y-4">
                {[
                  {
                    name: 'Eremua (Domeinua)',
                    formula: 'Dom(f)',
                    description: 'x-ren balio guztiak non funtzioa definituta dagoen.',
                    example: 'f(x) = √x → Dom = [0, +∞)',
                    color: 'rose'
                  },
                  {
                    name: 'Ibilbidea (Irudia)',
                    formula: 'Im(f)',
                    description: 'y-ren balio guztiak funtzioak hartzen dituenak.',
                    example: 'f(x) = x² → Im = [0, +∞)',
                    color: 'pink'
                  },
                  {
                    name: 'Erroak (Zeroak)',
                    formula: 'f(x) = 0',
                    description: 'Funtzioak X ardatza ebakitzen duen puntuak.',
                    example: 'f(x) = x² - 4 → x = ±2',
                    color: 'red'
                  },
                  {
                    name: 'Gorakortasuna / Beherakortasuna',
                    formula: 'f\'(x) > 0 / f\'(x) < 0',
                    description: 'Non hazten den eta non jaisten den funtzioa.',
                    example: 'f(x) = x² → Beherakorra (-∞, 0), Gorakorra (0, +∞)',
                    color: 'orange'
                  },
                  {
                    name: 'Mutur Erlatiboak',
                    formula: 'Maximo / Minimo',
                    description: 'Inguruko balio altuena edo baxuena duen puntua.',
                    example: 'f(x) = -x² + 4 → Max (0, 4)',
                    color: 'amber'
                  },
                ].map((item, i) => (
                  <div key={i} className={`p-5 rounded-xl bg-${item.color}-50 border border-${item.color}-100 hover:border-${item.color}-300 transition-colors`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h3>
                        <p className="font-mono text-lg font-bold text-slate-700">{item.formula}</p>
                        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-mono text-xs text-slate-600">{item.example}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Continuity */}
            <Section title="Jarraitutasuna" icon={ArrowUpDown}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Funtzio bat <strong>jarraitua</strong> da bere grafikoa arkatzik altxatu gabe marraztu badaiteke. Eten bat dagoen lekuan, funtzioa <strong>ez da jarraitua</strong>.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                    <p className="text-xs text-emerald-400 uppercase font-bold mb-2">Jarraitua</p>
                    <p className="font-mono text-lg text-emerald-700 font-bold">f(x) = x²</p>
                    <p className="text-xs text-slate-500 mt-2">Etenik gabe, leuna.</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-center">
                    <p className="text-xs text-amber-400 uppercase font-bold mb-2">Salto etena</p>
                    <p className="font-mono text-lg text-amber-700 font-bold">f(x) = |x|/x</p>
                    <p className="text-xs text-slate-500 mt-2">x=0-n saltoa egiten du (-1-etik 1-era).</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
                    <p className="text-xs text-red-400 uppercase font-bold mb-2">Asintota etena</p>
                    <p className="font-mono text-lg text-red-700 font-bold">f(x) = 1/x</p>
                    <p className="text-xs text-slate-500 mt-2">x=0-n infinituraino doa.</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Jarraitutasun baldintza (3 pausu):</strong></p>
                    <p className="mt-1">1. f(a) existitu behar da (definituta egon)</p>
                    <p>2. lim f(x) existitu behar da x→a denean</p>
                    <p>3. lim f(x) = f(a) bete behar da</p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Funtzio Grafikatzailea" icon={Eye}>
              <div className="space-y-6">
                {/* Function selector */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(FUNCTIONS).map(([key, fn]) => (
                    <button
                      key={key}
                      onClick={() => handleFuncChange(key)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        selectedFunc === key
                          ? 'text-white shadow-lg'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
                      }`}
                      style={selectedFunc === key ? { backgroundColor: fn.color } : {}}
                    >
                      {fn.label}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Graph */}
                  <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
                    <FunctionGraph
                      funcType={selectedFunc}
                      params={funcParams}
                      showAnalysis={showAnalysis}
                    />
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    {/* Formula display */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Funtzioa</p>
                      <p className="font-mono text-lg" style={{ color: FUNCTIONS[selectedFunc].color }}>
                        {FUNCTIONS[selectedFunc].formula(...FUNCTIONS[selectedFunc].params.map(p => funcParams[p.key] ?? p.default))}
                      </p>
                    </div>

                    {/* Param sliders */}
                    {FUNCTIONS[selectedFunc].params.map((p) => (
                      <div key={p.key}>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">{p.name}</label>
                          <span className="text-xs font-mono bg-rose-100 text-rose-700 px-2 rounded font-bold">{funcParams[p.key] ?? p.default}</span>
                        </div>
                        <input
                          type="range"
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          value={funcParams[p.key] ?? p.default}
                          onChange={(e) => setFuncParams({ ...funcParams, [p.key]: parseFloat(e.target.value) })}
                          className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}

                    {/* Toggle analysis */}
                    <button
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        showAnalysis
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <TrendingUp size={16} />
                      {showAnalysis ? 'Analisia: ON' : 'Analisia: OFF'}
                    </button>

                    <div className="text-xs text-slate-400 space-y-1">
                      <p><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span> Erroak (X-ebakidurak)</p>
                      <p><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Y-ebakidura</p>
                      <p><span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-1"></span> Maximoak / Minimoak</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 3: FUNCTION TYPES --- */}
        {activeTab === 'types' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Funtzio Motak" icon={ListOrdered}>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Lineala',
                    formula: 'f(x) = mx + n',
                    description: 'Lerro zuzen bat. m = malda, n = y-ebakidura.',
                    properties: ['Dom = ℝ', 'Im = ℝ', 'm > 0 → gorakorra', 'm < 0 → beherakorra'],
                    color: 'rose',
                    funcKey: 'linear',
                  },
                  {
                    name: 'Koadratikoa (Parabola)',
                    formula: 'f(x) = ax² + bx + c',
                    description: 'U forma. a > 0 → gorantz; a < 0 → beherantz.',
                    properties: ['Dom = ℝ', 'Bertexean → Max edo Min', 'Simetria-ardatza: x = -b/2a'],
                    color: 'purple',
                    funcKey: 'quadratic',
                  },
                  {
                    name: 'Kubikoa',
                    formula: 'f(x) = ax³ + ...',
                    description: 'S forma duen kurba. Beti du gutxienez erro bat.',
                    properties: ['Dom = ℝ', 'Im = ℝ', 'Inflexio puntua dago'],
                    color: 'cyan',
                    funcKey: 'cubic',
                  },
                  {
                    name: 'Balio Absolutua',
                    formula: 'f(x) = |x|',
                    description: 'V forma. Negatiboak positibo bihurtzen ditu.',
                    properties: ['Dom = ℝ', 'Im = [0, +∞)', 'Min (0, 0)'],
                    color: 'amber',
                    funcKey: 'abs',
                  },
                  {
                    name: 'Erro Karratua',
                    formula: 'f(x) = √x',
                    description: 'Poliki hazten den kurba. x < 0 ezin du hartu.',
                    properties: ['Dom = [0, +∞)', 'Im = [0, +∞)', 'Beti gorakorra'],
                    color: 'emerald',
                    funcKey: 'sqrt',
                  },
                  {
                    name: 'Alderantzizkoa (Hiperbola)',
                    formula: 'f(x) = 1/x',
                    description: 'Bi adar. x = 0 eta y = 0 asintota ditu.',
                    properties: ['Dom = ℝ - {0}', 'Im = ℝ - {0}', 'Beti beherakorra (adar bakoitzean)'],
                    color: 'pink',
                    funcKey: 'inverse',
                  },
                ].map((fn, i) => (
                  <div key={i} className={`bg-${fn.color}-50 border border-${fn.color}-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow`}>
                    <div className={`p-5`}>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{fn.name}</h3>
                      <p className="font-mono text-xl font-bold text-slate-700 mb-2">{fn.formula}</p>
                      <p className="text-sm text-slate-600 mb-3">{fn.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {fn.properties.map((prop, j) => (
                          <span key={j} className="text-xs font-mono bg-white px-2 py-1 rounded-full border border-slate-200 text-slate-600">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Mini graph */}
                    <div className="border-t border-slate-200 bg-white p-2">
                      <FunctionGraph
                        funcType={fn.funcKey}
                        params={Object.fromEntries(FUNCTIONS[fn.funcKey].params.map(p => [p.key, p.default]))}
                        showGrid={false}
                        showAnalysis={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-rose-200 ring-4 ring-rose-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-rose-50 border border-rose-100 px-6 py-2 rounded-full text-sm font-bold text-rose-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'domain' ? 'Eremua' :
                         problem.type === 'image' ? 'Irudia kalkulatu' :
                         problem.type === 'intercept' ? 'Y-ebakidura' :
                         problem.type === 'growth' ? 'Malda' :
                         'Ebaluatu funtzioa'}
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
                          step="0.1"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors text-lg font-bold"
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
                            {feedback === 'correct' ? 'Bikain! Hori da.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             'Saiatu berriro...'}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Pista bat?
                          </button>
                        )}
                      </div>
                    )}

                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                        <strong>Pista:</strong> {problem.hint}
                      </div>
                    )}

                    <div className="flex gap-4 justify-center mt-6">
                      <button
                        onClick={checkAnswer}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0"
                      >
                        Egiaztatu
                      </button>
                      {feedback === 'correct' && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-500 transition-all flex items-center gap-2 animate-in fade-in"
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

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
