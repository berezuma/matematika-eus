import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Check, RefreshCw, Zap, ListOrdered } from 'lucide-react';
import useProgress from '../hooks/useProgress';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Section Component ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Gauss Elimination Solver ---

function gaussElimination(matrix) {
  // Deep copy the matrix
  const m = matrix.map(row => [...row]);
  const n = m.length; // number of rows (3)
  const steps = [];

  steps.push({
    description: 'Hasierako matrize hedatua',
    matrix: m.map(row => [...row]),
    highlight: null
  });

  // Forward elimination
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    let maxVal = Math.abs(m[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(m[row][col]) > maxVal) {
        maxVal = Math.abs(m[row][col]);
        maxRow = row;
      }
    }

    // Swap rows if needed
    if (maxRow !== col) {
      [m[col], m[maxRow]] = [m[maxRow], m[col]];
      steps.push({
        description: `F${col + 1} <-> F${maxRow + 1} (errenkadak trukatu)`,
        matrix: m.map(row => [...row]),
        highlight: [col, maxRow]
      });
    }

    // Check for zero pivot
    if (Math.abs(m[col][col]) < 1e-10) {
      return { steps, solution: null, error: 'Sistema ez da bateragarri determinatua (pibot nulua).' };
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(m[row][col]) < 1e-10) continue;
      const factor = m[row][col] / m[col][col];
      const factorStr = formatFraction(m[row][col], m[col][col]);
      for (let j = col; j <= n; j++) {
        m[row][j] = m[row][j] - factor * m[col][j];
        // Clean up floating point
        if (Math.abs(m[row][j]) < 1e-10) m[row][j] = 0;
      }
      steps.push({
        description: `F${row + 1} = F${row + 1} - (${factorStr}) * F${col + 1}`,
        matrix: m.map(r => [...r]),
        highlight: [row]
      });
    }
  }

  // Back substitution
  const solution = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = m[i][n]; // right-hand side
    for (let j = i + 1; j < n; j++) {
      sum -= m[i][j] * solution[j];
    }
    if (Math.abs(m[i][i]) < 1e-10) {
      return { steps, solution: null, error: 'Sistema ez da bateragarri determinatua.' };
    }
    solution[i] = sum / m[i][i];
    // Clean up floating point
    if (Math.abs(solution[i] - Math.round(solution[i])) < 1e-9) {
      solution[i] = Math.round(solution[i]);
    }
  }

  steps.push({
    description: 'Matrize triangeluarra lortu dugu. Orain atzeranzko ordezkapena:',
    matrix: m.map(r => [...r]),
    highlight: null,
    isFinal: true
  });

  return { steps, solution, error: null };
}

function formatFraction(num, den) {
  if (den === 1) return `${num}`;
  if (den === -1) return `${-num}`;
  if (num % den === 0) return `${num / den}`;
  const sign = (num * den < 0) ? '-' : '';
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const g = gcd(absNum, absDen);
  return `${sign}${absNum / g}/${absDen / g}`;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function formatMatrixValue(val) {
  if (Number.isInteger(val)) return val.toString();
  // Try to display as fraction-like
  const rounded = Math.round(val * 1000) / 1000;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) return Math.round(rounded).toString();
  return rounded.toFixed(2);
}

// --- Main Component ---

