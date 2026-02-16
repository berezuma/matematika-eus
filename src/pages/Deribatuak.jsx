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
  Gauge,
  Rocket,
  BarChart3
} from 'lucide-react';

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

// --- Function library ---

const FUNC_LIB = {
  quadratic: {
    label: 'x²',
    f: (x) => x * x,
    df: (x) => 2 * x,
    fLabel: 'f(x) = x²',
    dfLabel: "f'(x) = 2x",
    color: '#ef4444',
  },
  cubic: {
    label: 'x³',
    f: (x) => x * x * x,
    df: (x) => 3 * x * x,
    fLabel: 'f(x) = x³',
    dfLabel: "f'(x) = 3x²",
    color: '#8b5cf6',
  },
  sin: {
    label: 'sin(x)',
    f: (x) => Math.sin(x),
    df: (x) => Math.cos(x),
    fLabel: 'f(x) = sin(x)',
    dfLabel: "f'(x) = cos(x)",
    color: '#3b82f6',
  },
  cos: {
    label: 'cos(x)',
    f: (x) => Math.cos(x),
    df: (x) => -Math.sin(x),
    fLabel: 'f(x) = cos(x)',
    dfLabel: "f'(x) = -sin(x)",
    color: '#06b6d4',
  },
  exp: {
    label: 'eˣ',
    f: (x) => Math.exp(x),
    df: (x) => Math.exp(x),
    fLabel: 'f(x) = eˣ',
    dfLabel: "f'(x) = eˣ",
    color: '#f59e0b',
  },
  ln: {
    label: 'ln(x)',
    f: (x) => x > 0 ? Math.log(x) : NaN,
    df: (x) => x > 0 ? 1 / x : NaN,
    fLabel: 'f(x) = ln(x)',
    dfLabel: "f'(x) = 1/x",
    color: '#10b981',
  },
  sqrt: {
    label: '√x',
    f: (x) => x >= 0 ? Math.sqrt(x) : NaN,
    df: (x) => x > 0 ? 1 / (2 * Math.sqrt(x)) : NaN,
    fLabel: 'f(x) = √x',
    dfLabel: "f'(x) = 1/(2√x)",
    color: '#ec4899',
  },
};

// --- Tangent Line Visualizer ---

