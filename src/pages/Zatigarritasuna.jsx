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
  GitBranch,
  Eye
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

function primeFactors(n) {
  const factors = [];
  let d = 2;
  let num = Math.abs(n);
  while (d * d <= num) {
    while (num % d === 0) {
      factors.push(d);
      num /= d;
    }
    d++;
  }
  if (num > 1) factors.push(num);
  return factors;
}

function factorMap(n) {
  const factors = primeFactors(n);
  const map = {};
  factors.forEach(f => { map[f] = (map[f] || 0) + 1; });
  return map;
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isDivisibleBy(n, d) {
  return n % d === 0;
}

// Factor tree canvas
const FactorTree = ({ number }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || number < 2) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const nodes = [];
    const edges = [];

    function buildTree(n, x, y, level, spread) {
      nodes.push({ value: n, x, y, isPrime: primeFactors(n).length === 1 && n > 1 });

      if (n <= 1) return;
      const factors = primeFactors(n);
      if (factors.length === 1) return;

      const firstFactor = factors[0];
      const remainder = n / firstFactor;
      const nextY = y + 60;
      const s = Math.max(spread * 0.6, 30);

      edges.push({ x1: x, y1: y + 15, x2: x - s, y2: nextY - 15 });
      edges.push({ x1: x, y1: y + 15, x2: x + s, y2: nextY - 15 });

      nodes.push({ value: firstFactor, x: x - s, y: nextY, isPrime: true });
      buildTree(remainder, x + s, nextY, level + 1, s);
    }

    buildTree(number, w / 2, 30, 0, Math.min(w / 4, 100));

    // Draw edges
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    edges.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(e.x1, e.y1);
      ctx.lineTo(e.x2, e.y2);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = node.isPrime ? '#10b981' : '#f1f5f9';
      ctx.fill();
      ctx.strokeStyle = node.isPrime ? '#059669' : '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = node.isPrime ? '#ffffff' : '#334155';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), node.x, node.y);
    });
  }, [number]);

  return <canvas ref={canvasRef} width={400} height={300} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />;
};

