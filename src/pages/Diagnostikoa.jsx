import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  Brain,
  Target,
  MessageSquare,
  Heart,
  BarChart3,
  BookOpen,
  Home,
  ChevronRight,
  Award,
  AlertTriangle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

/* ─────────────────────────────────────────────
   DBH2 EBALUAZIO DIAGNOSTIKO INTERAKTIBOA
   ISEI-IVEI ereduaren arabera
   ───────────────────────────────────────────── */

// --- Dimentsioak ---
const DIMENTSIOAK = {
  ebazpena: { izena: 'Problemen Ebazpena', icon: Target, color: 'indigo' },
  arrazoitzea: { izena: 'Arrazoitzea eta Argumentatzea', icon: Brain, color: 'purple' },
  komunikazioa: { izena: 'Komunikazioa eta Konexioa', icon: MessageSquare, color: 'teal' },
  sozioemozionala: { izena: 'Dimentsio Sozioemozionala', icon: Heart, color: 'rose' },
};

// --- Kognizio Mailak ---
const KOGNIZIO_MAILAK = {
  ugalketa: { izena: 'Oinarrizkoa (Ugalketa)', kolore: 'bg-green-100 text-green-700' },
  konexioa: { izena: 'Ertaina (Konexioa)', kolore: 'bg-yellow-100 text-yellow-700' },
  hausnarketa: { izena: 'Aurreratua (Hausnarketa)', kolore: 'bg-red-100 text-red-700' },
};

// --- Testuinguruak ---
const TESTUINGURUAK = {
  pertsonala: 'Pertsonala',
  soziala: 'Soziala',
  profesionala: 'Profesionala',
  zientifikoa: 'Zientifikoa',
};

