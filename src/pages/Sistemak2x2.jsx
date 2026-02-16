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
  Zap,
  ShoppingCart,
  Ticket,
  Map,
  ListOrdered,
  Calculator,
  GitBranch
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Interactive Graph: Two Lines ---

const SystemGraph = ({ a1, b1, c1, a2, b2, c2 }) => {
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
    const centerX = width / 2;
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
    const range = Math.floor(width / (2 * scale));
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue;
      const px = centerX + i * scale;
      ctx.fillText(i.toString(), px, centerY + 16);
    }
    ctx.textAlign = 'right';
    for (let i = -Math.floor(height / (2 * scale)); i <= Math.floor(height / (2 * scale)); i++) {
      if (i === 0) continue;
      const py = centerY - i * scale;
      ctx.fillText(i.toString(), centerX - 8, py + 4);
    }

    // Helper: draw a line from equation ax + by = c → y = (c - ax) / b
    const drawLine = (a, b, c, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      if (b === 0) {
        // Vertical line: x = c/a
        if (a !== 0) {
          const px = centerX + (c / a) * scale;
          ctx.moveTo(px, 0);
          ctx.lineTo(px, height);
        }
      } else {
        const yFn = (x) => (c - a * x) / b;
        const xStart = (0 - centerX) / scale;
        const xEnd = (width - centerX) / scale;
        const yStart = yFn(xStart);
        const yEnd = yFn(xEnd);
        ctx.moveTo(0, centerY - yStart * scale);
        ctx.lineTo(width, centerY - yEnd * scale);
      }
      ctx.stroke();
    };

    // Draw both lines
    drawLine(a1, b1, c1, '#7c3aed'); // violet
    drawLine(a2, b2, c2, '#0891b2'); // cyan

    // Calculate intersection
    const det = a1 * b2 - a2 * b1;
    if (det !== 0) {
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;

      const px = centerX + x * scale;
      const py = centerY - y * scale;

      if (px >= -20 && px <= width + 20 && py >= -20 && py <= height + 20) {
        // Intersection point
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        const xLabel = x % 1 === 0 ? x : x.toFixed(2);
        const yLabel = y % 1 === 0 ? y : y.toFixed(2);
        ctx.fillText(`(${xLabel}, ${yLabel})`, px + 14, py - 10);
      }
    }

  }, [a1, b1, c1, a2, b2, c2]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white"/>
  );
};

// --- Main Component ---

