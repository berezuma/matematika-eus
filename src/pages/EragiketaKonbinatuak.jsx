import React, { useState, useEffect } from 'react';
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
  Layers,
  Eye
} from 'lucide-react';

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

// Evaluate expression step by step following PEMDAS
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  const s = expr.replace(/\s/g, '');
  while (i < s.length) {
    if (s[i] === '(') { tokens.push({ type: 'lparen' }); i++; }
    else if (s[i] === ')') { tokens.push({ type: 'rparen' }); i++; }
    else if ('+-'.includes(s[i]) && (tokens.length === 0 || tokens[tokens.length - 1].type === 'lparen' || tokens[tokens.length - 1].type === 'op')) {
      let num = s[i]; i++;
      while (i < s.length && (s[i] >= '0' && s[i] <= '9' || s[i] === '.')) { num += s[i]; i++; }
      tokens.push({ type: 'num', value: parseFloat(num) });
    }
    else if (s[i] >= '0' && s[i] <= '9' || s[i] === '.') {
      let num = ''; while (i < s.length && (s[i] >= '0' && s[i] <= '9' || s[i] === '.')) { num += s[i]; i++; }
      tokens.push({ type: 'num', value: parseFloat(num) });
    }
    else if ('+-*/^'.includes(s[i])) { tokens.push({ type: 'op', value: s[i] }); i++; }
    else i++;
  }
  return tokens;
}

function safeEval(expr) {
  try {
    const sanitized = expr.replace(/\^/g, '**');
    const result = Function('"use strict"; return (' + sanitized + ')')();
    return result;
  } catch { return NaN; }
}

function generateSteps(expression) {
  const steps = [{ expr: expression, desc: 'Hasierako eragiketa' }];
  let current = expression;

  // Step 1: Resolve parentheses
  let safety = 0;
  while (current.includes('(') && safety < 20) {
    safety++;
    const match = current.match(/\(([^()]+)\)/);
    if (!match) break;
    const inner = match[1];
    const result = safeEval(inner);
    if (isNaN(result)) break;
    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    const next = current.replace(match[0], formatted);
    steps.push({ expr: next, desc: `Parentesia ebatzi: ${match[0]} = ${formatted}` });
    current = next;
  }

  // Step 2: Resolve exponents
  safety = 0;
  while (/\d+\.?\d*\s*\^\s*\d+\.?\d*/.test(current) && safety < 20) {
    safety++;
    const match = current.match(/(\d+\.?\d*)\s*\^\s*(\d+\.?\d*)/);
    if (!match) break;
    const result = Math.pow(parseFloat(match[1]), parseFloat(match[2]));
    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    current = current.replace(match[0], formatted);
    steps.push({ expr: current, desc: `Berretza ebatzi: ${match[1]}^${match[2]} = ${formatted}` });
  }

  // Step 3: Resolve multiplication and division (left to right)
  safety = 0;
  while (/(\d+\.?\d*)\s*([*/])\s*(-?\d+\.?\d*)/.test(current) && safety < 20) {
    safety++;
    const match = current.match(/(\d+\.?\d*)\s*([*/])\s*(-?\d+\.?\d*)/);
    if (!match) break;
    const a = parseFloat(match[1]);
    const b = parseFloat(match[3]);
    const result = match[2] === '*' ? a * b : a / b;
    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    const opName = match[2] === '*' ? 'Biderketa' : 'Zatiketa';
    current = current.replace(match[0], formatted);
    steps.push({ expr: current, desc: `${opName}: ${match[1]} ${match[2]} ${match[3]} = ${formatted}` });
  }

  // Step 4: Resolve addition and subtraction (left to right)
  safety = 0;
  while (/(-?\d+\.?\d*)\s*([+-])\s*(\d+\.?\d*)/.test(current) && safety < 20) {
    safety++;
    const match = current.match(/(-?\d+\.?\d*)\s*([+-])\s*(\d+\.?\d*)/);
    if (!match) break;
    const a = parseFloat(match[1]);
    const b = parseFloat(match[3]);
    const result = match[2] === '+' ? a + b : a - b;
    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    const opName = match[2] === '+' ? 'Batuketa' : 'Kenketa';
    const prev = current;
    current = current.replace(match[0], formatted);
    if (current === prev) break;
    steps.push({ expr: current, desc: `${opName}: ${match[1]} ${match[2]} ${match[3]} = ${formatted}` });
  }

  return steps;
}

