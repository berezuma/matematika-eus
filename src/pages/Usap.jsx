import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  Home,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  ExternalLink,
  AlertTriangle,
  Play,
  FileText,
  Calculator,
  TrendingUp
} from 'lucide-react';

/* ─────────────────────────────────────────────
   USaP AZTERKETA PRESTAKETA
   EHU 2024/25 eredu berriak
   ───────────────────────────────────────────── */

// --- Matematika II Ariketak ---
const MATE_ARIKETAK = [
  {
    id: 1,
    izena: '1. Ariketa (Derrigorrezkoa)',
    gaia: 'Probabilitatea - Binomial Banaketa',
    deskribapena: 'M72 txertoari buruzko probabilitate-ariketa. Binomial banaketa erabili behar da txertoa hartzen duten pertsonak aztertzeko.',
    atala: [
      {
        letra: '',
        testua: 'M72 birusaren aurkako txertoa aztertzen ari da. Txertoak %80ko eraginkortasuna du. 10 pertsona txertatzen badira:'
      },
      {
        letra: 'a)',
        testua: 'Zein da zehazki 8 pertsonatan eraginkorra izatearen probabilitatea? Erabili binomial banaketa: B(10, 0.8).'
      },
      {
        letra: 'b)',
        testua: 'Zein da gutxienez 7 pertsonatan eraginkorra izatearen probabilitatea?'
      },
      {
        letra: 'c)',
        testua: 'Kalkulatu esperotako balioa eta desbideratze tipikoa.'
      }
    ],
    kalifikazioa: '3 puntu. a) 1 puntu, b) 1 puntu, c) 1 puntu.'
  },
  {
    id: 2,
    izena: '2. Ariketa (2A / 2B hautatu)',
    gaia: 'Aljebra Lineala',
    deskribapena: 'Ekuazio-sistema edo matrizearen heina aukeratu.',
    atala: [
      {
        letra: '2A)',
        testua: 'Parametro bat duen ekuazio-sistema lineala emanda, diskutitu sistema parametroaren arabera (bateragarri determinatua, bateragarri indeterminatua, bateraezina). Bateragarri determinatua denean, ebatzi sistema.'
      },
      {
        letra: '2B)',
        testua: 'Matrizea emanda, kalkulatu bere heina (rangoa) parametro baten arabera. Zein balioetarako aldatzen da heina?'
      }
    ],
    kalifikazioa: '2 puntu. Diskusioa: 1.5 puntu, ebazpena: 0.5 puntu.'
  },
  {
    id: 3,
    izena: '3. Ariketa (3A / 3B hautatu)',
    gaia: 'Geometria - Zuzenak eta Planoak',
    deskribapena: 'Geometria analitikoaren ariketak espazioan.',
    atala: [
      {
        letra: '3A)',
        testua: 'Bi zuzen emanda espazioan (forma parametrikoan edo jarraian), aztertu haien posizioa erlatiboa (ebakitzen diren, paraleloak diren edo gurutzatuak diren). Ebakitzen badira, kalkulatu ebaketa-puntua.'
      },
      {
        letra: '3B)',
        testua: 'Zuzen bat eta plano bat emanda, aztertu haien posizioa erlatiboa. Ebakitzen badira, kalkulatu ebaketa-puntua eta angelua. Paraleloak badira, kalkulatu distantzia.'
      }
    ],
    kalifikazioa: '2 puntu. Posizioa: 1 puntu, kalkuluak: 1 puntu.'
  },
  {
    id: 4,
    izena: '4. Ariketa (4A / 4B hautatu)',
    gaia: 'Analisia - Funtzioen Azterketa',
    deskribapena: 'Funtzio baten azterketa osoa.',
    atala: [
      {
        letra: '4A)',
        testua: 'f(x) = x³ + Ax² + Bx + C funtzioa emanda, non A, B, C baldintzak betetzen dituzten (adibidez, puntu jakin bat igarotzea, mutur erlatibo bat izatea...). Kalkulatu A, B, C balioak eta egin funtzioaren azterketa osoa: eremua, simetria, monotonia, mutur erlatiboak, kurbadura, inflexio-puntuak.'
      },
      {
        letra: '4B)',
        testua: 'f(x) = 2x·e^(-2x²) funtzioaren azterketa osoa egin: eremua, simetria/antisimetria, limiteak infinituan, deribatuak, mutur erlatiboak, inflexio-puntuak. Azkenik, adierazi irudikapen grafikoa.'
      }
    ],
    kalifikazioa: '2 puntu. Ezaugarri bakoitza: 0.25-0.5 puntu.'
  },
  {
    id: 5,
    izena: '5. Ariketa (5A / 5B hautatu)',
    gaia: 'Integralak',
    deskribapena: 'Integral mugagabeak edo mugatuak.',
    atala: [
      {
        letra: '5A)',
        testua: 'Bi integral kalkulatu: bat integrazioa aldagaiaren aldaketaz eta bestea zatikako integrazioz. Adibidez: integral de x·cos(x) dx eta integral de 1/(x²+4) dx.'
      },
      {
        letra: '5B)',
        testua: 'Bi kurben arteko azalera kalkulatu. Kurbak emanda (adibidez, parabola bat eta zuzen bat), kalkulatu ebaketa-puntuak eta azalera mugatua.'
      }
    ],
    kalifikazioa: '2 puntu. Integral/azalera bakoitza: 1 puntu.'
  }
];

