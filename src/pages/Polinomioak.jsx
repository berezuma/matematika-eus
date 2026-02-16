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
  PenTool,
  Shuffle,
  ListOrdered,
  X,
  Building2,
  Ruler,
  DollarSign
} from 'lucide-react';

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

// --- Polynomial Utilities ---

const parseCoefficients = (str) => {
  const parts = str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  return parts;
};

const formatPoly = (coeffs) => {
  if (!coeffs || coeffs.length === 0) return '0';
  const degree = coeffs.length - 1;
  const terms = [];
  coeffs.forEach((c, i) => {
    if (c === 0) return;
    const exp = degree - i;
    let term = '';
    if (i === 0) {
      term = c < 0 ? '-' : '';
    } else {
      term = c < 0 ? ' - ' : ' + ';
    }
    const absC = Math.abs(c);
    if (exp === 0) {
      term += absC;
    } else if (exp === 1) {
      term += (absC === 1 ? '' : absC) + 'x';
    } else {
      term += (absC === 1 ? '' : absC) + 'x' + toSuperscript(exp);
    }
    terms.push(term);
  });
  return terms.length > 0 ? terms.join('') : '0';
};

const toSuperscript = (n) => {
  const map = { '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079', '-': '\u207B' };
  return String(n).split('').map(c => map[c] || c).join('');
};

const addPolynomials = (a, b) => {
  const maxLen = Math.max(a.length, b.length);
  const padA = Array(maxLen - a.length).fill(0).concat(a);
  const padB = Array(maxLen - b.length).fill(0).concat(b);
  return padA.map((v, i) => v + padB[i]);
};

const subtractPolynomials = (a, b) => {
  return addPolynomials(a, b.map(c => -c));
};

const multiplyPolynomials = (a, b) => {
  const result = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result[i + j] += a[i] * b[j];
    }
  }
  return result;
};

// --- Polynomial Graph ---

const PolyGraph = ({ coefficients }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const scale = 30;
    const cx = w / 2;
    const cy = h / 2;

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
    for (let i = -Math.floor(w / (2 * scale)); i <= Math.floor(w / (2 * scale)); i++) {
      if (i === 0) continue;
      ctx.fillText(i.toString(), cx + i * scale, cy + 14);
    }

    // Evaluate polynomial
    const evaluate = (x) => {
      const degree = coefficients.length - 1;
      let val = 0;
      for (let i = 0; i < coefficients.length; i++) {
        val += coefficients[i] * Math.pow(x, degree - i);
      }
      return val;
    };

    // Draw curve
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < w; px++) {
      const x = (px - cx) / scale;
      const y = evaluate(x);
      const py = cy - y * scale;
      if (py < -200 || py > h + 200) { first = true; continue; }
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Find and mark roots (approximate)
    ctx.fillStyle = '#ef4444';
    const roots = [];
    for (let px = 1; px < w; px++) {
      const x1 = (px - 1 - cx) / scale;
      const x2 = (px - cx) / scale;
      const y1 = evaluate(x1);
      const y2 = evaluate(x2);
      if ((y1 >= 0 && y2 < 0) || (y1 < 0 && y2 >= 0)) {
        const rootX = x1 - y1 * (x2 - x1) / (y2 - y1);
        roots.push(rootX);
        const rpx = cx + rootX * scale;
        ctx.beginPath();
        ctx.arc(rpx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`x=${rootX.toFixed(1)}`, rpx + 8, cy - 10);
      }
    }

  }, [coefficients]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />
  );
};

// --- Ruffini Interactive ---

