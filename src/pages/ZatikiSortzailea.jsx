import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, RefreshCw, ArrowRight, Check, Zap, ListOrdered, Divide, FlaskConical, X, Trophy, BarChart3 } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
      <div className="p-2 bg-green-100 text-green-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- GCD Utility ---
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

const simplify = (n, d) => {
  if (d === 0) return { n, d };
  const sign = d < 0 ? -1 : 1;
  n = n * sign;
  d = d * sign;
  const divisor = gcd(Math.abs(n), d);
  return { n: n / divisor, d: d / divisor };
};

// --- Fraction Bar Visualizer ---
const FractionBar = ({ numerator, denominator, color = "bg-green-500", label = "" }) => {
  const safeDen = Math.max(1, Math.min(denominator, 24));
  const safeNum = Math.max(0, Math.min(numerator, safeDen));

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-bold text-slate-600 text-center">{label}</p>}
      <div className="flex gap-0.5 h-10 rounded-lg overflow-hidden border border-slate-200">
        {Array.from({ length: safeDen }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 transition-all duration-300 ${
              i < safeNum ? color : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
      <p className="text-center font-mono text-lg font-bold text-slate-700">
        {safeNum} / {safeDen}
      </p>
    </div>
  );
};

// --- Main Component ---
export default function ZatikiSortzailea() {
  useDocumentTitle('Zatiki Sortzailea');
  const [activeTab, setActiveTab] = useState('teoria');

  // Laborategia state
  const [labNum, setLabNum] = useState(3);
  const [labDen, setLabDen] = useState(4);
  const [compNum1, setCompNum1] = useState(2);
  const [compDen1, setCompDen1] = useState(5);
  const [compNum2, setCompNum2] = useState(3);
  const [compDen2, setCompDen2] = useState(4);

  // Praktika state
  const [difficulty, setDifficulty] = useState('erraza');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState({ n: '', d: '' });
  const [feedback, setFeedback] = useState(null);
  const { score: correctCount, total, addCorrect, addIncorrect, reset } = useProgress('zatiki-sortzailea');

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  const generateProblem = () => {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let n1, d1, n2, d2, operation;

    if (difficulty === 'erraza') {
      // Same denominator, addition or subtraction
      const ops = ['+', '-'];
      operation = ops[randInt(0, 1)];
      d1 = randInt(2, 10);
      d2 = d1;
      n1 = randInt(1, d1 - 1);
      n2 = randInt(1, d2 - 1);
      if (operation === '-' && n1 < n2) {
        [n1, n2] = [n2, n1];
      }
    } else if (difficulty === 'ertaina') {
      // Different denominators, all four operations
      const ops = ['+', '-', '*', '/'];
      operation = ops[randInt(0, 3)];
      d1 = randInt(2, 8);
      d2 = randInt(2, 8);
      while (d2 === d1) d2 = randInt(2, 8);
      n1 = randInt(1, d1 - 1);
      n2 = randInt(1, d2 - 1);
    } else {
      // Hard: mixed operations, larger numbers
      const ops = ['+', '-', '*', '/'];
      operation = ops[randInt(0, 3)];
      d1 = randInt(3, 12);
      d2 = randInt(3, 12);
      n1 = randInt(1, d1 * 2);
      n2 = randInt(1, d2 * 2);
      if (n2 === 0) n2 = 1;
    }

    // Compute the correct answer
    let resultN, resultD;
    switch (operation) {
      case '+':
        resultN = n1 * d2 + n2 * d1;
        resultD = d1 * d2;
        break;
      case '-':
        resultN = n1 * d2 - n2 * d1;
        resultD = d1 * d2;
        break;
      case '*':
        resultN = n1 * n2;
        resultD = d1 * d2;
        break;
      case '/':
        resultN = n1 * d2;
        resultD = d1 * n2;
        break;
      default:
        resultN = 0;
        resultD = 1;
    }

    const simplified = simplify(resultN, resultD);

    setProblem({
      n1, d1, n2, d2, operation,
      correctN: simplified.n,
      correctD: simplified.d
    });
    setUserInput({ n: '', d: '' });
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const uN = parseInt(userInput.n);
    const uD = parseInt(userInput.d);

    if (isNaN(uN) || isNaN(uD) || uD === 0) {
      setFeedback('invalid');
      return;
    }

    const userSimplified = simplify(uN, uD);

    if (userSimplified.n === problem.correctN && userSimplified.d === problem.correctD) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  const getOpSymbol = (op) => {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  };

  const getOpName = (op) => {
    switch (op) {
      case '+': return 'Batuketa';
      case '-': return 'Kenketa';
      case '*': return 'Biderketa';
      case '/': return 'Zatiketa';
      default: return '';
    }
  };

  const compareResult = () => {
    const val1 = compNum1 / compDen1;
    const val2 = compNum2 / compDen2;
    if (Math.abs(val1 - val2) < 0.0001) return '=';
    return val1 > val2 ? '>' : '<';
  };

  const tabs = [
    { id: 'teoria', label: 'Teoria' },
    { id: 'laborategia', label: 'Laborategia' },
    { id: 'formulak', label: 'Formulak' },
    { id: 'praktika', label: 'Praktika' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-green-100 selection:text-green-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.slice(0, 3).map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`hover:text-green-600 transition-colors ${activeTab === t.id ? 'text-green-600' : ''}`}>{t.label}</button>
            ))}
            <button onClick={() => setActiveTab('praktika')} className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm shadow-green-200">Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Zatiki <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">Sortzailea</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Zatikiekin ariketak sortu eta egin. Batuketa, kenketa, biderketa eta zatiketa praktikatu, zure maila hobetuz.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.id ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ==================== TEORIA ==================== */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zatikien Eragiketak: Sarrera" icon={BookOpen}>
              <p className="text-slate-600 mb-6">
                Zatikiekin lau eragiketa nagusiak egin daitezke: <strong>batuketa</strong>, <strong>kenketa</strong>,
                <strong> biderketa</strong> eta <strong>zatiketa</strong>. Eragiketa bakoitzak bere arauak ditu,
                eta garrantzitsua da izendatzaileen kudeaketa ondo ulertzea.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-lg font-bold">+</div>
                    Batuketa eta Kenketa
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Bi zatiki batu edo kentzeko, <strong>izendatzaile berdina</strong> eduki behar dute.
                    Izendatzaileak desberdinak badira, izendatzaile komuna bilatu behar da.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-green-200 text-sm">
                    <p className="font-mono text-slate-700"><strong>Adibidea:</strong> 1/3 + 1/4</p>
                    <p className="font-mono text-slate-500 mt-1">= 4/12 + 3/12 = 7/12</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-lg font-bold">&times;</div>
                    Biderketa eta Zatiketa
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Biderketan, zenbakitzaileak elkarrekin eta izendatzaileak elkarrekin biderkatu.
                    Zatiketan, bigarren zatikia <strong>irauli</strong> eta biderkatu.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-blue-200 text-sm">
                    <p className="font-mono text-slate-700"><strong>Adibidea:</strong> 2/3 &times; 4/5 = 8/15</p>
                    <p className="font-mono text-slate-500 mt-1">2/3 &divide; 4/5 = 2/3 &times; 5/4 = 10/12 = 5/6</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Izendatzaile Komuna Bilatzea" icon={ListOrdered}>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Batuketa eta kenketan, izendatzaile berdina behar dugu. Horretarako,
                  izendatzaileen <strong>Karratuki Komunik Txikiena (KKT)</strong> bilatu behar dugu,
                  edo bestela, biak biderkatu.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-4">Metodo sinplea: gurutzatutako biderketa</p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6 font-mono text-2xl">
                      <div className="flex flex-col items-center">
                        <span className="text-green-400">a</span>
                        <div className="w-8 h-0.5 bg-white my-1"></div>
                        <span className="text-green-400">b</span>
                      </div>
                      <span className="text-slate-400">+</span>
                      <div className="flex flex-col items-center">
                        <span className="text-blue-400">c</span>
                        <div className="w-8 h-0.5 bg-white my-1"></div>
                        <span className="text-blue-400">d</span>
                      </div>
                      <span className="text-slate-400">=</span>
                      <div className="flex flex-col items-center">
                        <span><span className="text-green-400">a</span>&middot;<span className="text-blue-400">d</span> + <span className="text-blue-400">c</span>&middot;<span className="text-green-400">b</span></span>
                        <div className="w-full h-0.5 bg-white my-1"></div>
                        <span><span className="text-green-400">b</span>&middot;<span className="text-blue-400">d</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                  <h4 className="font-bold text-green-800 mb-2">Adibide zehatza</h4>
                  <div className="font-mono text-sm space-y-1 text-slate-700">
                    <p>2/3 + 1/4</p>
                    <p className="text-slate-500">= (2&times;4 + 1&times;3) / (3&times;4)</p>
                    <p className="text-slate-500">= (8 + 3) / 12</p>
                    <p className="text-green-700 font-bold">= 11/12</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Zatikien Sinplifikazioa" icon={Divide}>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Zatiki bat sinplifikatzeko, zenbakitzailea eta izendatzailea bien
                  <strong> Zatitzaile Komunik Handiena (ZKH)</strong>arekin zatitzen ditugu.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-3">ZKH (Zatitzaile Komunik Handiena)</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Bi zenbakiak zatitzen dituen zenbaki handiena da. Euklides-en algoritmoa erabil daiteke.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm">
                      <p>ZKH(12, 8) = 4</p>
                      <p className="text-slate-500 mt-1">12 = 4 &times; 3, 8 = 4 &times; 2</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-3">Sinplifikazio adibidea</h4>
                    <div className="space-y-2 font-mono text-sm">
                      <p className="text-slate-700">12/18</p>
                      <p className="text-slate-500">ZKH(12, 18) = 6</p>
                      <p className="text-slate-500">12 &divide; 6 = 2</p>
                      <p className="text-slate-500">18 &divide; 6 = 3</p>
                      <p className="text-green-700 font-bold">= 2/3</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== LABORATEGIA ==================== */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zatiki Bisualizatzailea" icon={BarChart3}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Sartu zatiki bat eta ikusi nola irudikatzen den barra bisual gisa. Barra koloreztatuak zenbakitzailea adierazten du, eta guztira dagoen barrak izendatzailea.
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                      <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <Divide size={18} /> Sartu zatikia
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Zenbakitzailea</label>
                            <span className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-green-600 font-bold">{labNum}</span>
                          </div>
                          <input
                            type="range" min="0" max={labDen} step="1"
                            value={labNum}
                            onChange={(e) => setLabNum(parseInt(e.target.value))}
                            className="w-full accent-green-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Izendatzailea</label>
                            <span className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-green-600 font-bold">{labDen}</span>
                          </div>
                          <input
                            type="range" min="1" max="20" step="1"
                            value={labDen}
                            onChange={(e) => {
                              const newDen = parseInt(e.target.value);
                              setLabDen(newDen);
                              if (labNum > newDen) setLabNum(newDen);
                            }}
                            className="w-full accent-green-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                            <span>1</span><span>10</span><span>20</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="text-sm text-slate-500 mb-1">Ehuneko baliokidea</p>
                      <p className="text-3xl font-bold text-green-600 font-mono">
                        {labDen === 0 ? '0' : ((labNum / labDen) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-800 text-center">Irudikapen bisuala</h3>
                    <FractionBar numerator={labNum} denominator={labDen} color="bg-green-500" />
                    <div className="text-center mt-4">
                      <p className="text-sm text-slate-500">
                        {labDen} zatitik <strong className="text-green-600">{labNum}</strong> hartu ditugu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Bi Zatiki Alderatu" icon={FlaskConical}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Sartu bi zatiki eta konparatu bisualki. Barren luzera ikusiz, zein den handiagoa ikusi dezakezu.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* First fraction */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-3">
                    <h4 className="font-bold text-green-800 text-sm uppercase tracking-wider">1. Zatikia</h4>
                    <div className="flex gap-3 items-center justify-center">
                      <div className="flex flex-col items-center">
                        <input
                          type="number" min="0" max="20"
                          value={compNum1}
                          onChange={(e) => setCompNum1(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 text-center p-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none font-bold text-lg"
                        />
                        <div className="w-16 h-1 bg-slate-800 my-1 rounded-full"></div>
                        <input
                          type="number" min="1" max="20"
                          value={compDen1}
                          onChange={(e) => setCompDen1(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center p-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none font-bold text-lg"
                        />
                      </div>
                      <span className="text-slate-400 font-mono text-sm">= {(compNum1 / compDen1).toFixed(3)}</span>
                    </div>
                    <FractionBar numerator={compNum1} denominator={compDen1} color="bg-green-500" />
                  </div>

                  {/* Second fraction */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                    <h4 className="font-bold text-blue-800 text-sm uppercase tracking-wider">2. Zatikia</h4>
                    <div className="flex gap-3 items-center justify-center">
                      <div className="flex flex-col items-center">
                        <input
                          type="number" min="0" max="20"
                          value={compNum2}
                          onChange={(e) => setCompNum2(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 text-center p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-lg"
                        />
                        <div className="w-16 h-1 bg-slate-800 my-1 rounded-full"></div>
                        <input
                          type="number" min="1" max="20"
                          value={compDen2}
                          onChange={(e) => setCompDen2(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-lg"
                        />
                      </div>
                      <span className="text-slate-400 font-mono text-sm">= {(compNum2 / compDen2).toFixed(3)}</span>
                    </div>
                    <FractionBar numerator={compNum2} denominator={compDen2} color="bg-blue-500" />
                  </div>
                </div>

                {/* Comparison result */}
                <div className="bg-white p-6 rounded-xl border-2 border-slate-200 text-center">
                  <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-3">Emaitza</p>
                  <div className="flex items-center justify-center gap-4 text-3xl font-mono font-bold">
                    <div className="flex flex-col items-center text-green-600">
                      <span>{compNum1}</span>
                      <div className="w-8 h-0.5 bg-current"></div>
                      <span>{compDen1}</span>
                    </div>
                    <span className={`text-4xl ${compareResult() === '=' ? 'text-slate-600' : 'text-green-600'}`}>
                      {compareResult()}
                    </span>
                    <div className="flex flex-col items-center text-blue-600">
                      <span>{compNum2}</span>
                      <div className="w-8 h-0.5 bg-current"></div>
                      <span>{compDen2}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-3">
                    {compareResult() === '=' && 'Bi zatikiak berdinak dira!'}
                    {compareResult() === '>' && 'Lehenengo zatikia handiagoa da.'}
                    {compareResult() === '<' && 'Bigarren zatikia handiagoa da.'}
                  </p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== FORMULAK ==================== */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zatikien Eragiketa Formulak" icon={ListOrdered}>
              <div className="space-y-6">

                {/* Batuketa */}
                <div className="bg-white rounded-2xl border-2 border-green-100 overflow-hidden shadow-sm">
                  <div className="bg-green-50 p-4 border-b border-green-100">
                    <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">+</div>
                      Batuketa (Batuketak)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-slate-900 text-white p-6 rounded-xl mb-4">
                      <div className="flex items-center justify-center gap-4 font-mono text-xl md:text-2xl">
                        <div className="flex flex-col items-center">
                          <span className="text-green-400">a</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-green-400">b</span>
                        </div>
                        <span className="text-slate-400">+</span>
                        <div className="flex flex-col items-center">
                          <span className="text-blue-400">c</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-blue-400">d</span>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div className="flex flex-col items-center">
                          <span><span className="text-green-400">a</span>&middot;<span className="text-blue-400">d</span> + <span className="text-blue-400">c</span>&middot;<span className="text-green-400">b</span></span>
                          <div className="w-full h-0.5 bg-white my-1"></div>
                          <span><span className="text-green-400">b</span>&middot;<span className="text-blue-400">d</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                      <p className="font-mono text-slate-700"><strong>Adibidea:</strong> 2/5 + 1/3 = (2&times;3 + 1&times;5) / (5&times;3) = (6+5) / 15 = <strong className="text-green-700">11/15</strong></p>
                    </div>
                  </div>
                </div>

                {/* Kenketa */}
                <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden shadow-sm">
                  <div className="bg-orange-50 p-4 border-b border-orange-100">
                    <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">&minus;</div>
                      Kenketa (Kenketak)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-slate-900 text-white p-6 rounded-xl mb-4">
                      <div className="flex items-center justify-center gap-4 font-mono text-xl md:text-2xl">
                        <div className="flex flex-col items-center">
                          <span className="text-green-400">a</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-green-400">b</span>
                        </div>
                        <span className="text-slate-400">&minus;</span>
                        <div className="flex flex-col items-center">
                          <span className="text-blue-400">c</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-blue-400">d</span>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div className="flex flex-col items-center">
                          <span><span className="text-green-400">a</span>&middot;<span className="text-blue-400">d</span> &minus; <span className="text-blue-400">c</span>&middot;<span className="text-green-400">b</span></span>
                          <div className="w-full h-0.5 bg-white my-1"></div>
                          <span><span className="text-green-400">b</span>&middot;<span className="text-blue-400">d</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-sm">
                      <p className="font-mono text-slate-700"><strong>Adibidea:</strong> 3/4 &minus; 1/6 = (3&times;6 &minus; 1&times;4) / (4&times;6) = (18&minus;4) / 24 = 14/24 = <strong className="text-orange-700">7/12</strong></p>
                    </div>
                  </div>
                </div>

                {/* Biderketa */}
                <div className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden shadow-sm">
                  <div className="bg-purple-50 p-4 border-b border-purple-100">
                    <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">&times;</div>
                      Biderketa (Biderketak)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-slate-900 text-white p-6 rounded-xl mb-4">
                      <div className="flex items-center justify-center gap-4 font-mono text-xl md:text-2xl">
                        <div className="flex flex-col items-center">
                          <span className="text-green-400">a</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-green-400">b</span>
                        </div>
                        <span className="text-slate-400">&times;</span>
                        <div className="flex flex-col items-center">
                          <span className="text-blue-400">c</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-blue-400">d</span>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div className="flex flex-col items-center">
                          <span><span className="text-green-400">a</span>&middot;<span className="text-blue-400">c</span></span>
                          <div className="w-full h-0.5 bg-white my-1"></div>
                          <span><span className="text-green-400">b</span>&middot;<span className="text-blue-400">d</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-sm">
                      <p className="font-mono text-slate-700"><strong>Adibidea:</strong> 2/3 &times; 4/5 = (2&times;4) / (3&times;5) = <strong className="text-purple-700">8/15</strong></p>
                    </div>
                    <p className="text-sm text-slate-500 mt-3">
                      <strong>Trikimailua:</strong> Zenbakitzaileak elkarrekin, izendatzaileak elkarrekin. Zuzenean!
                    </p>
                  </div>
                </div>

                {/* Zatiketa */}
                <div className="bg-white rounded-2xl border-2 border-red-100 overflow-hidden shadow-sm">
                  <div className="bg-red-50 p-4 border-b border-red-100">
                    <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">&divide;</div>
                      Zatiketa (Zatiketak)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-slate-900 text-white p-6 rounded-xl mb-4">
                      <div className="flex items-center justify-center gap-4 font-mono text-xl md:text-2xl">
                        <div className="flex flex-col items-center">
                          <span className="text-green-400">a</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-green-400">b</span>
                        </div>
                        <span className="text-slate-400">&divide;</span>
                        <div className="flex flex-col items-center">
                          <span className="text-blue-400">c</span>
                          <div className="w-6 h-0.5 bg-white my-1"></div>
                          <span className="text-blue-400">d</span>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div className="flex flex-col items-center">
                          <span><span className="text-green-400">a</span>&middot;<span className="text-blue-400">d</span></span>
                          <div className="w-full h-0.5 bg-white my-1"></div>
                          <span><span className="text-green-400">b</span>&middot;<span className="text-blue-400">c</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
                      <p className="font-mono text-slate-700"><strong>Adibidea:</strong> 3/4 &divide; 2/5 = (3&times;5) / (4&times;2) = 15/8</p>
                    </div>
                    <p className="text-sm text-slate-500 mt-3">
                      <strong>Gogoratu:</strong> Zatitzea = bigarren zatikia irauli eta biderkatzea.
                    </p>
                  </div>
                </div>

              </div>
            </Section>

            <Section title="Sinplifikazioa (ZKH)" icon={Zap}>
              <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl">
                <p className="text-slate-400 text-sm mb-6 font-bold tracking-widest uppercase text-center">Sinplifikazio formula</p>
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-6 font-mono text-xl md:text-2xl">
                    <div className="flex flex-col items-center">
                      <span className="text-green-400">n</span>
                      <div className="w-6 h-0.5 bg-white my-1"></div>
                      <span className="text-green-400">d</span>
                    </div>
                    <span className="text-slate-400">=</span>
                    <div className="flex flex-col items-center">
                      <span><span className="text-green-400">n</span> &divide; <span className="text-yellow-400">ZKH(n,d)</span></span>
                      <div className="w-full h-0.5 bg-white my-1"></div>
                      <span><span className="text-green-400">d</span> &divide; <span className="text-yellow-400">ZKH(n,d)</span></span>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl text-sm text-slate-300">
                    <p><strong className="text-yellow-400">ZKH</strong> = Zatitzaile Komunik Handiena (GCD ingelesez)</p>
                    <p className="mt-2 font-mono">Adibidea: 12/18 &rarr; ZKH(12,18) = 6 &rarr; (12&divide;6)/(18&divide;6) = <span className="text-green-400 font-bold">2/3</span></p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 p-6 rounded-xl border border-green-100">
                <h3 className="font-bold text-green-800 mb-3">Euklides-en Algoritmoa (ZKH bilatzeko)</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Zenbaki handiena txikienarengatik zatitu.</div>
                  <div className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Hondarra hartzen dugu.</div>
                  <div className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Aurreko zatitzailea hondarrarengatik zatitu.</div>
                  <div className="flex items-start gap-2"><Check size={16} className="shrink-0 mt-0.5" /> Hondarra 0 denean, azken zatitzailea da ZKH.</div>
                </div>
                <div className="mt-4 bg-white p-3 rounded-lg border border-green-200 font-mono text-sm text-slate-700">
                  <p>ZKH(48, 36):</p>
                  <p className="text-slate-500">48 = 36 &times; 1 + 12</p>
                  <p className="text-slate-500">36 = 12 &times; 3 + 0</p>
                  <p className="text-green-700 font-bold">ZKH = 12</p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== PRAKTIKA ==================== */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zatiki Ariketa Sortzailea" icon={Zap} className="border-green-200 ring-4 ring-green-50/50">
              <div className="max-w-xl mx-auto">

                {/* Difficulty Selector */}
                <div className="flex justify-center gap-2 mb-6">
                  {[
                    { id: 'erraza', label: 'Erraza', desc: 'Izendatzaile berdina' },
                    { id: 'ertaina', label: 'Ertaina', desc: 'Izendatzaile desberdinak' },
                    { id: 'zaila', label: 'Zaila', desc: 'Eragiketa mistoak' },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        difficulty === d.id ? 'bg-green-600 text-white shadow-sm shadow-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={d.desc}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <p className="text-center text-xs text-slate-400 mb-6">
                  {difficulty === 'erraza' && 'Izendatzaile berdina duten batuketa eta kenketak.'}
                  {difficulty === 'ertaina' && 'Izendatzaile desberdinak, lau eragiketa.'}
                  {difficulty === 'zaila' && 'Zenbaki handiagoak eta eragiketa mistoak.'}
                </p>

                {/* Score */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm">
                    <Trophy size={18} className="text-green-600" />
                    <span className="font-bold text-slate-700">{correctCount}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{total}</span>
                    {total > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        {Math.round((correctCount / total) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {problem && (
                  <div className="text-center space-y-8">

                    {/* Problem display */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">
                        {getOpName(problem.operation)}
                      </div>

                      <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-mono font-bold text-slate-800">
                        <div className="flex flex-col items-center">
                          <span>{problem.n1}</span>
                          <div className="w-full h-1 bg-slate-800"></div>
                          <span>{problem.d1}</span>
                        </div>
                        <span className="text-green-500">{getOpSymbol(problem.operation)}</span>
                        <div className="flex flex-col items-center">
                          <span>{problem.n2}</span>
                          <div className="w-full h-1 bg-slate-800"></div>
                          <span>{problem.d2}</span>
                        </div>
                        <span>=</span>
                        <span className="text-slate-300">?</span>
                      </div>
                    </div>

                    {/* User input */}
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-slate-600 mb-2">Idatzi emaitza (sinplifikatuta hobeto!)</p>
                      <div className="flex flex-col items-center gap-2">
                        <input
                          type="number"
                          placeholder="Zenbakitzailea"
                          value={userInput.n}
                          onChange={(e) => setUserInput({ ...userInput, n: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('den-input')?.focus()}
                          className="w-36 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none text-lg font-bold"
                        />
                        <div className="w-36 h-1 bg-slate-800 rounded-full"></div>
                        <input
                          id="den-input"
                          type="number"
                          placeholder="Izendatzailea"
                          value={userInput.d}
                          onChange={(e) => setUserInput({ ...userInput, d: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-36 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none text-lg font-bold"
                        />
                      </div>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                      <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${
                        feedback === 'correct' ? 'bg-green-100 text-green-700' :
                        feedback === 'invalid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {feedback === 'correct' ? <Check /> : feedback === 'invalid' ? <RefreshCw /> : <X />}
                          <span>
                            {feedback === 'correct' && 'Bikain! Ondo egin duzu!'}
                            {feedback === 'invalid' && 'Mesedez, sartu zenbaki baliodunak (izendatzailea ez da 0 izan behar).'}
                            {feedback === 'incorrect' && `Gaizki. Erantzun zuzena: ${problem.correctN}/${problem.correctD}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
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
                          className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-500 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          <ArrowRight size={18} /> Hurrengoa
                        </button>
                      )}
                    </div>

                    {/* Reset score */}
                    {total > 0 && (
                      <button
                        onClick={() => reset()}
                        className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors"
                      >
                        Puntuazioa berrezarri
                      </button>
                    )}

                  </div>
                )}
              </div>
            </Section>

          </div>
        )}

      </main>

      <RelatedTopics currentId="zatiki-sortzailea" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