function generatePracticeExpression(difficulty) {
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (difficulty === 'erraza') {
    const ops = ['+', '-', '*'];
    const op1 = ops[randInt(0, 2)];
    const op2 = ops[randInt(0, 2)];
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    const c = randInt(2, 9);
    return `${a} ${op1} ${b} ${op2} ${c}`;
  } else if (difficulty === 'ertaina') {
    const a = randInt(2, 8);
    const b = randInt(1, 6);
    const c = randInt(2, 5);
    const d = randInt(1, 9);
    const templates = [
      `${a} * (${b} + ${c}) - ${d}`,
      `(${a} + ${b}) * ${c} + ${d}`,
      `${a} * ${b} + ${c} * ${d}`,
      `${a * c} / ${c} + ${b} * ${d}`,
    ];
    return templates[randInt(0, templates.length - 1)];
  } else {
    const a = randInt(2, 5);
    const b = randInt(2, 4);
    const c = randInt(2, 6);
    const d = randInt(1, 5);
    const e = randInt(2, 8);
    const templates = [
      `${a} ^ ${b} + ${c} * ${d} - ${e}`,
      `(${a} + ${b}) ^ 2 - ${c} * ${d}`,
      `${a} * (${b} + ${c} * ${d}) - ${e}`,
      `(${a * b} - ${c}) * ${d} + ${e} ^ 2`,
    ];
    return templates[randInt(0, templates.length - 1)];
  }
}

