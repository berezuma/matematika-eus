import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import {
  BookOpen,
  Check,
  RefreshCw,
  Brain,
  ArrowRight,
  AlertTriangle,
  Compass,
  Move,
  Navigation,
  Gamepad2,
  Wind,
  Anchor,
  ListOrdered,
  Calculator,
  X
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Vector Math ---

const vecAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const vecSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const vecScale = (a, k) => [a[0] * k, a[1] * k];
const vecDot = (a, b) => a[0] * b[0] + a[1] * b[1];
const vecMag = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]);
const vecAngle = (a) => {
  const rad = Math.atan2(a[1], a[0]);
  const deg = (rad * 180) / Math.PI;
  return deg < 0 ? deg + 360 : deg;
};

const formatNum = (n) => (Number.isInteger(n) ? n.toString() : n.toFixed(2));

// --- Interactive Vector Canvas ---

const VectorCanvas = ({ vectors, width = 600, height = 400, showResultant = false, resultantOp = 'add' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const scale = 30;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += scale) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y <= h; y += scale) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const range = Math.floor(w / (2 * scale));
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue;
      ctx.fillText(i.toString(), cx + i * scale, cy + 14);
    }
    ctx.textAlign = 'right';
    for (let i = -Math.floor(h / (2 * scale)); i <= Math.floor(h / (2 * scale)); i++) {
      if (i === 0) continue;
      ctx.fillText(i.toString(), cx - 8, cy - i * scale + 4);
    }

    // Draw arrow function
    const drawArrow = (x1, y1, x2, y2, color, label) => {
      const headLen = 10;
      const angle = Math.atan2(y1 - y2, x2 - x1);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;

      // Line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 + headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 + headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Label
      if (label) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        ctx.fillText(label, midX + 12, midY - 10);
      }
    };

    const colors = ['#f97316', '#3b82f6', '#10b981', '#ef4444'];
    const labels = ['u\u20D7', 'v\u20D7', 'w\u20D7'];

    // Draw vectors from origin
    vectors.forEach((v, i) => {
      const px = cx + v[0] * scale;
      const py = cy - v[1] * scale;
      drawArrow(cx, cy, px, py, colors[i], labels[i]);

      // Dot at endpoint
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Resultant vector
    if (showResultant && vectors.length >= 2) {
      let r;
      if (resultantOp === 'add') r = vecAdd(vectors[0], vectors[1]);
      else r = vecSub(vectors[0], vectors[1]);

      const rpx = cx + r[0] * scale;
      const rpy = cy - r[1] * scale;

      // Dashed parallelogram
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const v0px = cx + vectors[0][0] * scale;
      const v0py = cy - vectors[0][1] * scale;
      const v1px = cx + vectors[1][0] * scale;
      const v1py = cy - vectors[1][1] * scale;
      if (resultantOp === 'add') {
        ctx.moveTo(v0px, v0py);
        ctx.lineTo(rpx, rpy);
        ctx.moveTo(v1px, v1py);
        ctx.lineTo(rpx, rpy);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(cx, cy, rpx, rpy, colors[3], resultantOp === 'add' ? 'u+v' : 'u-v');
    }

  }, [vectors, showResultant, resultantOp, width, height]);

  return (
    <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />
  );
};

// --- Vector Input ---

