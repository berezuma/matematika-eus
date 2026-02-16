import React from 'react';
import {
  Calculator,
  Sigma,
  Shapes,
  TrendingUp,
  Binary,
  PieChart,
  FunctionSquare,
  Divide,
  Scale,
  Cpu,
  Lock,
  GitBranch,
  Ruler,
  RefreshCw,
} from 'lucide-react';

/* --- ICON HELPERS --- */
const EqualIcon = () => <span className="font-bold text-lg">=</span>;
const GridIcon = () => <div className="grid grid-cols-2 gap-0.5 w-4 h-4"><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div></div>;
const PlusMinusIcon = () => <span className="font-bold text-lg">±</span>;
const SuperscriptIcon = () => <span className="font-bold text-xs flex">x<sup>2</sup></span>;
const TriangleIcon = () => <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-current"></div>;
const ArrowUpRightIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>;

export { EqualIcon, GridIcon, PlusMinusIcon, SuperscriptIcon, TriangleIcon, ArrowUpRightIcon };

/* --- CATEGORIES --- */
export const CATEGORIES = [
  { id: 'all', label: 'Denak' },
  { id: 'aritmetika', label: 'Aritmetika', icon: <Calculator className="w-4 h-4" /> },
  { id: 'aljebra', label: 'Aljebra', icon: <Sigma className="w-4 h-4" /> },
  { id: 'geometria', label: 'Geometria', icon: <Shapes className="w-4 h-4" /> },
  { id: 'analisia', label: 'Analisia', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'pk', label: 'Pentsamendu Konputazionala', icon: <Cpu className="w-4 h-4" /> },
];

/* --- RESOURCES --- */
export const RESOURCES = [
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

export const ACTIVE_COUNT = RESOURCES.filter(r => r.link && r.link !== '#').length;