export default function EragiketaKonbinatuak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [labExpression, setLabExpression] = useState('3 + 4 * 2 - (6 / 3)');
  const [labSteps, setLabSteps] = useState([]);
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [difficulty, setDifficulty] = useState('erraza');

  useEffect(() => {
    setLabSteps(generateSteps(labExpression));
  }, [labExpression]);

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  const generateProblem = () => {
    const expr = generatePracticeExpression(difficulty);
    const result = safeEval(expr.replace(/\^/g, '**'));
    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
    setPracticeProblem({ expression: expr, solution: formatted, steps: generateSteps(expr) });
    setUserInput('');
    setFeedback(null);
    setShowSteps(false);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const userVal = parseFloat(userInput);
    if (isNaN(userVal)) { setFeedback('invalid'); return; }
    const diff = Math.abs(userVal - practiceProblem.solution);
    setFeedback(diff < 0.01 ? 'correct' : 'incorrect');
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
            Eragiketa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Konbinatuak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eragiketen hierarkia ulertzea funtsezkoa da matematikan. Ikasi PEMDAS/BODMAS erregela eta aplikatu eragiketa konplexuetan.
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
            <Section title="Eragiketen Hierarkia" icon={Layers}>
              <div className="space-y-4">
                <p className="text-slate-600 mb-4">Eragiketa konbinatuak ebazteko, ordena jakin bat jarraitu behar da. Ordena hau ez badugu errespetatzen, emaitza okerra lortuko dugu.</p>
                <div className="space-y-3">
                  {[
                    { level: 1, name: 'Parentesiak ( )', desc: 'Lehenik eta behin, parentesi barneko eragiketak ebatzi.', color: 'red', emoji: '1.' },
                    { level: 2, name: 'Berretzeak ^', desc: 'Ondoren, berretzeak kalkulatu.', color: 'orange', emoji: '2.' },
                    { level: 3, name: 'Biderketa × eta Zatiketa ÷', desc: 'Ezkerretik eskuinera, biderketa eta zatiketak egin.', color: 'blue', emoji: '3.' },
                    { level: 4, name: 'Batuketa + eta Kenketa -', desc: 'Azkenik, batuketak eta kenketak ezkerretik eskuinera.', color: 'emerald', emoji: '4.' },
                  ].map(item => (
                    <div key={item.level} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${item.color}-100 text-${item.color}-700 flex items-center justify-center font-bold text-lg shrink-0`}>
                          {item.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{item.name}</h3>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="PEMDAS / BODMAS Erregela" icon={BookOpen}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">PEMDAS (Ingelesez)</h3>
                  <div className="space-y-2">
                    {[
                      { letter: 'P', word: 'Parentheses', eu: 'Parentesiak' },
                      { letter: 'E', word: 'Exponents', eu: 'Berretzeak' },
                      { letter: 'M', word: 'Multiplication', eu: 'Biderketa' },
                      { letter: 'D', word: 'Division', eu: 'Zatiketa' },
                      { letter: 'A', word: 'Addition', eu: 'Batuketa' },
                      { letter: 'S', word: 'Subtraction', eu: 'Kenketa' },
                    ].map(r => (
                      <div key={r.letter} className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm">{r.letter}</span>
                        <span className="text-sm text-slate-600"><strong>{r.word}</strong> = {r.eu}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2">Adibidea</h4>
                    <div className="font-mono text-sm space-y-1">
                      <p>2 + 3 × 4 = ?</p>
                      <p className="text-slate-500">Gaizki: (2 + 3) × 4 = 20</p>
                      <p className="text-emerald-700 font-bold">Ondo: 2 + (3 × 4) = 2 + 12 = 14</p>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                    <AlertTriangle className="shrink-0" size={20} />
                    <p><strong>Kontuz:</strong> Biderketa eta zatiketa <em>maila berean</em> daude. Ezkerretik eskuinera ebatzi. Batuketa eta kenketa ere berdin.</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Parentesi Motak" icon={ListOrdered}>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-4xl font-mono text-slate-700 mb-2">( )</div>
                  <h3 className="font-bold text-slate-800">Parentesi arruntak</h3>
                  <p className="text-sm text-slate-600">Barnekoak lehenik</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-4xl font-mono text-slate-700 mb-2">[ ]</div>
                  <h3 className="font-bold text-slate-800">Kortxeteak</h3>
                  <p className="text-sm text-slate-600">Parentesiak hartzen dituzte</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-4xl font-mono text-slate-700 mb-2">{'{ }'}</div>
                  <h3 className="font-bold text-slate-800">Giltza-kakoak</h3>
                  <p className="text-sm text-slate-600">Guztiak hartzen dituzte</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 text-center">Ordena: {'{ [ ( barnekoa ) kanpokoa ] kanpokoena }'}</p>
            </Section>
          </div>
        )}

        {/* LABORATEGIA */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Eragiketa Laborategia" icon={Eye}>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase mb-2 block">Sartu eragiketa bat</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={labExpression}
                      onChange={(e) => setLabExpression(e.target.value)}
                      placeholder="Adib: 3 + 4 * 2 - (6 / 3)"
                      className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors font-mono"
                    />
                    <button onClick={() => setLabSteps(generateSteps(labExpression))}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                      Ebatzi
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Erabili: + - * / ^ ( ) — Adib: 2 ^ 3 + (4 * 5) - 6 / 2</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl">
                  <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-4">Pausoz-pauso</p>
                  <div className="space-y-3">
                    {labSteps.map((step, i) => (
                      <div key={i} className={`flex items-start gap-3 ${i === labSteps.length - 1 ? '' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          i === labSteps.length - 1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className={`font-mono text-lg ${i === labSteps.length - 1 ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                            {step.expr}
                          </p>
                          <p className="text-slate-500 text-xs">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['2 + 3 * 4', '(2 + 3) * 4', '2 ^ 3 + 4 * 2', '(8 - 2) * (3 + 1)'].map(expr => (
                    <button key={expr} onClick={() => setLabExpression(expr)}
                      className="p-3 bg-slate-100 rounded-lg text-sm font-mono text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-colors">
                      {expr}
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
            <Section title="Hierarkia Arauak" icon={ListOrdered}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl">
                  <p className="text-slate-400 text-sm mb-4 font-bold tracking-widest uppercase text-center">Eragiketen lehentasuna</p>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono font-bold">( )</span>
                      <span className="text-slate-500">&gt;</span>
                      <span className="px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-mono font-bold">^</span>
                      <span className="text-slate-500">&gt;</span>
                      <span className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-mono font-bold">× ÷</span>
                      <span className="text-slate-500">&gt;</span>
                      <span className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-mono font-bold">+ −</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl">
                  <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Adibide osoa</p>
                  <p className="text-2xl md:text-3xl font-mono text-center mb-6">
                    <span className="text-red-400">2</span> + <span className="text-blue-400">3</span> × <span className="text-orange-400">4</span><sup>2</sup> − (<span className="text-emerald-400">10</span> ÷ <span className="text-emerald-400">5</span>)
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Parentesiak ebatzi', formula: '2 + 3 × 4² − (10 ÷ 5)', result: '2 + 3 × 4² − 2', color: 'red' },
                    { step: 2, title: 'Berretzeak ebatzi', formula: '2 + 3 × 4² − 2', result: '2 + 3 × 16 − 2', color: 'orange' },
                    { step: 3, title: 'Biderketa/Zatiketa', formula: '2 + 3 × 16 − 2', result: '2 + 48 − 2', color: 'blue' },
                    { step: 4, title: 'Batuketa/Kenketa', formula: '2 + 48 − 2', result: '48', color: 'emerald' },
                  ].map(s => (
                    <div key={s.step} className={`p-5 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-lg shrink-0`}>
                          {s.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
                          <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm flex items-center gap-3 flex-wrap">
                            <span className="text-slate-500">{s.formula}</span>
                            <ArrowRight size={16} className="text-slate-400 shrink-0" />
                            <span className={`text-${s.color}-600 font-bold`}>{s.result}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-3">Arau gehigarriak</h3>
                  <ul className="space-y-2 text-sm text-emerald-700">
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Maila bereko eragiketak ezkerretik eskuinera ebazten dira.</li>
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Parentesi habiaratuak: barnekoetatik kanpokoetara.</li>
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Biderketa eta zatiketa maila berekoak dira (ezkerretik eskuinera).</li>
                    <li className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Batuketa eta kenketa maila berekoak dira (ezkerretik eskuinera).</li>
                  </ul>
                </div>
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
                  {[
                    { id: 'erraza', label: 'Erraza' },
                    { id: 'ertaina', label: 'Ertaina' },
                    { id: 'zaila', label: 'Zaila' },
                  ].map(d => (
                    <button key={d.id} onClick={() => setDifficulty(d.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${difficulty === d.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {d.label}
                    </button>
                  ))}
                </div>

                {practiceProblem && (
                  <div className="space-y-8 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {difficulty === 'erraza' ? 'Maila erraza' : difficulty === 'ertaina' ? 'Maila ertaina' : 'Maila zaila'}
                      </div>
                      <div className="text-xs text-slate-400 mb-4">Kalkulatu emaitza</div>
                      <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold mb-2">
                        {practiceProblem.expression} = ?
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <p className="text-slate-600 mb-2">Zein da emaitza?</p>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input type="number" placeholder="?" value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-lg font-bold" />
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
                          <button onClick={() => setShowSteps(true)} className="text-sm underline hover:text-red-900 mt-2">
                            Pausoak ikusi?
                          </button>
                        )}
                      </div>
                    )}

                    {showSteps && feedback === 'incorrect' && practiceProblem.steps && (
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-sm text-left text-emerald-800 animate-in fade-in space-y-1">
                        <strong>Urratsak:</strong>
                        {practiceProblem.steps.map((step, i) => (
                          <p key={i} className={`font-mono ${i === practiceProblem.steps.length - 1 ? 'font-bold text-emerald-700' : 'text-emerald-600'}`}>
                            {i > 0 && '→ '}{step.expr} <span className="text-emerald-400 text-xs">({step.desc})</span>
                          </p>
                        ))}
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

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">Beñat Erezuma</a></p>
      </footer>
    </div>
  );
}