// --- 10 Galdera ---
const GALDERAK = [
  {
    id: 1,
    galdera: 'Dendari batek produktu bat %20 merketzen du. Jatorrizko prezioa 45 € bada, zein da prezio berria?',
    aukerak: ['36 €', '25 €', '40 €', '9 €'],
    erantzunZuzena: 0,
    azalpena: '45 × 0.20 = 9 € deskontua. Prezio berria: 45 − 9 = 36 €.',
    dimentsioa: 'ebazpena',
    kognizioMaila: 'ugalketa',
    edukia: 'Arrazoibide proportzionala',
    testuingurua: 'pertsonala',
    konpetentziaKodeak: ['KE1'],
    gaiGomendatua: { izena: 'Proportzionaltasuna', link: '/proportzionaltasuna' },
  },
  {
    id: 2,
    galdera: 'Zein da hurrengo segidaren arau orokorra? 3, 7, 11, 15, 19, …',
    aukerak: ['4n − 1', '3n + 1', '2n + 1', 'n + 4'],
    erantzunZuzena: 0,
    azalpena: 'Segida aritmetikoa da, d = 4. Arau orokorra: aₙ = 4n − 1 (n = 1, 2, 3...).',
    dimentsioa: 'arrazoitzea',
    kognizioMaila: 'konexioa',
    edukia: 'Patroiak eta Funtzioak',
    testuingurua: 'zientifikoa',
    konpetentziaKodeak: ['KE3', 'KE4'],
    gaiGomendatua: { izena: 'Segidak', link: '/segidak' },
  },
  {
    id: 3,
    galdera: 'Laukizuzen baten azalera 48 cm² da eta zabalera 6 cm. Zein da perimetroa?',
    aukerak: ['28 cm', '20 cm', '24 cm', '54 cm'],
    erantzunZuzena: 0,
    azalpena: 'Luzera = 48 ÷ 6 = 8 cm. Perimetroa = 2 × (8 + 6) = 28 cm.',
    dimentsioa: 'ebazpena',
    kognizioMaila: 'konexioa',
    edukia: 'Geometria',
    testuingurua: 'profesionala',
    konpetentziaKodeak: ['KE1', 'KE5'],
    gaiGomendatua: { izena: 'Azalerak eta Bolumenak', link: '/azalerak-bolumenak' },
  },
  {
    id: 4,
    galdera: 'Ekuazio hau ebatzi: 3x + 7 = 22. Zenbat balio du x-ak?',
    aukerak: ['5', '7', '3', '15'],
    erantzunZuzena: 0,
    azalpena: '3x + 7 = 22 → 3x = 15 → x = 5.',
    dimentsioa: 'ebazpena',
    kognizioMaila: 'ugalketa',
    edukia: 'Aljebra',
    testuingurua: 'zientifikoa',
    konpetentziaKodeak: ['KE1'],
    gaiGomendatua: { izena: 'Lehen Mailako Ekuazioak', link: '/lehen-mailakoa' },
  },
  {
    id: 5,
    galdera: 'Zenbaki multzo batean: 4, 7, 7, 9, 3. Zein da mediana?',
    aukerak: ['7', '6', '4', '9'],
    erantzunZuzena: 0,
    azalpena: 'Ordenatuta: 3, 4, 7, 7, 9. Mediana = erdiko balioa = 7.',
    dimentsioa: 'komunikazioa',
    kognizioMaila: 'ugalketa',
    edukia: 'Estatistika',
    testuingurua: 'soziala',
    konpetentziaKodeak: ['KE6', 'KE7'],
    gaiGomendatua: { izena: 'Estatistika eta Probabilitatea', link: '/estatistika' },
  },
  {
    id: 6,
    galdera: 'Auto batek 3 ordutan 210 km egiten ditu. Zenbat km egingo ditu 5 ordutan abiadura berdinean?',
    aukerak: ['350 km', '300 km', '420 km', '250 km'],
    erantzunZuzena: 0,
    azalpena: 'Abiadura = 210 ÷ 3 = 70 km/h. 5 ordutan: 70 × 5 = 350 km.',
    dimentsioa: 'arrazoitzea',
    kognizioMaila: 'konexioa',
    edukia: 'Arrazoibide proportzionala',
    testuingurua: 'pertsonala',
    konpetentziaKodeak: ['KE2', 'KE3'],
    gaiGomendatua: { izena: 'Proportzionaltasuna', link: '/proportzionaltasuna' },
  },
  {
    id: 7,
    galdera: 'Kalkulatu: (−3)² + √16 − 2³',
    aukerak: ['5', '1', '−1', '13'],
    erantzunZuzena: 0,
    azalpena: '(−3)² = 9, √16 = 4, 2³ = 8. Beraz: 9 + 4 − 8 = 5.',
    dimentsioa: 'ebazpena',
    kognizioMaila: 'konexioa',
    edukia: 'Kalkulua',
    testuingurua: 'zientifikoa',
    konpetentziaKodeak: ['KE1', 'KE8'],
    gaiGomendatua: { izena: 'Berreturak eta Erroak', link: '/berreturak-erroak' },
  },
  {
    id: 8,
    galdera: 'Ikasgela batean 30 ikasle daude. %60ak futbola gustuko du. Horietatik %50ak saskibaloiak ere gustuko du. Zenbat ikaslek bi kirolak gustuko dituzte?',
    aukerak: ['9', '15', '18', '12'],
    erantzunZuzena: 0,
    azalpena: 'Futbol-zalea: 30 × 0.60 = 18. Bi kirolak: 18 × 0.50 = 9.',
    dimentsioa: 'arrazoitzea',
    kognizioMaila: 'hausnarketa',
    edukia: 'Arrazoibide proportzionala',
    testuingurua: 'soziala',
    konpetentziaKodeak: ['KE2', 'KE3', 'KE9'],
    gaiGomendatua: { izena: 'Proportzionaltasuna', link: '/proportzionaltasuna' },
  },
  {
    id: 9,
    galdera: 'Taula honetan x eta y-ren arteko erlazioa zein da? x: 1, 2, 3, 4 → y: 5, 8, 11, 14',
    aukerak: ['y = 3x + 2', 'y = 2x + 3', 'y = x + 4', 'y = 4x + 1'],
    erantzunZuzena: 0,
    azalpena: 'x=1 → y=5: 3(1)+2=5 ✓. x=2 → y=8: 3(2)+2=8 ✓. Erlazioa: y = 3x + 2.',
    dimentsioa: 'komunikazioa',
    kognizioMaila: 'hausnarketa',
    edukia: 'Patroiak eta Funtzioak',
    testuingurua: 'zientifikoa',
    konpetentziaKodeak: ['KE4', 'KE5', 'KE10'],
    gaiGomendatua: { izena: 'Funtzioen Azterketa', link: '/funtzioak' },
  },
  {
    id: 10,
    galdera: 'Bidaia batean, lehen erdian 60 km/h-ra joan zara eta bigarren erdian 40 km/h-ra. Zein da batez besteko abiadura?',
    aukerak: ['48 km/h', '50 km/h', '45 km/h', '55 km/h'],
    erantzunZuzena: 0,
    azalpena: 'Batez besteko harmonikoa: 2 × 60 × 40 / (60 + 40) = 4800 / 100 = 48 km/h. Ez da batez besteko aritmetikoa!',
    dimentsioa: 'sozioemozionala',
    kognizioMaila: 'hausnarketa',
    edukia: 'Zenbakien zentzua',
    testuingurua: 'pertsonala',
    konpetentziaKodeak: ['KE1', 'KE9', 'KE10'],
    gaiGomendatua: { izena: 'Eragiketa Konbinatuak', link: '/eragiketa-konbinatuak' },
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function Diagnostikoa() {
  useDocumentTitle('Diagnostikoa');
  const [fasea, setFasea] = useState('hasiera'); // hasiera | testa | emaitzak
  const [unekoGaldera, setUnekoGaldera] = useState(0);
  const [erantzunak, setErantzunak] = useState({});
  const [hautatutakoAukera, setHautatutakoAukera] = useState(null);
  const [erakutsiAzalpena, setErakutsiAzalpena] = useState(false);

  const galdera = GALDERAK[unekoGaldera];
  const zuzenak = Object.entries(erantzunak).filter(([, v]) => v.zuzena).length;

  const hasiTesta = () => {
    setFasea('testa');
    setUnekoGaldera(0);
    setErantzunak({});
    setHautatutakoAukera(null);
    setErakutsiAzalpena(false);
  };

  const aukeraHautatu = (index) => {
    if (erakutsiAzalpena) return;
    setHautatutakoAukera(index);
  };

  const erantzunaBaieztatu = () => {
    if (hautatutakoAukera === null) return;
    const zuzena = hautatutakoAukera === galdera.erantzunZuzena;
    setErantzunak(prev => ({
      ...prev,
      [galdera.id]: {
        hautatua: hautatutakoAukera,
        zuzena,
        dimentsioa: galdera.dimentsioa,
        edukia: galdera.edukia,
        kognizioMaila: galdera.kognizioMaila,
        gaiGomendatua: galdera.gaiGomendatua,
      }
    }));
    setErakutsiAzalpena(true);
  };

  const hurrengoGaldera = () => {
    if (unekoGaldera < GALDERAK.length - 1) {
      setUnekoGaldera(prev => prev + 1);
      setHautatutakoAukera(null);
      setErakutsiAzalpena(false);
    } else {
      setFasea('emaitzak');
    }
  };

  // --- Emaitzen analisia ---
  const kalkulatuEmaitzak = () => {
    const dimAnalisia = {};
    const edukiAnalisia = {};
    const okerrekoak = [];

    Object.entries(erantzunak).forEach(([id, info]) => {
      // Dimentsio analisia
      if (!dimAnalisia[info.dimentsioa]) dimAnalisia[info.dimentsioa] = { zuzenak: 0, guztira: 0 };
      dimAnalisia[info.dimentsioa].guztira += 1;
      if (info.zuzena) dimAnalisia[info.dimentsioa].zuzenak += 1;

      // Eduki analisia
      if (!edukiAnalisia[info.edukia]) edukiAnalisia[info.edukia] = { zuzenak: 0, guztira: 0 };
      edukiAnalisia[info.edukia].guztira += 1;
      if (info.zuzena) edukiAnalisia[info.edukia].zuzenak += 1;

      // Okerrekoak
      if (!info.zuzena) {
        okerrekoak.push(info);
      }
    });

    return { dimAnalisia, edukiAnalisia, okerrekoak };
  };

  /* ─── HASIERA PANTAILA ─── */
  if (fasea === 'hasiera') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <Home size={18} />
              <span className="font-medium">Mate.eus</span>
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-indigo-600">Ebaluazio Diagnostikoa</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <ClipboardCheck size={16} />
              ISEI-IVEI ereduan oinarritua
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              DBH2 Ebaluazio <span className="text-indigo-600">Diagnostikoa</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              10 galderako test interaktiboa zure matematika-maila ebaluatzeko.
              Galdera bakoitzak dimentsio bat eta kognizio-maila bat du.
              Amaieran, gomendio pertsonalizatuak jasoko dituzu.
            </p>
          </motion.div>

          {/* Dimentsio eta Kognizio azalpena */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-600" />
                Ebaluatzen diren Dimentsioak
              </h3>
              <ul className="space-y-3">
                {Object.entries(DIMENTSIOAK).map(([key, dim]) => (
                  <li key={key} className="flex items-center gap-3">
                    <div className={`p-1.5 bg-${dim.color}-100 text-${dim.color}-600 rounded-lg`}>
                      <dim.icon size={16} />
                    </div>
                    <span className="text-slate-700 text-sm">{dim.izena}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Brain size={20} className="text-purple-600" />
                Kognizio Mailak
              </h3>
              <ul className="space-y-3">
                {Object.entries(KOGNIZIO_MAILAK).map(([key, maila]) => (
                  <li key={key} className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${maila.kolore}`}>
                      {key === 'ugalketa' ? '1' : key === 'konexioa' ? '2' : '3'}
                    </span>
                    <span className="text-slate-700 text-sm">{maila.izena}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Testuinguruak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10"
          >
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-500" />
              Testuinguruak
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TESTUINGURUAK).map(([key, izena]) => (
                <span key={key} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {izena}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={hasiTesta}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
            >
              Hasi Diagnostikoa
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── TESTA PANTAILA ─── */
  if (fasea === 'testa') {
    const dimInfo = DIMENTSIOAK[galdera.dimentsioa];
    const kogInfo = KOGNIZIO_MAILAK[galdera.kognizioMaila];
    const DimIcon = dimInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                <Home size={18} />
              </Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="font-semibold text-indigo-600 text-sm">Diagnostikoa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-bold text-indigo-600">{unekoGaldera + 1}</span>
              <span>/</span>
              <span>{GALDERAK.length}</span>
            </div>
          </div>
        </nav>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((unekoGaldera + (erakutsiAzalpena ? 1 : 0)) / GALDERAK.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={galdera.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Galderaren metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-${dimInfo.color}-100 text-${dimInfo.color}-700 rounded-full text-xs font-medium`}>
                  <DimIcon size={12} />
                  {dimInfo.izena}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${kogInfo.kolore}`}>
                  {kogInfo.izena}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                  {galdera.edukia}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {TESTUINGURUAK[galdera.testuingurua]}
                </span>
              </div>

              {/* Galdera */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                  <span className="text-indigo-500 mr-2">{unekoGaldera + 1}.</span>
                  {galdera.galdera}
                </h2>

                {/* Aukerak */}
                <div className="space-y-3">
                  {galdera.aukerak.map((aukera, idx) => {
                    let estiloa = 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50';

                    if (erakutsiAzalpena) {
                      if (idx === galdera.erantzunZuzena) {
                        estiloa = 'border-green-400 bg-green-50 ring-2 ring-green-200';
                      } else if (idx === hautatutakoAukera && idx !== galdera.erantzunZuzena) {
                        estiloa = 'border-red-400 bg-red-50 ring-2 ring-red-200';
                      } else {
                        estiloa = 'border-slate-200 opacity-50';
                      }
                    } else if (idx === hautatutakoAukera) {
                      estiloa = 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => aukeraHautatu(idx)}
                        disabled={erakutsiAzalpena}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${estiloa}`}
                      >
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 ${
                          erakutsiAzalpena && idx === galdera.erantzunZuzena
                            ? 'bg-green-500 text-white'
                            : erakutsiAzalpena && idx === hautatutakoAukera
                            ? 'bg-red-500 text-white'
                            : idx === hautatutakoAukera
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-slate-700 font-medium">{aukera}</span>
                        {erakutsiAzalpena && idx === galdera.erantzunZuzena && (
                          <CheckCircle size={20} className="ml-auto text-green-500" />
                        )}
                        {erakutsiAzalpena && idx === hautatutakoAukera && idx !== galdera.erantzunZuzena && (
                          <XCircle size={20} className="ml-auto text-red-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Azalpena */}
              <AnimatePresence>
                {erakutsiAzalpena && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-5 mb-6 border ${
                      erantzunak[galdera.id]?.zuzena
                        ? 'bg-green-50 border-green-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {erantzunak[galdera.id]?.zuzena ? (
                        <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`font-bold mb-1 ${erantzunak[galdera.id]?.zuzena ? 'text-green-800' : 'text-amber-800'}`}>
                          {erantzunak[galdera.id]?.zuzena ? 'Ondo dago!' : 'Gaizki, baina ikasi dezagun!'}
                        </p>
                        <p className="text-slate-700 text-sm">{galdera.azalpena}</p>
                        {!erantzunak[galdera.id]?.zuzena && (
                          <Link
                            to={galdera.gaiGomendatua.link}
                            className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            {galdera.gaiGomendatua.izena} landu
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botoiak */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  {galdera.konpetentziaKodeak.map(ke => (
                    <span key={ke} className="mr-2 px-2 py-0.5 bg-slate-100 rounded text-xs font-mono">{ke}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {!erakutsiAzalpena ? (
                    <button
                      onClick={erantzunaBaieztatu}
                      disabled={hautatutakoAukera === null}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                        hautatutakoAukera !== null
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Baieztatu
                      <CheckCircle size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={hurrengoGaldera}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
                    >
                      {unekoGaldera < GALDERAK.length - 1 ? 'Hurrengoa' : 'Emaitzak ikusi'}
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ─── EMAITZAK PANTAILA ─── */
  if (fasea === 'emaitzak') {
    const { dimAnalisia, edukiAnalisia, okerrekoak } = kalkulatuEmaitzak();
    const ehunekoa = Math.round((zuzenak / GALDERAK.length) * 100);

    let mailaMezua, mailaKolore;
    if (ehunekoa >= 80) {
      mailaMezua = 'Bikain! Maila altua duzu.';
      mailaKolore = 'text-green-600';
    } else if (ehunekoa >= 50) {
      mailaMezua = 'Ondo, baina hobetu dezakezu arlo batzuetan.';
      mailaKolore = 'text-yellow-600';
    } else {
      mailaMezua = 'Praktika gehiago behar duzu. Ez kezkatu, hemen laguntzeko gaude!';
      mailaKolore = 'text-red-600';
    }

    // Gomendio bakarrak bilatu
    const gomendioMap = {};
    okerrekoak.forEach(o => {
      const key = o.gaiGomendatua.link;
      if (!gomendioMap[key]) {
        gomendioMap[key] = { ...o.gaiGomendatua, edukiak: [] };
      }
      gomendioMap[key].edukiak.push(o.edukia);
    });
    const gomendioUniqueList = Object.values(gomendioMap);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <Home size={18} />
              <span className="font-medium">Mate.eus</span>
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-indigo-600">Emaitzak</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Puntuazioa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-xl border-4 border-indigo-200 mb-6">
              <div>
                <div className="text-4xl font-extrabold text-indigo-600">{ehunekoa}%</div>
                <div className="text-sm text-slate-500">{zuzenak}/{GALDERAK.length}</div>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Zure Emaitzak</h1>
            <p className={`text-lg font-semibold ${mailaKolore}`}>{mailaMezua}</p>
          </motion.div>

          {/* Dimentsioen analisia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-600" />
              Dimentsioen Analisia
            </h3>
            <div className="space-y-4">
              {Object.entries(DIMENTSIOAK).map(([key, dim]) => {
                const data = dimAnalisia[key];
                if (!data) return null;
                const pct = Math.round((data.zuzenak / data.guztira) * 100);
                const DIcon = dim.icon;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <DIcon size={16} className={`text-${dim.color}-600`} />
                        <span className="text-sm font-medium text-slate-700">{dim.izena}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{data.zuzenak}/{data.guztira} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full rounded-full ${
                          pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Edukien analisia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-purple-600" />
              Edukien Analisia
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(edukiAnalisia).map(([edukia, data]) => {
                const pct = Math.round((data.zuzenak / data.guztira) * 100);
                return (
                  <div key={edukia} className={`p-3 rounded-xl border ${
                    pct >= 75 ? 'bg-green-50 border-green-200' : pct >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{edukia}</span>
                      <span className={`text-sm font-bold ${
                        pct >= 75 ? 'text-green-700' : pct >= 50 ? 'text-yellow-700' : 'text-red-700'
                      }`}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Gomendioak */}
          {gomendioUniqueList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target size={20} className="text-teal-600" />
                Gomendio Pertsonalizatuak
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Zure erantzunen arabera, honako simulagailuak erabiltzea gomendatzen dizugu:
              </p>
              <div className="space-y-3">
                {gomendioUniqueList.map((gom, idx) => (
                  <Link
                    key={idx}
                    to={gom.link}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                  >
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-indigo-700">{gom.izena}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Landu beharreko edukiak: {gom.edukiak.join(', ')}
                      </p>
                    </div>
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Galdera zerrenda xehatua */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-slate-600" />
              Galderen Xehetasuna
            </h3>
            <div className="space-y-2">
              {GALDERAK.map((g, idx) => {
                const info = erantzunak[g.id];
                return (
                  <div key={g.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    info?.zuzena ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    {info?.zuzena ? (
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-slate-700 flex-1">{idx + 1}. {g.galdera.slice(0, 60)}…</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${KOGNIZIO_MAILAK[g.kognizioMaila].kolore}`}>
                      {g.kognizioMaila === 'ugalketa' ? 'Oinarrizkoa' : g.kognizioMaila === 'konexioa' ? 'Ertaina' : 'Aurreratua'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Akzio botoiak */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={hasiTesta}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
            >
              <RotateCcw size={18} />
              Berriro hasi
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all"
            >
              <Home size={18} />
              Hasierara itzuli
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
