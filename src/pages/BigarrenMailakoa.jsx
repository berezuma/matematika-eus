import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Check, 
  RefreshCw, 
  BookOpen, 
  Calculator, 
  Brain, 
  ArrowRight, 
  AlertTriangle,
  Split,
  Variable,
  Trophy,
  Landmark,
  Zap,
  History
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Interactive Graph Component ---

const QuadraticGraph = ({ a, b, c }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear and set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid parameters
    const scale = 30; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw Function: y = ax^2 + bx + c
    const f = (x) => a * x * x + b * x + c;

    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      const y = f(x);
      const py = centerY - (y * scale);

      if (py < -height || py > height * 2) {
          firstPoint = true;
          continue;
      }

      if (firstPoint) {
        ctx.moveTo(px, py);
        firstPoint = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Roots
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0 && a !== 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        [x1, x2].forEach(root => {
            const px = centerX + root * scale;
            const py = centerY; 
            if (px >= 0 && px <= width) {
                ctx.fillStyle = '#ef4444'; 
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
  }, [a, b, c]);

  return (
    <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto rounded-lg border border-slate-200 bg-white"/>
  );
};

// --- Main App Component ---

export default function BigarrenMailakoa() {
  useDocumentTitle('Bigarren Mailako Ekuazioak');
  const [activeTab, setActiveTab] = useState('concept');
  const [graphParams, setGraphParams] = useState({ a: 1, b: -2, c: -3 });
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInputs, setUserInputs] = useState({ x1: '', x2: '' });
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const r = () => Math.floor(Math.random() * 12) - 6; 
    let r1 = r();
    let r2 = r();
    if (r1 === 0) r1 = 1;
    const a = Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : -1) : 1; 

    const prob = {
        a: a,
        b: -a * (r1 + r2),
        c: a * (r1 * r2),
        r1: r1,
        r2: r2
    };

    setPracticeProblem(prob);
    setUserInputs({ x1: '', x2: '' });
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const u1 = parseFloat(userInputs.x1);
    const u2 = parseFloat(userInputs.x2);
    const { r1, r2 } = practiceProblem;

    if (isNaN(u1) || isNaN(u2)) {
        setFeedback('invalid');
        return;
    }
    const correct = (u1 === r1 && u2 === r2) || (u1 === r2 && u2 === r1);
    setFeedback(correct ? 'correct' : 'incorrect');
  };

  const getDiscriminant = () => {
      return graphParams.b * graphParams.b - 4 * graphParams.a * graphParams.c;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-indigo-600 transition-colors ${activeTab === 'concept' ? 'text-indigo-600' : ''}`}>Teoria eta Testuingurua</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-indigo-600 transition-colors ${activeTab === 'viz' ? 'text-indigo-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('formula')} className={`hover:text-indigo-600 transition-colors ${activeTab === 'formula' ? 'text-indigo-600' : ''}`}>Formula</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Bigarren Mailako <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ekuazioak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ez dira letrak eta zenbakiak bakarrik: grabitatearen, arkitekturaren eta mugimenduaren hizkuntza da.
          </p>
        </div>

        {/* Content Switcher (Mobile) */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'formula', 'practice'].map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'formula' ? 'Formula' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: CONCEPTS & CONTEXT --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* 1.0 ZERTARAKO BALIO DU? (New Section) */}
            <Section title="Zertarako balio du honek?" icon={Zap} className="border-indigo-200 ring-4 ring-indigo-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <Trophy size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Kirola eta Grabitatea</h3>
                     <p className="text-sm text-slate-600">
                        Curry-k hirukoa jaurtitzen duenean edo Messik falta bat botatzen duenean, baloiak egiten duen marrazkia <strong>parabola</strong> bat da. Entrenatzaileek formula hauek erabiltzen dituzte ibilbideak aztertzeko.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Landmark size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Arkitektura eta Zubiak</h3>
                     <p className="text-sm text-slate-600">
                        Zubi esekiek (Golden Gate, adibidez) kable kurbatuak dituzte pisu guztia eusteko. Kurbadura hori zehaztasun milimetrikoz kalkulatzeko ekuazio koadratikoak ezinbestekoak dira.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <History size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">4.000 urteko misterioa</h3>
                     <p className="text-sm text-slate-600">
                        Ez da gauza berria. Babiloniarrek (K.a. 2000 urte) dagoeneko erabiltzen zituzten lur sailen azalerak kalkulatzeko. Baina "Aljebra" hitza Al-Khwarizmi matematikari arabiarrak asmatu zuen IX. mendean.
                     </p>
                  </div>
               </div>
            </Section>

            {/* 1.1 Zer da? */}
            <Section title="Ekuazioaren Anatomia" icon={BookOpen}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="bg-slate-900 text-white p-8 rounded-2xl font-mono text-center text-3xl md:text-4xl shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                    
                    <span className="relative inline-block cursor-help group/item" title="Termino koadratikoa">
                      <span className="text-pink-400 font-bold">a</span>x<sup className="text-purple-400">2</sup>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Gai Koadratikoa</span>
                    </span>
                    
                    <span className="mx-2 text-slate-500">+</span>
                    
                    <span className="relative inline-block cursor-help group/item" title="Termino lineala">
                      <span className="text-blue-400 font-bold">b</span>x
                       <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Gai Lineala</span>
                    </span>
                    
                    <span className="mx-2 text-slate-500">+</span>
                    
                    <span className="relative inline-block cursor-help group/item" title="Termino askea">
                      <span className="text-emerald-400 font-bold">c</span>
                       <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Gai Askea</span>
                    </span>

                    <span className="mx-2 text-slate-500">=</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                    <AlertTriangle className="shrink-0" size={20} />
                    <p><strong>Kontuz:</strong> Ekuazioa 2. mailakoa izateko, <strong>"a" ezin da 0 izan</strong>. Bestela, $bx + c = 0$ izango litzateke, lerro zuzen bat (1. mailakoa).</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* 1.2 Sailkapena */}
            <Section title="Nola ebatzi? (Estrategia)" icon={Split}>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Osatugabeak (b=0) */}
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-800">Osatugabea (b=0)</h3>
                     <span className="text-xs bg-slate-200 px-2 py-1 rounded font-mono">ax² + c = 0</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Ez duzu formula orokorra behar! "x" bakartu besterik ez.</p>
                  <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm space-y-2">
                    <p>2x² - 8 = 0</p>
                    <p className="text-slate-500">→ 2x² = 8</p>
                    <p className="text-slate-500">→ x² = 4</p>
                    <p className="text-indigo-600 font-bold">→ x = ±2</p>
                  </div>
                </div>

                {/* Osatugabeak (c=0) */}
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-800">Osatugabea (c=0)</h3>
                     <span className="text-xs bg-slate-200 px-2 py-1 rounded font-mono">ax² + bx = 0</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Atera faktore komuna 'x'. Beti soluzio bat 0 da.</p>
                  <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm space-y-2">
                    <p>x² - 5x = 0</p>
                    <p className="text-slate-500">→ x · (x - 5) = 0</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-indigo-600 font-bold">x = 0</p>
                      <span className="text-slate-400">edo</span>
                      <p className="text-indigo-600 font-bold">x = 5</p>
                    </div>
                  </div>
                </div>

                {/* Osatua */}
                <div className="md:col-span-2 p-6 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-indigo-900">Ekuazio Osatua</h3>
                     <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-mono">ax² + bx + c = 0</span>
                  </div>
                  <p className="text-sm text-indigo-800 mb-4">Gai guztiak dituenean, <strong>Formula Orokorra</strong> da zure lagunik onena.</p>
                  <div className="flex justify-center">
                    <button onClick={() => setActiveTab('formula')} className="flex items-center gap-2 text-sm font-bold bg-white text-indigo-600 px-4 py-2 rounded-full border border-indigo-200 hover:shadow-md transition-all">
                      Ikusi Formula <ArrowRight size={16}/>
                    </button>
                  </div>
                </div>

              </div>
            </Section>

            {/* 1.3 Diskriminatzailea */}
            <Section title="Diskriminatzailea: Etorkizuna iragartzen" icon={Variable}>
               <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                     <p className="text-slate-600 mb-4">Formula osoa egin baino lehen, erro barruko zatia begiratzen baduzu, jakingo duzu zer gertatuko den. Zati horri <strong>Diskriminatzailea (Δ)</strong> deitzen diogu.</p>
                     <div className="bg-slate-100 p-4 rounded-lg font-mono text-center text-lg mb-4">
                        Δ = b² - 4ac
                     </div>
                  </div>
                  <div className="flex-1 space-y-3">
                     <div className="flex items-center gap-4 p-3 rounded-lg border border-green-200 bg-green-50">
                        <div className="font-bold text-green-700 w-16">Δ &gt; 0</div>
                        <div className="text-sm text-green-800">Positiboa bada → Parabolak X ardatza <strong>birritan</strong> mozten du. (2 soluzio).</div>
                     </div>
                     <div className="flex items-center gap-4 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                        <div className="font-bold text-yellow-700 w-16">Δ = 0</div>
                        <div className="text-sm text-yellow-800">Zero bada → Parabolaren erpina X ardatzean dago. <strong>Soluzio bakarra</strong>.</div>
                     </div>
                     <div className="flex items-center gap-4 p-3 rounded-lg border border-red-200 bg-red-50">
                        <div className="font-bold text-red-700 w-16">Δ &lt; 0</div>
                        <div className="text-sm text-red-800">Negatiboa bada → Parabola "airean" dago. <strong>Ez du soluziorik</strong> zenbaki errealetan.</div>
                     </div>
                  </div>
               </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: VISUALIZATION --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Laborategi Grafikoa" icon={LineChart}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center p-2">
                  <QuadraticGraph {...graphParams} />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Funtzioa</p>
                    <p className="font-mono text-lg text-indigo-900 font-bold">
                       y = {graphParams.a === 1 ? '' : graphParams.a === -1 ? '-' : graphParams.a}x² 
                       {graphParams.b >= 0 ? ' + ' : ' - '}{Math.abs(graphParams.b)}x 
                       {graphParams.c >= 0 ? ' + ' : ' - '}{Math.abs(graphParams.c)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Kurbadura (a)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 rounded font-bold text-pink-600">{graphParams.a}</span>
                      </div>
                      <input 
                        type="range" min="-5" max="5" step="0.5" 
                        value={graphParams.a}
                        onChange={(e) => setGraphParams({...graphParams, a: parseFloat(e.target.value) || 0.1})} 
                        className="w-full accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Desplazamendua (b)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 rounded font-bold text-blue-600">{graphParams.b}</span>
                      </div>
                      <input 
                        type="range" min="-10" max="10" step="1"
                        value={graphParams.b}
                        onChange={(e) => setGraphParams({...graphParams, b: parseFloat(e.target.value)})}
                        className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Altuera (c)</label>
                        <span className="text-xs font-mono bg-slate-100 px-2 rounded font-bold text-emerald-600">{graphParams.c}</span>
                      </div>
                      <input 
                        type="range" min="-10" max="10" step="1"
                        value={graphParams.c}
                        onChange={(e) => setGraphParams({...graphParams, c: parseFloat(e.target.value)})}
                        className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                          <div className="text-xs text-red-500 uppercase font-bold mb-1">Diskriminatzailea</div>
                          <div className="font-mono font-bold text-red-700 text-lg">
                              Δ = {getDiscriminant().toFixed(1).replace('.', ',')}
                          </div>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center flex flex-col items-center justify-center">
                          <div className="text-xs text-emerald-500 uppercase font-bold mb-1">Erroak (X)</div>
                          <div className="flex gap-2 justify-center">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <span className="text-xs text-emerald-700">Puntu gorriak</span>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 3: FORMULA --- */}
        {activeTab === 'formula' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Formula Orokorra" icon={Calculator}>
              <div className="space-y-8">
                
                <div className="bg-slate-900 text-white p-8 rounded-2xl flex flex-col items-center justify-center shadow-2xl">
                    <p className="text-slate-400 text-sm mb-4 font-bold tracking-widest uppercase">Ekuazioak Ebazteko Makina</p>
                    <div className="text-3xl md:text-5xl font-mono flex items-center gap-4 flex-wrap justify-center">
                        <span className="opacity-50">x =</span>
                        <div className="flex flex-col items-center">
                            <div className="border-b-2 border-white px-2 pb-1 mb-1">
                                <span className="text-blue-400">-b</span> 
                                <span className="mx-2">±</span> 
                                <span className="inline-flex items-center">
                                    <span className="text-2xl mr-1">√</span>
                                    <span className="border-t border-white pt-1">
                                        <span className="text-blue-400">b</span>² - 4<span className="text-pink-400">a</span><span className="text-emerald-400">c</span>
                                    </span>
                                </span>
                            </div>
                            <div className="text-pink-400">2a</div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs">1</div>
                            Zergatik ± ikurra?
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Parabolak simetrikoak direnez, askotan "erditik" distantzia berera dauden bi puntu mozten dituzte. Formula bitan banatzen da amaieran:
                        </p>
                        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Gehiketa (+)</span>
                                <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">x₁ = ... + ...</span>
                            </div>
                            <div className="h-px bg-slate-100"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Kenketa (-)</span>
                                <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">x₂ = ... - ...</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs">2</div>
                            Ohiko Akatsak
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex gap-2">
                             <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                             <span><strong>Zeinuak:</strong> 'b' negatiboa bada, '-b' positiboa bihurtzen da. Adib: b=-3 bada, -b=3.</span>
                          </li>
                          <li className="flex gap-2">
                             <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                             <span><strong>Berreketa:</strong> (-3)² = 9 da, ez -9. Zenbaki negatiboen karratua beti da positiboa.</span>
                          </li>
                        </ul>
                    </div>
                </div>

              </div>
            </Section>
          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Section title="Entrenamendua" icon={Brain} className="border-indigo-200 ring-4 ring-indigo-50/50">
                <div className="max-w-xl mx-auto">
                  {practiceProblem && (
                    <div className="space-y-8 text-center">
                      
                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Aurkitu soluzioak (erroak)</div>
                        <div className="text-3xl md:text-4xl font-mono text-slate-800 font-bold mb-2">
                          {practiceProblem.a === 1 ? '' : practiceProblem.a === -1 ? '-' : practiceProblem.a}x² 
                          {practiceProblem.b >= 0 ? '+' : ''}{practiceProblem.b}x 
                          {practiceProblem.c >= 0 ? '+' : ''}{practiceProblem.c} = 0
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                         <p className="text-slate-600 mb-2">Zeintzuk dira x-ren balioak?</p>
                         <div className="flex gap-4 justify-center">
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-400">x₁ =</span>
                                <input 
                                    type="number" 
                                    placeholder="?" 
                                    value={userInputs.x1}
                                    onChange={(e) => setUserInputs({...userInputs, x1: e.target.value})}
                                    className="w-24 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-lg font-bold"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-400">x₂ =</span>
                                <input 
                                    type="number" 
                                    placeholder="?" 
                                    value={userInputs.x2}
                                    onChange={(e) => setUserInputs({...userInputs, x2: e.target.value})}
                                    className="w-24 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-lg font-bold"
                                />
                            </div>
                         </div>
                      </div>

                      {feedback && (
                        <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <div className="flex items-center gap-2 font-bold text-lg">
                              {feedback === 'correct' ? <Check /> : <RefreshCw />}
                              <span>{feedback === 'correct' ? 'Bikain! Hori da.' : 'Ia-ia...'}</span>
                          </div>
                          {feedback === 'invalid' && <span className="text-sm">Mesedez, sartu zenbakiak.</span>}
                          {feedback === 'incorrect' && (
                              <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                                  Pista bat behar duzu?
                              </button>
                          )}
                        </div>
                      )}

                      {showHint && feedback === 'incorrect' && (
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                             <strong>Pista:</strong> Saiatu formula orokorra erabiltzen: <br/>
                             a={practiceProblem.a}, b={practiceProblem.b}, c={practiceProblem.c} <br/>
                             Δ = {practiceProblem.b}² - 4·{practiceProblem.a}·{practiceProblem.c} = {Math.pow(practiceProblem.b, 2) - 4 * practiceProblem.a * practiceProblem.c}
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
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all flex items-center gap-2 animate-in fade-in"
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
      
      <RelatedTopics currentId="ecu-2" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
