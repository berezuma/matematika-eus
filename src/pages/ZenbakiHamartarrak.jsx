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
  ListOrdered,
  Eye,
  Hash
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function decimalToFraction(decStr) {
  const str = decStr.trim();

  // Check for repeating notation: e.g. "0.3..." or "0.16..."
  if (str.includes('...')) {
    const clean = str.replace('...', '');
    const dotIndex = clean.indexOf('.');
    if (dotIndex === -1) return null;

    const intPart = clean.substring(0, dotIndex);
    const decPart = clean.substring(dotIndex + 1);

    // Pure repeating: all decimals repeat
    const num = parseInt(intPart + decPart) - parseInt(intPart || '0');
    const den = parseInt('9'.repeat(decPart.length));
    const g = gcd(Math.abs(num), den);
    return { num: num / g, den: den / g, steps: [
      `${str} hamartarra da`,
      `x = ${str.replace('...', '...')}`,
      `${den}x = ${intPart}${decPart}.${decPart}...`,
      `${den}x - x = ${num}`,
      `x = ${num}/${den} = ${num/g}/${den/g}`
    ]};
  }

  // Exact decimal
  const val = parseFloat(str);
  if (isNaN(val)) return null;

  const dotIdx = str.indexOf('.');
  if (dotIdx === -1) return { num: parseInt(str), den: 1, steps: [`${str} zenbaki osoa da = ${str}/1`] };

  const decimals = str.length - dotIdx - 1;
  const den = Math.pow(10, decimals);
  const num = Math.round(val * den);
  const g = gcd(Math.abs(num), den);

  return {
    num: num / g,
    den: den / g,
    steps: [
      `${str} hamartar zehatza da`,
      `${decimals} dezimal ditu → izendatzailea = ${'1' + '0'.repeat(decimals)}`,
      `Zatikia = ${num}/${den}`,
      g > 1 ? `Sinplifikatuz (÷${g}): ${num/g}/${den/g}` : `Dagoeneko sinplifikatuta dago`
    ]
  };
}

// Number line visualization
const NumberLine = ({ value }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const val = parseFloat(value) || 0;
    const center = Math.round(val);
    const range = 3;
    const minVal = center - range;
    const maxVal = center + range;
    const scale = w / (maxVal - minVal);

    // Draw line
    const lineY = h / 2;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(w, lineY);
    ctx.stroke();

    // Draw ticks and labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';

    for (let i = minVal; i <= maxVal; i++) {
      const x = (i - minVal) * scale;
      ctx.beginPath();
      ctx.moveTo(x, lineY - 8);
      ctx.lineTo(x, lineY + 8);
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();
      ctx.fillText(i.toString(), x, lineY + 24);
    }

    // Draw minor ticks
    for (let i = minVal; i < maxVal; i += 0.1) {
      const x = (i - minVal) * scale;
      ctx.beginPath();
      ctx.moveTo(x, lineY - 3);
      ctx.lineTo(x, lineY + 3);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw value point
    const px = (val - minVal) * scale;
    ctx.beginPath();
    ctx.arc(px, lineY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(val.toString(), px, lineY - 16);
  }, [value]);

  return <canvas ref={canvasRef} width={500} height={80} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />;
};

