import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GitBranch, ArrowRight, Check, RefreshCw, Zap, ListOrdered, ArrowDown, Play, Square, Diamond, ChevronDown, RotateCcw, X } from 'lucide-react';
import useProgress from '../hooks/useProgress';

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

// --- Flowchart Block Component ---

const FlowBlock = ({ type, text, highlight = false }) => {
  const baseClasses = "px-6 py-3 text-center font-medium text-sm transition-all duration-300";
  const highlightRing = highlight ? "ring-4 ring-cyan-300 ring-opacity-50" : "";

  if (type === 'start' || type === 'end') {
    return (
      <div className={`${baseClasses} ${highlightRing} bg-cyan-600 text-white rounded-full shadow-md`}>
        {text}
      </div>
    );
  }
  if (type === 'process') {
    return (
      <div className={`${baseClasses} ${highlightRing} bg-blue-100 text-blue-800 border-2 border-blue-300 rounded-lg shadow-sm`}>
        {text}
      </div>
    );
  }
  if (type === 'decision') {
    return (
      <div className={`${baseClasses} ${highlightRing} bg-amber-100 text-amber-800 border-2 border-amber-300 rounded-lg shadow-sm transform rotate-0`}>
        <Diamond size={14} className="inline mr-1" />
        {text}
      </div>
    );
  }
  if (type === 'input') {
    return (
      <div className={`${baseClasses} ${highlightRing} bg-green-100 text-green-800 border-2 border-green-300 rounded-lg shadow-sm skew-x-0`} style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
        {text}
      </div>
    );
  }
  if (type === 'output') {
    return (
      <div className={`${baseClasses} ${highlightRing} bg-purple-100 text-purple-800 border-2 border-purple-300 rounded-lg shadow-sm`}>
        {text}
      </div>
    );
  }
  return null;
};

const FlowArrow = ({ label }) => (
  <div className="flex flex-col items-center my-1">
    <ChevronDown size={20} className="text-slate-400" />
    {label && <span className="text-xs text-slate-500 font-medium -mt-1">{label}</span>}
  </div>
);

// --- Bubble Sort Visualizer ---