export default function Sistemak3x3() {
  useDocumentTitle('3x3 Sistemak - Gauss');
  const [activeTab, setActiveTab] = useState('teoria');

  // Lab state
  const [labCoeffs, setLabCoeffs] = useState([
    [1, 1, 1, 6],
    [2, 3, 1, 14],
    [1, 2, 3, 16]
  ]);
  const [labResult, setLabResult] = useState(null);

  // Practice state
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInputs, setUserInputs] = useState({ x: '', y: '', z: '' });
  const [feedback, setFeedback] = useState(null);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('sys-3x3');

  useEffect(() => {
    generateProblem();
  }, []);

  // Lab functions
  const solveLab = () => {
    const matrix = labCoeffs.map(row => [...row]);
    const result = gaussElimination(matrix);
    setLabResult(result);
  };

  const updateLabCoeff = (row, col, value) => {
    const newCoeffs = labCoeffs.map(r => [...r]);
    newCoeffs[row][col] = parseFloat(value) || 0;
    setLabCoeffs(newCoeffs);
    setLabResult(null);
  };

  // Practice functions
  const generateProblem = () => {
    // Generate a 3x3 system with integer solutions
    const x = Math.floor(Math.random() * 9) - 4; // -4 to 4
    const y = Math.floor(Math.random() * 9) - 4;
    const z = Math.floor(Math.random() * 9) - 4;

    let a, det;
    do {
      a = [
        [randCoeff(), randCoeff(), randCoeff()],
        [randCoeff(), randCoeff(), randCoeff()],
        [randCoeff(), randCoeff(), randCoeff()]
      ];
      det = a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
          - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
          + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
    } while (det === 0);

    const c1 = a[0][0] * x + a[0][1] * y + a[0][2] * z;
    const c2 = a[1][0] * x + a[1][1] * y + a[1][2] * z;
    const c3 = a[2][0] * x + a[2][1] * y + a[2][2] * z;

    setPracticeProblem({
      matrix: [
        [a[0][0], a[0][1], a[0][2], c1],
        [a[1][0], a[1][1], a[1][2], c2],
        [a[2][0], a[2][1], a[2][2], c3]
      ],
      x, y, z,
      display: [
        formatEquation(a[0][0], a[0][1], a[0][2], c1),
        formatEquation(a[1][0], a[1][1], a[1][2], c2),
        formatEquation(a[2][0], a[2][1], a[2][2], c3)
      ]
    });
    setUserInputs({ x: '', y: '', z: '' });
    setFeedback(null);
  };

  const randCoeff = () => {
    let c;
    do {
      c = Math.floor(Math.random() * 7) - 3; // -3 to 3
    } while (c === 0);
    return c;
  };

  const formatEquation = (a, b, c, d) => {
    let str = '';
    // x term
    if (a !== 0) {
      str += (a < 0 ? '-' : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x';
    }
    // y term
    if (b !== 0) {
      if (a !== 0) {
        str += (b > 0 ? ' + ' : ' - ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y';
      } else {
        str += (b < 0 ? '-' : '') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y';
      }
    }
    // z term
    if (c !== 0) {
      if (a !== 0 || b !== 0) {
        str += (c > 0 ? ' + ' : ' - ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'z';
      } else {
        str += (c < 0 ? '-' : '') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'z';
      }
    }
    str += ` = ${d}`;
    return str;
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const ux = parseFloat(userInputs.x);
    const uy = parseFloat(userInputs.y);
    const uz = parseFloat(userInputs.z);

    if (isNaN(ux) || isNaN(uy) || isNaN(uz)) {
      setFeedback('invalid');
      return;
    }

    if (ux === practiceProblem.x && uy === practiceProblem.y && uz === practiceProblem.z) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  // Worked example data
  const workedExample = gaussElimination([
    [1, 1, 1, 6],
    [2, 3, 1, 14],
    [1, 2, 3, 16]
  ]);

  const tabs = [
    { id: 'teoria', label: 'Teoria' },
    { id: 'laborategia', label: 'Laborategia' },
    { id: 'pausoak', label: 'Pausoak' },
    { id: 'praktika', label: 'Praktika' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.map(t => (
              t.id === 'praktika' ? (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-sm shadow-purple-200"
                >
                  {t.label}
                </button>
              ) : (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`hover:text-purple-600 transition-colors ${activeTab === t.id ? 'text-purple-600' : ''}`}
                >
                  {t.label}
                </button>
              )
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            3x3 Sistemak - <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Gauss</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hiru ekuazio, hiru ezezagun: Gauss-en eliminazio metodoa erabiliz, matrize hedatua forma triangeluar bihurtu eta atzeranzko ordezkapenaz ebatzi.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.id ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* --- TAB 1: TEORIA --- */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zer da 3x3 ekuazio sistema bat?" icon={BookOpen} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="space-y-6">
                <p className="text-slate-600">
                  3x3 ekuazio sistema lineal bat <strong>hiru ekuazio linealez</strong> osatuta dago, <strong>hiru ezezagunekin</strong> (x, y, z).
                  Helburua: hiru aldagaien balioak aurkitzea, hiru ekuazioak aldi berean betetzen dituztenak.
                </p>

                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500"></div>
                  <p className="text-center text-sm text-slate-400 mb-6 uppercase tracking-widest font-bold">Ekuazio Sistema 3x3</p>
                  <div className="flex justify-center items-center gap-6">
                    <div className="text-5xl text-slate-600 font-light">{`{`}</div>
                    <div className="space-y-3">
                      <div className="text-lg md:text-xl font-mono">
                        <span className="text-purple-400">a₁</span>x + <span className="text-purple-400">b₁</span>y + <span className="text-purple-400">c₁</span>z = <span className="text-purple-400">d₁</span>
                      </div>
                      <div className="text-lg md:text-xl font-mono">
                        <span className="text-fuchsia-400">a₂</span>x + <span className="text-fuchsia-400">b₂</span>y + <span className="text-fuchsia-400">c₂</span>z = <span className="text-fuchsia-400">d₂</span>
                      </div>
                      <div className="text-lg md:text-xl font-mono">
                        <span className="text-indigo-400">a₃</span>x + <span className="text-indigo-400">b₃</span>y + <span className="text-indigo-400">c₃</span>z = <span className="text-indigo-400">d₃</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Matrize Hedatua" icon={ListOrdered}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Gauss metodoa aplikatzeko, sistema <strong>matrize hedatu</strong> gisa idazten dugu.
                  Koefizienteak eta termino askeak taula batean jartzen ditugu:
                </p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Matrize Hedatua</p>
                  <div className="flex justify-center items-center gap-2">
                    <div className="text-4xl text-slate-500">(</div>
                    <div className="font-mono text-lg space-y-2">
                      <div className="flex gap-4">
                        <span className="text-purple-400 w-8 text-right">a₁</span>
                        <span className="text-purple-400 w-8 text-right">b₁</span>
                        <span className="text-purple-400 w-8 text-right">c₁</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-yellow-400 w-8 text-right">d₁</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-fuchsia-400 w-8 text-right">a₂</span>
                        <span className="text-fuchsia-400 w-8 text-right">b₂</span>
                        <span className="text-fuchsia-400 w-8 text-right">c₂</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-yellow-400 w-8 text-right">d₂</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-indigo-400 w-8 text-right">a₃</span>
                        <span className="text-indigo-400 w-8 text-right">b₃</span>
                        <span className="text-indigo-400 w-8 text-right">c₃</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-yellow-400 w-8 text-right">d₃</span>
                      </div>
                    </div>
                    <div className="text-4xl text-slate-500">)</div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4">Marra bertikalaren ezkerrean koefizienteak, eskuinean termino askeak</p>
                </div>
              </div>
            </Section>

            <Section title="Gauss-en Eliminazio Metodoa" icon={Zap}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Gauss-en metodoak <strong>errenkada-eragiketak</strong> erabiltzen ditu matrize hedatua <strong>forma triangeluar</strong> bihurtzeko.
                  Ondoren, <strong>atzeranzko ordezkapena</strong> egiten da aldagaien balioak lortzeko.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3 font-bold">1</div>
                    <h3 className="font-bold text-slate-800 mb-2">Errenkadak trukatu</h3>
                    <p className="text-sm text-slate-600">
                      Bi errenkada trukatu dezakegu: <strong>F_i &lt;-&gt; F_j</strong>
                    </p>
                    <p className="text-xs text-purple-600 font-mono mt-2">F1 &lt;-&gt; F2</p>
                  </div>
                  <div className="p-4 bg-fuchsia-50 border border-fuchsia-100 rounded-xl">
                    <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center mb-3 font-bold">2</div>
                    <h3 className="font-bold text-slate-800 mb-2">Errenkada biderkatu</h3>
                    <p className="text-sm text-slate-600">
                      Errenkada bat zenbaki ez-nulu batez biderkatu: <strong>F_i = k * F_i</strong>
                    </p>
                    <p className="text-xs text-fuchsia-600 font-mono mt-2">F2 = 3 * F2</p>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 font-bold">3</div>
                    <h3 className="font-bold text-slate-800 mb-2">Errenkadak batu</h3>
                    <p className="text-sm text-slate-600">
                      Errenkada bati beste bat (biderkatuta) gehitu: <strong>F_i = F_i - k * F_j</strong>
                    </p>
                    <p className="text-xs text-indigo-600 font-mono mt-2">F2 = F2 - 2*F1</p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Helburua: Forma Triangeluarra</p>
                  <div className="flex justify-center items-center gap-2">
                    <div className="text-4xl text-slate-500">(</div>
                    <div className="font-mono text-lg space-y-2">
                      <div className="flex gap-4">
                        <span className="text-green-400 w-8 text-right">*</span>
                        <span className="text-green-400 w-8 text-right">*</span>
                        <span className="text-green-400 w-8 text-right">*</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-yellow-400 w-8 text-right">*</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-red-400 w-8 text-right">0</span>
                        <span className="text-green-400 w-8 text-right">*</span>
                        <span className="text-green-400 w-8 text-right">*</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-yellow-400 w-8 text-right">*</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-red-400 w-8 text-right">0</span>
                        <span className="text-red-400 w-8 text-right">0</span>
                        <span className="text-green-400 w-8 text-right">*</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-yellow-400 w-8 text-right">*</span>
                      </div>
                    </div>
                    <div className="text-4xl text-slate-500">)</div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4">Diagonal azpiko elementu guztiak 0 bihurtu</p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex gap-3 text-sm text-purple-800">
                  <Zap className="shrink-0" size={20} />
                  <p>
                    <strong>Atzeranzko ordezkapena:</strong> Forma triangeluarra lortu ondoren, azken ekuaziotik z kalkulatu,
                    gero bigarrenean ordeztu y lortzeko, eta azkenik lehenengoan x aurkitu.
                  </p>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- TAB 2: LABORATEGIA --- */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="3x3 Sistema Ebazlea" icon={Zap} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="space-y-8">

                <p className="text-slate-600 text-sm">
                  Sartu zure 3x3 ekuazio sistemaren koefizienteak eta termino askeak. Gauss-en eliminazio metodoa pausoz pauso ikusiko duzu.
                </p>

                {/* Input equations */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">Ekuazioak sartu</p>
                  {[0, 1, 2].map(row => (
                    <div key={row} className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-400 w-8">F{row + 1}:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={labCoeffs[row][0]}
                          onChange={(e) => updateLabCoeff(row, 0, e.target.value)}
                          className="w-16 text-center p-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm font-mono font-bold"
                        />
                        <span className="font-mono text-slate-500 text-sm">x +</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={labCoeffs[row][1]}
                          onChange={(e) => updateLabCoeff(row, 1, e.target.value)}
                          className="w-16 text-center p-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm font-mono font-bold"
                        />
                        <span className="font-mono text-slate-500 text-sm">y +</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={labCoeffs[row][2]}
                          onChange={(e) => updateLabCoeff(row, 2, e.target.value)}
                          className="w-16 text-center p-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm font-mono font-bold"
                        />
                        <span className="font-mono text-slate-500 text-sm">z =</span>
                      </div>
                      <input
                        type="number"
                        value={labCoeffs[row][3]}
                        onChange={(e) => updateLabCoeff(row, 3, e.target.value)}
                        className="w-16 text-center p-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-sm font-mono font-bold bg-purple-50"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={solveLab}
                  className="w-full px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <Zap size={18} /> Gauss metodoa aplikatu
                </button>

                {/* Results */}
                {labResult && (
                  <div className="space-y-6 animate-in fade-in duration-500">

                    {/* Steps */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">Pausoak</p>
                      {labResult.steps.map((step, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${step.isFinal ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${step.isFinal ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold text-sm mb-3 ${step.isFinal ? 'text-green-800' : 'text-slate-800'}`}>{step.description}</p>
                              <div className="flex justify-center items-center gap-2">
                                <div className="text-2xl text-slate-400">(</div>
                                <div className="font-mono text-sm space-y-1">
                                  {step.matrix.map((row, ri) => (
                                    <div key={ri} className={`flex gap-3 px-2 py-1 rounded ${step.highlight && step.highlight.includes(ri) ? 'bg-yellow-100' : ''}`}>
                                      {row.slice(0, 3).map((val, ci) => (
                                        <span key={ci} className="w-10 text-right font-bold text-slate-700">{formatMatrixValue(val)}</span>
                                      ))}
                                      <span className="text-slate-400">|</span>
                                      <span className="w-10 text-right font-bold text-purple-700">{formatMatrixValue(row[3])}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="text-2xl text-slate-400">)</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Solution */}
                    {labResult.solution ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Soluzioa</p>
                        <div className="font-mono text-xl font-bold text-green-700 space-x-6">
                          <span>x = {formatMatrixValue(labResult.solution[0])}</span>
                          <span>y = {formatMatrixValue(labResult.solution[1])}</span>
                          <span>z = {formatMatrixValue(labResult.solution[2])}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                        <p className="text-red-700 font-bold">{labResult.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

        {/* --- TAB 3: PAUSOAK (Worked Example) --- */}
        {activeTab === 'pausoak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Adibide Zehatza: Pausoz Pauso" icon={ListOrdered} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="space-y-6">

                <p className="text-slate-600 text-sm">
                  Ikus dezagun Gauss-en eliminazio metodoa adibide zehatz batekin, urrats bakoitza argi azalduz.
                </p>

                {/* The system */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500"></div>
                  <p className="text-center text-sm text-slate-400 mb-6 uppercase tracking-widest font-bold">Ebatzi beharreko sistema</p>
                  <div className="flex justify-center items-center gap-6">
                    <div className="text-5xl text-slate-600 font-light">{`{`}</div>
                    <div className="space-y-3">
                      <div className="text-lg md:text-xl font-mono">
                        <span className="text-purple-400">x</span> + <span className="text-purple-400">y</span> + <span className="text-purple-400">z</span> = <span className="text-yellow-400">6</span>
                      </div>
                      <div className="text-lg md:text-xl font-mono">
                        <span className="text-fuchsia-400">2x</span> + <span className="text-fuchsia-400">3y</span> + <span className="text-fuchsia-400">z</span> = <span className="text-yellow-400">14</span>
                      </div>
                      <div className="text-lg md:text-xl font-mono">
                        <span className="text-indigo-400">x</span> + <span className="text-indigo-400">2y</span> + <span className="text-indigo-400">3z</span> = <span className="text-yellow-400">16</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1: Write augmented matrix */}
                <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-2">Matrize hedatua idatzi</h3>
                      <p className="text-sm text-slate-600 mb-3">Koefizienteak eta termino askeak matrize batean jartzen ditugu:</p>
                      <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg">
                        <div className="text-2xl text-slate-400">(</div>
                        <div className="font-mono text-base space-y-1">
                          <div className="flex gap-4">
                            <span className="w-6 text-right text-purple-700 font-bold">1</span>
                            <span className="w-6 text-right text-purple-700 font-bold">1</span>
                            <span className="w-6 text-right text-purple-700 font-bold">1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right text-yellow-600 font-bold">6</span>
                          </div>
                          <div className="flex gap-4">
                            <span className="w-6 text-right text-fuchsia-700 font-bold">2</span>
                            <span className="w-6 text-right text-fuchsia-700 font-bold">3</span>
                            <span className="w-6 text-right text-fuchsia-700 font-bold">1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right text-yellow-600 font-bold">14</span>
                          </div>
                          <div className="flex gap-4">
                            <span className="w-6 text-right text-indigo-700 font-bold">1</span>
                            <span className="w-6 text-right text-indigo-700 font-bold">2</span>
                            <span className="w-6 text-right text-indigo-700 font-bold">3</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right text-yellow-600 font-bold">16</span>
                          </div>
                        </div>
                        <div className="text-2xl text-slate-400">)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: F2 = F2 - 2*F1 */}
                <div className="p-5 rounded-xl bg-fuchsia-50 border border-fuchsia-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-fuchsia-200 text-fuchsia-800 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-2">F2 = F2 - 2 * F1</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        2. errenkadako lehen elementua (2) eliminatu nahi dugu. F1-eko pibot-a 1 denez, 2*F1 kendu F2-ri:
                      </p>
                      <div className="bg-white p-3 rounded-lg mb-3 font-mono text-sm text-slate-600 space-y-1">
                        <p>F2 = (2, 3, 1 | 14) - 2 * (1, 1, 1 | 6)</p>
                        <p>F2 = (2-2, 3-2, 1-2 | 14-12)</p>
                        <p className="font-bold text-fuchsia-700">F2 = (0, 1, -1 | 2)</p>
                      </div>
                      <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg">
                        <div className="text-2xl text-slate-400">(</div>
                        <div className="font-mono text-base space-y-1">
                          <div className="flex gap-4">
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">6</span>
                          </div>
                          <div className="flex gap-4 bg-yellow-100 rounded px-1">
                            <span className="w-6 text-right font-bold text-green-600">0</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">-1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">2</span>
                          </div>
                          <div className="flex gap-4">
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">2</span>
                            <span className="w-6 text-right font-bold">3</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">16</span>
                          </div>
                        </div>
                        <div className="text-2xl text-slate-400">)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: F3 = F3 - 1*F1 */}
                <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-2">F3 = F3 - 1 * F1</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        3. errenkadako lehen elementua (1) eliminatu nahi dugu. F1 kendu F3-ri:
                      </p>
                      <div className="bg-white p-3 rounded-lg mb-3 font-mono text-sm text-slate-600 space-y-1">
                        <p>F3 = (1, 2, 3 | 16) - 1 * (1, 1, 1 | 6)</p>
                        <p>F3 = (1-1, 2-1, 3-1 | 16-6)</p>
                        <p className="font-bold text-indigo-700">F3 = (0, 1, 2 | 10)</p>
                      </div>
                      <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg">
                        <div className="text-2xl text-slate-400">(</div>
                        <div className="font-mono text-base space-y-1">
                          <div className="flex gap-4">
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">6</span>
                          </div>
                          <div className="flex gap-4">
                            <span className="w-6 text-right font-bold text-green-600">0</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">-1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">2</span>
                          </div>
                          <div className="flex gap-4 bg-yellow-100 rounded px-1">
                            <span className="w-6 text-right font-bold text-green-600">0</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">2</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">10</span>
                          </div>
                        </div>
                        <div className="text-2xl text-slate-400">)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: F3 = F3 - 1*F2 */}
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">4</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-2">F3 = F3 - 1 * F2</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        3. errenkadako bigarren elementua (1) eliminatu nahi dugu. F2 kendu F3-ri:
                      </p>
                      <div className="bg-white p-3 rounded-lg mb-3 font-mono text-sm text-slate-600 space-y-1">
                        <p>F3 = (0, 1, 2 | 10) - 1 * (0, 1, -1 | 2)</p>
                        <p>F3 = (0-0, 1-1, 2-(-1) | 10-2)</p>
                        <p className="font-bold text-blue-700">F3 = (0, 0, 3 | 8)</p>
                      </div>
                      <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg">
                        <div className="text-2xl text-slate-400">(</div>
                        <div className="font-mono text-base space-y-1">
                          <div className="flex gap-4">
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">6</span>
                          </div>
                          <div className="flex gap-4">
                            <span className="w-6 text-right font-bold text-green-600">0</span>
                            <span className="w-6 text-right font-bold">1</span>
                            <span className="w-6 text-right font-bold">-1</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">2</span>
                          </div>
                          <div className="flex gap-4 bg-yellow-100 rounded px-1">
                            <span className="w-6 text-right font-bold text-green-600">0</span>
                            <span className="w-6 text-right font-bold text-green-600">0</span>
                            <span className="w-6 text-right font-bold">3</span>
                            <span className="text-slate-400">|</span>
                            <span className="w-6 text-right font-bold">8</span>
                          </div>
                        </div>
                        <div className="text-2xl text-slate-400">)</div>
                      </div>
                      <p className="text-sm text-blue-700 font-bold mt-3 text-center">Forma triangeluarra lortu dugu!</p>
                    </div>
                  </div>
                </div>

                {/* Step 5: Back substitution */}
                <div className="p-5 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-200 text-green-800 flex items-center justify-center font-bold text-sm shrink-0">5</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-2">Atzeranzko ordezkapena</h3>
                      <p className="text-sm text-slate-600 mb-3">Forma triangeluarretik, beheko ekuaziotik gorakora ebazten dugu:</p>

                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg font-mono text-sm">
                          <p className="text-slate-500 mb-1">3. ekuaziotik:</p>
                          <p className="text-slate-800">3z = 8</p>
                          <p className="font-bold text-green-700">z = 8/3</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg font-mono text-sm">
                          <p className="text-slate-500 mb-1">2. ekuaziotik: y - z = 2</p>
                          <p className="text-slate-800">y = 2 + z = 2 + 8/3 = 6/3 + 8/3</p>
                          <p className="font-bold text-green-700">y = 14/3</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg font-mono text-sm">
                          <p className="text-slate-500 mb-1">1. ekuaziotik: x + y + z = 6</p>
                          <p className="text-slate-800">x = 6 - y - z = 6 - 14/3 - 8/3 = 18/3 - 14/3 - 8/3</p>
                          <p className="font-bold text-green-700">x = -4/3</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final solution */}
                <div className="bg-green-100 p-4 rounded-xl border border-green-200 text-center">
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Azken Soluzioa</p>
                  <div className="font-mono text-xl font-bold text-green-800 space-x-4">
                    <span>x = -4/3</span>
                    <span>y = 14/3</span>
                    <span>z = 8/3</span>
                  </div>
                </div>

                {/* Verification */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800 font-bold mb-2">Egiaztapena:</p>
                  <div className="font-mono text-xs text-purple-700 space-y-1">
                    <p>1. ekuazioa: (-4/3) + (14/3) + (8/3) = (-4+14+8)/3 = 18/3 = 6 &#10003;</p>
                    <p>2. ekuazioa: 2(-4/3) + 3(14/3) + (8/3) = (-8+42+8)/3 = 42/3 = 14 &#10003;</p>
                    <p>3. ekuazioa: (-4/3) + 2(14/3) + 3(8/3) = (-4+28+24)/3 = 48/3 = 16 &#10003;</p>
                  </div>
                </div>

              </div>
            </Section>
          </div>
        )}

        {/* --- TAB 4: PRAKTIKA --- */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={BookOpen} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-purple-50 border border-purple-100 px-6 py-2 rounded-full text-sm font-bold text-purple-700 flex items-center gap-3">
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
                      <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Ebatzi sistema (Gauss)</div>
                      <div className="flex justify-center items-center gap-4">
                        <div className="text-4xl text-slate-300 font-light">{`{`}</div>
                        <div className="text-lg md:text-xl font-mono text-slate-800 font-bold space-y-2 text-left">
                          <p>{practiceProblem.display[0]}</p>
                          <p>{practiceProblem.display[1]}</p>
                          <p>{practiceProblem.display[2]}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <p className="text-slate-600 mb-2">Zeintzuk dira x, y eta z-ren balioak?</p>
                      <div className="flex gap-4 justify-center flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">x =</span>
                          <input
                            type="number"
                            placeholder="?"
                            value={userInputs.x}
                            onChange={(e) => setUserInputs({...userInputs, x: e.target.value})}
                            className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">y =</span>
                          <input
                            type="number"
                            placeholder="?"
                            value={userInputs.y}
                            onChange={(e) => setUserInputs({...userInputs, y: e.target.value})}
                            className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">z =</span>
                          <input
                            type="number"
                            placeholder="?"
                            value={userInputs.z}
                            onChange={(e) => setUserInputs({...userInputs, z: e.target.value})}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                            className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg font-bold"
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
                             feedback === 'invalid' ? 'Mesedez, sartu hiru zenbaki.' :
                             'Ia-ia... Saiatu berriro!'}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <p className="text-sm mt-1">
                            Pista: Gauss metodoa erabili matrize hedatuarekin.
                          </p>
                        )}
                      </div>
                    )}

                    {feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 text-left animate-in fade-in">
                        <strong>Pista:</strong> Gauss-en metodoa pausoz pauso:
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                          <li>Idatzi matrize hedatua</li>
                          <li>Eliminatu 1. zutabeko elementuak (F2 eta F3)</li>
                          <li>Eliminatu 2. zutabeko elementua (F3)</li>
                          <li>Atzeranzko ordezkapena: z, gero y, gero x</li>
                        </ol>
                        <p className="mt-2 font-mono text-xs">
                          Soluzioa: x = {practiceProblem.x}, y = {practiceProblem.y}, z = {practiceProblem.z}
                        </p>
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
                          className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-500 transition-all flex items-center gap-2 animate-in fade-in"
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

      <RelatedTopics currentId="sys-3x3" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
