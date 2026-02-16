import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, 
  Check, 
  RefreshCw, 
  BookOpen, 
  Brain, 
  ArrowRight, 
  Divide,
  Scale,
  X,
  ChefHat,
  Music,
  Scissors,
  ArrowDown
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Visualizer Component (Tarta osoa marra zuriekin) ---

const FractionVisualizer = () => {
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);

  // SVG konfigurazioa
  const radius = 25; 
  const strokeWidth = 50; // Erradioaren bikoitza izatean zirkulua betetzen du
  const circumference = 2 * Math.PI * radius;
  const percentage = den === 0 ? 0 : (num / den) * 100;
  
  const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;

  // Marra zuriak marrazteko funtzioa
  const renderDividers = () => {
    if (den <= 1) return null;
    
    const lines = [];
    for (let i = 0; i < den; i++) {
      const angle = (i * 360) / den;
      const radian = (angle * Math.PI) / 180;
      
      // Zentroa (50,50) da. Luzera ertzeraino (50px).
      const x2 = 50 + 50 * Math.cos(radian);
      const y2 = 50 + 50 * Math.sin(radian);

      lines.push(
        <line 
          key={i}
          x1="50" y1="50"
          x2={x2} y2={y2}
          stroke="white" 
          strokeWidth="1.5"
        />
      );
    }
    return lines;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
       {/* Grafikoa */}
       <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
          <div className="relative w-64 h-64 flex items-center justify-center">
             <svg width="240" height="240" viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-lg">
                {/* Atzeko planoa (Grisa) */}
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#cbd5e1" strokeWidth={strokeWidth} />
                
                {/* Aurreko planoa (Berdea) */}
                <circle 
                  cx="50" cy="50" r={radius} 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth={strokeWidth} 
                  strokeDasharray={strokeDasharray}
                  className="transition-all duration-500 ease-out"
                />

                {/* Banaketa marrak */}
                {renderDividers()}
                
                {/* Erdiko puntutxoa */}
                <circle cx="50" cy="50" r="3" fill="white" />
             </svg>
          </div>
          
          <div className="mt-6 flex items-center gap-4">
             <div className="text-3xl font-bold font-mono text-slate-800">{num}/{den}</div>
             <div className="text-sm font-bold bg-white px-3 py-1 rounded border border-slate-200 text-slate-500">
                {percentage.toFixed(1)}%
             </div>
          </div>
       </div>

       {/* Kontrolak */}
       <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
             <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Scissors size={18}/> Moztu Tarta
             </h3>
             
             <div className="space-y-6">
                {/* Izendatzailea Slider */}
                <div>
                   <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Zatiak Guztira (Izendatzailea)</label>
                      <span className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-600 font-bold">{den}</span>
                   </div>
                   <input 
                      type="range" min="1" max="12" step="1" 
                      value={den}
                      onChange={(e) => {
                         const newDen = parseInt(e.target.value);
                         setDen(newDen);
                         if (num > newDen) setNum(newDen);
                      }} 
                      className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                   />
                   <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                      <span>1</span><span>6</span><span>12</span>
                   </div>
                </div>

                {/* Zenbakitzailea Slider */}
                <div>
                   <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Hartutako Zatiak (Zenbakitzailea)</label>
                      <span className="text-sm font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-600 font-bold">{num}</span>
                   </div>
                   <input 
                      type="range" min="0" max={den} step="1" 
                      value={num}
                      onChange={(e) => setNum(parseInt(e.target.value))} 
                      className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                   />
                </div>
             </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600">
             <p>
                <strong>Oharra:</strong> Marra zuriek erakusten dute tarta zenbat zati berdinetan banatu dugun. Izendatzailea handitzean, zati bakoitza txikiagoa da.
             </p>
          </div>
       </div>
    </div>
  );
};

// --- Main Component ---

