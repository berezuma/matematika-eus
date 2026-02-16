import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Check,
  RefreshCw,
  Calculator,
  Brain,
  ArrowRight,
  AlertTriangle,
  Scale,
  Zap,
  ShoppingCart,
  Thermometer,
  Gamepad2,
  ListOrdered,
  Equal
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Interactive Graph Component ---

const LinearGraph = ({ a, b }) => {
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
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    for (let i = -Math.floor(width / (2 * scale)); i <= Math.floor(width / (2 * scale)); i++) {
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

    // Draw line: y = ax + b
    const f = (x) => a * x + b;

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const xStart = (0 - centerX) / scale;
    const xEnd = (width - centerX) / scale;

    const yStart = f(xStart);
    const yEnd = f(xEnd);

    ctx.moveTo(0, centerY - yStart * scale);
    ctx.lineTo(width, centerY - yEnd * scale);
    ctx.stroke();

    // Draw root (x-intercept): ax + b = 0 → x = -b/a
    if (a !== 0) {
      const root = -b / a;
      const px = centerX + root * scale;
      const py = centerY;
      if (px >= -10 && px <= width + 10) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label the root
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`x = ${root % 1 === 0 ? root : root.toFixed(2)}`, px, py - 12);
      }
    }

    // Draw y-intercept
    const yIntPx = centerY - b * scale;
    if (yIntPx >= 0 && yIntPx <= height) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(centerX, yIntPx, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`(0, ${b})`, centerX + 10, yIntPx - 8);
    }

  }, [a, b]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white"/>
  );
};

// --- Main Component ---

