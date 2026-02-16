import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  ArrowRight,
  Menu,
  X,
  ClipboardCheck,
  Globe,
  Sigma,
  Shapes,
  TrendingUp,
  Binary,
  PieChart,
  FunctionSquare,
  Divide,
  Scale,
  BookOpen,
  Sparkles,
  Play,
  CheckCircle,
  GraduationCap,
  MousePointerClick,
  Zap,
  Heart,
  Cpu,
  Lock,
  GitBranch,
  Ruler,
  RefreshCw,
  User
} from 'lucide-react';

/* --- ICON HELPERS --- */
const EqualIcon = () => <span className="font-bold text-lg">=</span>;
const GridIcon = () => <div className="grid grid-cols-2 gap-0.5 w-4 h-4"><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div></div>;
const PlusMinusIcon = () => <span className="font-bold text-lg">±</span>;
const SuperscriptIcon = () => <span className="font-bold text-xs flex">x<sup>2</sup></span>;
const TriangleIcon = () => <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-current"></div>;
const ArrowUpRightIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>;


/* --- DATA & CONFIGURATION --- */

const NAV_LINKS = [
  { name: 'Hasiera', href: '#hero' },
  { name: 'Gaiak', href: '#topics' },
  { name: 'Zer Egin', href: '#how-it-works' },
  { name: 'Diagnostikoa', href: '/diagnostikoa', isRoute: true },
  { name: 'USaP', href: '/usap', isRoute: true },
];

const CATEGORIES = [
  { id: 'all', label: 'Denak' },
  { id: 'aritmetika', label: 'Aritmetika', icon: <Calculator className="w-4 h-4" /> },
  { id: 'aljebra', label: 'Aljebra', icon: <Sigma className="w-4 h-4" /> },
  { id: 'geometria', label: 'Geometria', icon: <Shapes className="w-4 h-4" /> },
  { id: 'analisia', label: 'Analisia', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'pk', label: 'Pentsamendu Konputazionala', icon: <Cpu className="w-4 h-4" /> },
];

