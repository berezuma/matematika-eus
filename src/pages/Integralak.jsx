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
  Ruler,
  Droplets,
  Zap,
  AreaChart
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-red-100 text-red-700 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Function library for integrals ---

const FUNC_LIB = {
  linear: {
    label: 'x + 1',
    f: (x) => x + 1,
    F: (x) => x * x / 2 + x,
    fLabel: 'f(x) = x + 1',
    FLabel: 'F(x) = x²/2 + x',
    color: '#ef4444',
  },
  quadratic: {
    label: 'x²',
    f: (x) => x * x,
    F: (x) => x * x * x / 3,
    fLabel: 'f(x) = x²',
    FLabel: 'F(x) = x³/3',
    color: '#8b5cf6',
  },
  cubic: {
    label: 'x³',
    f: (x) => x * x * x,
    F: (x) => x * x * x * x / 4,
    fLabel: 'f(x) = x³',
    FLabel: 'F(x) = x⁴/4',
    color: '#06b6d4',
  },
  sin: {
    label: 'sin(x)',
    f: (x) => Math.sin(x),
    F: (x) => -Math.cos(x),
    fLabel: 'f(x) = sin(x)',
    FLabel: 'F(x) = -cos(x)',
    color: '#3b82f6',
  },
  cos: {
    label: 'cos(x)',
    f: (x) => Math.cos(x),
    F: (x) => Math.sin(x),
    fLabel: 'f(x) = cos(x)',
    FLabel: 'F(x) = sin(x)',
    color: '#10b981',
  },
  exp: {
    label: 'eˣ',
    f: (x) => Math.exp(x),
    F: (x) => Math.exp(x),
    fLabel: 'f(x) = eˣ',
    FLabel: 'F(x) = eˣ',
    color: '#f59e0b',
  },
  sqrt: {
    label: '√x',
    f: (x) => x >= 0 ? Math.sqrt(x) : NaN,
    F: (x) => x >= 0 ? (2 / 3) * Math.pow(x, 1.5) : NaN,
    fLabel: 'f(x) = √x',
    FLabel: 'F(x) = ⅔·x^(3/2)',
    color: '#ec4899',
  },
};

// --- Area Under Curve Visualizer ---

