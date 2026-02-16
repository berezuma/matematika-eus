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
  ChefHat,
  Car,
  Percent,
  Scale,
  Calculator,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Interactive Proportion Graph ---

const ProportionGraph = ({ k, type }) => {
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
    const originX = 60;
    const originY = height - 40;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = originX; x <= width; x += scale) {
      ctx.moveTo(x, 10);
      ctx.lineTo(x, originY);
    }
    for (let y = originY; y >= 10; y -= scale) {
      ctx.moveTo(originX, y);
      ctx.lineTo(width - 10, y);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, 10);
    ctx.lineTo(originX, originY);
    ctx.lineTo(width - 10, originY);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 1; i <= Math.floor((width - originX - 10) / scale); i++) {
      ctx.fillText(i.toString(), originX + i * scale, originY + 16);
    }
    ctx.textAlign = 'right';
    for (let i = 1; i <= Math.floor((originY - 10) / scale); i++) {
      ctx.fillText(i.toString(), originX - 8, originY - i * scale + 4);
    }

    // Draw curve
    ctx.strokeStyle = type === 'direct' ? '#e11d48' : '#7c3aed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let firstPoint = true;

    for (let px = originX + 1; px < width - 10; px++) {
      const x = (px - originX) / scale;
      if (x <= 0) continue;
      let y;
      if (type === 'direct') {
        y = k * x;
      } else {
        y = k / x;
      }
      const py = originY - y * scale;
      if (py < 5 || py > originY) {
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

    // Draw some example points
    const points = type === 'direct'
      ? [1, 2, 3, 4, 5].filter(x => k * x * scale < originY - 10)
      : [1, 2, 3, 4, 5].filter(x => (k / x) * scale < originY - 10 && k / x > 0.3);

    points.forEach(x => {
      const y = type === 'direct' ? k * x : k / x;
      const px = originX + x * scale;
      const py = originY - y * scale;
      if (px < width - 10 && py > 10) {
        ctx.fillStyle = type === 'direct' ? '#e11d48' : '#7c3aed';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - 20, originY + 16);
    ctx.fillText('y', originX - 16, 20);

  }, [k, type]);

  return (
    <canvas ref={canvasRef} width={500} height={350} className="w-full h-auto rounded-lg border border-slate-200 bg-white"/>
  );
};

// --- Percentage Bar ---

const PercentageBar = ({ value, total }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${Math.min(pct, 100)}%` }}
        >
          {pct >= 15 && <span className="text-white text-xs font-bold">{pct.toFixed(1)}%</span>}
        </div>
      </div>
      {pct < 15 && <p className="text-xs text-slate-500 text-center">{pct.toFixed(1)}%</p>}
    </div>
  );
};

// --- Main Component ---

export default function Proportzionaltasuna() {
  const [activeTab, setActiveTab] = useState('concept');
  const [labType, setLabType] = useState('direct');
  const [labK, setLabK] = useState(2);
  const [pctValue, setPctValue] = useState(25);
  const [pctTotal, setPctTotal] = useState(200);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('prop');

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const types = ['rule3_direct', 'rule3_inverse', 'percentage', 'find_percent'];
    const type = types[Math.floor(Math.random() * types.length)];

    let prob;

    if (type === 'rule3_direct') {
      const a = (Math.floor(Math.random() * 8) + 2); // 2-9
      const b = a * (Math.floor(Math.random() * 5) + 2); // multiple of a
      const c = Math.floor(Math.random() * 8) + 3; // 3-10
      const solution = (b * c) / a;
      const units = [
        { u1: 'kg fruta', u2: '€' },
        { u1: 'ordu', u2: 'km' },
        { u1: 'litro', u2: '€' },
        { u1: 'pertsona', u2: 'opil' }
      ];
      const unit = units[Math.floor(Math.random() * units.length)];
      prob = {
        type,
        display: `${a} ${unit.u1} → ${b} ${unit.u2}\n${c} ${unit.u1} → ? ${unit.u2}`,
        solution,
        hint: `Zuzenki proportzionala: (${b} × ${c}) ÷ ${a} = ?`
      };
    } else if (type === 'rule3_inverse') {
      const workers1 = Math.floor(Math.random() * 5) + 2; // 2-6
      const days1 = Math.floor(Math.random() * 8) + 3; // 3-10
      const workers2 = Math.floor(Math.random() * 5) + 2;
      while (workers2 === workers1) {
        // avoid same number
        break;
      }
      const product = workers1 * days1;
      const solution = product / workers2;
      if (!Number.isInteger(solution)) {
        // Regenerate with nice numbers
        return generateProblem();
      }
      prob = {
        type,
        display: `${workers1} langile → ${days1} egun\n${workers2} langile → ? egun`,
        solution,
        hint: `Alderantziz proportzionala: (${workers1} × ${days1}) ÷ ${workers2} = ?`
      };
    } else if (type === 'percentage') {
      const total = [50, 80, 100, 120, 150, 200, 250, 300, 400, 500][Math.floor(Math.random() * 10)];
      const pct = [10, 15, 20, 25, 30, 40, 50, 60, 75][Math.floor(Math.random() * 9)];
      const solution = (pct * total) / 100;
      prob = {
        type,
        display: `${total}-ren %${pct} zenbat da?`,
        solution,
        hint: `(${pct} × ${total}) ÷ 100 = ?`
      };
    } else {
      // Find percentage
      const total = [50, 80, 100, 120, 200, 250, 400, 500][Math.floor(Math.random() * 8)];
      const pct = [10, 20, 25, 30, 40, 50, 60, 75][Math.floor(Math.random() * 8)];
      const part = (pct * total) / 100;
      prob = {
        type,
        display: `${part} zenbateko ehunekoa da ${total}-tik?`,
        solution: pct,
        hint: `(${part} ÷ ${total}) × 100 = ?`
      };
    }

    setPracticeProblem(prob);
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
    if (Math.abs(userVal - practiceProblem.solution) < 0.01) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  const pctResult = pctTotal > 0 ? (pctValue / 100) * pctTotal : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-rose-600 transition-colors ${activeTab === 'concept' ? 'text-rose-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-rose-600 transition-colors ${activeTab === 'viz' ? 'text-rose-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('percentages')} className={`hover:text-rose-600 transition-colors ${activeTab === 'percentages' ? 'text-rose-600' : ''}`}>Ehunekoak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all shadow-sm shadow-rose-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Proportzio<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">naltasuna</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hiru erregela, ehunekoak eta proportzio zuzenak eta alderantzizkoak: eguneroko bizitzako matematika praktikoena.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'percentages', 'practice'].map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'percentages' ? 'Ehunekoak' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zertarako balio du?" icon={Zap} className="border-rose-200 ring-4 ring-rose-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <ChefHat size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Sukaldean</h3>
                     <p className="text-sm text-slate-600">
                        Errezeta bat 4 pertsonarentzat da, baina 6 pertsonarentzat prestatu behar duzu. <strong>Zenbat irin behar duzu?</strong> Hiru erregela zuzenarekin ebazten da!
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Car size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Bidaiak eta Abiadura</h3>
                     <p className="text-sm text-slate-600">
                        80 km/h-ra joaten bazara, 3 ordutan 240 km egiten dituzu. Baina 120 km/h-ra? <strong>Abiadura igo → denbora jaitsi</strong>: alderantzizko proportzionaltasuna!
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <Percent size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Deskontuak eta BEZ</h3>
                     <p className="text-sm text-slate-600">
                        "%30 deskontua", "%21 BEZ"... Dendetan, bankuetan eta fakturetan ehunekoak <strong>nonahi</strong> daude. Jakin behar dira kalkulatzen!
                     </p>
                  </div>
               </div>
            </Section>

            {/* Direct vs Inverse */}
            <Section title="Proportzionaltasun Motak" icon={Scale}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-rose-600" size={24} />
                    <h3 className="font-bold text-rose-900 text-lg">Zuzeneko Proportzionaltasuna</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Magnitude bat <strong>handitu</strong> ahala, bestea ere <strong>handitzen</strong> da, erritmo berdinean.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-rose-200 space-y-3">
                    <div className="font-mono text-sm text-center">
                      <span className="text-rose-600 font-bold">y = k · x</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>2 kg sagar → 3€</p>
                      <p>4 kg sagar → 6€</p>
                      <p>6 kg sagar → 9€</p>
                    </div>
                    <p className="text-xs text-rose-600 font-bold">k = 1.5 (konstante proportzionala)</p>
                  </div>
                  <div className="mt-3 p-2 bg-rose-100 rounded-lg text-xs text-rose-800 text-center font-bold">
                    y/x = k (beti konstante berdina)
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-violet-50 border border-violet-100">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="text-violet-600" size={24} />
                    <h3 className="font-bold text-violet-900 text-lg">Alderantzizko Proportzionaltasuna</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Magnitude bat <strong>handitu</strong> ahala, bestea <strong>txikitzen</strong> da.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-violet-200 space-y-3">
                    <div className="font-mono text-sm text-center">
                      <span className="text-violet-600 font-bold">y = k / x</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>2 langile → 12 egun</p>
                      <p>4 langile → 6 egun</p>
                      <p>6 langile → 4 egun</p>
                    </div>
                    <p className="text-xs text-violet-600 font-bold">k = 24 (lan totala beti berdina)</p>
                  </div>
                  <div className="mt-3 p-2 bg-violet-100 rounded-lg text-xs text-violet-800 text-center font-bold">
                    x · y = k (biderkadura beti konstante berdina)
                  </div>
                </div>
              </div>
            </Section>

            {/* Rule of Three */}
            <Section title="Hiru Erregela" icon={Calculator}>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Hiru datu ezagunen bidez, laugarrena aurkitzeko metodoa. Proportzio mota identifikatu behar da lehenik!
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-rose-700 mb-3 flex items-center gap-2">
                      <TrendingUp size={16} /> Hiru Erregela Zuzena
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm space-y-2 mb-3">
                      <p>3 litro → 4.5€</p>
                      <p>5 litro → <strong>x</strong></p>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <p className="text-rose-600 font-bold">x = (4.5 × 5) / 3 = 7.5€</p>
                      </div>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-lg text-xs text-rose-800">
                      <strong>Formula:</strong> x = (b × c) / a
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-violet-700 mb-3 flex items-center gap-2">
                      <TrendingDown size={16} /> Hiru Erregela Alderantzizkoa
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm space-y-2 mb-3">
                      <p>4 langile → 6 egun</p>
                      <p>3 langile → <strong>x</strong></p>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <p className="text-violet-600 font-bold">x = (4 × 6) / 3 = 8 egun</p>
                      </div>
                    </div>
                    <div className="bg-violet-50 p-3 rounded-lg text-xs text-violet-800">
                      <strong>Formula:</strong> x = (a × b) / c
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Nola bereizi?</strong> Galdera hau egin: "Bat handitu → bestea ere handitzen da?"</p>
                    <p className="mt-1"><strong>BAI</strong> → Zuzeneko (litro gehiago = euro gehiago)</p>
                    <p><strong>EZ</strong> → Alderantzizko (langile gehiago = egun gutxiago)</p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Proportzio Laborategia" icon={Calculator}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center p-2">
                  <ProportionGraph k={labK} type={labType} />
                </div>

                <div className="space-y-5">
                  {/* Type selector */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLabType('direct')}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
                        labType === 'direct'
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <TrendingUp size={14} className="inline mr-1" /> Zuzena
                    </button>
                    <button
                      onClick={() => setLabType('inverse')}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
                        labType === 'inverse'
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <TrendingDown size={14} className="inline mr-1" /> Alderant.
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border ${labType === 'direct' ? 'bg-rose-50 border-rose-100' : 'bg-violet-50 border-violet-100'} text-center`}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: labType === 'direct' ? '#e11d48' : '#7c3aed' }}>Funtzioa</p>
                    <p className="font-mono text-lg font-bold" style={{ color: labType === 'direct' ? '#9f1239' : '#5b21b6' }}>
                      {labType === 'direct' ? `y = ${labK}x` : `y = ${labK} / x`}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Konstante (k)</label>
                      <span className={`text-xs font-mono px-2 rounded font-bold ${labType === 'direct' ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'}`}>{labK}</span>
                    </div>
                    <input
                      type="range" min="0.5" max="6" step="0.5"
                      value={labK}
                      onChange={(e) => setLabK(parseFloat(e.target.value))}
                      className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${labType === 'direct' ? 'accent-rose-500' : 'accent-violet-500'}`}
                    />
                  </div>

                  {/* Example table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600">
                          <th className="py-2 px-3 text-left font-bold">x</th>
                          <th className="py-2 px-3 text-left font-bold">y</th>
                          <th className="py-2 px-3 text-left font-bold text-xs">{labType === 'direct' ? 'y/x' : 'x·y'}</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        {[1, 2, 3, 4, 5].map(x => {
                          const y = labType === 'direct' ? labK * x : labK / x;
                          const check = labType === 'direct' ? y / x : x * y;
                          return (
                            <tr key={x} className="border-t border-slate-100">
                              <td className="py-1.5 px-3">{x}</td>
                              <td className="py-1.5 px-3">{y % 1 === 0 ? y : y.toFixed(2)}</td>
                              <td className="py-1.5 px-3 text-emerald-600 font-bold">{check % 1 === 0 ? check : check.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-800">
                    <strong>Begiratu:</strong> {labType === 'direct'
                      ? 'y/x beti berdina da! Hori da konstante proportzionala (k).'
                      : 'x · y beti berdina da! Hori da alderantzizko konstantea (k).'
                    }
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 3: PERCENTAGES --- */}
        {activeTab === 'percentages' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Ehunekoak (%)" icon={Percent}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Ehunekoa = "ehuneko bat"</p>
                  <div className="text-4xl md:text-5xl font-mono font-bold">
                    <span className="text-rose-400">%25</span>
                    <span className="text-slate-500 mx-3">=</span>
                    <span className="text-white">25/100</span>
                    <span className="text-slate-500 mx-3">=</span>
                    <span className="text-pink-400">0.25</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">Ehunekoa kalkulatu</h3>
                    <p className="text-xs text-slate-500 mb-3">200-ren %30 zenbat da?</p>
                    <div className="font-mono text-sm space-y-1 bg-slate-50 p-3 rounded-lg">
                      <p>(30 × 200) / 100 =</p>
                      <p className="text-rose-600 font-bold">= 60</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Edo: 0.30 × 200 = 60
                    </div>
                  </div>
                  <div className="p-5 bg-white border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">Ehunekoa aurkitu</h3>
                    <p className="text-xs text-slate-500 mb-3">45 zenbateko % da 180-tik?</p>
                    <div className="font-mono text-sm space-y-1 bg-slate-50 p-3 rounded-lg">
                      <p>(45 / 180) × 100 =</p>
                      <p className="text-rose-600 font-bold">= %25</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Zatitu eta 100z biderkatu
                    </div>
                  </div>
                  <div className="p-5 bg-white border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">Totala aurkitu</h3>
                    <p className="text-xs text-slate-500 mb-3">60 kopuru baten %30 da. Zein da totala?</p>
                    <div className="font-mono text-sm space-y-1 bg-slate-50 p-3 rounded-lg">
                      <p>(60 × 100) / 30 =</p>
                      <p className="text-rose-600 font-bold">= 200</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Gurutzatutako biderketa
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Interactive percentage calculator */}
            <Section title="Ehuneko Kalkulagailua" icon={Calculator}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-rose-600 uppercase">Ehunekoa (%)</label>
                        <span className="text-xs font-mono bg-rose-100 text-rose-700 px-2 rounded font-bold">{pctValue}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" step="1"
                        value={pctValue}
                        onChange={(e) => setPctValue(parseInt(e.target.value))}
                        className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Totala</label>
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 rounded font-bold">{pctTotal}</span>
                      </div>
                      <input
                        type="range" min="10" max="1000" step="10"
                        value={pctTotal}
                        onChange={(e) => setPctTotal(parseInt(e.target.value))}
                        className="w-full accent-slate-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white p-6 rounded-xl text-center flex flex-col justify-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Emaitza</p>
                    <p className="text-3xl font-mono font-bold">
                      <span className="text-rose-400">{pctValue}%</span>
                      <span className="text-slate-500 text-lg"> × </span>
                      <span className="text-white">{pctTotal}</span>
                      <span className="text-slate-500 text-lg"> = </span>
                      <span className="text-emerald-400">{pctResult % 1 === 0 ? pctResult : pctResult.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <PercentageBar value={pctValue} total={100} />

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Deskontua (%30)', val: pctTotal - (0.30 * pctTotal) },
                    { label: 'BEZ (%21)', val: pctTotal * 1.21 },
                    { label: 'Erdia (%50)', val: pctTotal * 0.50 }
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center">
                      <p className="text-xs text-slate-500 font-bold mb-1">{item.label}</p>
                      <p className="font-mono font-bold text-slate-800">{item.val % 1 === 0 ? item.val : item.val.toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Common percentages */}
            <Section title="Ohiko Ehunekoak Buruz Ikasi" icon={BookOpen}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { pct: '10%', frac: '1/10', dec: '×0.1', trick: 'Koma bat ezkerrera mugitu' },
                  { pct: '20%', frac: '1/5', dec: '×0.2', trick: '%10 kalkulatu eta ×2' },
                  { pct: '25%', frac: '1/4', dec: '×0.25', trick: 'Laurdena: ÷4' },
                  { pct: '33%', frac: '1/3', dec: '×0.33', trick: 'Herena: ÷3' },
                  { pct: '50%', frac: '1/2', dec: '×0.5', trick: 'Erdia: ÷2' },
                  { pct: '75%', frac: '3/4', dec: '×0.75', trick: '%25 kendu totalari' },
                  { pct: '100%', frac: '1/1', dec: '×1', trick: 'Totala bera da!' },
                  { pct: '200%', frac: '2/1', dec: '×2', trick: 'Bikoitza' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl text-center hover:border-rose-200 transition-colors">
                    <p className="text-xl font-bold text-rose-600">{item.pct}</p>
                    <p className="text-xs text-slate-500 font-mono">{item.frac} = {item.dec}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.trick}</p>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Section title="Entrenamendua" icon={Brain} className="border-rose-200 ring-4 ring-rose-50/50">
                <div className="max-w-xl mx-auto">

                  <div className="flex justify-center mb-6">
                    <div className="bg-rose-50 border border-rose-100 px-6 py-2 rounded-full text-sm font-bold text-rose-700">
                      Puntuazioa: {score}
                    </div>
                  </div>

                  {practiceProblem && (
                    <div className="space-y-8 text-center">

                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                          {practiceProblem.type === 'rule3_direct' ? 'Hiru Erregela Zuzena' :
                           practiceProblem.type === 'rule3_inverse' ? 'Hiru Erregela Alderantzizkoa' :
                           practiceProblem.type === 'percentage' ? 'Ehunekoa Kalkulatu' :
                           'Ehunekoa Aurkitu'}
                        </div>
                        <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold mt-4 whitespace-pre-line">
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
                                className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors text-lg font-bold"
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
                            className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-500 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