const TangentVisualizer = () => {
  const canvasRef = useRef(null);
  const [funcKey, setFuncKey] = useState('quadratic');
  const [xPoint, setXPoint] = useState(1);
  const [showDerivative, setShowDerivative] = useState(false);

  const fn = FUNC_LIB[funcKey];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 40;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

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
      ctx.fillText(i.toString(), cx + i * scale, cy + 14);
    }

    // Draw function
    ctx.strokeStyle = fn.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let drawing = false;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      const y = fn.f(x);
      if (isNaN(y) || !isFinite(y) || Math.abs(y) > 50) { drawing = false; continue; }
      const py = cy - y * scale;
      if (py < -100 || py > h + 100) { drawing = false; continue; }
      if (!drawing) { ctx.moveTo(px, py); drawing = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw derivative function
    if (showDerivative) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      drawing = false;
      for (let px = 0; px < w; px++) {
        const x = (px - cx) / scale;
        const y = fn.df(x);
        if (isNaN(y) || !isFinite(y) || Math.abs(y) > 50) { drawing = false; continue; }
        const py = cy - y * scale;
        if (py < -100 || py > h + 100) { drawing = false; continue; }
        if (!drawing) { ctx.moveTo(px, py); drawing = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Tangent line at xPoint
    const yPoint = fn.f(xPoint);
    const slope = fn.df(xPoint);

    if (!isNaN(yPoint) && isFinite(yPoint) && !isNaN(slope) && isFinite(slope)) {
      const ptPx = cx + xPoint * scale;
      const ptPy = cy - yPoint * scale;

      // Draw tangent line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const tangentLen = 150;
      const dx = tangentLen / Math.sqrt(1 + slope * slope);
      const dy = slope * dx;
      ctx.moveTo(ptPx - dx, ptPy + dy * scale / scale + dy);
      // Use parametric: y - yPoint = slope * (x - xPoint)
      for (let t = -4; t <= 4; t += 0.1) {
        const tx = xPoint + t;
        const ty = yPoint + slope * t;
        const tpx = cx + tx * scale;
        const tpy = cy - ty * scale;
        if (tpx < -10 || tpx > w + 10 || tpy < -50 || tpy > h + 50) continue;
        if (t === -4) ctx.moveTo(tpx, tpy);
        else ctx.lineTo(tpx, tpy);
      }
      ctx.stroke();

      // Point on curve
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(ptPx, ptPy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`(${xPoint.toFixed(1)}, ${yPoint.toFixed(2)})`, ptPx + 12, ptPy - 12);

      // Slope label
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`malda = ${slope.toFixed(2)}`, ptPx + 12, ptPy + 20);
    }

  }, [funcKey, xPoint, showDerivative, fn]);

  const yVal = fn.f(xPoint);
  const slopeVal = fn.df(xPoint);

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
          <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto" />
        </div>

        <div className="space-y-4">
          {/* Formula */}
          <div className="bg-slate-900 text-white p-4 rounded-xl text-center space-y-1">
            <p className="font-mono text-sm" style={{ color: fn.color }}>{fn.fLabel}</p>
            <p className="font-mono text-sm text-emerald-400">{fn.dfLabel}</p>
          </div>

          {/* X slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-red-600 uppercase">Puntua (x)</label>
              <span className="text-xs font-mono bg-red-100 text-red-700 px-2 rounded font-bold">{xPoint.toFixed(1)}</span>
            </div>
            <input
              type="range" min="-4" max="4" step="0.1"
              value={xPoint}
              onChange={(e) => setXPoint(parseFloat(e.target.value))}
              className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Values */}
          <div className="space-y-2">
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
              <span className="text-xs font-bold text-red-600">f({xPoint.toFixed(1)})</span>
              <span className="font-mono font-bold text-red-800">{isNaN(yVal) ? '∄' : yVal.toFixed(3)}</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center">
              <span className="text-xs font-bold text-amber-600">f'({xPoint.toFixed(1)}) = malda</span>
              <span className="font-mono font-bold text-amber-800">{isNaN(slopeVal) ? '∄' : slopeVal.toFixed(3)}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center text-sm">
              {!isNaN(slopeVal) && isFinite(slopeVal) && (
                <span className={`font-bold ${slopeVal > 0.01 ? 'text-emerald-600' : slopeVal < -0.01 ? 'text-red-600' : 'text-amber-600'}`}>
                  {slopeVal > 0.01 ? '↗ Gorakorra' : slopeVal < -0.01 ? '↘ Beherakorra' : '→ Horizontala (muturra?)'}
                </span>
              )}
            </div>
          </div>

          {/* Toggle derivative curve */}
          <button
            onClick={() => setShowDerivative(!showDerivative)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
              showDerivative
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            <TrendingUp size={16} />
            {showDerivative ? "f'(x) kurba: ON" : "f'(x) kurba: OFF"}
          </button>

          <div className="text-xs text-slate-400 space-y-1">
            <p><span className="inline-block w-8 h-0.5 bg-red-500 mr-2 align-middle"></span>f(x)</p>
            <p><span className="inline-block w-8 h-0.5 bg-amber-500 mr-2 align-middle"></span>Zuzen ukitzailea</p>
            {showDerivative && <p><span className="inline-block w-8 h-0.5 bg-emerald-500 mr-2 align-middle border-dashed"></span>f'(x)</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Deribatuak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('deriv');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['power', 'evaluate', 'trig', 'tangent', 'extreme'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'power') {
      const n = Math.floor(Math.random() * 5) + 2;
      const a = Math.floor(Math.random() * 4) + 1;
      prob = {
        type,
        display: `f(x) = ${a === 1 ? '' : a}x${toSup(n)}\nf'(x) = kx${toSup(n - 1)}\nk = ?`,
        solution: a * n,
        hint: `Berreturen erregela: (ax^n)' = a·n·x^(n-1). Beraz k = ${a}·${n} = ${a * n}`
      };
    } else if (type === 'evaluate') {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 7) - 3;
      const x = Math.floor(Math.random() * 5) - 2;
      // f(x) = ax² + bx, f'(x) = 2ax + b
      const result = 2 * a * x + b;
      prob = {
        type,
        display: `f(x) = ${a === 1 ? '' : a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x\nf'(${x}) = ?`,
        solution: result,
        hint: `f'(x) = ${2 * a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}. f'(${x}) = ${2 * a}·(${x}) + (${b}) = ${result}`
      };
    } else if (type === 'trig') {
      const funcs = [
        { q: "f(x) = sin(x)\nf'(x) = ?  x = 0 puntuan", sol: 1, hint: "(sin x)' = cos x. cos(0) = 1" },
        { q: "f(x) = cos(x)\nf'(x) = ?  x = 0 puntuan", sol: 0, hint: "(cos x)' = -sin x. -sin(0) = 0" },
        { q: "f(x) = sin(x)\nf'(π/2) = ?", sol: 0, hint: "(sin x)' = cos x. cos(π/2) = 0" },
        { q: "f(x) = cos(x)\nf'(π) = ?", sol: 0, hint: "(cos x)' = -sin x. -sin(π) = 0" },
      ];
      const f = funcs[Math.floor(Math.random() * funcs.length)];
      prob = { type, display: f.q, solution: f.sol, hint: f.hint };
    } else if (type === 'tangent') {
      // Tangent line: y = f(a) + f'(a)(x - a), find f'(a)
      const a = Math.floor(Math.random() * 4) + 1;
      // f(x) = x², f'(x) = 2x
      const slope = 2 * a;
      prob = {
        type,
        display: `f(x) = x²\nZuzen ukitzailearen malda x = ${a} puntuan = ?`,
        solution: slope,
        hint: `f'(x) = 2x. f'(${a}) = 2·${a} = ${slope}`
      };
    } else {
      // Find extreme: f(x) = x² + bx, extreme at x = -b/2
      const b = (Math.floor(Math.random() * 5) + 1) * 2;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const bVal = sign * b;
      const extremeX = -bVal / 2;
      prob = {
        type,
        display: `f(x) = x² ${bVal >= 0 ? '+ ' + bVal : '- ' + Math.abs(bVal)}x\nMutur erlatiboaren x balioa = ?`,
        solution: extremeX,
        hint: `f'(x) = 2x ${bVal >= 0 ? '+ ' + bVal : '- ' + Math.abs(bVal)} = 0 → x = ${extremeX}`
      };
    }

    setProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const toSup = (n) => {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return String(n).split('').map(c => map[c] || c).join('');
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-100 selection:text-red-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-red-600 transition-colors ${activeTab === 'concept' ? 'text-red-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-red-600 transition-colors ${activeTab === 'viz' ? 'text-red-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('rules')} className={`hover:text-red-600 transition-colors ${activeTab === 'rules' ? 'text-red-600' : ''}`}>Erregelak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-sm shadow-red-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Deribatuak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Aldaketa-tasa, zuzen ukitzaileak, optimizazioa eta deribazio-erregelak. Kalkuluaren bihotza.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'rules', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-red-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
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
                    <Gauge size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Abiadura</h3>
                  <p className="text-sm text-slate-600">
                    Autoak 100 km/h abiaduran badoa, hori posizioaren deribatua da. Azelerazioa bigarren deribatua da.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Optimizazioa</h3>
                  <p className="text-sm text-slate-600">
                    Enpresa batek irabazi maximoa lortzeko, kostuen funtzioaren deribatua erabiltzen du. Deribatua = 0 denean, muturra aurkitzen da.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                    <Rocket size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Fisika</h3>
                  <p className="text-sm text-slate-600">
                    Newtonen bigarren legea F = ma. Azelerazioa (a) abiaduraren deribatua da. Fisika osoa deribatuen gainean eraikita dago.
                  </p>
                </div>
              </div>
            </Section>

            {/* What is a derivative */}
            <Section title="Zer da deribatu bat?" icon={Layers}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Definizio Formala</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold">
                      f'(x) = lim<sub className="text-sm">h→0</sub>{' '}
                      <span className="text-red-400">f(x+h) - f(x)</span> / <span className="text-amber-400">h</span>
                    </p>
                    <p className="text-slate-400 mt-6 max-w-lg mx-auto">
                      Deribatua <strong className="text-red-300">aldaketa-tasa berehalakoa</strong> da: puntu batean funtzioak zein abiaduraz aldatzen den neurtzen du.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-red-100 rounded-xl p-6">
                    <h3 className="font-bold text-slate-800 mb-3">Interpretazio Geometrikoa</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Deribatua = puntu bateko <strong>zuzen ukitzailearen malda</strong>.
                    </p>
                    <div className="bg-red-50 p-3 rounded-lg text-sm text-red-800">
                      <p>f'(a) &gt; 0 → Funtzioa <strong>gorakorra</strong> da a puntuan</p>
                      <p>f'(a) &lt; 0 → Funtzioa <strong>beherakorra</strong> da a puntuan</p>
                      <p>f'(a) = 0 → <strong>Mutur erlatiboa</strong> izan daiteke</p>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-amber-100 rounded-xl p-6">
                    <h3 className="font-bold text-slate-800 mb-3">Interpretazio Fisikoa</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      s(t) = posizioa denborarekiko bada:
                    </p>
                    <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800 space-y-1">
                      <p>s'(t) = <strong>abiadura</strong> (v)</p>
                      <p>s''(t) = v'(t) = <strong>azelerazioa</strong> (a)</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Intuitiboki:</strong> Deribatua "zenbat aldatzen da y, x pixka bat aldatzean" da. Auto baten abiadura-neurria deribatua da: posizio-aldaketa denbora-aldaketarekiko.</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Optimization intro */}
            <Section title="Optimizazioa: Maximoak eta Minimoak" icon={TrendingUp}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Deribatuen aplikazio praktikoena: <strong>balio onena</strong> aurkitzea.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">3 Urratseko Prozedura</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold text-white mb-2">1</div>
                      <p className="text-sm">Deribatu: f'(x) kalkulatu</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white mb-2">2</div>
                      <p className="text-sm">Ebatzi: f'(x) = 0 → puntu kritikoak</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white mb-2">3</div>
                      <p className="text-sm">Egiaztatu: f''(x) &gt; 0 → Min, f''(x) &lt; 0 → Max</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h4 className="font-bold text-slate-800 mb-2">Adibidea</h4>
                  <div className="font-mono text-sm space-y-1 text-slate-700">
                    <p>f(x) = x² - 4x + 3</p>
                    <p className="text-red-600">f'(x) = 2x - 4</p>
                    <p className="text-orange-600">f'(x) = 0 → 2x - 4 = 0 → x = 2</p>
                    <p className="text-amber-600">f''(x) = 2 &gt; 0 → <strong>Minimoa</strong> x = 2 puntuan</p>
                    <p className="text-emerald-600">f(2) = 4 - 8 + 3 = -1 → Min(2, -1)</p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zuzen Ukitzailea Interaktiboa" icon={TrendingUp}>
              <TangentVisualizer />
            </Section>

          </div>
        )}

        {/* --- SECTION 3: RULES --- */}
        {activeTab === 'rules' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Deribazio Oinarrizko Erregelak" icon={ListOrdered}>
              <div className="space-y-3">
                {[
                  { name: 'Konstantea', formula: "(k)' = 0", example: "(5)' = 0", color: 'slate' },
                  { name: 'Berretura', formula: "(xⁿ)' = n·xⁿ⁻¹", example: "(x⁴)' = 4x³", color: 'red' },
                  { name: 'Koefizientea', formula: "(k·f)' = k·f'", example: "(3x²)' = 3·2x = 6x", color: 'orange' },
                  { name: 'Batuketa', formula: "(f + g)' = f' + g'", example: "(x² + x)' = 2x + 1", color: 'amber' },
                  { name: 'Biderkadura', formula: "(f·g)' = f'·g + f·g'", example: "(x·sin x)' = sin x + x·cos x", color: 'yellow' },
                  { name: 'Zatidura', formula: "(f/g)' = (f'·g - f·g') / g²", example: "(x/eˣ)' = (eˣ - x·eˣ) / e²ˣ", color: 'lime' },
                  { name: 'Kate-erregela', formula: "(f(g(x)))' = f'(g(x))·g'(x)", example: "(sin(x²))' = cos(x²)·2x", color: 'green' },
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

            <Section title="Funtzio Berezien Deribatuak" icon={Layers}>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { f: 'sin(x)', df: 'cos(x)', color: 'blue' },
                  { f: 'cos(x)', df: '-sin(x)', color: 'cyan' },
                  { f: 'tan(x)', df: '1/cos²(x)', color: 'teal' },
                  { f: 'eˣ', df: 'eˣ', color: 'amber' },
                  { f: 'ln(x)', df: '1/x', color: 'emerald' },
                  { f: 'aˣ', df: 'aˣ · ln(a)', color: 'orange' },
                  { f: '√x', df: '1 / (2√x)', color: 'pink' },
                  { f: 'log_a(x)', df: '1 / (x · ln(a))', color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 bg-${item.color}-50 border border-${item.color}-100 rounded-xl`}>
                    <div className="font-mono font-bold text-slate-700 flex-1 text-right">{item.f}</div>
                    <div className="text-slate-400">→</div>
                    <div className={`font-mono font-bold text-${item.color}-700 flex-1`}>{item.df}</div>
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
                  <div className="bg-red-50 border border-red-100 px-6 py-2 rounded-full text-sm font-bold text-red-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{total}</span>
                    {total > 0 && <span className="text-xs opacity-60">({Math.round((score / total) * 100)}%)</span>}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'power' ? 'Berreturen erregela' :
                         problem.type === 'evaluate' ? 'Ebaluatu deribatua' :
                         problem.type === 'trig' ? 'Funtzio trigonometrikoa' :
                         problem.type === 'tangent' ? 'Zuzen ukitzailea' :
                         'Mutur erlatiboa'}
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
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-lg font-bold"
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
                          className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-500 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