export default function Zatigarritasuna() {
  useDocumentTitle('Zatigarritasuna');
  const [activeTab, setActiveTab] = useState('concept');
  const [numA, setNumA] = useState(36);
  const [numB, setNumB] = useState(48);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [practiceType, setPracticeType] = useState('mkt');

  useEffect(() => { generateProblem(); }, [practiceType]);

  const generateProblem = () => {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let a, b, solution;
    if (practiceType === 'mkt') {
      a = randInt(4, 30);
      b = randInt(4, 30);
      while (a === b) b = randInt(4, 30);
      solution = gcd(a, b);
    } else {
      a = randInt(2, 15);
      b = randInt(2, 15);
      while (a === b) b = randInt(2, 15);
      solution = lcm(a, b);
    }

    setPracticeProblem({ a, b, solution, type: practiceType });
    setUserInput('');
    setFeedback(null);
    setShowSteps(false);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const userVal = parseInt(userInput);
    if (isNaN(userVal)) { setFeedback('invalid'); return; }
    setFeedback(userVal === practiceProblem.solution ? 'correct' : 'incorrect');
  };

  const factA = factorMap(numA);
  const factB = factorMap(numB);
  const gcdVal = gcd(numA, numB);
  const lcmVal = lcm(numA, numB);

  const tabs = [
    { id: 'concept', label: 'Teoria' },
    { id: 'viz', label: 'Laborategia' },
    { id: 'steps', label: 'Formula' },
    { id: 'practice', label: 'Praktika' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-800">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.slice(0, 3).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`hover:text-teal-600 transition-colors ${activeTab === t.id ? 'text-teal-600' : ''}`}>{t.label}</button>
            ))}
            <button onClick={() => setActiveTab('practice')} className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all shadow-sm shadow-teal-200">Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Zatigarritasuna - <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">MKT eta ZKH</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Zenbaki bat noiz den zatigarria beste batengatik, faktorizazioa eta MKT/ZKH kalkulatzeko teknikak.
          </p>
        </div>

        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.id ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TEORIA */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Zatigarritasun Erregelak" icon={ListOrdered}>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { n: 2, rule: 'Azken zifra bikoitia bada (0, 2, 4, 6, 8)', example: '134 → 4 bikoitia ✓' },
                  { n: 3, rule: 'Zifren batura 3ren multiploa bada', example: '123 → 1+2+3=6 ✓' },
                  { n: 4, rule: 'Azken bi zifrek 4ren multiploa osatzen badute', example: '316 → 16÷4=4 ✓' },
                  { n: 5, rule: 'Azken zifra 0 edo 5 bada', example: '475 → 5 ✓' },
                  { n: 6, rule: '2z eta 3z zatigarria bada', example: '132 → bikoitia eta 1+3+2=6 ✓' },
                  { n: 9, rule: 'Zifren batura 9ren multiploa bada', example: '729 → 7+2+9=18 ✓' },
                  { n: 10, rule: 'Azken zifra 0 bada', example: '250 → 0 ✓' },
                  { n: 11, rule: 'Posizio bakoitiak - bikoitiak = 0 edo 11 mult.', example: '121 → 1-2+1=0 ✓' },
                ].map(r => (
                  <div key={r.n} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm">{r.n}</span>
                      <h3 className="font-bold text-slate-800 text-sm">{r.n}(r)en zatigarria</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{r.rule}</p>
                    <p className="text-xs font-mono text-teal-600">{r.example}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Faktorizazio Aritmetikoa" icon={GitBranch}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-600 mb-4">Edozein zenbaki osoa zenbaki lehenen biderkadura gisa adieraz daiteke. Hau da <strong>Aritmetikaren Oinarrizko Teorema</strong>.</p>
                  <div className="bg-slate-900 text-white p-6 rounded-xl font-mono text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Adibidea</p>
                    <p className="text-2xl">60 = 2² × 3 × 5</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-teal-800 mb-2">MKT (Zatitzaile Komunetako Handiena)</h4>
                    <p className="text-sm text-teal-700">Bi zenbakien faktore komun guztiak, berretzaile txikienekin biderkatu.</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2">ZKH (Multiplo Komunetako Txikiena)</h4>
                    <p className="text-sm text-emerald-700">Bi zenbakien faktore guztiak (komunak eta ez-komunak), berretzaile handienarekin biderkatu.</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Propietate garrantzitsua" icon={BookOpen}>
              <div className="bg-slate-900 text-white p-8 rounded-2xl text-center">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Beti betetzen da</p>
                <p className="text-3xl font-mono font-bold">
                  <span className="text-teal-400">MKT(a,b)</span> × <span className="text-emerald-400">ZKH(a,b)</span> = <span className="text-cyan-400">a × b</span>
                </p>
                <p className="text-slate-400 text-sm mt-4">Adib: MKT(12,18) × ZKH(12,18) = 6 × 36 = 216 = 12 × 18</p>
              </div>
            </Section>
          </div>
        )}

        {/* LABORATEGIA */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Faktorizazio Laborategia" icon={Eye}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase mb-2 block">Lehenengo zenbakia</label>
                    <input type="number" min="2" max="200" value={numA}
                      onChange={(e) => setNumA(Math.max(2, Math.min(200, parseInt(e.target.value) || 2)))}
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors font-mono text-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase mb-2 block">Bigarren zenbakia</label>
                    <input type="number" min="2" max="200" value={numB}
                      onChange={(e) => setNumB(Math.max(2, Math.min(200, parseInt(e.target.value) || 2)))}
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors font-mono text-lg" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">{numA}(r)en faktorizazio-zuhaitza</h3>
                    <FactorTree number={numA} />
                    <p className="text-sm font-mono text-center mt-2 text-teal-600">
                      {numA} = {Object.entries(factA).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">{numB}(r)en faktorizazio-zuhaitza</h3>
                    <FactorTree number={numB} />
                    <p className="text-sm font-mono text-center mt-2 text-teal-600">
                      {numB} = {Object.entries(factB).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 text-center">
                    <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">MKT ({numA}, {numB})</p>
                    <p className="text-4xl font-mono font-bold text-teal-700">{gcdVal}</p>
                    <p className="text-xs text-teal-600 mt-2">Faktore komunak, berretzaile txikienarekin</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">ZKH ({numA}, {numB})</p>
                    <p className="text-4xl font-mono font-bold text-emerald-700">{lcmVal}</p>
                    <p className="text-xs text-emerald-600 mt-2">Faktore guztiak, berretzaile handienarekin</p>
                  </div>
                </div>

                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 text-center">
                  <p className="text-sm text-cyan-700">
                    <strong>Egiaztapena:</strong> MKT × ZKH = {gcdVal} × {lcmVal} = {gcdVal * lcmVal} = {numA} × {numB} = {numA * numB}
                    {gcdVal * lcmVal === numA * numB ? ' ✓' : ' ✗'}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-3 text-sm">Zatigarritasun taula</h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {[2, 3, 4, 5, 6, 7, 9, 11].map(d => (
                      <div key={d} className="text-center">
                        <div className="text-xs text-slate-500 mb-1">÷{d}</div>
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-1 rounded ${isDivisibleBy(numA, d) ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                            {numA}: {isDivisibleBy(numA, d) ? '✓' : '✗'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${isDivisibleBy(numB, d) ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                            {numB}: {isDivisibleBy(numB, d) ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* FORMULA */}
        {activeTab === 'steps' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="MKT eta ZKH kalkulatzeko metodoak" icon={Calculator}>
              <div className="space-y-8">
                <div className="bg-slate-900 text-white p-8 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Faktorizazio bidezko metodoa</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-teal-400 font-bold mb-2 text-center">MKT kalkulatzea</p>
                      <div className="space-y-2 font-mono text-sm">
                        <p>1. Bi zenbakiak faktorizatu</p>
                        <p>2. Faktore komunak hartu</p>
                        <p>3. Berretzaile txikiena hartu</p>
                        <p className="text-teal-400 mt-3">Adib: MKT(12, 18)</p>
                        <p className="text-slate-400">12 = 2² × 3</p>
                        <p className="text-slate-400">18 = 2 × 3²</p>
                        <p className="text-teal-400 font-bold">MKT = 2¹ × 3¹ = 6</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-emerald-400 font-bold mb-2 text-center">ZKH kalkulatzea</p>
                      <div className="space-y-2 font-mono text-sm">
                        <p>1. Bi zenbakiak faktorizatu</p>
                        <p>2. Faktore guztiak hartu</p>
                        <p>3. Berretzaile handiena hartu</p>
                        <p className="text-emerald-400 mt-3">Adib: ZKH(12, 18)</p>
                        <p className="text-slate-400">12 = 2² × 3</p>
                        <p className="text-slate-400">18 = 2 × 3²</p>
                        <p className="text-emerald-400 font-bold">ZKH = 2² × 3² = 36</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Euklides-en algoritmoa (MKT)</p>
                  <div className="font-mono text-sm space-y-2 text-center">
                    <p className="text-teal-400 mb-4">MKT(a, b) = MKT(b, a mod b) harik eta hondarrik gabe zatitu arte</p>
                    <p className="text-slate-400">Adib: MKT(48, 36)</p>
                    <p>48 = 36 × 1 + <span className="text-yellow-400">12</span></p>
                    <p>36 = <span className="text-yellow-400">12</span> × 3 + <span className="text-teal-400">0</span></p>
                    <p className="text-teal-400 font-bold mt-2">MKT = 12</p>
                  </div>
                </div>

                <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                  <h3 className="font-bold text-teal-800 mb-3">Propietate nagusiak</h3>
                  <ul className="space-y-2 text-sm text-teal-700">
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> MKT(a, b) × ZKH(a, b) = a × b</li>
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> MKT(a, b) ≤ min(a, b)</li>
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> ZKH(a, b) ≥ max(a, b)</li>
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> a eta b koprimo badira: MKT(a,b) = 1 eta ZKH(a,b) = a × b</li>
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* PRAKTIKA */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-teal-200 ring-4 ring-teal-50/50">
              <div className="max-w-xl mx-auto">
                <div className="flex justify-center gap-2 mb-8">
                  {[
                    { id: 'mkt', label: 'MKT' },
                    { id: 'zkh', label: 'ZKH' },
                  ].map(d => (
                    <button key={d.id} onClick={() => setPracticeType(d.id)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${practiceType === d.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {d.label}
                    </button>
                  ))}
                </div>

                {practiceProblem && (
                  <div className="space-y-8 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {practiceProblem.type === 'mkt' ? 'Zatitzaile Komunetako Handiena' : 'Multiplo Komunetako Txikiena'}
                      </div>
                      <div className="text-xs text-slate-400 mb-4">Kalkulatu</div>
                      <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold mb-2">
                        {practiceProblem.type === 'mkt' ? 'MKT' : 'ZKH'}({practiceProblem.a}, {practiceProblem.b}) = ?
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input type="number" placeholder="?" value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg font-bold" />
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
                          <button onClick={() => setShowSteps(true)} className="text-sm underline hover:text-red-900 mt-2">
                            Nola kalkulatu ikusi?
                          </button>
                        )}
                      </div>
                    )}

                    {showSteps && feedback === 'incorrect' && (
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 text-sm text-left text-teal-800 animate-in fade-in space-y-1">
                        <strong>Pausoak:</strong>
                        <p className="font-mono">{practiceProblem.a} = {Object.entries(factorMap(practiceProblem.a)).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ')}</p>
                        <p className="font-mono">{practiceProblem.b} = {Object.entries(factorMap(practiceProblem.b)).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ')}</p>
                        <p className="font-mono font-bold text-teal-700">
                          {practiceProblem.type === 'mkt' ? 'MKT' : 'ZKH'}({practiceProblem.a}, {practiceProblem.b}) = {practiceProblem.solution}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4 justify-center mt-6">
                      <button onClick={checkAnswer}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0">
                        Egiaztatu
                      </button>
                      {feedback === 'correct' && (
                        <button onClick={generateProblem}
                          className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-500 transition-all flex items-center gap-2 animate-in fade-in">
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

      <RelatedTopics currentId="zatigarri" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-500">Beñat Erezuma</a></p>
      </footer>
    </div>
  );
}