export default function ZenbakiHamartarrak() {
  useDocumentTitle('Zenbaki Hamartarrak');
  const [activeTab, setActiveTab] = useState('concept');
  const [labInput, setLabInput] = useState('0.75');
  const [labResult, setLabResult] = useState(null);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userNum, setUserNum] = useState('');
  const [userDen, setUserDen] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [practiceType, setPracticeType] = useState('toFraction');

  useEffect(() => {
    const result = decimalToFraction(labInput);
    setLabResult(result);
  }, [labInput]);

  useEffect(() => { generateProblem(); }, [practiceType]);

  const generateProblem = () => {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (practiceType === 'toFraction') {
      const den = [2, 4, 5, 8, 10, 20, 25, 50][randInt(0, 7)];
      const num = randInt(1, den - 1);
      const g = gcd(num, den);
      const decimal = (num / den).toString();
      setPracticeProblem({
        display: decimal,
        solutionNum: num / g,
        solutionDen: den / g,
        type: 'toFraction'
      });
    } else {
      const den = [2, 3, 4, 5, 6, 8, 10][randInt(0, 6)];
      const num = randInt(1, den * 3);
      const g = gcd(num, den);
      const decimal = parseFloat((num / den).toFixed(6));
      setPracticeProblem({
        display: `${num/g}/${den/g}`,
        solution: decimal,
        num: num / g,
        den: den / g,
        type: 'toDecimal'
      });
    }
    setUserNum('');
    setUserDen('');
    setFeedback(null);
    setShowSteps(false);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    if (practiceType === 'toFraction') {
      const n = parseInt(userNum);
      const d = parseInt(userDen);
      if (isNaN(n) || isNaN(d) || d === 0) { setFeedback('invalid'); return; }
      const g = gcd(Math.abs(n), Math.abs(d));
      const simpN = n / g;
      const simpD = d / g;
      setFeedback(simpN === practiceProblem.solutionNum && simpD === practiceProblem.solutionDen ? 'correct' : 'incorrect');
    } else {
      const val = parseFloat(userNum);
      if (isNaN(val)) { setFeedback('invalid'); return; }
      setFeedback(Math.abs(val - practiceProblem.solution) < 0.001 ? 'correct' : 'incorrect');
    }
  };

  const tabs = [
    { id: 'concept', label: 'Teoria' },
    { id: 'viz', label: 'Laborategia' },
    { id: 'steps', label: 'Formula' },
    { id: 'practice', label: 'Praktika' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.slice(0, 3).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`hover:text-emerald-600 transition-colors ${activeTab === t.id ? 'text-emerald-600' : ''}`}>{t.label}</button>
            ))}
            <button onClick={() => setActiveTab('practice')} className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200">Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Zenbaki <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">Hamartarrak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hamartarren motak, zatikira bihurtzea eta eragiketak hamartarrekin.
          </p>
        </div>

        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TEORIA */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Hamartar Motak" icon={ListOrdered}>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-2">Zehatzak</h3>
                  <p className="text-sm text-emerald-700 mb-3">Dezimal kopuru mugatu bat dute. Bukaeran amaitzen dira.</p>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 font-mono text-sm space-y-1">
                    <p>0.5 = 1/2</p>
                    <p>0.75 = 3/4</p>
                    <p>1.25 = 5/4</p>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-teal-50 border border-teal-100">
                  <h3 className="font-bold text-teal-800 mb-2">Aldizkako puruak</h3>
                  <p className="text-sm text-teal-700 mb-3">Koma ondoren, zifra-talde bat behin eta berriz errepikatzen da.</p>
                  <div className="bg-white p-3 rounded-lg border border-teal-200 font-mono text-sm space-y-1">
                    <p>0.333... = 1/3</p>
                    <p>0.666... = 2/3</p>
                    <p>0.142857... = 1/7</p>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-cyan-50 border border-cyan-100">
                  <h3 className="font-bold text-cyan-800 mb-2">Aldizkako nahasteak</h3>
                  <p className="text-sm text-cyan-700 mb-3">Koma ondoren zifra finkoak eta gero zifra errepikakorrak daude.</p>
                  <div className="bg-white p-3 rounded-lg border border-cyan-200 font-mono text-sm space-y-1">
                    <p>0.1666... = 1/6</p>
                    <p>0.8333... = 5/6</p>
                    <p>0.41666... = 5/12</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Hamartarretik Zatikira" icon={BookOpen}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 text-center">Hamartar zehatza → Zatikia</p>
                  <div className="font-mono text-center space-y-2">
                    <p className="text-2xl">0.75</p>
                    <p className="text-slate-400">= 75/100</p>
                    <p className="text-emerald-400 font-bold text-xl">= 3/4</p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Araua:</strong> Zenbat dezimal dagoen, hainbat zero gehitu izendatzaileari. Ondoren, sinplifikatu MKT-z.</p>
                </div>
              </div>
            </Section>

            <Section title="Eragiketak Hamartarrekin" icon={Calculator}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">Batuketa / Kenketa</h3>
                  <p className="text-sm text-slate-600 mb-3">Komak lerrokatu eta arrunt egin.</p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm">
                    <p>&nbsp;&nbsp;3.45</p>
                    <p>+ 2.30</p>
                    <p className="border-t border-slate-300 font-bold text-emerald-600">&nbsp;&nbsp;5.75</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">Biderketa</h3>
                  <p className="text-sm text-slate-600 mb-3">Biderkatu komak kontuan hartu gabe, gero jarri koma.</p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm">
                    <p>2.3 × 1.5</p>
                    <p className="text-slate-400">23 × 15 = 345</p>
                    <p className="text-emerald-600 font-bold">2 dezimal → 3.45</p>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* LABORATEGIA */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Hamartar Laborategia" icon={Eye}>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase mb-2 block">Sartu hamartar bat</label>
                  <input type="text" value={labInput}
                    onChange={(e) => setLabInput(e.target.value)}
                    placeholder="Adib: 0.75 edo 0.333..."
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors font-mono text-lg" />
                  <p className="text-xs text-slate-400 mt-2">Aldizkakoentzat gehitu &quot;...&quot; bukaeran (adib: 0.333...)</p>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Zatiki bihurtzea</p>
                  {labResult ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <span className="text-3xl font-mono font-bold text-emerald-400">{labResult.num}/{labResult.den}</span>
                      </div>
                      <div className="space-y-2">
                        {labResult.steps.map((step, i) => (
                          <p key={i} className={`font-mono text-sm ${i === labResult.steps.length - 1 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                            {i > 0 && '→ '}{step}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center">Sartu hamartar bat zatikira bihurtzeko</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Zuzen Numerikoa</h3>
                  <NumberLine value={labInput} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['0.5', '0.75', '0.125', '0.333...'].map(val => (
                    <button key={val} onClick={() => setLabInput(val)}
                      className="p-3 bg-slate-100 rounded-lg text-sm font-mono text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-colors">
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* FORMULA */}
        {activeTab === 'steps' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Bihurtze Formulak" icon={Calculator}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Hamartar zehatza → Zatikia</p>
                  <div className="text-center font-mono text-xl space-y-2">
                    <p>0.<span className="text-emerald-400">d₁d₂...dₙ</span></p>
                    <p className="text-slate-400">= <span className="text-emerald-400">d₁d₂...dₙ</span> / 10<sup>n</sup></p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Aldizkako purua → Zatikia</p>
                  <div className="text-center font-mono text-xl space-y-2">
                    <p>0.<span className="text-teal-400 overline">abc</span>...</p>
                    <p className="text-slate-400">= <span className="text-teal-400">abc</span> / <span className="text-teal-400">999</span></p>
                  </div>
                  <p className="text-slate-400 text-xs text-center mt-3">Hainbat 9 zifra errepikakor zenbat diren</p>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Aldizkako nahastea → Zatikia</p>
                  <div className="text-center font-mono text-xl space-y-2">
                    <p>0.a<span className="text-cyan-400 overline">bc</span>...</p>
                    <p className="text-slate-400">= (<span className="text-cyan-400">abc</span> − <span className="text-cyan-400">a</span>) / <span className="text-cyan-400">990</span></p>
                  </div>
                  <p className="text-slate-400 text-xs text-center mt-3">Izend.: 9ak (errepikakorrak) + 0ak (finkoak)</p>
                </div>

                {[
                  { step: 1, title: 'Mota identifikatu', desc: 'Zehatza, aldizkako purua ala nahastea da?', color: 'emerald' },
                  { step: 2, title: 'Formula aplikatu', desc: 'Mota bakoitzak bere formula du.', color: 'teal' },
                  { step: 3, title: 'Sinplifikatu', desc: 'MKT kalkulatu eta zenbatzailea/izendatzailea zatitu.', color: 'cyan' },
                ].map(s => (
                  <div key={s.step} className={`p-5 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-lg shrink-0`}>
                        {s.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{s.title}</h3>
                        <p className="text-sm text-slate-600">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* PRAKTIKA */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-emerald-200 ring-4 ring-emerald-50/50">
              <div className="max-w-xl mx-auto">
                <div className="flex justify-center gap-2 mb-8">
                  <button onClick={() => setPracticeType('toFraction')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${practiceType === 'toFraction' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    Hamartar → Zatiki
                  </button>
                  <button onClick={() => setPracticeType('toDecimal')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${practiceType === 'toDecimal' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    Zatiki → Hamartar
                  </button>
                </div>

                {practiceProblem && (
                  <div className="space-y-8 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {practiceType === 'toFraction' ? 'Hamartarra zatikira bihurtu' : 'Zatikia hamartarrera bihurtu'}
                      </div>
                      <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold mb-2">
                        {practiceProblem.display}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      {practiceType === 'toFraction' ? (
                        <div className="flex items-center gap-2">
                          <input type="number" placeholder="Zenb." value={userNum}
                            onChange={(e) => setUserNum(e.target.value)}
                            className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-lg font-bold" />
                          <span className="text-2xl text-slate-400">/</span>
                          <input type="number" placeholder="Izen." value={userDen}
                            onChange={(e) => setUserDen(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                            className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-lg font-bold" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                          <input type="number" step="any" placeholder="?" value={userNum}
                            onChange={(e) => setUserNum(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                            className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-lg font-bold" />
                        </div>
                      )}
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
                             feedback === 'invalid' ? 'Mesedez, sartu balio egokiak.' :
                             practiceType === 'toFraction'
                               ? `Ia-ia... Erantzun zuzena: ${practiceProblem.solutionNum}/${practiceProblem.solutionDen}`
                               : `Ia-ia... Erantzun zuzena: ${practiceProblem.solution}`}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 justify-center mt-6">
                      <button onClick={checkAnswer}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0">
                        Egiaztatu
                      </button>
                      {feedback === 'correct' && (
                        <button onClick={generateProblem}
                          className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-all flex items-center gap-2 animate-in fade-in">
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

      <RelatedTopics currentId="zen-hamar" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">Beñat Erezuma</a></p>
      </footer>
    </div>
  );
}
