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
  Shapes,
  Box,
  Ruler,
  Building2,
  Paintbrush,
  Warehouse,
  ListOrdered,
  Calculator,
  X
} from 'lucide-react';

// --- Utility ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

const formatNum = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
};

const PI = Math.PI;

// --- 2D Shape Data ---

const SHAPES_2D = [
  {
    id: 'triangle',
    name: 'Triangelua',
    icon: '△',
    color: 'amber',
    params: [
      { key: 'b', label: 'Oinarria (b)', default: 6 },
      { key: 'h', label: 'Altuera (h)', default: 4 },
    ],
    area: (p) => (p.b * p.h) / 2,
    perimeter: null,
    areaFormula: 'A = (b × h) / 2',
    perimeterFormula: null,
    draw: (ctx, p, cx, cy, scale) => {
      const bw = p.b * scale;
      const hh = p.h * scale;
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2, cy + hh / 2);
      ctx.lineTo(cx + bw / 2, cy + hh / 2);
      ctx.lineTo(cx, cy - hh / 2);
      ctx.closePath();
    }
  },
  {
    id: 'rectangle',
    name: 'Laukizuzena',
    icon: '▭',
    color: 'blue',
    params: [
      { key: 'a', label: 'Zabalera (a)', default: 6 },
      { key: 'b', label: 'Altuera (b)', default: 4 },
    ],
    area: (p) => p.a * p.b,
    perimeter: (p) => 2 * (p.a + p.b),
    areaFormula: 'A = a × b',
    perimeterFormula: 'P = 2(a + b)',
    draw: (ctx, p, cx, cy, scale) => {
      const w = p.a * scale;
      const h = p.b * scale;
      ctx.beginPath();
      ctx.rect(cx - w / 2, cy - h / 2, w, h);
    }
  },
  {
    id: 'square',
    name: 'Karratua',
    icon: '□',
    color: 'indigo',
    params: [
      { key: 'a', label: 'Aldea (a)', default: 5 },
    ],
    area: (p) => p.a * p.a,
    perimeter: (p) => 4 * p.a,
    areaFormula: 'A = a²',
    perimeterFormula: 'P = 4a',
    draw: (ctx, p, cx, cy, scale) => {
      const s = p.a * scale;
      ctx.beginPath();
      ctx.rect(cx - s / 2, cy - s / 2, s, s);
    }
  },
  {
    id: 'circle',
    name: 'Zirkulua',
    icon: '○',
    color: 'emerald',
    params: [
      { key: 'r', label: 'Erradioa (r)', default: 4 },
    ],
    area: (p) => PI * p.r * p.r,
    perimeter: (p) => 2 * PI * p.r,
    areaFormula: 'A = π × r²',
    perimeterFormula: 'P = 2πr',
    draw: (ctx, p, cx, cy, scale) => {
      ctx.beginPath();
      ctx.arc(cx, cy, p.r * scale, 0, 2 * PI);
    }
  },
  {
    id: 'trapezoid',
    name: 'Trapezioa',
    icon: '⏢',
    color: 'rose',
    params: [
      { key: 'a', label: 'Oinarri handia (a)', default: 8 },
      { key: 'b', label: 'Oinarri txikia (b)', default: 4 },
      { key: 'h', label: 'Altuera (h)', default: 4 },
    ],
    area: (p) => ((p.a + p.b) * p.h) / 2,
    perimeter: null,
    areaFormula: 'A = (a + b) × h / 2',
    perimeterFormula: null,
    draw: (ctx, p, cx, cy, scale) => {
      const aw = p.a * scale;
      const bw = p.b * scale;
      const hh = p.h * scale;
      ctx.beginPath();
      ctx.moveTo(cx - aw / 2, cy + hh / 2);
      ctx.lineTo(cx + aw / 2, cy + hh / 2);
      ctx.lineTo(cx + bw / 2, cy - hh / 2);
      ctx.lineTo(cx - bw / 2, cy - hh / 2);
      ctx.closePath();
    }
  },
  {
    id: 'rhombus',
    name: 'Erronboa',
    icon: '◇',
    color: 'purple',
    params: [
      { key: 'D', label: 'Diagonal handia (D)', default: 8 },
      { key: 'd', label: 'Diagonal txikia (d)', default: 5 },
    ],
    area: (p) => (p.D * p.d) / 2,
    perimeter: null,
    areaFormula: 'A = (D × d) / 2',
    perimeterFormula: null,
    draw: (ctx, p, cx, cy, scale) => {
      const dw = p.D * scale / 2;
      const dh = p.d * scale / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - dh);
      ctx.lineTo(cx + dw, cy);
      ctx.lineTo(cx, cy + dh);
      ctx.lineTo(cx - dw, cy);
      ctx.closePath();
    }
  },
];

