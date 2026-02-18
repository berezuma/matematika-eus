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
  Cpu,
  Dna,
  Rocket,
  ListOrdered,
  Calculator,
  Layers
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

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

// --- Interactive Exponential Graph ---

const PowerGraph = ({ base, exponent }) => {
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
    const centerY = height * 0.75;

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
    for (let i = -Math.floor(width / (2 * scale)); i <= Math.floor(width / (2 * scale)); i++) {
      if (i === 0) continue;
      const px = centerX + i * scale;
      ctx.fillText(i.toString(), px, centerY + 16);
    }

    // Draw y = base^x curve
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
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

    // Mark the point (exponent, base^exponent)
    const resultY = Math.pow(base, exponent);
    if (isFinite(resultY) && !isNaN(resultY)) {
      const ptX = centerX + exponent * scale;
      const ptY = centerY - resultY * scale;
      if (ptX >= -10 && ptX <= width + 10 && ptY >= -10 && ptY <= height + 10) {
        // Dotted lines to axes
        ctx.strokeStyle = '#d9770640';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ptX, ptY);
        ctx.lineTo(ptX, centerY);
        ctx.moveTo(ptX, ptY);
        ctx.lineTo(centerX, ptY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Point
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ptX, ptY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        const label = `(${exponent}, ${resultY % 1 === 0 ? resultY : resultY.toFixed(2)})`;
        ctx.fillText(label, ptX + 12, ptY - 8);
      }
    }

    // Mark (0, 1) always — any base^0 = 1
    const ptY01 = centerY - 1 * scale;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX, ptY01, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'left';
    ctx.fillText('(0, 1)', centerX + 8, ptY01 - 6);

  }, [base, exponent]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white"/>
  );
};

// --- Visual Blocks Component ---