const AreaVisualizer = () => {
  const canvasRef = useRef(null);
  const [funcKey, setFuncKey] = useState('quadratic');
  const [aVal, setAVal] = useState(0);
  const [bVal, setBVal] = useState(2);
  const [numRects, setNumRects] = useState(10);
  const [showRiemann, setShowRiemann] = useState(true);

  const fn = FUNC_LIB[funcKey];

  // Compute definite integral
  const exactArea = fn.F(bVal) - fn.F(aVal);

  // Riemann sum
  const riemannSum = (() => {
    const dx = (bVal - aVal) / numRects;
    let sum = 0;
    for (let i = 0; i < numRects; i++) {
      const x = aVal + (i + 0.5) * dx; // midpoint
      const y = fn.f(x);
      if (!isNaN(y) && isFinite(y)) sum += y * dx;
    }
    return sum;
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = 60;
    const cy = h * 0.7;
    const scaleX = (w - 80) / 8;
    const scaleY = scaleX;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = cx; x < w; x += scaleX) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += scaleY) {
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
    for (let i = -1; i <= 7; i++) {
      if (i === 0) continue;
      const px = cx + i * scaleX;
      if (px > 10 && px < w - 10) ctx.fillText(i.toString(), px, cy + 14);
    }

    // Riemann rectangles
    if (showRiemann && bVal > aVal) {
      const dx = (bVal - aVal) / numRects;
      for (let i = 0; i < numRects; i++) {
        const x = aVal + i * dx;
        const xMid = x + dx / 2;
        const y = fn.f(xMid);
        if (isNaN(y) || !isFinite(y)) continue;

        const px = cx + x * scaleX;
        const pw = dx * scaleX;
        const barH = y * scaleY;
        const py = cy - barH;

        ctx.fillStyle = y >= 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)';
        ctx.strokeStyle = y >= 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1;
        ctx.fillRect(px, Math.min(cy, py), pw, Math.abs(barH));
        ctx.strokeRect(px, Math.min(cy, py), pw, Math.abs(barH));
      }
    }

    // Filled area (exact)
    if (!showRiemann && bVal > aVal) {
      ctx.beginPath();
      ctx.moveTo(cx + aVal * scaleX, cy);
      for (let px = cx + aVal * scaleX; px <= cx + bVal * scaleX; px++) {
        const x = (px - cx) / scaleX;
        const y = fn.f(x);
        if (isNaN(y) || !isFinite(y)) continue;
        ctx.lineTo(px, cy - y * scaleY);
      }
      ctx.lineTo(cx + bVal * scaleX, cy);
      ctx.closePath();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fill();
    }

    // Draw function curve
    ctx.strokeStyle = fn.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let drawing = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scaleX;
      const y = fn.f(x);
      if (isNaN(y) || !isFinite(y) || Math.abs(y) > 30) { drawing = false; continue; }
      const py = cy - y * scaleY;
      if (py < -100 || py > h + 100) { drawing = false; continue; }
      if (!drawing) { ctx.moveTo(px, py); drawing = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Bound markers
    [aVal, bVal].forEach((val, idx) => {
      const px = cx + val * scaleX;
      ctx.strokeStyle = idx === 0 ? '#3b82f6' : '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(px, 0); ctx.lineTo(px, h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = idx === 0 ? '#3b82f6' : '#10b981';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(idx === 0 ? `a=${val}` : `b=${val}`, px, 16);
    });

  }, [funcKey, aVal, bVal, numRects, showRiemann, fn]);

  return (
    <div className="space-y-6">
      {/* Function selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(FUNC_LIB).map(([key, f]) => (
          <button
            key={key}
            onClick={() => setFuncKey(key)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              funcKey === key
                ? 'text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-red-300'
            }`}
            style={funcKey === key ? { backgroundColor: f.color } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
          <canvas ref={canvasRef} width={650} height={400} className="w-full h-auto" />
        </div>

        <div className="space-y-4">
          {/* Formula */}
          <div className="bg-slate-900 text-white p-4 rounded-xl text-center space-y-1">
            <p className="font-mono text-sm" style={{ color: fn.color }}>{fn.fLabel}</p>
            <p className="font-mono text-sm text-emerald-400">{fn.FLabel}</p>
          </div>

          {/* Sliders */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-blue-600 uppercase">a (beheko muga)</label>
              <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 rounded font-bold">{aVal}</span>
            </div>
            <input
              type="range" min="-2" max="5" step="0.5"
              value={aVal}
              onChange={(e) => { const v = parseFloat(e.target.value); setAVal(v); if (v >= bVal) setBVal(v + 0.5); }}
              className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-emerald-600 uppercase">b (goiko muga)</label>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 rounded font-bold">{bVal}</span>
            </div>
            <input
              type="range" min="-1.5" max="6" step="0.5"
              value={bVal}
              onChange={(e) => { const v = parseFloat(e.target.value); setBVal(v); if (v <= aVal) setAVal(v - 0.5); }}
              className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {showRiemann && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold text-red-600 uppercase">Laukizuzen kopurua</label>
                <span className="text-xs font-mono bg-red-100 text-red-700 px-2 rounded font-bold">{numRects}</span>
              </div>
              <input
                type="range" min="2" max="100" step="1"
                value={numRects}
                onChange={(e) => setNumRects(parseInt(e.target.value))}
                className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Toggle */}
          <button
            onClick={() => setShowRiemann(!showRiemann)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
              showRiemann
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {showRiemann ? 'Riemann laukizuzenak' : 'Azalera zehatza'}
          </button>

          {/* Results */}
          <div className="space-y-2">
            {showRiemann && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs font-bold text-red-600">Riemann batura</span>
                <span className="font-mono font-bold text-red-800">{riemannSum.toFixed(4)}</span>
              </div>
            )}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-600">∫ zehatza</span>
              <span className="font-mono font-bold text-emerald-800">{isNaN(exactArea) ? '∄' : exactArea.toFixed(4)}</span>
            </div>
            {showRiemann && !isNaN(exactArea) && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs font-bold text-amber-600">Errorea</span>
                <span className="font-mono font-bold text-amber-800">{Math.abs(riemannSum - exactArea).toFixed(4)}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
            Laukizuzen gehiago → Riemann batura integralera hurbildu. Hori da kalkuluaren oinarria!
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Integralak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('integ');

  useEffect(() => { generateProblem(); }, []);

  const toSup = (n) => {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return String(n).split('').map(c => map[c] || c).join('');
  };

  const generateProblem = () => {
    const types = ['antiderivative', 'definite', 'power', 'area'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'antiderivative') {
      const n = Math.floor(Math.random() * 4) + 1;
      const a = Math.floor(Math.random() * 4) + 1;
      // ∫ a·x^n dx = a·x^(n+1)/(n+1), coefficient of x^(n+1)
      const coeff = a / (n + 1);
      prob = {
        type,
        display: `∫ ${a === 1 ? '' : a}x${toSup(n)} dx = k·x${toSup(n + 1)} + C\nk = ? (zatiki gisa: zenbakitzailea / izendatzailea)`,
        solution: Math.round(coeff * 1000) / 1000,
        hint: `∫ ${a}x${toSup(n)} dx = ${a}·x${toSup(n + 1)}/${n + 1} + C = ${a}/${n + 1}·x${toSup(n + 1)} + C. k = ${a}/${n + 1} = ${coeff.toFixed(3)}`
      };
    } else if (type === 'definite') {
      // ∫₀ᵇ x dx = b²/2
      const b = Math.floor(Math.random() * 5) + 1;
      const result = (b * b) / 2;
      prob = {
        type,
        display: `∫₀${toSup(b)} x dx = ?`,
        solution: result,
        hint: `∫ x dx = x²/2. [x²/2]₀${toSup(b)} = ${b}²/2 - 0²/2 = ${b * b}/2 = ${result}`
      };
    } else if (type === 'power') {
      // ∫₀ᵇ x² dx = b³/3
      const b = Math.floor(Math.random() * 3) + 1;
      const result = Math.round((b * b * b / 3) * 1000) / 1000;
      prob = {
        type,
        display: `∫₀${toSup(b)} x² dx = ?`,
        solution: result,
        hint: `∫ x² dx = x³/3. [x³/3]₀${toSup(b)} = ${b}³/3 = ${b * b * b}/3 = ${result}`
      };
    } else {
      // Area: ∫₁³ (2x) dx
      const a = Math.floor(Math.random() * 2) + 1;
      const b = a + Math.floor(Math.random() * 3) + 1;
      const k = Math.floor(Math.random() * 3) + 1;
      // ∫ kx dx = kx²/2
      const result = k * (b * b - a * a) / 2;
      prob = {
        type,
        display: `f(x) = ${k === 1 ? '' : k}x\nAzalera [${a}, ${b}] tartean = ?`,
        solution: result,
        hint: `∫${toSup(a)}${toSup(b)} ${k}x dx = ${k}·[x²/2]${toSup(a)}${toSup(b)} = ${k}·(${b}²/2 - ${a}²/2) = ${k}·${(b * b - a * a) / 2} = ${result}`
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
    if (Math.abs(val - problem.solution) < 0.05) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

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
            <button onClick={() => setActiveTab('concept')} className={`hover:text-red-700 transition-colors ${activeTab === 'concept' ? 'text-red-700' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-red-700 transition-colors ${activeTab === 'viz' ? 'text-red-700' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('rules')} className={`hover:text-red-700 transition-colors ${activeTab === 'rules' ? 'text-red-700' : ''}`}>Erregelak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-all shadow-sm shadow-red-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Integralak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Azalerak kurben azpian, jatorrizko funtzioak eta kalkuluaren oinarrizko teorema.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'rules', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-red-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'rules' ? 'Erregelak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zertarako balio du?" icon={BookOpen} className="border-red-200 ring-4 ring-red-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Ruler size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Azalera eta Bolumena</h3>
                  <p className="text-sm text-slate-600">
                    Forma irregularren azalera kalkulatzeko: kurba baten azpiko azalera integrala da. Bolumen ere integralekin kalkulatzen da.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-3">
                    <Droplets size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Fisika</h3>
                  <p className="text-sm text-slate-600">
                    Abiaduratik distantzia kalkulatu: d = ∫v(t)dt. Indarra eta lana, karga elektrikoa... denak integralak dira.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Ingeniaritza</h3>
                  <p className="text-sm text-slate-600">
                    Seinale elektrikoen energia, fluidoen emaria, eguzki-panelen ekoizpena... ingeniaritzaren oinarria.
                  </p>
                </div>
              </div>
            </Section>

            {/* What is an integral */}
            <Section title="Zer da integral bat?" icon={Layers}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-red-500 to-orange-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Integral Mugagabea</p>
                    <p className="text-3xl md:text-4xl font-mono font-bold">
                      ∫ f(x) dx = <span className="text-red-400">F(x)</span> + C
                    </p>
                    <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm">
                      <strong className="text-red-300">Jatorrizko funtzioa</strong>: F'(x) = f(x) betetzen duen funtzioa. Deribazioaren alderantzizko eragiketa.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Integral Mugatua</p>
                    <p className="text-3xl md:text-4xl font-mono font-bold">
                      ∫<sub className="text-blue-400">a</sub><sup className="text-emerald-400">b</sup> f(x) dx = <span className="text-emerald-400">F(b) - F(a)</span>
                    </p>
                    <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm">
                      f(x)-ren grafikoaren azpiko <strong className="text-emerald-300">azalera</strong>, a-tik b-ra.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border-2 border-red-100 rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 mb-2">Deribatua → Integrala</h3>
                    <p className="text-sm text-slate-600 mb-3">Deribatzea eta integratzea alderantzizko eragiketak dira.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm text-center">
                      <p>f(x) = x² <span className="text-slate-400">—deribatu→</span> <span className="text-red-600">2x</span></p>
                      <p>g(x) = 2x <span className="text-slate-400">—integratu→</span> <span className="text-emerald-600">x² + C</span></p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 mb-2">Kalkuluaren Oinarrizko Teorema</h3>
                    <p className="text-sm text-slate-600 mb-3">Azalera kalkulatzeko, jatorrizkoa ebaluatu mugetan.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm text-center">
                      <p>∫₀² x² dx = [x³/3]₀² </p>
                      <p>= 8/3 - 0 = <strong className="text-emerald-700">2.667</strong></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>C konstantea:</strong> Integral mugagabean beti +C gehitu behar da! Deribatzean konstantea desagertzen denez, integratzean "berreskuratu" behar da. Integral mugatuan C desagertzen da (F(b) - F(a) egiterakoan).</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Riemann sum intuition */}
            <Section title="Riemann Batuketak: Intuizioa" icon={AreaChart}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Kurba baten azpiko azalera <strong>laukizuzen txikien baturarekin</strong> hurbiltzen da. Laukizuzenak txikiagoak izan ahala, hurbilketa hobea da.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Ideia nagusia</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl text-center">
                      <p className="text-3xl font-bold text-red-400 mb-2">n = 4</p>
                      <p className="text-sm text-slate-300">Hurbilketa latza</p>
                      <p className="text-xs text-slate-500 mt-1">Errore handia</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl text-center">
                      <p className="text-3xl font-bold text-amber-400 mb-2">n = 20</p>
                      <p className="text-sm text-slate-300">Hurbilketa ona</p>
                      <p className="text-xs text-slate-500 mt-1">Errore txikia</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl text-center">
                      <p className="text-3xl font-bold text-emerald-400 mb-2">n → ∞</p>
                      <p className="text-sm text-slate-300">Balio zehatza</p>
                      <p className="text-xs text-slate-500 mt-1">= Integrala</p>
                    </div>
                  </div>
                  <p className="text-center text-slate-400 mt-4 font-mono text-sm">
                    ∫ₐᵇ f(x) dx = lim<sub>n→∞</sub> Σ f(xᵢ)·Δx
                  </p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Azalera Bisualizatzailea" icon={AreaChart}>
              <AreaVisualizer />
            </Section>

          </div>
        )}

        {/* --- SECTION 3: RULES --- */}
        {activeTab === 'rules' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Integrazio Oinarrizko Erregelak" icon={ListOrdered}>
              <div className="space-y-3">
                {[
                  { name: 'Konstantea', formula: '∫ k dx = kx + C', example: '∫ 5 dx = 5x + C', color: 'slate' },
                  { name: 'Berretura', formula: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C', example: '∫ x³ dx = x⁴/4 + C', color: 'red' },
                  { name: 'Koefizientea', formula: '∫ k·f dx = k · ∫ f dx', example: '∫ 3x² dx = 3 · x³/3 = x³ + C', color: 'orange' },
                  { name: 'Batuketa', formula: '∫ (f + g) dx = ∫ f dx + ∫ g dx', example: '∫ (x² + x) dx = x³/3 + x²/2 + C', color: 'amber' },
                  { name: '1/x', formula: '∫ 1/x dx = ln|x| + C', example: '∫₁² 1/x dx = ln 2 ≈ 0.693', color: 'yellow' },
                  { name: 'Esponentziala', formula: '∫ eˣ dx = eˣ + C', example: '∫₀¹ eˣ dx = e - 1 ≈ 1.718', color: 'lime' },
                ].map((r, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-${r.color}-50 border border-${r.color}-100 hover:border-${r.color}-300 transition-colors`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="md:w-32 shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase">{r.name}</span>
                      </div>
                      <div className="flex-1 font-mono text-lg font-bold text-slate-700">{r.formula}</div>
                      <div className="flex-1">
                        <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm text-slate-600">
                          {r.example}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Funtzio Berezien Integralak" icon={Layers}>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { f: 'sin(x)', F: '-cos(x) + C', color: 'blue' },
                  { f: 'cos(x)', F: 'sin(x) + C', color: 'cyan' },
                  { f: '1/cos²(x)', F: 'tan(x) + C', color: 'teal' },
                  { f: 'eˣ', F: 'eˣ + C', color: 'amber' },
                  { f: '1/x', F: 'ln|x| + C', color: 'emerald' },
                  { f: 'aˣ', F: 'aˣ / ln(a) + C', color: 'orange' },
                  { f: '1/√x', F: '2√x + C', color: 'pink' },
                  { f: 'xⁿ (n≠-1)', F: 'xⁿ⁺¹/(n+1) + C', color: 'red' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 bg-${item.color}-50 border border-${item.color}-100 rounded-xl`}>
                    <div className="font-mono font-bold text-slate-700 flex-1 text-right">∫ {item.f} dx</div>
                    <div className="text-slate-400">=</div>
                    <div className={`font-mono font-bold text-${item.color}-700 flex-1`}>{item.F}</div>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-red-200 ring-4 ring-red-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-red-50 border border-red-100 px-6 py-2 rounded-full text-sm font-bold text-red-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'antiderivative' ? 'Jatorrizko funtzioa' :
                         problem.type === 'definite' ? 'Integral mugatua' :
                         problem.type === 'power' ? 'Berreturen erregela' :
                         'Azalera kalkulatu'}
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
                          step="0.001"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-red-600 focus:outline-none transition-colors text-lg font-bold"
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
                          className="px-8 py-3 bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