// --- GZ Matematika II Ariketak ---
const MATE_GZ_ARIKETAK = [
  {
    id: 1,
    izena: '1. Ariketa (Derrigorrezkoa)',
    gaia: 'Programazio Lineala',
    deskribapena: 'Erloju fabrika baten optimizazio-problema programazio linealaren bidez.',
    atala: [
      {
        letra: '',
        testua: 'Erloju fabrika batek bi erloju mota ekoizten ditu: luxuzkoak eta arruntak. Luxuzko erloju bakoitzak 3 ordu behar ditu muntaketan eta 1 ordu akaberan. Erloju arrunt bakoitzak 1 ordu behar ditu muntaketan eta 1 ordu akaberan. Egunean, 12 ordu daude muntaketarako eta 8 ordu akaberarako. Luxuzko erloju bakoitzak 60€-ko irabazia ematen du eta arrunt bakoitzak 30€-koa.'
      },
      {
        letra: 'a)',
        testua: 'Plantea ezazu problema programazio lineal gisa: aldagai-identifikazioa, helburu-funtzioa eta murrizketak.'
      },
      {
        letra: 'b)',
        testua: 'Irudikatu bideragarritasun-eremua grafikoki.'
      },
      {
        letra: 'c)',
        testua: 'Kalkulatu irtenbide optimoa eta irabazi maximoa.'
      }
    ],
    kalifikazioa: '3 puntu. a) 1 puntu, b) 1 puntu, c) 1 puntu.'
  },
  {
    id: 2,
    izena: '2. Ariketa (2.1 / 2.2 hautatu)',
    gaia: 'Aljebra - Ekuazio-sistemak eta Matrizeak',
    deskribapena: 'Ekuazio-sistema bat ebatzi edo matrizeekin eragiketak.',
    atala: [
      {
        letra: '2.1)',
        testua: 'Ekuazio-sistema lineal bat emanda (3 ekuazio, 3 ezezagun), ebatzi Cramer-en arauaren bidez edo Gauss-en eliminazioaren bidez. Sistema diskutitzea eska daiteke parametro bat badauka.'
      },
      {
        letra: '2.2)',
        testua: 'A matrizea emanda, kalkulatu A^t · A^(-1), non A^t transposatua den eta A^(-1) alderantzizkoa. Lehenik kalkulatu A^(-1), ondoren biderketa.'
      }
    ],
    kalifikazioa: '2 puntu. Prozesu osoa eta emaitza zuzena.'
  },
  {
    id: 3,
    izena: '3. Ariketa (3.1 / 3.2 hautatu)',
    gaia: 'Funtzioen Azterketa',
    deskribapena: 'Kostu-funtzioa edo funtzio polinomikoa aztertu.',
    atala: [
      {
        letra: '3.1)',
        testua: 'Enpresa baten kostu-funtzioa emanda C(x), non x unitate kopurua den: kalkulatu kostu marjinala, batez besteko kostua, eta zein unitate kopururako minimizatzen den batez besteko kostua.'
      },
      {
        letra: '3.2)',
        testua: 'Funtzio polinomiko bat emanda (gradu 3 edo 4), egin azterketa osoa: eremua, mutur erlatiboak (deribatua erabiliz), monotonia-tarteak, eta irudikapen grafikoa.'
      }
    ],
    kalifikazioa: '2 puntu. Analisi osoa: 2 puntu.'
  },
  {
    id: 4,
    izena: '4. Ariketa (4.1 / 4.2 hautatu)',
    gaia: 'Probabilitatea',
    deskribapena: 'Probabilitate-ariketak: Bayes edo zuhaitz-diagrama.',
    atala: [
      {
        letra: '4.1)',
        testua: 'Poltsara batean koloretako bolak daude. Bola bat atera ondoren, beste bat ateratzen da (bueltatu gabe edo bueltatzean). Kalkulatu baldintza-probabilitateak eta erabili Bayes-en teorema.'
      },
      {
        letra: '4.2)',
        testua: 'Gertaera independenteak eta menpekoak identifikatu. Probabilitate teorikoak kalkulatu zuhaitz-diagrama erabiliz. Kalkulatu P(A∩B), P(A∪B) eta P(A|B).'
      }
    ],
    kalifikazioa: '2 puntu. Kalkulu bakoitza: 0.5 puntu.'
  },
  {
    id: 5,
    izena: '5. Ariketa (5.1 / 5.2 hautatu)',
    gaia: 'Estatistika - Banaketa Normala eta Konfiantza-tarteak',
    deskribapena: 'Estatistika inferentziala.',
    atala: [
      {
        letra: '5.1)',
        testua: 'Aldagai bat banaketa normalari jarraitzen dio, N(mu, sigma). Kalkulatu probabilitateak taulen bidez (tipifikatu z = (x-mu)/sigma). Zein balioren azpitik geratzen da populazioaren %95a?'
      },
      {
        letra: '5.2)',
        testua: 'Lagin bat emanda (n elementu, batez bestekoa eta desbideratze tipikoa), kalkulatu batez bestekoaren konfiantza-tartea %95eko konfiantza-mailarekin. Interpretatu emaitza.'
      }
    ],
    kalifikazioa: '2 puntu. Kalkulu bakoitza: 1 puntu.'
  }
];