const PowerBlocks = ({ base, exp }) => {
  const result = Math.pow(base, exp);
  const maxBlocks = 64;

  if (result > maxBlocks || result < 0 || !Number.isInteger(result)) {
    return (
      <div className="text-center text-sm text-slate-400 py-4">
        {result > maxBlocks ? `${result} bloke — gehiegi bistaratzeko!` : `${result} — ezin da blokeekin erakutsi`}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 justify-center py-2">
      {Array.from({ length: result }, (_, i) => (
        <div key={i} className="w-5 h-5 rounded bg-amber-400 border border-amber-500 shadow-sm" />
      ))}
    </div>
  );
};

// --- Main Component ---

export default function BerreturakErroak() {
  useDocumentTitle('Berreturak eta Erroak');
  const [activeTab, setActiveTab] = useState('concept');
  const [labBase, setLabBase] = useState(2);
  const [labExp, setLabExp] = useState(3);
  const [graphBase, setGraphBase] = useState(2);
  const [graphExp, setGraphExp] = useState(3);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('pot');

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const types = ['power', 'root', 'property'];
    const type = types[Math.floor(Math.random() * types.length)];

    let prob;

    if (type === 'power') {
      const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10, -2, -3, -4, -5];
      const b = bases[Math.floor(Math.random() * bases.length)];
      const e = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const solution = Math.pow(b, e);
      prob = {
        type,
        display: `(${b})${toSuperscript(e)} = ?`,
        solution,
        hint: `Biderkatu ${b} bere buruarekin ${e} aldiz: ${Array(e).fill(`(${b})`).join(' × ')}`
      };
    } else if (type === 'root') {
      const perfects = [
        { val: 4, root: 2 }, { val: 9, root: 3 }, { val: 16, root: 4 },
        { val: 25, root: 5 }, { val: 36, root: 6 }, { val: 49, root: 7 },
        { val: 64, root: 8 }, { val: 81, root: 9 }, { val: 100, root: 10 },
        { val: 121, root: 11 }, { val: 144, root: 12 }
      ];
      const p = perfects[Math.floor(Math.random() * perfects.length)];
      prob = {
        type,
        display: `√${p.val} = ?`,
        solution: p.root,
        hint: `Zein zenbaki bere buruarekin biderkatzean ${p.val} ematen du? __ × __ = ${p.val}`
      };
    } else {
      // Property problems
      const subTypes = [
        () => {
          const b = Math.floor(Math.random() * 5) + 2;
          const e1 = Math.floor(Math.random() * 3) + 1;
          const e2 = Math.floor(Math.random() * 3) + 1;
          return {
            display: `${b}${toSuperscript(e1)} × ${b}${toSuperscript(e2)} = ${b}^?`,
            solution: e1 + e2,
            hint: `Oinarri berdina biderkatuz gero, berretzaileak BATU: ${b}^${e1} × ${b}^${e2} = ${b}^(${e1}+${e2})`
          };
        },
        () => {
          const b = Math.floor(Math.random() * 4) + 2;
          const e1 = Math.floor(Math.random() * 3) + 3;
          const e2 = Math.floor(Math.random() * Math.min(e1, 3)) + 1;
          return {
            display: `${b}${toSuperscript(e1)} ÷ ${b}${toSuperscript(e2)} = ${b}^?`,
            solution: e1 - e2,
            hint: `Oinarri berdina zatituz gero, berretzaileak KENDU: ${b}^${e1} ÷ ${b}^${e2} = ${b}^(${e1}-${e2})`
          };
        },
        () => {
          const b = Math.floor(Math.random() * 4) + 2;
          const e1 = Math.floor(Math.random() * 2) + 2;
          const e2 = Math.floor(Math.random() * 2) + 2;
          return {
            display: `(${b}${toSuperscript(e1)})${toSuperscript(e2)} = ${b}^?`,
            solution: e1 * e2,
            hint: `Berretura baten berretura: berretzaileak BIDERKATU: (${b}^${e1})^${e2} = ${b}^(${e1}×${e2})`
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
    if (userVal === practiceProblem.solution) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  const labResult = Math.pow(labBase, labExp);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-amber-600 transition-colors ${activeTab === 'concept' ? 'text-amber-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-amber-600 transition-colors ${activeTab === 'viz' ? 'text-amber-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('properties')} className={`hover:text-amber-600 transition-colors ${activeTab === 'properties' ? 'text-amber-600' : ''}`}>Propietateak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all shadow-sm shadow-amber-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Berreturak eta <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Erroak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Zenbakiak bere buruarekin biderkatzeko modu azkarra, eta alderantzizko eragiketa: erroa aurkitzea.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'properties', 'practice'].map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'properties' ? 'Propietateak' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zertarako balio dute?" icon={Zap} className="border-amber-200 ring-4 ring-amber-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Cpu size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Informatika eta Byteak</h3>
                     <p className="text-sm text-slate-600">
                        Ordenagailuek <strong>2-ren berreturak</strong> erabiltzen dituzte: 2¹⁰ = 1024 byte = 1 KB. Zure 8 GB-ko RAMa <strong>2³³</strong> byte da!
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <Dna size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Biologia eta Hazkundea</h3>
                     <p className="text-sm text-slate-600">
                        Bakteria bat 20 minuturo bikoizten da. 10 orduren buruan, <strong>2³⁰</strong> = mila milioi bakteria baino gehiago!
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                        <Rocket size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Distantziak Espazioan</h3>
                     <p className="text-sm text-slate-600">
                        Eguzkitik Lurreraino: 1.5 × 10⁸ km. Zientzialariek <strong>berretura hamarrekoak</strong> erabiltzen dituzte zenbaki erraldoiak idazteko.
                     </p>
                  </div>
               </div>
            </Section>

            <Section title="Zer da berretura bat?" icon={BookOpen}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Berretura</p>
                    <div className="text-5xl md:text-7xl font-mono flex items-start justify-center gap-1">
                      <span className="text-amber-400 font-bold relative">
                        a
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-amber-300 whitespace-nowrap">Oinarria</span>
                      </span>
                      <span className="text-orange-400 font-bold text-3xl md:text-4xl relative" style={{ verticalAlign: 'super' }}>
                        n
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-orange-300 whitespace-nowrap">Berretzailea</span>
                      </span>
                    </div>
                    <p className="text-slate-400 mt-12 text-lg font-mono">
                      = <span className="text-amber-400">a</span> × <span className="text-amber-400">a</span> × <span className="text-amber-400">a</span> × ··· <span className="text-slate-500">(n aldiz)</span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="font-mono text-xl text-center mb-2">3⁴ = 3 × 3 × 3 × 3 = <strong className="text-amber-700">81</strong></p>
                    <p className="text-xs text-center text-slate-500">Oinarria: 3 | Berretzailea: 4</p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <p className="font-mono text-xl text-center mb-2">5² = 5 × 5 = <strong className="text-orange-700">25</strong></p>
                    <p className="text-xs text-center text-slate-500">"5-ren karratua" esaten zaio</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Kontuz zeinu negatiboekin!</strong></p>
                    <p className="font-mono mt-1">(-3)² = (-3) × (-3) = <strong>+9</strong> ← Parentesiekin: oinarri osoa negatiboa</p>
                    <p className="font-mono">-3² = -(3 × 3) = <strong>-9</strong> ← Parentesirik gabe: berretura lehenik, gero zeinua</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Zer da erro bat?" icon={Layers}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Erroa berreturaren <strong>alderantzizko eragiketa</strong> da. "Zein zenbaki, bere buruarekin n aldiz biderkatzean, a ematen du?"
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl text-center">
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Berretura</p>
                      <p className="text-3xl font-mono"><span className="text-amber-400">5</span><span className="text-orange-400 text-xl" style={{ verticalAlign: 'super' }}>2</span> = <span className="text-teal-400">25</span></p>
                    </div>
                    <div className="text-slate-500 text-2xl">⇄</div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Erroa</p>
                      <p className="text-3xl font-mono">√<span className="text-teal-400">25</span> = <span className="text-amber-400">5</span></p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-2xl font-mono font-bold text-amber-600">√49 = 7</p>
                    <p className="text-xs text-slate-500 mt-1">Erro karratua (2. mailakoa)</p>
                    <p className="text-xs text-slate-400">7 × 7 = 49</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-2xl font-mono font-bold text-orange-600">∛27 = 3</p>
                    <p className="text-xs text-slate-500 mt-1">Erro kubikoa (3. mailakoa)</p>
                    <p className="text-xs text-slate-400">3 × 3 × 3 = 27</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-2xl font-mono font-bold text-red-600">⁴√16 = 2</p>
                    <p className="text-xs text-slate-500 mt-1">4. mailako erroa</p>
                    <p className="text-xs text-slate-400">2 × 2 × 2 × 2 = 16</p>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-sm text-teal-800">
                  <strong>Zenbaki perfektu karratuak</strong> gogoratu: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144... Hauen erroa zenbaki osoa da!
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Block visualizer */}
            <Section title="Bloke Bisualizatzailea" icon={Layers}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-amber-600 uppercase">Oinarria</label>
                        <span className="text-xs font-mono bg-amber-100 text-amber-700 px-2 rounded font-bold">{labBase}</span>
                      </div>
                      <input
                        type="range" min="1" max="6" step="1"
                        value={labBase}
                        onChange={(e) => setLabBase(parseInt(e.target.value))}
                        className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-orange-600 uppercase">Berretzailea</label>
                        <span className="text-xs font-mono bg-orange-100 text-orange-700 px-2 rounded font-bold">{labExp}</span>
                      </div>
                      <input
                        type="range" min="0" max="6" step="1"
                        value={labExp}
                        onChange={(e) => setLabExp(parseInt(e.target.value))}
                        className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white p-6 rounded-xl text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Emaitza</p>
                    <p className="text-3xl md:text-4xl font-mono font-bold">
                      <span className="text-amber-400">{labBase}</span>
                      <span className="text-orange-400 text-xl" style={{ verticalAlign: 'super' }}>{labExp}</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-teal-400">{labResult}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {labExp === 0 ? 'Edozein zenbaki 0. berreturara = 1' :
                       labExp === 1 ? `${labBase} bere horretan` :
                       Array(labExp).fill(labBase).join(' × ')}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-xs text-amber-600 font-bold uppercase mb-2">Bloke bisuala ({labResult} bloke)</p>
                  <PowerBlocks base={labBase} exp={labExp} />
                </div>
              </div>
            </Section>

            {/* Graph */}
            <Section title="Grafiko Esponentziala" icon={Calculator}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center p-2">
                  <PowerGraph base={graphBase} exponent={graphExp} />
                </div>
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Funtzioa</p>
                    <p className="font-mono text-lg text-amber-900 font-bold">
                       y = {graphBase}<sup>x</sup>
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Oinarria</label>
                      <span className="text-xs font-mono bg-amber-100 px-2 rounded font-bold text-amber-600">{graphBase}</span>
                    </div>
                    <input
                      type="range" min="0.5" max="4" step="0.5"
                      value={graphBase}
                      onChange={(e) => setGraphBase(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Puntua (x)</label>
                      <span className="text-xs font-mono bg-red-100 px-2 rounded font-bold text-red-600">{graphExp}</span>
                    </div>
                    <input
                      type="range" min="-3" max="5" step="1"
                      value={graphExp}
                      onChange={(e) => setGraphExp(parseInt(e.target.value))}
                      className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                    <div className="text-xs text-emerald-500 uppercase font-bold mb-1">Puntu markatu</div>
                    <div className="font-mono font-bold text-emerald-700">
                      {graphBase}<sup>{graphExp}</sup> = {(() => {
                        const r = Math.pow(graphBase, graphExp);
                        return r % 1 === 0 ? r : r.toFixed(3).replace('.', ',');
                      })()}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                    <strong>Proba:</strong> Oinarria 1-era jarri. Kurbak lerro zuzen horizontal bat egiten du (1ⁿ = 1 beti)!
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 3: PROPERTIES --- */}
        {activeTab === 'properties' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Berreturen Propietateak" icon={ListOrdered}>
              <div className="space-y-4">
                {[
                  {
                    name: 'Oinarri berdinaren biderketa',
                    formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ',
                    example: '2³ × 2⁴ = 2⁷ = 128',
                    explanation: 'Berretzaileak BATU',
                    color: 'amber'
                  },
                  {
                    name: 'Oinarri berdinaren zatiketa',
                    formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ',
                    example: '5⁶ ÷ 5² = 5⁴ = 625',
                    explanation: 'Berretzaileak KENDU',
                    color: 'orange'
                  },
                  {
                    name: 'Berretura baten berretura',
                    formula: '(aᵐ)ⁿ = aᵐˣⁿ',
                    example: '(3²)³ = 3⁶ = 729',
                    explanation: 'Berretzaileak BIDERKATU',
                    color: 'red'
                  },
                  {
                    name: 'Biderkadura baten berretura',
                    formula: '(a × b)ⁿ = aⁿ × bⁿ',
                    example: '(2 × 3)² = 2² × 3² = 4 × 9 = 36',
                    explanation: 'Berretura BANATU',
                    color: 'purple'
                  },
                  {
                    name: 'Zatidura baten berretura',
                    formula: '(a ÷ b)ⁿ = aⁿ ÷ bⁿ',
                    example: '(6 ÷ 3)² = 6² ÷ 3² = 36 ÷ 9 = 4',
                    explanation: 'Berretura BANATU',
                    color: 'pink'
                  },
                ].map((prop, i) => (
                  <div key={i} className={`p-5 rounded-xl bg-${prop.color}-50 border border-${prop.color}-100 hover:border-${prop.color}-300 transition-colors`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{prop.name}</h3>
                        <p className="font-mono text-xl font-bold text-slate-700">{prop.formula}</p>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-mono text-sm text-slate-600">{prop.example}</p>
                          <p className={`text-xs text-${prop.color}-600 font-bold mt-1`}>{prop.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Kasu Bereziak" icon={AlertTriangle}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-3xl font-bold text-amber-600">a⁰ = 1</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Edozein zenbaki (≠0) zero berretzailera = <strong>1</strong></p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>5⁰ = 1 | 100⁰ = 1 | (-7)⁰ = 1</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-3xl font-bold text-orange-600">a¹ = a</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Edozein zenbaki 1 berretzailera = <strong>bere burua</strong></p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>5¹ = 5 | 100¹ = 100 | (-7)¹ = -7</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-3xl font-bold text-red-600">a⁻ⁿ = 1/aⁿ</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Berretzaile negatiboa = <strong>alderantzizkoa</strong></p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>2⁻³ = 1/2³ = 1/8 = 0,125</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-xl">
                  <div className="text-center mb-3">
                    <span className="font-mono text-3xl font-bold text-teal-600">a^(1/n) = ⁿ√a</span>
                  </div>
                  <p className="text-sm text-slate-600 text-center">Berretzaile zatikia = <strong>erroa</strong></p>
                  <div className="mt-3 font-mono text-xs text-slate-500 text-center space-y-1">
                    <p>8^(1/3) = ∛8 = 2</p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Section title="Entrenamendua" icon={Brain} className="border-amber-200 ring-4 ring-amber-50/50">
                <div className="max-w-xl mx-auto">

                  <div className="flex justify-center mb-6">
                    <div className="bg-amber-50 border border-amber-100 px-6 py-2 rounded-full text-sm font-bold text-amber-700 flex items-center gap-3">
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
                        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                          {practiceProblem.type === 'power' ? 'Berretura' : practiceProblem.type === 'root' ? 'Erroa' : 'Propietatea'}
                        </div>
                        <div className="text-xs text-slate-400 mb-4">Kalkulatu emaitza</div>
                        <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold">
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
                                className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-lg font-bold"
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
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                             <strong>Pista:</strong> {practiceProblem.hint}
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
                            className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-500 transition-all flex items-center gap-2 animate-in fade-in"
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

      <RelatedTopics currentId="pot" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