// --- 3D Shape Data ---

const SHAPES_3D = [
  {
    id: 'cube',
    name: 'Kuboa',
    icon: '⬜',
    color: 'amber',
    params: [{ key: 'a', label: 'Aldea (a)', default: 4 }],
    volume: (p) => Math.pow(p.a, 3),
    surface: (p) => 6 * p.a * p.a,
    volumeFormula: 'V = a³',
    surfaceFormula: 'S = 6a²',
  },
  {
    id: 'rectangular',
    name: 'Ortoedro',
    icon: '📦',
    color: 'blue',
    params: [
      { key: 'a', label: 'Luzera (a)', default: 5 },
      { key: 'b', label: 'Zabalera (b)', default: 3 },
      { key: 'c', label: 'Altuera (c)', default: 4 },
    ],
    volume: (p) => p.a * p.b * p.c,
    surface: (p) => 2 * (p.a * p.b + p.b * p.c + p.a * p.c),
    volumeFormula: 'V = a × b × c',
    surfaceFormula: 'S = 2(ab + bc + ac)',
  },
  {
    id: 'sphere',
    name: 'Esfera',
    icon: '🔵',
    color: 'emerald',
    params: [{ key: 'r', label: 'Erradioa (r)', default: 4 }],
    volume: (p) => (4 / 3) * PI * Math.pow(p.r, 3),
    surface: (p) => 4 * PI * p.r * p.r,
    volumeFormula: 'V = (4/3)πr³',
    surfaceFormula: 'S = 4πr²',
  },
  {
    id: 'cylinder',
    name: 'Zilindroa',
    icon: '🥫',
    color: 'violet',
    params: [
      { key: 'r', label: 'Erradioa (r)', default: 3 },
      { key: 'h', label: 'Altuera (h)', default: 7 },
    ],
    volume: (p) => PI * p.r * p.r * p.h,
    surface: (p) => 2 * PI * p.r * (p.r + p.h),
    volumeFormula: 'V = πr²h',
    surfaceFormula: 'S = 2πr(r + h)',
  },
  {
    id: 'cone',
    name: 'Konoa',
    icon: '🔺',
    color: 'rose',
    params: [
      { key: 'r', label: 'Erradioa (r)', default: 3 },
      { key: 'h', label: 'Altuera (h)', default: 6 },
    ],
    volume: (p) => (1 / 3) * PI * p.r * p.r * p.h,
    surface: (p) => {
      const g = Math.sqrt(p.r * p.r + p.h * p.h);
      return PI * p.r * (p.r + g);
    },
    volumeFormula: 'V = (1/3)πr²h',
    surfaceFormula: 'S = πr(r + g)',
  },
  {
    id: 'pyramid',
    name: 'Piramidea (oinarri karratua)',
    icon: '🔻',
    color: 'orange',
    params: [
      { key: 'a', label: 'Oinarriaren aldea (a)', default: 5 },
      { key: 'h', label: 'Altuera (h)', default: 7 },
    ],
    volume: (p) => (1 / 3) * p.a * p.a * p.h,
    surface: (p) => {
      const apothem = Math.sqrt((p.a / 2) * (p.a / 2) + p.h * p.h);
      return p.a * p.a + 2 * p.a * apothem;
    },
    volumeFormula: 'V = (1/3)a²h',
    surfaceFormula: 'S = a² + 2a·apotema',
  },
];

// --- Shape Canvas (2D preview) ---

const ShapeCanvas = ({ shape, params }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shape) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = '#e2e8f0';
    for (let x = 0; x < w; x += 20) {
      for (let y = 0; y < h; y += 20) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const cx = w / 2;
    const cy = h / 2;
    const maxDim = Math.max(...Object.values(params));
    const scale = Math.min(120 / maxDim, 25);

    // Draw shape
    shape.draw(ctx, params, cx, cy, scale);

    // Fill
    const colorMap = {
      amber: 'rgba(245, 158, 11, 0.15)',
      blue: 'rgba(59, 130, 246, 0.15)',
      indigo: 'rgba(99, 102, 241, 0.15)',
      emerald: 'rgba(16, 185, 129, 0.15)',
      rose: 'rgba(244, 63, 94, 0.15)',
      purple: 'rgba(168, 85, 247, 0.15)',
    };
    const strokeMap = {
      amber: '#f59e0b',
      blue: '#3b82f6',
      indigo: '#6366f1',
      emerald: '#10b981',
      rose: '#f43f5e',
      purple: '#a855f7',
    };
    ctx.fillStyle = colorMap[shape.color] || 'rgba(100,100,100,0.1)';
    ctx.fill();
    ctx.strokeStyle = strokeMap[shape.color] || '#666';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [shape, params]);

  if (!shape || !shape.draw) return null;

  return (
    <canvas ref={canvasRef} width={300} height={250} className="w-full max-w-[300px] h-auto rounded-lg border border-slate-200 bg-white mx-auto" />
  );
};