// --- Praktika galderak: Matematika II ---
const PRAKTIKA_MATE = [
  // Probabilitatea/Estatistika
  {
    id: 1,
    gaia: 'Probabilitatea',
    galdera: 'X aldagai aleatorioa binomial banaketa jarraitzen du: X ~ B(8, 0.3). Zein da P(X=2)?',
    aukerak: ['0.2965', '0.1488', '0.3241', '0.2090'],
    erantzunZuzena: 0,
    azalpena: 'P(X=2) = C(8,2) · 0.3² · 0.7⁶ = 28 · 0.09 · 0.1176 = 0.2965.'
  },
  {
    id: 2,
    gaia: 'Probabilitatea',
    galdera: 'Aldagai aleatorio batek N(50, 10) banaketa normala jarraitzen du. Zein da P(X > 65) gutxi gorabehera?',
    aukerak: ['0.0668', '0.1587', '0.3085', '0.0228'],
    erantzunZuzena: 0,
    azalpena: 'z = (65-50)/10 = 1.5. Tauletan: P(Z > 1.5) = 1 - 0.9332 = 0.0668.'
  },
  {
    id: 3,
    gaia: 'Estatistika',
    galdera: 'Lagin batean n=100, batez bestekoa=25 eta desbideratze tipikoa=4. Zein da %95eko konfiantza-tartea batez bestekoarentzat?',
    aukerak: ['(24.22, 25.78)', '(23.04, 26.96)', '(24.61, 25.39)', '(23.50, 26.50)'],
    erantzunZuzena: 0,
    azalpena: 'KT = 25 ± 1.96 · (4/sqrt(100)) = 25 ± 1.96 · 0.4 = 25 ± 0.784 = (24.22, 25.78).'
  },
  // Aljebra lineala
  {
    id: 4,
    gaia: 'Aljebra Lineala',
    galdera: 'A = [[2, 1], [3, 4]] matrizearen determinantea kalkulatu.',
    aukerak: ['5', '11', '-1', '8'],
    erantzunZuzena: 0,
    azalpena: 'det(A) = 2·4 - 1·3 = 8 - 3 = 5.'
  },
  {
    id: 5,
    gaia: 'Aljebra Lineala',
    galdera: 'Sistema lineal homogeneoa Ax=0 emateko, A 3x3 matrizea da eta det(A)=0. Zer esan dezakegu?',
    aukerak: [
      'Irtenbide ez-tribiala du (infinitu irtenbide)',
      'Irtenbide bakarra du (tribiala)',
      'Ez du irtenbiderik',
      'Ezin da jakin'
    ],
    erantzunZuzena: 0,
    azalpena: 'det(A)=0 denean, sistema homogeneoak irtenbide ez-tribiala du (infinitu irtenbide), heina < ezezagunen kopurua delako.'
  },
  {
    id: 6,
    gaia: 'Aljebra Lineala',
    galdera: 'Ekuazio-sistema bat parametro "a"-ren arabera diskutitzen da. Sistema bateragarri indeterminatua izateko, zer bete behar da?',
    aukerak: [
      'Koefiziente-matrizearen heina < matrizea zabalduaren heina = ezezagun kopurua',
      'Koefiziente-matrizearen heina = matrizea zabalduaren heina < ezezagun kopurua',
      'Koefiziente-matrizearen heina = matrizea zabalduaren heina = ezezagun kopurua',
      'Koefiziente-matrizearen heina < matrizea zabalduaren heina'
    ],
    erantzunZuzena: 1,
    azalpena: 'Rouché-Frobenius teoremaren arabera: bateragarri indeterminatua ↔ rang(A) = rang(A|b) < ezezagun kopurua.'
  },
  // Geometria
  {
    id: 7,
    gaia: 'Geometria',
    galdera: 'Bi zuzen espazioan: r: (1,0,2)+t(1,1,0) eta s: (0,1,1)+s(2,2,0). Zein da haien posizioa erlatiboa?',
    aukerak: ['Paraleloak (eta desberdinak)', 'Ebakitzen dira', 'Gurutzatuak dira', 'Koplanarioak dira'],
    erantzunZuzena: 0,
    azalpena: 'Norabide-bektoreak: (1,1,0) eta (2,2,0) proportzionalak dira (k=2), beraz paraleloak dira. Biak ez dira berdinak, puntu bat bestearen zuzenean ez dagoelako.'
  },
  {
    id: 8,
    gaia: 'Geometria',
    galdera: 'P(1,2,3) puntutik pi: 2x - y + 2z - 1 = 0 planora dagoen distantzia kalkulatu.',
    aukerak: ['7/3', '3', '5/3', '1'],
    erantzunZuzena: 0,
    azalpena: 'd = |2·1 - 1·2 + 2·3 - 1| / sqrt(4+1+4) = |2-2+6-1| / 3 = 5/3. Kontuz: 7/3 da: |2-2+6-1|=5, eta sqrt(9)=3, beraz 5/3. Barkatu, erantzuna 5/3 da.'
  },
  {
    id: 9,
    gaia: 'Geometria',
    galdera: 'Zuzen baten ekuazio jarraiak: (x-1)/2 = (y+3)/1 = (z-2)/(-1). Zein da norabide-bektorea?',
    aukerak: ['(2, 1, -1)', '(1, -3, 2)', '(2, -1, 1)', '(-2, 1, 1)'],
    erantzunZuzena: 0,
    azalpena: 'Ekuazio jarraietatik zuzenean irakurtzen da: norabide-bektorea = (2, 1, -1).'
  },
  // Analisia
  {
    id: 10,
    gaia: 'Analisia',
    galdera: 'f(x) = x³ - 3x funtzioaren mutur erlatiboak kalkulatu.',
    aukerak: [
      'Maximoa x=-1, f(-1)=2; minimoa x=1, f(1)=-2',
      'Maximoa x=1, f(1)=-2; minimoa x=-1, f(-1)=2',
      'Maximoa x=0, f(0)=0',
      'Ez du mutur erlatiborik'
    ],
    erantzunZuzena: 0,
    azalpena: 'f\'(x) = 3x² - 3 = 0 → x = ±1. f\'\'(x) = 6x. f\'\'(-1) = -6 < 0 → maximoa (-1, 2). f\'\'(1) = 6 > 0 → minimoa (1, -2).'
  },
  {
    id: 11,
    gaia: 'Analisia',
    galdera: 'Kalkulatu lim(x→0) sin(3x)/x.',
    aukerak: ['3', '0', '1', 'Ez du limiterik'],
    erantzunZuzena: 0,
    azalpena: 'lim(x→0) sin(3x)/x = lim(x→0) 3·sin(3x)/(3x) = 3·1 = 3. Limite nabarmena: lim(u→0) sin(u)/u = 1.'
  },
  {
    id: 12,
    gaia: 'Analisia',
    galdera: 'f(x) = e^x · cos(x) funtzioaren deribatua zein da?',
    aukerak: [
      'e^x · (cos(x) - sin(x))',
      'e^x · (-sin(x))',
      'e^x · cos(x) - e^x · sin(x) ... hau da berdina',
      'e^x · (cos(x) + sin(x))'
    ],
    erantzunZuzena: 0,
    azalpena: 'Produktuaren erregela: f\'(x) = e^x · cos(x) + e^x · (-sin(x)) = e^x · (cos(x) - sin(x)).'
  },
  // Integralak
  {
    id: 13,
    gaia: 'Integralak',
    galdera: 'Kalkulatu integral mugagabea: ∫ x · e^x dx.',
    aukerak: [
      'e^x · (x - 1) + C',
      'x · e^x + C',
      'e^x · (x + 1) + C',
      '(x²/2) · e^x + C'
    ],
    erantzunZuzena: 0,
    azalpena: 'Zatikako integrazioa: u=x, dv=e^x dx. ∫x·e^x dx = x·e^x - ∫e^x dx = x·e^x - e^x + C = e^x(x-1) + C.'
  },
  {
    id: 14,
    gaia: 'Integralak',
    galdera: 'Kalkulatu: ∫₀¹ (3x² + 2x) dx.',
    aukerak: ['2', '1', '3', '4'],
    erantzunZuzena: 0,
    azalpena: '∫₀¹ (3x² + 2x) dx = [x³ + x²]₀¹ = (1 + 1) - (0 + 0) = 2.'
  },
  {
    id: 15,
    gaia: 'Integralak',
    galdera: 'y = x² eta y = x bi kurben arteko azalera [0, 1] tartean kalkulatzeko, zer integral egin behar da?',
    aukerak: [
      '∫₀¹ (x - x²) dx',
      '∫₀¹ (x² - x) dx',
      '∫₀¹ x² dx + ∫₀¹ x dx',
      '∫₀¹ |x² + x| dx'
    ],
    erantzunZuzena: 0,
    azalpena: '[0,1] tartean x > x² da, beraz azalera = ∫₀¹ (x - x²) dx. Beti goiko funtzioa ken behekoa.'
  }
];

