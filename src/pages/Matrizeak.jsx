import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import {
  BookOpen,
  Check,
  RefreshCw,
  Brain,
  ArrowRight,
  AlertTriangle,
  Layers,
  ListOrdered,
  Calculator,
  Grid3X3,
  Cpu,
  ImageIcon,
  Network,
  X
} from 'lucide-react';

// --- Utility Components ---

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

// --- Matrix Utilities ---

const createMatrix = (rows, cols, fill = 0) =>
  Array.from({ length: rows }, () => Array(cols).fill(fill));

const addMatrices = (A, B) =>
  A.map((row, i) => row.map((val, j) => val + B[i][j]));

const subtractMatrices = (A, B) =>
  A.map((row, i) => row.map((val, j) => val - B[i][j]));

const multiplyMatrices = (A, B) => {
  const rows = A.length;
  const cols = B[0].length;
  const n = A[0].length;
  const result = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
};

const scalarMultiply = (A, k) =>
  A.map(row => row.map(val => val * k));

const transpose = (A) =>
  A[0].map((_, j) => A.map(row => row[j]));

const det2x2 = (m) => m[0][0] * m[1][1] - m[0][1] * m[1][0];

const det3x3 = (m) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

const inverse2x2 = (m) => {
  const d = det2x2(m);
  if (d === 0) return null;
  return [
    [m[1][1] / d, -m[0][1] / d],
    [-m[1][0] / d, m[0][0] / d]
  ];
};

const formatNum = (n) => {
  if (Number.isInteger(n)) return n.toString();
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
};

// --- Matrix Input Component ---

