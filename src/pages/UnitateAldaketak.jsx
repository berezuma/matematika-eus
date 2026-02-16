import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import {
  BookOpen,
  ArrowRight,
  Check,
  RefreshCw,
  Zap,
  ListOrdered,
  ArrowLeftRight,
  Scale,
  Clock,
  Ruler,
  Weight,
  Droplets,
  ChevronDown,
  ChevronUp,
  Trophy,
  AlertTriangle
} from 'lucide-react';

// --- Section Component ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Unit Data ---

const unitData = {
  luzera: {
    label: 'Luzera',
    icon: Ruler,
    units: [
      { name: 'Kilometro', abbr: 'km', factor: 1000 },
      { name: 'Hektometro', abbr: 'hm', factor: 100 },
      { name: 'Dekametro', abbr: 'dam', factor: 10 },
      { name: 'Metro', abbr: 'm', factor: 1 },
      { name: 'Dezimetro', abbr: 'dm', factor: 0.1 },
      { name: 'Zentimetro', abbr: 'cm', factor: 0.01 },
      { name: 'Milimetro', abbr: 'mm', factor: 0.001 },
    ],
    base: 'm',
  },
  masa: {
    label: 'Masa',
    icon: Weight,
    units: [
      { name: 'Tona', abbr: 't', factor: 1000000 },
      { name: 'Kilogramo', abbr: 'kg', factor: 1000 },
      { name: 'Hektogramo', abbr: 'hg', factor: 100 },
      { name: 'Dekagramo', abbr: 'dag', factor: 10 },
      { name: 'Gramo', abbr: 'g', factor: 1 },
      { name: 'Dezigramo', abbr: 'dg', factor: 0.1 },
      { name: 'Zentigramo', abbr: 'cg', factor: 0.01 },
      { name: 'Miligramo', abbr: 'mg', factor: 0.001 },
    ],
    base: 'g',
  },
  bolumena: {
    label: 'Edukiera / Bolumena',
    icon: Droplets,
    units: [
      { name: 'Kilolitro', abbr: 'kl', factor: 1000 },
      { name: 'Hektolitro', abbr: 'hl', factor: 100 },
      { name: 'Dekalitro', abbr: 'dal', factor: 10 },
      { name: 'Litro', abbr: 'l', factor: 1 },
      { name: 'Dezilitro', abbr: 'dl', factor: 0.1 },
      { name: 'Zentilitro', abbr: 'cl', factor: 0.01 },
      { name: 'Mililitro', abbr: 'ml', factor: 0.001 },
    ],
    base: 'l',
  },
  denbora: {
    label: 'Denbora',
    icon: Clock,
    units: [
      { name: 'Astea', abbr: 'aste', factor: 604800 },
      { name: 'Eguna', abbr: 'egun', factor: 86400 },
      { name: 'Ordua', abbr: 'h', factor: 3600 },
      { name: 'Minutua', abbr: 'min', factor: 60 },
      { name: 'Segundoa', abbr: 's', factor: 1 },
    ],
    base: 's',
  },
};

// --- Conversion Function ---

const convert = (value, fromUnit, toUnit, category) => {
  const catData = unitData[category];
  const from = catData.units.find(u => u.abbr === fromUnit);
  const to = catData.units.find(u => u.abbr === toUnit);
  if (!from || !to || isNaN(value)) return '';
  const result = (value * from.factor) / to.factor;
  return result;
};

const formatNumber = (num) => {
  if (num === '' || num === undefined || num === null) return '';
  if (typeof num !== 'number') return num;
  if (Number.isInteger(num)) return num.toString();
  // Show up to 6 decimal places, removing trailing zeros
  return parseFloat(num.toFixed(6)).toString();
};

// --- Staircase Visual Component ---

