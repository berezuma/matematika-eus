import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, Calculator, ArrowRight, Check, RefreshCw, Zap, ListOrdered } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Interactive Logarithm Graph ---

const LogarithmGraph = ({ base }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const scale = 30;
    const centerX = width * 0.25;
    const centerY = height / 2;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = -Math.floor(centerX / scale); i <= Math.floor((width - centerX) / scale); i++) {
      if (i === 0) continue;
      const px = centerX + i * scale;
      if (px >= 0 && px <= width) {
        ctx.fillText(i.toString(), px, centerY + 16);
      }
    }
    for (let i = -Math.floor((height - centerY) / scale); i <= Math.floor(centerY / scale); i++) {
      if (i === 0) continue;
      const py = centerY - i * scale;
      if (py >= 0 && py <= height) {
        ctx.fillText(i.toString(), centerX - 16, py + 4);
      }
    }

    // Draw y = b^x (exponential curve) - dashed
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let firstPoint = true;
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      let y;
      try {
        y = Math.pow(base, x);
      } catch {
        continue;
      }
      if (!isFinite(y) || isNaN(y)) {
        firstPoint = true;
        continue;
      }
      const py = centerY - y * scale;
      if (py < -100 || py > height + 100) {
        firstPoint = true;
        continue;
      }
      if (firstPoint) {
        ctx.moveTo(px, py);
        firstPoint = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Label for exponential
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`y = ${base}^x`, width - 100, 30);

    // Draw y = x (identity line) - dotted thin
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, centerY + centerX);
    ctx.lineTo(width, centerY - (width - centerX));
    ctx.stroke();
    ctx.setLineDash([]);

    // Label for identity
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px monospace';
    ctx.fillText('y = x', width - 50, centerY - (width - centerX - 50) + 14);

    // Draw y = log_b(x) (logarithm curve) - solid emerald
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    firstPoint = true;
    for (let px = 1; px < width; px++) {
      const x = (px - centerX) / scale;
      if (x <= 0) continue;
      let y;
      try {
        y = Math.log(x) / Math.log(base);
      } catch {
        continue;
      }
      if (!isFinite(y) || isNaN(y)) {
        firstPoint = true;
        continue;
      }
      const pyVal = centerY - y * scale;
      if (pyVal < -100 || pyVal > height + 100) {
        firstPoint = true;
        continue;
      }
      if (firstPoint) {
        ctx.moveTo(px, pyVal);
        firstPoint = false;
      } else {
        ctx.lineTo(px, pyVal);
      }
    }
    ctx.stroke();

    // Label for logarithm
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`y = log_${base}(x)`, width - 140, height - 20);

    // Mark key point (1, 0) - log_b(1) = 0 always
    const pt1X = centerX + 1 * scale;
    const pt1Y = centerY;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pt1X, pt1Y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'left';
    ctx.fillText('(1, 0)', pt1X + 8, pt1Y - 8);

    // Mark key point (b, 1) - log_b(b) = 1
    const ptBX = centerX + base * scale;
    const ptBY = centerY - 1 * scale;
    if (ptBX >= 0 && ptBX <= width && ptBY >= 0 && ptBY <= height) {
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(ptBX, ptBY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#8b5cf6';
      ctx.textAlign = 'left';
      ctx.fillText(`(${base}, 1)`, ptBX + 8, ptBY - 8);
    }

  }, [base]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />
  );
};

// --- Main Component ---