const RuffiniDemo = () => {
  const [polyStr, setPolyStr] = useState('1, -6, 11, -6');
  const [root, setRoot] = useState(1);
  const [result, setResult] = useState(null);

  const compute = () => {
    const coeffs = parseCoefficients(polyStr);
    if (coeffs.length < 2) return;

    const rows = [];
    const quotient = [coeffs[0]];
    rows.push({ carry: 0, product: 0, result: coeffs[0] });

    for (let i = 1; i < coeffs.length; i++) {
      const product = quotient[quotient.length - 1] * root;
      const res = coeffs[i] + product;
      quotient.push(res);
      rows.push({ carry: coeffs[i], product, result: res });
    }

    const remainder = quotient[quotient.length - 1];
    const quotientCoeffs = quotient.slice(0, -1);

    setResult({ coeffs, quotient: quotientCoeffs, remainder, rows });
  };

  useEffect(() => { compute(); }, [polyStr, root]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Polinomioaren koefizienteak (koma bidez)</label>
          <input
            type="text"
            value={polyStr}
            onChange={(e) => setPolyStr(e.target.value)}
            placeholder="1, -6, 11, -6"
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">Adib: 1, -6, 11, -6 → x³ - 6x² + 11x - 6</p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Erroa (r)</label>
          <input
            type="number"
            value={root}
            onChange={(e) => setRoot(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">(x - r) faktorez zatitzen</p>
        </div>
      </div>

      {result && result.coeffs.length >= 2 && (
        <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Ruffini-ren Taula</p>

          <div className="inline-block min-w-full">
            <table className="font-mono text-lg">
              <tbody>
                {/* Coefficients row */}
                <tr>
                  <td className="pr-4 text-purple-400 font-bold border-r-2 border-b-2 border-slate-600 p-3">{root}</td>
                  {result.coeffs.map((c, i) => (
                    <td key={i} className="text-center text-white font-bold border-b-2 border-slate-600 px-4 py-3">{c}</td>
                  ))}
                </tr>
                {/* Products row */}
                <tr>
                  <td className="border-r-2 border-slate-600 p-3"></td>
                  {result.rows.map((r, i) => (
                    <td key={i} className="text-center text-purple-300 px-4 py-3">
                      {i === 0 ? '' : (r.product >= 0 ? '+' : '') + r.product}
                    </td>
                  ))}
                </tr>
                {/* Results row */}
                <tr className="border-t-2 border-slate-500">
                  <td className="border-r-2 border-slate-600 p-3"></td>
                  {result.rows.map((r, i) => (
                    <td key={i} className={`text-center font-bold px-4 py-3 ${
                      i === result.rows.length - 1
                        ? (r.result === 0 ? 'text-green-400' : 'text-red-400')
                        : 'text-amber-400'
                    }`}>
                      {r.result}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 text-sm">
            <p className="text-slate-300">
              <span className="text-amber-400 font-bold">Kotzientea:</span>{' '}
              <span className="font-mono text-white">{formatPoly(result.quotient)}</span>
            </p>
            <p className="text-slate-300 mt-1">
              <span className={`font-bold ${result.remainder === 0 ? 'text-green-400' : 'text-red-400'}`}>Hondarra:</span>{' '}
              <span className="font-mono text-white">{result.remainder}</span>
              {result.remainder === 0 && (
                <span className="text-green-400 ml-2">
                  → (x - {root}) faktorea da!
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Polynomial Calculator ---

const PolyCalculator = () => {
  const [polyA, setPolyA] = useState('1, -3, 2');
  const [polyB, setPolyB] = useState('1, -1');
  const [operation, setOperation] = useState('add');

  const a = parseCoefficients(polyA);
  const b = parseCoefficients(polyB);

  let resultCoeffs = [];
  if (a.length > 0 && b.length > 0) {
    if (operation === 'add') resultCoeffs = addPolynomials(a, b);
    else if (operation === 'sub') resultCoeffs = subtractPolynomials(a, b);
    else resultCoeffs = multiplyPolynomials(a, b);
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">P(x) koefizienteak</label>
          <input
            type="text"
            value={polyA}
            onChange={(e) => setPolyA(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">{formatPoly(a)}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Q(x) koefizienteak</label>
          <input
            type="text"
            value={polyB}
            onChange={(e) => setPolyB(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">{formatPoly(b)}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {[
          { id: 'add', label: 'P + Q', icon: '+' },
          { id: 'sub', label: 'P - Q', icon: '-' },
          { id: 'mult', label: 'P × Q', icon: '×' },
        ].map((op) => (
          <button
            key={op.id}
            onClick={() => setOperation(op.id)}
            className={`px-5 py-2.5 rounded-full font-bold transition-all ${
              operation === op.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 text-center">
        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Emaitza</p>
        <p className="font-mono text-xl md:text-2xl font-bold text-purple-900">
          {formatPoly(resultCoeffs)}
        </p>
      </div>

      {/* Graph */}
      <div className="bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
        <p className="text-xs text-center text-slate-400 mb-2 font-bold uppercase">Emaitzaren Grafikoa</p>
        <PolyGraph coefficients={resultCoeffs.length > 0 ? resultCoeffs : [0]} />
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Polinomioak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('polinom');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['evaluate', 'add', 'multiply', 'degree'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'evaluate') {
      const a = Math.floor(Math.random() * 4) + 1;
      const b = Math.floor(Math.random() * 11) - 5;
      const c = Math.floor(Math.random() * 11) - 5;
      const x = Math.floor(Math.random() * 5) - 2;
      const result = a * x * x + b * x + c;
      const poly = formatPoly([a, b, c]);
      prob = {
        type,
        display: `P(x) = ${poly}\nP(${x}) = ?`,
        solution: result,
        hint: `Ordeztu x = ${x}: ${a}·(${x})² + (${b})·(${x}) + (${c}) = ${a * x * x} + (${b * x}) + (${c})`
      };
    } else if (type === 'add') {
      const a1 = Math.floor(Math.random() * 5) + 1;
      const b1 = Math.floor(Math.random() * 11) - 5;
      const a2 = Math.floor(Math.random() * 5) + 1;
      const b2 = Math.floor(Math.random() * 11) - 5;
      const resultA = a1 + a2;
      const resultB = b1 + b2;
      prob = {
        type,
        display: `(${a1}x + (${b1})) + (${a2}x + (${b2}))\nx-ren koefizientea = ?`,
        solution: resultA,
        hint: `Batu x-ren koefizienteak: ${a1} + ${a2} = ${resultA}`
      };
    } else if (type === 'multiply') {
      const a = Math.floor(Math.random() * 4) + 1;
      const b = Math.floor(Math.random() * 7) - 3;
      const c = Math.floor(Math.random() * 4) + 1;
      const d = Math.floor(Math.random() * 7) - 3;
      // (ax + b)(cx + d) = ac·x² + (ad+bc)·x + bd
      const x2Coeff = a * c;
      prob = {
        type,
        display: `(${a}x + (${b})) · (${c}x + (${d}))\nx²-ren koefizientea = ?`,
        solution: x2Coeff,
        hint: `x²-ren koefizientea = ${a} × ${c} = ${x2Coeff}`
      };
    } else {
      // degree
      const degree = Math.floor(Math.random() * 5) + 1;
      const coeffs = [Math.floor(Math.random() * 5) + 1];
      for (let i = 1; i <= degree; i++) {
        coeffs.push(Math.floor(Math.random() * 11) - 5);
      }
      prob = {
        type,
        display: `P(x) = ${formatPoly(coeffs)}\nZenbateko mailakoa da?`,
        solution: degree,
        hint: `Mailako altuena x${toSuperscript(degree)} da, beraz ${degree}. mailakoa.`
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
    if (val === problem.solution) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

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
            <button onClick={() => setActiveTab('concept')} className={`hover:text-purple-600 transition-colors ${activeTab === 'concept' ? 'text-purple-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-purple-600 transition-colors ${activeTab === 'viz' ? 'text-purple-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('identities')} className={`hover:text-purple-600 transition-colors ${activeTab === 'identities' ? 'text-purple-600' : ''}`}>Identitate Aipagarriak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-sm shadow-purple-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Polinomioak eta <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Monomioak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eragiketak, Ruffini, faktorizazioa eta identitate aipagarriak. Aljebraren oinarria.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'identities', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'identities' ? 'Identitate Aipagarriak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world applications */}
            <Section title="Zertarako balio dute?" icon={BookOpen} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Building2 size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Arkitektura</h3>
                  <p className="text-sm text-slate-600">
                    Zubi eta arku baten forma polinomio bat da. Ingeniariek kurbak diseinatzen dituzte polinomioekin.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Ruler size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Fisika</h3>
                  <p className="text-sm text-slate-600">
                    Jaurtiketa parabolikoa: h(t) = -5t² + v₀t + h₀. Pilota baten altuera polinomio bat da!
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Ekonomia</h3>
                  <p className="text-sm text-slate-600">
                    Kostu, irabazi eta eskari funtzioak polinomioak dira. Enpresek erabiltzen dituzte erabakiak hartzeko.
                  </p>
                </div>
              </div>
            </Section>

            {/* What is a monomial */}
            <Section title="Zer da monomio bat?" icon={PenTool}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Monomioa</p>
                    <div className="text-4xl md:text-6xl font-mono flex items-start justify-center gap-1">
                      <span className="text-purple-400 font-bold relative">
                        a
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-purple-300 whitespace-nowrap">Koefizientea</span>
                      </span>
                      <span className="text-violet-400 font-bold relative">
                        x
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-violet-300 whitespace-nowrap">Aldagaia</span>
                      </span>
                      <span className="text-fuchsia-400 font-bold text-2xl md:text-3xl relative" style={{ verticalAlign: 'super' }}>
                        n
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-fuchsia-300 whitespace-nowrap">Maila</span>
                      </span>
                    </div>
                    <p className="text-slate-400 mt-12 text-sm">
                      Adibideak: <span className="text-purple-300 font-mono">3x²</span>, <span className="text-purple-300 font-mono">-5x³</span>, <span className="text-purple-300 font-mono">7</span> (maila 0)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                  <strong>Monomioen arteko eragiketak:</strong> Soilik maila berdineko monomioak batu/kendu daitezke. 3x² + 5x² = 8x², baina 3x² + 5x ezin da sinplifikatu.
                </div>
              </div>
            </Section>

            {/* What is a polynomial */}
            <Section title="Zer da polinomio bat?" icon={Layers}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Polinomio bat <strong>monomioen batuketa</strong> da. Termino bakoitzak koefiziente bat eta berretzaile oso positibo bat du.
                </p>

                <div className="bg-white border-2 border-purple-100 rounded-2xl p-6 overflow-hidden">
                  <div className="text-center mb-4">
                    <p className="text-xs text-purple-400 uppercase tracking-widest font-bold mb-3">Polinomio baten anatomia</p>
                    <div className="font-mono text-2xl md:text-3xl text-slate-800">
                      <span className="text-purple-600 font-bold">2</span>x<sup>3</sup>
                      <span className="text-slate-400"> - </span>
                      <span className="text-violet-600 font-bold">5</span>x<sup>2</sup>
                      <span className="text-slate-400"> + </span>
                      <span className="text-fuchsia-600 font-bold">3</span>x
                      <span className="text-slate-400"> - </span>
                      <span className="text-pink-600 font-bold">1</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                      <p className="font-mono font-bold text-purple-700">2x³</p>
                      <p className="text-[10px] text-slate-500 mt-1">3. mailako terminoa</p>
                    </div>
                    <div className="bg-violet-50 p-3 rounded-lg text-center border border-violet-100">
                      <p className="font-mono font-bold text-violet-700">-5x²</p>
                      <p className="text-[10px] text-slate-500 mt-1">2. mailako terminoa</p>
                    </div>
                    <div className="bg-fuchsia-50 p-3 rounded-lg text-center border border-fuchsia-100">
                      <p className="font-mono font-bold text-fuchsia-700">3x</p>
                      <p className="text-[10px] text-slate-500 mt-1">1. mailako terminoa</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg text-center border border-pink-100">
                      <p className="font-mono font-bold text-pink-700">-1</p>
                      <p className="text-[10px] text-slate-500 mt-1">Termino askea</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Maila</p>
                    <p className="text-sm text-slate-600">Berretzaile altuena. Goiko adibidean: <strong className="text-purple-700">3</strong></p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Koefiziente nagusia</p>
                    <p className="text-sm text-slate-600">Maila altuenaren koefizientea: <strong className="text-purple-700">2</strong></p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Termino askea</p>
                    <p className="text-sm text-slate-600">x-rik ez duen terminoa: <strong className="text-purple-700">-1</strong></p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Gogoratu:</strong> Polinomioen barruan berretzaileak beti zenbaki oso positiboak dira (0, 1, 2, 3...). Berretzaile negatiboak edo zatikiak dituzten adierazpenak <strong>ez</strong> dira polinomioak.</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Operations */}
            <Section title="Eragiketa Arauak" icon={ListOrdered}>
              <div className="grid lg:grid-cols-3 gap-8">

                {/* Addition */}
                <div className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-purple-50 p-4 border-b border-purple-100">
                    <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">+</div>
                      Batuketa / Kenketa
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-purple-600 block mb-1">ARAUA:</strong>
                      Maila berdineko terminoak batu. Ezberdinak ukitu gabe utzi.
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 font-mono text-sm space-y-1">
                      <p className="text-slate-700">(3x² + 2x - 1)</p>
                      <p className="text-purple-600">+ (x² - 5x + 4)</p>
                      <div className="h-px bg-purple-300 my-2"></div>
                      <p className="font-bold text-purple-900">= 4x² - 3x + 3</p>
                    </div>
                  </div>
                </div>

                {/* Multiplication */}
                <div className="bg-white rounded-2xl border-2 border-violet-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-violet-50 p-4 border-b border-violet-100">
                    <h3 className="font-bold text-lg text-violet-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">&times;</div>
                      Biderketa
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-violet-600 block mb-1">ARAUA:</strong>
                      Termino bakoitza besteko guztiekin biderkatu (propietate banatzailea).
                    </div>
                    <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 font-mono text-sm space-y-1">
                      <p className="text-slate-700">(x + 2) · (x - 3)</p>
                      <p className="text-violet-600">= x² - 3x + 2x - 6</p>
                      <div className="h-px bg-violet-300 my-2"></div>
                      <p className="font-bold text-violet-900">= x² - x - 6</p>
                    </div>
                  </div>
                </div>

                {/* Ruffini */}
                <div className="bg-white rounded-2xl border-2 border-fuchsia-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-fuchsia-50 p-4 border-b border-fuchsia-100">
                    <h3 className="font-bold text-lg text-fuchsia-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">÷</div>
                      Ruffini-ren Erregela
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-fuchsia-600 block mb-1">NOIZ:</strong>
                      (x - r) formako faktorez zatitzeko. Polinomioak faktorizatzeko ezinbestekoa.
                    </div>
                    <div className="bg-fuchsia-50 p-4 rounded-xl border border-fuchsia-100 text-sm space-y-1">
                      <p className="text-slate-700 font-mono">(x³ - 6x² + 11x - 6) : (x - 1)</p>
                      <p className="text-fuchsia-600 text-xs mt-2">1. Koefizienteak jarri: 1, -6, 11, -6</p>
                      <p className="text-fuchsia-600 text-xs">2. r = 1 erabiliz, Ruffini aplikatu</p>
                      <p className="font-bold text-fuchsia-900 font-mono mt-2">= x² - 5x + 6</p>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Polinomio Kalkulagailua" icon={Shuffle}>
              <PolyCalculator />
            </Section>

            <Section title="Ruffini Interaktiboa" icon={Layers}>
              <RuffiniDemo />
            </Section>

          </div>
        )}

        {/* --- SECTION 3: NOTABLE IDENTITIES --- */}
        {activeTab === 'identities' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Identitate Aipagarriak" icon={ListOrdered}>
              <div className="space-y-4">
                {[
                  {
                    name: 'Batuketa baten karratua',
                    formula: '(a + b)² = a² + 2ab + b²',
                    example: '(x + 3)² = x² + 6x + 9',
                    explanation: 'Karratua + bikoitza + karratua',
                    color: 'purple'
                  },
                  {
                    name: 'Kenketa baten karratua',
                    formula: '(a - b)² = a² - 2ab + b²',
                    example: '(x - 4)² = x² - 8x + 16',
                    explanation: 'Karratua - bikoitza + karratua',
                    color: 'violet'
                  },
                  {
                    name: 'Karratuen diferentzia',
                    formula: '(a + b)(a - b) = a² - b²',
                    example: '(x + 5)(x - 5) = x² - 25',
                    explanation: 'Batuketa bider kenketa = karratuen diferentzia',
                    color: 'fuchsia'
                  },
                  {
                    name: 'Batuketa baten kuboa',
                    formula: '(a + b)³ = a³ + 3a²b + 3ab² + b³',
                    example: '(x + 2)³ = x³ + 6x² + 12x + 8',
                    explanation: 'Kuboa + hiru aldiz + hiru aldiz + kuboa',
                    color: 'pink'
                  },
                ].map((id, i) => (
                  <div key={i} className={`p-5 rounded-xl bg-${id.color}-50 border border-${id.color}-100 hover:border-${id.color}-300 transition-colors`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{id.name}</h3>
                        <p className="font-mono text-xl font-bold text-slate-700">{id.formula}</p>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-mono text-sm text-slate-600">{id.example}</p>
                          <p className={`text-xs text-${id.color}-600 font-bold mt-1`}>{id.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Faktorizazioa" icon={Shuffle}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Faktorizatzea polinomio bat faktore sinpleagoen biderkadura gisa idaztea da. Hiru urrats nagusi:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                    <div className="w-8 h-8 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold mb-3">1</div>
                    <h3 className="font-bold text-slate-800 mb-2">Faktore komuna</h3>
                    <p className="text-sm text-slate-600 mb-3">Atera termino guztiek duten faktore komuna.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm">
                      <p>6x³ + 4x² = <strong className="text-purple-700">2x²(3x + 2)</strong></p>
                    </div>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
                    <div className="w-8 h-8 bg-violet-200 text-violet-700 rounded-full flex items-center justify-center font-bold mb-3">2</div>
                    <h3 className="font-bold text-slate-800 mb-2">Identitate aipagarriak</h3>
                    <p className="text-sm text-slate-600 mb-3">Ezagutu eta aplikatu identitate aipagarriak.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm">
                      <p>x² - 9 = <strong className="text-violet-700">(x+3)(x-3)</strong></p>
                    </div>
                  </div>
                  <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-5">
                    <div className="w-8 h-8 bg-fuchsia-200 text-fuchsia-700 rounded-full flex items-center justify-center font-bold mb-3">3</div>
                    <h3 className="font-bold text-slate-800 mb-2">Ruffini</h3>
                    <p className="text-sm text-slate-600 mb-3">Erroak aurkitu eta zatiketa sintetikoa erabili.</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm">
                      <p>x³-6x²+11x-6 = <strong className="text-fuchsia-700">(x-1)(x-2)(x-3)</strong></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Erroek non bilatu:</strong> Termino askearen (azken zenbakia) zatitzaileak probatu. Adibidez, x³ - 6x² + 11x - 6 kasuan, 6-ren zatitzaileak probatu: ±1, ±2, ±3, ±6.</p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-purple-200 ring-4 ring-purple-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-purple-50 border border-purple-100 px-6 py-2 rounded-full text-sm font-bold text-purple-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{total}</span>
                    {total > 0 && <span className="text-xs opacity-60">({Math.round((score / total) * 100)}%)</span>}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'evaluate' ? 'Ebaluatu polinomioa' :
                         problem.type === 'add' ? 'Batu polinomioak' :
                         problem.type === 'multiply' ? 'Biderkatu polinomioak' :
                         'Zehaztu maila'}
                      </div>
                      <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
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
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg font-bold"
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
                          className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-500 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
