import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, Shapes, ArrowRight, Check, RefreshCw, Zap, ListOrdered, Triangle, Ruler, Calculator, Scale } from 'lucide-react';
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

// --- SVG Triangle Pair ---

const TrianglePair = ({ a, b, c, aPrime, bPrime, cPrime, k }) => {
  const scale1 = 1;
  const scale2 = k > 0 ? Math.min(k, 2.5) : 1;

  const baseWidth1 = 80;
  const height1 = 70;
  const baseWidth2 = baseWidth1 * scale2;
  const height2 = height1 * scale2;

  const svgWidth = Math.max(baseWidth1, baseWidth2) + 200;
  const svgHeight = Math.max(height1, height2) + 80;

  const cx1 = 100;
  const cy1 = svgHeight - 20;

  const cx2 = cx1 + baseWidth1 + 80;
  const cy2 = svgHeight - 20;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" style={{ maxHeight: '250px' }}>
      {/* First triangle */}
      <polygon
        points={`${cx1},${cy1} ${cx1 + baseWidth1},${cy1} ${cx1 + baseWidth1 / 2},${cy1 - height1}`}
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <text x={cx1 + baseWidth1 / 2} y={cy1 + 16} textAnchor="middle" className="text-xs font-bold" fill="#92400e">a = {a}</text>
      <text x={cx1 - 10} y={cy1 - height1 / 2 + 5} textAnchor="end" className="text-xs font-bold" fill="#92400e">b = {b}</text>
      <text x={cx1 + baseWidth1 + 10} y={cy1 - height1 / 2 + 5} textAnchor="start" className="text-xs font-bold" fill="#92400e">c = {c}</text>

      {/* Second triangle */}
      <polygon
        points={`${cx2},${cy2} ${cx2 + baseWidth2},${cy2} ${cx2 + baseWidth2 / 2},${cy2 - height2}`}
        fill="#fff7ed"
        stroke="#ea580c"
        strokeWidth="2"
      />
      <text x={cx2 + baseWidth2 / 2} y={cy2 + 16} textAnchor="middle" className="text-xs font-bold" fill="#9a3412">a' = {aPrime}</text>
      <text x={cx2 - 10} y={cy2 - height2 / 2 + 5} textAnchor="end" className="text-xs font-bold" fill="#9a3412">b' = {bPrime}</text>
      <text x={cx2 + baseWidth2 + 10} y={cy2 - height2 / 2 + 5} textAnchor="start" className="text-xs font-bold" fill="#9a3412">c' = {cPrime}</text>

      {/* Scale factor label */}
      <text x={svgWidth / 2} y={20} textAnchor="middle" className="text-sm font-bold" fill="#d97706">
        k = {k.toFixed(2)}
      </text>
    </svg>
  );
};

// --- Main Component ---