export default function Logaritmoak() {
  useDocumentTitle('Logaritmoak');
  const [activeTab, setActiveTab] = useState('teoria');
  const [labBase, setLabBase] = useState(2);
  const [labNumber, setLabNumber] = useState(8);
  const [graphBase, setGraphBase] = useState(2);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total: totalAttempts, addCorrect, addIncorrect, reset } = useProgress('logaritmoak');

  useEffect(() => {
    generateProblem();
  }, []);

  // Calculate logarithm result for the lab
  const labResult = labNumber > 0 && labBase > 0 && labBase !== 1
    ? Math.log(labNumber) / Math.log(labBase)
    : NaN;

  const formatNumber = (n) => {
    if (isNaN(n) || !isFinite(n)) return '?';
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(4);
  };

  // --- Practice Problem Generator ---

  const generateProblem = () => {
    const types = ['basic', 'simplify', 'property'];
    const type = types[Math.floor(Math.random() * types.length)];

    let prob;

    if (type === 'basic') {
      // Calculate log_b(x) where the answer is a whole number
      const pairs = [
        { base: 2, arg: 4, answer: 2 },
        { base: 2, arg: 8, answer: 3 },
        { base: 2, arg: 16, answer: 4 },
        { base: 2, arg: 32, answer: 5 },
        { base: 2, arg: 64, answer: 6 },
        { base: 3, arg: 9, answer: 2 },
        { base: 3, arg: 27, answer: 3 },
        { base: 3, arg: 81, answer: 4 },
        { base: 4, arg: 16, answer: 2 },
        { base: 4, arg: 64, answer: 3 },
        { base: 5, arg: 25, answer: 2 },
        { base: 5, arg: 125, answer: 3 },
        { base: 6, arg: 36, answer: 2 },
        { base: 7, arg: 49, answer: 2 },
        { base: 10, arg: 100, answer: 2 },
        { base: 10, arg: 1000, answer: 3 },
        { base: 10, arg: 10000, answer: 4 },
        { base: 2, arg: 1, answer: 0 },
        { base: 5, arg: 1, answer: 0 },
        { base: 10, arg: 1, answer: 0 },
      ];
      const p = pairs[Math.floor(Math.random() * pairs.length)];
      prob = {
        type,
        display: `log${subscript(p.base)}(${p.arg}) = ?`,
        solution: p.answer,
        hint: `Galdera: ${p.base} zein berreturara igo behar da ${p.arg} lortzeko? ${p.base}^? = ${p.arg}`
      };
    } else if (type === 'simplify') {
      // Simplify using properties
      const subTypes = [
        () => {
          // log_b(b^n) = n
          const b = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
          const n = Math.floor(Math.random() * 5) + 1;
          return {
            display: `log${subscript(b)}(${b}${toSuperscript(n)}) = ?`,
            solution: n,
            hint: `Gogoratu: log_b(b^n) = n. Beraz, log${subscript(b)}(${b}${toSuperscript(n)}) = ${n}`
          };
        },
        () => {
          // log_b(1) = 0
          const b = [2, 3, 5, 7, 10][Math.floor(Math.random() * 5)];
          return {
            display: `log${subscript(b)}(1) = ?`,
            solution: 0,
            hint: `Gogoratu: log_b(1) = 0 beti, zeren b^0 = 1 edozein b > 0, b ≠ 1 izanik.`
          };
        },
        () => {
          // log_b(b) = 1
          const b = [2, 3, 5, 7, 10][Math.floor(Math.random() * 5)];
          return {
            display: `log${subscript(b)}(${b}) = ?`,
            solution: 1,
            hint: `Gogoratu: log_b(b) = 1 beti, zeren b^1 = b.`
          };
        }
      ];
      const sub = subTypes[Math.floor(Math.random() * subTypes.length)]();
      prob = { type, ...sub };
    } else {
      // Property application
      const subTypes = [
        () => {
          // log_b(m*n) = log_b(m) + log_b(n) - find the combined value
          const b = 2;
          const m = [2, 4, 8][Math.floor(Math.random() * 3)];
          const n = [2, 4, 8][Math.floor(Math.random() * 3)];
          const logM = Math.log(m) / Math.log(b);
          const logN = Math.log(n) / Math.log(b);
          const answer = logM + logN;
          return {
            display: `log${subscript(b)}(${m}) + log${subscript(b)}(${n}) = log${subscript(b)}(?) ← Aurkitu ?`,
            solution: m * n,
            hint: `Biderkaketa propietatea: log_b(m) + log_b(n) = log_b(m × n). Beraz ? = ${m} × ${n} = ${m * n}`
          };
        },
        () => {
          // log_b(m/n) = log_b(m) - log_b(n)
          const b = 2;
          const pairs = [
            { m: 16, n: 4 }, { m: 32, n: 8 }, { m: 64, n: 8 },
            { m: 16, n: 2 }, { m: 8, n: 2 }, { m: 64, n: 4 }
          ];
          const { m, n } = pairs[Math.floor(Math.random() * pairs.length)];
          return {
            display: `log${subscript(b)}(${m}) - log${subscript(b)}(${n}) = log${subscript(b)}(?) ← Aurkitu ?`,
            solution: m / n,
            hint: `Zatiketa propietatea: log_b(m) - log_b(n) = log_b(m / n). Beraz ? = ${m} / ${n} = ${m / n}`
          };
        },
        () => {
          // n * log_b(m) = log_b(m^n)
          const b = 10;
          const m = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
          const n = [2, 3][Math.floor(Math.random() * 2)];
          const result = Math.pow(m, n);
          return {
            display: `${n} · log${subscript(b)}(${m}) = log${subscript(b)}(?) ← Aurkitu ?`,
            solution: result,
            hint: `Berretura propietatea: n · log_b(m) = log_b(m^n). Beraz ? = ${m}^${n} = ${result}`
          };
        }
      ];
      const sub = subTypes[Math.floor(Math.random() * subTypes.length)]();
      prob = { type, ...sub };
    }

    setPracticeProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const subscript = (n) => {
    const map = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    return String(n).split('').map(c => map[c] || c).join('');
  };

  const toSuperscript = (n) => {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return String(n).split('').map(c => map[c] || c).join('');
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const userVal = parseFloat(userInput);
    if (isNaN(userVal)) {
      setFeedback('invalid');
      return;
    }
    if (Math.abs(userVal - practiceProblem.solution) < 0.01) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('teoria')} className={`hover:text-emerald-600 transition-colors ${activeTab === 'teoria' ? 'text-emerald-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('laborategia')} className={`hover:text-emerald-600 transition-colors ${activeTab === 'laborategia' ? 'text-emerald-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('formulak')} className={`hover:text-emerald-600 transition-colors ${activeTab === 'formulak' ? 'text-emerald-600' : ''}`}>Formulak</button>
            <button onClick={() => setActiveTab('praktika')} className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-200">Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Logaritmoak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Berreturen alderantzizko eragiketa: logaritmoak. Zein berretzailera igo behar da oinarria emaitza bat lortzeko?
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['teoria', 'laborategia', 'formulak', 'praktika'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'teoria' ? 'Teoria' : t === 'laborategia' ? 'Laborategia' : t === 'formulak' ? 'Formulak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: TEORIA                                                */}
        {/* ============================================================ */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* What is a logarithm? */}
            <Section title="Zer da logaritmo bat?" icon={BookOpen}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Logaritmoaren definizioa</p>
                    <div className="text-3xl md:text-5xl font-mono mb-4">
                      <span className="text-emerald-400">log</span>
                      <span className="text-teal-400 text-xl md:text-2xl" style={{ verticalAlign: 'sub' }}>b</span>
                      <span className="text-white">(</span>
                      <span className="text-cyan-400">x</span>
                      <span className="text-white">)</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-amber-400">y</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-slate-400 text-lg">
                      <span>hau esan nahi du</span>
                    </div>
                    <div className="text-3xl md:text-5xl font-mono mt-4">
                      <span className="text-teal-400">b</span>
                      <span className="text-amber-400 text-xl md:text-2xl" style={{ verticalAlign: 'super' }}>y</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-cyan-400">x</span>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-slate-400">
                      <div>
                        <div className="text-teal-400 font-bold text-sm">b</div>
                        <div>Oinarria</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-bold text-sm">x</div>
                        <div>Argumentua</div>
                      </div>
                      <div>
                        <div className="text-amber-400 font-bold text-sm">y</div>
                        <div>Emaitza (berretzailea)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Logaritmoa galdera honi erantzuten dio: <strong>"Zein berretzailera igo behar dut oinarria, emaitza jakin bat lortzeko?"</strong>
                  Adibidez, log₂(8) = 3, zeren 2³ = 8.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="font-mono text-xl text-center mb-2">log₂(8) = <strong className="text-emerald-700">3</strong></p>
                    <p className="text-xs text-center text-slate-500">zeren 2³ = 8</p>
                  </div>
                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                    <p className="font-mono text-xl text-center mb-2">log₁₀(1000) = <strong className="text-teal-700">3</strong></p>
                    <p className="text-xs text-center text-slate-500">zeren 10³ = 1000</p>
                  </div>
                  <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
                    <p className="font-mono text-xl text-center mb-2">log₅(25) = <strong className="text-cyan-700">2</strong></p>
                    <p className="text-xs text-center text-slate-500">zeren 5² = 25</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="font-mono text-xl text-center mb-2">log₃(81) = <strong className="text-emerald-700">4</strong></p>
                    <p className="text-xs text-center text-slate-500">zeren 3⁴ = 81</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Relationship with exponentials */}
            <Section title="Logaritmoak eta Berreturak: Alderantzizko Eragiketak" icon={Zap}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  Logaritmoa berreturaren <strong>alderantzizko eragiketa</strong> da, batuketa eta kenketa bezala, edo biderketa eta zatiketa bezala.
                </p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl text-center">
                  <div className="flex items-center justify-center gap-8 flex-wrap">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Berretura</p>
                      <p className="text-2xl md:text-3xl font-mono">
                        <span className="text-teal-400">2</span>
                        <span className="text-amber-400 text-lg" style={{ verticalAlign: 'super' }}>3</span>
                        <span className="text-slate-500"> = </span>
                        <span className="text-cyan-400">8</span>
                      </p>
                    </div>
                    <div className="text-emerald-400 text-3xl font-bold">&#8644;</div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Logaritmoa</p>
                      <p className="text-2xl md:text-3xl font-mono">
                        <span className="text-emerald-400">log</span>
                        <span className="text-teal-400 text-sm" style={{ verticalAlign: 'sub' }}>2</span>
                        <span className="text-white">(</span>
                        <span className="text-cyan-400">8</span>
                        <span className="text-white">)</span>
                        <span className="text-slate-500"> = </span>
                        <span className="text-amber-400">3</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                      <Calculator size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Logaritmo arrunta (log)</h3>
                    <p className="text-sm text-slate-600">
                      <strong>log(x)</strong> idazten denean oinarririk gabe, <strong>oinarria 10</strong> da.
                      Logaritmo hamarrekoa ere esaten zaio. Adib.: log(100) = 2, zeren 10² = 100.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                      <BookOpen size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Logaritmo nepertarra (ln)</h3>
                    <p className="text-sm text-slate-600">
                      <strong>ln(x)</strong> idazten denean, oinarria <strong>e ≈ 2.71828</strong> da (Euler-en zenbakia).
                      Zientzian eta matematika aurreratuan oso garrantzitsua. Adib.: ln(e) = 1.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                  <strong>Funtsezko erlazioak:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>log<sub>b</sub>(b<sup>x</sup>) = x &mdash; Logaritmoa eta berretura elkar desegiten dute</li>
                    <li>b<sup>log<sub>b</sub>(x)</sup> = x &mdash; Berretura eta logaritmoa elkar desegiten dute</li>
                    <li>log<sub>b</sub>(1) = 0 &mdash; Edozein oinarrirekin, 1-en logaritmoa 0 da</li>
                    <li>log<sub>b</sub>(b) = 1 &mdash; Oinarriaren logaritmoa beti 1 da</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Properties overview (visual) */}
            <Section title="Propietateen Laburpena Bisuala" icon={ListOrdered}>
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Biderkaduraren logaritmoa</h3>
                      <p className="font-mono text-xl font-bold text-slate-700">log<sub>b</sub>(m &middot; n) = log<sub>b</sub>(m) + log<sub>b</sub>(n)</p>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <p className="font-mono text-sm text-slate-600">log₂(4 &middot; 8) = log₂(4) + log₂(8) = 2 + 3 = 5</p>
                        <p className="text-xs text-emerald-600 font-bold mt-1">Logaritmoak BATU</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-teal-50 border border-teal-100">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Zatiduraren logaritmoa</h3>
                      <p className="font-mono text-xl font-bold text-slate-700">log<sub>b</sub>(m / n) = log<sub>b</sub>(m) - log<sub>b</sub>(n)</p>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <p className="font-mono text-sm text-slate-600">log₂(32 / 4) = log₂(32) - log₂(4) = 5 - 2 = 3</p>
                        <p className="text-xs text-teal-600 font-bold mt-1">Logaritmoak KENDU</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-cyan-50 border border-cyan-100">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Berreturaren logaritmoa</h3>
                      <p className="font-mono text-xl font-bold text-slate-700">log<sub>b</sub>(m<sup>n</sup>) = n &middot; log<sub>b</sub>(m)</p>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <p className="font-mono text-sm text-slate-600">log₂(8²) = 2 &middot; log₂(8) = 2 &middot; 3 = 6</p>
                        <p className="text-xs text-cyan-600 font-bold mt-1">Berretzailea AURRERA atera</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LABORATEGIA                                           */}
        {/* ============================================================ */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Logarithm Calculator */}
            <Section title="Logaritmo Kalkulagailua" icon={Calculator}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-emerald-600 uppercase">Oinarria (b)</label>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 rounded font-bold">{labBase}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="10"
                        step="1"
                        value={labBase}
                        onChange={(e) => setLabBase(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-teal-600 uppercase">Zenbakia (x)</label>
                        <span className="text-xs font-mono bg-teal-100 text-teal-700 px-2 rounded font-bold">{labNumber}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="1000"
                        step="1"
                        value={labNumber}
                        onChange={(e) => setLabNumber(parseInt(e.target.value))}
                        className="w-full accent-teal-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="pt-2">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Zenbakia zuzenean idatzi</label>
                      <input
                        type="number"
                        min="1"
                        value={labNumber}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > 0) setLabNumber(val);
                        }}
                        className="w-full p-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-center font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white p-6 rounded-xl text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Emaitza</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold">
                      <span className="text-emerald-400">log</span>
                      <span className="text-teal-400 text-lg" style={{ verticalAlign: 'sub' }}>{labBase}</span>
                      <span className="text-white">(</span>
                      <span className="text-cyan-400">{labNumber}</span>
                      <span className="text-white">)</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-amber-400">{formatNumber(labResult)}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-3">
                      {!isNaN(labResult) && isFinite(labResult) ? (
                        <>
                          Hau da: {labBase}<sup>{formatNumber(labResult)}</sup> = {labNumber}
                        </>
                      ) : (
                        'Oinarriak 1 baino handiagoa izan behar du eta zenbakiak positiboa'
                      )}
                    </p>
                    {Number.isInteger(labResult) && (
                      <div className="mt-3 px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold inline-block mx-auto">
                        Zenbaki osoa da!
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs text-emerald-600 font-bold uppercase mb-2">Egiaztapena</p>
                  <div className="font-mono text-sm text-emerald-800 text-center">
                    {!isNaN(labResult) && isFinite(labResult) ? (
                      <>
                        log{subscript(labBase)}({labNumber}) = {formatNumber(labResult)} &rarr; {labBase}{toSuperscript(Number.isInteger(labResult) ? labResult.toString() : formatNumber(labResult))} = {labNumber}
                      </>
                    ) : (
                      'Balioko sarrera bat behar da'
                    )}
                  </div>
                </div>
              </div>
            </Section>

            {/* Interactive Graph */}
            <Section title="Kurba Esponentziala eta Logaritmikoa" icon={Zap}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center p-2">
                  <LogarithmGraph base={graphBase} />
                </div>
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Funtzioak</p>
                    <p className="font-mono text-sm text-emerald-900 font-bold">
                      y = {graphBase}<sup>x</sup> <span className="text-slate-400">(esponentziala)</span>
                    </p>
                    <p className="font-mono text-sm text-emerald-900 font-bold mt-1">
                      y = log<sub>{graphBase}</sub>(x) <span className="text-slate-400">(logaritmoa)</span>
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Oinarria (b)</label>
                      <span className="text-xs font-mono bg-emerald-100 px-2 rounded font-bold text-emerald-600">{graphBase}</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="5"
                      step="0.5"
                      value={graphBase}
                      onChange={(e) => setGraphBase(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-emerald-500 rounded"></div>
                      <span>Kurba logaritmikoa: y = log<sub>{graphBase}</sub>(x)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-slate-400 rounded" style={{ borderTop: '2px dashed #94a3b8' }}></div>
                      <span>Kurba esponentziala: y = {graphBase}<sup>x</sup></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-slate-300 rounded" style={{ borderTop: '1px dotted #cbd5e1' }}></div>
                      <span>y = x lerroa (simetria-ardatza)</span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                    <strong>Begiratu:</strong> Logaritmo-kurba eta esponentzial-kurba y = x lerroaren ispilu-irudiak dira! Hori alderantzizko funtzioak direlako gertatzen da.
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-slate-600 font-mono">(1, 0) &mdash; log<sub>b</sub>(1) = 0 beti</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-slate-600 font-mono">({graphBase}, 1) &mdash; log<sub>{graphBase}</sub>({graphBase}) = 1 beti</span>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: FORMULAK                                              */}
        {/* ============================================================ */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Logaritmoen Formula Guztiak" icon={ListOrdered}>
              <div className="space-y-4">

                {/* Product rule */}
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 hover:border-emerald-300 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="inline-block px-2 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full mb-2">BIDERKADURA</span>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Biderkaduraren logaritmoa</h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg border border-slate-200 text-center">
                      <p className="font-mono text-2xl md:text-3xl font-bold text-slate-800">
                        log<sub>b</sub>(m &middot; n) = log<sub>b</sub>(m) + log<sub>b</sub>(n)
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="text-xs text-emerald-600 font-bold uppercase mb-2">Adibidea</p>
                      <p className="font-mono text-sm text-slate-700">
                        log₂(4 &middot; 8) = log₂(4) + log₂(8) = 2 + 3 = <strong>5</strong>
                      </p>
                      <p className="font-mono text-sm text-slate-500 mt-1">
                        Egiaztapena: log₂(32) = 5 ✓ (2⁵ = 32)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quotient rule */}
                <div className="p-6 rounded-xl bg-teal-50 border border-teal-100 hover:border-teal-300 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="inline-block px-2 py-1 bg-teal-200 text-teal-800 text-xs font-bold rounded-full mb-2">ZATIDURA</span>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Zatiduraren logaritmoa</h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg border border-slate-200 text-center">
                      <p className="font-mono text-2xl md:text-3xl font-bold text-slate-800">
                        log<sub>b</sub>(m / n) = log<sub>b</sub>(m) - log<sub>b</sub>(n)
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="text-xs text-teal-600 font-bold uppercase mb-2">Adibidea</p>
                      <p className="font-mono text-sm text-slate-700">
                        log₃(81 / 9) = log₃(81) - log₃(9) = 4 - 2 = <strong>2</strong>
                      </p>
                      <p className="font-mono text-sm text-slate-500 mt-1">
                        Egiaztapena: log₃(9) = 2 ✓ (3² = 9)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Power rule */}
                <div className="p-6 rounded-xl bg-cyan-50 border border-cyan-100 hover:border-cyan-300 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="inline-block px-2 py-1 bg-cyan-200 text-cyan-800 text-xs font-bold rounded-full mb-2">BERRETURA</span>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Berreturaren logaritmoa</h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg border border-slate-200 text-center">
                      <p className="font-mono text-2xl md:text-3xl font-bold text-slate-800">
                        log<sub>b</sub>(m<sup>n</sup>) = n &middot; log<sub>b</sub>(m)
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="text-xs text-cyan-600 font-bold uppercase mb-2">Adibidea</p>
                      <p className="font-mono text-sm text-slate-700">
                        log₂(8³) = 3 &middot; log₂(8) = 3 &middot; 3 = <strong>9</strong>
                      </p>
                      <p className="font-mono text-sm text-slate-500 mt-1">
                        Egiaztapena: log₂(512) = 9 ✓ (2⁹ = 512)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change of base */}
                <div className="p-6 rounded-xl bg-purple-50 border border-purple-100 hover:border-purple-300 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="inline-block px-2 py-1 bg-purple-200 text-purple-800 text-xs font-bold rounded-full mb-2">OINARRI ALDAKETA</span>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Oinarri-aldaketaren formula</h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg border border-slate-200 text-center">
                      <p className="font-mono text-2xl md:text-3xl font-bold text-slate-800">
                        log<sub>b</sub>(x) = log<sub>a</sub>(x) / log<sub>a</sub>(b)
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="text-xs text-purple-600 font-bold uppercase mb-2">Adibidea</p>
                      <p className="font-mono text-sm text-slate-700">
                        log₂(10) = log₁₀(10) / log₁₀(2) = 1 / 0.3010 ≈ <strong>3.3219</strong>
                      </p>
                      <p className="font-mono text-sm text-slate-500 mt-1">
                        Kalkulagailuan log edo ln erabiliz edozein oinarrirako kalkulatu dezakezu
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

            {/* Special values and identities */}
            <Section title="Balore Bereziak eta Identitateak" icon={BookOpen}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-2xl font-bold text-emerald-600">log<sub>b</sub>(1) = 0</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Edozein oinarrirekin, 1-en logaritmoa <strong>0</strong> da</p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>b⁰ = 1 beti, beraz log<sub>b</sub>(1) = 0</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-2xl font-bold text-teal-600">log<sub>b</sub>(b) = 1</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Oinarriaren logaritmoa beti <strong>1</strong> da</p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>b¹ = b beti, beraz log<sub>b</sub>(b) = 1</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-2xl font-bold text-cyan-600">log<sub>b</sub>(b<sup>n</sup>) = n</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Logaritmoak eta berreturak <strong>elkar desegiten</strong> dute</p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>log₂(2⁵) = 5 | log₁₀(10³) = 3</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-2xl font-bold text-purple-600">b<sup>log<sub>b</sub>(x)</sup> = x</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Alderantzizkoa ere bai: berreturak logaritmoa <strong>desegiten</strong> du</p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>2<sup>log₂(8)</sup> = 2³ = 8</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Quick reference */}
            <Section title="Erreferentzia Azkarra" icon={Zap}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b-2 border-emerald-200">
                      <th className="text-left p-3 text-emerald-700">Formula</th>
                      <th className="text-left p-3 text-emerald-700">Izena</th>
                      <th className="text-left p-3 text-emerald-700">Erregela</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-100 hover:bg-emerald-50 transition-colors">
                      <td className="p-3 font-bold">log<sub>b</sub>(mn) = log<sub>b</sub>(m) + log<sub>b</sub>(n)</td>
                      <td className="p-3">Biderkaduraren erregela</td>
                      <td className="p-3 text-emerald-600">Batu</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-emerald-50 transition-colors">
                      <td className="p-3 font-bold">log<sub>b</sub>(m/n) = log<sub>b</sub>(m) - log<sub>b</sub>(n)</td>
                      <td className="p-3">Zatiduraren erregela</td>
                      <td className="p-3 text-emerald-600">Kendu</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-emerald-50 transition-colors">
                      <td className="p-3 font-bold">log<sub>b</sub>(m<sup>n</sup>) = n &middot; log<sub>b</sub>(m)</td>
                      <td className="p-3">Berreturaren erregela</td>
                      <td className="p-3 text-emerald-600">Biderkatu</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-emerald-50 transition-colors">
                      <td className="p-3 font-bold">log<sub>b</sub>(x) = log<sub>a</sub>(x) / log<sub>a</sub>(b)</td>
                      <td className="p-3">Oinarri-aldaketa</td>
                      <td className="p-3 text-emerald-600">Zatitu</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-emerald-50 transition-colors">
                      <td className="p-3 font-bold">log<sub>b</sub>(1) = 0</td>
                      <td className="p-3">1-en logaritmoa</td>
                      <td className="p-3 text-emerald-600">Beti 0</td>
                    </tr>
                    <tr className="hover:bg-emerald-50 transition-colors">
                      <td className="p-3 font-bold">log<sub>b</sub>(b) = 1</td>
                      <td className="p-3">Oinarriaren logaritmoa</td>
                      <td className="p-3 text-emerald-600">Beti 1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PRAKTIKA                                              */}
        {/* ============================================================ */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Calculator} className="border-emerald-200 ring-4 ring-emerald-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-emerald-50 border border-emerald-100 px-6 py-2 rounded-full text-sm font-bold text-emerald-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{totalAttempts}</span>
                    {totalAttempts > 0 && <span className="text-xs opacity-60">({Math.round((score / totalAttempts) * 100)}%)</span>}
                  </div>
                </div>
                {totalAttempts > 0 && (
                  <button onClick={() => reset()} className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors">
                    Puntuazioa berrezarri
                  </button>
                )}

                {practiceProblem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {practiceProblem.type === 'basic' ? 'Logaritmo oinarrizkoa' :
                         practiceProblem.type === 'simplify' ? 'Sinplifikatu' : 'Propietatea aplikatu'}
                      </div>
                      <div className="text-xs text-slate-400 mb-4">Kalkulatu emaitza</div>
                      <div className="text-2xl md:text-3xl font-mono text-slate-800 font-bold leading-relaxed">
                        {practiceProblem.display}
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
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-lg font-bold"
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
                          {feedback === 'correct' ? <Check /> : <RefreshCw />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Hori da.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             `Ia-ia... Erantzun zuzena: ${practiceProblem.solution}`}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Azalpena ikusi?
                          </button>
                        )}
                      </div>
                    )}

                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                        <strong>Azalpena:</strong> {practiceProblem.hint}
                      </div>
                    )}

                    <div className="flex gap-4 justify-center mt-6">
                      <button
                        onClick={checkAnswer}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0"
                      >
                        Egiaztatu
                      </button>
                      {(feedback === 'correct' || feedback === 'incorrect') && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center gap-2 animate-in fade-in"
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

      <RelatedTopics currentId="logaritmoak" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