export default function Sistemak2x2() {
  useDocumentTitle('Ekuazio Sistemak (2x2)');
  const [activeTab, setActiveTab] = useState('concept');
  const [eq1, setEq1] = useState({ a: 1, b: -1, c: 1 });
  const [eq2, setEq2] = useState({ a: 1, b: 1, c: 5 });
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInputs, setUserInputs] = useState({ x: '', y: '' });
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('sys-2x2');

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    // Generate a system with integer solutions
    const x = Math.floor(Math.random() * 11) - 5; // -5 to 5
    const y = Math.floor(Math.random() * 11) - 5;

    // Coefficients for first equation
    let a1 = Math.floor(Math.random() * 5) + 1;
    let b1 = Math.floor(Math.random() * 9) - 4;
    if (b1 === 0) b1 = 1;
    const c1 = a1 * x + b1 * y;

    // Coefficients for second equation (not proportional to first)
    let a2, b2;
    do {
      a2 = Math.floor(Math.random() * 9) - 4;
      b2 = Math.floor(Math.random() * 5) + 1;
    } while (a1 * b2 === a2 * b1); // ensure not parallel
    const c2 = a2 * x + b2 * y;

    const formatTerm = (coeff, variable, isFirst) => {
      if (coeff === 0) return '';
      const sign = coeff > 0 ? (isFirst ? '' : '+ ') : '- ';
      const abs = Math.abs(coeff);
      const c = abs === 1 ? '' : abs;
      return `${sign}${c}${variable} `;
    };

    const formatEq = (a, b, c) => {
      let str = '';
      if (a !== 0) {
        str += (a < 0 ? '-' : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x ';
      }
      if (b !== 0) {
        if (a !== 0) {
          str += (b > 0 ? '+ ' : '- ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y';
        } else {
          str += (b < 0 ? '-' : '') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y';
        }
      }
      str += ` = ${c}`;
      return str;
    };

    setPracticeProblem({
      a1, b1, c1,
      a2, b2, c2,
      x, y,
      display1: formatEq(a1, b1, c1),
      display2: formatEq(a2, b2, c2)
    });
    setUserInputs({ x: '', y: '' });
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const ux = parseFloat(userInputs.x);
    const uy = parseFloat(userInputs.y);

    if (isNaN(ux) || isNaN(uy)) {
      setFeedback('invalid');
      return;
    }

    if (ux === practiceProblem.x && uy === practiceProblem.y) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  // Calculate intersection for the lab
  const det = eq1.a * eq2.b - eq2.a * eq1.b;
  const solX = det !== 0 ? (eq1.c * eq2.b - eq2.c * eq1.b) / det : null;
  const solY = det !== 0 ? (eq1.a * eq2.c - eq2.a * eq1.c) / det : null;

  const formatNum = (n) => {
    if (n === null) return '∄';
    return n % 1 === 0 ? n : n.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-violet-100 selection:text-violet-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-violet-600 transition-colors ${activeTab === 'concept' ? 'text-violet-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-violet-600 transition-colors ${activeTab === 'viz' ? 'text-violet-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('methods')} className={`hover:text-violet-600 transition-colors ${activeTab === 'methods' ? 'text-violet-600' : ''}`}>Metodoak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-all shadow-sm shadow-violet-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Ekuazio <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">Sistemak 2×2</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bi ekuazio, bi ezezagun: bi lerro non elkartzen diren aurkitzea. Hiru metodo desberdin ikasiko dituzu.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'methods', 'practice'].map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'methods' ? 'Metodoak' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zertarako balio du?" icon={Zap} className="border-violet-200 ring-4 ring-violet-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <ShoppingCart size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Prezioak Aurkitzea</h3>
                     <p className="text-sm text-slate-600">
                        3 kafe eta 2 opil = 11€. 1 kafe eta 4 opil = 13€. <strong>Zenbat balio du kafe bakoitzak?</strong> Eta opil bakoitzak? Hori da sistema bat!
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mb-3">
                        <Ticket size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Nahasketa Problemak</h3>
                     <p className="text-sm text-slate-600">
                        Antzerkian 200 sarrera saldu dira. Helduen sarrera 10€ eta haurren sarrera 5€. Guztira 1.500€ bildu dira. <strong>Zenbat heldu eta haurr?</strong>
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-3">
                        <Map size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">GPS eta Koordenatuak</h3>
                     <p className="text-sm text-slate-600">
                        Bi ibilbide zuzen non elkartzen diren kalkulatzea: hori da GPS-ak egiten duena. Bi lerro, ebaketa puntu bat, <strong>zure kokapena</strong>!
                     </p>
                  </div>
               </div>
            </Section>

            <Section title="Zer da Ekuazio Sistema bat?" icon={BookOpen}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"></div>
                  <p className="text-center text-sm text-slate-400 mb-6 uppercase tracking-widest font-bold">Ekuazio Sistema 2×2</p>
                  <div className="flex justify-center items-center gap-6">
                    <div className="text-4xl text-slate-600 font-light">{`{`}</div>
                    <div className="space-y-3">
                      <div className="text-xl md:text-2xl font-mono">
                        <span className="text-violet-400">a₁</span>x + <span className="text-violet-400">b₁</span>y = <span className="text-violet-400">c₁</span>
                      </div>
                      <div className="text-xl md:text-2xl font-mono">
                        <span className="text-cyan-400">a₂</span>x + <span className="text-cyan-400">b₂</span>y = <span className="text-cyan-400">c₂</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-slate-500 mt-6">Helburua: x eta y-ren balioak aurkitu, <strong>bi ekuazioak</strong> aldi berean betetzen dituztenak</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">✂️</p>
                    <h3 className="font-bold text-slate-800 mb-1">Sistema Bateragarri Determinatua</h3>
                    <p className="text-sm text-slate-600">Bi lerro puntu <strong>bakar</strong> batean elkartzen dira</p>
                    <p className="text-xs text-green-600 font-bold mt-2">Soluzio bakarra (x, y)</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">📏</p>
                    <h3 className="font-bold text-slate-800 mb-1">Sistema Bateragarri Indeterminatua</h3>
                    <p className="text-sm text-slate-600">Bi lerro bat datoz: <strong>lerro berdina</strong> dira!</p>
                    <p className="text-xs text-yellow-600 font-bold mt-2">Soluzio infinitu</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">⏸️</p>
                    <h3 className="font-bold text-slate-800 mb-1">Sistema Bateraezina</h3>
                    <p className="text-sm text-slate-600">Bi lerro <strong>paraleloak</strong>: ez dira inoiz elkartzen</p>
                    <p className="text-xs text-red-600 font-bold mt-2">Soluziorik ez</p>
                  </div>
                </div>

                <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg flex gap-3 text-sm text-violet-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Geometrikoki:</strong> Ekuazio lineal bakoitza <strong>lerro zuzen bat</strong> da. Sistema bat ebaztea = bi lerro non elkartzen diren aurkitzea!</p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Laborategi Grafikoa" icon={Calculator}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center p-2">
                  <SystemGraph
                    a1={eq1.a} b1={eq1.b} c1={eq1.c}
                    a2={eq2.a} b2={eq2.b} c2={eq2.c}
                  />
                </div>

                <div className="space-y-5">
                  {/* Equation 1 */}
                  <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                    <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-2">1. Ekuazioa (morea)</p>
                    <p className="font-mono text-sm text-violet-900 font-bold mb-3">
                      {eq1.a === 1 ? '' : eq1.a === -1 ? '-' : eq1.a}x
                      {eq1.b >= 0 ? ' + ' : ' - '}{Math.abs(eq1.b) === 1 ? '' : Math.abs(eq1.b)}y
                      {' = '}{eq1.c}
                    </p>
                    <div className="space-y-2">
                      {[
                        { key: 'a', label: 'a₁', val: eq1.a },
                        { key: 'b', label: 'b₁', val: eq1.b },
                        { key: 'c', label: 'c₁', val: eq1.c }
                      ].map(p => (
                        <div key={p.key} className="flex items-center gap-2">
                          <span className="text-xs font-mono w-6 text-violet-600 font-bold">{p.label}</span>
                          <input
                            type="range" min="-5" max="5" step="1"
                            value={p.val}
                            onChange={(e) => setEq1({...eq1, [p.key]: parseInt(e.target.value)})}
                            className="flex-1 accent-violet-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs font-mono w-6 text-right font-bold">{p.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equation 2 */}
                  <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                    <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">2. Ekuazioa (urdina)</p>
                    <p className="font-mono text-sm text-cyan-900 font-bold mb-3">
                      {eq2.a === 1 ? '' : eq2.a === -1 ? '-' : eq2.a}x
                      {eq2.b >= 0 ? ' + ' : ' - '}{Math.abs(eq2.b) === 1 ? '' : Math.abs(eq2.b)}y
                      {' = '}{eq2.c}
                    </p>
                    <div className="space-y-2">
                      {[
                        { key: 'a', label: 'a₂', val: eq2.a },
                        { key: 'b', label: 'b₂', val: eq2.b },
                        { key: 'c', label: 'c₂', val: eq2.c }
                      ].map(p => (
                        <div key={p.key} className="flex items-center gap-2">
                          <span className="text-xs font-mono w-6 text-cyan-600 font-bold">{p.label}</span>
                          <input
                            type="range" min="-5" max="5" step="1"
                            value={p.val}
                            onChange={(e) => setEq2({...eq2, [p.key]: parseInt(e.target.value)})}
                            className="flex-1 accent-cyan-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs font-mono w-6 text-right font-bold">{p.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Result */}
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                    <div className="text-xs text-red-500 uppercase font-bold mb-1">Ebaketa Puntua</div>
                    <div className="font-mono font-bold text-red-700 text-lg">
                      {det !== 0
                        ? `(${formatNum(solX)}, ${formatNum(solY)})`
                        : det === 0 ? 'Paraleloak edo berdinak' : '∄'
                      }
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                    <strong>Proba:</strong> Jar ezazu bi ekuazioak koefiziente proportzionalekin (adib: 1,1,2 eta 2,2,4). Zer gertatzen da? Lerro berdina dira!
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 3: METHODS --- */}
        {activeTab === 'methods' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Ordezkatze Metodoa */}
            <Section title="1. Ordezkatze Metodoa" icon={GitBranch}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">Ideia: ekuazio batetik aldagai bat <strong>bakartu</strong>, eta bestean <strong>ordeztu</strong>.</p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">Adibidea</p>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-2xl text-slate-600">{`{`}</div>
                    <div className="font-mono text-lg space-y-1">
                      <p><span className="text-violet-400">x + 2y = 7</span></p>
                      <p><span className="text-cyan-400">3x - y = 7</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Bakartu aldagai bat', desc: '1. ekuaziotik x bakartu:', result: 'x = 7 - 2y', color: 'violet' },
                    { step: 2, title: 'Ordeztu beste ekuazioan', desc: 'x ordez (7 - 2y) jarri 2. ekuazioan:', result: '3(7 - 2y) - y = 7', color: 'cyan' },
                    { step: 3, title: 'Ebatzi y', desc: 'Garatu eta sinplifikatu:', result: '21 - 6y - y = 7 → -7y = -14 → y = 2', color: 'blue' },
                    { step: 4, title: 'Aurkitu x', desc: 'y = 2 ordeztu 1. urratsean:', result: 'x = 7 - 2(2) = 3', color: 'emerald' },
                  ].map(s => (
                    <div key={s.step} className={`p-4 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-sm shrink-0`}>
                          {s.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{s.title}</h3>
                          <p className="text-xs text-slate-500 mb-1">{s.desc}</p>
                          <p className={`font-mono text-sm text-${s.color}-700 font-bold`}>{s.result}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center font-mono font-bold text-emerald-700">
                  Soluzioa: x = 3, y = 2 → (3, 2)
                </div>
              </div>
            </Section>

            {/* Berdintze Metodoa */}
            <Section title="2. Berdintze Metodoa" icon={ListOrdered}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">Ideia: bi ekuazioetan <strong>aldagai berdina bakartu</strong> eta ondoren <strong>berdindu</strong>.</p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">Adibidea</p>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-2xl text-slate-600">{`{`}</div>
                    <div className="font-mono text-lg space-y-1">
                      <p><span className="text-violet-400">2x + y = 8</span></p>
                      <p><span className="text-cyan-400">x - y = 1</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Bakartu y bi ekuazioetan', result: '1) y = 8 - 2x     2) y = x - 1', color: 'violet' },
                    { step: 2, title: 'Berdindu bi adierazpenak', result: '8 - 2x = x - 1', color: 'cyan' },
                    { step: 3, title: 'Ebatzi x', result: '8 + 1 = x + 2x → 9 = 3x → x = 3', color: 'blue' },
                    { step: 4, title: 'Aurkitu y', result: 'y = 3 - 1 = 2', color: 'emerald' },
                  ].map(s => (
                    <div key={s.step} className={`p-4 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-sm shrink-0`}>
                          {s.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{s.title}</h3>
                          <p className={`font-mono text-sm text-${s.color}-700 font-bold`}>{s.result}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center font-mono font-bold text-emerald-700">
                  Soluzioa: x = 3, y = 2 → (3, 2)
                </div>
              </div>
            </Section>

            {/* Murrizketa Metodoa */}
            <Section title="3. Murrizketa (Laburpen) Metodoa" icon={Calculator}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">Ideia: ekuazioak <strong>batu edo kendu</strong> aldagai bat ezabatzeko. Beharrezkoa bada, aldez aurretik biderkatu.</p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">Adibidea</p>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-2xl text-slate-600">{`{`}</div>
                    <div className="font-mono text-lg space-y-1">
                      <p><span className="text-violet-400">3x + 2y = 16</span></p>
                      <p><span className="text-cyan-400">x - 2y = 0</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Begiratu koefizienteak', desc: 'y-ren koefizienteak +2 eta -2 dira: kontrajarriak! Batu dezakegu zuzenean.', color: 'violet' },
                    { step: 2, title: 'Batu bi ekuazioak', result: '(3x + 2y) + (x - 2y) = 16 + 0 → 4x = 16', color: 'cyan' },
                    { step: 3, title: 'Ebatzi x', result: 'x = 16 / 4 = 4', color: 'blue' },
                    { step: 4, title: 'Aurkitu y', result: '4 - 2y = 0 → y = 2', color: 'emerald' },
                  ].map(s => (
                    <div key={s.step} className={`p-4 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-sm shrink-0`}>
                          {s.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{s.title}</h3>
                          {s.desc && <p className="text-xs text-slate-500 mb-1">{s.desc}</p>}
                          {s.result && <p className={`font-mono text-sm text-${s.color}-700 font-bold`}>{s.result}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center font-mono font-bold text-emerald-700">
                  Soluzioa: x = 4, y = 2 → (4, 2)
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Koefizienteak ez badira kontrajarriak?</strong> Biderkatu ekuazio bat (edo biak) zenbaki egoki batez.</p>
                    <p className="font-mono mt-2 text-xs">
                      3x + <strong>4y</strong> = 10<br/>
                      2x + <strong>3y</strong> = 7
                    </p>
                    <p className="text-xs mt-1">→ 1. ekuazioa ×3 eta 2. ekuazioa ×(-4) → y desagertu!</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* When to use which */}
            <Section title="Zein metodo aukeratu?" icon={AlertTriangle}>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                  <h3 className="font-bold text-violet-800 mb-2">Ordezkatze</h3>
                  <p className="text-sm text-slate-600">Aldagai bat <strong>dagoeneko bakartua</strong> dagoenean edo bakartzen erraza denean.</p>
                  <p className="text-xs text-violet-600 font-mono mt-2">y = 2x + 1</p>
                </div>
                <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
                  <h3 className="font-bold text-cyan-800 mb-2">Berdintze</h3>
                  <p className="text-sm text-slate-600"><strong>Bi ekuazioetan</strong> aldagai berdina bakartzeko erraza denean.</p>
                  <p className="text-xs text-cyan-600 font-mono mt-2">y = ... eta y = ...</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-2">Murrizketa</h3>
                  <p className="text-sm text-slate-600">Koefizienteak <strong>berdinak edo kontrajarriak</strong> direnean, edo zenbaki handiekin.</p>
                  <p className="text-xs text-blue-600 font-mono mt-2">+2y eta -2y</p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Section title="Entrenamendua" icon={Brain} className="border-violet-200 ring-4 ring-violet-50/50">
                <div className="max-w-xl mx-auto">

                  <div className="flex justify-center mb-6">
                    <div className="bg-violet-50 border border-violet-100 px-6 py-2 rounded-full text-sm font-bold text-violet-700 flex items-center gap-3">
                      <span>Puntuazioa: {score}/{total}</span>
                      {total > 0 && <span className="text-xs opacity-60">({Math.round((score / total) * 100)}%)</span>}
                    </div>
                  </div>
                {total > 0 && (
                  <button onClick={() => reset()} className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors">
                    Puntuazioa berrezarri
                  </button>
                )}

                  {practiceProblem && (
                    <div className="space-y-8 text-center">

                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-violet-500"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Ebatzi sistema</div>
                        <div className="flex justify-center items-center gap-4">
                          <div className="text-3xl text-slate-300 font-light">{`{`}</div>
                          <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold space-y-2 text-left">
                            <p>{practiceProblem.display1}</p>
                            <p>{practiceProblem.display2}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                         <p className="text-slate-600 mb-2">Zeintzuk dira x eta y-ren balioak?</p>
                         <div className="flex gap-4 justify-center">
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-400">x =</span>
                                <input
                                    type="number"
                                    placeholder="?"
                                    value={userInputs.x}
                                    onChange={(e) => setUserInputs({...userInputs, x: e.target.value})}
                                    className="w-24 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-lg font-bold"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-400">y =</span>
                                <input
                                    type="number"
                                    placeholder="?"
                                    value={userInputs.y}
                                    onChange={(e) => setUserInputs({...userInputs, y: e.target.value})}
                                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                    className="w-24 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-lg font-bold"
                                />
                            </div>
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
                                 feedback === 'invalid' ? 'Mesedez, sartu bi zenbaki.' :
                                 'Ia-ia... Saiatu berriro!'}
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
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in text-left">
                             <strong>Pista:</strong> Saiatu ordezkatze metodoarekin:
                             <ol className="list-decimal list-inside mt-2 space-y-1">
                               <li>1. ekuaziotik bakartu x (edo y)</li>
                               <li>Ordeztu 2. ekuazioan</li>
                               <li>Ebatzi aldagai bakarra duen ekuazioa</li>
                               <li>Itzuli eta aurkitu bestea</li>
                             </ol>
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
                            className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-500 transition-all flex items-center gap-2 animate-in fade-in"
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

      <RelatedTopics currentId="sys-2x2" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-violet-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