const VectorInput = ({ label, value, onChange, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-xl border border-${color}-100`}>
    <p className={`text-xs font-bold text-${color}-500 uppercase tracking-widest mb-2`}>{label}</p>
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-slate-500">(</span>
      <input
        type="number"
        value={value[0]}
        onChange={(e) => onChange([parseFloat(e.target.value) || 0, value[1]])}
        className={`w-16 text-center p-2 border-2 border-slate-200 rounded-lg focus:border-${color}-500 focus:outline-none font-mono font-bold`}
      />
      <span className="font-mono text-sm text-slate-500">,</span>
      <input
        type="number"
        value={value[1]}
        onChange={(e) => onChange([value[0], parseFloat(e.target.value) || 0])}
        className={`w-16 text-center p-2 border-2 border-slate-200 rounded-lg focus:border-${color}-500 focus:outline-none font-mono font-bold`}
      />
      <span className="font-mono text-sm text-slate-500">)</span>
    </div>
  </div>
);

// --- Lab Component ---

const VectorLab = () => {
  const [vecU, setVecU] = useState([3, 2]);
  const [vecV, setVecV] = useState([1, 4]);
  const [operation, setOperation] = useState('add');
  const [showResult, setShowResult] = useState(true);

  const magU = vecMag(vecU);
  const magV = vecMag(vecV);
  const angleU = vecAngle(vecU);
  const angleV = vecAngle(vecV);

  let result;
  if (operation === 'add') result = vecAdd(vecU, vecV);
  else if (operation === 'sub') result = vecSub(vecU, vecV);
  else if (operation === 'dot') result = vecDot(vecU, vecV);
  else result = vecAdd(vecU, vecV);

  const isScalar = operation === 'dot';
  const resultMag = !isScalar ? vecMag(result) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'add', label: 'u\u20D7 + v\u20D7' },
          { id: 'sub', label: 'u\u20D7 - v\u20D7' },
          { id: 'dot', label: 'u\u20D7 · v\u20D7 (Biderketa eskalarra)' },
        ].map(op => (
          <button
            key={op.id}
            onClick={() => setOperation(op.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              operation === op.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VectorCanvas
            vectors={[vecU, vecV]}
            showResultant={!isScalar && showResult}
            resultantOp={operation}
          />
        </div>
        <div className="space-y-4">
          <VectorInput label="u\u20D7 bektorea" value={vecU} onChange={setVecU} color="orange" />
          <VectorInput label="v\u20D7 bektorea" value={vecV} onChange={setVecV} color="blue" />

          {/* Properties */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">|u\u20D7|</span>
              <span className="font-mono font-bold text-orange-600">{formatNum(magU)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">|v\u20D7|</span>
              <span className="font-mono font-bold text-blue-600">{formatNum(magV)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">u\u20D7 angelua</span>
              <span className="font-mono font-bold text-orange-600">{formatNum(angleU)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">v\u20D7 angelua</span>
              <span className="font-mono font-bold text-blue-600">{formatNum(angleV)}°</span>
            </div>
          </div>

          {/* Result */}
          <div className={`p-4 rounded-xl border ${isScalar ? 'bg-purple-50 border-purple-100' : 'bg-red-50 border-red-100'}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isScalar ? 'text-purple-500' : 'text-red-500'}`}>
              Emaitza
            </p>
            {isScalar ? (
              <p className="font-mono font-bold text-purple-700 text-xl">{formatNum(result)}</p>
            ) : (
              <>
                <p className="font-mono font-bold text-red-700 text-lg">({formatNum(result[0])}, {formatNum(result[1])})</p>
                <p className="font-mono text-sm text-red-500">|r| = {formatNum(resultMag)}</p>
              </>
            )}
          </div>

          {!isScalar && (
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showResult}
                onChange={(e) => setShowResult(e.target.checked)}
                className="accent-orange-500"
              />
              Erakutsi emaitzako bektorea
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Bektoreak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('vec');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['add', 'sub', 'module', 'dot', 'scalar'];
    const type = types[Math.floor(Math.random() * types.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let prob;

    const u = [randInt(-5, 5), randInt(-5, 5)];
    const v = [randInt(-5, 5), randInt(-5, 5)];

    if (type === 'add') {
      const comp = randInt(0, 1); // x or y component
      const r = vecAdd(u, v);
      const compName = comp === 0 ? 'x' : 'y';
      prob = {
        type,
        display: `u\u20D7 = (${u[0]}, ${u[1]}),  v\u20D7 = (${v[0]}, ${v[1]})\n\n(u\u20D7 + v\u20D7)-ren ${compName} osagaia = ?`,
        solution: r[comp],
        hint: `${compName} osagaia: ${u[comp]} + ${v[comp]} = ${r[comp]}`
      };
    } else if (type === 'sub') {
      const comp = randInt(0, 1);
      const r = vecSub(u, v);
      const compName = comp === 0 ? 'x' : 'y';
      prob = {
        type,
        display: `u\u20D7 = (${u[0]}, ${u[1]}),  v\u20D7 = (${v[0]}, ${v[1]})\n\n(u\u20D7 - v\u20D7)-ren ${compName} osagaia = ?`,
        solution: r[comp],
        hint: `${compName} osagaia: ${u[comp]} - ${v[comp]} = ${r[comp]}`
      };
    } else if (type === 'module') {
      // Use simple vectors with integer modules
      const pairs = [[3, 4], [5, 12], [6, 8], [0, 5], [4, 0], [1, 0], [0, 3]];
      const pair = pairs[randInt(0, pairs.length - 1)];
      const signs = [randInt(0, 1) ? 1 : -1, randInt(0, 1) ? 1 : -1];
      const vec = [pair[0] * signs[0], pair[1] * signs[1]];
      const mag = vecMag(vec);
      prob = {
        type,
        display: `u\u20D7 = (${vec[0]}, ${vec[1]})\n\n|u\u20D7| = ?`,
        solution: Math.round(mag * 100) / 100,
        hint: `|u\u20D7| = \u221A(${vec[0]}\u00B2 + ${vec[1]}\u00B2) = \u221A(${vec[0] * vec[0]} + ${vec[1] * vec[1]}) = \u221A${vec[0] * vec[0] + vec[1] * vec[1]} = ${formatNum(mag)}`
      };
    } else if (type === 'dot') {
      const d = vecDot(u, v);
      prob = {
        type,
        display: `u\u20D7 = (${u[0]}, ${u[1]}),  v\u20D7 = (${v[0]}, ${v[1]})\n\nu\u20D7 · v\u20D7 = ?`,
        solution: d,
        hint: `u\u20D7 · v\u20D7 = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${u[0] * v[0]} + ${u[1] * v[1]} = ${d}`
      };
    } else {
      const k = randInt(2, 5);
      const comp = randInt(0, 1);
      const compName = comp === 0 ? 'x' : 'y';
      const r = vecScale(u, k);
      prob = {
        type,
        display: `u\u20D7 = (${u[0]}, ${u[1]})\n\n(${k} · u\u20D7)-ren ${compName} osagaia = ?`,
        solution: r[comp],
        hint: `${k} × ${u[comp]} = ${r[comp]}`
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-orange-600 transition-colors ${activeTab === 'concept' ? 'text-orange-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-orange-600 transition-colors ${activeTab === 'viz' ? 'text-orange-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('operations')} className={`hover:text-orange-600 transition-colors ${activeTab === 'operations' ? 'text-orange-600' : ''}`}>Eragiketak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all shadow-sm shadow-orange-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Bektoreak <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-500">Planoan</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Modulua, norabidea eta eragiketak. Bektoreak geometria eta fisikaren oinarria dira.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'operations', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'operations' ? 'Eragiketak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world applications */}
            <Section title="Zertarako balio dute?" icon={BookOpen} className="border-orange-200 ring-4 ring-orange-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Navigation size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Nabigazioa</h3>
                  <p className="text-sm text-slate-600">
                    GPS-ak bektoreak erabiltzen ditu zure kokapena eta norabidea kalkulatzeko. Hegazkinak haize-bektorearekin egiten du lan.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Gamepad2 size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Bideo Jokoak</h3>
                  <p className="text-sm text-slate-600">
                    Pertsonaien mugimendua, talken detekzioa eta fisika-motorrak guztiak bektoreetan oinarritzen dira.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Wind size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Fisika</h3>
                  <p className="text-sm text-slate-600">
                    Indarrak, abiadurak eta azelerazioak bektoreak dira. Newtonen legeak bektorialekin azaltzen dira.
                  </p>
                </div>
              </div>
            </Section>

            {/* What is a vector */}
            <Section title="Zer da bektore bat?" icon={Move}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-blue-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">Bektorea 2D-n</p>
                    <div className="font-mono text-3xl md:text-5xl flex items-center justify-center gap-4">
                      <span className="text-orange-400 font-bold">v</span>
                      <span className="text-slate-600">=</span>
                      <span className="text-slate-600">(</span>
                      <span className="text-orange-400 relative">
                        v<sub className="text-sm">x</sub>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-orange-300 whitespace-nowrap">x osagaia</span>
                      </span>
                      <span className="text-slate-600">,</span>
                      <span className="text-blue-400 relative">
                        v<sub className="text-sm">y</sub>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-300 whitespace-nowrap">y osagaia</span>
                      </span>
                      <span className="text-slate-600">)</span>
                    </div>
                    <p className="text-slate-500 mt-12 text-sm">
                      Bektore batek <strong>magnitude</strong> (luzera) eta <strong>norabide</strong> bat dauka
                    </p>
                  </div>
                </div>

                <p className="text-slate-600">
                  Bektore bat <strong>zenbaki pare ordenatu</strong> bat da planoan: norabidea eta magnitudea adierazten ditu. Eskalar bat (zenbaki arrunt bat) ez bezala, bektore batek <strong>noranzkoa</strong> dauka.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">Modulua (Luzera)</h3>
                    <p className="text-sm text-slate-600 mb-2">Bektorearen tamaina. Beti positiboa.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center">
                      <p className="text-lg font-bold text-orange-700">|v| = {'\u221A'}(v<sub>x</sub>{'\u00B2'} + v<sub>y</sub>{'\u00B2'})</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">Norabidea (Angelua)</h3>
                    <p className="text-sm text-slate-600 mb-2">X ardatzarekiko angelua.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center">
                      <p className="text-lg font-bold text-blue-700">{'\u03B1'} = arctan(v<sub>y</sub> / v<sub>x</sub>)</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 text-sm text-orange-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Adibidea:</strong> v = (3, 4) → |v| = {'\u221A'}(9 + 16) = {'\u221A'}25 = <strong>5</strong>. Angelua = arctan(4/3) ≈ <strong>53.13°</strong></p>
                </div>
              </div>
            </Section>

            {/* Types of vectors */}
            <Section title="Bektore Bereziak" icon={Anchor}>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Zero Bektorea',
                    desc: 'Modulua 0, norabiderik ez.',
                    example: '0\u20D7 = (0, 0)',
                    color: 'slate'
                  },
                  {
                    name: 'Unitate Bektorea',
                    desc: 'Modulua = 1. Norabidea adierazten du.',
                    example: 'u\u0302 = v\u20D7 / |v\u20D7|',
                    color: 'orange'
                  },
                  {
                    name: 'Oinarri Bektoreak',
                    desc: 'i\u20D7 = (1,0) eta j\u20D7 = (0,1). Ardatzen norabidea.',
                    example: 'v = 3i\u20D7 + 4j\u20D7 = (3,4)',
                    color: 'blue'
                  },
                  {
                    name: 'Bektore Kontrakoak',
                    desc: 'Norabide berdina, noranzko kontrakoa.',
                    example: 'v = (3,2), -v = (-3,-2)',
                    color: 'red'
                  },
                  {
                    name: 'Bektore Paraleloak',
                    desc: 'Norabide berdina (proportzionalak).',
                    example: '(2,4) || (1,2)',
                    color: 'green'
                  },
                  {
                    name: 'Bektore Perpendikularrak',
                    desc: 'Biderketa eskalarra = 0.',
                    example: '(2,3) \u22A5 (-3,2)',
                    color: 'purple'
                  },
                ].map((v, i) => (
                  <div key={i} className={`p-4 bg-${v.color}-50 border border-${v.color}-100 rounded-xl`}>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{v.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{v.desc}</p>
                    <p className={`font-mono text-sm text-${v.color}-700 font-bold`}>{v.example}</p>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Bektore Laborategia" icon={Calculator}>
              <VectorLab />
            </Section>
          </div>
        )}

        {/* --- SECTION 3: OPERATIONS --- */}
        {activeTab === 'operations' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Addition */}
            <Section title="Batuketa eta Kenketa" icon={ListOrdered}>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100">
                    <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">+</div>
                      Batuketa: Osagaiz osagai
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-orange-600">ARAUA:</strong> Osagai berdinak batu. x-ak x-ekin, y-ak y-rekin.
                    </div>
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center space-y-2">
                      <p className="text-lg">u + v = (<span className="text-orange-400">u<sub>x</sub> + v<sub>x</sub></span>, <span className="text-blue-400">u<sub>y</sub> + v<sub>y</sub></span>)</p>
                      <p className="text-slate-400 text-sm mt-4">Adibidea:</p>
                      <p className="text-lg">(<span className="text-orange-400">3</span>, <span className="text-blue-400">2</span>) + (<span className="text-orange-400">1</span>, <span className="text-blue-400">4</span>) = (<span className="text-emerald-400 font-bold">4</span>, <span className="text-emerald-400 font-bold">6</span>)</p>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                      <strong>Geometrikoki:</strong> Paralelogramoaren erregela. Bi bektoreak muturrean jarri eta diagonalak emaitza ematen du.
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Scalar Multiplication */}
            <Section title="Biderketa Eskalarra" icon={Compass}>
              <div className="space-y-6">

                <div className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b border-blue-100">
                    <h3 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono">{'\u00B7'}</div>
                      Eskalar baten biderketaz
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-blue-600">ARAUA:</strong> Osagai bakoitza eskalarraz biderkatu. Modulua k aldiz handiagoa, norabide berdina (k {'>'} 0) edo kontrakoa (k {'<'} 0).
                    </div>
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center space-y-2">
                      <p className="text-lg">k · v = (k·v<sub>x</sub>, k·v<sub>y</sub>)</p>
                      <p className="text-slate-400 text-sm mt-4">Adibidea:</p>
                      <p className="text-lg">3 · (2, -1) = (<span className="text-emerald-400 font-bold">6</span>, <span className="text-emerald-400 font-bold">-3</span>)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden">
                  <div className="bg-purple-50 p-4 border-b border-purple-100">
                    <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono">{'\u00B7'}</div>
                      Biderketa Eskalarra (Dot Product)
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-purple-600">ARAUA:</strong> Osagai berdinak biderkatu eta batu. Emaitza <strong>zenbaki bat</strong> da (ez bektore bat!).
                    </div>
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-center space-y-2">
                      <p className="text-lg">u · v = u<sub>x</sub>·v<sub>x</sub> + u<sub>y</sub>·v<sub>y</sub></p>
                      <p className="text-slate-400 text-sm mt-4">Adibidea:</p>
                      <p className="text-lg">(3, 2) · (1, 4) = 3·1 + 2·4 = <span className="text-emerald-400 font-bold">11</span></p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mt-4">
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-center">
                        <p className="font-bold text-sm text-slate-800">u · v {'>'} 0</p>
                        <p className="text-xs text-slate-500">Angelu zorrotza ({'<'}90°)</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
                        <p className="font-bold text-sm text-slate-800">u · v = 0</p>
                        <p className="text-xs text-slate-500">Perpendikularrak (90°)</p>
                      </div>
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                        <p className="font-bold text-sm text-slate-800">u · v {'<'} 0</p>
                        <p className="text-xs text-slate-500">Angelu kamutsa ({'>'}90°)</p>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                      <strong>Angeluaren formula:</strong> cos({'\u03B1'}) = (u · v) / (|u| · |v|)
                    </div>
                  </div>
                </div>

              </div>
            </Section>

            {/* Summary table */}
            <Section title="Eragiketen Laburpena" icon={ListOrdered}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left p-3 text-xs text-slate-400 uppercase">Eragiketa</th>
                      <th className="text-left p-3 text-xs text-slate-400 uppercase">Formula</th>
                      <th className="text-left p-3 text-xs text-slate-400 uppercase">Emaitza</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {[
                      { op: 'u + v', formula: '(u\u2093+v\u2093, u\u1D67+v\u1D67)', result: 'Bektorea' },
                      { op: 'u - v', formula: '(u\u2093-v\u2093, u\u1D67-v\u1D67)', result: 'Bektorea' },
                      { op: 'k · v', formula: '(k·v\u2093, k·v\u1D67)', result: 'Bektorea' },
                      { op: 'u · v', formula: 'u\u2093·v\u2093 + u\u1D67·v\u1D67', result: 'Zenbakia' },
                      { op: '|v|', formula: '\u221A(v\u2093\u00B2 + v\u1D67\u00B2)', result: 'Zenbakia' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="p-3 font-bold text-slate-800">{row.op}</td>
                        <td className="p-3 text-slate-600">{row.formula}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${row.result === 'Bektorea' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{row.result}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-orange-200 ring-4 ring-orange-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-orange-50 border border-orange-100 px-6 py-2 rounded-full text-sm font-bold text-orange-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'add' ? 'Bektoreen batuketa' :
                         problem.type === 'sub' ? 'Bektoreen kenketa' :
                         problem.type === 'module' ? 'Modulua' :
                         problem.type === 'dot' ? 'Biderketa eskalarra' :
                         'Eskalar biderketa'}
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
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg font-bold"
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
                          className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-400 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