const BubbleSortVisualizer = () => {
  const initialArray = [5, 3, 8, 1, 4];
  const [array, setArray] = useState([...initialArray]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparing, setComparing] = useState([-1, -1]);
  const [sorted, setSorted] = useState(false);

  const generateSteps = () => {
    const arr = [...initialArray];
    const allSteps = [];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        allSteps.push({
          array: [...arr],
          comparing: [j, j + 1],
          action: `${arr[j]} eta ${arr[j + 1]} konparatu`,
          swapped: arr[j] > arr[j + 1]
        });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          allSteps.push({
            array: [...arr],
            comparing: [j, j + 1],
            action: `Trukatu! ${arr[j + 1]} > ${arr[j]} zenez`,
            swapped: false
          });
        }
      }
    }
    allSteps.push({
      array: [...arr],
      comparing: [-1, -1],
      action: 'Ordenatuta dago!',
      swapped: false
    });
    return allSteps;
  };

  const startSort = () => {
    const allSteps = generateSteps();
    setSteps(allSteps);
    setCurrentStep(0);
    setArray(allSteps[0].array);
    setComparing(allSteps[0].comparing);
    setSorted(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setArray(steps[next].array);
      setComparing(steps[next].comparing);
      if (next === steps.length - 1) setSorted(true);
    }
  };

  const reset = () => {
    setArray([...initialArray]);
    setSteps([]);
    setCurrentStep(-1);
    setComparing([-1, -1]);
    setSorted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {array.map((val, idx) => (
          <div
            key={idx}
            className={`w-14 h-14 flex items-center justify-center rounded-xl font-bold text-lg transition-all duration-300 ${
              comparing[0] === idx || comparing[1] === idx
                ? 'bg-cyan-500 text-white scale-110 shadow-lg shadow-cyan-200'
                : sorted
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-slate-100 text-slate-700 border-2 border-slate-200'
            }`}
          >
            {val}
          </div>
        ))}
      </div>

      {currentStep >= 0 && currentStep < steps.length && (
        <div className="text-center">
          <div className="inline-block bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium border border-cyan-200">
            {steps[currentStep].action}
          </div>
          <p className="text-xs text-slate-400 mt-2">Pausoa {currentStep + 1} / {steps.length}</p>
        </div>
      )}

      <div className="flex justify-center gap-3">
        {currentStep === -1 ? (
          <button
            onClick={startSort}
            className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all flex items-center gap-2"
          >
            <Play size={16} /> Ordenatu
          </button>
        ) : (
          <>
            <button
              onClick={nextStep}
              disabled={sorted}
              className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowRight size={16} /> Hurrengo pausoa
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} /> Berrabiarazi
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Algoritmoak() {
  const [activeTab, setActiveTab] = useState('teoria');

  // Flowchart builder state
  const [flowSteps, setFlowSteps] = useState([
    { type: 'start', text: 'HASI' },
    { type: 'input', text: 'Sartu N zenbakia' },
    { type: 'decision', text: 'N % 2 == 0?' },
    { type: 'output', text: '"N bikoitia da"' },
    { type: 'output', text: '"N bakoitia da"' },
    { type: 'end', text: 'AMAITU' }
  ]);
  const [activeFlowStep, setActiveFlowStep] = useState(-1);
  const [flowInput, setFlowInput] = useState('');
  const [flowResult, setFlowResult] = useState('');

  // Quiz state
  const quizQuestions = [
    {
      question: 'Fluxu-diagrama batek honako urratsak ditu: HASI → Irakurri N → N > 0 bada, idatzi "Positiboa" → Bestela, idatzi "Negatiboa edo zero" → AMAITU. N = 5 bada, zer idatziko du?',
      options: ['Positiboa', 'Negatiboa edo zero', 'Ezer ez', '5'],
      correct: 0
    },
    {
      question: 'Algoritmoak begizta bat du: i = 1, i <= 3 den bitartean, idatzi i, i = i + 1. Zer idatziko du?',
      options: ['1', '1, 2, 3', '1, 2, 3, 4', '3'],
      correct: 1
    },
    {
      question: 'Zer da algoritmo baten "baldintza" bat?',
      options: [
        'Agindu bat behin eta berriro exekutatzen dena',
        'Erabaki bat hartzen duena bai/ez oinarrian',
        'Datuak sartzeko urrats bat',
        'Algoritmoa amaitzeko agindua'
      ],
      correct: 1
    },
    {
      question: 'Bubble Sort algoritmoak zerrenda bat ordenatzeko, zenbat konparazio egiten ditu gutxienez 5 elementuko zerrenda baterako kasu txarrenean?',
      options: ['5', '10', '20', '25'],
      correct: 1
    },
    {
      question: 'Algoritmo batek honako pausoak ditu: HASI → f = 1 → i = 1tik 4ra → f = f * i → Idatzi f → AMAITU. Zer da emaitza?',
      options: ['4', '10', '24', '120'],
      correct: 2
    },
    {
      question: 'Zerrenda batean [7, 2, 9, 4, 1] maximoa aurkitzeko, zenbat konparazio behar dira?',
      options: ['3', '4', '5', '9'],
      correct: 1
    }
  ];

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const { score: quizScore, total: quizTotal, addCorrect, addIncorrect, reset: resetProgress } = useProgress('algoritmoak');
  const [quizFinished, setQuizFinished] = useState(false);

  const checkQuiz = (idx) => {
    setQuizSelected(idx);
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizFeedback('correct');
      addCorrect();
    } else {
      setQuizFeedback('incorrect');
      addIncorrect();
    }
  };

  const nextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(i => i + 1);
      setQuizSelected(null);
      setQuizFeedback('');
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizFeedback('');
    resetProgress();
    setQuizFinished(false);
  };

  // Flowchart simulation
  const runFlowchart = () => {
    const n = parseInt(flowInput);
    if (isNaN(n)) {
      setFlowResult('Mesedez, sartu zenbaki oso bat.');
      return;
    }
    setActiveFlowStep(0);
    const delays = [500, 1000, 1500, 2000, 2500];
    setTimeout(() => setActiveFlowStep(1), delays[0]);
    setTimeout(() => setActiveFlowStep(2), delays[1]);
    setTimeout(() => {
      if (n % 2 === 0) {
        setActiveFlowStep(3);
        setTimeout(() => {
          setFlowResult(`${n} bikoitia da`);
          setActiveFlowStep(5);
        }, delays[1]);
      } else {
        setActiveFlowStep(4);
        setTimeout(() => {
          setFlowResult(`${n} bakoitia da`);
          setActiveFlowStep(5);
        }, delays[1]);
      }
    }, delays[2]);
  };

  // Factorial steps
  const factorialSteps = [
    { step: 'HASI: Kalkulatu 5!', f: '-', i: '-' },
    { step: 'f = 1, i = 1', f: '1', i: '1' },
    { step: 'f = f * i = 1 * 1 = 1', f: '1', i: '1' },
    { step: 'i = 2', f: '1', i: '2' },
    { step: 'f = f * i = 1 * 2 = 2', f: '2', i: '2' },
    { step: 'i = 3', f: '2', i: '3' },
    { step: 'f = f * i = 2 * 3 = 6', f: '6', i: '3' },
    { step: 'i = 4', f: '6', i: '4' },
    { step: 'f = f * i = 6 * 4 = 24', f: '24', i: '4' },
    { step: 'i = 5', f: '24', i: '5' },
    { step: 'f = f * i = 24 * 5 = 120', f: '120', i: '5' },
    { step: 'EMAITZA: 5! = 120', f: '120', i: '-' }
  ];

  // Max finding steps
  const maxSteps = [
    { step: 'Zerrenda: [7, 2, 9, 4, 1]', max: '-', compared: '-' },
    { step: 'max = 7 (lehena)', max: '7', compared: '7' },
    { step: '2 < 7 → max ez da aldatzen', max: '7', compared: '2' },
    { step: '9 > 7 → max = 9', max: '9', compared: '9' },
    { step: '4 < 9 → max ez da aldatzen', max: '9', compared: '4' },
    { step: '1 < 9 → max ez da aldatzen', max: '9', compared: '1' },
    { step: 'EMAITZA: Maximoa = 9', max: '9', compared: '-' }
  ];

  const [factStep, setFactStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);

  const tabs = [
    { key: 'teoria', label: 'Teoria' },
    { key: 'laborategia', label: 'Laborategia' },
    { key: 'pausoak', label: 'Pausoak' },
    { key: 'praktika', label: 'Praktika' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-100 selection:text-cyan-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('teoria')} className={`hover:text-cyan-600 transition-colors ${activeTab === 'teoria' ? 'text-cyan-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('laborategia')} className={`hover:text-cyan-600 transition-colors ${activeTab === 'laborategia' ? 'text-cyan-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('pausoak')} className={`hover:text-cyan-600 transition-colors ${activeTab === 'pausoak' ? 'text-cyan-600' : ''}`}>Pausoak</button>
            <button onClick={() => setActiveTab('praktika')} className={`px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">Algoritmoak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ikasi pentsamendu algoritmikoa: problemak urratsez urrats ebazten. Sekuentziak, baldintzak eta begiztak ulertu, eta zure algoritmoak sortu.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.key ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: TEORIA ==================== */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* What is an algorithm */}
            <Section title="Zer da algoritmo bat?" icon={BookOpen} className="border-cyan-200 ring-4 ring-cyan-50/30">
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500"></div>
                  <h3 className="text-2xl font-extrabold mb-4">Algoritmo bat urrats finitu eta zehatzen segida bat da, problema bat ebazteko edo zeregin bat burutzeko.</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Algoritmoek hiru ezaugarri nagusi dituzte: sarrera bat (edo batzuk) jasotzen dute, urrats zehatzak jarraitzen dituzte, eta irteera bat (emaitza) ematen dute. Ordenagailuek algoritmoak jarraitzen dituzte, baina eguneroko bizitzan ere algoritmoek gidatzen gaituzte.
                  </p>
                </div>

                {/* Everyday examples */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
                    <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-3">
                      <Zap size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Sukaldeko errezeta</h3>
                    <p className="text-sm text-slate-600 mb-3">Tortilla bat egiteko algoritmoa:</p>
                    <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                      <li>Patatak zuritu eta txikitu</li>
                      <li>Patatak olioan frijitu</li>
                      <li>Arrautzak irabiatu</li>
                      <li>Patatak eta arrautzak nahastu</li>
                      <li>Zartagina berotu eta nahastea bota</li>
                      <li>Buelta eman eta bukatu</li>
                    </ol>
                  </div>
                  <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                    <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                      <GitBranch size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Norabideak emateko</h3>
                    <p className="text-sm text-slate-600 mb-3">Eskolatik etxera joateko algoritmoa:</p>
                    <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                      <li>Eskolatik irten atetik</li>
                      <li>Eskuinera biratu</li>
                      <li>200 metro ibili zuzen</li>
                      <li>Semaforo berdea bada, bidegurutzea zeharkatu</li>
                      <li>Ezkerrera biratu</li>
                      <li>3. portala da zure etxea</li>
                    </ol>
                  </div>
                </div>
              </div>
            </Section>

            {/* Sequences */}
            <Section title="Sekuentzia (Urrats-segida)" icon={ListOrdered}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Sekuentzia</strong> bat agindu-zerrenda ordenatu bat da, bata bestearen atzetik exekutatzen dena. Algoritmoen oinarririk sinpleena da: pausoak orden jakin batean jarraitzea.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-xl font-mono text-sm leading-loose">
                  <p className="text-cyan-400">// Bi zenbakiren batuketa kalkulatu</p>
                  <p><span className="text-pink-400">HASI</span></p>
                  <p>&nbsp;&nbsp;<span className="text-green-400">IRAKURRI</span> A</p>
                  <p>&nbsp;&nbsp;<span className="text-green-400">IRAKURRI</span> B</p>
                  <p>&nbsp;&nbsp;C = A + B</p>
                  <p>&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> C</p>
                  <p><span className="text-pink-400">AMAITU</span></p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200 text-sm text-cyan-800">
                  <strong>Kontuan izan:</strong> Agindu bakoitza behin exekutatzen da, eta ordena garrantzitsua da. Ezin duzu C kalkulatu A eta B irakurri baino lehen!
                </div>
              </div>
            </Section>

            {/* Conditions */}
            <Section title="Baldintzak (If / Else)" icon={GitBranch}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Baldintzak</strong> erabakiak hartzeko aukera ematen dute. Baldintza bat <em>egia</em> ala <em>gezurra</em> den arabera, bide bat edo bestea jarraitzen da.
                </p>
                <div className="bg-slate-900 text-white p-6 rounded-xl font-mono text-sm leading-loose">
                  <p className="text-cyan-400">// Zenbaki bat positiboa, negatiboa ala zero den egiaztatu</p>
                  <p><span className="text-pink-400">HASI</span></p>
                  <p>&nbsp;&nbsp;<span className="text-green-400">IRAKURRI</span> N</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">BALDIN</span> N &gt; 0 <span className="text-purple-400">ORDUAN</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> &quot;Positiboa da&quot;</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">BESTELA BALDIN</span> N &lt; 0 <span className="text-purple-400">ORDUAN</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> &quot;Negatiboa da&quot;</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">BESTELA</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> &quot;Zero da&quot;</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BALDIN</span></p>
                  <p><span className="text-pink-400">AMAITU</span></p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">N = 5</p>
                    <p className="text-green-700 font-bold">&quot;Positiboa da&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">N = -3</p>
                    <p className="text-red-700 font-bold">&quot;Negatiboa da&quot;</p>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">N = 0</p>
                    <p className="text-slate-700 font-bold">&quot;Zero da&quot;</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Loops */}
            <Section title="Begiztak (Loops)" icon={RefreshCw}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Begiztak</strong> agindu-multzo bat behin eta berriro errepikatzeko erabiltzen dira, baldintza bat betetzen den bitartean. Bi mota nagusi daude:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <RefreshCw size={16} className="text-cyan-600" /> &quot;BITARTEAN&quot; begizta (While)
                    </h4>
                    <div className="bg-slate-900 text-white p-5 rounded-xl font-mono text-sm leading-loose">
                      <p className="text-cyan-400">// 1etik 5era idatzi</p>
                      <p><span className="text-pink-400">HASI</span></p>
                      <p>&nbsp;&nbsp;i = 1</p>
                      <p>&nbsp;&nbsp;<span className="text-purple-400">BITARTEAN</span> i &lt;= 5</p>
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> i</p>
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;i = i + 1</p>
                      <p>&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BITARTEAN</span></p>
                      <p><span className="text-pink-400">AMAITU</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <ListOrdered size={16} className="text-cyan-600" /> &quot;-RAKO&quot; begizta (For)
                    </h4>
                    <div className="bg-slate-900 text-white p-5 rounded-xl font-mono text-sm leading-loose">
                      <p className="text-cyan-400">// Zenbakien batuketa 1etik 10era</p>
                      <p><span className="text-pink-400">HASI</span></p>
                      <p>&nbsp;&nbsp;batuketa = 0</p>
                      <p>&nbsp;&nbsp;<span className="text-purple-400">i = 1-ETIK 10-ERA</span></p>
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;batuketa = batuketa + i</p>
                      <p>&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BEGIZTA</span></p>
                      <p>&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> batuketa</p>
                      <p><span className="text-pink-400">AMAITU</span></p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-800">
                  <strong>Kontuz!</strong> Begizta infinitua sor daiteke baldintza inoiz betetzen ez bada. Adibidez, <code className="bg-amber-100 px-1 rounded">i = i + 1</code> ahazten baduzu, begizta ez da inoiz amaituko!
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== TAB 2: LABORATEGIA ==================== */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Fluxu-diagrama interaktiboa" icon={GitBranch} className="border-cyan-200 ring-4 ring-cyan-50/30">
              <div className="space-y-6">
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200 text-sm text-cyan-800">
                  <strong>Ariketa:</strong> Zenbaki bat bikoitia ala bakoitia den egiaztatu. Sartu zenbaki bat eta jarraitu fluxu-diagrama urrats bakoitza animatuta.
                </div>

                {/* Flowchart visual */}
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 flex flex-col items-center">
                  <FlowBlock type="start" text={flowSteps[0].text} highlight={activeFlowStep === 0} />
                  <FlowArrow />
                  <FlowBlock type="input" text={flowSteps[1].text} highlight={activeFlowStep === 1} />
                  <FlowArrow />
                  <FlowBlock type="decision" text={flowSteps[2].text} highlight={activeFlowStep === 2} />

                  {/* Decision branches */}
                  <div className="flex gap-12 mt-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-green-600 mb-1">BAI</span>
                      <ArrowDown size={16} className="text-green-500" />
                      <div className="mt-1">
                        <FlowBlock type="output" text={flowSteps[3].text} highlight={activeFlowStep === 3} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-red-600 mb-1">EZ</span>
                      <ArrowDown size={16} className="text-red-500" />
                      <div className="mt-1">
                        <FlowBlock type="output" text={flowSteps[4].text} highlight={activeFlowStep === 4} />
                      </div>
                    </div>
                  </div>

                  <FlowArrow />
                  <FlowBlock type="end" text={flowSteps[5].text} highlight={activeFlowStep === 5} />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-600 rounded-full"></div>
                    <span className="text-slate-600">Hasi / Amaitu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                    <span className="text-slate-600">Sarrera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                    <span className="text-slate-600">Prozesua</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
                    <span className="text-slate-600">Erabakia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
                    <span className="text-slate-600">Irteera</span>
                  </div>
                </div>

                {/* Input and run */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">Probatu algoritmoa</h4>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div>
                      <label className="text-sm text-slate-600 font-medium block mb-1">Sartu zenbaki bat (N):</label>
                      <input
                        type="number"
                        value={flowInput}
                        onChange={(e) => setFlowInput(e.target.value)}
                        placeholder="Adib: 7"
                        className="w-32 p-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none font-mono font-bold text-center"
                      />
                    </div>
                    <button
                      onClick={runFlowchart}
                      className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all flex items-center gap-2"
                    >
                      <Play size={16} /> Exekutatu
                    </button>
                    <button
                      onClick={() => { setActiveFlowStep(-1); setFlowResult(''); setFlowInput(''); }}
                      className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
                    >
                      <RotateCcw size={16} /> Garbitu
                    </button>
                  </div>

                  {flowResult && (
                    <div className="mt-4 p-4 bg-cyan-100 text-cyan-800 rounded-xl font-bold text-center text-lg border border-cyan-200 animate-in fade-in duration-500">
                      Emaitza: {flowResult}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* Flowchart building blocks explanation */}
            <Section title="Fluxu-diagramaren elementuak" icon={Zap}>
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Fluxu-diagrama bat algoritmo baten adierazpen grafikoa da. Forma geometriko desberdinak erabiltzen dira urrats motak bereizteko:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold shrink-0">HASI/AMAITU</div>
                      <p className="text-sm text-slate-600">Obalatua: algoritmoa non hasten eta amaitzen den adierazten du.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="bg-green-100 text-green-800 border-2 border-green-300 px-4 py-2 rounded-lg text-sm font-bold shrink-0" style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>Sarrera</div>
                      <p className="text-sm text-slate-600">Paralelogramoa: datuak sartzeko edo irakurtzeko.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="bg-blue-100 text-blue-800 border-2 border-blue-300 px-4 py-2 rounded-lg text-sm font-bold shrink-0">Prozesua</div>
                      <p className="text-sm text-slate-600">Laukizuzena: kalkulu bat edo ekintza bat egiteko.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="bg-amber-100 text-amber-800 border-2 border-amber-300 px-4 py-2 rounded-lg text-sm font-bold shrink-0">
                        <Diamond size={12} className="inline mr-1" />Erabakia
                      </div>
                      <p className="text-sm text-slate-600">Erronboa: galdera bat, BAI/EZ erantzunarekin bide desberdinak.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="bg-purple-100 text-purple-800 border-2 border-purple-300 px-4 py-2 rounded-lg text-sm font-bold shrink-0">Irteera</div>
                      <p className="text-sm text-slate-600">Emaitza pantailan idazteko edo inprimatzeko.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                      <div className="flex flex-col items-center shrink-0">
                        <ArrowDown size={24} className="text-slate-500" />
                      </div>
                      <p className="text-sm text-slate-600">Geziak: urratsen arteko fluxua adierazten dute, norabidea erakutsiz.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== TAB 3: PAUSOAK ==================== */}
        {activeTab === 'pausoak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Bubble Sort */}
            <Section title="Burbuila Ordenamendua (Bubble Sort)" icon={ListOrdered} className="border-cyan-200 ring-4 ring-cyan-50/30">
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  Bubble Sort algoritmoak zerrenda bat ordenatzen du elementu ondokoak konparatuz eta trukatuz, elementu handiena burbuila bezala gorantz mugitzen delarik. Pausoz pauso ikusi:
                </p>
                <div className="bg-slate-900 text-white p-5 rounded-xl font-mono text-sm leading-loose mb-4">
                  <p className="text-cyan-400">// Burbuila Ordenamendua</p>
                  <p><span className="text-pink-400">HASI</span></p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">i = 0-TIK</span> n-2-<span className="text-purple-400">RA</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">j = 0-TIK</span> n-i-2-<span className="text-purple-400">RA</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">BALDIN</span> zerrenda[j] &gt; zerrenda[j+1] <span className="text-purple-400">ORDUAN</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trukatu zerrenda[j] eta zerrenda[j+1]</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BALDIN</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BEGIZTA</span></p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BEGIZTA</span></p>
                  <p><span className="text-pink-400">AMAITU</span></p>
                </div>

                <BubbleSortVisualizer />
              </div>
            </Section>

            {/* Find Maximum */}
            <Section title="Maximoa aurkitu zerrenda batean" icon={Zap}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  Zerrenda batean zenbaki handiena aurkitzeko, elementu bakoitza orain arteko maximoarekin konparatzen dugu:
                </p>
                <div className="bg-slate-900 text-white p-5 rounded-xl font-mono text-sm leading-loose mb-4">
                  <p className="text-cyan-400">// Maximoa aurkitu</p>
                  <p><span className="text-pink-400">HASI</span></p>
                  <p>&nbsp;&nbsp;max = zerrenda[0]</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">i = 1-ETIK</span> n-1-<span className="text-purple-400">ERA</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">BALDIN</span> zerrenda[i] &gt; max <span className="text-purple-400">ORDUAN</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max = zerrenda[i]</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BALDIN</span></p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BEGIZTA</span></p>
                  <p>&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> max</p>
                  <p><span className="text-pink-400">AMAITU</span></p>
                </div>

                {/* Step-by-step table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-cyan-50">
                        <th className="p-3 text-left font-bold text-cyan-800 border border-cyan-200">#</th>
                        <th className="p-3 text-left font-bold text-cyan-800 border border-cyan-200">Urratsa</th>
                        <th className="p-3 text-center font-bold text-cyan-800 border border-cyan-200">max</th>
                        <th className="p-3 text-center font-bold text-cyan-800 border border-cyan-200">Konparatuta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maxSteps.slice(0, maxStep + 1).map((s, idx) => (
                        <tr key={idx} className={idx === maxStep ? 'bg-cyan-50' : 'bg-white'}>
                          <td className="p-3 border border-slate-200 text-slate-500 font-mono">{idx}</td>
                          <td className="p-3 border border-slate-200 text-slate-700">{s.step}</td>
                          <td className="p-3 border border-slate-200 text-center font-bold font-mono text-cyan-700">{s.max}</td>
                          <td className="p-3 border border-slate-200 text-center font-mono text-slate-600">{s.compared}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setMaxStep(s => Math.min(s + 1, maxSteps.length - 1))}
                    disabled={maxStep >= maxSteps.length - 1}
                    className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ArrowRight size={16} /> Hurrengo pausoa
                  </button>
                  <button
                    onClick={() => setMaxStep(0)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={16} /> Berrabiarazi
                  </button>
                </div>
              </div>
            </Section>

            {/* Factorial */}
            <Section title="Faktoriala kalkulatu (n!)" icon={RefreshCw}>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>n!</strong> (n faktoriala) = 1 x 2 x 3 x ... x n. Begizta bat erabiliz kalkulatzen da:
                </p>
                <div className="bg-slate-900 text-white p-5 rounded-xl font-mono text-sm leading-loose mb-4">
                  <p className="text-cyan-400">// Faktoriala kalkulatu</p>
                  <p><span className="text-pink-400">HASI</span></p>
                  <p>&nbsp;&nbsp;<span className="text-green-400">IRAKURRI</span> N</p>
                  <p>&nbsp;&nbsp;f = 1</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">i = 1-ETIK</span> N-<span className="text-purple-400">ERA</span></p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;f = f * i</p>
                  <p>&nbsp;&nbsp;<span className="text-purple-400">AMAIERA_BEGIZTA</span></p>
                  <p>&nbsp;&nbsp;<span className="text-yellow-400">IDATZI</span> f</p>
                  <p><span className="text-pink-400">AMAITU</span></p>
                </div>

                {/* Step table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-cyan-50">
                        <th className="p-3 text-left font-bold text-cyan-800 border border-cyan-200">#</th>
                        <th className="p-3 text-left font-bold text-cyan-800 border border-cyan-200">Urratsa</th>
                        <th className="p-3 text-center font-bold text-cyan-800 border border-cyan-200">f</th>
                        <th className="p-3 text-center font-bold text-cyan-800 border border-cyan-200">i</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factorialSteps.slice(0, factStep + 1).map((s, idx) => (
                        <tr key={idx} className={idx === factStep ? 'bg-cyan-50' : 'bg-white'}>
                          <td className="p-3 border border-slate-200 text-slate-500 font-mono">{idx}</td>
                          <td className="p-3 border border-slate-200 text-slate-700">{s.step}</td>
                          <td className="p-3 border border-slate-200 text-center font-bold font-mono text-cyan-700">{s.f}</td>
                          <td className="p-3 border border-slate-200 text-center font-mono text-slate-600">{s.i}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setFactStep(s => Math.min(s + 1, factorialSteps.length - 1))}
                    disabled={factStep >= factorialSteps.length - 1}
                    className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ArrowRight size={16} /> Hurrengo pausoa
                  </button>
                  <button
                    onClick={() => setFactStep(0)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={16} /> Berrabiarazi
                  </button>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* ==================== TAB 4: PRAKTIKA ==================== */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Algoritmoen Galdetegia" icon={BookOpen} className="border-cyan-200 ring-4 ring-cyan-50/30">
              <div className="space-y-6">

                {!quizFinished ? (
                  <>
                    {/* Progress bar */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-500 font-medium">
                        Galdera {quizIndex + 1} / {quizQuestions.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm font-bold text-slate-700">Puntuazioa: {quizScore}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Question */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                      <p className="text-lg font-bold text-slate-800 leading-relaxed pl-4">
                        {quizQuestions[quizIndex].question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="grid gap-3">
                      {quizQuestions[quizIndex].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => quizSelected === null && checkQuiz(idx)}
                          disabled={quizSelected !== null}
                          className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                            quizSelected === null
                              ? 'border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 cursor-pointer'
                              : idx === quizQuestions[quizIndex].correct
                              ? 'border-green-400 bg-green-50 text-green-800'
                              : idx === quizSelected
                              ? 'border-red-400 bg-red-50 text-red-800'
                              : 'border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                              quizSelected === null
                                ? 'bg-slate-100 text-slate-600'
                                : idx === quizQuestions[quizIndex].correct
                                ? 'bg-green-200 text-green-700'
                                : idx === quizSelected
                                ? 'bg-red-200 text-red-700'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                            {quizSelected !== null && idx === quizQuestions[quizIndex].correct && (
                              <Check size={18} className="ml-auto text-green-600" />
                            )}
                            {quizSelected !== null && idx === quizSelected && idx !== quizQuestions[quizIndex].correct && (
                              <X size={18} className="ml-auto text-red-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Feedback */}
                    {quizFeedback && (
                      <div className={`p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg animate-in fade-in duration-300 ${
                        quizFeedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {quizFeedback === 'correct' ? <Check size={20} /> : <X size={20} />}
                        <span>{quizFeedback === 'correct' ? 'Zuzen! Bikain!' : 'Oker. Erantzun zuzena berdez markatuta dago.'}</span>
                      </div>
                    )}

                    {/* Next button */}
                    {quizSelected !== null && (
                      <div className="flex justify-center">
                        <button
                          onClick={nextQuiz}
                          className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          {quizIndex < quizQuestions.length - 1 ? (
                            <><ArrowRight size={18} /> Hurrengo galdera</>
                          ) : (
                            <><Check size={18} /> Emaitzak ikusi</>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Quiz results */
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl font-extrabold">{quizScore}/{quizQuestions.length}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-800">
                      {quizScore === quizQuestions.length
                        ? 'Perfektua! Zorionak!'
                        : quizScore >= quizQuestions.length * 0.7
                        ? 'Oso ondo! Ia perfektua!'
                        : quizScore >= quizQuestions.length * 0.5
                        ? 'Ondo! Baina hobetu dezakezu.'
                        : 'Saiatu berriro, praktikarekin hobetuko duzu!'}
                    </h3>
                    <p className="text-slate-600">
                      {quizQuestions.length} galderatik {quizScore} zuzen erantzun dituzu.
                    </p>

                    <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
                      {quizQuestions.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                            idx < quizScore
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={resetQuiz}
                      className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-500 transition-all flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw size={18} /> Berriro saiatu
                    </button>
                  </div>
                )}

              </div>
            </Section>

          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-600">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
