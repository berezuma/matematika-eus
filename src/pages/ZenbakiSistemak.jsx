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
  Binary,
  Cpu,
  Wifi,
  Palette,
  ArrowLeftRight,
  ListOrdered,
  X,
  Lightbulb
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
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

// --- Superscript Helper ---

const toSup = (n) => {
  const map = { '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079' };
  return String(n).split('').map(c => map[c] || c).join('');
};

// --- Conversion Utilities ---

const BASES = [
  { id: 2, name: 'Bitarra', prefix: '0b', color: 'emerald' },
  { id: 8, name: 'Zortzitarra', prefix: '0o', color: 'amber' },
  { id: 10, name: 'Hamartarra', prefix: '', color: 'blue' },
  { id: 16, name: 'Hamaseitarra', prefix: '0x', color: 'purple' },
];

const toBase = (num, base) => {
  if (num === 0) return '0';
  const digits = '0123456789ABCDEF';
  let result = '';
  let n = num;
  while (n > 0) {
    result = digits[n % base] + result;
    n = Math.floor(n / base);
  }
  return result;
};

const fromBase = (str, base) => {
  const digits = '0123456789ABCDEF';
  let result = 0;
  for (const ch of str.toUpperCase()) {
    const val = digits.indexOf(ch);
    if (val === -1 || val >= base) return NaN;
    result = result * base + val;
  }
  return result;
};

// --- Bit Visualizer ---