export default function LehenMailakoa() {
  const [activeTab, setActiveTab] = useState('concept');
  const [graphParams, setGraphParams] = useState({ a: 2, b: -3 });
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const types = ['basic', 'both_sides', 'parentheses'];
    const type = types[Math.floor(Math.random() * types.length)];

    let prob;

    if (type === 'basic') {
      // ax + b = c
      const x = Math.floor(Math.random() * 17) - 8; // -8 to 8
      const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const b = Math.floor(Math.random() * 19) - 9; // -9 to 9
      const c = a * x + b;
      prob = {
        type,
        display: `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
        solution: x,
        a, b, c,
        steps: [
          `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
          `${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`,
          `${a}x = ${c - b}`,
          `x = ${c - b} / ${a}`,
          `x = ${x}`
        ]
      };
    } else if (type === 'both_sides') {
      // ax + b = cx + d
      const x = Math.floor(Math.random() * 11) - 5; // -5 to 5
      const a1 = Math.floor(Math.random() * 6) + 2; // 2 to 7
      let a2 = Math.floor(Math.random() * 6) + 1; // 1 to 6
      if (a2 >= a1) a2 = a1 - 1;
      if (a2 === 0) a2 = 1;
      const b1 = Math.floor(Math.random() * 13) - 6; // -6 to 6
      const b2 = (a1 - a2) * x + b1;
      prob = {
        type,
        display: `${a1}x ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}`,
        solution: x,
        steps: [
          `${a1}x ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}`,
          `${a1}x - ${a2}x = ${b2 >= 0 ? '' : '-'}${Math.abs(b2)} ${b1 >= 0 ? '-' : '+'} ${Math.abs(b1)}`,
          `${a1 - a2}x = ${b2 - b1}`,
          `x = ${b2 - b1} / ${a1 - a2}`,
          `x = ${x}`
        ]
      };
    } else {
      // a(x + b) = c
      const x = Math.floor(Math.random() * 13) - 6; // -6 to 6
      const a = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const b = Math.floor(Math.random() * 11) - 5; // -5 to 5
      const c = a * (x + b);
      prob = {
        type,
        display: `${a}(x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = ${c}`,
        solution: x,
        steps: [
          `${a}(x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = ${c}`,
          `${a}x ${a * b >= 0 ? '+' : '-'} ${Math.abs(a * b)} = ${c}`,
          `${a}x = ${c} ${a * b >= 0 ? '-' : '+'} ${Math.abs(a * b)}`,
          `${a}x = ${c - a * b}`,
          `x = ${x}`
        ]
      };
    }

    setPracticeProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
    setShowSteps(false);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const userVal = parseFloat(userInput);

    if (isNaN(userVal)) {
      setFeedback('invalid');
      return;
    }

    setFeedback(userVal === practiceProblem.solution ? 'correct' : 'incorrect');
  };

  const getRoot = () => {
    if (graphParams.a === 0) return null;
    return -graphParams.b / graphParams.a;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-blue-600 transition-colors ${activeTab === 'concept' ? 'text-blue-600' : ''}`}>Teoria eta Testuingurua</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-blue-600 transition-colors ${activeTab === 'viz' ? 'text-blue-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('steps')} className={`hover:text-blue-600 transition-colors ${activeTab === 'steps' ? 'text-blue-600' : ''}`}>Pausoak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-sm shadow-blue-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Lehen Mailako <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Ekuazioak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Matematikaren oinarri-oinarria: ezezaguna aurkitzeko artea. Balantza bat bezala, bi aldeak berdin mantendu behar dira.
          </p>
        </div>

        {/* Content Switcher (Mobile) */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'steps', 'practice'].map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'steps' ? 'Pausoak' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: CONCEPTS & CONTEXT --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Zertarako balio du? */}
            <Section title="Zertarako balio du honek?" icon={Zap} className="border-blue-200 ring-4 ring-blue-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <ShoppingCart size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Eguneroko Kontaketa</h3>
                     <p className="text-sm text-slate-600">
                        Dendara joan eta 3 opil berdin erosi dituzu, gehi 2€-ko poltsa bat. Guztira 11€ ordaindu duzu. <strong>Zenbat balio du opil bakoitzak?</strong> Hori da ekuazio lineala: 3x + 2 = 11.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Thermometer size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Zientzia eta Tenperatura</h3>
                     <p className="text-sm text-slate-600">
                        Celsius-etik Fahrenheit-era bihurtzeko: <strong>F = 1.8·C + 32</strong>. Formula hau ekuazio lineala da! Zientzialariek milaka ekuazio lineal erabiltzen dituzte egunero.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Gamepad2 size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Bideo-Jokoak eta Kodeak</h3>
                     <p className="text-sm text-slate-600">
                        Bideo-joko batek pertsonaia mugitzen duenean, ekuazio linealak erabiltzen ditu: <strong>posizio_berria = abiadura · denbora + hasierako_posizioa</strong>. Programatzaile guztiek jakin behar dute!
                     </p>
                  </div>
               </div>
            </Section>

            {/* Ekuazioaren Anatomia */}
            <Section title="Ekuazioaren Anatomia" icon={BookOpen}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="bg-slate-900 text-white p-8 rounded-2xl font-mono text-center text-3xl md:text-4xl shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"></div>

                    <span className="relative inline-block cursor-help group/item" title="Koefizientea">
                      <span className="text-blue-400 font-bold">a</span>x
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Koefizientea</span>
                    </span>

                    <span className="mx-2 text-slate-500">+</span>

                    <span className="relative inline-block cursor-help group/item" title="Termino askea">
                      <span className="text-emerald-400 font-bold">b</span>
                       <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Termino Askea</span>
                    </span>

                    <span className="mx-2 text-slate-500">=</span>

                    <span className="relative inline-block cursor-help group/item" title="Emaitza">
                      <span className="text-cyan-400 font-bold">c</span>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Emaitza</span>
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 rounded bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">x</div>
                      <p className="text-sm text-blue-800"><strong>Ezezaguna (x):</strong> Aurkitu behar dugun balioa. "Zer zenbaki jarriko genuke hemen?"</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="w-6 h-6 rounded bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">a</div>
                      <p className="text-sm text-emerald-800"><strong>Koefizientea (a):</strong> x-ren zenbat aldiz dagoen adierazten du. Adibidez, 3x-ek esan nahi du "x-ren hirukotza".</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">=</div>
                      <p className="text-sm text-slate-700"><strong>Berdin zeinua:</strong> Balantza bat bezala! Ezkerraldeak eta eskuinaldeak gauza bera balio dute.</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                    <AlertTriangle className="shrink-0" size={20} />
                    <p><strong>Kontuz:</strong> "Lehen mailakoa" da x-ren berreturarik altuena <strong>1</strong> delako (x¹ = x). x² agertzen bada, bigarren mailakoa litzateke!</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Mota desberdinak */}
            <Section title="Ekuazio Mota Desberdinak" icon={ListOrdered}>
              <div className="grid md:grid-cols-2 gap-6">

                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-800">Oinarrizkoa</h3>
                     <span className="text-xs bg-slate-200 px-2 py-1 rounded font-mono">ax + b = c</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Mota sinpleena. x alde batera eraman eta zenbakiak bestera.</p>
                  <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm space-y-2">
                    <p>3x + 5 = 20</p>
                    <p className="text-slate-500">→ 3x = 20 - 5</p>
                    <p className="text-slate-500">→ 3x = 15</p>
                    <p className="text-blue-600 font-bold">→ x = 5</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-800">Bi aldeetan x</h3>
                     <span className="text-xs bg-slate-200 px-2 py-1 rounded font-mono">ax + b = cx + d</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">x bi aldeetan dago. Bildu x-ak alde batean.</p>
                  <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm space-y-2">
                    <p>5x + 3 = 2x + 12</p>
                    <p className="text-slate-500">→ 5x - 2x = 12 - 3</p>
                    <p className="text-slate-500">→ 3x = 9</p>
                    <p className="text-blue-600 font-bold">→ x = 3</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-800">Parentesiekin</h3>
                     <span className="text-xs bg-slate-200 px-2 py-1 rounded font-mono">a(x + b) = c</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Lehenik parentesia ireki (biderketa banatzailea), gero ebatzi.</p>
                  <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm space-y-2">
                    <p>4(x - 2) = 12</p>
                    <p className="text-slate-500">→ 4x - 8 = 12</p>
                    <p className="text-slate-500">→ 4x = 20</p>
                    <p className="text-blue-600 font-bold">→ x = 5</p>
                  </div>
                </div>

                <div className="md:col-span-1 p-6 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-blue-900">Arau Nagusia</h3>
                     <Scale size={20} className="text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-800 mb-4">
                    Ekuazio bat <strong>balantza bat</strong> da. Alde batean egiten duzun edozer, <strong>bestean ere egin behar da</strong>.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">+5?</span>
                      <span className="text-slate-600">→ Bi aldeetan +5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">×3?</span>
                      <span className="text-slate-600">→ Bi aldeetan ×3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">÷2?</span>
                      <span className="text-slate-600">→ Bi aldeetan ÷2</span>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: VISUALIZATION --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Laborategi Grafikoa" icon={Calculator}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center p-2">
                  <LinearGraph {...graphParams} />
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Funtzioa</p>
                    <p className="font-mono text-lg text-blue-900 font-bold">
                       y = {graphParams.a === 1 ? '' : graphParams.a === -1 ? '-' : graphParams.a}x
                       {graphParams.b >= 0 ? ' + ' : ' - '}{Math.abs(graphParams.b)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Malda (a)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 rounded font-bold text-blue-600">{graphParams.a}</span>
                      </div>
                      <input
                        type="range" min="-5" max="5" step="0.5"
                        value={graphParams.a}
                        onChange={(e) => setGraphParams({...graphParams, a: parseFloat(e.target.value)})}
                        className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-slate-400 mt-1">Lerroa zenbat igotzen den pausu bakoitzeko</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Jatorri-ordena (b)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 rounded font-bold text-emerald-600">{graphParams.b}</span>
                      </div>
                      <input
                        type="range" min="-8" max="8" step="1"
                        value={graphParams.b}
                        onChange={(e) => setGraphParams({...graphParams, b: parseFloat(e.target.value)})}
                        className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-slate-400 mt-1">Non mozten duen Y ardatza</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                          <div className="text-xs text-red-500 uppercase font-bold mb-1">Erroa (x)</div>
                          <div className="font-mono font-bold text-red-700 text-lg">
                              {graphParams.a !== 0
                                ? `x = ${((-graphParams.b / graphParams.a) % 1 === 0) ? -graphParams.b / graphParams.a : (-graphParams.b / graphParams.a).toFixed(2)}`
                                : '∄'
                              }
                          </div>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                          <div className="text-xs text-emerald-500 uppercase font-bold mb-1">Y ardatza</div>
                          <div className="font-mono font-bold text-emerald-700 text-lg">
                              (0, {graphParams.b})
                          </div>
                      </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                    <strong>Proba ezazu:</strong> Malda (a) 0-ra jarri. Zer gertatzen da? Lerroa <em>horizontala</em> bihurtzen da!
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 3: STEP-BY-STEP --- */}
        {activeTab === 'steps' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Urratsez Urrats Ebazteko Metodoa" icon={ListOrdered}>
              <div className="space-y-8">

                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Adibidea: Ebatzi ekuazioa</p>
                  <p className="text-3xl md:text-4xl font-mono text-center mb-8">
                    <span className="text-blue-400">5</span>x <span className="text-slate-500">-</span> <span className="text-emerald-400">3</span> <span className="text-slate-500">=</span> <span className="text-cyan-400">2</span>x <span className="text-slate-500">+</span> <span className="text-cyan-400">9</span>
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "x-ak alde batera bildu",
                      desc: "x duten gaiak ezkerraldean jarri. Aldea aldatzen dugunean, zeinua aldatzen da.",
                      before: "5x - 3 = 2x + 9",
                      after: "5x - 2x = 9 + 3",
                      color: "blue"
                    },
                    {
                      step: 2,
                      title: "Sinplifikatu bi aldeak",
                      desc: "Eragiketa guztiak egin: batu x-ak eta batu zenbakiak.",
                      before: "5x - 2x = 9 + 3",
                      after: "3x = 12",
                      color: "purple"
                    },
                    {
                      step: 3,
                      title: "x bakartu",
                      desc: "x-ren koefizienteaz zatitu bi aldeak.",
                      before: "3x = 12",
                      after: "x = 12 ÷ 3 = 4",
                      color: "emerald"
                    },
                    {
                      step: 4,
                      title: "Konprobatu!",
                      desc: "x=4 ordeztu jatorrizko ekuazioan eta egiaztatu bi aldeak berdinak direla.",
                      before: "5(4) - 3 = 2(4) + 9",
                      after: "17 = 17 ✓",
                      color: "green"
                    }
                  ].map((s) => (
                    <div key={s.step} className={`p-6 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100 hover:border-${s.color}-300 transition-colors`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-lg shrink-0`}>
                          {s.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 mb-1">{s.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{s.desc}</p>
                          <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm flex items-center gap-3 flex-wrap">
                            <span className="text-slate-500">{s.before}</span>
                            <ArrowRight size={16} className="text-slate-400 shrink-0" />
                            <span className={`text-${s.color}-600 font-bold`}>{s.after}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 mt-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-yellow-500" />
                    Ohiko Akatsak
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs font-bold text-red-500 uppercase mb-2">Gaizki</p>
                      <p className="font-mono text-sm text-red-700">3x + 5 = 20</p>
                      <p className="font-mono text-sm text-red-700">3x = 20 + 5 = 25 ✗</p>
                      <p className="text-xs text-red-600 mt-2">Aldea aldatzean, zeinua <strong>aldatu</strong> behar da!</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-xs font-bold text-green-500 uppercase mb-2">Ondo</p>
                      <p className="font-mono text-sm text-green-700">3x + 5 = 20</p>
                      <p className="font-mono text-sm text-green-700">3x = 20 - 5 = 15 ✓</p>
                      <p className="text-xs text-green-600 mt-2">+5 aldea aldatzean <strong>-5</strong> bihurtzen da.</p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs font-bold text-red-500 uppercase mb-2">Gaizki</p>
                      <p className="font-mono text-sm text-red-700">2(x + 3) = 10</p>
                      <p className="font-mono text-sm text-red-700">2x + 3 = 10 ✗</p>
                      <p className="text-xs text-red-600 mt-2">Parentesia irekitzean, <strong>gai guztiak</strong> biderkatu behar dira!</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-xs font-bold text-green-500 uppercase mb-2">Ondo</p>
                      <p className="font-mono text-sm text-green-700">2(x + 3) = 10</p>
                      <p className="font-mono text-sm text-green-700">2x + 6 = 10 ✓</p>
                      <p className="text-xs text-green-600 mt-2">2 × x = 2x eta 2 × 3 = 6.</p>
                    </div>
                  </div>
                </div>

              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Section title="Entrenamendua" icon={Brain} className="border-blue-200 ring-4 ring-blue-50/50">
                <div className="max-w-xl mx-auto">
                  {practiceProblem && (
                    <div className="space-y-8 text-center">

                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                          {practiceProblem.type === 'basic' ? 'Oinarrizkoa' : practiceProblem.type === 'both_sides' ? 'Bi aldeetan x' : 'Parentesiekin'}
                        </div>
                        <div className="text-xs text-slate-400 mb-4">Aurkitu x-ren balioa</div>
                        <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold mb-2">
                          {practiceProblem.display}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                         <p className="text-slate-600 mb-2">Zein da x-ren balioa?</p>
                         <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-400 text-lg">x =</span>
                            <input
                                type="number"
                                placeholder="?"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg font-bold"
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
                              <div className="flex gap-3 mt-2">
                                <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900">
                                    Pista bat?
                                </button>
                                <button onClick={() => setShowSteps(true)} className="text-sm underline hover:text-red-900">
                                    Pausoak ikusi?
                                </button>
                              </div>
                          )}
                        </div>
                      )}

                      {showHint && feedback === 'incorrect' && (
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                             <strong>Pista:</strong> Gogoratu: x-ak alde batera eraman eta zenbakiak bestera. Aldea aldatzen duzunean, zeinua aldatzen da!
                          </div>
                      )}

                      {showSteps && feedback === 'incorrect' && practiceProblem.steps && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-left text-blue-800 animate-in fade-in space-y-1">
                             <strong>Urratsak:</strong>
                             {practiceProblem.steps.map((step, i) => (
                               <p key={i} className={`font-mono ${i === practiceProblem.steps.length - 1 ? 'font-bold text-blue-700' : 'text-blue-600'}`}>
                                 {i > 0 && '→ '}{step}
                               </p>
                             ))}
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
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-500 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
