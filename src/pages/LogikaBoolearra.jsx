import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, Cpu, ArrowRight, Check, RefreshCw, Zap, ListOrdered, ToggleLeft, ToggleRight, Brain } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Logic Gate Visual Component ---

const LogicGateVisual = ({ operator, a, b, result }) => {
  const gateColor = result ? 'bg-emerald-500' : 'bg-red-500';
  const inputColorA = a ? 'bg-emerald-400' : 'bg-slate-300';
  const inputColorB = b ? 'bg-emerald-400' : 'bg-slate-300';

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <div className="flex flex-col gap-3 items-end">
        {operator !== 'NOT' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">A</span>
              <div className={`w-16 h-3 rounded-full ${inputColorA} transition-colors duration-300`} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">B</span>
              <div className={`w-16 h-3 rounded-full ${inputColorB} transition-colors duration-300`} />
            </div>
          </>
        )}
        {operator === 'NOT' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">A</span>
            <div className={`w-16 h-3 rounded-full ${inputColorA} transition-colors duration-300`} />
          </div>
        )}
      </div>
      <div className={`w-20 h-20 rounded-2xl ${gateColor} text-white flex items-center justify-center font-bold text-sm shadow-lg transition-colors duration-300`}>
        {operator}
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-16 h-3 rounded-full ${result ? 'bg-emerald-400' : 'bg-slate-300'} transition-colors duration-300`} />
        <span className="text-xs font-bold text-slate-500">Irteera</span>
      </div>
    </div>
  );
};

// --- Truth Table Component ---

const TruthTable = ({ operator, highlight = false }) => {
  const evaluate = (a, b, op) => {
    switch (op) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'NOT': return !a;
      case 'XOR': return a !== b;
      default: return false;
    }
  };

  const rows = operator === 'NOT'
    ? [
        { a: true, result: false },
        { a: false, result: true },
      ]
    : [
        { a: true, b: true, result: evaluate(true, true, operator) },
        { a: true, b: false, result: evaluate(true, false, operator) },
        { a: false, b: true, result: evaluate(false, true, operator) },
        { a: false, b: false, result: evaluate(false, false, operator) },
      ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cyan-50">
            <th className="px-4 py-2 text-left font-bold text-cyan-700 border-b border-cyan-100">A</th>
            {operator !== 'NOT' && <th className="px-4 py-2 text-left font-bold text-cyan-700 border-b border-cyan-100">B</th>}
            <th className="px-4 py-2 text-left font-bold text-cyan-700 border-b border-cyan-100">Emaitza</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-slate-100 ${highlight && row.result ? 'bg-emerald-50' : ''}`}>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${row.a ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {row.a ? 'EGIA' : 'GEZURRA'}
                </span>
              </td>
              {operator !== 'NOT' && (
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${row.b ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {row.b ? 'EGIA' : 'GEZURRA'}
                  </span>
                </td>
              )}
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${row.result ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {row.result ? 'EGIA' : 'GEZURRA'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Component ---

export default function LogikaBoolearra() {
  useDocumentTitle('Logika Boolearra');
  const [activeTab, setActiveTab] = useState('teoria');
  const [labA, setLabA] = useState(true);
  const [labB, setLabB] = useState(false);
  const [labOperator, setLabOperator] = useState('AND');
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { score, total: totalAttempts, addCorrect, addIncorrect, reset } = useProgress('logika-bool');

  useEffect(() => {
    generateProblem();
  }, []);

  const evaluate = (a, b, op) => {
    switch (op) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'NOT': return !a;
      case 'XOR': return a !== b;
      default: return false;
    }
  };

  const labResult = evaluate(labA, labB, labOperator);

  const generateProblem = () => {
    const operators = ['AND', 'OR', 'NOT', 'XOR'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    const a = Math.random() < 0.5;
    const b = Math.random() < 0.5;
    const result = evaluate(a, b, op);

    setPracticeProblem({ a, b, operator: op, result });
    setFeedback(null);
  };

  const checkAnswer = (userAnswer) => {
    if (!practiceProblem) return;
    if (userAnswer === practiceProblem.result) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  const operatorSymbol = (op) => {
    switch (op) {
      case 'AND': return '&&';
      case 'OR': return '||';
      case 'NOT': return '!';
      case 'XOR': return '^';
      default: return op;
    }
  };

  const operatorDescription = (op) => {
    switch (op) {
      case 'AND': return 'Biak egia direnean bakarrik egia da';
      case 'OR': return 'Bat gutxienez egia denean egia da';
      case 'NOT': return 'Balioa alderantzikatzen du';
      case 'XOR': return 'Biak desberdinak direnean bakarrik egia da';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-100 selection:text-cyan-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('teoria')} className={`hover:text-cyan-600 transition-colors ${activeTab === 'teoria' ? 'text-cyan-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('laborategia')} className={`hover:text-cyan-600 transition-colors ${activeTab === 'laborategia' ? 'text-cyan-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('formulak')} className={`hover:text-cyan-600 transition-colors ${activeTab === 'formulak' ? 'text-cyan-600' : ''}`}>Formulak</button>
            <button onClick={() => setActiveTab('praktika')} className={`px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Logika <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-500">Boolearra</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Egia ala gezurra? Informatikaren oinarria den logika boolearra ikasi, non balio guztiak bi egoera bakarrera murrizten diren: 1 edo 0, egia edo gezurra.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['teoria', 'laborategia', 'formulak', 'praktika'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'teoria' ? 'Teoria' : t === 'laborategia' ? 'Laborategia' : t === 'formulak' ? 'Formulak' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- TAB 1: TEORIA --- */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zer da logika boolearra?" icon={Zap} className="border-cyan-200 ring-4 ring-cyan-50/30">
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>George Boole</strong> matematikari ingelesak (1815-1864) sortu zuen algebra mota bat da, non bi balio bakarrik existitzen diren:
                  <strong className="text-emerald-600"> EGIA (true / 1)</strong> eta <strong className="text-red-600"> GEZURRA (false / 0)</strong>.
                  Gaur egun, ordenagailu guztien oinarria da, transistoreek bi egoera baitituzte: piztuta (1) edo itzalita (0).
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                    <div className="text-5xl font-mono font-bold text-emerald-600 mb-2">1</div>
                    <div className="text-lg font-bold text-emerald-700 mb-1">EGIA (True)</div>
                    <p className="text-sm text-emerald-600">Piztuta, Bai, Betetzen da, Aktibo</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center">
                    <div className="text-5xl font-mono font-bold text-red-600 mb-2">0</div>
                    <div className="text-lg font-bold text-red-700 mb-1">GEZURRA (False)</div>
                    <p className="text-sm text-red-600">Itzalita, Ez, Ez da betetzen, Inaktibo</p>
                  </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 text-sm text-cyan-800">
                  <strong>Zergatik da garrantzitsua?</strong> Ordenagailu batek milioika eragiketa logiko egiten ditu segundoko. Prozesadore baten barnean, transistore txikiek eragiketa boolearrak egiten dituzte korronte elektrikoaren bidez. Zure telefonoak 10.000 milioi transistore baino gehiago ditu!
                </div>
              </div>
            </Section>

            <Section title="AND Eragiketa (ETA)" icon={BookOpen}>
              <div className="space-y-4">
                <p className="text-slate-600">
                  <strong>AND</strong> eragiketak bi sarrera hartzen ditu, eta biak <strong>EGIA</strong> direnean bakarrik ematen du EGIA emaitza gisa.
                  Eguneroko adibidea: "Euria egiten du <strong>ETA</strong> aterki bat daukat" -- biak bete behar dira euritan busti gabe joateko.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-3">AND Eragilea</p>
                  <p className="text-3xl font-mono font-bold">
                    <span className="text-emerald-400">A</span>
                    <span className="text-cyan-400 mx-3">&&</span>
                    <span className="text-emerald-400">B</span>
                  </p>
                  <p className="text-slate-400 mt-3 text-sm">Biak egia direnean bakarrik egia da</p>
                </div>
                <TruthTable operator="AND" highlight />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
                    <p className="font-mono text-center mb-1"><span className="text-emerald-600">EGIA</span> AND <span className="text-emerald-600">EGIA</span> = <strong className="text-emerald-600">EGIA</strong></p>
                    <p className="text-xs text-center text-slate-500">Kasu bakarra non emaitza EGIA den</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="font-mono text-center mb-1"><span className="text-emerald-600">EGIA</span> AND <span className="text-red-600">GEZURRA</span> = <strong className="text-red-600">GEZURRA</strong></p>
                    <p className="text-xs text-center text-slate-500">Bat gezurra bada, emaitza gezurra da</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="OR Eragiketa (EDO)" icon={BookOpen}>
              <div className="space-y-4">
                <p className="text-slate-600">
                  <strong>OR</strong> eragiketak bi sarrera hartzen ditu, eta <strong>gutxienez bat</strong> EGIA denean emaitza EGIA da.
                  Eguneroko adibidea: "Autobusa hartzen dut <strong>EDO</strong> oinez joaten naiz" -- bietako bat aukeratu behar duzu.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-3">OR Eragilea</p>
                  <p className="text-3xl font-mono font-bold">
                    <span className="text-emerald-400">A</span>
                    <span className="text-cyan-400 mx-3">||</span>
                    <span className="text-emerald-400">B</span>
                  </p>
                  <p className="text-slate-400 mt-3 text-sm">Bat gutxienez egia denean egia da</p>
                </div>
                <TruthTable operator="OR" highlight />
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <strong>Kontuz!</strong> OR eragiketa "inklusibo" da matematikan: biak egia badira, emaitza ere egia da. Eguneroko hizkuntzan, "edo" batzuetan "esklusibo" da (bat ala bestea, baina ez biak), baina logika boolearrean OR beti inklusibo da.
                </div>
              </div>
            </Section>

            <Section title="NOT Eragiketa (EZ)" icon={BookOpen}>
              <div className="space-y-4">
                <p className="text-slate-600">
                  <strong>NOT</strong> eragiketak sarrera <strong>bakarra</strong> hartzen du eta bere balioa <strong>alderantzikatzen</strong> du. Egia bada, gezurra bihurtzen du; gezurra bada, egia.
                  Eguneroko adibidea: "Argia <strong>EZ</strong> dago piztuta" -- piztuta badago, adierazpena gezurra da.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-3">NOT Eragilea</p>
                  <p className="text-3xl font-mono font-bold">
                    <span className="text-cyan-400 mr-2">!</span>
                    <span className="text-emerald-400">A</span>
                  </p>
                  <p className="text-slate-400 mt-3 text-sm">Balioa alderantzikatzen du</p>
                </div>
                <TruthTable operator="NOT" highlight />
              </div>
            </Section>

            <Section title="XOR Eragiketa (EDO Esklusiboa)" icon={BookOpen}>
              <div className="space-y-4">
                <p className="text-slate-600">
                  <strong>XOR</strong> (eXclusive OR) eragiketak bi sarrera hartzen ditu, eta biak <strong>desberdinak</strong> direnean bakarrik ematen du EGIA.
                  Eguneroko adibidea: "Kafea hartzen dut <strong>EDO</strong> tea hartzen dut" -- bat ala bestea, baina ez biak aldi berean.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-3">XOR Eragilea</p>
                  <p className="text-3xl font-mono font-bold">
                    <span className="text-emerald-400">A</span>
                    <span className="text-cyan-400 mx-3">^</span>
                    <span className="text-emerald-400">B</span>
                  </p>
                  <p className="text-slate-400 mt-3 text-sm">Biak desberdinak direnean bakarrik egia da</p>
                </div>
                <TruthTable operator="XOR" highlight />
                <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-lg text-sm text-cyan-800">
                  <strong>Kriptografian:</strong> XOR eragiketa oso garrantzitsua da datuen enkriptatzerako. Mezu bat gako batekin XOR eginez gero, zifratutako mezua lortzen da. Zifratutako mezua gako berarekin XOR eginez gero, jatorrizko mezua berreskuratzen da!
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- TAB 2: LABORATEGIA --- */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Ate Logikoen Simulagailua" icon={Cpu} className="border-cyan-200 ring-4 ring-cyan-50/30">
              <div className="space-y-8">

                {/* Operator selector */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Eragilea aukeratu</p>
                  <div className="flex flex-wrap gap-2">
                    {['AND', 'OR', 'NOT', 'XOR'].map(op => (
                      <button
                        key={op}
                        onClick={() => setLabOperator(op)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                          labOperator === op
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{operatorDescription(labOperator)}</p>
                </div>

                {/* Input toggles */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Sarrera A</p>
                        <p className={`text-2xl font-bold font-mono ${labA ? 'text-emerald-600' : 'text-red-600'}`}>
                          {labA ? 'EGIA (1)' : 'GEZURRA (0)'}
                        </p>
                      </div>
                      <button
                        onClick={() => setLabA(!labA)}
                        className={`w-16 h-9 rounded-full transition-colors duration-300 flex items-center px-1 ${
                          labA ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${labA ? 'translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  {labOperator !== 'NOT' && (
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Sarrera B</p>
                          <p className={`text-2xl font-bold font-mono ${labB ? 'text-emerald-600' : 'text-red-600'}`}>
                            {labB ? 'EGIA (1)' : 'GEZURRA (0)'}
                          </p>
                        </div>
                        <button
                          onClick={() => setLabB(!labB)}
                          className={`w-16 h-9 rounded-full transition-colors duration-300 flex items-center px-1 ${
                            labB ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${labB ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gate visualization */}
                <LogicGateVisual operator={labOperator} a={labA} b={labB} result={labResult} />

                {/* Result display */}
                <div className={`p-6 rounded-2xl text-center transition-colors duration-300 ${
                  labResult ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Emaitza</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-lg text-slate-600">
                      {labOperator === 'NOT'
                        ? `!${labA ? '1' : '0'}`
                        : `${labA ? '1' : '0'} ${operatorSymbol(labOperator)} ${labB ? '1' : '0'}`
                      }
                    </span>
                    <span className="text-slate-400">=</span>
                    <span className={`text-4xl font-bold font-mono ${labResult ? 'text-emerald-600' : 'text-red-600'}`}>
                      {labResult ? '1' : '0'}
                    </span>
                  </div>
                  <p className={`text-lg font-bold mt-2 ${labResult ? 'text-emerald-600' : 'text-red-600'}`}>
                    {labResult ? 'EGIA (True)' : 'GEZURRA (False)'}
                  </p>
                </div>

                {/* Expression breakdown */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Adierazpenaren azalpena</p>
                  {labOperator === 'AND' && (
                    <div className="space-y-2 text-sm font-mono">
                      <p><span className="text-cyan-400">A = {labA ? 'egia' : 'gezurra'}</span></p>
                      <p><span className="text-cyan-400">B = {labB ? 'egia' : 'gezurra'}</span></p>
                      <p className="text-slate-400">A AND B: Biak egia dira? {labA && labB ? 'BAI' : 'EZ'}</p>
                      <p className="text-emerald-400 font-bold">Emaitza = {labResult ? 'EGIA' : 'GEZURRA'}</p>
                    </div>
                  )}
                  {labOperator === 'OR' && (
                    <div className="space-y-2 text-sm font-mono">
                      <p><span className="text-cyan-400">A = {labA ? 'egia' : 'gezurra'}</span></p>
                      <p><span className="text-cyan-400">B = {labB ? 'egia' : 'gezurra'}</span></p>
                      <p className="text-slate-400">A OR B: Gutxienez bat egia da? {labA || labB ? 'BAI' : 'EZ'}</p>
                      <p className="text-emerald-400 font-bold">Emaitza = {labResult ? 'EGIA' : 'GEZURRA'}</p>
                    </div>
                  )}
                  {labOperator === 'NOT' && (
                    <div className="space-y-2 text-sm font-mono">
                      <p><span className="text-cyan-400">A = {labA ? 'egia' : 'gezurra'}</span></p>
                      <p className="text-slate-400">NOT A: A-ren kontrakoa hartzen dugu</p>
                      <p className="text-emerald-400 font-bold">Emaitza = {labResult ? 'EGIA' : 'GEZURRA'}</p>
                    </div>
                  )}
                  {labOperator === 'XOR' && (
                    <div className="space-y-2 text-sm font-mono">
                      <p><span className="text-cyan-400">A = {labA ? 'egia' : 'gezurra'}</span></p>
                      <p><span className="text-cyan-400">B = {labB ? 'egia' : 'gezurra'}</span></p>
                      <p className="text-slate-400">A XOR B: Biak desberdinak dira? {labA !== labB ? 'BAI' : 'EZ'}</p>
                      <p className="text-emerald-400 font-bold">Emaitza = {labResult ? 'EGIA' : 'GEZURRA'}</p>
                    </div>
                  )}
                </div>

                {/* Current truth table */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{labOperator} egiaren taula</p>
                  <TruthTable operator={labOperator} />
                </div>

              </div>
            </Section>

            <Section title="Konbinazio Praktikoa" icon={Zap}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Proba ezazu goiko toggle botoiak aldatzen eta ikusi nola aldatzen den emaitza eragile bakoitzarekin. Hona hemen zenbait galdera pentsatzeko:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
                    <p className="font-bold text-cyan-700 text-sm mb-2">Pentsatzeko</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>Zein eragilerekin da GEZURRA emaitza ohikoena?</li>
                      <li>Zein eragilerekin da EGIA emaitza ohikoena?</li>
                      <li>NOT eragileak sarrera bat bakarrik behar du. Zergatik?</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl">
                    <p className="font-bold text-sky-700 text-sm mb-2">Erantzunak</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li><strong>AND:</strong> 4 kasutik 1ean bakarrik da EGIA</li>
                      <li><strong>OR:</strong> 4 kasutik 3tan da EGIA</li>
                      <li><strong>NOT:</strong> alderantzikatzeak balio bakar bat hartzen du</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- TAB 3: FORMULAK --- */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Eragile Logiko Guztiak" icon={ListOrdered}>
              <div className="space-y-6">

                {/* AND Card */}
                <div className="p-5 rounded-xl bg-cyan-50 border border-cyan-100 hover:border-cyan-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-cyan-600 text-white rounded-lg font-bold text-sm">AND</span>
                        <span className="text-slate-500 text-sm">Konjuntzioa (ETA)</span>
                      </div>
                      <p className="font-mono text-2xl font-bold text-slate-700 mb-2">A && B</p>
                      <p className="text-sm text-slate-600">Bi sarrerak EGIA direnean bakarrik EGIA ematen du. Programazioan <code className="bg-slate-100 px-1 rounded">&amp;&amp;</code> ikurra erabiltzen da.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-cyan-600 font-bold mb-1">Adibidea</p>
                        <p className="font-mono text-sm text-slate-600">adina &gt;= 18 <strong>&amp;&amp;</strong> baimena == egia</p>
                        <p className="text-xs text-slate-400 mt-1">Biak bete behar dira aldi berean</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <TruthTable operator="AND" />
                    </div>
                  </div>
                </div>

                {/* OR Card */}
                <div className="p-5 rounded-xl bg-sky-50 border border-sky-100 hover:border-sky-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-sky-600 text-white rounded-lg font-bold text-sm">OR</span>
                        <span className="text-slate-500 text-sm">Disjuntzioa (EDO)</span>
                      </div>
                      <p className="font-mono text-2xl font-bold text-slate-700 mb-2">A || B</p>
                      <p className="text-sm text-slate-600">Gutxienez sarrera bat EGIA denean EGIA ematen du. Programazioan <code className="bg-slate-100 px-1 rounded">||</code> ikurra erabiltzen da.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-sky-600 font-bold mb-1">Adibidea</p>
                        <p className="font-mono text-sm text-slate-600">igandea == egia <strong>||</strong> oporra == egia</p>
                        <p className="text-xs text-slate-400 mt-1">Bietako bat nahikoa da</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <TruthTable operator="OR" />
                    </div>
                  </div>
                </div>

                {/* NOT Card */}
                <div className="p-5 rounded-xl bg-violet-50 border border-violet-100 hover:border-violet-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-violet-600 text-white rounded-lg font-bold text-sm">NOT</span>
                        <span className="text-slate-500 text-sm">Negazioa (EZ)</span>
                      </div>
                      <p className="font-mono text-2xl font-bold text-slate-700 mb-2">!A</p>
                      <p className="text-sm text-slate-600">Sarreraren balioa alderantzikatzen du. EGIA gezurra bihurtzen du, eta GEZURRA egia. Programazioan <code className="bg-slate-100 px-1 rounded">!</code> ikurra erabiltzen da.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-violet-600 font-bold mb-1">Adibidea</p>
                        <p className="font-mono text-sm text-slate-600"><strong>!</strong>piztuta</p>
                        <p className="text-xs text-slate-400 mt-1">Piztuta badago, itzalita itzultzen du</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <TruthTable operator="NOT" />
                    </div>
                  </div>
                </div>

                {/* XOR Card */}
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 hover:border-amber-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold text-sm">XOR</span>
                        <span className="text-slate-500 text-sm">Disjuntzio esklusiboa (EDO Esklusiboa)</span>
                      </div>
                      <p className="font-mono text-2xl font-bold text-slate-700 mb-2">A ^ B</p>
                      <p className="text-sm text-slate-600">Sarrerak DESBERDINAK direnean bakarrik EGIA ematen du. Biak berdinak badira (biak egia edo biak gezurra), GEZURRA ematen du.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-amber-600 font-bold mb-1">Adibidea</p>
                        <p className="font-mono text-sm text-slate-600">argia_ezkerrean <strong>^</strong> argia_eskuinean</p>
                        <p className="text-xs text-slate-400 mt-1">Bat piztuta eta bestea itzalita dagoenean bakarrik</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <TruthTable operator="XOR" />
                    </div>
                  </div>
                </div>

              </div>
            </Section>

            <Section title="De Morganen Legeak" icon={BookOpen}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Augustus De Morganek (1806-1871) bi lege garrantzitsu formulatu zituen, adierazpen boolearrak sinplifikatzeko oso erabilgarriak direnak.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border-2 border-cyan-200 rounded-xl">
                    <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">Lehen Legea</p>
                    <p className="font-mono text-xl font-bold text-slate-700 text-center mb-3">!(A && B) = !A || !B</p>
                    <p className="text-sm text-slate-600">"A eta B-ren negazioa" berdina da "A-ren negazioa edo B-ren negazioa" esatea baino.</p>
                  </div>
                  <div className="p-5 bg-white border-2 border-sky-200 rounded-xl">
                    <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Bigarren Legea</p>
                    <p className="font-mono text-xl font-bold text-slate-700 text-center mb-3">!(A || B) = !A && !B</p>
                    <p className="text-sm text-slate-600">"A edo B-ren negazioa" berdina da "A-ren negazioa eta B-ren negazioa" esatea baino.</p>
                  </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 text-sm text-cyan-800">
                  <strong>Laburpena:</strong> Negazioak "barrutik sartzen" direnean, AND eta OR trukatzen dira (eta alderantziz). Lege hauek programazioan oso erabilgarriak dira baldintza konplexuak sinplifikatzeko.
                </div>
              </div>
            </Section>

            <Section title="Lehentasun Ordena" icon={ListOrdered}>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Adierazpen boolear konplexuetan, eragileak ordena zehatz batean ebaluatzen dira (matematikan bezala, biderketa batuketa baino lehen egiten den moduan):
                </p>
                <div className="space-y-3">
                  {[
                    { order: '1.', op: 'NOT (!)', desc: 'Lehentasun altuena - lehenik ebaluatzen da', color: 'violet' },
                    { order: '2.', op: 'AND (&&)', desc: 'Bigarrena - biderketa logikoa', color: 'cyan' },
                    { order: '3.', op: 'XOR (^)', desc: 'Hirugarrena', color: 'amber' },
                    { order: '4.', op: 'OR (||)', desc: 'Lehentasun baxuena - azkena ebaluatzen da', color: 'sky' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 bg-${item.color}-50 border border-${item.color}-100 rounded-xl`}>
                      <span className={`text-2xl font-bold text-${item.color}-600 font-mono w-10`}>{item.order}</span>
                      <div>
                        <p className="font-mono font-bold text-slate-700">{item.op}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900 text-white p-5 rounded-2xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Adibidea</p>
                  <p className="font-mono text-lg text-center">
                    <span className="text-violet-400">!</span><span className="text-emerald-400">egia</span>
                    <span className="text-cyan-400"> && </span>
                    <span className="text-emerald-400">gezurra</span>
                    <span className="text-sky-400"> || </span>
                    <span className="text-emerald-400">egia</span>
                  </p>
                  <div className="text-sm text-slate-400 mt-3 space-y-1">
                    <p>1. <span className="text-violet-400">!egia</span> = gezurra</p>
                    <p>2. <span className="text-cyan-400">gezurra && gezurra</span> = gezurra</p>
                    <p>3. <span className="text-sky-400">gezurra || egia</span> = <span className="text-emerald-400 font-bold">EGIA</span></p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- TAB 4: PRAKTIKA --- */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Ariketa Boolearra" icon={Brain} className="border-cyan-200 ring-4 ring-cyan-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-cyan-50 border border-cyan-100 px-6 py-2 rounded-full text-sm font-bold text-cyan-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{totalAttempts}</span>
                    {totalAttempts > 0 && <span className="text-xs opacity-60">({Math.round((score / totalAttempts) * 100)}%)</span>}
                  </div>
                </div>

                {practiceProblem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {practiceProblem.operator} eragiketa
                      </div>
                      <div className="text-xs text-slate-400 mb-6">Kalkulatu emaitza</div>

                      {practiceProblem.operator === 'NOT' ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-4">
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${practiceProblem.a ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              A = {practiceProblem.a ? 'EGIA' : 'GEZURRA'}
                            </span>
                          </div>
                          <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold">
                            NOT <span className={practiceProblem.a ? 'text-emerald-600' : 'text-red-600'}>{practiceProblem.a ? 'EGIA' : 'GEZURRA'}</span> = <span className="text-cyan-500">?</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-4">
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${practiceProblem.a ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              A = {practiceProblem.a ? 'EGIA' : 'GEZURRA'}
                            </span>
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${practiceProblem.b ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              B = {practiceProblem.b ? 'EGIA' : 'GEZURRA'}
                            </span>
                          </div>
                          <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold">
                            <span className={practiceProblem.a ? 'text-emerald-600' : 'text-red-600'}>{practiceProblem.a ? '1' : '0'}</span>
                            <span className="text-cyan-500 mx-3">{operatorSymbol(practiceProblem.operator)}</span>
                            <span className={practiceProblem.b ? 'text-emerald-600' : 'text-red-600'}>{practiceProblem.b ? '1' : '0'}</span>
                            <span className="text-slate-400 mx-2">=</span>
                            <span className="text-cyan-500">?</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {!feedback && (
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => checkAnswer(true)}
                          className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-500 hover:-translate-y-1 transition-all active:translate-y-0"
                        >
                          EGIA (1)
                        </button>
                        <button
                          onClick={() => checkAnswer(false)}
                          className="px-10 py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-500 hover:-translate-y-1 transition-all active:translate-y-0"
                        >
                          GEZURRA (0)
                        </button>
                      </div>
                    )}

                    {feedback && (
                      <div className={`p-6 rounded-xl flex flex-col items-center justify-center gap-3 animate-in zoom-in duration-300 ${
                        feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {feedback === 'correct' ? <Check size={24} /> : <RefreshCw size={24} />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Ondo erantzun duzu.' : 'Oker! Erantzun zuzena:'}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <div className="text-center">
                            <p className="font-mono text-xl font-bold">
                              {practiceProblem.operator === 'NOT'
                                ? `NOT ${practiceProblem.a ? 'EGIA' : 'GEZURRA'} = ${practiceProblem.result ? 'EGIA' : 'GEZURRA'}`
                                : `${practiceProblem.a ? '1' : '0'} ${operatorSymbol(practiceProblem.operator)} ${practiceProblem.b ? '1' : '0'} = ${practiceProblem.result ? '1 (EGIA)' : '0 (GEZURRA)'}`
                              }
                            </p>
                            <p className="text-sm mt-2 text-red-600">
                              {operatorDescription(practiceProblem.operator)}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={generateProblem}
                          className="mt-2 px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all flex items-center gap-2"
                        >
                          <ArrowRight size={18} /> Hurrengo galdera
                        </button>
                      </div>
                    )}

                    {/* Quick reference */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Laguntza txartela</p>
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-600">
                        <div>
                          <p className="font-bold text-cyan-600 mb-1">AND (&&)</p>
                          <p>1 && 1 = 1</p>
                          <p>1 && 0 = 0</p>
                          <p>0 && 1 = 0</p>
                          <p>0 && 0 = 0</p>
                        </div>
                        <div>
                          <p className="font-bold text-sky-600 mb-1">OR (||)</p>
                          <p>1 || 1 = 1</p>
                          <p>1 || 0 = 1</p>
                          <p>0 || 1 = 1</p>
                          <p>0 || 0 = 0</p>
                        </div>
                        <div>
                          <p className="font-bold text-violet-600 mb-1">NOT (!)</p>
                          <p>!1 = 0</p>
                          <p>!0 = 1</p>
                        </div>
                        <div>
                          <p className="font-bold text-amber-600 mb-1">XOR (^)</p>
                          <p>1 ^ 1 = 0</p>
                          <p>1 ^ 0 = 1</p>
                          <p>0 ^ 1 = 1</p>
                          <p>0 ^ 0 = 0</p>
                        </div>
                      </div>
                    </div>

                    {/* Reset score */}
                    {totalAttempts >= 5 && (
                      <button
                        onClick={() => { reset(); generateProblem(); }}
                        className="text-sm text-slate-400 hover:text-cyan-600 underline transition-colors"
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

      <RelatedTopics currentId="logika-bool" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
