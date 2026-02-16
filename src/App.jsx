import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const BigarrenMailakoa = lazy(() => import('./pages/BigarrenMailakoa'));
const Zatikiak = lazy(() => import('./pages/Zatikiak'));
const LehenMailakoa = lazy(() => import('./pages/LehenMailakoa'));
const ZenbakiOsoak = lazy(() => import('./pages/ZenbakiOsoak'));
const BerreturakErroak = lazy(() => import('./pages/BerreturakErroak'));
const Sistemak2x2 = lazy(() => import('./pages/Sistemak2x2'));
const Proportzionaltasuna = lazy(() => import('./pages/Proportzionaltasuna'));
const Polinomioak = lazy(() => import('./pages/Polinomioak'));
const Trigonometria = lazy(() => import('./pages/Trigonometria'));
const Estatistika = lazy(() => import('./pages/Estatistika'));
const FuntzioakAzterketa = lazy(() => import('./pages/FuntzioakAzterketa'));
const Deribatuak = lazy(() => import('./pages/Deribatuak'));
const Integralak = lazy(() => import('./pages/Integralak'));
const Matrizeak = lazy(() => import('./pages/Matrizeak'));
const ZenbakiSistemak = lazy(() => import('./pages/ZenbakiSistemak'));
const Bektoreak = lazy(() => import('./pages/Bektoreak'));
const AzalerakBolumenak = lazy(() => import('./pages/AzalerakBolumenak'));
const EragiketaKonbinatuak = lazy(() => import('./pages/EragiketaKonbinatuak'));
const Zatigarritasuna = lazy(() => import('./pages/Zatigarritasuna'));
const ZenbakiHamartarrak = lazy(() => import('./pages/ZenbakiHamartarrak'));
const LogikaBoolearra = lazy(() => import('./pages/LogikaBoolearra'));
const Algoritmoak = lazy(() => import('./pages/Algoritmoak'));
const Kriptografia = lazy(() => import('./pages/Kriptografia'));
const Logaritmoak = lazy(() => import('./pages/Logaritmoak'));
const UnitateAldaketak = lazy(() => import('./pages/UnitateAldaketak'));
const ZatikiSortzailea = lazy(() => import('./pages/ZatikiSortzailea'));
const Inekuazioak = lazy(() => import('./pages/Inekuazioak'));
const ProduktuNabarmenak = lazy(() => import('./pages/ProduktuNabarmenak'));
const Sistemak3x3 = lazy(() => import('./pages/Sistemak3x3'));
const AntzekotasunaTales = lazy(() => import('./pages/AntzekotasunaTales'));
const SistemaSexagesimala = lazy(() => import('./pages/SistemaSexagesimala'));
const Segidak = lazy(() => import('./pages/Segidak'));
const Limiteak = lazy(() => import('./pages/Limiteak'));
const Diagnostikoa = lazy(() => import('./pages/Diagnostikoa'));
const Usap = lazy(() => import('./pages/Usap'));
const LegeOharra = lazy(() => import('./pages/LegeOharra'));
const PribatutasunPolitika = lazy(() => import('./pages/PribatutasunPolitika'));
const Lizentzia = lazy(() => import('./pages/Lizentzia'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bigarren-mailakoa" element={<BigarrenMailakoa />} />
          <Route path="/zatikiak" element={<Zatikiak />} />
          <Route path="/lehen-mailakoa" element={<LehenMailakoa />} />
          <Route path="/zenbaki-osoak" element={<ZenbakiOsoak />} />
          <Route path="/berreturak-erroak" element={<BerreturakErroak />} />
          <Route path="/sistemak-2x2" element={<Sistemak2x2 />} />
          <Route path="/proportzionaltasuna" element={<Proportzionaltasuna />} />
          <Route path="/polinomioak" element={<Polinomioak />} />
          <Route path="/trigonometria" element={<Trigonometria />} />
          <Route path="/estatistika" element={<Estatistika />} />
          <Route path="/funtzioak" element={<FuntzioakAzterketa />} />
          <Route path="/deribatuak" element={<Deribatuak />} />
          <Route path="/integralak" element={<Integralak />} />
          <Route path="/matrizeak" element={<Matrizeak />} />
          <Route path="/zenbaki-sistemak" element={<ZenbakiSistemak />} />
          <Route path="/bektoreak" element={<Bektoreak />} />
          <Route path="/azalerak-bolumenak" element={<AzalerakBolumenak />} />
          <Route path="/eragiketa-konbinatuak" element={<EragiketaKonbinatuak />} />
          <Route path="/zatigarritasuna" element={<Zatigarritasuna />} />
          <Route path="/zenbaki-hamartarrak" element={<ZenbakiHamartarrak />} />
          <Route path="/logika-boolearra" element={<LogikaBoolearra />} />
          <Route path="/algoritmoak" element={<Algoritmoak />} />
          <Route path="/kriptografia" element={<Kriptografia />} />
          <Route path="/logaritmoak" element={<Logaritmoak />} />
          <Route path="/unitate-aldaketak" element={<UnitateAldaketak />} />
          <Route path="/zatiki-sortzailea" element={<ZatikiSortzailea />} />
          <Route path="/inekuazioak" element={<Inekuazioak />} />
          <Route path="/produktu-nabarmenak" element={<ProduktuNabarmenak />} />
          <Route path="/sistemak-3x3" element={<Sistemak3x3 />} />
          <Route path="/antzekotasuna-tales" element={<AntzekotasunaTales />} />
          <Route path="/sistema-sexagesimala" element={<SistemaSexagesimala />} />
          <Route path="/segidak" element={<Segidak />} />
          <Route path="/limiteak" element={<Limiteak />} />
          <Route path="/diagnostikoa" element={<Diagnostikoa />} />
          <Route path="/usap" element={<Usap />} />
          <Route path="/lege-oharra" element={<LegeOharra />} />
          <Route path="/pribatutasun-politika" element={<PribatutasunPolitika />} />
          <Route path="/lizentzia" element={<Lizentzia />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