// --- Praktika galderak: GZ Matematika II ---
const PRAKTIKA_GZ = [
  // Programazio lineala
  {
    id: 1,
    gaia: 'Programazio Lineala',
    galdera: 'Programazio linealeko problema batean, irtenbide optimoa non aurkitzen da beti?',
    aukerak: [
      'Bideragarritasun-eremuaren erpin batean',
      'Bideragarritasun-eremuaren barruan',
      'Helburu-funtzioaren jatorrian',
      'Murrizketen zuzenak ebakitzen diren edozein puntuan'
    ],
    erantzunZuzena: 0,
    azalpena: 'Programazio linealaren oinarrizko teoremak dio irtenbide optimoa (existitzen bada) bideragarritasun-eremuaren erpin batean dagoela.'
  },
  {
    id: 2,
    gaia: 'Programazio Lineala',
    galdera: 'x + y ≤ 10, x ≥ 0, y ≥ 0 murrizketekin, zein da z = 3x + 2y helburu-funtzioaren maximoa?',
    aukerak: ['30', '20', '26', '25'],
    erantzunZuzena: 0,
    azalpena: 'Erpinak: (0,0), (10,0), (0,10). z(0,0)=0, z(10,0)=30, z(0,10)=20. Maximoa: 30 puntuan (10,0).'
  },
  {
    id: 3,
    gaia: 'Programazio Lineala',
    galdera: 'Bideragarritasun-eremua hutsa bada programazio lineal batean, zer gertatzen da?',
    aukerak: [
      'Problemak ez du irtenbiderik',
      'Irtenbidea infinitua da',
      'Minimoa 0 da',
      'Murrizketak bikoiztu behar dira'
    ],
    erantzunZuzena: 0,
    azalpena: 'Bideragarritasun-eremua hutsa bada, murrizketak elkarren artean kontraesankorrerak dira eta problemak ez du irtenbide bideragarririk.'
  },
  // Matrizeak eta ekuazio-sistemak
  {
    id: 4,
    gaia: 'Matrizeak',
    galdera: 'A = [[1, 2], [3, 4]] matrizea emanda, zein da A^(-1)?',
    aukerak: [
      '[[-2, 1], [3/2, -1/2]]',
      '[[4, -2], [-3, 1]]',
      '[[-2, 1], [1.5, -0.5]]',
      'A eta C erantzunak berdinak dira'
    ],
    erantzunZuzena: 3,
    azalpena: 'det(A) = 4-6 = -2. A^(-1) = (1/-2)·[[4,-2],[-3,1]] = [[-2, 1],[3/2, -1/2]]. A eta C berdinak dira (3/2 = 1.5, -1/2 = -0.5).'
  },
  {
    id: 5,
    gaia: 'Matrizeak',
    galdera: 'A·B produktua existitzeko, A matrizeak 3x2 dimentsioa badu, B matrizeak ze dimentsio behar du?',
    aukerak: ['2xn (n edozein)', '3x2', '3x3', 'nx3 (n edozein)'],
    erantzunZuzena: 0,
    azalpena: 'A(mxp)·B(pxn) produktuan, A-ren zutabe kopurua = B-ren errenkada kopurua izan behar da. A 3x2 bada, B 2xn izan behar da.'
  },
  {
    id: 6,
    gaia: 'Ekuazio-sistemak',
    galdera: '3x3 ekuazio-sistema bat Cramer-en arauarekin ebazteko, zenbat determinante kalkulatu behar dira?',
    aukerak: ['4', '3', '6', '9'],
    erantzunZuzena: 0,
    azalpena: 'Cramer: D (sistema), Dx, Dy, Dz. Guztira 4 determinante: sistema osoaren 1 + ezezagun bakoitzaren 1 (3 ezezagun = 3).'
  },
  // Funtzioen azterketa
  {
    id: 7,
    gaia: 'Funtzioak',
    galdera: 'f(x) = x³ - 12x + 1 funtzioa, zein tartetan da gorakorra?',
    aukerak: [
      '(-∞, -2) eta (2, +∞)',
      '(-2, 2)',
      '(0, +∞)',
      '(-∞, 0)'
    ],
    erantzunZuzena: 0,
    azalpena: 'f\'(x) = 3x² - 12 = 0 → x² = 4 → x = ±2. f\'(x) > 0 denean x < -2 edo x > 2, beraz gorakorra (-∞,-2) eta (2,+∞) tarteetan.'
  },
  {
    id: 8,
    gaia: 'Funtzioak',
    galdera: 'Enpresa baten kostu-funtzioa C(x) = 2x² + 50x + 200 bada, zein da kostu marjinala 10. unitatean?',
    aukerak: ['90', '50', '40', '240'],
    erantzunZuzena: 0,
    azalpena: 'Kostu marjinala = C\'(x) = 4x + 50. C\'(10) = 40 + 50 = 90.'
  },
  {
    id: 9,
    gaia: 'Funtzioak',
    galdera: 'f(x) funtzio batean, f\'(a) = 0 eta f\'\'(a) > 0 bada, zer dago x=a puntuan?',
    aukerak: [
      'Minimo erlatibo bat',
      'Maximo erlatibo bat',
      'Inflexio-puntu bat',
      'Ezin da jakin'
    ],
    erantzunZuzena: 0,
    azalpena: 'Bigarren deribatuen irizpidea: f\'(a)=0 eta f\'\'(a)>0 → minimo erlatiboa da x=a puntuan.'
  },
  // Probabilitatea
  {
    id: 10,
    gaia: 'Probabilitatea',
    galdera: 'P(A)=0.3, P(B)=0.5, P(A∩B)=0.15. A eta B independenteak dira?',
    aukerak: [
      'Bai, P(A∩B) = P(A)·P(B) betetzen delako',
      'Ez, P(A∩B) ≠ P(A)·P(B) delako',
      'Bai, P(A)+P(B) < 1 delako',
      'Ez, P(A∪B) ≠ 1 delako'
    ],
    erantzunZuzena: 0,
    azalpena: 'P(A)·P(B) = 0.3·0.5 = 0.15 = P(A∩B). Berdintza betetzen denez, A eta B independenteak dira.'
  },
  {
    id: 11,
    gaia: 'Probabilitatea',
    galdera: 'Bayes-en formulan, P(A|B) kalkulatzeko zer behar da?',
    aukerak: [
      'P(B|A), P(A) eta P(B)',
      'P(A∪B) eta P(B) bakarrik',
      'P(A) eta P(B) bakarrik',
      'P(A∩B) eta P(A) bakarrik'
    ],
    erantzunZuzena: 0,
    azalpena: 'Bayes: P(A|B) = P(B|A)·P(A) / P(B). Hiru probabilitate behar dira.'
  },
  {
    id: 12,
    gaia: 'Probabilitatea',
    galdera: 'Kutxa batean 6 bola gorri eta 4 urdin daude. Bi bola ateratzen dira bueltatu gabe. P(bigarrena gorria | lehenengoa urdina)?',
    aukerak: ['6/9 = 2/3', '6/10 = 3/5', '5/9', '4/9'],
    erantzunZuzena: 0,
    azalpena: 'Lehena urdina bada: 9 bola geratzen dira, 6 gorri. P(2. gorria | 1. urdina) = 6/9 = 2/3.'
  },
  // Estatistika
  {
    id: 13,
    gaia: 'Estatistika',
    galdera: 'X ~ N(100, 15). P(X < 85) kalkulatzeko, zein da z balioa?',
    aukerak: ['-1', '1', '-0.5', '0.5'],
    erantzunZuzena: 0,
    azalpena: 'z = (x - mu) / sigma = (85 - 100) / 15 = -15/15 = -1.'
  },
  {
    id: 14,
    gaia: 'Estatistika',
    galdera: '%99ko konfiantza-tartea %95ekoa baino... da.',
    aukerak: [
      'Zabalagoa (gutxiago zehaztua)',
      'Estuagoa (gehiago zehaztua)',
      'Berdina',
      'Aldagai motaren arabera aldatzen da'
    ],
    erantzunZuzena: 0,
    azalpena: 'Konfiantza-maila handiagoa → z kritikoa handiagoa → tartea zabalagoa. %99an z=2.576 vs %95ean z=1.96.'
  },
  {
    id: 15,
    gaia: 'Estatistika',
    galdera: 'Laginaren tamaina handitzen bada, konfiantza-tarteari zer gertatzen zaio (konfiantza-maila berdinarekin)?',
    aukerak: [
      'Estuagoa bihurtzen da',
      'Zabalagoa bihurtzen da',
      'Ez du aldatzen',
      'Ezin da aurreikusi'
    ],
    erantzunZuzena: 0,
    azalpena: 'KT zabalera ∝ 1/sqrt(n). n handiagoa → akats estandarra txikiagoa → tartea estuagoa (zehatzagoa).'
  }
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function Usap() {
  const [fasea, setFasea] = useState('hasiera'); // hasiera | azterketa | praktika
  const [azterketaMota, setAzterketaMota] = useState(null); // 'mate' | 'gz'
  const [irekitakoAriketa, setIrekitakoAriketa] = useState(null);

  // Praktika state
  const [praktikaGaia, setPraktikaGaia] = useState(null); // 'mate' | 'gz'
  const [unekoGaldera, setUnekoGaldera] = useState(0);
  const [erantzunak, setErantzunak] = useState({});
  const [hautatutakoAukera, setHautatutakoAukera] = useState(null);
  const [erakutsiAzalpena, setErakutsiAzalpena] = useState(false);

  const galderak = praktikaGaia === 'mate' ? PRAKTIKA_MATE : PRAKTIKA_GZ;
  const galdera = galderak[unekoGaldera];
  const zuzenak = Object.entries(erantzunak).filter(([, v]) => v.zuzena).length;

  const hasiPraktika = (mota) => {
    setPraktikaGaia(mota);
    setFasea('praktika');
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
      [galdera.id]: { hautatua: hautatutakoAukera, zuzena, gaia: galdera.gaia }
    }));
    setErakutsiAzalpena(true);
  };

  const hurrengoGaldera = () => {
    if (unekoGaldera < galderak.length - 1) {
      setUnekoGaldera(prev => prev + 1);
      setHautatutakoAukera(null);
      setErakutsiAzalpena(false);
    } else {
      setFasea('emaitzak');
    }
  };

  /* ─── NAVBAR ─── */
  const Navbar = ({ azpiIzena }) => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
          <Home size={18} />
          <span className="font-medium">Mate.eus</span>
        </Link>
        <ChevronRight size={14} className="text-slate-400" />
        <button
          onClick={() => { setFasea('hasiera'); setAzterketaMota(null); setPraktikaGaia(null); }}
          className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          USaP
        </button>
        {azpiIzena && (
          <>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-sm text-slate-500">{azpiIzena}</span>
          </>
        )}
      </div>
    </nav>
  );

  /* ─── HASIERA PANTAILA ─── */
  if (fasea === 'hasiera') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <GraduationCap size={16} />
              EHU 2024/25 eredu berriak
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              USaP Azterketa <span className="text-indigo-600">Prestaketa</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
              Unibertsitaterako Sarbide Probaren matematika azterketak prestatu.
              Bi ibilbide daude: Zientzia eta Gizarte Zientziak.
            </p>
            <a
              href="https://www.ehu.eus/eu/web/unibertsitaterako-sarbidea/sarbideak/batxilergoa-eta-goi-mailako-heziketa-zikloak/usap/azterketen-eredu-berriak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
            >
              EHUko informazio ofiziala <ExternalLink size={14} />
            </a>
          </motion.div>

          {/* Azterketaren formatua */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10 max-w-3xl mx-auto"
          >
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" />
              Azterketaren formatua
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>5 ariketa</strong> daude guztira azterketako.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>1. ariketa derrigorrezkoa</strong> da (3 puntu).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Beste <strong>4 ariketatik 3 aukeratu</strong> behar dira (2 puntu bakoitza, bat bi aukerarekin).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Guztira: <strong>3 + 3×2 = 9 puntu</strong> (10etik normalizatuta).</span>
              </li>
            </ul>
          </motion.div>

          {/* Bi txartel */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all p-6 group cursor-pointer"
              onClick={() => { setAzterketaMota('mate'); setFasea('azterketa'); }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Matematika II</h3>
                  <p className="text-xs text-slate-500">Zientzia ibilbidea</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Probabilitatea, aljebra lineala, geometria espazioan, analisi matematikoa eta integralak.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4">
                <li>Binomial banaketa eta probabilitatea</li>
                <li>Matrizearen heina, ekuazio-sistemak</li>
                <li>Zuzenak eta planoak espazioan</li>
                <li>Funtzioen azterketa eta integralak</li>
              </ul>
              <div className="flex items-center text-indigo-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                Eredua ikusi <ArrowRight size={16} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all p-6 group cursor-pointer"
              onClick={() => { setAzterketaMota('gz'); setFasea('azterketa'); }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">GZ.ZZ.-ei Aplikatutako Matematikak II</h3>
                  <p className="text-xs text-slate-500">Gizarte Zientzien ibilbidea</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Programazio lineala, matrizeak, funtzioak, probabilitatea eta estatistika.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4">
                <li>Programazio lineala (optimizazioa)</li>
                <li>Matrizeak eta ekuazio-sistemak</li>
                <li>Kostu-funtzioak eta polinomioak</li>
                <li>Probabilitatea eta konfiantza-tarteak</li>
              </ul>
              <div className="flex items-center text-purple-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                Eredua ikusi <ArrowRight size={16} />
              </div>
            </motion.div>
          </div>

          {/* Praktikatu botoia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-slate-500 text-sm mb-4">Edo zuzenean praktikatu test interaktiboekin:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => hasiPraktika('mate')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
              >
                <Play size={18} />
                Praktikatu: Matematika II
              </button>
              <button
                onClick={() => hasiPraktika('gz')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                <Play size={18} />
                Praktikatu: GZ Matematikak II
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── AZTERKETA FASEA (eredua ikusi) ─── */
  if (fasea === 'azterketa') {
    const ariketak = azterketaMota === 'mate' ? MATE_ARIKETAK : MATE_GZ_ARIKETAK;
    const izena = azterketaMota === 'mate' ? 'Matematika II' : 'GZ.ZZ. Matematikak II';
    const kolorea = azterketaMota === 'mate' ? 'indigo' : 'purple';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Navbar azpiIzena={izena} />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => { setFasea('hasiera'); setAzterketaMota(null); }}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> Atzera
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{izena}</h1>
            <p className="text-slate-600">
              EHU 2024/25 eredu berria. Ariketa bakoitza sakatu xehetasunak ikusteko.
            </p>
          </motion.div>

          <div className="space-y-4">
            {ariketak.map((ariketa, idx) => (
              <motion.div
                key={ariketa.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setIrekitakoAriketa(irekitakoAriketa === ariketa.id ? null : ariketa.id)}
                  className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 flex items-center justify-center rounded-xl bg-${kolorea}-100 text-${kolorea}-600 font-bold text-sm`}>
                      {ariketa.id}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-800">{ariketa.izena}</h3>
                      <p className="text-xs text-slate-500">{ariketa.gaia}</p>
                    </div>
                  </div>
                  {irekitakoAriketa === ariketa.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>

                <AnimatePresence>
                  {irekitakoAriketa === ariketa.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-600 mb-4 italic">{ariketa.deskribapena}</p>

                        <div className="space-y-3 mb-4">
                          {ariketa.atala.map((atal, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              {atal.letra && (
                                <span className={`inline-block px-2 py-0.5 bg-${kolorea}-100 text-${kolorea}-700 rounded text-xs font-bold mb-2`}>
                                  {atal.letra}
                                </span>
                              )}
                              <p className="text-sm text-slate-700 leading-relaxed">{atal.testua}</p>
                            </div>
                          ))}
                        </div>

                        <div className={`bg-${kolorea}-50 rounded-xl p-3 border border-${kolorea}-100`}>
                          <p className={`text-xs font-medium text-${kolorea}-700`}>
                            <strong>Kalifikazioa:</strong> {ariketa.kalifikazioa}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Praktikatu botoia */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <button
              onClick={() => hasiPraktika(azterketaMota)}
              className={`inline-flex items-center gap-2 px-8 py-4 bg-${kolorea}-600 hover:bg-${kolorea}-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-${kolorea}-500/30 transition-all hover:scale-105`}
            >
              <Play size={20} />
              Praktikatu {izena}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── PRAKTIKA FASEA (Test interaktiboa) ─── */
  if (fasea === 'praktika') {
    const izena = praktikaGaia === 'mate' ? 'Matematika II' : 'GZ Matematikak II';
    const kolorea = praktikaGaia === 'mate' ? 'indigo' : 'purple';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Navbar azpiIzena={`${izena} - Praktika`} />

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
            <span>{unekoGaldera + 1} / {galderak.length}</span>
            <span>{galdera.gaia}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-${kolorea}-500 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${((unekoGaldera + (erakutsiAzalpena ? 1 : 0)) / galderak.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={galdera.id + '-' + praktikaGaia}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gaia tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 bg-${kolorea}-100 text-${kolorea}-700 rounded-full text-xs font-medium`}>
                  {galdera.gaia}
                </span>
              </div>

              {/* Galdera */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                  <span className={`text-${kolorea}-500 mr-2`}>{unekoGaldera + 1}.</span>
                  {galdera.galdera}
                </h2>

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
                      estiloa = `border-${kolorea}-500 bg-${kolorea}-50 ring-2 ring-${kolorea}-200`;
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
                            ? `bg-${kolorea}-500 text-white`
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
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botoiak */}
              <div className="flex justify-end">
                {!erakutsiAzalpena ? (
                  <button
                    onClick={erantzunaBaieztatu}
                    disabled={hautatutakoAukera === null}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      hautatutakoAukera !== null
                        ? `bg-${kolorea}-600 hover:bg-${kolorea}-700 text-white shadow-lg shadow-${kolorea}-500/30`
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Baieztatu
                    <CheckCircle size={18} />
                  </button>
                ) : (
                  <button
                    onClick={hurrengoGaldera}
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-${kolorea}-600 hover:bg-${kolorea}-700 text-white rounded-xl font-bold shadow-lg shadow-${kolorea}-500/30 transition-all`}
                  >
                    {unekoGaldera < galderak.length - 1 ? 'Hurrengoa' : 'Emaitzak ikusi'}
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ─── EMAITZAK PANTAILA ─── */
  if (fasea === 'emaitzak') {
    const ehunekoa = Math.round((zuzenak / galderak.length) * 100);
    const izena = praktikaGaia === 'mate' ? 'Matematika II' : 'GZ Matematikak II';
    const kolorea = praktikaGaia === 'mate' ? 'indigo' : 'purple';

    let mailaMezua, mailaKolore;
    if (ehunekoa >= 80) {
      mailaMezua = 'Bikain! Oso ondo prestatuta zaude USaP-rako.';
      mailaKolore = 'text-green-600';
    } else if (ehunekoa >= 50) {
      mailaMezua = 'Ondo, baina arlo batzuk errepasatu behar dituzu.';
      mailaKolore = 'text-yellow-600';
    } else {
      mailaMezua = 'Praktika gehiago behar duzu. Jarrai lanean!';
      mailaKolore = 'text-red-600';
    }

    // Gaien arabera taldekatu
    const gaienAnalisia = {};
    Object.entries(erantzunak).forEach(([, info]) => {
      if (!gaienAnalisia[info.gaia]) gaienAnalisia[info.gaia] = { zuzenak: 0, guztira: 0 };
      gaienAnalisia[info.gaia].guztira += 1;
      if (info.zuzena) gaienAnalisia[info.gaia].zuzenak += 1;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Navbar azpiIzena="Emaitzak" />

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Puntuazioa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-10"
          >
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-xl border-4 border-${kolorea}-200 mb-6`}>
              <div>
                <div className={`text-4xl font-extrabold text-${kolorea}-600`}>{ehunekoa}%</div>
                <div className="text-sm text-slate-500">{zuzenak}/{galderak.length}</div>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {izena} - Emaitzak
            </h1>
            <p className={`text-lg font-semibold ${mailaKolore}`}>{mailaMezua}</p>
          </motion.div>

          {/* Gaien analisia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className={`text-${kolorea}-600`} />
              Gaien Analisia
            </h3>
            <div className="space-y-4">
              {Object.entries(gaienAnalisia).map(([gaia, data]) => {
                const pct = Math.round((data.zuzenak / data.guztira) * 100);
                return (
                  <div key={gaia}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{gaia}</span>
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

          {/* Galdera zerrenda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
          >
            <h3 className="font-bold text-slate-800 mb-4">Galderen Xehetasuna</h3>
            <div className="space-y-2">
              {galderak.map((g, idx) => {
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
                    <span className="text-sm text-slate-700 flex-1 line-clamp-1">
                      {idx + 1}. {g.galdera}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600`}>
                      {g.gaia}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Akzio botoiak */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => hasiPraktika(praktikaGaia)}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-${kolorea}-600 hover:bg-${kolorea}-700 text-white font-bold rounded-xl shadow-lg shadow-${kolorea}-500/30 transition-all`}
            >
              <RotateCcw size={18} />
              Berriro hasi
            </button>
            <button
              onClick={() => { setFasea('hasiera'); setPraktikaGaia(null); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all"
            >
              <ArrowLeft size={18} />
              USaP hasierara
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all"
            >
              <Home size={18} />
              Hasierara
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