const RESOURCES = [
  // ===================== DBH 1 =====================
  {
    id: 'int',
    title: 'Zenbaki Osoak',
    description: 'Batuketak, kenketak eta zeinuen erregela.',
    category: 'aritmetika',
    icon: <PlusMinusIcon />,
    color: 'bg-emerald-600',
    colorHex: '#059669',
    link: '/zenbaki-osoak',
    isNew: false,
    preview: '(-3) + (+7) = ?'
  },
  {
    id: 'erag-konb',
    title: 'Eragiketa Konbinatuak',
    description: 'Eragiketen hierarkia, parentesiak eta PEMDAS erregela.',
    category: 'aritmetika',
    icon: <Calculator />,
    color: 'bg-emerald-400',
    colorHex: '#34d399',
    link: '/eragiketa-konbinatuak',
    isNew: true,
    preview: '3 + 2 × (8 - 3) = ?'
  },
  {
    id: 'zatigarri',
    title: 'Zatigarritasuna',
    description: 'Zatigarritasun irizpideak, faktore lehenak eta ZKT/HKM.',
    category: 'aritmetika',
    icon: <Divide />,
    color: 'bg-teal-400',
    colorHex: '#2dd4bf',
    link: '/zatigarritasuna',
    isNew: true,
    preview: '360 = 2³ × 3² × 5'
  },
  {
    id: 'zen-hamar',
    title: 'Zenbaki Hamartarrak',
    description: 'Eragiketak, hamartarretik zatikira eta alderantziz.',
    category: 'aritmetika',
    icon: <Calculator />,
    color: 'bg-green-400',
    colorHex: '#4ade80',
    link: '/zenbaki-hamartarrak',
    isNew: true,
    preview: '0.75 = ³⁄₄'
  },
  {
    id: 'frac',
    title: 'Zatikiak (Hutsetik)',
    description: 'Eragiketak, sinplifikazioa eta zatiki aljebraikoak.',
    category: 'aritmetika',
    icon: <Divide />,
    color: 'bg-emerald-500',
    colorHex: '#10b981',
    link: '/zatikiak',
    isNew: false,
    preview: '³⁄₄ + ²⁄₅ = ?'
  },
  {
    id: 'zatiki-sortzailea',
    title: 'Zatiki Sortzailea',
    description: 'Ausazko zatikiak sortu eta ebazteko ariketa-sortzailea.',
    category: 'aritmetika',
    icon: <RefreshCw />,
    color: 'bg-green-600',
    colorHex: '#16a34a',
    link: '/zatiki-sortzailea',
    isNew: true,
    preview: '²⁄₃ + ⁴⁄₅ = ?'
  },
  {
    id: 'unitate-aldaketak',
    title: 'Unitate Aldaketak',
    description: 'Unitate bihurgailua: luzera, masa, bolumena, denbora.',
    category: 'aritmetika',
    icon: <Ruler />,
    color: 'bg-teal-500',
    colorHex: '#14b8a6',
    link: '/unitate-aldaketak',
    isNew: true,
    preview: '1 km = 1000 m'
  },
  {
    id: 'sexagesimal',
    title: 'Sistema Sexagesimala',
    description: 'Graduak/minutuak/segundoak, bihurketak eta angeluen eragiketak.',
    category: 'geometria',
    icon: <Shapes />,
    color: 'bg-orange-600',
    colorHex: '#ea580c',
    link: '/sistema-sexagesimala',
    isNew: true,
    preview: '45° 30\' 20"'
  },
  {
    id: 'area',
    title: 'Azalerak eta Bolumenak',
    description: 'Gorputz geometrikoak, perimetroak eta formulak.',
    category: 'geometria',
    icon: <Shapes />,
    color: 'bg-amber-600',
    colorHex: '#d97706',
    link: '/azalerak-bolumenak',
    isNew: true
  },

  // ===================== DBH 2 =====================
  {
    id: 'pot',
    title: 'Berreturak eta Erroak',
    description: 'Berreturen propietateak eta erradikalen eragiketak.',
    category: 'aritmetika',
    icon: <SuperscriptIcon />,
    color: 'bg-teal-500',
    colorHex: '#14b8a6',
    link: '/berreturak-erroak',
    isNew: true,
    preview: '2⁵ = 32'
  },
  {
    id: 'prop',
    title: 'Proportzionaltasuna',
    description: 'Hiru-erregelak, ehunekoak eta banaketak.',
    category: 'aritmetika',
    icon: <Scale />,
    color: 'bg-teal-600',
    colorHex: '#0d9488',
    link: '/proportzionaltasuna',
    isNew: true,
    preview: 'a/b = c/d'
  },
  {
    id: 'ecu-1',
    title: 'Lehen Mailako Ekuazioak',
    description: 'Berdintzak, ezezagunak bakartzea eta oinarrizko problemak.',
    category: 'aljebra',
    icon: <EqualIcon />,
    color: 'bg-indigo-500',
    colorHex: '#6366f1',
    link: '/lehen-mailakoa',
    isNew: false,
    preview: '2x + 5 = 13'
  },
  {
    id: 'num-sys',
    title: 'Zenbaki Sistemak',
    description: 'Binarioa, Hamartarra eta Hexadezimala.',
    category: 'aritmetika',
    icon: <Binary />,
    color: 'bg-green-500',
    colorHex: '#22c55e',
    link: '/zenbaki-sistemak',
    isNew: true
  },
  {
    id: 'antzekotasuna',
    title: 'Antzekotasuna - Tales',
    description: 'Tales-en teorema, irudi antzekoak eta kalkulagailua.',
    category: 'geometria',
    icon: <Shapes />,
    color: 'bg-amber-500',
    colorHex: '#f59e0b',
    link: '/antzekotasuna-tales',
    isNew: true,
    preview: 'a/a\' = b/b\' = c/c\''
  },
  {
    id: 'stat',
    title: 'Estatistika eta Probabilitatea',
    description: 'Datuen analisia, grafikoak eta zorizko gertaerak.',
    category: 'analisia',
    icon: <PieChart />,
    color: 'bg-pink-500',
    colorHex: '#ec4899',
    link: '/estatistika',
    isNew: true
  },

  // ===================== DBH 3 =====================
  {
    id: 'polinom',
    title: 'Polinomioak eta Monomioak',
    description: 'Eragiketak, Ruffini, faktorizazioa eta erroak.',
    category: 'aljebra',
    icon: <Sigma />,
    color: 'bg-purple-500',
    colorHex: '#a855f7',
    link: '/polinomioak',
    isNew: true
  },
  {
    id: 'produktu-nabar',
    title: 'Produktu Nabarmenak',
    description: '(a+b)², (a-b)², (a+b)(a-b) formula eta praktika.',
    category: 'aljebra',
    icon: <Sigma />,
    color: 'bg-purple-500',
    colorHex: '#a855f7',
    link: '/produktu-nabarmenak',
    isNew: true,
    preview: '(a + b)² = a² + 2ab + b²'
  },
  {
    id: 'ecu-2',
    title: 'Bigarren Mailako Ekuazioak',
    description: 'Parabolak, formula orokorra, diskriminatzailea eta ariketa interaktiboak.',
    category: 'aljebra',
    icon: <FunctionSquare />,
    color: 'bg-indigo-600',
    colorHex: '#4f46e5',
    link: '/bigarren-mailakoa',
    isNew: false,
    preview: 'ax² + bx + c = 0'
  },
  {
    id: 'sys-2x2',
    title: 'Ekuazio Sistemak (2x2)',
    description: 'Ordezkatzea, berdintzea eta laburtzea metodoak.',
    category: 'aljebra',
    icon: <GridIcon />,
    color: 'bg-indigo-400',
    colorHex: '#818cf8',
    link: '/sistemak-2x2',
    isNew: true,
    preview: '{ x + y = 5\n{ 2x - y = 1'
  },

  // ===================== DBH 4 =====================
  {
    id: 'inekuazioak',
    title: 'Inekuazioak eta Tarteak',
    description: 'Inekuazio linealak, grafikoak eta tarteak zenbaki-zuzenean.',
    category: 'aljebra',
    icon: <Sigma />,
    color: 'bg-indigo-500',
    colorHex: '#6366f1',
    link: '/inekuazioak',
    isNew: true,
    preview: '2x + 3 > 7'
  },
  {
    id: 'func',
    title: 'Funtzioen Azterketa',
    description: 'Eremua, ibilbidea, jarraitutasuna eta limitak.',
    category: 'analisia',
    icon: <TrendingUp />,
    color: 'bg-rose-500',
    colorHex: '#f43f5e',
    link: '/funtzioak',
    isNew: true
  },
  {
    id: 'trig',
    title: 'Trigonometria',
    description: 'Angeluak, sinua, kosinua eta tangentea.',
    category: 'geometria',
    icon: <TriangleIcon />,
    color: 'bg-amber-500',
    colorHex: '#f59e0b',
    link: '/trigonometria',
    isNew: true
  },
  {
    id: 'segidak',
    title: 'Segidak',
    description: 'Segida aritmetikoak eta geometrikoak, n-garren terminoa, batura.',
    category: 'analisia',
    icon: <TrendingUp />,
    color: 'bg-rose-500',
    colorHex: '#f43f5e',
    link: '/segidak',
    isNew: true,
    preview: '2, 5, 8, 11, 14, ...'
  },

  // ===================== BATXILERGOA 1 =====================
  {
    id: 'logaritmoak',
    title: 'Logaritmoak',
    description: 'Logaritmoen propietateak, kalkulagailua eta grafikoak.',
    category: 'aritmetika',
    icon: <Calculator />,
    color: 'bg-emerald-500',
    colorHex: '#10b981',
    link: '/logaritmoak',
    isNew: true,
    preview: 'log₂(8) = 3'
  },
  {
    id: 'vec',
    title: 'Bektoreak',
    description: 'Modulua, norabidea eta eragiketak planoan.',
    category: 'geometria',
    icon: <ArrowUpRightIcon />,
    color: 'bg-orange-500',
    colorHex: '#f97316',
    link: '/bektoreak',
    isNew: true
  },
  {
    id: 'sys-3x3',
    title: '3x3 Sistemak - Gauss',
    description: 'Gauss-en eliminazio metodoa 3x3 sistemetarako.',
    category: 'aljebra',
    icon: <GridIcon />,
    color: 'bg-purple-600',
    colorHex: '#9333ea',
    link: '/sistemak-3x3',
    isNew: true,
    preview: '{ x + y + z = 6'
  },
  {
    id: 'limiteak',
    title: 'Limiteen Kalkulua',
    description: 'Limitearen definizioa, indeterminazioak (0/0, ∞/∞) eta ebazpena.',
    category: 'analisia',
    icon: <TrendingUp />,
    color: 'bg-red-500',
    colorHex: '#ef4444',
    link: '/limiteak',
    isNew: true,
    preview: 'lim x→∞ f(x)'
  },
  {
    id: 'deriv',
    title: 'Deribatuak',
    description: 'Aldaketa-tasa, optimizazioa eta deribazio-erregelak.',
    category: 'analisia',
    icon: <TrendingUp />,
    color: 'bg-red-500',
    colorHex: '#ef4444',
    link: '/deribatuak',
    isNew: true
  },

  // ===================== BATXILERGOA 2 =====================
  {
    id: 'matriz',
    title: 'Matrizeak eta Determinanteak',
    description: 'Aljebra lineala eta eragiketa matrizialak.',
    category: 'aljebra',
    icon: <GridIcon />,
    color: 'bg-purple-600',
    colorHex: '#9333ea',
    link: '/matrizeak',
    isNew: true
  },
  {
    id: 'integ',
    title: 'Integralak',
    description: 'Azalerak kurben azpian eta jatorrizko funtzioak.',
    category: 'analisia',
    icon: <Sigma />,
    color: 'bg-red-600',
    colorHex: '#dc2626',
    link: '/integralak',
    isNew: true
  },

  // ===================== PENTSAMENDU KONPUTAZIONALA =====================
  {
    id: 'logika-bool',
    title: 'Logika Boolearra',
    description: 'Egia-taulak, ate logikoak (AND/OR/NOT/XOR) eta simulagailu interaktiboa.',
    category: 'pk',
    icon: <Cpu />,
    color: 'bg-cyan-500',
    colorHex: '#06b6d4',
    link: '/logika-boolearra',
    isNew: true,
    preview: 'A AND B = ?'
  },
  {
    id: 'algoritmoak',
    title: 'Algoritmoak',
    description: 'Fluxu-diagrama eraikitzailea, ekuazioak ebazteko pausoak.',
    category: 'pk',
    icon: <GitBranch />,
    color: 'bg-cyan-600',
    colorHex: '#0891b2',
    link: '/algoritmoak',
    isNew: true,
    preview: 'IF...THEN...ELSE'
  },
  {
    id: 'kriptografia',
    title: 'Kriptografia',
    description: 'Zesarren zifratua kodetzailea/dekodetzailea.',
    category: 'pk',
    icon: <Lock />,
    color: 'bg-sky-500',
    colorHex: '#0ea5e9',
    link: '/kriptografia',
    isNew: true,
    preview: 'KAIXO → NDLAR'
  },
];

