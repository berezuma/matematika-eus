import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';
import ThemeToggle from './components/ThemeToggle';

export const ROUTE_IMPORTS = {
  '/': () => import('./pages/Home'),
  '/bigarren-mailakoa': () => import('./pages/BigarrenMailakoa'),
  '/zatikiak': () => import('./pages/Zatikiak'),
  '/lehen-mailakoa': () => import('./pages/LehenMailakoa'),
  '/zenbaki-osoak': () => import('./pages/ZenbakiOsoak'),
  '/berreturak-erroak': () => import('./pages/BerreturakErroak'),
  '/sistemak-2x2': () => import('./pages/Sistemak2x2'),
  '/proportzionaltasuna': () => import('./pages/Proportzionaltasuna'),
  '/polinomioak': () => import('./pages/Polinomioak'),
  '/trigonometria': () => import('./pages/Trigonometria'),
  '/estatistika': () => import('./pages/Estatistika'),
  '/funtzioak': () => import('./pages/FuntzioakAzterketa'),
  '/deribatuak': () => import('./pages/Deribatuak'),
  '/integralak': () => import('./pages/Integralak'),
  '/matrizeak': () => import('./pages/Matrizeak'),
  '/zenbaki-sistemak': () => import('./pages/ZenbakiSistemak'),
  '/bektoreak': () => import('./pages/Bektoreak'),
  '/azalerak-bolumenak': () => import('./pages/AzalerakBolumenak'),
  '/eragiketa-konbinatuak': () => import('./pages/EragiketaKonbinatuak'),
  '/zatigarritasuna': () => import('./pages/Zatigarritasuna'),
  '/zenbaki-hamartarrak': () => import('./pages/ZenbakiHamartarrak'),
  '/logika-boolearra': () => import('./pages/LogikaBoolearra'),
  '/algoritmoak': () => import('./pages/Algoritmoak'),
  '/kriptografia': () => import('./pages/Kriptografia'),
  '/logaritmoak': () => import('./pages/Logaritmoak'),
  '/unitate-aldaketak': () => import('./pages/UnitateAldaketak'),
  '/zatiki-sortzailea': () => import('./pages/ZatikiSortzailea'),
  '/inekuazioak': () => import('./pages/Inekuazioak'),
  '/produktu-nabarmenak': () => import('./pages/ProduktuNabarmenak'),
  '/sistemak-3x3': () => import('./pages/Sistemak3x3'),
  '/antzekotasuna-tales': () => import('./pages/AntzekotasunaTales'),
  '/sistema-sexagesimala': () => import('./pages/SistemaSexagesimala'),
  '/segidak': () => import('./pages/Segidak'),
  '/limiteak': () => import('./pages/Limiteak'),
  '/diagnostikoa': () => import('./pages/Diagnostikoa'),
  '/usap': () => import('./pages/Usap'),
  '/lege-oharra': () => import('./pages/LegeOharra'),
  '/pribatutasun-politika': () => import('./pages/PribatutasunPolitika'),
  '/lizentzia': () => import('./pages/Lizentzia'),
  '/nire-aurrerapena': () => import('./pages/NireAurrerapena'),
};

const Home = lazy(ROUTE_IMPORTS['/']);
const BigarrenMailakoa = lazy(ROUTE_IMPORTS['/bigarren-mailakoa']);
const Zatikiak = lazy(ROUTE_IMPORTS['/zatikiak']);
const LehenMailakoa = lazy(ROUTE_IMPORTS['/lehen-mailakoa']);
const ZenbakiOsoak = lazy(ROUTE_IMPORTS['/zenbaki-osoak']);
const BerreturakErroak = lazy(ROUTE_IMPORTS['/berreturak-erroak']);
const Sistemak2x2 = lazy(ROUTE_IMPORTS['/sistemak-2x2']);
const Proportzionaltasuna = lazy(ROUTE_IMPORTS['/proportzionaltasuna']);
const Polinomioak = lazy(ROUTE_IMPORTS['/polinomioak']);
const Trigonometria = lazy(ROUTE_IMPORTS['/trigonometria']);
const Estatistika = lazy(ROUTE_IMPORTS['/estatistika']);
const FuntzioakAzterketa = lazy(ROUTE_IMPORTS['/funtzioak']);
const Deribatuak = lazy(ROUTE_IMPORTS['/deribatuak']);
const Integralak = lazy(ROUTE_IMPORTS['/integralak']);
const Matrizeak = lazy(ROUTE_IMPORTS['/matrizeak']);
const ZenbakiSistemak = lazy(ROUTE_IMPORTS['/zenbaki-sistemak']);
const Bektoreak = lazy(ROUTE_IMPORTS['/bektoreak']);
const AzalerakBolumenak = lazy(ROUTE_IMPORTS['/azalerak-bolumenak']);
const EragiketaKonbinatuak = lazy(ROUTE_IMPORTS['/eragiketa-konbinatuak']);
const Zatigarritasuna = lazy(ROUTE_IMPORTS['/zatigarritasuna']);
const ZenbakiHamartarrak = lazy(ROUTE_IMPORTS['/zenbaki-hamartarrak']);
const LogikaBoolearra = lazy(ROUTE_IMPORTS['/logika-boolearra']);
const Algoritmoak = lazy(ROUTE_IMPORTS['/algoritmoak']);
const Kriptografia = lazy(ROUTE_IMPORTS['/kriptografia']);
const Logaritmoak = lazy(ROUTE_IMPORTS['/logaritmoak']);
const UnitateAldaketak = lazy(ROUTE_IMPORTS['/unitate-aldaketak']);
const ZatikiSortzailea = lazy(ROUTE_IMPORTS['/zatiki-sortzailea']);
const Inekuazioak = lazy(ROUTE_IMPORTS['/inekuazioak']);
const ProduktuNabarmenak = lazy(ROUTE_IMPORTS['/produktu-nabarmenak']);
const Sistemak3x3 = lazy(ROUTE_IMPORTS['/sistemak-3x3']);
const AntzekotasunaTales = lazy(ROUTE_IMPORTS['/antzekotasuna-tales']);
const SistemaSexagesimala = lazy(ROUTE_IMPORTS['/sistema-sexagesimala']);
const Segidak = lazy(ROUTE_IMPORTS['/segidak']);
const Limiteak = lazy(ROUTE_IMPORTS['/limiteak']);
const Diagnostikoa = lazy(ROUTE_IMPORTS['/diagnostikoa']);
const Usap = lazy(ROUTE_IMPORTS['/usap']);
const LegeOharra = lazy(ROUTE_IMPORTS['/lege-oharra']);
const PribatutasunPolitika = lazy(ROUTE_IMPORTS['/pribatutasun-politika']);
const Lizentzia = lazy(ROUTE_IMPORTS['/lizentzia']);
const NireAurrerapena = lazy(ROUTE_IMPORTS['/nire-aurrerapena']);
const NotFound = lazy(() => import('./pages/NotFound'));