const BitVisualizer = ({ value, bits = 8 }) => {
  const binary = value.toString(2).padStart(bits, '0');
  const powers = [];
  for (let i = 0; i < bits; i++) {
    powers.push(Math.pow(2, bits - 1 - i));
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 justify-center flex-wrap">
        {binary.split('').map((bit, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-mono mb-1">2{toSup(bits - 1 - i)}</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all ${
              bit === '1'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-slate-100 text-slate-300 border border-slate-200'
            }`}>
              {bit}
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1">{powers[i]}</span>
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-slate-500">
        = {binary.split('').map((bit, i) => bit === '1' ? powers[i] : null).filter(Boolean).join(' + ') || '0'}
        {' = '}<span className="font-bold text-emerald-600">{value}</span>
      </div>
    </div>
  );
};

// --- Step-by-step Converter ---

const ConversionSteps = ({ value, fromBaseId, toBaseId }) => {
  if (isNaN(value) || value < 0) return null;

  // Show steps for converting to base 10 first, then from base 10
  const decimal = value; // assume input is already decimal for simplicity

  if (toBaseId === 10) {
    // Already decimal
    return (
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
        <p className="font-mono text-lg font-bold text-blue-700">{decimal}</p>
      </div>
    );
  }

  // Convert decimal to target base step by step
  const steps = [];
  let n = decimal;
  if (n === 0) {
    steps.push({ quotient: 0, remainder: 0 });
  } else {
    while (n > 0) {
      steps.push({
        dividend: n,
        quotient: Math.floor(n / toBaseId),
        remainder: n % toBaseId
      });
      n = Math.floor(n / toBaseId);
    }
  }

  const digits = '0123456789ABCDEF';

  return (
    <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold text-center">
        {decimal} → {BASES.find(b => b.id === toBaseId)?.name} ({toBaseId} oinarria)
      </p>
      <p className="text-sm text-slate-400 text-center">Zati behin eta berriz {toBaseId}-z, hondarrak irakurri behetik gora</p>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center justify-center gap-3 font-mono text-sm">
            <span className="text-white">{step.dividend}</span>
            <span className="text-slate-500">÷</span>
            <span className="text-amber-400">{toBaseId}</span>
            <span className="text-slate-500">=</span>
            <span className="text-white">{step.quotient}</span>
            <span className="text-slate-500">hondarra</span>
            <span className="text-emerald-400 font-bold text-lg">{digits[step.remainder]}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-4 text-center">
        <p className="text-sm text-slate-400 mb-1">Hondarrak behetik gora irakurriz:</p>
        <p className="font-mono text-2xl font-bold text-emerald-400">
          {toBase(decimal, toBaseId)}
        </p>
      </div>
    </div>
  );
};

// --- Interactive Converter ---

const NumberConverter = () => {
  const [inputValue, setInputValue] = useState('42');
  const [inputBase, setInputBase] = useState(10);
  const [showSteps, setShowSteps] = useState(null);

  const decimal = inputBase === 10
    ? parseInt(inputValue, 10)
    : fromBase(inputValue, inputBase);

  const isValid = !isNaN(decimal) && decimal >= 0 && decimal <= 255;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end justify-center">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Oinarria</label>
          <div className="flex gap-2">
            {BASES.map(b => (
              <button
                key={b.id}
                onClick={() => {
                  setInputBase(b.id);
                  setInputValue(isValid ? toBase(decimal, b.id) : '');
                  setShowSteps(null);
                }}
                className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                  inputBase === b.id
                    ? `bg-${b.color}-500 text-white shadow-lg shadow-${b.color}-200`
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {b.id}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Zenbakia ({BASES.find(b => b.id === inputBase)?.name})</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setShowSteps(null); }}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none font-mono text-lg"
            placeholder={inputBase === 2 ? '101010' : inputBase === 8 ? '52' : inputBase === 16 ? '2A' : '42'}
          />
        </div>
      </div>

      {!isValid && inputValue !== '' && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700 text-center">
          Zenbaki baliogabea oinarri {inputBase}-n (0-255 tartean)
        </div>
      )}

      {isValid && (
        <>
          {/* Results grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BASES.map(b => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                  inputBase === b.id
                    ? `border-${b.color}-300 bg-${b.color}-50`
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={() => setShowSteps(showSteps === b.id ? null : b.id)}
              >
                <p className={`text-xs font-bold text-${b.color}-500 uppercase tracking-widest mb-1`}>{b.name} ({b.id})</p>
                <p className={`font-mono text-xl font-bold text-${b.color}-700`}>
                  {b.prefix}<span>{toBase(decimal, b.id)}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Bit visualizer */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Bit Bisualtzailea</p>
            <BitVisualizer value={decimal} bits={8} />
          </div>

          {/* Step by step */}
          {showSteps && showSteps !== inputBase && (
            <ConversionSteps value={decimal} fromBaseId={inputBase} toBaseId={showSteps} />
          )}

          {showSteps && showSteps !== inputBase && (
            <p className="text-xs text-slate-400 text-center">Sakatu beste oinarri bat urratsak ikusteko</p>
          )}
        </>
      )}
    </div>
  );
};

// --- ASCII Table Mini ---

const AsciiMini = () => {
  const chars = [
    { char: 'A', dec: 65 }, { char: 'B', dec: 66 }, { char: 'C', dec: 67 },
    { char: '0', dec: 48 }, { char: '1', dec: 49 }, { char: '9', dec: 57 },
    { char: 'a', dec: 97 }, { char: 'z', dec: 122 }, { char: ' ', dec: 32 },
    { char: '!', dec: 33 }, { char: '@', dec: 64 }, { char: '#', dec: 35 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left p-2 text-xs text-slate-400 uppercase">Karaktere</th>
            <th className="text-center p-2 text-xs text-slate-400 uppercase">Hamartarra</th>
            <th className="text-center p-2 text-xs text-slate-400 uppercase">Bitarra</th>
            <th className="text-center p-2 text-xs text-slate-400 uppercase">Hex</th>
          </tr>
        </thead>
        <tbody>
          {chars.map((c, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-2 font-mono font-bold text-lg text-slate-800">
                {c.char === ' ' ? '(espazioa)' : c.char}
              </td>
              <td className="p-2 text-center font-mono text-blue-600">{c.dec}</td>
              <td className="p-2 text-center font-mono text-emerald-600">{c.dec.toString(2).padStart(8, '0')}</td>
              <td className="p-2 text-center font-mono text-purple-600">{c.dec.toString(16).toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Text to Binary Converter ---

const TextBinaryConverter = () => {
  const [text, setText] = useState('Kaixo!');
  const [mode, setMode] = useState('text-to-bin');

  const textToBin = (str) => str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  const binToText = (bin) => {
    try {
      return bin.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
    } catch {
      return '(errorea)';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setMode('text-to-bin')}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
            mode === 'text-to-bin' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Testua → Bitarra
        </button>
        <button
          onClick={() => setMode('bin-to-text')}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
            mode === 'bin-to-text' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Bitarra → Testua
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
          {mode === 'text-to-bin' ? 'Idatzi testua' : 'Sartu bitarrak (zuriunez bananduta)'}
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
          placeholder={mode === 'text-to-bin' ? 'Kaixo!' : '01001011 01100001'}
        />
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Emaitza</p>
        <p className="font-mono text-sm text-emerald-800 break-all">
          {mode === 'text-to-bin' ? textToBin(text) : binToText(text)}
        </p>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function ZenbakiSistemak() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('num-sys');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['dec2bin', 'bin2dec', 'dec2hex', 'hex2dec', 'bin2hex', 'power2'];
    const type = types[Math.floor(Math.random() * types.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let prob;

    if (type === 'dec2bin') {
      const n = randInt(1, 63);
      prob = {
        type,
        display: `${n} hamartarra → Bitarra = ?`,
        solution: n.toString(2),
        hint: `Zati ${n} behin eta berriz 2-z: ${n} → ${n.toString(2)}`
      };
    } else if (type === 'bin2dec') {
      const n = randInt(1, 63);
      const bin = n.toString(2);
      prob = {
        type,
        display: `${bin} bitarra → Hamartarra = ?`,
        solution: n.toString(),
        hint: `Posizioak: ${bin.split('').map((b, i) => b === '1' ? Math.pow(2, bin.length - 1 - i) : null).filter(Boolean).join(' + ')} = ${n}`
      };
    } else if (type === 'dec2hex') {
      const n = randInt(10, 255);
      prob = {
        type,
        display: `${n} hamartarra → Hamaseitarra = ?`,
        solution: n.toString(16).toUpperCase(),
        hint: `${n} ÷ 16 = ${Math.floor(n / 16)} hondarra ${n % 16} → ${'0123456789ABCDEF'[Math.floor(n / 16)]}${'0123456789ABCDEF'[n % 16]}`
      };
    } else if (type === 'hex2dec') {
      const n = randInt(10, 255);
      const hex = n.toString(16).toUpperCase();
      prob = {
        type,
        display: `${hex} hamaseitarra → Hamartarra = ?`,
        solution: n.toString(),
        hint: `${'0123456789ABCDEF'.indexOf(hex[0])}×16 + ${'0123456789ABCDEF'.indexOf(hex[hex.length - 1])}×1 = ${n}`
      };
    } else if (type === 'bin2hex') {
      const n = randInt(10, 255);
      const bin = n.toString(2).padStart(8, '0');
      prob = {
        type,
        display: `${bin} bitarra → Hamaseitarra = ?`,
        solution: n.toString(16).toUpperCase(),
        hint: `4 biteko taldeak: ${bin.slice(0, 4)} = ${parseInt(bin.slice(0, 4), 2).toString(16).toUpperCase()}, ${bin.slice(4)} = ${parseInt(bin.slice(4), 2).toString(16).toUpperCase()} → ${n.toString(16).toUpperCase()}`
      };
    } else {
      // power of 2
      const exp = randInt(1, 10);
      prob = {
        type,
        display: `2${toSup(exp)} = ?`,
        solution: Math.pow(2, exp).toString(),
        hint: `2${toSup(exp)} = ${Math.pow(2, exp)}`
      };
    }

    setProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const answer = userInput.trim().toUpperCase();
    if (!answer) { setFeedback('invalid'); return; }

    const correct = problem.solution.toUpperCase();
    // Remove leading zeros for comparison
    const normalize = (s) => s.replace(/^0+/, '') || '0';

    if (normalize(answer) === normalize(correct)) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-green-100 selection:text-green-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-green-600 transition-colors ${activeTab === 'concept' ? 'text-green-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-green-600 transition-colors ${activeTab === 'viz' ? 'text-green-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('ascii')} className={`hover:text-green-600 transition-colors ${activeTab === 'ascii' ? 'text-green-600' : ''}`}>ASCII / Testua</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm shadow-green-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Zenbaki <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Sistemak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bitarra, Zortzitarra, Hamartarra eta Hamaseitarra: nola mintzatzen diren ordenagailuak eta nola bihurtu oinarri batetik bestera.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'ascii', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'ascii' ? 'ASCII / Testua' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world applications */}
            <Section title="Zertarako balio dute?" icon={BookOpen} className="border-green-200 ring-4 ring-green-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <Cpu size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Ordenagailuak</h3>
                  <p className="text-sm text-slate-600">
                    Prozesadoreek <strong>bitarrean</strong> (0 eta 1) lan egiten dute. Transistore bakoitza piztuta edo itzalita dago: bit bat!
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                    <Palette size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Koloreak (Hex)</h3>
                  <p className="text-sm text-slate-600">
                    Web koloreak <strong>hamaseitarraz</strong> idazten dira: #FF5733 gorria, berdea eta urdina konbinatzen ditu.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Wifi size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Sareak (IP)</h3>
                  <p className="text-sm text-slate-600">
                    IP helbideak zenbaki bitarrak dira. 192.168.1.1 = lau byte. MAC helbideak <strong>hex</strong>-en idazten dira.
                  </p>
                </div>
              </div>
            </Section>

            {/* Number Systems Overview */}
            <Section title="Zenbaki Sistemak Laburpena" icon={ListOrdered}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      base: 2, name: 'Bitarra', digits: '0, 1',
                      desc: 'Bi zifra bakarrik. Ordenagailuen oinarria.',
                      example: '1010₂ = 10',
                      color: 'emerald'
                    },
                    {
                      base: 8, name: 'Zortzitarra (Oktala)', digits: '0-7',
                      desc: 'Unix baimenak eta sistema zaharretan.',
                      example: '12₈ = 10',
                      color: 'amber'
                    },
                    {
                      base: 10, name: 'Hamartarra (Dezimala)', digits: '0-9',
                      desc: 'Egunero erabiltzen duguna.',
                      example: '10₁₀ = 10',
                      color: 'blue'
                    },
                    {
                      base: 16, name: 'Hamaseitarra (Hex)', digits: '0-9, A-F',
                      desc: 'Programazioan oso erabilia. Laburragoa bitarrak baino.',
                      example: 'A₁₆ = 10',
                      color: 'purple'
                    },
                  ].map(sys => (
                    <div key={sys.base} className={`p-5 rounded-xl bg-${sys.color}-50 border border-${sys.color}-100`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full bg-${sys.color}-200 text-${sys.color}-700 flex items-center justify-center font-bold text-sm`}>
                          {sys.base}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{sys.name}</h3>
                          <p className="text-xs text-slate-500">Zifrak: {sys.digits}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{sys.desc}</p>
                      <p className={`font-mono text-sm font-bold text-${sys.color}-700`}>{sys.example}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3 text-sm text-green-800">
                  <Lightbulb className="shrink-0" size={20} />
                  <p><strong>Zergatik hamaseitarra?</strong> 4 bit = 1 hex digitu. Hortaz, byte bat (8 bit) bi hex zifrez idatz daiteke: 11111111₂ = FF₁₆ = 255. Bitarrak baino askoz laburragoa!</p>
                </div>
              </div>
            </Section>

            {/* Conversion Method */}
            <Section title="Nola Bihurtu?" icon={ArrowLeftRight}>
              <div className="space-y-6">

                {/* Decimal to Binary */}
                <div className="bg-white rounded-2xl border-2 border-emerald-100 overflow-hidden">
                  <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                    <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono font-bold">10→2</div>
                      Hamartarretik Bitarrera
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">Zati behin eta berriz 2-z eta gorde hondarrak. Irakurri behetik gora.</p>

                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm space-y-2">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-3 text-center">Adibidea: 13 → Bitarra</p>
                      {[
                        { div: '13 ÷ 2', q: '6', r: '1' },
                        { div: ' 6 ÷ 2', q: '3', r: '0' },
                        { div: ' 3 ÷ 2', q: '1', r: '1' },
                        { div: ' 1 ÷ 2', q: '0', r: '1' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center justify-center gap-3">
                          <span className="text-white">{step.div}</span>
                          <span className="text-slate-500">=</span>
                          <span className="text-white">{step.q}</span>
                          <span className="text-slate-500">hondarra</span>
                          <span className="text-emerald-400 font-bold">{step.r}</span>
                        </div>
                      ))}
                      <p className="text-emerald-400 font-bold text-lg text-center mt-3">↑ Irakurri: 1101₂</p>
                    </div>
                  </div>
                </div>

                {/* Binary to Decimal */}
                <div className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b border-blue-100">
                    <h3 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm font-mono font-bold">2→10</div>
                      Bitarretik Hamartarrera
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">Zifra bakoitza bere posizioaren 2-ren berreturaz biderkatu eta batu.</p>

                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-3 text-center">Adibidea: 1101₂ → Hamartarra</p>
                      <div className="flex justify-center gap-4 mb-3">
                        {['1', '1', '0', '1'].map((b, i) => (
                          <div key={i} className="text-center">
                            <div className={`text-lg font-bold ${b === '1' ? 'text-blue-400' : 'text-slate-600'}`}>{b}</div>
                            <div className="text-xs text-slate-500">×2{toSup(3 - i)}</div>
                            <div className={`text-sm ${b === '1' ? 'text-blue-300' : 'text-slate-600'}`}>{b === '1' ? Math.pow(2, 3 - i) : 0}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-blue-400 font-bold text-lg text-center">8 + 4 + 0 + 1 = 13</p>
                    </div>
                  </div>
                </div>

                {/* Hex trick */}
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg flex gap-3 text-sm text-purple-800">
                  <Lightbulb className="shrink-0" size={20} />
                  <div>
                    <p><strong>Trukoa: Bitarra ↔ Hex</strong></p>
                    <p className="mt-1">Banatu bitarrak 4-ko taldeetan eskuinetik. Talde bakoitza hex digitu bat da:</p>
                    <p className="font-mono mt-1">1010 1100₂ → A C₁₆ → AC</p>
                  </div>
                </div>

                {/* Powers of 2 */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2-ren berreturak (gogoratu!)</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <div key={n} className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center">
                        <p className="text-[10px] text-slate-400 font-mono">2{toSup(n)}</p>
                        <p className="font-mono font-bold text-slate-700 text-sm">{Math.pow(2, n)}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Section title="Bihurtzaile Interaktiboa" icon={Calculator}>
              <NumberConverter />
            </Section>
          </div>
        )}

        {/* --- SECTION 3: ASCII / TEXT --- */}
        {activeTab === 'ascii' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Testua ↔ Bitarra" icon={Binary}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Ordenagailuan letra, zenbaki eta sinbolo guztiak zenbakien bidez gordetzen dira. <strong>ASCII</strong> kodeak karaktere bakoitzari zenbaki bat esleitzen dio.
                </p>
                <TextBinaryConverter />
              </div>
            </Section>

            <Section title="ASCII Taula (laburpena)" icon={ListOrdered}>
              <AsciiMini />
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                <strong>Jakin:</strong> 'A' = 65, 'a' = 97 (diferentzia = 32). Zenbaki '0' = 48. Hau da, 'a' - 'A' = 32 beti.
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-green-200 ring-4 ring-green-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-green-50 border border-green-100 px-6 py-2 rounded-full text-sm font-bold text-green-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'dec2bin' ? 'Hamartar → Bitar' :
                         problem.type === 'bin2dec' ? 'Bitar → Hamartar' :
                         problem.type === 'dec2hex' ? 'Hamartar → Hex' :
                         problem.type === 'hex2dec' ? 'Hex → Hamartar' :
                         problem.type === 'bin2hex' ? 'Bitar → Hex' :
                         '2-ren berretura'}
                      </div>
                      <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input
                          type="text"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-40 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-lg font-bold font-mono"
                        />
                      </div>
                      <p className="text-xs text-slate-400">Hex erantzunak: erabili A-F (maiuskulak)</p>
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
                             feedback === 'invalid' ? 'Mesedez, sartu erantzun bat.' :
                             `Saiatu berriro... (Erantzun zuzena: ${problem.solution})`}
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
                          className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-500 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