// --- 2D Calculator ---

const Calculator2D = () => {
  const [selectedId, setSelectedId] = useState('rectangle');
  const [params, setParams] = useState({});

  const shape = SHAPES_2D.find(s => s.id === selectedId);

  useEffect(() => {
    if (shape) {
      const defaults = {};
      shape.params.forEach(p => { defaults[p.key] = p.default; });
      setParams(defaults);
    }
  }, [selectedId]);

  const area = shape ? shape.area(params) : 0;
  const perimeter = shape?.perimeter ? shape.perimeter(params) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {SHAPES_2D.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${
              selectedId === s.id
                ? `bg-${s.color}-500 text-white shadow-lg shadow-${s.color}-200`
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            <span>{s.icon}</span> {s.name}
          </button>
        ))}
      </div>

      {shape && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ShapeCanvas shape={shape} params={params} />
          </div>

          <div className="space-y-4">
            {/* Parameters */}
            {shape.params.map(p => (
              <div key={p.key}>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{p.label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={params[p.key] || p.default}
                    onChange={(e) => setParams({ ...params, [p.key]: parseFloat(e.target.value) })}
                    className="flex-1 accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-mono font-bold w-10 text-right text-slate-700">{params[p.key]}</span>
                </div>
              </div>
            ))}

            {/* Formulas */}
            <div className={`bg-${shape.color}-50 border border-${shape.color}-100 rounded-xl p-4 space-y-2`}>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Azalera</p>
                <p className="font-mono text-sm text-slate-600">{shape.areaFormula}</p>
                <p className={`font-mono text-2xl font-bold text-${shape.color}-700`}>{formatNum(area)} u²</p>
              </div>
              {perimeter !== null && (
                <div className="border-t border-slate-200 pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Perimetroa</p>
                  <p className="font-mono text-sm text-slate-600">{shape.perimeterFormula}</p>
                  <p className={`font-mono text-xl font-bold text-${shape.color}-600`}>{formatNum(perimeter)} u</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3D Calculator ---

const Calculator3D = () => {
  const [selectedId, setSelectedId] = useState('cube');
  const [params, setParams] = useState({});

  const shape = SHAPES_3D.find(s => s.id === selectedId);

  useEffect(() => {
    if (shape) {
      const defaults = {};
      shape.params.forEach(p => { defaults[p.key] = p.default; });
      setParams(defaults);
    }
  }, [selectedId]);

  const volume = shape ? shape.volume(params) : 0;
  const surface = shape ? shape.surface(params) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {SHAPES_3D.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${
              selectedId === s.id
                ? `bg-${s.color}-500 text-white shadow-lg shadow-${s.color}-200`
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            <span>{s.icon}</span> {s.name}
          </button>
        ))}
      </div>

      {shape && (
        <div className="space-y-4">
          {/* Parameters */}
          <div className="grid md:grid-cols-2 gap-4">
            {shape.params.map(p => (
              <div key={p.key}>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{p.label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={params[p.key] || p.default}
                    onChange={(e) => setParams({ ...params, [p.key]: parseFloat(e.target.value) })}
                    className={`flex-1 accent-${shape.color}-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer`}
                  />
                  <span className="font-mono font-bold w-10 text-right text-slate-700">{params[p.key]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`bg-${shape.color}-50 border border-${shape.color}-100 rounded-xl p-5`}>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Bolumena</p>
              <p className="font-mono text-sm text-slate-600 mb-1">{shape.volumeFormula}</p>
              <p className={`font-mono text-2xl font-bold text-${shape.color}-700`}>{formatNum(volume)} u³</p>
            </div>
            <div className={`bg-slate-50 border border-slate-200 rounded-xl p-5`}>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Azalera Osoa</p>
              <p className="font-mono text-sm text-slate-600 mb-1">{shape.surfaceFormula}</p>
              <p className="font-mono text-2xl font-bold text-slate-700">{formatNum(surface)} u²</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

export default function AzalerakBolumenak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('area');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const types = ['rect_area', 'rect_perim', 'triangle_area', 'circle_area', 'cube_vol', 'sphere_vol', 'cylinder_vol'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'rect_area') {
      const a = randInt(2, 12);
      const b = randInt(2, 12);
      prob = {
        type, display: `Laukizuzena: a = ${a}, b = ${b}\n\nAzalera = ?`,
        solution: a * b,
        hint: `A = a × b = ${a} × ${b} = ${a * b}`
      };
    } else if (type === 'rect_perim') {
      const a = randInt(2, 12);
      const b = randInt(2, 12);
      prob = {
        type, display: `Laukizuzena: a = ${a}, b = ${b}\n\nPerimetroa = ?`,
        solution: 2 * (a + b),
        hint: `P = 2(a+b) = 2(${a}+${b}) = ${2 * (a + b)}`
      };
    } else if (type === 'triangle_area') {
      const b = randInt(2, 12);
      const h = randInt(2, 12);
      prob = {
        type, display: `Triangelua: oinarria = ${b}, altuera = ${h}\n\nAzalera = ?`,
        solution: (b * h) / 2,
        hint: `A = (b×h)/2 = (${b}×${h})/2 = ${(b * h) / 2}`
      };
    } else if (type === 'circle_area') {
      const r = randInt(1, 8);
      const area = Math.round(PI * r * r * 100) / 100;
      prob = {
        type, display: `Zirkulua: r = ${r}\n\nAzalera = ? (π = 3.14 erabili)`,
        solution: Math.round(3.14 * r * r * 100) / 100,
        hint: `A = π×r² = 3.14×${r}² = 3.14×${r * r} = ${(3.14 * r * r).toFixed(2)}`
      };
    } else if (type === 'cube_vol') {
      const a = randInt(2, 8);
      prob = {
        type, display: `Kuboa: aldea = ${a}\n\nBolumena = ?`,
        solution: a * a * a,
        hint: `V = a³ = ${a}³ = ${a * a * a}`
      };
    } else if (type === 'sphere_vol') {
      const r = randInt(1, 5);
      const vol = Math.round((4 / 3) * 3.14 * r * r * r * 100) / 100;
      prob = {
        type, display: `Esfera: r = ${r}\n\nBolumena = ? (π = 3.14 erabili)`,
        solution: vol,
        hint: `V = (4/3)πr³ = (4/3)×3.14×${r}³ = ${vol}`
      };
    } else {
      const r = randInt(1, 5);
      const h = randInt(2, 10);
      const vol = Math.round(3.14 * r * r * h * 100) / 100;
      prob = {
        type, display: `Zilindroa: r = ${r}, h = ${h}\n\nBolumena = ? (π = 3.14 erabili)`,
        solution: vol,
        hint: `V = πr²h = 3.14×${r}²×${h} = 3.14×${r * r}×${h} = ${vol}`
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
    if (Math.abs(val - problem.solution) < 0.5) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-amber-600 transition-colors ${activeTab === 'concept' ? 'text-amber-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('calc2d')} className={`hover:text-amber-600 transition-colors ${activeTab === 'calc2d' ? 'text-amber-600' : ''}`}>2D Kalkulagailua</button>
            <button onClick={() => setActiveTab('calc3d')} className={`hover:text-amber-600 transition-colors ${activeTab === 'calc3d' ? 'text-amber-600' : ''}`}>3D Kalkulagailua</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow-sm shadow-amber-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Azalerak eta <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Bolumenak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Irudi lauak eta gorputz geometrikoak: perimetroak, azalerak eta bolumenak kalkulatzeko formulak eta tresnak.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'calc2d', 'calc3d', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'calc2d' ? '2D Kalkulagailua' : t === 'calc3d' ? '3D Kalkulagailua' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world */}
            <Section title="Zertarako balio dute?" icon={BookOpen} className="border-amber-200 ring-4 ring-amber-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Building2 size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Arkitektura</h3>
                  <p className="text-sm text-slate-600">
                    Eraikinen planoak, gelak eta fatxadak kalkulatzeko. Zenbat material behar duzu?
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Paintbrush size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Pintura eta Estalkiak</h3>
                  <p className="text-sm text-slate-600">
                    Zenbat litro pintura behar duzu pareta bat pintzatzeko? Azalera jakinda kalkulatu dezakezu!
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Warehouse size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Edukiera</h3>
                  <p className="text-sm text-slate-600">
                    Zenbat litro ur sartzen da igerileku batean? Edota kutxa batean zenbat gauza sartzen diren? Bolumena!
                  </p>
                </div>
              </div>
            </Section>

            {/* 2D Formulas */}
            <Section title="Irudi Lauak (2D)" icon={Shapes}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Irudi lauen bi neurri garrantzitsuenak: <strong>perimetroa</strong> (inguruaren luzera) eta <strong>azalera</strong> (barnealdea estaltzen duen neurria).
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SHAPES_2D.map(s => (
                    <div key={s.id} className={`p-4 bg-${s.color}-50 border border-${s.color}-100 rounded-xl`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{s.icon}</span>
                        <h3 className="font-bold text-slate-800">{s.name}</h3>
                      </div>
                      <div className="space-y-1 font-mono text-sm">
                        <p className={`text-${s.color}-700 font-bold`}>{s.areaFormula}</p>
                        {s.perimeterFormula && (
                          <p className="text-slate-500">{s.perimeterFormula}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-sm text-amber-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Unitatea:</strong> Azalera u²-tan neurtzen da (cm², m²). Perimetroa u-tan (cm, m). Ez nahasi!</p>
                </div>
              </div>
            </Section>

            {/* 3D Formulas */}
            <Section title="Gorputz Geometrikoak (3D)" icon={Box}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  3D gorputzen bi neurri nagusiak: <strong>azalera osoa</strong> (kanpoko aurpegi guztien batura) eta <strong>bolumena</strong> (barnealdean sartzen den espazioa).
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SHAPES_3D.map(s => (
                    <div key={s.id} className={`p-4 bg-${s.color}-50 border border-${s.color}-100 rounded-xl`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{s.icon}</span>
                        <h3 className="font-bold text-slate-800 text-sm">{s.name}</h3>
                      </div>
                      <div className="space-y-1 font-mono text-sm">
                        <p className={`text-${s.color}-700 font-bold`}>{s.volumeFormula}</p>
                        <p className="text-slate-500">{s.surfaceFormula}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-sm text-amber-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Unitatea:</strong> Bolumena u³-tan neurtzen da (cm³, m³). 1 litro = 1.000 cm³ = 1 dm³.</p>
                </div>
              </div>
            </Section>

            {/* Relationships */}
            <Section title="Erlazio Garrantzitsuak" icon={ListOrdered}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                  <h3 className="font-bold text-slate-800 mb-2">Konoa vs Zilindroa</h3>
                  <p className="text-sm text-slate-600 mb-2">Konoaren bolumena = zilindroaren herena.</p>
                  <p className="font-mono text-sm text-violet-700 font-bold">V<sub>konoa</sub> = (1/3) × V<sub>zilindroa</sub></p>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <h3 className="font-bold text-slate-800 mb-2">Piramidea vs Prisma</h3>
                  <p className="text-sm text-slate-600 mb-2">Piramidearen bolumena = prismaren herena.</p>
                  <p className="font-mono text-sm text-rose-700 font-bold">V<sub>piramidea</sub> = (1/3) × V<sub>prisma</sub></p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <h3 className="font-bold text-slate-800 mb-2">Esfera</h3>
                  <p className="text-sm text-slate-600 mb-2">Esferaren bolumena eta azalera soilik erradioaren menpe.</p>
                  <p className="font-mono text-sm text-emerald-700 font-bold">V = (4/3)πr³,  S = 4πr²</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <h3 className="font-bold text-slate-800 mb-2">Zirkulua → Zilindroa</h3>
                  <p className="text-sm text-slate-600 mb-2">Zirkuluaren azalera × altuera = zilindroaren bolumena.</p>
                  <p className="font-mono text-sm text-blue-700 font-bold">πr² × h = πr²h</p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: 2D CALCULATOR --- */}
        {activeTab === 'calc2d' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="2D Irudi Kalkulagailua" icon={Shapes}>
              <Calculator2D />
            </Section>
          </div>
        )}

        {/* --- SECTION 3: 3D CALCULATOR --- */}
        {activeTab === 'calc3d' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="3D Gorputz Kalkulagailua" icon={Box}>
              <Calculator3D />
            </Section>
          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-amber-200 ring-4 ring-amber-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-amber-50 border border-amber-100 px-6 py-2 rounded-full text-sm font-bold text-amber-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type.includes('area') || problem.type.includes('perim') ? 'Irudi laua (2D)' : 'Gorputz geometrikoa (3D)'}
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
                          step="0.01"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-lg font-bold"
                        />
                      </div>
                      <p className="text-xs text-slate-400">Erantzun dezimalekin: erabili π = 3.14</p>
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
                          className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-400 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