const P = (C) => (
  <Suspense fallback={<LoadingSpinner />}>
    <PageTransition><C /></PageTransition>
  </Suspense>
);

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <ThemeToggle />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={P(Home)} />
          <Route path="/bigarren-mailakoa" element={P(BigarrenMailakoa)} />
          <Route path="/zatikiak" element={P(Zatikiak)} />
          <Route path="/lehen-mailakoa" element={P(LehenMailakoa)} />
          <Route path="/zenbaki-osoak" element={P(ZenbakiOsoak)} />
          <Route path="/berreturak-erroak" element={P(BerreturakErroak)} />
          <Route path="/sistemak-2x2" element={P(Sistemak2x2)} />
          <Route path="/proportzionaltasuna" element={P(Proportzionaltasuna)} />
          <Route path="/polinomioak" element={P(Polinomioak)} />
          <Route path="/trigonometria" element={P(Trigonometria)} />
          <Route path="/estatistika" element={P(Estatistika)} />
          <Route path="/funtzioak" element={P(FuntzioakAzterketa)} />
          <Route path="/deribatuak" element={P(Deribatuak)} />
          <Route path="/integralak" element={P(Integralak)} />
          <Route path="/matrizeak" element={P(Matrizeak)} />
          <Route path="/zenbaki-sistemak" element={P(ZenbakiSistemak)} />
          <Route path="/bektoreak" element={P(Bektoreak)} />
          <Route path="/azalerak-bolumenak" element={P(AzalerakBolumenak)} />
          <Route path="/eragiketa-konbinatuak" element={P(EragiketaKonbinatuak)} />
          <Route path="/zatigarritasuna" element={P(Zatigarritasuna)} />
          <Route path="/zenbaki-hamartarrak" element={P(ZenbakiHamartarrak)} />
          <Route path="/logika-boolearra" element={P(LogikaBoolearra)} />
          <Route path="/algoritmoak" element={P(Algoritmoak)} />
          <Route path="/kriptografia" element={P(Kriptografia)} />
          <Route path="/logaritmoak" element={P(Logaritmoak)} />
          <Route path="/unitate-aldaketak" element={P(UnitateAldaketak)} />
          <Route path="/zatiki-sortzailea" element={P(ZatikiSortzailea)} />
          <Route path="/inekuazioak" element={P(Inekuazioak)} />
          <Route path="/produktu-nabarmenak" element={P(ProduktuNabarmenak)} />
          <Route path="/sistemak-3x3" element={P(Sistemak3x3)} />
          <Route path="/antzekotasuna-tales" element={P(AntzekotasunaTales)} />
          <Route path="/sistema-sexagesimala" element={P(SistemaSexagesimala)} />
          <Route path="/segidak" element={P(Segidak)} />
          <Route path="/limiteak" element={P(Limiteak)} />
          <Route path="/diagnostikoa" element={P(Diagnostikoa)} />
          <Route path="/usap" element={P(Usap)} />
          <Route path="/lege-oharra" element={P(LegeOharra)} />
          <Route path="/pribatutasun-politika" element={P(PribatutasunPolitika)} />
          <Route path="/lizentzia" element={P(Lizentzia)} />
          <Route path="/nire-aurrerapena" element={P(NireAurrerapena)} />
          <Route path="*" element={P(NotFound)} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