export default function AntzekotasunaTales() {
  useDocumentTitle('Antzekotasuna - Tales');
  const [activeTab, setActiveTab] = useState('teoria');

  // Lab state
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);
  const [sideC, setSideC] = useState(5);
  const [sideAPrime, setSideAPrime] = useState(6);
  const [calculatedK, setCalculatedK] = useState(2);
  const [calculatedBPrime, setCalculatedBPrime] = useState(8);
  const [calculatedCPrime, setCalculatedCPrime] = useState(10);

  // Practice state
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total: totalAttempts, addCorrect, addIncorrect, reset } = useProgress('antzekotasuna');

  useEffect(() => {
    generateProblem();
  }, []);

  // Lab calculations
  useEffect(() => {
    if (sideA > 0 && sideAPrime > 0) {
      const k = sideAPrime / sideA;
      setCalculatedK(k);
      setCalculatedBPrime(parseFloat((sideB * k).toFixed(4)));
      setCalculatedCPrime(parseFloat((sideC * k).toFixed(4)));
    }
  }, [sideA, sideB, sideC, sideAPrime]);

  // Problem generator
  const generateProblem = () => {
    const types = ['find_side', 'find_k', 'find_area_ratio', 'find_perimeter', 'thales_parallel'];
    const type = types[Math.floor(Math.random() * types.length)];

    let prob;

    if (type === 'find_side') {
      const a = Math.floor(Math.random() * 6) + 3;
      const b = Math.floor(Math.random() * 6) + 3;
      const k = [1.5, 2, 2.5, 3, 0.5][Math.floor(Math.random() * 5)];
      const aPrime = a * k;
      const bPrime = b * k;
      const hideSide = Math.random() > 0.5 ? 'bPrime' : 'aPrime';

      if (hideSide === 'bPrime') {
        prob = {
          type,
          display: `Bi triangelu antzekoak dira.\na = ${a}, b = ${b}, a' = ${aPrime}\nAurkitu b'`,
          solution: bPrime,
          hint: `Eskala-faktorea: k = a'/a = ${aPrime}/${a} = ${k}. Beraz b' = b x k = ${b} x ${k}`
        };
      } else {
        prob = {
          type,
          display: `Bi triangelu antzekoak dira.\na = ${a}, b = ${b}, b' = ${bPrime}\nAurkitu a'`,
          solution: aPrime,
          hint: `Eskala-faktorea: k = b'/b = ${bPrime}/${b} = ${k}. Beraz a' = a x k = ${a} x ${k}`
        };
      }
    } else if (type === 'find_k') {
      const a = Math.floor(Math.random() * 5) + 2;
      const k = [1.5, 2, 2.5, 3, 4][Math.floor(Math.random() * 5)];
      const aPrime = a * k;
      prob = {
        type,
        display: `Triangelu antzeko batean:\na = ${a}, a' = ${aPrime}\nZein da eskala-faktorea (k)?`,
        solution: k,
        hint: `k = a'/a = ${aPrime}/${a}`
      };
    } else if (type === 'find_area_ratio') {
      const k = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const areaRatio = k * k;
      prob = {
        type,
        display: `Eskala-faktorea k = ${k} bada,\nzein da azaleren arteko erlazioa?\n(Azalera handia / Azalera txikia)`,
        solution: areaRatio,
        hint: `Azaleren erlazioa = k^2 = ${k}^2`
      };
    } else if (type === 'find_perimeter') {
      const a = Math.floor(Math.random() * 4) + 3;
      const b = Math.floor(Math.random() * 4) + 3;
      const c = Math.floor(Math.random() * 4) + 3;
      const k = [2, 3, 1.5][Math.floor(Math.random() * 3)];
      const perimeter1 = a + b + c;
      const perimeter2 = perimeter1 * k;
      prob = {
        type,
        display: `Triangelu baten aldeak: ${a}, ${b}, ${c}\nEskala-faktorea k = ${k}\nZein da triangelu antzeko handiaren perimetroa?`,
        solution: perimeter2,
        hint: `Perimetroa' = Perimetroa x k = ${perimeter1} x ${k}`
      };
    } else {
      // thales_parallel
      const ab = Math.floor(Math.random() * 5) + 2;
      const bc = Math.floor(Math.random() * 5) + 2;
      const de = Math.floor(Math.random() * 5) + 3;
      const ef = parseFloat(((de * bc) / ab).toFixed(2));
      if (!Number.isFinite(ef) || ef !== Math.floor(ef)) {
        return generateProblem();
      }
      prob = {
        type,
        display: `Tales-en teorema: zuzen paraleloak.\nAB = ${ab}, BC = ${bc}, DE = ${de}\nAurkitu EF`,
        solution: ef,
        hint: `AB/BC = DE/EF => EF = (BC x DE) / AB = (${bc} x ${de}) / ${ab}`
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

  const tabs = [
    { key: 'teoria', label: 'Teoria' },
    { key: 'laborategia', label: 'Laborategia' },
    { key: 'formulak', label: 'Formulak' },
    { key: 'praktika', label: 'Praktika' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`transition-colors ${
                  tab.key === 'praktika'
                    ? `px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow-sm shadow-amber-200`
                    : `hover:text-amber-600 ${activeTab === tab.key ? 'text-amber-600' : ''}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Antzekotasuna - <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Tales</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tales-en teorema, irudi antzekoak eta eskala-faktorea: geometriaren oinarrizko tresnak proportzionaltasuna ulertzeko.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: TEORIA                                                 */}
        {/* ============================================================ */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Zer da antzekotasuna */}
            <Section title="Zer da Antzekotasuna?" icon={Shapes}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Bi irudi <strong>antzekoak</strong> dira baldin eta forma bera badute, baina tamaina desberdina. Hau da, angeluak berdinak dira eta aldeak <strong>proportzionalak</strong> dira.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                    <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <Shapes size={18} /> Irudi Antzekoen Ezaugarriak
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>Angelu guztiak berdinak dira (angelu homologoak).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>Alde homologoak proportzionalak dira.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>Eskala-faktorea (k) konstantea da alde guztietan.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-3">Adibidea</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Triangelu bat: aldeak <strong>3, 4, 5</strong></p>
                      <p>Triangelu antzekoa: aldeak <strong>6, 8, 10</strong></p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 mt-3 font-mono text-center">
                        <p>6/3 = 8/4 = 10/5 = <span className="text-amber-600 font-bold">2</span></p>
                        <p className="text-xs text-slate-400 mt-1">Eskala-faktorea k = 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Tales-en Teorema */}
            <Section title="Tales-en Teorema" icon={Ruler}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Tales-en Teorema</p>
                  <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Bi zuzen edo gehiago zuzen paralelo multzo batek ebakitzen baditu, zuzenen gaineko segmentuak <strong className="text-amber-400">proportzionalak</strong> dira.
                  </p>
                  <div className="mt-6 text-3xl md:text-4xl font-mono font-bold">
                    <span className="text-amber-400">a/a'</span>
                    <span className="text-slate-500 mx-2">=</span>
                    <span className="text-orange-400">b/b'</span>
                    <span className="text-slate-500 mx-2">=</span>
                    <span className="text-yellow-400">c/c'</span>
                    <span className="text-slate-500 mx-2">=</span>
                    <span className="text-white">k</span>
                  </div>
                </div>

                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="font-bold text-amber-800 mb-3">Adibide Grafikoa</h3>
                  <div className="bg-white p-4 rounded-lg border border-amber-100">
                    <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ maxHeight: '200px' }}>
                      {/* Secant lines */}
                      <line x1="50" y1="180" x2="180" y2="20" stroke="#f59e0b" strokeWidth="2.5" />
                      <line x1="120" y1="180" x2="250" y2="20" stroke="#f59e0b" strokeWidth="2.5" />

                      {/* Parallel lines */}
                      <line x1="30" y1="160" x2="280" y2="160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,3" />
                      <line x1="30" y1="100" x2="280" y2="100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,3" />
                      <line x1="30" y1="50" x2="280" y2="50" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,3" />

                      {/* Labels on first secant */}
                      <text x="70" y="145" fill="#d97706" fontWeight="bold" fontSize="14">a</text>
                      <text x="100" y="85" fill="#d97706" fontWeight="bold" fontSize="14">b</text>

                      {/* Labels on second secant */}
                      <text x="155" y="145" fill="#ea580c" fontWeight="bold" fontSize="14">a'</text>
                      <text x="185" y="85" fill="#ea580c" fontWeight="bold" fontSize="14">b'</text>

                      {/* Parallel label */}
                      <text x="300" y="105" fill="#94a3b8" fontSize="11" fontStyle="italic">paraleloak</text>
                      <text x="300" y="55" fill="#94a3b8" fontSize="11" fontStyle="italic">paraleloak</text>

                      {/* Intersection points */}
                      <circle cx="80" cy="160" r="4" fill="#f59e0b" />
                      <circle cx="120" cy="100" r="4" fill="#f59e0b" />
                      <circle cx="155" cy="50" r="4" fill="#f59e0b" />
                      <circle cx="150" cy="160" r="4" fill="#ea580c" />
                      <circle cx="190" cy="100" r="4" fill="#ea580c" />
                      <circle cx="225" cy="50" r="4" fill="#ea580c" />
                    </svg>
                  </div>
                  <p className="text-sm text-amber-800 mt-3 text-center font-mono font-bold">
                    a / a' = b / b' (Tales-en teorema)
                  </p>
                </div>
              </div>
            </Section>

            {/* Eskala-faktorea */}
            <Section title="Eskala-Faktorea (k)" icon={Scale}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  <strong>Eskala-faktorea</strong> (k) irudi antzeko baten aldeen arteko erlazioa adierazten du. Alde homologoen arteko zatiketak beti emaitza bera ematen du.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-amber-600 mb-2">k &gt; 1</p>
                    <p className="text-sm text-slate-600">Irudia <strong>handiagoa</strong> da jatorrizkoa baino.</p>
                    <p className="text-xs text-slate-400 mt-2">Adib: k=2, tamaina bikoitza</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-amber-600 mb-2">k = 1</p>
                    <p className="text-sm text-slate-600">Irudiak <strong>berdinak</strong> dira (kongruenteak).</p>
                    <p className="text-xs text-slate-400 mt-2">Tamaina bera</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-3xl font-bold text-amber-600 mb-2">k &lt; 1</p>
                    <p className="text-sm text-slate-600">Irudia <strong>txikiagoa</strong> da jatorrizkoa baino.</p>
                    <p className="text-xs text-slate-400 mt-2">Adib: k=0.5, tamaina erdia</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Triangelu antzekoen irizpideak */}
            <Section title="Triangelu Antzekoen Irizpideak" icon={Triangle}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Bi triangelu antzekoak diren egiaztatzeko, ez da beharrezkoa alde eta angelu guztiak konparatzea. Irizpide hauetako bat betetzea nahikoa da:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* AA */}
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mb-4 text-lg font-bold">AA</div>
                    <h3 className="font-bold text-amber-900 text-lg mb-2">Angelu-Angelu</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Bi triangeluk <strong>bi angelu berdin</strong> badituzte, triangeluak antzekoak dira.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-amber-100 text-xs text-slate-600">
                      <p>Hirugarren angelua ere berdina izango da (angeluen batura = 180°).</p>
                    </div>
                  </div>

                  {/* SAS */}
                  <div className="p-5 rounded-xl bg-orange-50 border border-orange-200">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mb-4 text-lg font-bold">SAS</div>
                    <h3 className="font-bold text-orange-900 text-lg mb-2">Alde-Angelu-Alde</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>Bi alde proportzionalak</strong> dira eta bien arteko <strong>angelua berdina</strong> da.
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-orange-100 text-xs text-slate-600">
                      <p>a/a' = b/b' eta angelu berdina bien artean.</p>
                    </div>
                  </div>

                  {/* SSS */}
                  <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-4 text-lg font-bold">SSS</div>
                    <h3 className="font-bold text-yellow-900 text-lg mb-2">Alde-Alde-Alde</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>Hiru aldeak proportzionalak</strong> dira (zatiketa bera ematen dute).
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-yellow-100 text-xs text-slate-600">
                      <p>a/a' = b/b' = c/c' = k</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-sm text-amber-800">
                  <Zap className="shrink-0 text-amber-600" size={20} />
                  <div>
                    <p><strong>Gogoratu:</strong> Antzekotasunak forma gordetzen du, baina ez tamaina. Kongruentzia kasu berezia da, non k = 1.</p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LABORATEGIA                                            */}
        {/* ============================================================ */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Tales Kalkulagailua" icon={Calculator}>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Sartu lehenengo triangeluaren hiru aldeak eta bigarrenaren alde bat. Sistemak eskala-faktorea eta gainerako aldeak kalkulatuko ditu.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Input panel */}
                  <div className="space-y-6">
                    {/* First triangle */}
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                      <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                        <Triangle size={18} /> 1. Triangelua (Jatorrizkoa)
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-amber-700 uppercase">Alde a</label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={sideA}
                            onChange={(e) => setSideA(parseFloat(e.target.value) || 0)}
                            className="w-full mt-1 p-2 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none text-center font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-amber-700 uppercase">Alde b</label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={sideB}
                            onChange={(e) => setSideB(parseFloat(e.target.value) || 0)}
                            className="w-full mt-1 p-2 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none text-center font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-amber-700 uppercase">Alde c</label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={sideC}
                            onChange={(e) => setSideC(parseFloat(e.target.value) || 0)}
                            className="w-full mt-1 p-2 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none text-center font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second triangle known side */}
                    <div className="p-5 bg-orange-50 border border-orange-200 rounded-xl">
                      <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <Triangle size={18} /> 2. Triangelua (Antzekoa)
                      </h3>
                      <div>
                        <label className="text-xs font-bold text-orange-700 uppercase">Alde a' (ezaguna)</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={sideAPrime}
                          onChange={(e) => setSideAPrime(parseFloat(e.target.value) || 0)}
                          className="w-full mt-1 p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none text-center font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results panel */}
                  <div className="space-y-6">
                    {/* Scale factor */}
                    <div className="bg-slate-900 text-white p-6 rounded-xl text-center">
                      <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Eskala-Faktorea</p>
                      <p className="text-4xl font-mono font-bold text-amber-400">
                        k = {isFinite(calculatedK) ? calculatedK.toFixed(2) : '---'}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">k = a' / a = {sideAPrime} / {sideA}</p>
                    </div>

                    {/* Calculated sides */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Kalkulatutako Aldeak</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-600">a' (ezaguna)</span>
                          <span className="font-mono font-bold text-orange-600">{sideAPrime}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <span className="text-sm text-slate-600">b' = b x k = {sideB} x {calculatedK.toFixed(2)}</span>
                          <span className="font-mono font-bold text-amber-600">{isFinite(calculatedBPrime) ? calculatedBPrime : '---'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <span className="text-sm text-slate-600">c' = c x k = {sideC} x {calculatedK.toFixed(2)}</span>
                          <span className="font-mono font-bold text-amber-600">{isFinite(calculatedCPrime) ? calculatedCPrime : '---'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proportion verification */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Proportzioa Egiaztatuta</p>
                      <p className="font-mono text-sm text-green-800">
                        {sideA > 0 ? (sideAPrime / sideA).toFixed(2) : '---'} = {sideB > 0 ? (calculatedBPrime / sideB).toFixed(2) : '---'} = {sideC > 0 ? (calculatedCPrime / sideC).toFixed(2) : '---'} = <span className="font-bold text-green-600">k</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual representation */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 text-center">Irudikapen Bisuala</h3>
                  <TrianglePair
                    a={sideA}
                    b={sideB}
                    c={sideC}
                    aPrime={sideAPrime}
                    bPrime={isFinite(calculatedBPrime) ? calculatedBPrime : 0}
                    cPrime={isFinite(calculatedCPrime) ? calculatedCPrime : 0}
                    k={isFinite(calculatedK) ? calculatedK : 1}
                  />
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: FORMULAK                                               */}
        {/* ============================================================ */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Tales formula */}
            <Section title="Tales-en Teoremaren Formula" icon={BookOpen}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">Tales-en Teorema</p>
                  <div className="text-3xl md:text-5xl font-mono font-bold">
                    <span className="text-amber-400">a</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-orange-400">a'</span>
                    <span className="text-slate-600 mx-3">=</span>
                    <span className="text-amber-400">b</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-orange-400">b'</span>
                    <span className="text-slate-600 mx-3">=</span>
                    <span className="text-amber-400">c</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-orange-400">c'</span>
                    <span className="text-slate-600 mx-3">=</span>
                    <span className="text-white font-extrabold">k</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-6">
                    non <span className="text-amber-400">a, b, c</span> lehenengo triangeluaren aldeak diren eta <span className="text-orange-400">a', b', c'</span> bigarrenarenak.
                  </p>
                </div>

                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <h3 className="font-bold text-amber-800 mb-3">Zer esan nahi du?</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <ArrowRight size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Alde homologoen arteko zatiketa beti berdina da.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Zatiketa hori <strong>eskala-faktorea (k)</strong> da.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Alde ezezagun bat kalkulatzeko, gurutzatutako biderketa erabiltzen da.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Eskala-faktorea formulak */}
            <Section title="Eskala-Faktorearen Formulak" icon={Ruler}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-amber-700 mb-3">Eskala-Faktorea</h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-center space-y-3">
                      <div className="text-xl font-bold text-amber-600">k = a' / a</div>
                      <div className="text-sm text-slate-500">Irudi handiaren aldea / irudi txikiaren aldea</div>
                    </div>
                  </div>
                  <div className="p-5 bg-white border border-slate-200 rounded-xl">
                    <h3 className="font-bold text-amber-700 mb-3">Alde Ezezaguna Aurkitu</h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-center space-y-3">
                      <div className="text-xl font-bold text-amber-600">x = alde x k</div>
                      <div className="text-sm text-slate-500">Aldea bider eskala-faktorea</div>
                    </div>
                  </div>
                </div>

                {/* Cross multiplication */}
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="font-bold text-amber-800 mb-4">Gurutzatutako Biderketa</h3>
                  <div className="bg-white p-4 rounded-lg border border-amber-100 font-mono text-center space-y-2">
                    <p className="text-lg">a / a' = b / b'</p>
                    <p className="text-slate-400">&#8595;</p>
                    <p className="text-lg font-bold text-amber-600">a x b' = a' x b</p>
                    <p className="text-slate-400">&#8595;</p>
                    <p className="text-lg font-bold text-amber-700">b' = (a' x b) / a</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Perimetroa eta Azalera */}
            <Section title="Perimetro eta Azalera Erlazioak" icon={Shapes}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Perimeter */}
                  <div className="p-6 rounded-xl bg-amber-50 border border-amber-200">
                    <h3 className="font-bold text-amber-900 text-lg mb-4 flex items-center gap-2">
                      <ListOrdered size={20} /> Perimetroen Erlazioa
                    </h3>
                    <div className="bg-white p-5 rounded-lg border border-amber-100 text-center space-y-3">
                      <div className="text-3xl font-mono font-bold text-amber-600">
                        P' / P = k
                      </div>
                      <div className="text-sm text-slate-600">
                        Perimetroen erlazioa = eskala-faktorea
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-600 bg-white p-3 rounded-lg border border-amber-100">
                      <p className="font-bold text-amber-800 mb-1">Adibidea:</p>
                      <p>P = 3 + 4 + 5 = 12</p>
                      <p>k = 2</p>
                      <p>P' = 12 x 2 = <strong className="text-amber-600">24</strong></p>
                    </div>
                  </div>

                  {/* Area */}
                  <div className="p-6 rounded-xl bg-orange-50 border border-orange-200">
                    <h3 className="font-bold text-orange-900 text-lg mb-4 flex items-center gap-2">
                      <Shapes size={20} /> Azaleren Erlazioa
                    </h3>
                    <div className="bg-white p-5 rounded-lg border border-orange-100 text-center space-y-3">
                      <div className="text-3xl font-mono font-bold text-orange-600">
                        A' / A = k<sup>2</sup>
                      </div>
                      <div className="text-sm text-slate-600">
                        Azaleren erlazioa = eskala-faktorea karratuan
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-600 bg-white p-3 rounded-lg border border-orange-100">
                      <p className="font-bold text-orange-800 mb-1">Adibidea:</p>
                      <p>A = 6 cm<sup>2</sup></p>
                      <p>k = 2, beraz k<sup>2</sup> = 4</p>
                      <p>A' = 6 x 4 = <strong className="text-orange-600">24 cm<sup>2</sup></strong></p>
                    </div>
                  </div>
                </div>

                {/* Summary table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-50 text-amber-800">
                        <th className="py-3 px-4 text-left font-bold">Neurria</th>
                        <th className="py-3 px-4 text-left font-bold">Erlazioa</th>
                        <th className="py-3 px-4 text-left font-bold">k=2 adibidea</th>
                        <th className="py-3 px-4 text-left font-bold">k=3 adibidea</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      <tr className="border-t border-slate-100">
                        <td className="py-2.5 px-4 font-sans font-bold">Aldeak</td>
                        <td className="py-2.5 px-4 text-amber-600 font-bold">x k</td>
                        <td className="py-2.5 px-4">x 2</td>
                        <td className="py-2.5 px-4">x 3</td>
                      </tr>
                      <tr className="border-t border-slate-100 bg-slate-50">
                        <td className="py-2.5 px-4 font-sans font-bold">Perimetroa</td>
                        <td className="py-2.5 px-4 text-amber-600 font-bold">x k</td>
                        <td className="py-2.5 px-4">x 2</td>
                        <td className="py-2.5 px-4">x 3</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="py-2.5 px-4 font-sans font-bold">Azalera</td>
                        <td className="py-2.5 px-4 text-orange-600 font-bold">x k<sup>2</sup></td>
                        <td className="py-2.5 px-4">x 4</td>
                        <td className="py-2.5 px-4">x 9</td>
                      </tr>
                      <tr className="border-t border-slate-100 bg-slate-50">
                        <td className="py-2.5 px-4 font-sans font-bold">Bolumena</td>
                        <td className="py-2.5 px-4 text-red-600 font-bold">x k<sup>3</sup></td>
                        <td className="py-2.5 px-4">x 8</td>
                        <td className="py-2.5 px-4">x 27</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PRAKTIKA                                               */}
        {/* ============================================================ */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Zap} className="border-amber-200 ring-4 ring-amber-50/50">
              <div className="max-w-xl mx-auto">

                {/* Score */}
                <div className="flex justify-center mb-6">
                  <div className="bg-amber-50 border border-amber-100 px-6 py-2 rounded-full text-sm font-bold text-amber-700 flex items-center gap-3">
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

                    {/* Problem display */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {practiceProblem.type === 'find_side' ? 'Alde Ezezaguna Aurkitu' :
                         practiceProblem.type === 'find_k' ? 'Eskala-Faktorea Kalkulatu' :
                         practiceProblem.type === 'find_area_ratio' ? 'Azalera Erlazioa' :
                         practiceProblem.type === 'find_perimeter' ? 'Perimetroa Kalkulatu' :
                         'Tales-en Teorema'}
                      </div>
                      <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold mt-4 whitespace-pre-line">
                        {practiceProblem.display}
                      </div>
                    </div>

                    {/* Answer input */}
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

                    {/* Feedback */}
                    {feedback && (
                      <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${
                        feedback === 'correct' ? 'bg-green-100 text-green-700' :
                        feedback === 'invalid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {feedback === 'correct' ? <Check /> : <RefreshCw />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Ondo kalkulatuta.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             `Oker. Erantzun zuzena: ${practiceProblem.solution}`}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Nola ebatzi?
                          </button>
                        )}
                      </div>
                    )}

                    {/* Hint */}
                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                        <strong>Azalpena:</strong> {practiceProblem.hint}
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
                      {feedback === 'correct' && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-400 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          <ArrowRight size={18} /> Hurrengoa
                        </button>
                      )}
                      {feedback === 'incorrect' && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
                        >
                          <RefreshCw size={18} /> Beste bat
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

      {/* Footer */}
      <RelatedTopics currentId="antzekotasuna" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