const FEATURED_TOPICS = [
  {
    ...RESOURCES.find(r => r.id === 'ecu-2'),
    previewFormula: 'x = (-b ± √(b²-4ac)) / 2a',
    previewLabel: 'Grafikoki ikusi parabolak',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    ...RESOURCES.find(r => r.id === 'frac'),
    previewFormula: '³⁄₄ + ²⁄₅ = ²³⁄₂₀',
    previewLabel: 'Zatikiak ikusmenez ulertu',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    ...RESOURCES.find(r => r.id === 'sys-2x2'),
    previewFormula: '{ x + y = 5\n{ 2x - y = 1',
    previewLabel: 'Zuzenak ebakitzen non?',
    gradient: 'from-indigo-400 to-blue-500',
  },
];

const ACTIVE_COUNT = RESOURCES.filter(r => r.link && r.link !== '#').length;

/* --- COMPONENTS --- */

const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute opacity-15 blur-3xl rounded-full ${className}`}
    animate={{
      y: [0, -25, 0],
      x: [0, 15, 0],
      scale: [1, 1.15, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

/* Animated parabola mini-demo for hero */
const ParabolaDemo = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 320;
    const h = canvas.height = 280;
    let frame = 0;
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(99,102,241,0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let i = 0; i < h; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = 'rgba(148,163,184,0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, h * 0.75); ctx.lineTo(w, h * 0.75); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h); ctx.stroke();

      // Animated parabola
      const progress = Math.min(frame / 60, 1);
      const a = 0.008;
      const cx = w * 0.5;
      const cy = h * 0.75;

      ctx.beginPath();
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 8;

      const totalPoints = Math.floor(280 * progress);
      for (let i = -totalPoints; i <= totalPoints; i++) {
        const x = cx + i;
        const y = cy - a * i * i;
        if (i === -totalPoints) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving dot on parabola
      if (progress > 0.3) {
        const t = ((frame * 1.5) % 240) - 120;
        const dotX = cx + t;
        const dotY = cy - a * t * t;

        ctx.beginPath();
        ctx.fillStyle = '#a78bfa';
        ctx.shadowColor = '#a78bfa';
        ctx.shadowBlur = 12;
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Coord label
        const labelX = (t / 20).toFixed(1);
        const labelY = (a * t * t / 2).toFixed(1);
        ctx.fillStyle = 'rgba(167,139,250,0.9)';
        ctx.font = '11px monospace';
        ctx.fillText(`(${labelX}, ${labelY})`, dotX + 8, dotY - 8);
      }

      // Floating math symbols
      const symbols = ['∑', '∫', 'π', '√', 'Δ', '∞'];
      symbols.forEach((s, i) => {
        const angle = (frame * 0.005 + i * Math.PI / 3);
        const radius = 100 + Math.sin(frame * 0.01 + i) * 20;
        const sx = cx + Math.cos(angle) * radius;
        const sy = h * 0.4 + Math.sin(angle) * radius * 0.4;
        const opacity = 0.15 + Math.sin(frame * 0.02 + i) * 0.1;
        ctx.fillStyle = `rgba(129,140,248,${opacity})`;
        ctx.font = '16px serif';
        ctx.fillText(s, sx, sy);
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxWidth: 320, maxHeight: 280 }}
    />
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl tracking-tighter text-white">
          Mate<span className="text-indigo-400">.eus</span>
        </Link>

        <div className="hidden md:flex space-x-8">
          {NAV_LINKS.map((link) => (
            link.isRoute ? (
              <Link key={link.name} to={link.href} className="text-slate-300 hover:text-indigo-400 text-sm font-medium transition-colors">
                {link.name}
              </Link>
            ) : (
              <a key={link.name} href={link.href} className="text-slate-300 hover:text-indigo-400 text-sm font-medium transition-colors">
                {link.name}
              </a>
            )
          ))}
        </div>

        <div className="hidden md:block">
          <a href="#topics" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30">
            Hasi Ikasten
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="flex flex-col p-6 space-y-4">
              {NAV_LINKS.map((link) => (
                link.isRoute ? (
                  <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium">
                    {link.name}
                  </Link>
                ) : (
                  <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium">
                    {link.name}
                  </a>
                )
              ))}
              <a href="#topics" onClick={() => setIsOpen(false)} className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg text-center">
                Hasi Ikasten
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
    <FloatingShape className="bg-indigo-600 w-96 h-96 -top-20 -left-20" delay={0} />
    <FloatingShape className="bg-purple-600 w-72 h-72 top-40 right-10" delay={2} />
    <FloatingShape className="bg-blue-500 w-64 h-64 bottom-20 left-1/3" delay={1} />
    <FloatingShape className="bg-emerald-500 w-48 h-48 top-1/4 right-1/3" delay={3} />
    <FloatingShape className="bg-rose-500 w-40 h-40 bottom-40 right-20" delay={4} />

    <div className="absolute bottom-0 left-0 w-full h-24 bg-slate-50" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>

    <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Euskaraz · Interaktiboa · Doakoa
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Matematika Ikasi,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Esperimentatuz
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-4 max-w-lg leading-relaxed">
          Kaixo! Beñat Erezuma naiz. Proiektu hau matematika euskaraz ikasteko sortu dut: simulagailu interaktiboak, urratsez-urratseko azalpenak eta ariketa ebatziak.
        </p>
        <p className="text-slate-500 text-sm mb-8 max-w-lg leading-relaxed">
          Matematikak ikus eta uki ditzazun.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <a href="#topics" className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1">
            Hasi Ikasten <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#about" className="flex items-center justify-center gap-2 text-slate-300 font-semibold py-4 px-8 rounded-lg border border-slate-700 hover:border-slate-500 hover:text-white transition-all">
            <User className="w-4 h-4" /> Nor naiz ni?
          </a>
        </div>

        {/* Diagnostikoa CTA */}
        <Link to="/diagnostikoa" className="flex items-center gap-3 p-3 mb-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all max-w-lg group">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <ClipboardCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold">DBH2 Ebaluazio Diagnostikoa</p>
            <p className="text-slate-400 text-xs">Zure maila ezagutu eta gomendio pertsonalizatuak jaso</p>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* USaP CTA */}
        <Link to="/usap" className="flex items-center gap-3 p-3 mb-6 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all max-w-lg group">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <GraduationCap className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold">USaP Azterketa Prestaketa</p>
            <p className="text-slate-400 text-xs">Selektibitatea prestatu: ereduak eta test interaktiboak</p>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8">
          {[
            { value: `${ACTIVE_COUNT}`, label: 'Ikasgai' },
            { value: '100+', label: 'Ariketa' },
            { value: '%100', label: 'Doakoa' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative hidden md:block"
      >
        <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-slate-500 text-xs ml-2 font-mono">parabola.eus</span>
          </div>
          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center p-4">
            <ParabolaDemo />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">y = ax² + bx + c</span>
            <span className="flex items-center gap-1 text-indigo-400">
              <MousePointerClick className="w-3 h-3" /> Interaktiboa
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeaturedTopics = () => (
  <section className="py-20 bg-slate-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Nabarmendutakoak</span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Zuzenean probatu</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {FEATURED_TOPICS.map((topic, idx) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              to={topic.link}
              className="group block h-full rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-transparent hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300"
            >
              {/* Colored top bar */}
              <div className={`h-2 bg-gradient-to-r ${topic.gradient}`}></div>

              <div className="p-6">
                {/* Icon + Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${topic.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {topic.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {CATEGORIES.find(c => c.id === topic.category)?.label}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{topic.description}</p>

                {/* Formula preview */}
                <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                  <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap">{topic.previewFormula}</pre>
                  <p className="text-xs text-slate-400 mt-1">{topic.previewLabel}</p>
                </div>

                <div className="flex items-center text-indigo-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                  Hasi orain <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: <BookOpen className="w-7 h-7" />,
      color: 'bg-indigo-100 text-indigo-600',
      title: 'Aukeratu Gaia',
      description: 'Gai aktibo ugari daude prest. Hautatu zure mailara egokitzen dena.',
      number: '01',
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      color: 'bg-purple-100 text-purple-600',
      title: 'Ikasi eta Esperimentatu',
      description: 'Azalpen bisualak, simulagailuak eta adibide ebatziak urratsez urrats.',
      number: '02',
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      color: 'bg-emerald-100 text-emerald-600',
      title: 'Praktikatu',
      description: 'Ariketa interaktiboak berehalako feedbackarekin. Akatsak eginez ikasten da.',
      number: '03',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Metodologia</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Zer egin?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="text-center relative"
            >
              {/* Connector line (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200"></div>
              )}

              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 relative z-10`}>
                {step.icon}
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-widest">{step.number}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ResourceHub = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const progress = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('mate-progress')) || {}; } catch { return {}; }
  }, []);

  const practicedCount = Object.keys(progress).length;

  const filteredResources = activeCategory === 'all'
    ? RESOURCES
    : RESOURCES.filter(r => r.category === activeCategory);

  const getCategoryActiveCount = (catId) => {
    if (catId === 'all') return ACTIVE_COUNT;
    return RESOURCES.filter(r => r.category === catId && r.link && r.link !== '#').length;
  };

  return (
    <section id="topics" className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Eduki guztiak</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {ACTIVE_COUNT} Ikasgai
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Aukeratu lantzea nahi duzun arloa. Gai berriak gehitzen ari gara etengabe.
          </p>
          {practicedCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">
              <CheckCircle className="w-4 h-4" />
              {practicedCount} ikasgai landuta
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => {
            const count = getCategoryActiveCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-lg transform scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.icon}
                {cat.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResources.map((resource) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={resource.id}
              >
                {resource.link && resource.link !== '#' ? (
                  <Link to={resource.link} className="block h-full group bg-white border border-slate-200 hover:border-transparent rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/5 cursor-pointer relative">
                    {/* Colored top border */}
                    <div className={`h-1 ${resource.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          {resource.icon}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {progress[resource.id] && (
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                              {progress[resource.id].bestScore}/{progress[resource.id].bestTotal}
                            </span>
                          )}
                          {resource.isNew && (
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                              BERRIA
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{CATEGORIES.find(c => c.id === resource.category)?.label}</span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2 group-hover:text-indigo-600 transition-colors">{resource.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{resource.description}</p>
                      </div>
                      <div className="flex items-center text-indigo-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                        Sar zaitez <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="block h-full bg-white border border-slate-200 rounded-2xl overflow-hidden opacity-50 cursor-not-allowed relative">
                    <div className="h-1 bg-slate-200"></div>
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 mb-4`}>
                        {resource.icon}
                      </div>
                      <div className="mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{CATEGORIES.find(c => c.id === resource.category)?.label}</span>
                        <h3 className="text-lg font-bold text-slate-700 mt-1 mb-2">{resource.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{resource.description}</p>
                      </div>
                      <div className="flex items-center text-slate-400 text-sm font-bold gap-1">
                        Laster...
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesStrip = () => {
  const features = [
    { icon: <Globe className="w-6 h-6" />, label: 'Euskaraz', color: 'text-emerald-400' },
    { icon: <Heart className="w-6 h-6" />, label: 'Doakoa', color: 'text-rose-400' },
    { icon: <Zap className="w-6 h-6" />, label: 'Interaktiboa', color: 'text-amber-400' },
    { icon: <GraduationCap className="w-6 h-6" />, label: 'DBH & Batxilergoa', color: 'text-indigo-400' },
  ];

  return (
    <section className="py-12 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className={f.color}>{f.icon}</span>
              <span className="text-white font-semibold text-sm md:text-base">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const activeTopics = RESOURCES.filter(r => r.link && r.link !== '#');

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">Mate<span className="text-indigo-400">.eus</span></div>
            <p className="max-w-sm text-sm leading-relaxed mb-4">
              Matematika ikasteko plataforma digitala, euskaraz eta interaktiboa.
              DBH eta Batxilergoko ikasleentzat pentsatua.
            </p>
            <p className="text-xs text-slate-600">
              Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Beñat Erezuma</a>
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Ikasgaiak</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                const topics = activeTopics.filter(t => t.category === cat.id);
                if (topics.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">{cat.label}</p>
                    <ul className="space-y-1">
                      {topics.map((topic) => (
                        <li key={topic.id}>
                          <Link to={topic.link} className="hover:text-indigo-400 transition-colors text-xs">
                            {topic.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link to="/lege-oharra" className="hover:text-indigo-400 transition-colors">Lege Oharra</Link>
            <Link to="/pribatutasun-politika" className="hover:text-indigo-400 transition-colors">Pribatutasuna</Link>
            <Link to="/lizentzia" className="hover:text-indigo-400 transition-colors">Lizentzia</Link>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <span>&copy; 2026 MATE.EUS | Beñat Erezumak egina</span>
            <span className="text-slate-600">CC BY-NC-SA 4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AboutMe = () => (
  <section id="about" className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Nor naiz ni?</span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Beñat Erezuma</h2>
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-white" />
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          Kaixo! Beñat Erezuma naiz, eta proiektu hau sortu dut matematika euskaraz ikasteko modu interaktibo eta bisual bat eskaintzeko.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">
          Nire helburua da matematikak ikastea errazagoa eta dibertigarriagoa egitea, teknologia eta diseinu modernoa erabiliz. DBH eta Batxilergoko ikasleentzat pentsatua dago, baina edozeinek erabil dezake!
        </p>
        <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
          berezuma.com <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
);

const Home = () => (
  <div className="font-sans antialiased text-slate-900 selection:bg-indigo-200 selection:text-indigo-900 bg-slate-50">
    <Navbar />
    <main>
      <Hero />
      <FeaturedTopics />
      <HowItWorks />
      <ResourceHub />
      <FeaturesStrip />
      <AboutMe />
    </main>
    <Footer />
  </div>
);

export default Home;
