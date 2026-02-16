import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { BookOpen, Lock, ArrowRight, Check, RefreshCw, Zap, ListOrdered, KeyRound, ShieldCheck, Unlock, FlaskConical, Calculator, GraduationCap, ChevronRight, RotateCcw } from 'lucide-react';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-md p-6 mb-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-sky-100 p-2 rounded-xl">
        <Icon className="w-6 h-6 text-sky-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

function shiftChar(char, shift, decode = false) {
  const upper = char.toUpperCase();
  const idx = alphabet.indexOf(upper);
  if (idx === -1) return char;
  const direction = decode ? -1 : 1;
  const newIdx = ((idx + direction * shift) % 26 + 26) % 26;
  const result = alphabet[newIdx];
  return char === upper ? result : result.toLowerCase();
}

function caesarCipher(text, shift, decode = false) {
  return text
    .split('')
    .map((ch) => shiftChar(ch, shift, decode))
    .join('');
}

function generateProblem() {
  const messages = [
    'KRIPTOGRAFIA INTERESGARRIA DA',
    'MATEMATIKAK MUNDUA ALDATZEN DU',
    'ZIFRATZE ALGORITMOAK GARRANTZITSUAK DIRA',
    'SEGURTASUNA FUNTSEZKOA DA INTERNETEN',
    'ZESAR ENPERADOREAREN ZIFRATZEA',
    'MEZU SEKRETUAK BIDALTZEA',
    'KODEA ASMATZEN JAKITEA',
    'EUSKAL HERRIA MAITE DUT',
    'GAUR EGUN KRIPTOGRAFIA NONAHI DAGO',
    'INFORMATIKA ETA MATEMATIKA ELKARTZEN DIRA',
    'ALGORITMOAK EGUNEROKO BIZITZAN',
    'DATU BABESAREN GARRANTZIA',
    'PASAHITZ SEGURUAK ERABILI',
    'TEKNOLOGIA AURRERA DOA',
    'ZIENTZIAK ETORKIZUNA ERAIKITZEN DU',
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const shift = Math.floor(Math.random() * 25) + 1;
  const encrypted = caesarCipher(msg, shift);
  return { original: msg, shift, encrypted };
}

export default function Kriptografia() {
  const [activeTab, setActiveTab] = useState('Teoria');
  const tabs = ['Teoria', 'Laborategia', 'Formulak', 'Praktika'];

  // Laborategia state
  const [labText, setLabText] = useState('Kaixo mundua');
  const [labShift, setLabShift] = useState(3);
  const [labDecode, setLabDecode] = useState(false);

  const labResult = useMemo(
    () => caesarCipher(labText, labShift, labDecode),
    [labText, labShift, labDecode]
  );

  const shiftedAlphabet = useMemo(
    () =>
      alphabet
        .split('')
        .map((ch) => shiftChar(ch, labShift, false))
        .join(''),
    [labShift]
  );

  // Formulak state
  const [formulaShift, setFormulaShift] = useState(3);

  // Praktika state
  const [problem, setProblem] = useState(() => generateProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const { score: correctCount, total, addCorrect, addIncorrect, reset } = useProgress('kriptografia');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = useCallback(() => {
    const normalise = (s) => s.toUpperCase().trim();
    if (normalise(userAnswer) === normalise(problem.original)) {
      addCorrect();
      setFeedback('correct');
    } else {
      addIncorrect();
      setFeedback('incorrect');
    }
  }, [userAnswer, problem]);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  }, []);

  // Tab icon mapping
  const tabIcons = {
    Teoria: BookOpen,
    Laborategia: FlaskConical,
    Formulak: Calculator,
    Praktika: GraduationCap,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* NAV BAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sky-600 font-extrabold text-xl hover:text-sky-700 transition-colors">
            <KeyRound className="w-7 h-7" />
            <span>MATE.EUS</span>
          </Link>
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                      : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden py-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 opacity-10" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Lock className="w-4 h-4" />
            Mezu sekretuak
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-500 bg-clip-text text-transparent">
              Kriptografia
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Ikasi mezuak zifratzeko eta deszifratzeko artea, Zesarren zifratzea oinarri hartuta. Matematikak sekretuak gordetzen laguntzen du!
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 pb-16">
        {/* ======================== TEORIA ======================== */}
        {activeTab === 'Teoria' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Kriptografiaren Historia" icon={BookOpen}>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kriptografia mezu sekretuak bidaltzeko zientzia eta artea da. Antzinaroan, armadek eta gobernuek erabiltzen zuten
                informazioa babesteko. Hitza grezieratik dator: <strong>kryptos</strong> (ezkutua) eta <strong>graphein</strong> (idaztea).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Gaur egun, kriptografia gure eguneroko bizitzan dago: mezu elektronikoak, banku-transferentziak,
                pasahitzak eta web orrialdeak babesten ditu. Interneten segurtasunaren oinarria da.
              </p>
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <h3 className="font-bold text-sky-700 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Kontzeptu nagusiak
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                    <span><strong>Zifratzea (Enkriptatzea):</strong> Testu arrunta (irakurgarria) testu zifratuan (irakurgaitzean) bihurtzea gako baten bidez.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                    <span><strong>Deszifratzea (Desenkriptatzea):</strong> Testu zifratua berriro testu arruntean bihurtzea gakoa erabiliz.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                    <span><strong>Gakoa:</strong> Zifratze-prozesuaren parametroa. Gakorik gabe, mezua ezin da deszifratu (teorian).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                    <span><strong>Testu arrunta:</strong> Jatorrizko mezua, irakurgarria dena.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                    <span><strong>Testu zifratua:</strong> Zifratutako mezua, irakurgaitza dena gakorik gabe.</span>
                  </li>
                </ul>
              </div>
            </Section>

            <Section title="Zesarren Zifratzea" icon={Lock}>
              <p className="text-gray-700 leading-relaxed mb-4">
                Julio Zesarrek (K.a. 100 - K.a. 44) bere mezuak babesteko erabiltzen zuen metodoa da.
                Oso erraza da: alfabetoaren letra bakoitza posizio kopuru jakin batez mugitzen da.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Adibidez, <strong>3 posizio</strong>ko desplazamenduarekin:
              </p>

              {/* Visual alphabet shift */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 overflow-x-auto">
                <p className="text-sm font-semibold text-gray-500 mb-2">Jatorrizko alfabetoa:</p>
                <div className="flex gap-1 mb-3 min-w-max">
                  {alphabet.split('').map((ch, i) => (
                    <div
                      key={`orig-${i}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-700"
                    >
                      {ch}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mb-3">
                  <ArrowRight className="w-5 h-5 text-sky-500 rotate-90" />
                  <span className="ml-2 text-sm text-sky-600 font-semibold">+3 posizio</span>
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-2">Zifratutako alfabetoa:</p>
                <div className="flex gap-1 min-w-max">
                  {alphabet.split('').map((ch, i) => {
                    const shifted = shiftChar(ch, 3, false);
                    return (
                      <div
                        key={`shift-${i}`}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-sky-100 border border-sky-200 text-sm font-bold text-sky-700"
                      >
                        {shifted}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <h3 className="font-bold text-sky-700 mb-2">Adibidea (desplazamendua = 3):</h3>
                <div className="space-y-1 text-gray-700">
                  <p>
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-gray-800">KAIXO</span>
                    <ArrowRight className="w-4 h-4 inline mx-2 text-sky-500" />
                    <span className="font-mono bg-sky-200 px-2 py-0.5 rounded text-sky-800">NDLAR</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    K(+3)=N, A(+3)=D, I(+3)=L, X(+3)=A, O(+3)=R
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Nola funtzionatzen du?" icon={Zap}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Zifratzea
                  </h3>
                  <ol className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <span>Aukeratu gakoa (desplazamendu-zenbakia, adibidez 3).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <span>Letra bakoitzeko, aurreratu gako posizio alfabetoan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <span>Z-tik pasatzen bada, A-tik berriz hasi (biribilean).</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h3 className="font-bold text-amber-700 mb-2 flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    Deszifratzea
                  </h3>
                  <ol className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <span>Jakin gakoa (desplazamendu-zenbakia).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <span>Letra bakoitzeko, atzeratu gako posizio alfabetoan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <span>A-tik pasatzen bada, Z-tik berriz hasi (biribilean).</span>
                    </li>
                  </ol>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ======================== LABORATEGIA ======================== */}
        {activeTab === 'Laborategia' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Zesarren Zifratze Tresna" icon={FlaskConical}>
              <p className="text-gray-600 mb-6">
                Idatzi testu bat, aukeratu desplazamendua eta ikusi nola zifratzen edo deszifratzen den denbora errealean.
              </p>

              {/* Mode toggle */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-sm font-semibold ${!labDecode ? 'text-sky-600' : 'text-gray-400'}`}>Zifratu</span>
                <button
                  onClick={() => setLabDecode(!labDecode)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${labDecode ? 'bg-amber-500' : 'bg-sky-500'}`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      labDecode ? 'translate-x-7' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className={`text-sm font-semibold ${labDecode ? 'text-amber-600' : 'text-gray-400'}`}>Deszifratu</span>
              </div>

              {/* Text input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {labDecode ? 'Testu zifratua' : 'Testu arrunta'}
                </label>
                <textarea
                  value={labText}
                  onChange={(e) => setLabText(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none resize-none"
                  rows={3}
                  placeholder="Idatzi testua hemen..."
                />
              </div>

              {/* Shift slider */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Desplazamendua (Gakoa): <span className="text-sky-600 text-lg">{labShift}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={labShift}
                  onChange={(e) => setLabShift(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1</span>
                  <span>13</span>
                  <span>25</span>
                </div>
              </div>

              {/* Result */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {labDecode ? 'Testu arrunta (emaitza)' : 'Testu zifratua (emaitza)'}
                </label>
                <div className="w-full bg-sky-50 border border-sky-200 rounded-xl p-3 text-sky-800 font-mono text-lg min-h-[3rem] break-all">
                  {labResult || <span className="text-gray-400 italic">Emaitza hemen agertuko da...</span>}
                </div>
              </div>

              {/* Shifted alphabet mapping */}
              <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
                <h3 className="text-sm font-bold text-gray-600 mb-3">Alfabetoaren mapa (desplazamendua = {labShift}):</h3>
                <div className="min-w-max">
                  <div className="flex gap-1 mb-1">
                    <div className="w-20 text-xs font-semibold text-gray-500 flex items-center">Jatorrizkoa:</div>
                    {alphabet.split('').map((ch, i) => (
                      <div
                        key={`lab-orig-${i}`}
                        className="w-9 h-9 flex items-center justify-center rounded-t-lg bg-white border border-gray-200 text-sm font-bold text-gray-700"
                      >
                        {ch}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-20 text-xs font-semibold text-sky-500 flex items-center">Zifratua:</div>
                    {shiftedAlphabet.split('').map((ch, i) => (
                      <div
                        key={`lab-shift-${i}`}
                        className="w-9 h-9 flex items-center justify-center rounded-b-lg bg-sky-100 border border-sky-200 text-sm font-bold text-sky-700"
                      >
                        {ch}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ======================== FORMULAK ======================== */}
        {activeTab === 'Formulak' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Zesarren Zifratzearen Formula" icon={Calculator}>
              <p className="text-gray-700 leading-relaxed mb-6">
                Zesarren zifratzea matematikoki adieraz daiteke aritmetika modularra erabiliz.
                Letra bakoitzari zenbaki bat esleitzen zaio (A=0, B=1, ..., Z=25) eta formula hauek aplikatzen dira:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-5 border border-green-100 text-center">
                  <h3 className="font-bold text-green-700 mb-3 flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    Zifratzea
                  </h3>
                  <div className="text-2xl font-mono font-bold text-green-800 bg-white rounded-lg py-3 px-4 inline-block shadow-sm">
                    C = (P + K) mod 26
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Non <strong>C</strong> = testu zifratua, <strong>P</strong> = testu arrunta, <strong>K</strong> = gakoa (desplazamendua)
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
                  <h3 className="font-bold text-amber-700 mb-3 flex items-center justify-center gap-2">
                    <Unlock className="w-5 h-5" />
                    Deszifratzea
                  </h3>
                  <div className="text-2xl font-mono font-bold text-amber-800 bg-white rounded-lg py-3 px-4 inline-block shadow-sm">
                    D = (C - K) mod 26
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Non <strong>D</strong> = testu deszifratua, <strong>C</strong> = testu zifratua, <strong>K</strong> = gakoa (desplazamendua)
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Aritmetika Modularra" icon={ListOrdered}>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Aritmetika modularra</strong> zenbakien zatiketa egiterakoan lortzen den hondarra erabiltzean datza.
                <em> mod 26</em> eragiketak 26z zatitzean lortzen den hondarra ematen du. Hau beharrezkoa da alfabetoak 26 letra dituelako,
                eta Z-tik pasatzean berriro A-ra itzuli behar dugulako.
              </p>

              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 mb-6">
                <h3 className="font-bold text-sky-700 mb-2">Adibideak:</h3>
                <div className="space-y-2 text-gray-700 font-mono text-sm">
                  <p>A(0) + 3 = 3 mod 26 = 3 → D ✓</p>
                  <p>X(23) + 3 = 26 mod 26 = 0 → A ✓</p>
                  <p>Y(24) + 3 = 27 mod 26 = 1 → B ✓</p>
                  <p>Z(25) + 3 = 28 mod 26 = 2 → C ✓</p>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Ikusi nola X, Y eta Z letrek berriro hasierara itzultzen diren mod 26 eragiketari esker.
                </p>
              </div>
            </Section>

            <Section title="Alfabetoaren Mapa Osoa" icon={ListOrdered}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Aukeratu desplazamendua: <span className="text-sky-600 text-lg">{formulaShift}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={formulaShift}
                  onChange={(e) => setFormulaShift(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="px-1 py-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-tl-lg">Letra</th>
                      <th className="px-1 py-2 text-xs font-semibold text-gray-500 bg-gray-50">Zenbakia (P)</th>
                      <th className="px-1 py-2 text-xs font-semibold text-gray-500 bg-gray-50">P + {formulaShift}</th>
                      <th className="px-1 py-2 text-xs font-semibold text-gray-500 bg-gray-50">(P + {formulaShift}) mod 26</th>
                      <th className="px-1 py-2 text-xs font-semibold text-sky-500 bg-sky-50 rounded-tr-lg">Emaitza</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alphabet.split('').map((ch, i) => {
                      const sum = i + formulaShift;
                      const result = sum % 26;
                      return (
                        <tr key={`table-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-1 py-1.5 font-bold text-gray-800">{ch}</td>
                          <td className="px-1 py-1.5 text-gray-600 font-mono">{i}</td>
                          <td className="px-1 py-1.5 text-gray-600 font-mono">{sum}</td>
                          <td className="px-1 py-1.5 text-gray-600 font-mono">{result}</td>
                          <td className="px-1 py-1.5 font-bold text-sky-700 bg-sky-50">{alphabet[result]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        )}

        {/* ======================== PRAKTIKA ======================== */}
        {activeTab === 'Praktika' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Puntuazioa" icon={Zap}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-sky-600">{correctCount}</div>
                  <div className="text-xs text-gray-500">Zuzenak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-gray-400">{total}</div>
                  <div className="text-xs text-gray-500">Guztira</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-amber-500">
                    {total > 0 ? Math.round((correctCount / total) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">Ehunekoa</div>
                </div>
                <button
                  onClick={() => reset()}
                  className="ml-auto text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Berrezarri
                </button>
              </div>
            </Section>

            <Section title="Deszifratu Mezua" icon={GraduationCap}>
              <div className="bg-sky-50 rounded-xl p-5 border border-sky-100 mb-6">
                <p className="text-sm text-gray-500 mb-1">Mezu zifratua:</p>
                <p className="text-xl font-mono font-bold text-sky-800 break-all mb-4">
                  {problem.encrypted}
                </p>
                <p className="text-sm text-gray-600">
                  Desplazamendua (Gakoa): <span className="font-bold text-sky-700 text-lg">{problem.shift}</span>
                </p>
              </div>

              {showHint && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-4">
                  <p className="text-sm text-amber-700">
                    <strong>Laguntza:</strong> Letra bakoitza {problem.shift} posizio atzeratu behar duzu alfabetoan.
                    Adibidez, lehen letra <strong>{problem.encrypted[0]}</strong> da. Atzeratu {problem.shift} posizio eta lortuko duzu{' '}
                    <strong>{problem.original[0]}</strong>.
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Zure erantzuna (testu deszifratua):
                </label>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-gray-800 font-mono focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none uppercase"
                  placeholder="Idatzi desenkriptatutako mezua hemen..."
                  disabled={feedback !== null}
                />
              </div>

              {feedback === null && (
                <div className="flex gap-3">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-sky-200"
                  >
                    <Check className="w-4 h-4" />
                    Egiaztatu
                  </button>
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 font-semibold rounded-xl hover:bg-amber-200 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Laguntza
                  </button>
                </div>
              )}

              {feedback === 'correct' && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                  <p className="text-green-700 font-bold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Oso ondo! Erantzun zuzena da!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Jatorrizko mezua: <span className="font-mono font-bold">{problem.original}</span>
                  </p>
                  <button
                    onClick={nextProblem}
                    className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-md shadow-sky-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Hurrengo ariketa
                  </button>
                </div>
              )}

              {feedback === 'incorrect' && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-4">
                  <p className="text-red-700 font-bold flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Oker! Saiatu berriro hurrengo ariketarekin.
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Erantzun zuzena: <span className="font-mono font-bold">{problem.original}</span>
                  </p>
                  <button
                    onClick={nextProblem}
                    className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-md shadow-sky-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Hurrengo ariketa
                  </button>
                </div>
              )}
            </Section>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm">
            <a
              href="https://mate.eus"
              className="text-sky-400 hover:text-sky-300 transition-colors font-semibold"
            >
              Mate.eus
            </a>{' '}
            &copy; 2026. Egilea:{' '}
            <a
              href="https://berezuma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Beñat Erezuma
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