const MatrixInput = ({ matrix, onChange, label, color = 'purple' }) => (
  <div>
    <p className={`text-xs font-bold text-${color}-500 uppercase tracking-widest mb-2`}>{label}</p>
    <div className="inline-flex items-center gap-1">
      <div className={`text-4xl font-extralight text-${color}-300 select-none`}>[</div>
      <div className="space-y-1">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((val, j) => (
              <input
                key={j}
                type="number"
                value={val}
                onChange={(e) => {
                  const newMatrix = matrix.map(r => [...r]);
                  newMatrix[i][j] = parseFloat(e.target.value) || 0;
                  onChange(newMatrix);
                }}
                className={`w-14 h-10 text-center border-2 border-slate-200 rounded-lg focus:border-${color}-500 focus:outline-none font-mono font-bold text-sm`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={`text-4xl font-extralight text-${color}-300 select-none`}>]</div>
    </div>
  </div>
);

// --- Matrix Display Component ---

const MatrixDisplay = ({ matrix, color = 'purple', label }) => (
  <div className="text-center">
    {label && <p className={`text-xs font-bold text-${color}-500 uppercase tracking-widest mb-2`}>{label}</p>}
    <div className="inline-flex items-center gap-1">
      <div className={`text-4xl font-extralight text-${color}-300 select-none`}>[</div>
      <div className="space-y-0.5">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((val, j) => (
              <span key={j} className={`w-14 h-8 flex items-center justify-center font-mono font-bold text-sm text-${color}-700`}>
                {formatNum(val)}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={`text-4xl font-extralight text-${color}-300 select-none`}>]</div>
    </div>
  </div>
);

// --- Matrix Calculator ---

const MatrixCalculator = () => {
  const [size, setSize] = useState(2);
  const [matA, setMatA] = useState([[1, 2], [3, 4]]);
  const [matB, setMatB] = useState([[5, 6], [7, 8]]);
  const [operation, setOperation] = useState('add');
  const [scalar, setScalar] = useState(2);

  useEffect(() => {
    setMatA(createMatrix(size, size, 0).map((r, i) => r.map((_, j) => (i === j ? 1 : 0))));
    setMatB(createMatrix(size, size, 0).map((r, i) => r.map((_, j) => (i + j + 1))));
  }, [size]);

  let result = null;
  let error = null;

  try {
    if (operation === 'add') result = addMatrices(matA, matB);
    else if (operation === 'sub') result = subtractMatrices(matA, matB);
    else if (operation === 'mult') result = multiplyMatrices(matA, matB);
    else if (operation === 'scalar') result = scalarMultiply(matA, scalar);
    else if (operation === 'transpose') result = transpose(matA);
  } catch {
    error = 'Ezin da eragiketa egin dimentsio hauekin.';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {[2, 3].map(n => (
          <button
            key={n}
            onClick={() => setSize(n)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
              size === n
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
            }`}
          >
            {n}×{n} Matrizea
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'add', label: 'A + B' },
          { id: 'sub', label: 'A - B' },
          { id: 'mult', label: 'A × B' },
          { id: 'scalar', label: 'k · A' },
          { id: 'transpose', label: 'Aᵀ' },
        ].map(op => (
          <button
            key={op.id}
            onClick={() => setOperation(op.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              operation === op.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-8 justify-center items-start">
        <MatrixInput matrix={matA} onChange={setMatA} label="A matrizea" color="purple" />
        {operation !== 'scalar' && operation !== 'transpose' && (
          <MatrixInput matrix={matB} onChange={setMatB} label="B matrizea" color="violet" />
        )}
        {operation === 'scalar' && (
          <div>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Eskalar (k)</p>
            <input
              type="number"
              value={scalar}
              onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
              className="w-20 h-10 text-center border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none font-mono font-bold text-lg"
            />
          </div>
        )}
      </div>

      {result && !error && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 flex justify-center">
          <MatrixDisplay matrix={result} color="purple" label="Emaitza" />
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center text-red-700 text-sm font-bold">
          {error}
        </div>
      )}
    </div>
  );
};

// --- Determinant Calculator ---

const DeterminantCalculator = () => {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState([[3, 8], [4, 6]]);

  useEffect(() => {
    if (size === 2) setMatrix([[3, 8], [4, 6]]);
    else setMatrix([[2, -1, 3], [0, 4, -2], [1, 3, 1]]);
  }, [size]);

  const d = size === 2 ? det2x2(matrix) : det3x3(matrix);
  const inv = size === 2 ? inverse2x2(matrix) : null;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 justify-center">
        {[2, 3].map(n => (
          <button
            key={n}
            onClick={() => setSize(n)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
              size === n
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'
            }`}
          >
            {n}×{n}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <MatrixInput matrix={matrix} onChange={setMatrix} label="Matrizea" color="amber" />
      </div>

      {/* Step-by-step for 2x2 */}
      {size === 2 && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold text-center">Determinantearen kalkulua (2×2)</p>
          <div className="text-center font-mono space-y-2">
            <p className="text-lg">
              |A| = <span className="text-purple-400">{matrix[0][0]}</span> · <span className="text-purple-400">{matrix[1][1]}</span> - <span className="text-amber-400">{matrix[0][1]}</span> · <span className="text-amber-400">{matrix[1][0]}</span>
            </p>
            <p className="text-lg">
              |A| = <span className="text-purple-400">{matrix[0][0] * matrix[1][1]}</span> - <span className="text-amber-400">{matrix[0][1] * matrix[1][0]}</span>
            </p>
            <p className="text-2xl font-bold">
              |A| = <span className={d === 0 ? 'text-red-400' : 'text-green-400'}>{d}</span>
            </p>
          </div>
        </div>
      )}

      {/* Step-by-step for 3x3 (Sarrus) */}
      {size === 3 && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold text-center">Determinantearen kalkulua (3×3 - Sarrus)</p>
          <div className="text-center font-mono space-y-2 text-sm">
            <p className="text-slate-400">Diagonal nagusiak (+) - Diagonal kontrajarriak (-)</p>
            <p>
              <span className="text-green-400">+({matrix[0][0]}·{matrix[1][1]}·{matrix[2][2]})</span>{' '}
              <span className="text-green-400">+({matrix[0][1]}·{matrix[1][2]}·{matrix[2][0]})</span>{' '}
              <span className="text-green-400">+({matrix[0][2]}·{matrix[1][0]}·{matrix[2][1]})</span>
            </p>
            <p>
              <span className="text-red-400">-({matrix[0][2]}·{matrix[1][1]}·{matrix[2][0]})</span>{' '}
              <span className="text-red-400">-({matrix[0][0]}·{matrix[1][2]}·{matrix[2][1]})</span>{' '}
              <span className="text-red-400">-({matrix[0][1]}·{matrix[1][0]}·{matrix[2][2]})</span>
            </p>
            <p className="text-2xl font-bold mt-4">
              |A| = <span className={d === 0 ? 'text-red-400' : 'text-green-400'}>{d}</span>
            </p>
          </div>
        </div>
      )}

      {/* Inverse for 2x2 */}
      {size === 2 && (
        <div className={`rounded-xl p-6 border ${d !== 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${d !== 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            Alderantzizko matrizea (A⁻¹)
          </p>
          {inv ? (
            <div className="flex justify-center">
              <MatrixDisplay matrix={inv} color="emerald" />
            </div>
          ) : (
            <p className="text-red-700 text-sm text-center font-bold">
              Determinantea = 0 → Ez du alderantzizkorik!
            </p>
          )}
        </div>
      )}

      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
        <strong>Proba:</strong> Jar ezazu determinantea = 0 izateko balioak (adib: lerro bat bestearen multiplo). Zer gertatzen da alderantzizkoarekin?
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Matrizeak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('matriz');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['add_element', 'det2x2', 'mult_element', 'scalar', 'transpose'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (type === 'add_element') {
      const a = [[randInt(-5, 5), randInt(-5, 5)], [randInt(-5, 5), randInt(-5, 5)]];
      const b = [[randInt(-5, 5), randInt(-5, 5)], [randInt(-5, 5), randInt(-5, 5)]];
      const i = randInt(0, 1);
      const j = randInt(0, 1);
      const solution = a[i][j] + b[i][j];
      prob = {
        type,
        display: `A = [${a[0].join(', ')} ; ${a[1].join(', ')}]\nB = [${b[0].join(', ')} ; ${b[1].join(', ')}]\n\n(A + B) posizioan (${i + 1},${j + 1}) = ?`,
        solution,
        hint: `(A+B) posizioan (${i + 1},${j + 1}): ${a[i][j]} + ${b[i][j]} = ${solution}`
      };
    } else if (type === 'det2x2') {
      const m = [[randInt(-5, 5), randInt(-5, 5)], [randInt(-5, 5), randInt(-5, 5)]];
      const d = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      prob = {
        type,
        display: `A = [${m[0].join(', ')} ; ${m[1].join(', ')}]\n\n|A| = ?`,
        solution: d,
        hint: `|A| = (${m[0][0]})(${m[1][1]}) - (${m[0][1]})(${m[1][0]}) = ${m[0][0] * m[1][1]} - ${m[0][1] * m[1][0]} = ${d}`
      };
    } else if (type === 'mult_element') {
      const a = [[randInt(-3, 3), randInt(-3, 3)], [randInt(-3, 3), randInt(-3, 3)]];
      const b = [[randInt(-3, 3), randInt(-3, 3)], [randInt(-3, 3), randInt(-3, 3)]];
      const i = randInt(0, 1);
      const j = randInt(0, 1);
      const solution = a[i][0] * b[0][j] + a[i][1] * b[1][j];
      prob = {
        type,
        display: `A = [${a[0].join(', ')} ; ${a[1].join(', ')}]\nB = [${b[0].join(', ')} ; ${b[1].join(', ')}]\n\n(A·B) posizioan (${i + 1},${j + 1}) = ?`,
        solution,
        hint: `Errenkada ${i + 1} × Zutabea ${j + 1}: (${a[i][0]})(${b[0][j]}) + (${a[i][1]})(${b[1][j]}) = ${a[i][0] * b[0][j]} + ${a[i][1] * b[1][j]} = ${solution}`
      };
    } else if (type === 'scalar') {
      const k = randInt(2, 5);
      const m = [[randInt(-5, 5), randInt(-5, 5)], [randInt(-5, 5), randInt(-5, 5)]];
      const i = randInt(0, 1);
      const j = randInt(0, 1);
      const solution = k * m[i][j];
      prob = {
        type,
        display: `A = [${m[0].join(', ')} ; ${m[1].join(', ')}]\n\n(${k}·A) posizioan (${i + 1},${j + 1}) = ?`,
        solution,
        hint: `${k} × ${m[i][j]} = ${solution}`
      };
    } else {
      const m = [[randInt(-5, 5), randInt(-5, 5)], [randInt(-5, 5), randInt(-5, 5)]];
      const i = randInt(0, 1);
      const j = randInt(0, 1);
      const solution = m[j][i]; // transpose swaps i,j
      prob = {
        type,
        display: `A = [${m[0].join(', ')} ; ${m[1].join(', ')}]\n\n(Aᵀ) posizioan (${i + 1},${j + 1}) = ?`,
        solution,
        hint: `Iraultzean (i,j) → (j,i): Aᵀ(${i + 1},${j + 1}) = A(${j + 1},${i + 1}) = ${solution}`
      };
    }

    setProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const val = parseFloat(userInput);
    if (isNaN(val)) { setFeedback('invalid'); return; }
    if (Math.abs(val - problem.solution) < 0.01) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

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
            <button onClick={() => setActiveTab('concept')} className={`hover:text-purple-600 transition-colors ${activeTab === 'concept' ? 'text-purple-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-purple-600 transition-colors ${activeTab === 'viz' ? 'text-purple-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('determinants')} className={`hover:text-purple-600 transition-colors ${activeTab === 'determinants' ? 'text-purple-600' : ''}`}>Determinanteak</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-sm shadow-purple-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Matrizeak eta <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-500">Determinanteak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Aljebra linealaren oinarria: datuak antolatu, eragiketa matrizialak eta ekuazio-sistemak ebazteko tresna.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'determinants', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'determinants' ? 'Determinanteak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world applications */}
            <Section title="Zertarako balio dute?" icon={BookOpen} className="border-purple-200 ring-4 ring-purple-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Irudi Digitalak</h3>
                  <p className="text-sm text-slate-600">
                    Argazki bakoitza zenbakien matrizea da. Pixel bakoitza zenbaki bat da, eta filtrak eragiketa matrizialak dira!
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Network size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Adimen Artifiziala</h3>
                  <p className="text-sm text-slate-600">
                    Sare neuronalen oinarria matrizeen arteko biderketak dira. ChatGPT-k milioika matrizeekin egiten du lan!
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Cpu size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Bideo Jokoak</h3>
                  <p className="text-sm text-slate-600">
                    3D grafikoak matrizeekin kalkulatzen dira: errotazioak, eskalatzeak eta proiekzioak.
                  </p>
                </div>
              </div>
            </Section>

            {/* What is a matrix */}
            <Section title="Zer da matrizea?" icon={Grid3X3}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-rose-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">m × n Matrizea</p>
                    <div className="font-mono text-lg md:text-xl flex items-center justify-center gap-4">
                      <span className="text-slate-500 text-4xl font-light">A =</span>
                      <div className="text-3xl text-slate-600 font-light">[</div>
                      <div className="space-y-1">
                        <div className="flex gap-4">
                          <span className="text-purple-400">a₁₁</span>
                          <span className="text-purple-400">a₁₂</span>
                          <span className="text-slate-600">···</span>
                          <span className="text-purple-400">a₁ₙ</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-violet-400">a₂₁</span>
                          <span className="text-violet-400">a₂₂</span>
                          <span className="text-slate-600">···</span>
                          <span className="text-violet-400">a₂ₙ</span>
                        </div>
                        <div className="flex gap-4 justify-center">
                          <span className="text-slate-600">⋮</span>
                          <span className="text-slate-600">⋮</span>
                          <span className="text-slate-600">⋱</span>
                          <span className="text-slate-600">⋮</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-amber-400">aₘ₁</span>
                          <span className="text-amber-400">aₘ₂</span>
                          <span className="text-slate-600">···</span>
                          <span className="text-amber-400">aₘₙ</span>
                        </div>
                      </div>
                      <div className="text-3xl text-slate-600 font-light">]</div>
                    </div>
                    <p className="text-slate-500 mt-6 text-sm">
                      <span className="text-purple-400">m</span> errenkada × <span className="text-amber-400">n</span> zutabe = Matrizea
                    </p>
                  </div>
                </div>

                <p className="text-slate-600">
                  Matrizea zenbakiak <strong>errenkadetan eta zutabetan</strong> antolatzen dituen taula bat da. m×n matrizeak m errenkada eta n zutabe ditu.
                </p>

                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg flex gap-3 text-sm text-purple-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <p><strong>Notazioa:</strong> a<sub>ij</sub> = i errenkadako eta j zutabeko elementua. Adibidez, a₂₃ = 2. errenkada, 3. zutabea.</p>
                </div>
              </div>
            </Section>

            {/* Types of matrices */}
            <Section title="Matrize Motak" icon={Layers}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Matrize Karratua',
                    desc: 'Errenkada eta zutabe kopuru berdina (n×n).',
                    example: '[1, 2 ; 3, 4]',
                    color: 'purple'
                  },
                  {
                    name: 'Identitate Matrizea (I)',
                    desc: 'Diagonal nagusian 1ak eta gainerakoan 0ak.',
                    example: '[1, 0 ; 0, 1]',
                    color: 'indigo'
                  },
                  {
                    name: 'Matrize Diagonala',
                    desc: 'Soilik diagonal nagusian elementu ez-nuluak.',
                    example: '[3, 0 ; 0, 7]',
                    color: 'violet'
                  },
                  {
                    name: 'Matrize Triangeluarra',
                    desc: 'Diagonalaren azpiko (edo gaineko) elementuak 0.',
                    example: '[1, 2 ; 0, 4]',
                    color: 'fuchsia'
                  },
                  {
                    name: 'Matrize Simetrikoa',
                    desc: 'Iraultzean bere burua ematen du: A = Aᵀ.',
                    example: '[1, 3 ; 3, 2]',
                    color: 'pink'
                  },
                  {
                    name: 'Zero Matrizea',
                    desc: 'Elementu guztiak zero.',
                    example: '[0, 0 ; 0, 0]',
                    color: 'slate'
                  },
                ].map((m, i) => (
                  <div key={i} className={`p-4 bg-${m.color}-50 border border-${m.color}-100 rounded-xl`}>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{m.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{m.desc}</p>
                    <p className={`font-mono text-sm text-${m.color}-700 font-bold`}>{m.example}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Operations */}
            <Section title="Eragiketa Matrizialak" icon={ListOrdered}>
              <div className="space-y-6">

                {/* Addition */}
                <div className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden">
                  <div className="bg-purple-50 p-4 border-b border-purple-100">
                    <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">+</div>
                      Batuketa eta Kenketa
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-purple-600">ARAUA:</strong> Dimentsio berdineko matrizeak soilik. Elementuz elementu batu/kendu.
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 font-mono text-sm text-center">
                      <p>[1, 2 ; 3, 4] + [5, 6 ; 7, 8] = <strong className="text-purple-900">[6, 8 ; 10, 12]</strong></p>
                    </div>
                  </div>
                </div>

                {/* Multiplication */}
                <div className="bg-white rounded-2xl border-2 border-violet-100 overflow-hidden">
                  <div className="bg-violet-50 p-4 border-b border-violet-100">
                    <h3 className="font-bold text-lg text-violet-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">&times;</div>
                      Biderketa
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-violet-600">ARAUA:</strong> A(m×n) × B(n×p) = C(m×p). Lehenengoaren zutabeak = bigarrenaren errenkadak.
                    </div>
                    <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 space-y-3">
                      <p className="font-mono text-sm text-center">c<sub>ij</sub> = i-garren errenkada · j-garren zutabea</p>
                      <div className="space-y-2 text-sm">
                        {[
                          { step: 1, desc: 'A-ren errenkada bat hartu', color: 'violet' },
                          { step: 2, desc: 'B-ren zutabe bat hartu', color: 'purple' },
                          { step: 3, desc: 'Dagokion elementuak biderkatu eta batu', color: 'fuchsia' },
                        ].map(s => (
                          <div key={s.step} className={`flex items-center gap-3 p-2 rounded-lg bg-${s.color}-50/50`}>
                            <div className={`w-6 h-6 rounded-full bg-${s.color}-200 text-${s.color}-700 flex items-center justify-center font-bold text-xs`}>{s.step}</div>
                            <span className="text-slate-700 text-xs">{s.desc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm text-center">
                        <p>[1, 2 ; 3, 4] × [5, 6 ; 7, 8] = <strong className="text-violet-900">[19, 22 ; 43, 50]</strong></p>
                        <p className="text-xs text-slate-400 mt-1">19 = 1×5 + 2×7</p>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                      <AlertTriangle className="shrink-0" size={20} />
                      <p><strong>Kontuz!</strong> Matrizeen biderketa <strong>EZ</strong> da trukakorra: A×B ≠ B×A normalean.</p>
                    </div>
                  </div>
                </div>

                {/* Transpose */}
                <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden">
                  <div className="bg-amber-50 p-4 border-b border-amber-100">
                    <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono">Aᵀ</div>
                      Iraultzea (Transposizoa)
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-amber-600">ARAUA:</strong> Errenkadak zutabe bihurtu eta alderantziz. (Aᵀ)<sub>ij</sub> = A<sub>ji</sub>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 font-mono text-sm text-center">
                      <p>[1, 2, 3 ; 4, 5, 6]<sup>T</sup> = <strong className="text-amber-900">[1, 4 ; 2, 5 ; 3, 6]</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Matrize Kalkulagailua" icon={Calculator}>
              <MatrixCalculator />
            </Section>
          </div>
        )}

        {/* --- SECTION 3: DETERMINANTS --- */}
        {activeTab === 'determinants' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zer da Determinantea?" icon={Grid3X3}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Determinantea matrize karratu bati lotutako <strong>zenbaki bakarra</strong> da. Matrizeak ezaugarri garrantzitsuak adierazten ditu: alderantzizkoa ba ote duen, ekuazio-sistema ebatzi daitekeen, etab.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* 2x2 */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">2×2 Determinantea</p>
                    <div className="text-center font-mono space-y-3">
                      <p className="text-lg">|A| = ad - bc</p>
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-2xl text-slate-600">|</span>
                        <div className="space-y-1">
                          <div className="flex gap-4"><span className="text-purple-400">a</span><span className="text-amber-400">b</span></div>
                          <div className="flex gap-4"><span className="text-amber-400">c</span><span className="text-purple-400">d</span></div>
                        </div>
                        <span className="text-2xl text-slate-600">|</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-2">
                        <span className="text-purple-400">Diagonal nagusia</span> - <span className="text-amber-400">Diagonal kontrarioa</span>
                      </div>
                    </div>
                  </div>

                  {/* 3x3 */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">3×3 Sarrus-en Erregela</p>
                    <div className="text-center space-y-3">
                      <p className="text-sm text-slate-400">3 diagonal nagusiak batu, 3 kontrarioak kendu</p>
                      <div className="flex justify-center gap-6 text-sm font-mono">
                        <div>
                          <p className="text-green-400 font-bold">+</p>
                          <p className="text-green-300">a₁₁·a₂₂·a₃₃</p>
                          <p className="text-green-300">a₁₂·a₂₃·a₃₁</p>
                          <p className="text-green-300">a₁₃·a₂₁·a₃₂</p>
                        </div>
                        <div>
                          <p className="text-red-400 font-bold">-</p>
                          <p className="text-red-300">a₁₃·a₂₂·a₃₁</p>
                          <p className="text-red-300">a₁₁·a₂₃·a₃₂</p>
                          <p className="text-red-300">a₁₂·a₂₁·a₃₃</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                    <h3 className="font-bold text-slate-800 mb-1">|A| ≠ 0</h3>
                    <p className="text-sm text-slate-600">Alderantzizko matrizea existitzen da (A⁻¹)</p>
                    <p className="text-xs text-green-600 font-bold mt-2">Sistema bateragarri determinatua</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                    <h3 className="font-bold text-slate-800 mb-1">|A| = 0</h3>
                    <p className="text-sm text-slate-600">Matrizea singularra da (alderantzizkorik ez)</p>
                    <p className="text-xs text-red-600 font-bold mt-2">Sistema bateraezina edo indeterminatua</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Determinante Kalkulagailua" icon={Calculator}>
              <DeterminantCalculator />
            </Section>

            {/* Inverse */}
            <Section title="Alderantzizko Matrizea" icon={Layers}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  A matrize karratu baten alderantzizkoa (A⁻¹) matrizea da, non A · A⁻¹ = I (identitate matrizea) betetzen den.
                </p>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4 text-center">2×2 Alderantzizkoa</p>
                  <div className="text-center font-mono text-lg space-y-3">
                    <p>A⁻¹ = <span className="text-amber-400">1/|A|</span> · [<span className="text-purple-400">d</span>, <span className="text-red-400">-b</span> ; <span className="text-red-400">-c</span>, <span className="text-purple-400">a</span>]</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Determinantea kalkulatu', desc: '|A| = ad - bc', color: 'purple' },
                    { step: 2, title: 'Egiaztatu |A| ≠ 0', desc: 'Zero bada, ez da alderantzizkorik existitzen', color: 'amber' },
                    { step: 3, title: 'Adjunktu matrizea sortu', desc: 'a↔d trukatu eta b,c-ri zeinua aldatu', color: 'violet' },
                    { step: 4, title: '1/|A| biderrez biderkatu', desc: 'Elementu guztiak determinanteaz zatitu', color: 'emerald' },
                  ].map(s => (
                    <div key={s.step} className={`p-4 rounded-xl bg-${s.color}-50/50 border border-${s.color}-100`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${s.color}-100 text-${s.color}-700 flex items-center justify-center font-bold text-sm shrink-0`}>
                          {s.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{s.title}</h3>
                          <p className="font-mono text-sm text-slate-600">{s.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 font-mono text-sm text-center">
                  <p className="text-slate-600 mb-1">Adibidea: A = [2, 1 ; 5, 3]</p>
                  <p className="text-slate-600">|A| = 6 - 5 = 1</p>
                  <p className="font-bold text-emerald-700 mt-1">A⁻¹ = [3, -1 ; -5, 2]</p>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-purple-200 ring-4 ring-purple-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-purple-50 border border-purple-100 px-6 py-2 rounded-full text-sm font-bold text-purple-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'add_element' ? 'Matrizeen batuketa' :
                         problem.type === 'det2x2' ? 'Determinantea (2×2)' :
                         problem.type === 'mult_element' ? 'Matrizeen biderketa' :
                         problem.type === 'scalar' ? 'Eskalar biderketa' :
                         'Transposizoa'}
                      </div>
                      <div className="text-lg md:text-xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
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
                          className="w-28 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg font-bold"
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
                          {feedback === 'correct' ? <Check /> : feedback === 'invalid' ? <RefreshCw /> : <X />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Hori da.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             'Saiatu berriro...'}
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
                        <strong>Pista:</strong> {problem.hint}
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

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