const Escalera = ({ category }) => {
  const catData = unitData[category];
  if (!catData || category === 'denbora') return null;

  const metricUnits = category === 'luzera'
    ? ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm']
    : category === 'masa'
    ? ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg']
    : ['kl', 'hl', 'dal', 'l', 'dl', 'cl', 'ml'];

  const prefixes = ['kilo', 'hecto', 'deca', '', 'deci', 'centi', 'mili'];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {metricUnits.map((unit, i) => {
        const width = 30 + i * 10;
        const isBase = i === 3;
        return (
          <div key={unit} className="flex items-center w-full" style={{ justifyContent: 'center' }}>
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-lg border text-sm font-mono transition-all ${
                isBase
                  ? 'bg-teal-500 text-white border-teal-600 font-bold shadow-lg'
                  : i < 3
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
              style={{ width: `${width}%`, marginTop: i === 0 ? 0 : '-1px' }}
            >
              <span className="text-xs opacity-70">{prefixes[i]}</span>
              <span className="font-bold text-base">{unit}</span>
              <span className="text-xs">
                {i < 3 ? (
                  <span className="flex items-center gap-1">
                    <ChevronDown size={12} /> x10
                  </span>
                ) : i > 3 ? (
                  <span className="flex items-center gap-1">
                    <ChevronDown size={12} /> x10
                  </span>
                ) : (
                  <span className="font-bold">OINARRIA</span>
                )}
              </span>
            </div>
          </div>
        );
      })}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-600 w-full max-w-xs">
        <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
          <ChevronUp className="mx-auto text-teal-600 mb-1" size={16} />
          <p className="font-bold text-teal-700">GORA = x10</p>
          <p>Maila bat igo = x10</p>
          <p className="text-teal-500 mt-1">cm → mm: x10</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
          <ChevronDown className="mx-auto text-emerald-600 mb-1" size={16} />
          <p className="font-bold text-emerald-700">BEHERA = /10</p>
          <p>Maila bat jaitsi = /10</p>
          <p className="text-emerald-500 mt-1">mm → cm: /10</p>
        </div>
      </div>
    </div>
  );
};

// --- Practice Problem Generator ---