export default function Zatikiak() {
  const [activeTab, setActiveTab] = useState('concept');
  
  // Practice State
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState({ n: '', d: '' });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    generateProblem();
  }, []);

  const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const generateProblem = () => {
    const type = Math.random() > 0.6 ? 'add' : (Math.random() > 0.3 ? 'mult' : 'simp');
    let n1, d1, n2, d2;

    if (type === 'simp') {
       const factor = Math.floor(Math.random() * 4) + 2; 
       const baseN = Math.floor(Math.random() * 5) + 1;
       const baseD = Math.floor(Math.random() * 5) + baseN + 1; 
       n1 = baseN * factor;
       d1 = baseD * factor;
       setProblem({ type, n1, d1 });
    } else {
       n1 = Math.floor(Math.random() * 5) + 1;
       d1 = Math.floor(Math.random() * 6) + 2;
       n2 = Math.floor(Math.random() * 5) + 1;
       d2 = Math.floor(Math.random() * 6) + 2;
       setProblem({ type, n1, d1, n2, d2 });
    }
    setUserInput({ n: '', d: '' });
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const uN = parseInt(userInput.n);
    const uD = parseInt(userInput.d);

    if (isNaN(uN) || isNaN(uD)) {
        setFeedback('invalid');
        return;
    }

    let correctN, correctD;

    if (problem.type === 'simp') {
       const divisor = gcd(problem.n1, problem.d1);
       correctN = problem.n1 / divisor;
       correctD = problem.d1 / divisor;
    } else if (problem.type === 'add') {
       const num = problem.n1 * problem.d2 + problem.n2 * problem.d1;
       const den = problem.d1 * problem.d2;
       const divisor = gcd(num, den);
       correctN = num / divisor;
       correctD = den / divisor;
    } else {
       const num = problem.n1 * problem.n2;
       const den = problem.d1 * problem.d2;
       const divisor = gcd(num, den);
       correctN = num / divisor;
       correctD = den / divisor;
    }

    const userDivisor = gcd(uN, uD);
    const simpleUN = uN / userDivisor;
    const simpleUD = uD / userDivisor;

    if (simpleUN === correctN && simpleUD === correctD) {
       if (uN === correctN && uD === correctD) {
          setFeedback('correct');
       } else {
          setFeedback('almost');
       }
    } else {
       setFeedback('incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-emerald-600 transition-colors ${activeTab === 'concept' ? 'text-emerald-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-emerald-600 transition-colors ${activeTab === 'viz' ? 'text-emerald-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Zatikiak eta <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Zenbaki Arrazionalak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ikasi zatiak batzen, eragiketak egiten eta aljebraren oinarriak ulertzen.
          </p>
        </div>

        {/* Content Switcher (Mobile) */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
           {['concept', 'viz', 'practice'].map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
               {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : 'Praktika'}
             </button>
           ))}
        </div>

        {/* --- SECTION 1: THEORY --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Context */}
            <Section title="Zertarako balio dute?" icon={BookOpen} className="border-emerald-200 ring-4 ring-emerald-50/30">
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <ChefHat size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Sukaldaritza</h3>
                     <p className="text-sm text-slate-600">
                        "Gehitu 1/2 litro esne eta 3/4 kilo irin". Errezetak doitzeko (bikoitza edo erdia egiteko) zatikiak ezinbestekoak dira.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-3">
                        <Music size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Musika eta Erritmoa</h3>
                     <p className="text-sm text-slate-600">
                        Musika notak zatikiak dira denboran: beltza (1/4), kortxea (1/8), fusa (1/32). Erritmoa zatikien matematika hutsa da.
                     </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Scissors size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 mb-2">Brikolajea eta Diseinua</h3>
                     <p className="text-sm text-slate-600">
                        Horma baten erdian koadro bat jartzeko edo oihal bat mozteko, zatiketak etengabe egiten ditugu.
                     </p>
                  </div>
               </div>
            </Section>

            {/* Anatomia */}
            <Section title="Zatikiaren Anatomia" icon={Divide}>
              <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
                 <div className="flex flex-col items-center">
                    <div className="bg-emerald-100 text-emerald-800 px-6 py-4 rounded-xl font-bold text-2xl mb-2">a</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">Zenbakitzailea</div>
                    <p className="text-xs text-slate-400 mt-1 max-w-[150px] text-center">Zenbat zati hartu ditugun.</p>
                 </div>
                 
                 <div className="h-0.5 w-24 bg-slate-300 md:hidden"></div> {/* Mobile divider */}
                 <div className="h-32 w-0.5 bg-slate-300 hidden md:block rotate-12"></div> {/* Desktop divider */}

                 <div className="flex flex-col items-center">
                    <div className="bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-2xl mb-2">b</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">Izendatzailea</div>
                    <p className="text-xs text-slate-400 mt-1 max-w-[150px] text-center">Guztira zenbat zatitan moztu dugun.</p>
                 </div>
              </div>
            </Section>

            {/* Eragiketa Arauak (SVG GRAFIKOEKIN) */}
            <Section title="Eragiketa Arauak (Bisualki)" icon={Scale}>
               <div className="grid lg:grid-cols-3 gap-8">
                  
                  {/* BATUKETAK ETA KENKETAK */}
                  <div className="bg-white rounded-2xl border-2 border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                        <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
                           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">+</div>
                           Batuketak / Kenketak
                        </h3>
                     </div>
                     <div className="p-6 space-y-4">
                        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                           <strong className="text-red-500 block mb-1">ARAURIK GARRANTZITSUENA:</strong>
                           "Ezin dira sagarrak eta udareak batu". Izendatzaile (beheko zenbaki) berdina behar dute.
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 pt-2">
                           <div className="flex items-center gap-3 font-mono text-xl">
                              <div className="flex flex-col items-center"><span>1</span><span className="h-px w-full bg-slate-800"></span><span>2</span></div>
                              <span>+</span>
                              <div className="flex flex-col items-center"><span>1</span><span className="h-px w-full bg-slate-800"></span><span>3</span></div>
                           </div>
                           
                           <div className="flex flex-col items-center my-2">
                               <div className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">M.K.T. (2,3) = 6</div>
                               <ArrowDown size={20} className="text-emerald-300 animate-bounce" />
                           </div>

                           <div className="flex items-center gap-2 font-mono text-lg bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 shadow-sm w-full justify-center">
                              <div className="flex flex-col items-center text-emerald-700"><span>3</span><span className="h-px w-full bg-current"></span><span>6</span></div>
                              <span className="text-emerald-400">+</span>
                              <div className="flex flex-col items-center text-emerald-700"><span>2</span><span className="h-px w-full bg-current"></span><span>6</span></div>
                              <span className="text-emerald-400">=</span>
                              <div className="flex flex-col items-center font-bold text-emerald-900 scale-110"><span>5</span><span className="h-px w-full bg-current"></span><span>6</span></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* BIDERKETAK */}
                  <div className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <div className="bg-purple-50 p-4 border-b border-purple-100">
                        <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">×</div>
                           Biderketak
                        </h3>
                     </div>
                     <div className="p-6 space-y-4">
                        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                           <strong className="text-purple-600 block mb-1">TRENAREN BIDEA (ZUZENA):</strong>
                           "Goikoa goikoarekin, eta behekoa behekoarekin". Zuzenean biderkatu.
                        </div>

                        <div className="flex justify-center py-2">
                           <svg width="220" height="120" viewBox="0 0 220 120">
                              <defs>
                                <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                  <path d="M0,0 L6,3 L0,6" fill="#a855f7" />
                                </marker>
                              </defs>
                              
                              {/* Fractions */}
                              <text x="30" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">2</text>
                              <line x1="15" y1="50" x2="45" y2="50" stroke="#334155" strokeWidth="2" />
                              <text x="30" y="80" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">3</text>

                              <text x="65" y="65" textAnchor="middle" fontSize="20" fill="#94a3b8">·</text>

                              <text x="100" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">4</text>
                              <line x1="85" y1="50" x2="115" y2="50" stroke="#334155" strokeWidth="2" />
                              <text x="100" y="80" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">5</text>

                              {/* Arrows */}
                              <line x1="45" y1="35" x2="85" y2="35" stroke="#d8b4fe" strokeWidth="2" markerEnd="url(#arrow-purple)" />
                              <line x1="45" y1="75" x2="85" y2="75" stroke="#d8b4fe" strokeWidth="2" markerEnd="url(#arrow-purple)" />

                              <text x="135" y="65" textAnchor="middle" fontSize="20" fill="#94a3b8">=</text>

                              {/* Result */}
                              <rect x="155" y="20" width="50" height="80" rx="8" fill="#faf5ff" stroke="#e9d5ff" />
                              <text x="180" y="45" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#7e22ce">8</text>
                              <line x1="165" y1="55" x2="195" y2="55" stroke="#7e22ce" strokeWidth="2" />
                              <text x="180" y="85" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#7e22ce">15</text>
                           </svg>
                        </div>
                     </div>
                  </div>

                  {/* ZATIKETAK */}
                  <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <div className="bg-orange-50 p-4 border-b border-orange-100">
                        <h3 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">:</div>
                           Zatiketak
                        </h3>
                     </div>
                     <div className="p-6 space-y-4">
                        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                           <strong className="text-orange-600 block mb-1">KARAMELUA (GURUTZEAN):</strong>
                           Ez dugu zatitzen! Biderkatu egiten dugu, baina <strong className="text-orange-600">gurutzean</strong> (Zig-Zag).
                        </div>

                        <div className="flex justify-center py-2">
                           <svg width="220" height="120" viewBox="0 0 220 120">
                              <defs>
                                <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                  <path d="M0,0 L6,3 L0,6" fill="#f97316" />
                                </marker>
                              </defs>
                              
                              <text x="30" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">1</text>
                              <line x1="15" y1="50" x2="45" y2="50" stroke="#334155" strokeWidth="2" />
                              <text x="30" y="80" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">2</text>

                              <text x="65" y="65" textAnchor="middle" fontSize="20" fill="#94a3b8">:</text>

                              <text x="100" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">3</text>
                              <line x1="85" y1="50" x2="115" y2="50" stroke="#334155" strokeWidth="2" />
                              <text x="100" y="80" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#334155">4</text>

                              {/* Zig-Zag Paths */}
                              <path d="M 40 30 L 100 85 L 155 35" fill="none" stroke="#fdba74" strokeWidth="2" markerEnd="url(#arrow-orange)" strokeDasharray="4"/>
                              <path d="M 40 90 L 100 35 L 155 85" fill="none" stroke="#fdba74" strokeWidth="2" markerEnd="url(#arrow-orange)" strokeDasharray="4"/>

                              <text x="135" y="65" textAnchor="middle" fontSize="20" fill="#94a3b8">=</text>

                              {/* Result */}
                              <rect x="155" y="20" width="50" height="80" rx="8" fill="#fff7ed" stroke="#ffedd5" />
                              <text x="180" y="45" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#c2410c">4</text>
                              <line x1="165" y1="55" x2="195" y2="55" stroke="#c2410c" strokeWidth="2" />
                              <text x="180" y="85" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#c2410c">6</text>
                           </svg>
                        </div>
                     </div>
                  </div>

               </div>
            </Section>

             {/* Aljebra */}
             <Section title="Zatiki Aljebraikoak" icon={Brain}>
                <div className="bg-slate-900 text-slate-200 p-6 rounded-xl">
                   <p className="mb-4">
                      Zenbakiak ulertzen badituzu, letrak ere bai. Arauak <strong>berdinak</strong> dira, baina zenbakien ordez polinomioak ditugu.
                   </p>
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-4 rounded-lg">
                         <span className="text-xs text-slate-400 uppercase font-bold">Zenbakiak</span>
                         <div className="font-mono text-xl mt-2">
                            <span className="text-emerald-400">2</span> / <span className="text-pink-400">3</span>
                         </div>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-lg">
                         <span className="text-xs text-slate-400 uppercase font-bold">Aljebra</span>
                         <div className="font-mono text-xl mt-2">
                            <span className="text-emerald-400">(x + 1)</span> / <span className="text-pink-400">(x - 2)</span>
                         </div>
                      </div>
                   </div>
                   <p className="mt-4 text-sm text-slate-400 italic">
                      Gakoa: Faktorizatu (deskonposatu) lehenengo, gero sinplifikatu.
                   </p>
                </div>
             </Section>

          </div>
        )}

        {/* --- SECTION 2: VISUALIZATION --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Zatiki Bisualizatzailea" icon={PieChart}>
               <FractionVisualizer />
            </Section>
          </div>
        )}

        {/* --- SECTION 3: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Section title="Entrenamendua" icon={Brain} className="border-emerald-200 ring-4 ring-emerald-50/50">
                <div className="max-w-xl mx-auto">
                   {problem && (
                      <div className="text-center space-y-8">
                         
                         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">
                               {problem.type === 'simp' ? 'Sinplifikatu zatikia' : 
                                problem.type === 'add' ? 'Egin batuketa' : 'Egin biderketa'}
                            </div>
                            
                            <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-mono font-bold text-slate-800">
                               {problem.type === 'simp' ? (
                                  <div className="flex flex-col items-center">
                                     <span>{problem.n1}</span>
                                     <div className="w-full h-1 bg-slate-800"></div>
                                     <span>{problem.d1}</span>
                                  </div>
                               ) : (
                                  <>
                                     <div className="flex flex-col items-center">
                                        <span>{problem.n1}</span>
                                        <div className="w-full h-1 bg-slate-800"></div>
                                        <span>{problem.d1}</span>
                                     </div>
                                     <span className="text-emerald-500">{problem.type === 'add' ? '+' : '·'}</span>
                                     <div className="flex flex-col items-center">
                                        <span>{problem.n2}</span>
                                        <div className="w-full h-1 bg-slate-800"></div>
                                        <span>{problem.d2}</span>
                                     </div>
                                  </>
                               )}
                               <span>=</span>
                               <span className="text-slate-300">?</span>
                            </div>
                         </div>

                         <div className="flex flex-col items-center gap-4">
                            <p className="text-slate-600 mb-2">Idatzi emaitza (sinplifikatuta!)</p>
                            <div className="flex flex-col items-center gap-2">
                               <input 
                                  type="number" 
                                  placeholder="Zenbakitzailea" 
                                  value={userInput.n}
                                  onChange={(e) => setUserInput({...userInput, n: e.target.value})}
                                  className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-bold"
                               />
                               <div className="w-32 h-1 bg-slate-800 rounded-full"></div>
                               <input 
                                  type="number" 
                                  placeholder="Izendatzailea" 
                                  value={userInput.d}
                                  onChange={(e) => setUserInput({...userInput, d: e.target.value})}
                                  className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-bold"
                               />
                            </div>
                         </div>

                         {feedback && (
                           <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${feedback === 'correct' ? 'bg-green-100 text-green-700' : feedback === 'almost' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              <div className="flex items-center gap-2 font-bold text-lg">
                                 {feedback === 'correct' ? <Check /> : feedback === 'almost' ? <RefreshCw /> : <X />}
                                 <span>
                                    {feedback === 'correct' ? 'Bikain! Hori da.' : 
                                     feedback === 'almost' ? 'Ondo dago, baina gehiago sinplifikatu daiteke!' : 
                                     'Saiatu berriro...'}
                                 </span>
                              </div>
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
                               className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-all flex items-center gap-2 animate-in fade-in"
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
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
