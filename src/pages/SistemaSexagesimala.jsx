import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, Shapes, ArrowRight, Check, RefreshCw, Zap, ListOrdered, Clock, Compass, ArrowLeftRight, Lightbulb, X, Brain, Plus, Minus } from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- DMS Conversion Utilities ---

const decimalToDMS = (decimal) => {
  const sign = decimal < 0 ? -1 : 1;
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesDecimal = (abs - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.round((minutesDecimal - minutes) * 60 * 100) / 100;
  return { degrees: degrees * sign, minutes, seconds };
};

const dmsToDecimal = (degrees, minutes, seconds) => {
  const sign = degrees < 0 ? -1 : 1;
  const absDeg = Math.abs(degrees);
  return sign * (absDeg + minutes / 60 + seconds / 3600);
};

const formatDMS = (d, m, s) => {
  return `${d}° ${m}' ${s}"`;
};

const normalizeDMS = (degrees, minutes, seconds) => {
  let s = seconds;
  let m = minutes;
  let d = degrees;

  if (s >= 60) {
    m += Math.floor(s / 60);
    s = Math.round((s % 60) * 100) / 100;
  }
  if (s < 0) {
    const borrow = Math.ceil(Math.abs(s) / 60);
    m -= borrow;
    s += borrow * 60;
    s = Math.round(s * 100) / 100;
  }
  if (m >= 60) {
    d += Math.floor(m / 60);
    m = m % 60;
  }
  if (m < 0) {
    const borrow = Math.ceil(Math.abs(m) / 60);
    d -= borrow;
    m += borrow * 60;
  }

  return { degrees: d, minutes: m, seconds: s };
};

// --- Decimal to DMS Converter ---

const DecimalToDMSConverter = () => {
  const [decInput, setDecInput] = useState('45.7625');

  const decimal = parseFloat(decInput);
  const isValid = !isNaN(decimal) && decimal >= -360 && decimal <= 360;
  const dms = isValid ? decimalToDMS(decimal) : null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
        <ArrowRight size={18} className="text-orange-500" />
        Hamartar gradu → GMS
      </h3>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Gradu hamartarrak</label>
        <input
          type="text"
          value={decInput}
          onChange={(e) => setDecInput(e.target.value)}
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-lg"
          placeholder="Adib.: 45.7625"
        />
      </div>

      {!isValid && decInput !== '' && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700 text-center">
          Sartu balio egoki bat (-360 eta 360 artean)
        </div>
      )}

      {isValid && dms && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Emaitza</p>
          <p className="font-mono text-2xl font-bold text-orange-700 text-center">
            {formatDMS(dms.degrees, dms.minutes, dms.seconds)}
          </p>
          <div className="mt-4 bg-white rounded-lg p-4 border border-orange-100 space-y-2 text-sm text-slate-600">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Urratsak:</p>
            <p>1. Zati osoa = gradu osoak: <span className="font-mono font-bold text-orange-700">{dms.degrees}°</span></p>
            <p>2. Zati hamartarra × 60 = {((Math.abs(decimal) - Math.abs(dms.degrees)) * 60).toFixed(4)} → Minutuak: <span className="font-mono font-bold text-orange-700">{dms.minutes}'</span></p>
            <p>3. Minutuen zati hamartarra × 60 = Segundoak: <span className="font-mono font-bold text-orange-700">{dms.seconds}"</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- DMS to Decimal Converter ---

const DMSToDecimalConverter = () => {
  const [degInput, setDegInput] = useState('45');
  const [minInput, setMinInput] = useState('45');
  const [secInput, setSecInput] = useState('45');

  const deg = parseInt(degInput) || 0;
  const min = parseInt(minInput) || 0;
  const sec = parseFloat(secInput) || 0;
  const isValid = min >= 0 && min < 60 && sec >= 0 && sec < 60;
  const decimal = isValid ? dmsToDecimal(deg, min, sec) : null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
        <ArrowRight size={18} className="text-orange-500" />
        GMS → Hamartar gradu
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Graduak (°)</label>
          <input
            type="number"
            value={degInput}
            onChange={(e) => setDegInput(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-lg"
            placeholder="45"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Minutuak (')</label>
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            min="0"
            max="59"
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-lg"
            placeholder="45"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Segundoak (")</label>
          <input
            type="text"
            value={secInput}
            onChange={(e) => setSecInput(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-lg"
            placeholder="45"
          />
        </div>
      </div>

      {!isValid && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700 text-center">
          Minutuak 0-59 artean eta segundoak 0-59.99 artean izan behar dira
        </div>
      )}

      {isValid && decimal !== null && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Emaitza</p>
          <p className="font-mono text-2xl font-bold text-orange-700 text-center">
            {Math.round(decimal * 10000) / 10000}°
          </p>
          <div className="mt-4 bg-white rounded-lg p-4 border border-orange-100 space-y-2 text-sm text-slate-600">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Formula:</p>
            <p className="font-mono text-center">
              {deg}° + {min}'/60 + {sec}"/3600 = <span className="font-bold text-orange-700">{Math.round(decimal * 10000) / 10000}°</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Angle Addition/Subtraction Calculator ---

const AngleCalculator = () => {
  const [op, setOp] = useState('add');
  const [a, setA] = useState({ deg: '52', min: '34', sec: '48' });
  const [b, setB] = useState({ deg: '28', min: '47', sec: '35' });

  const parseDMS = (obj) => ({
    degrees: parseInt(obj.deg) || 0,
    minutes: parseInt(obj.min) || 0,
    seconds: parseFloat(obj.sec) || 0,
  });

  const angleA = parseDMS(a);
  const angleB = parseDMS(b);

  let resultSeconds, resultMinutes, resultDegrees;

  if (op === 'add') {
    const totalSec = angleA.seconds + angleB.seconds;
    const carryMin1 = Math.floor(totalSec / 60);
    resultSeconds = Math.round((totalSec % 60) * 100) / 100;

    const totalMin = angleA.minutes + angleB.minutes + carryMin1;
    const carryDeg = Math.floor(totalMin / 60);
    resultMinutes = totalMin % 60;

    resultDegrees = angleA.degrees + angleB.degrees + carryDeg;
  } else {
    let totalSecA = angleA.degrees * 3600 + angleA.minutes * 60 + angleA.seconds;
    let totalSecB = angleB.degrees * 3600 + angleB.minutes * 60 + angleB.seconds;
    let diff = totalSecA - totalSecB;
    const sign = diff < 0 ? -1 : 1;
    diff = Math.abs(diff);
    resultDegrees = Math.floor(diff / 3600) * sign;
    diff = diff % 3600;
    resultMinutes = Math.floor(diff / 60);
    resultSeconds = Math.round((diff % 60) * 100) / 100;
  }

  const result = normalizeDMS(resultDegrees, resultMinutes, resultSeconds);

  const AngleInput = ({ label, value, onChange }) => (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase mb-2">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <input
            type="number"
            value={value.deg}
            onChange={(e) => onChange({ ...value, deg: e.target.value })}
            className="w-full p-2 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none font-mono text-center"
            placeholder="°"
          />
          <p className="text-[10px] text-slate-400 text-center mt-1">Graduak</p>
        </div>
        <div>
          <input
            type="number"
            value={value.min}
            onChange={(e) => onChange({ ...value, min: e.target.value })}
            className="w-full p-2 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none font-mono text-center"
            placeholder="'"
            min="0"
            max="59"
          />
          <p className="text-[10px] text-slate-400 text-center mt-1">Minutuak</p>
        </div>
        <div>
          <input
            type="text"
            value={value.sec}
            onChange={(e) => onChange({ ...value, sec: e.target.value })}
            className="w-full p-2 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none font-mono text-center"
            placeholder='"'
          />
          <p className="text-[10px] text-slate-400 text-center mt-1">Segundoak</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
        <Shapes size={18} className="text-orange-500" />
        Angeluen batuketa eta kenketa (GMS)
      </h3>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setOp('add')}
          className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
            op === 'add' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
          }`}
        >
          <Plus size={16} /> Batuketa
        </button>
        <button
          onClick={() => setOp('sub')}
          className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
            op === 'sub' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
          }`}
        >
          <Minus size={16} /> Kenketa
        </button>
      </div>

      <AngleInput label="Lehenengo angelua" value={a} onChange={setA} />

      <div className="text-center text-2xl font-bold text-orange-500">
        {op === 'add' ? '+' : '−'}
      </div>

      <AngleInput label="Bigarren angelua" value={b} onChange={setB} />

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Emaitza</p>
        <p className="font-mono text-2xl font-bold text-orange-700 text-center">
          {formatDMS(result.degrees, result.minutes, result.seconds)}
        </p>

        {op === 'add' && (
          <div className="mt-4 bg-white rounded-lg p-4 border border-orange-100 space-y-2 text-sm text-slate-600">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prozedura:</p>
            <p>1. Segundoak: {angleA.seconds} + {angleB.seconds} = {angleA.seconds + angleB.seconds}
              {angleA.seconds + angleB.seconds >= 60 && (
                <span className="text-orange-600 font-bold"> → {Math.round((angleA.seconds + angleB.seconds) % 60 * 100) / 100}" eta 1 minutu gehitu</span>
              )}
            </p>
            <p>2. Minutuak: {angleA.minutes} + {angleB.minutes}{angleA.seconds + angleB.seconds >= 60 ? ' + 1' : ''} = {angleA.minutes + angleB.minutes + Math.floor((angleA.seconds + angleB.seconds) / 60)}
              {(angleA.minutes + angleB.minutes + Math.floor((angleA.seconds + angleB.seconds) / 60)) >= 60 && (
                <span className="text-orange-600 font-bold"> → {(angleA.minutes + angleB.minutes + Math.floor((angleA.seconds + angleB.seconds) / 60)) % 60}' eta 1 gradu gehitu</span>
              )}
            </p>
            <p>3. Graduak: {angleA.degrees} + {angleB.degrees}{(angleA.minutes + angleB.minutes + Math.floor((angleA.seconds + angleB.seconds) / 60)) >= 60 ? ' + 1' : ''} = {result.degrees}°</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function SistemaSexagesimala() {
  const [activeTab, setActiveTab] = useState('teoria');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [userInputMin, setUserInputMin] = useState('');
  const [userInputSec, setUserInputSec] = useState('');
  const [feedback, setFeedback] = useState(null);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('sexagesimal');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['dec2dms', 'dms2dec', 'add', 'sub'];
    const type = types[Math.floor(Math.random() * types.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let prob;

    if (type === 'dec2dms') {
      const deg = randInt(0, 89);
      const min = randInt(0, 59);
      const sec = randInt(0, 59);
      const decimal = Math.round(dmsToDecimal(deg, min, sec) * 10000) / 10000;
      prob = {
        type,
        display: `${decimal}° → GMS bihurtu`,
        solutionDeg: deg.toString(),
        solutionMin: min.toString(),
        solutionSec: sec.toString(),
        solutionText: formatDMS(deg, min, sec),
        hint: `Zati osoa = ${deg}°. Hamartarra × 60 = minutuak. Minutuen hamartarra × 60 = segundoak.`
      };
    } else if (type === 'dms2dec') {
      const deg = randInt(0, 89);
      const min = randInt(0, 59);
      const sec = randInt(0, 59);
      const decimal = Math.round(dmsToDecimal(deg, min, sec) * 10000) / 10000;
      prob = {
        type,
        display: `${formatDMS(deg, min, sec)} → Hamartar gradu bihurtu`,
        solution: decimal.toString(),
        hint: `${deg} + ${min}/60 + ${sec}/3600 = ${decimal}°`
      };
    } else if (type === 'add') {
      const a = { degrees: randInt(10, 80), minutes: randInt(20, 55), seconds: randInt(30, 55) };
      const b = { degrees: randInt(10, 60), minutes: randInt(20, 55), seconds: randInt(30, 55) };
      const totalSec = a.seconds + b.seconds;
      const carryMin = Math.floor(totalSec / 60);
      const resSec = Math.round((totalSec % 60) * 100) / 100;
      const totalMin = a.minutes + b.minutes + carryMin;
      const carryDeg = Math.floor(totalMin / 60);
      const resMin = totalMin % 60;
      const resDeg = a.degrees + b.degrees + carryDeg;
      const result = normalizeDMS(resDeg, resMin, resSec);
      prob = {
        type,
        display: `${formatDMS(a.degrees, a.minutes, a.seconds)}\n+ ${formatDMS(b.degrees, b.minutes, b.seconds)}`,
        solutionDeg: result.degrees.toString(),
        solutionMin: result.minutes.toString(),
        solutionSec: result.seconds.toString(),
        solutionText: formatDMS(result.degrees, result.minutes, result.seconds),
        hint: `Segundoak batu: ${a.seconds}+${b.seconds}=${a.seconds + b.seconds}. Minutuak batu (buruketarekin). Graduak batu.`
      };
    } else {
      const a = { degrees: randInt(50, 90), minutes: randInt(0, 59), seconds: randInt(0, 59) };
      const b = { degrees: randInt(10, 40), minutes: randInt(0, 59), seconds: randInt(0, 59) };
      const totalSecA = a.degrees * 3600 + a.minutes * 60 + a.seconds;
      const totalSecB = b.degrees * 3600 + b.minutes * 60 + b.seconds;
      const diff = Math.abs(totalSecA - totalSecB);
      const resDeg = Math.floor(diff / 3600);
      const resMin = Math.floor((diff % 3600) / 60);
      const resSec = Math.round((diff % 60) * 100) / 100;
      const result = normalizeDMS(resDeg, resMin, resSec);
      prob = {
        type,
        display: `${formatDMS(a.degrees, a.minutes, a.seconds)}\n− ${formatDMS(b.degrees, b.minutes, b.seconds)}`,
        solutionDeg: result.degrees.toString(),
        solutionMin: result.minutes.toString(),
        solutionSec: result.seconds.toString(),
        solutionText: formatDMS(result.degrees, result.minutes, result.seconds),
        hint: `Segundoak kendu (beharrezkoa bada, 1 minutu mailegutu = 60"). Minutuak kendu. Graduak kendu.`
      };
    }

    setProblem(prob);
    setUserInput('');
    setUserInputMin('');
    setUserInputSec('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!problem) return;

    if (problem.type === 'dms2dec') {
      const answer = userInput.trim();
      if (!answer) { setFeedback('invalid'); return; }
      const userVal = parseFloat(answer);
      const correctVal = parseFloat(problem.solution);
      if (Math.abs(userVal - correctVal) < 0.01) {
        addCorrect();
        setFeedback('correct');
      } else {
        addIncorrect();
        setFeedback('incorrect');
      }
    } else {
      const answerDeg = userInput.trim();
      const answerMin = userInputMin.trim();
      const answerSec = userInputSec.trim();
      if (!answerDeg && !answerMin && !answerSec) { setFeedback('invalid'); return; }

      const correctDeg = parseInt(problem.solutionDeg);
      const correctMin = parseInt(problem.solutionMin);
      const correctSec = parseFloat(problem.solutionSec);

      const uDeg = parseInt(answerDeg) || 0;
      const uMin = parseInt(answerMin) || 0;
      const uSec = parseFloat(answerSec) || 0;

      if (uDeg === correctDeg && uMin === correctMin && Math.abs(uSec - correctSec) < 1) {
        addCorrect();
        setFeedback('correct');
      } else {
        addIncorrect();
        setFeedback('incorrect');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('teoria')} className={`hover:text-orange-600 transition-colors ${activeTab === 'teoria' ? 'text-orange-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('laborategia')} className={`hover:text-orange-600 transition-colors ${activeTab === 'laborategia' ? 'text-orange-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('formulak')} className={`hover:text-orange-600 transition-colors ${activeTab === 'formulak' ? 'text-orange-600' : ''}`}>Formulak</button>
            <button onClick={() => setActiveTab('praktika')} className={`px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-all shadow-sm shadow-orange-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Sistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Sexagesimala</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            60 oinarridun zenbaki sistema: angeluak graduetan, minutuetan eta segundoetan adierazi eta haiekin eragiketak egiten ikasi.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['teoria', 'laborategia', 'formulak', 'praktika'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'teoria' ? 'Teoria' : t === 'laborategia' ? 'Laborategia' : t === 'formulak' ? 'Formulak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- TAB 1: TEORIA --- */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* What is the sexagesimal system */}
            <Section title="Zer da sistema sexagesimala?" icon={BookOpen} className="border-orange-200 ring-4 ring-orange-50/30">
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Sistema sexagesimala</strong> 60 oinarridun zenbaki sistema bat da. Antzinateko zivilizazioek (Sumeria, Babilonia) sortu zuten, eta gaur egun ere erabiltzen dugu <strong>angeluak</strong> eta <strong>denbora</strong> neurtzeko.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                      <Compass size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Angeluak</h3>
                    <p className="text-sm text-slate-600">
                      Zirkulu osoa <strong>360°</strong> da. Gradu bakoitzak 60 minutu (') ditu, eta minutu bakoitzak 60 segundo ("). Hau da sistema sexagesimala angeluetan.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Denbora</h3>
                    <p className="text-sm text-slate-600">
                      Ordu bakoitzak <strong>60 minutu</strong> ditu, eta minutu bakoitzak <strong>60 segundo</strong>. Erlojuak sistema sexagesimalaren adibide ezagunenena da.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Units */}
            <Section title="Unitateak: Graduak, Minutuak eta Segundoak" icon={ListOrdered}>
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold text-center mb-4">GMS Notazioa</p>
                  <div className="flex items-center justify-center gap-6 text-center">
                    <div>
                      <p className="text-4xl font-mono font-bold text-orange-400">45°</p>
                      <p className="text-sm text-slate-400 mt-1">Graduak</p>
                      <p className="text-xs text-slate-500">(degrees)</p>
                    </div>
                    <div>
                      <p className="text-4xl font-mono font-bold text-amber-400">30'</p>
                      <p className="text-sm text-slate-400 mt-1">Minutuak</p>
                      <p className="text-xs text-slate-500">(minutes)</p>
                    </div>
                    <div>
                      <p className="text-4xl font-mono font-bold text-yellow-400">15"</p>
                      <p className="text-sm text-slate-400 mt-1">Segundoak</p>
                      <p className="text-xs text-slate-500">(seconds)</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-slate-400">
                    1° = 60' = 3600"
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                    <p className="text-3xl font-bold text-orange-600 mb-1">°</p>
                    <p className="font-bold text-slate-800">Gradua</p>
                    <p className="text-sm text-slate-600 mt-1">Zirkulu osoaren 1/360 zatia</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                    <p className="text-3xl font-bold text-amber-600 mb-1">'</p>
                    <p className="font-bold text-slate-800">Minutua</p>
                    <p className="text-sm text-slate-600 mt-1">Gradu baten 1/60 zatia</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                    <p className="text-3xl font-bold text-yellow-600 mb-1">"</p>
                    <p className="font-bold text-slate-800">Segundoa</p>
                    <p className="text-sm text-slate-600 mt-1">Minutu baten 1/60 zatia</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Conversion between decimal and DMS */}
            <Section title="Bihurketak: Hamartar ↔ GMS" icon={ArrowLeftRight}>
              <div className="space-y-6">

                {/* Decimal to DMS */}
                <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100">
                    <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                      <ArrowRight size={18} />
                      Hamartar gradu → GMS
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">Gradu hamartarrak GMS formatura bihurtzeko, jarraitu urrats hauek:</p>

                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm space-y-3">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-3 text-center">Adibidea: 45.7625° → GMS</p>
                      <div className="space-y-2">
                        <p><span className="text-slate-400">1.</span> Zati osoa = graduak: <span className="text-orange-400 font-bold">45°</span></p>
                        <p><span className="text-slate-400">2.</span> 0.7625 × 60 = 45.75 → minutuak: <span className="text-amber-400 font-bold">45'</span></p>
                        <p><span className="text-slate-400">3.</span> 0.75 × 60 = 45 → segundoak: <span className="text-yellow-400 font-bold">45"</span></p>
                      </div>
                      <p className="text-orange-400 font-bold text-lg text-center mt-4">45.7625° = 45° 45' 45"</p>
                    </div>
                  </div>
                </div>

                {/* DMS to Decimal */}
                <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden">
                  <div className="bg-amber-50 p-4 border-b border-amber-100">
                    <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                      <ArrowRight size={18} />
                      GMS → Hamartar gradu
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">GMS formatutik gradu hamartarretara bihurtzeko:</p>

                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm space-y-3">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-3 text-center">Adibidea: 30° 15' 36" → Hamartarra</p>
                      <div className="space-y-2">
                        <p><span className="text-slate-400">Formula:</span> Graduak + Minutuak/60 + Segundoak/3600</p>
                        <p>30 + 15/60 + 36/3600</p>
                        <p>30 + 0.25 + 0.01</p>
                      </div>
                      <p className="text-amber-400 font-bold text-lg text-center mt-4">30° 15' 36" = 30.26°</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Operations with angles */}
            <Section title="Eragiketak angeluekin" icon={Shapes}>
              <div className="space-y-6">

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 text-sm text-orange-800">
                  <Lightbulb className="shrink-0" size={20} />
                  <p><strong>Garrantzitsua:</strong> Angeluak GMS formatuan batu edo kentzean, buruketak (carrying) kontuan hartu behar dira. Segundoak edo minutuak 60-tik pasatzen badira, hurrengo unitatera igaro behar da.</p>
                </div>

                {/* Addition */}
                <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100">
                    <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                      <Plus size={18} />
                      Batuketa
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm space-y-3">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-3 text-center">Adibidea: 52° 34' 48" + 28° 47' 35"</p>
                      <div className="space-y-2">
                        <p><span className="text-slate-400">1.</span> Segundoak: 48" + 35" = 83" = <span className="text-yellow-400 font-bold">23"</span> eta <span className="text-orange-300">1' buruketara</span></p>
                        <p><span className="text-slate-400">2.</span> Minutuak: 34' + 47' + 1' = 82' = <span className="text-amber-400 font-bold">22'</span> eta <span className="text-orange-300">1° buruketara</span></p>
                        <p><span className="text-slate-400">3.</span> Graduak: 52° + 28° + 1° = <span className="text-orange-400 font-bold">81°</span></p>
                      </div>
                      <p className="text-orange-400 font-bold text-lg text-center mt-4">Emaitza: 81° 22' 23"</p>
                    </div>
                  </div>
                </div>

                {/* Subtraction */}
                <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden">
                  <div className="bg-amber-50 p-4 border-b border-amber-100">
                    <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                      <Minus size={18} />
                      Kenketa
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm space-y-3">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-3 text-center">Adibidea: 75° 20' 15" − 38° 45' 50"</p>
                      <div className="space-y-2">
                        <p><span className="text-slate-400">1.</span> Segundoak: 15" − 50" → Ezin! <span className="text-orange-300">1' mailegu = 60"</span> → 75" − 50" = <span className="text-yellow-400 font-bold">25"</span></p>
                        <p><span className="text-slate-400">2.</span> Minutuak: 19' − 45' → Ezin! <span className="text-orange-300">1° mailegu = 60'</span> → 79' − 45' = <span className="text-amber-400 font-bold">34'</span></p>
                        <p><span className="text-slate-400">3.</span> Graduak: 74° − 38° = <span className="text-orange-400 font-bold">36°</span></p>
                      </div>
                      <p className="text-orange-400 font-bold text-lg text-center mt-4">Emaitza: 36° 34' 25"</p>
                    </div>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- TAB 2: LABORATEGIA --- */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Hamartar → GMS Bihurtzailea" icon={ArrowLeftRight}>
              <DecimalToDMSConverter />
            </Section>

            <Section title="GMS → Hamartar Bihurtzailea" icon={ArrowLeftRight}>
              <DMSToDecimalConverter />
            </Section>

            <Section title="Angeluen Kalkulagailua" icon={Shapes}>
              <AngleCalculator />
            </Section>

          </div>
        )}

        {/* --- TAB 3: FORMULAK --- */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Bihurketa Formulak" icon={Zap}>
              <div className="space-y-6">

                {/* Equivalences */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold text-center mb-4">Oinarrizko baliokidetasunak</p>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-800 p-4 rounded-xl">
                      <p className="font-mono text-xl text-orange-400 font-bold">1° = 60'</p>
                      <p className="text-sm text-slate-400 mt-1">Gradu bat = 60 minutu</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl">
                      <p className="font-mono text-xl text-amber-400 font-bold">1' = 60"</p>
                      <p className="text-sm text-slate-400 mt-1">Minutu bat = 60 segundo</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl">
                      <p className="font-mono text-xl text-yellow-400 font-bold">1° = 3600"</p>
                      <p className="text-sm text-slate-400 mt-1">Gradu bat = 3600 segundo</p>
                    </div>
                  </div>
                </div>

                {/* Decimal to DMS formula */}
                <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-6">
                  <h3 className="font-bold text-orange-800 text-lg mb-4 flex items-center gap-2">
                    <ArrowRight size={18} />
                    Hamartar gradu → GMS
                  </h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="bg-white p-4 rounded-xl border border-orange-100 font-mono text-center space-y-2">
                      <p><strong>D</strong> = floor(hamartar)</p>
                      <p><strong>M</strong> = floor((hamartar − D) × 60)</p>
                      <p><strong>S</strong> = ((hamartar − D) × 60 − M) × 60</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-orange-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Adibidea: 72.4575°</p>
                      <p className="font-mono">D = floor(72.4575) = <strong className="text-orange-600">72°</strong></p>
                      <p className="font-mono">M = floor(0.4575 × 60) = floor(27.45) = <strong className="text-orange-600">27'</strong></p>
                      <p className="font-mono">S = (27.45 − 27) × 60 = 0.45 × 60 = <strong className="text-orange-600">27"</strong></p>
                      <p className="font-mono font-bold text-orange-700 mt-2">Emaitza: 72° 27' 27"</p>
                    </div>
                  </div>
                </div>

                {/* DMS to Decimal formula */}
                <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-6">
                  <h3 className="font-bold text-amber-800 text-lg mb-4 flex items-center gap-2">
                    <ArrowRight size={18} />
                    GMS → Hamartar gradu
                  </h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="bg-white p-4 rounded-xl border border-amber-100 font-mono text-center">
                      <p className="text-lg"><strong>Hamartarra</strong> = D + M/60 + S/3600</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Adibidea: 50° 18' 36"</p>
                      <p className="font-mono">50 + 18/60 + 36/3600</p>
                      <p className="font-mono">50 + 0.3 + 0.01</p>
                      <p className="font-mono font-bold text-amber-700 mt-2">Emaitza: 50.31°</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Carrying rules */}
            <Section title="Buruketaren arauak" icon={ListOrdered}>
              <div className="space-y-6">

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 text-sm text-orange-800">
                  <Lightbulb className="shrink-0" size={20} />
                  <p><strong>Gogoratu:</strong> Sistema hamartarrean 10-ra iritsita buruketatu behar dugun bezala, sistema sexagesimalean <strong>60-ra iritsita</strong> buruketatu behar dugu.</p>
                </div>

                {/* Addition rules */}
                <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100">
                    <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                      <Plus size={18} />
                      Batuketa arauak
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <ol className="space-y-3 text-sm text-slate-700">
                      <li className="flex gap-3">
                        <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">1</span>
                        <span>Segundoak batu. Emaitza <strong>≥ 60</strong> bada, kendu 60 eta gehitu 1 minutu.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">2</span>
                        <span>Minutuak batu (buruketarekin). Emaitza <strong>≥ 60</strong> bada, kendu 60 eta gehitu 1 gradu.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">3</span>
                        <span>Graduak batu (buruketarekin).</span>
                      </li>
                    </ol>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm text-center">
                      <p>S₁ + S₂ ≥ 60 → <strong className="text-orange-600">Segundo berriak = (S₁+S₂) − 60, eta +1'</strong></p>
                      <p className="mt-1">M₁ + M₂ ≥ 60 → <strong className="text-orange-600">Minutu berriak = (M₁+M₂) − 60, eta +1°</strong></p>
                    </div>
                  </div>
                </div>

                {/* Subtraction rules */}
                <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden">
                  <div className="bg-amber-50 p-4 border-b border-amber-100">
                    <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                      <Minus size={18} />
                      Kenketa arauak
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <ol className="space-y-3 text-sm text-slate-700">
                      <li className="flex gap-3">
                        <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">1</span>
                        <span>Segundoak kendu. Ezin bada (S₁ &lt; S₂), <strong>mailegutu 1 minutu</strong> (= 60") eta gehitu segundoei.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">2</span>
                        <span>Minutuak kendu. Ezin bada (M₁ &lt; M₂), <strong>mailegutu 1 gradu</strong> (= 60') eta gehitu minutuei.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">3</span>
                        <span>Graduak kendu.</span>
                      </li>
                    </ol>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm text-center">
                      <p>S₁ &lt; S₂ → <strong className="text-amber-600">Segundo berriak = (S₁+60) − S₂, eta −1'</strong></p>
                      <p className="mt-1">M₁ &lt; M₂ → <strong className="text-amber-600">Minutu berriak = (M₁+60) − M₂, eta −1°</strong></p>
                    </div>
                  </div>
                </div>

                {/* Quick reference table */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Laburpen taula</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left p-2 text-xs text-slate-400 uppercase">Eragiketa</th>
                          <th className="text-center p-2 text-xs text-slate-400 uppercase">Segundoak</th>
                          <th className="text-center p-2 text-xs text-slate-400 uppercase">Minutuak</th>
                          <th className="text-center p-2 text-xs text-slate-400 uppercase">Graduak</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="p-2 font-bold text-orange-600">Batuketa</td>
                          <td className="p-2 text-center font-mono text-sm">≥60 → −60, +1'</td>
                          <td className="p-2 text-center font-mono text-sm">≥60 → −60, +1°</td>
                          <td className="p-2 text-center font-mono text-sm">Batu</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="p-2 font-bold text-amber-600">Kenketa</td>
                          <td className="p-2 text-center font-mono text-sm">&lt;0 → +60, −1'</td>
                          <td className="p-2 text-center font-mono text-sm">&lt;0 → +60, −1°</td>
                          <td className="p-2 text-center font-mono text-sm">Kendu</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </Section>

          </div>
        )}

        {/* --- TAB 4: PRAKTIKA --- */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-orange-200 ring-4 ring-orange-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-orange-50 border border-orange-100 px-6 py-2 rounded-full text-sm font-bold text-orange-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{total}</span>
                    {total > 0 && <span className="text-xs opacity-60">({Math.round((score / total) * 100)}%)</span>}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'dec2dms' ? 'Hamartar → GMS' :
                         problem.type === 'dms2dec' ? 'GMS → Hamartar' :
                         problem.type === 'add' ? 'Angeluen Batuketa' :
                         'Angeluen Kenketa'}
                      </div>
                      <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                    </div>

                    {/* Input fields */}
                    <div className="flex flex-col items-center gap-4">
                      {problem.type === 'dms2dec' ? (
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                          <input
                            type="text"
                            placeholder="Hamartar graduak"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                            className="w-48 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg font-bold font-mono"
                          />
                          <span className="font-mono font-bold text-slate-400 text-lg">°</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                          <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              placeholder="°"
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                              className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg font-bold font-mono"
                            />
                            <span className="font-mono font-bold text-slate-500">°</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              placeholder="'"
                              value={userInputMin}
                              onChange={(e) => setUserInputMin(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                              className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg font-bold font-mono"
                            />
                            <span className="font-mono font-bold text-slate-500">'</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder='"'
                              value={userInputSec}
                              onChange={(e) => setUserInputSec(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                              className="w-20 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg font-bold font-mono"
                            />
                            <span className="font-mono font-bold text-slate-500">"</span>
                          </div>
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
                          {feedback === 'correct' ? <Check /> : feedback === 'invalid' ? <RefreshCw /> : <X />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Hori da.' :
                             feedback === 'invalid' ? 'Mesedez, sartu erantzun bat.' :
                             `Oker... Erantzun zuzena: ${problem.type === 'dms2dec' ? problem.solution + '°' : problem.solutionText}`}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800 mt-2">
                            <strong>Pista:</strong> {problem.hint}
                          </div>
                        )}
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
                          className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          <ArrowRight size={18} /> Hurrengoa
                        </button>
                      )}
                      {feedback === 'incorrect' && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
                        >
                          <RefreshCw size={18} /> Berria sortu
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