const generatePracticeProblem = () => {
  const categories = ['luzera', 'masa', 'bolumena', 'denbora'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const catData = unitData[category];
  const units = catData.units;

  let fromIdx, toIdx;
  do {
    fromIdx = Math.floor(Math.random() * units.length);
    toIdx = Math.floor(Math.random() * units.length);
  } while (fromIdx === toIdx);

  const fromUnit = units[fromIdx];
  const toUnit = units[toIdx];

  // Generate nice values
  let value;
  if (category === 'denbora') {
    const niceValues = [1, 2, 3, 5, 10, 24, 30, 60, 120, 0.5];
    value = niceValues[Math.floor(Math.random() * niceValues.length)];
  } else {
    const niceValues = [0.5, 1, 2, 2.5, 3, 3.5, 5, 7.5, 10, 15, 25, 50, 100, 250, 500, 1000, 2500];
    value = niceValues[Math.floor(Math.random() * niceValues.length)];
  }

  const solution = (value * fromUnit.factor) / toUnit.factor;

  return {
    category,
    categoryLabel: catData.label,
    value,
    fromUnit: fromUnit.abbr,
    fromName: fromUnit.name,
    toUnit: toUnit.abbr,
    toName: toUnit.name,
    solution,
    display: `${formatNumber(value)} ${fromUnit.abbr}  →  ? ${toUnit.abbr}`,
  };
};

// --- Main Component ---

export default function UnitateAldaketak() {
  const [activeTab, setActiveTab] = useState('teoria');

  // Lab state
  const [labCategory, setLabCategory] = useState('luzera');
  const [labFrom, setLabFrom] = useState('km');
  const [labTo, setLabTo] = useState('m');
  const [labValue, setLabValue] = useState('1');

  // Practice state
  const [practiceProblem, setPracticeProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const { score, total: totalAttempts, addCorrect, addIncorrect, reset } = useProgress('unitate-aldaketak');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setPracticeProblem(generatePracticeProblem());
  }, []);

  // When lab category changes, reset from/to
  const handleLabCategoryChange = (cat) => {
    setLabCategory(cat);
    const units = unitData[cat].units;
    setLabFrom(units[0].abbr);
    setLabTo(units[units.length > 3 ? 3 : units.length - 1].abbr);
    setLabValue('1');
  };

  const labResult = (() => {
    const val = parseFloat(labValue);
    if (isNaN(val)) return '';
    return convert(val, labFrom, labTo, labCategory);
  })();

  const swapUnits = () => {
    setLabFrom(labTo);
    setLabTo(labFrom);
  };

  const checkAnswer = () => {
    if (!practiceProblem) return;
    const userVal = parseFloat(userInput);
    if (isNaN(userVal)) {
      setFeedback('invalid');
      return;
    }
    const tolerance = Math.abs(practiceProblem.solution) * 0.01;
    if (Math.abs(userVal - practiceProblem.solution) <= Math.max(tolerance, 0.001)) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  const nextProblem = () => {
    setPracticeProblem(generatePracticeProblem());
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const tabs = [
    { key: 'teoria', label: 'Teoria' },
    { key: 'laborategia', label: 'Laborategia' },
    { key: 'formulak', label: 'Formulak' },
    { key: 'praktika', label: 'Praktika' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-800">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`transition-colors ${
                  t.key === 'praktika'
                    ? `px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all shadow-sm shadow-teal-200`
                    : `hover:text-teal-600 ${activeTab === t.key ? 'text-teal-600' : ''}`
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Unitate <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Aldaketak</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sistema metrikoa, aurrizkiak eta unitate bihurketak: eguneroko bizitzan neurketak ulertzeko eta erabiltzeko behar duzun guztia.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === t.key ? 'bg-teal-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ========== TAB 1: TEORIA ========== */}
        {activeTab === 'teoria' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Intro */}
            <Section title="Zer dira Unitate Aldaketak?" icon={Zap} className="border-teal-200 ring-4 ring-teal-50/30">
              <div className="space-y-4">
                <p className="text-slate-600">
                  Unitate aldaketak magnitude beraren neurri desberdinak bihurtzeko eragiketa matematikoak dira. Adibidez,
                  1 kilometro zenbat metro diren jakitea, edo 500 mililitro zenbat litro diren kalkulatzea.
                </p>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <p className="text-teal-800 font-bold mb-2">Zergatik garrantzitsuak dira?</p>
                  <p className="text-sm text-teal-700">
                    Eguneroko bizitzan etengabe erabiltzen ditugu: sukaldean errezetekin, bidaietan distantziekin,
                    medikuntzan dosiarekin, kiroletan denborarekin... Neurri sistema ulertzea funtsezkoa da!
                  </p>
                </div>
              </div>
            </Section>

            {/* Metric System */}
            <Section title="Sistema Metrikoa" icon={Scale}>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Sistema metriko hamartarra 10ean oinarritutako neurketa sistema da. Aurrizki bakoitzak 10en
                  berredura bat adierazten du oinarrizko unitatearen aldean.
                </p>

                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
                  <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Aurrizkien Eskala</p>
                  <div className="text-2xl md:text-3xl font-mono font-bold space-x-2">
                    <span className="text-teal-300">kilo</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-teal-400">hecto</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-teal-400">deca</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-white font-extrabold">OINARRIA</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-400">deci</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-400">centi</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-300">mili</span>
                  </div>
                  <div className="text-xl md:text-2xl font-mono mt-3 text-slate-400">
                    <span>x1000</span>
                    <span className="mx-1">|</span>
                    <span>x100</span>
                    <span className="mx-1">|</span>
                    <span>x10</span>
                    <span className="mx-1">|</span>
                    <span className="text-white">x1</span>
                    <span className="mx-1">|</span>
                    <span>/10</span>
                    <span className="mx-1">|</span>
                    <span>/100</span>
                    <span className="mx-1">|</span>
                    <span>/1000</span>
                  </div>
                </div>

                {/* Prefixes table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-teal-50 text-teal-800">
                        <th className="py-3 px-4 text-left font-bold">Aurrizkia</th>
                        <th className="py-3 px-4 text-left font-bold">Ikurra</th>
                        <th className="py-3 px-4 text-left font-bold">Faktorea</th>
                        <th className="py-3 px-4 text-left font-bold">Adibidea</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {[
                        { prefix: 'kilo', symbol: 'k', factor: '1.000', example: '1 km = 1.000 m' },
                        { prefix: 'hecto', symbol: 'h', factor: '100', example: '1 hg = 100 g' },
                        { prefix: 'deca', symbol: 'da', factor: '10', example: '1 dal = 10 l' },
                        { prefix: '(oinarria)', symbol: '-', factor: '1', example: 'm, g, l' },
                        { prefix: 'deci', symbol: 'd', factor: '0,1', example: '1 dm = 0,1 m' },
                        { prefix: 'centi', symbol: 'c', factor: '0,01', example: '1 cm = 0,01 m' },
                        { prefix: 'mili', symbol: 'm', factor: '0,001', example: '1 mm = 0,001 m' },
                      ].map((row, i) => (
                        <tr key={i} className={`border-t border-slate-100 ${i === 3 ? 'bg-teal-50 font-bold' : ''}`}>
                          <td className="py-2 px-4">{row.prefix}</td>
                          <td className="py-2 px-4 text-teal-600 font-bold">{row.symbol}</td>
                          <td className="py-2 px-4">{row.factor}</td>
                          <td className="py-2 px-4 text-slate-500">{row.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Categories */}
            <Section title="Magnitude Motak" icon={ListOrdered}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                    <Ruler size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Luzera</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Bi punturen arteko distantzia neurtzen du. Oinarrizko unitatea <strong>metroa (m)</strong> da.
                  </p>
                  <div className="text-xs text-slate-500 font-mono space-y-1">
                    <p>km - hm - dam - <strong className="text-teal-600">m</strong> - dm - cm - mm</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                    <Weight size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Masa</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Gorputz batek duen materia kantitatea neurtzen du. Oinarrizko unitatea <strong>gramoa (g)</strong> da.
                  </p>
                  <div className="text-xs text-slate-500 font-mono space-y-1">
                    <p>t - kg - hg - dag - <strong className="text-teal-600">g</strong> - dg - cg - mg</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                    <Droplets size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Edukiera / Bolumena</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Ontzi batek har dezakeen likido kantitatea neurtzen du. Oinarrizko unitatea <strong>litroa (l)</strong> da.
                  </p>
                  <div className="text-xs text-slate-500 font-mono space-y-1">
                    <p>kl - hl - dal - <strong className="text-teal-600">l</strong> - dl - cl - ml</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Denbora</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Gertaeren iraupena neurtzen du. <strong>Ez da hamartarra!</strong> Sistema sexagesimala erabiltzen du (60ean oinarritua).
                  </p>
                  <div className="text-xs text-slate-500 font-mono space-y-1">
                    <p>astea - eguna - <strong className="text-teal-600">ordua (h)</strong> - minutua (min) - segundoa (s)</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Escalera Visual */}
            <Section title="Unitateen Eskailera" icon={ArrowLeftRight}>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Eskailera metodoa erabiliz, maila bakoitzean <strong>10ez biderkatu</strong> (jaistean) edo
                  <strong> 10ez zatitu</strong> (igotzean). Zenbat maila mugitzen zaren, hainbat aldiz biderkatu edo zatitu behar duzu 10ez.
                </p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                  <div>
                    <p><strong>Kontuz!</strong> Denbora unitateak EZ dira hamartarrak. Ordu batek 60 minutu ditu, ez 100.
                    Beraz, eskailera metodoa ez da baliagarria denbora unitateetarako.</p>
                  </div>
                </div>
                <Escalera category="luzera" />
              </div>
            </Section>

          </div>
        )}

        {/* ========== TAB 2: LABORATEGIA ========== */}
        {activeTab === 'laborategia' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Unitate Bihurgailua" icon={ArrowLeftRight}>
              <div className="space-y-6">

                {/* Category selector */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(unitData).map(([key, cat]) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => handleLabCategoryChange(key)}
                        className={`p-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                          labCategory === key
                            ? 'bg-teal-500 text-white border-teal-600 shadow-lg shadow-teal-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                        }`}
                      >
                        <CatIcon size={20} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Converter */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
                  <div className="grid md:grid-cols-5 gap-4 items-end">
                    {/* Value input */}
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Balioa</label>
                      <input
                        type="number"
                        value={labValue}
                        onChange={(e) => setLabValue(e.target.value)}
                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg font-bold text-center"
                        placeholder="0"
                      />
                    </div>

                    {/* From unit */}
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nondik</label>
                      <select
                        value={labFrom}
                        onChange={(e) => setLabFrom(e.target.value)}
                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-sm font-bold bg-white"
                      >
                        {unitData[labCategory].units.map(u => (
                          <option key={u.abbr} value={u.abbr}>{u.name} ({u.abbr})</option>
                        ))}
                      </select>
                    </div>

                    {/* Swap button */}
                    <div className="flex justify-center md:col-span-1">
                      <button
                        onClick={swapUnits}
                        className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all shadow-lg shadow-teal-200 hover:-translate-y-1 active:translate-y-0"
                        title="Trukatu unitateak"
                      >
                        <ArrowLeftRight size={20} />
                      </button>
                    </div>

                    {/* To unit */}
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nora</label>
                      <select
                        value={labTo}
                        onChange={(e) => setLabTo(e.target.value)}
                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-sm font-bold bg-white"
                      >
                        {unitData[labCategory].units.map(u => (
                          <option key={u.abbr} value={u.abbr}>{u.name} ({u.abbr})</option>
                        ))}
                      </select>
                    </div>

                    {/* Result */}
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Emaitza</label>
                      <div className="w-full p-3 bg-teal-500 text-white rounded-xl text-lg font-bold text-center shadow-lg shadow-teal-200">
                        {labResult !== '' ? formatNumber(labResult) : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Full conversion sentence */}
                  {labResult !== '' && labValue !== '' && (
                    <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 text-center">
                      <p className="text-lg font-mono">
                        <span className="font-bold text-slate-800">{labValue} {labFrom}</span>
                        <span className="text-teal-500 mx-3">=</span>
                        <span className="font-bold text-teal-600">{formatNumber(labResult)} {labTo}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick reference for the selected category */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
                    <h3 className="font-bold text-teal-800 text-sm">{unitData[labCategory].label} - Erreferentzia Azkarra</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {unitData[labCategory].units.map(u => (
                        <div key={u.abbr} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                          <p className="font-bold text-teal-600 text-lg">{u.abbr}</p>
                          <p className="text-xs text-slate-500">{u.name}</p>
                          <p className="text-xs text-slate-400 font-mono mt-1">
                            1 {u.abbr} = {formatNumber(u.factor)} {unitData[labCategory].base}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </Section>
          </div>
        )}

        {/* ========== TAB 3: FORMULAK ========== */}
        {activeTab === 'formulak' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Conversion tables for each category */}
            {Object.entries(unitData).map(([catKey, catData]) => {
              const CatIcon = catData.icon;
              return (
                <Section key={catKey} title={catData.label + ' - Bihurtze Faktoreak'} icon={CatIcon}>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-teal-50 text-teal-800">
                            <th className="py-3 px-4 text-left font-bold">Unitatea</th>
                            <th className="py-3 px-4 text-left font-bold">Ikurra</th>
                            <th className="py-3 px-4 text-left font-bold">Baliokidetza ({catData.base})</th>
                            <th className="py-3 px-4 text-left font-bold">Adibide praktikoa</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-xs md:text-sm">
                          {catData.units.map((unit, i) => {
                            const examples = {
                              luzera: {
                                km: 'Bilbo-Donostia: ~100 km',
                                hm: 'Futbol zelai luzera: ~1 hm',
                                dam: 'Bloke bat: ~1 dam',
                                m: 'Ate baten altuera: ~2 m',
                                dm: 'Eskuaren luzera: ~2 dm',
                                cm: 'Hatz baten zabalera: ~1 cm',
                                mm: 'Txanpon baten lodiera: ~2 mm',
                              },
                              masa: {
                                t: 'Auto bat: ~1,5 t',
                                kg: 'Ur litro bat: 1 kg',
                                hg: 'Sagar bat: ~2 hg',
                                dag: 'Esnezko xokolate tableta: ~1 dag',
                                g: 'Klip bat: ~1 g',
                                dg: 'Arroz ale bat: ~2,5 dg',
                                cg: 'Ile haria: ~6 cg',
                                mg: 'Aspirina: 500 mg',
                              },
                              bolumena: {
                                kl: 'Igerileku txiki bat: ~25 kl',
                                hl: 'Ardo upel bat: ~2 hl',
                                dal: 'Kubel handi bat: ~1 dal',
                                l: 'Ur botila: 1 l',
                                dl: 'Edalontzi bat: ~2 dl',
                                cl: 'Koilara handi bat: ~1,5 cl',
                                ml: 'Tanta bat: ~0,05 ml',
                              },
                              denbora: {
                                aste: 'Aste bat: 7 egun',
                                egun: 'Egun bat: 24 ordu',
                                h: 'Film bat: ~2 h',
                                min: 'Abesti bat: ~3 min',
                                s: 'Bihotz taupada: ~1 s',
                              },
                            };
                            return (
                              <tr key={unit.abbr} className={`border-t border-slate-100 ${unit.factor === 1 ? 'bg-teal-50 font-bold' : ''}`}>
                                <td className="py-2 px-4 font-sans">{unit.name}</td>
                                <td className="py-2 px-4 text-teal-600 font-bold">{unit.abbr}</td>
                                <td className="py-2 px-4">1 {unit.abbr} = {formatNumber(unit.factor)} {catData.base}</td>
                                <td className="py-2 px-4 text-slate-500 font-sans">{examples[catKey]?.[unit.abbr] || ''}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Section>
              );
            })}

            {/* Staircase Method */}
            <Section title="Eskailera Metodoa" icon={ArrowLeftRight}>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Sistema metrikoko unitate bihurketak erraz egiteko, eskailera metodoa erabili dezakezu.
                  Maila bakoitza 10eko faktorea da. Jaitsi = x10, igo = /10.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {['luzera', 'masa', 'bolumena'].map(cat => (
                    <div key={cat} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h3 className="font-bold text-teal-700 mb-4 text-center">{unitData[cat].label}</h3>
                      <Escalera category={cat} />
                    </div>
                  ))}
                </div>

                {/* Worked examples */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-teal-700 mb-3 flex items-center gap-2">
                      <ChevronDown size={16} /> Jaitsi: unitate txikiagoetara
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm space-y-2 mb-3">
                      <p className="text-slate-600">3,5 km → ? m</p>
                      <p className="text-slate-500 text-xs">km → hm → dam → m (3 maila)</p>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <p className="text-teal-600 font-bold">3,5 x 10 x 10 x 10 = 3.500 m</p>
                        <p className="text-slate-400 text-xs mt-1">Edo: 3,5 x 10^3 = 3.500 m</p>
                      </div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg text-xs text-teal-800">
                      <strong>Araua:</strong> Koma eskuinera mugitu, maila adina posizio.
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-teal-700 mb-3 flex items-center gap-2">
                      <ChevronUp size={16} /> Igo: unitate handiagoetara
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm space-y-2 mb-3">
                      <p className="text-slate-600">2.500 g → ? kg</p>
                      <p className="text-slate-500 text-xs">g → dag → hg → kg (3 maila)</p>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <p className="text-teal-600 font-bold">2.500 / 10 / 10 / 10 = 2,5 kg</p>
                        <p className="text-slate-400 text-xs mt-1">Edo: 2.500 / 10^3 = 2,5 kg</p>
                      </div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg text-xs text-teal-800">
                      <strong>Araua:</strong> Koma ezkerrera mugitu, maila adina posizio.
                    </div>
                  </div>
                </div>

                {/* Time conversions */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-teal-700 mb-3 flex items-center gap-2">
                    <Clock size={16} /> Denbora Bihurketak (sistema sexagesimala)
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Denbora unitateak ez dira hamartarrak. Faktoreak desberdinak dira maila bakoitzean:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-sm">
                    <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
                      <p className="font-bold text-teal-700">1 aste</p>
                      <p className="text-xs text-teal-600">= 7 egun</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
                      <p className="font-bold text-teal-700">1 egun</p>
                      <p className="text-xs text-teal-600">= 24 ordu</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
                      <p className="font-bold text-teal-700">1 ordu</p>
                      <p className="text-xs text-teal-600">= 60 minutu</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg text-center border border-teal-100">
                      <p className="font-bold text-teal-700">1 minutu</p>
                      <p className="text-xs text-teal-600">= 60 segundo</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ========== TAB 4: PRAKTIKA ========== */}
        {activeTab === 'praktika' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Trophy} className="border-teal-200 ring-4 ring-teal-50/50">
              <div className="max-w-xl mx-auto">

                {/* Score board */}
                <div className="flex justify-center gap-4 mb-6">
                  <div className="bg-teal-50 border border-teal-100 px-6 py-2 rounded-full text-sm font-bold text-teal-700 flex items-center gap-3">
                    <span>Zuzenak: {score}/{totalAttempts}</span>
                    {totalAttempts > 0 && <span className="text-xs opacity-60">({Math.round((score / totalAttempts) * 100)}%)</span>}
                  </div>
                  <div className="bg-slate-50 border border-slate-100 px-6 py-2 rounded-full text-sm font-bold text-slate-600">
                    Saiakerak: {totalAttempts}
                  </div>
                  {totalAttempts > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 px-6 py-2 rounded-full text-sm font-bold text-emerald-700">
                      %{Math.round((score / totalAttempts) * 100)}
                    </div>
                  )}
                </div>

                {practiceProblem && (
                  <div className="space-y-8 text-center">

                    {/* Problem card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {practiceProblem.categoryLabel}
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
                          onKeyDown={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                          className="w-36 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg font-bold"
                        />
                        <span className="font-mono font-bold text-teal-600 text-lg">{practiceProblem.toUnit}</span>
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
                            {feedback === 'correct' ? 'Bikain! Zuzen erantzun duzu.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             'Oker... Saiatu berriro!'}
                          </span>
                        </div>
                        {feedback === 'incorrect' && !showHint && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Erantzuna ikusi?
                          </button>
                        )}
                      </div>
                    )}

                    {/* Hint / Solution */}
                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                        <strong>Erantzun zuzena:</strong>{' '}
                        <span className="font-mono font-bold">
                          {practiceProblem.value} {practiceProblem.fromUnit} = {formatNumber(practiceProblem.solution)} {practiceProblem.toUnit}
                        </span>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 justify-center mt-6">
                      {!feedback && (
                        <button
                          onClick={checkAnswer}
                          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0"
                        >
                          Egiaztatu
                        </button>
                      )}
                      {feedback && (
                        <button
                          onClick={nextProblem}
                          className="px-8 py-3 bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-600 transition-all flex items-center gap-2 animate-in fade-in hover:-translate-y-1 active:translate-y-0"
                        >
                          <ArrowRight size={18} /> Hurrengoa
                        </button>
                      )}
                    </div>

                  </div>
                )}

                {/* Tips */}
                <div className="mt-10 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-800">
                  <p className="font-bold mb-2">Aholkuak:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Lehenik, zenbat maila mugitu behar diren kontatu eskailaran.</li>
                    <li>Unitate txikiagora bihurtzean, 10ez biderkatu maila bakoitzeko.</li>
                    <li>Unitate handiagora bihurtzean, 10ez zatitu maila bakoitzeko.</li>
                    <li>Denbora unitateetarako, gogoratu faktoreak (60, 24, 7) ez direla hamartarrak.</li>
                  </ul>
                </div>

              </div>
            </Section>
          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
