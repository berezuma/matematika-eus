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
  Thermometer,
  Mountain,
  Wallet,
  ListOrdered,
  Plus,
  Minus,
  X as XIcon,
  Divide,
  ArrowLeftRight
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Interactive Number Line Component ---

const NumberLine = ({ highlightA, highlightB, operation, result }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30;
    const range = Math.floor(width / (2 * scale));

    // Main line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, centerY);
    ctx.lineTo(width - 10, centerY);
    ctx.stroke();

    // Arrows at ends
    ctx.beginPath();
    ctx.moveTo(width - 10, centerY);
    ctx.lineTo(width - 20, centerY - 6);
    ctx.moveTo(width - 10, centerY);
    ctx.lineTo(width - 20, centerY + 6);
    ctx.moveTo(10, centerY);
    ctx.lineTo(20, centerY - 6);
    ctx.moveTo(10, centerY);
    ctx.lineTo(20, centerY + 6);
    ctx.stroke();

    // Tick marks and numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    for (let i = -range; i <= range; i++) {
      const px = centerX + i * scale;
      ctx.strokeStyle = i === 0 ? '#334155' : '#cbd5e1';
      ctx.lineWidth = i === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(px, centerY - 8);
      ctx.lineTo(px, centerY + 8);
      ctx.stroke();

      ctx.fillStyle = i === 0 ? '#0f172a' : '#64748b';
      ctx.font = i === 0 ? 'bold 13px monospace' : '12px monospace';
      ctx.fillText(i.toString(), px, centerY + 24);
    }

    // Draw highlight for A
    if (highlightA !== null && Math.abs(highlightA) <= range) {
      const pxA = centerX + highlightA * scale;
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(pxA, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('a', pxA, centerY - 16);
    }

    // Draw highlight for B
    if (highlightB !== null && Math.abs(highlightB) <= range) {
      const pxB = centerX + highlightB * scale;
      ctx.fillStyle = '#d946ef';
      ctx.beginPath();
      ctx.arc(pxB, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d946ef';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('b', pxB, centerY - 16);
    }

    // Draw result
    if (result !== null && Math.abs(result) <= range) {
      const pxR = centerX + result * scale;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pxR, centerY + 1, 8, 0, Math.PI * 2);
      ctx.fill();
      // White ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pxR, centerY + 1, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('= ' + result, pxR, centerY + 46);
    }

    // Draw arrow from A to result (showing the operation)
    if (highlightA !== null && result !== null && operation && Math.abs(highlightA) <= range && Math.abs(result) <= range) {
      const pxA = centerX + highlightA * scale;
      const pxR = centerX + result * scale;

      ctx.strokeStyle = '#10b98180';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();

      // Draw arc from A to result
      const midX = (pxA + pxR) / 2;
      const arcHeight = -40;
      ctx.moveTo(pxA, centerY - 10);
      ctx.quadraticCurveTo(midX, centerY + arcHeight, pxR, centerY - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [highlightA, highlightB, operation, result]);

  return (
    <canvas ref={canvasRef} width={600} height={120} className="w-full h-auto rounded-lg border border-slate-200 bg-white"/>
  );
};

// --- Main Component ---

export default function ZenbakiOsoak() {
  useDocumentTitle('Zenbaki Osoak');
  const [activeTab, setActiveTab] = useState('concept');
  const [labA, setLabA] = useState(3);
  const [labB, setLabB] = useState(-5);
  const [labOp, setLabOp] = useState('+');
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('int');

  useEffect(() => {
    generateProblem();
  }, []);

  const computeResult = () => {
    switch (labOp) {
      case '+': return labA + labB;
      case '-': return labA - labB;
      case '×': return labA * labB;
      case '÷': return labB !== 0 ? labA / labB : null;
      default: return null;
    }
  };

  const generateProblem = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 21) - 10; // -10 to 10
    const b = Math.floor(Math.random() * 21) - 10;

    let solution;
    let display;

    if (op === '+') {
      solution = a + b;
      display = `(${a}) + (${b})`;
    } else if (op === '-') {
      solution = a - b;
      display = `(${a}) - (${b})`;
    } else {
      solution = a * b;
      display = `(${a}) × (${b})`;
    }

    setPracticeProblem({ display, solution, op, a, b });
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
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

  const labResult = computeResult();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-teal-600 transition-colors ${activeTab === 'concept' ? 'text-teal-600' : ''}`}>Teoria eta Testuingurua</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-teal-600 transition-colors ${activeTab === 'viz' ? 'text-teal-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('rules')} className={`hover:text-teal-600 transition-colors ${activeTab === 'rules' ? 'text-teal-600' : ''}`}>Zeinu Arauak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all shadow-sm shadow-teal-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Zenbaki <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Osoak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Positiboak, negatiboak eta zeroa: zenbaki hauen mundua ezagutu, eta ikasi haiekin eragiketa guztiak egiten.
          </p>
        </div>

        {/* Content Switcher (Mobile) */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'rules', 'practice'].map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'rules' ? 'Arauak' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Zertarako */}
            <Section title="Zertarako balio dute?" icon={Zap} className="border-teal-200 ring-4 ring-teal-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-3">
                        <Thermometer size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Tenperatura</h3>
                     <p className="text-sm text-slate-600">
                        Neguan termometroak <strong>-5°C</strong> markatzen duenean, zenbaki negatiboak erabiltzen ari gara. Zero azpitik dagoen tenperatura "negatibo" bat da.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Wallet size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Dirua eta Zorrak</h3>
                     <p className="text-sm text-slate-600">
                        50€ badituzu eta 80€-ko erosketak egiten badituzu, <strong>-30€</strong> dituzu: zor bat. Bankuek egunero erabiltzen dituzte zenbaki negatiboak.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                        <Mountain size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Altitudera eta Sakonera</h3>
                     <p className="text-sm text-slate-600">
                        Itsas mailaren gainetik: <strong>+8.849m</strong> (Everest). Itsas mailaren azpitik: <strong>-10.994m</strong> (Mariana Hobia). Zeroa itsas maila da.
                     </p>
                  </div>
               </div>
            </Section>

            {/* Zer dira? */}
            <Section title="Zer dira Zenbaki Osoak?" icon={BookOpen}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-slate-400 to-teal-500"></div>
                  <p className="text-center text-sm text-slate-400 mb-4 uppercase tracking-widest font-bold">Zenbaki lerroa</p>
                  <div className="flex items-center justify-center gap-1 md:gap-2 text-lg md:text-2xl font-mono flex-wrap">
                    <span className="text-slate-600">···</span>
                    {[-5, -4, -3, -2, -1].map(n => (
                      <span key={n} className="text-red-400 px-1 md:px-2">{n}</span>
                    ))}
                    <span className="text-yellow-400 px-2 font-bold text-3xl">0</span>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="text-teal-400 px-1 md:px-2">+{n}</span>
                    ))}
                    <span className="text-slate-600">···</span>
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-slate-500 px-4">
                    <span>← Txikiagoak (negatiboak)</span>
                    <span>Handiagoak (positiboak) →</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">ℤ⁻</div>
                    <h3 className="font-bold text-slate-800 mb-1">Negatiboak</h3>
                    <p className="text-sm text-slate-600">..., -3, -2, -1</p>
                    <p className="text-xs text-slate-400 mt-1">Zero baino txikiagoak</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">0</div>
                    <h3 className="font-bold text-slate-800 mb-1">Zeroa</h3>
                    <p className="text-sm text-slate-600">Ez positiboa, ez negatiboa</p>
                    <p className="text-xs text-slate-400 mt-1">Muga puntua</p>
                  </div>
                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-center">
                    <div className="text-3xl font-bold text-teal-500 mb-2">ℤ⁺</div>
                    <h3 className="font-bold text-slate-800 mb-1">Positiboak</h3>
                    <p className="text-sm text-slate-600">+1, +2, +3, ...</p>
                    <p className="text-xs text-slate-400 mt-1">Zero baino handiagoak</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Kontuz:</strong> Zenbaki osoen multzoa <strong>ℤ</strong> hizkiz adierazten da (alemanezko "Zahlen" hitzetik). Zatikiak eta dezimalak <strong>ez</strong> dira zenbaki osoak!</p>
                </div>
              </div>
            </Section>

            {/* Balio absolutua */}
            <Section title="Balio Absolutua" icon={ArrowLeftRight}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <p className="text-slate-600">
                    Zenbaki baten <strong>balio absolutua</strong> haren distantzia da zerotik, norabidea kontuan hartu gabe. <strong>| |</strong> barren artean idazten da.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="font-mono text-2xl text-teal-600 font-bold">|+7| = 7</p>
                      <p className="text-xs text-slate-500 mt-1">+7 zerotik 7 urrats dago</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="font-mono text-2xl text-red-500 font-bold">|-7| = 7</p>
                      <p className="text-xs text-slate-500 mt-1">-7 ere zerotik 7 urrats dago</p>
                    </div>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 text-sm text-teal-800">
                    <strong>Ondorioa:</strong> Zenbaki kontrajarriek (<strong>+5</strong> eta <strong>-5</strong>) balio absolutu berdina dute! Baina kokapenean desberdinak dira.
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Eragiketen Laborategia" icon={ListOrdered}>
              <div className="space-y-6">

                <div className="bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
                  <NumberLine
                    highlightA={labA}
                    highlightB={labB}
                    operation={labOp}
                    result={labResult !== null && Number.isInteger(labResult) ? labResult : null}
                  />
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">

                    {/* A slider */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-blue-500 uppercase">a balioa</label>
                        <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 rounded font-bold">{labA}</span>
                      </div>
                      <input
                        type="range" min="-9" max="9" step="1"
                        value={labA}
                        onChange={(e) => setLabA(parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Operation selector */}
                    <div className="flex gap-2">
                      {['+', '-', '×', '÷'].map(op => (
                        <button
                          key={op}
                          onClick={() => setLabOp(op)}
                          className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                            labOp === op
                              ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 scale-110'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>

                    {/* B slider */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-fuchsia-500 uppercase">b balioa</label>
                        <span className="text-xs font-mono bg-fuchsia-100 text-fuchsia-700 px-2 rounded font-bold">{labB}</span>
                      </div>
                      <input
                        type="range" min="-9" max="9" step="1"
                        value={labB}
                        onChange={(e) => setLabB(parseInt(e.target.value))}
                        className="w-full accent-fuchsia-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Result display */}
                  <div className="mt-6 bg-slate-900 text-white p-6 rounded-xl text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Emaitza</p>
                    <p className="text-3xl md:text-4xl font-mono font-bold">
                      <span className="text-blue-400">({labA})</span>
                      <span className="text-slate-500 mx-2">{labOp}</span>
                      <span className="text-fuchsia-400">({labB})</span>
                      <span className="text-slate-500 mx-2">=</span>
                      <span className={`${labResult !== null ? (labResult >= 0 ? 'text-teal-400' : 'text-red-400') : 'text-yellow-400'}`}>
                        {labResult !== null
                          ? (Number.isInteger(labResult) ? labResult : labResult.toFixed(2))
                          : '∄ (ezin da zeroaz zatitu)'
                        }
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quick insight */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-800">
                    <strong>Esperimentatu:</strong> Jar ezazu a = 5, eragiketa = +, b = -5. Emaitza <strong>0</strong> da. Zenbaki kontrajarriak batu eta elkar ezeztatzen dira!
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
                    <strong>Saiatu:</strong> Bi negatibo biderkatu: (-3) × (-4) = <strong>+12</strong>. Negatibo bi biderkatzean emaitza beti positiboa da!
                  </div>
                </div>

              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 3: SIGN RULES --- */}
        {activeTab === 'rules' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Batuketa eta Kenketa */}
            <Section title="Batuketa eta Kenketa" icon={Plus}>
              <div className="space-y-6">

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-teal-50 border border-teal-100">
                    <h3 className="font-bold text-teal-900 mb-3">Zeinu berdina: BATU eta zeinua mantendu</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-teal-200 font-mono text-sm">
                        <p>(+3) + (+5) = <span className="text-teal-600 font-bold">+8</span></p>
                        <p className="text-xs text-slate-500 mt-1">Biak positiboak → batu → positiboa</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-teal-200 font-mono text-sm">
                        <p>(-3) + (-5) = <span className="text-red-500 font-bold">-8</span></p>
                        <p className="text-xs text-slate-500 mt-1">Biak negatiboak → batu → negatiboa</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-3">Zeinu desberdina: KENDU eta handienaren zeinua</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-200 font-mono text-sm">
                        <p>(+7) + (-3) = <span className="text-teal-600 font-bold">+4</span></p>
                        <p className="text-xs text-slate-500 mt-1">7 - 3 = 4, handiena +7 → positiboa</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200 font-mono text-sm">
                        <p>(-7) + (+3) = <span className="text-red-500 font-bold">-4</span></p>
                        <p className="text-xs text-slate-500 mt-1">7 - 3 = 4, handiena -7 → negatiboa</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Trukoa:</strong> Zenbaki bat kentzea, haren <strong>kontrajarria</strong> batzea bezalakoa da!</p>
                    <p className="font-mono mt-1">(+5) - (+3) = (+5) + (-3) = <strong>+2</strong></p>
                    <p className="font-mono">(+5) - (-3) = (+5) + (+3) = <strong>+8</strong></p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Biderketa eta Zatiketa */}
            <Section title="Biderketa eta Zatiketa" icon={XIcon}>
              <div className="space-y-6">
                <p className="text-slate-600">Biderketan eta zatiketan <strong>zeinu-arau berdina</strong> da. Arau hau oso sinplea da:</p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700">
                      <p className="text-2xl mb-2">🟢 × 🟢</p>
                      <p className="font-mono text-lg"><span className="text-teal-400">+</span> × <span className="text-teal-400">+</span> = <span className="text-teal-400 font-bold">+</span></p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700">
                      <p className="text-2xl mb-2">🔴 × 🔴</p>
                      <p className="font-mono text-lg"><span className="text-red-400">-</span> × <span className="text-red-400">-</span> = <span className="text-teal-400 font-bold">+</span></p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700">
                      <p className="text-2xl mb-2">🟢 × 🔴</p>
                      <p className="font-mono text-lg"><span className="text-teal-400">+</span> × <span className="text-red-400">-</span> = <span className="text-red-400 font-bold">-</span></p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700">
                      <p className="text-2xl mb-2">🔴 × 🟢</p>
                      <p className="font-mono text-lg"><span className="text-red-400">-</span> × <span className="text-teal-400">+</span> = <span className="text-red-400 font-bold">-</span></p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                    <h3 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                      <Check size={16} /> Zeinu berdinak = Positiboa
                    </h3>
                    <div className="font-mono text-sm space-y-1 text-teal-700">
                      <p>(+4) × (+3) = +12</p>
                      <p>(-4) × (-3) = +12</p>
                      <p>(-10) ÷ (-2) = +5</p>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} /> Zeinu desberdinak = Negatiboa
                    </h3>
                    <div className="font-mono text-sm space-y-1 text-red-700">
                      <p>(+4) × (-3) = -12</p>
                      <p>(-4) × (+3) = -12</p>
                      <p>(+10) ÷ (-2) = -5</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl">
                  <h3 className="font-bold text-purple-800 mb-3">Trukoa: Kontatu negatiboak!</h3>
                  <p className="text-sm text-purple-700 mb-3">Biderketa/zatiketa kate batean, kontatu zenbat zeinu negatibo dauden:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-purple-200 font-mono text-sm">
                      <p>(-2) × (-3) × (+4) = <span className="text-teal-600 font-bold">+24</span></p>
                      <p className="text-xs text-purple-500 mt-1">2 negatibo (bikoitia) → positiboa</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-purple-200 font-mono text-sm">
                      <p>(-2) × (-3) × (-4) = <span className="text-red-500 font-bold">-24</span></p>
                      <p className="text-xs text-purple-500 mt-1">3 negatibo (bakoitia) → negatiboa</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-700 mt-3"><strong>Bikoitia</strong> = positiboa | <strong>Bakoitia</strong> = negatiboa</p>
                </div>

              </div>
            </Section>

            {/* Hierarkia */}
            <Section title="Eragiketen Hierarkia" icon={ListOrdered}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">Eragiketa bat baino gehiago daudenean, ordena hau jarraitu:</p>
                <div className="space-y-3">
                  {[
                    { step: '1.', title: 'Parentesiak', example: '(  ) barrukoa lehenik', color: 'red' },
                    { step: '2.', title: 'Berreturak eta Erroak', example: 'x², √x', color: 'orange' },
                    { step: '3.', title: 'Biderketa eta Zatiketa', example: '× eta ÷ (ezkerretik eskuinera)', color: 'purple' },
                    { step: '4.', title: 'Batuketa eta Kenketa', example: '+ eta - (ezkerretik eskuinera)', color: 'teal' },
                  ].map((item) => (
                    <div key={item.step} className={`flex items-center gap-4 p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100`}>
                      <div className={`w-10 h-10 rounded-full bg-${item.color}-100 text-${item.color}-700 flex items-center justify-center font-bold text-lg shrink-0`}>
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                        <p className="text-xs text-slate-500">{item.example}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
                  <h3 className="font-bold text-slate-800 mb-3">Adibidea</h3>
                  <div className="font-mono text-sm space-y-2">
                    <p className="text-slate-700">3 + 2 × (4 - 6)² - 1 =</p>
                    <p className="text-slate-500">= 3 + 2 × (-2)² - 1 <span className="text-xs text-red-500 ml-2">← Parentesiak</span></p>
                    <p className="text-slate-500">= 3 + 2 × 4 - 1 <span className="text-xs text-orange-500 ml-2">← Berretura</span></p>
                    <p className="text-slate-500">= 3 + 8 - 1 <span className="text-xs text-purple-500 ml-2">← Biderketa</span></p>
                    <p className="text-teal-600 font-bold">= 10 <span className="text-xs ml-2">← Batuketa/Kenketa</span></p>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Section title="Entrenamendua" icon={Brain} className="border-teal-200 ring-4 ring-teal-50/50">
                <div className="max-w-xl mx-auto">

                  {/* Score */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-teal-50 border border-teal-100 px-6 py-2 rounded-full text-sm font-bold text-teal-700 flex items-center gap-3">
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
                        <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                          {practiceProblem.op === '+' ? 'Batuketa' : practiceProblem.op === '-' ? 'Kenketa' : 'Biderketa'}
                        </div>
                        <div className="text-xs text-slate-400 mb-4">Kalkulatu emaitza</div>
                        <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold">
                          {practiceProblem.display} = ?
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
                                className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg font-bold"
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
                             <strong>Pista:</strong>
                             {practiceProblem.op === '+' && (
                               <span> Gogoratu: zeinu berdinak → batu eta zeinua mantendu. Zeinu desberdinak → kendu eta handienaren zeinua jarri.</span>
                             )}
                             {practiceProblem.op === '-' && (
                               <span> Trukoa: kentzea = kontrajarria batzea. ({practiceProblem.a}) - ({practiceProblem.b}) = ({practiceProblem.a}) + ({-practiceProblem.b})</span>
                             )}
                             {practiceProblem.op === '×' && (
                               <span> Zeinu berdinak → positiboa. Zeinu desberdinak → negatiboa. Gero biderkatu balio absolutuak: |{practiceProblem.a}| × |{practiceProblem.b}| = {Math.abs(practiceProblem.a * practiceProblem.b)}</span>
                             )}
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
                            className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-500 transition-all flex items-center gap-2 animate-in fade-in"
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

      <RelatedTopics currentId="int" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
