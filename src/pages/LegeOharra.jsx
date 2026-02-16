import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Scale, Mail, Globe, User, ShieldCheck } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function LegeOharra() {
  useDocumentTitle('Lege Oharra');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <Home size={18} />
            <span className="font-medium">mate.eus</span>
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="font-semibold text-indigo-600">Lege Oharra</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            <Scale size={16} />
            Informazio Legala
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Lege Oharra</h1>
          <p className="text-slate-500">Azken eguneraketa: 2026ko otsailaren 16a</p>
        </div>

        <div className="space-y-8">
          {/* Identifikazioa */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Arduradunaren Identifikazioa</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                <strong>Webgunearen izena:</strong> mate.eus (MATE.EUS)
              </p>
              <p>
                <strong>Arduraduna:</strong> Beñat Erezuma
              </p>
              <p>
                <strong>Harremanetarako helbide elektronikoa:</strong>{' '}
                <a href="mailto:info@berezuma.com" className="text-indigo-600 hover:text-indigo-800 underline">
                  info@berezuma.com
                </a>
              </p>
              <p>
                <strong>Webgunea:</strong>{' '}
                <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                  berezuma.com
                </a>
              </p>
            </div>
          </section>

          {/* Proiektuaren izaera */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Globe size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Proiektuaren Izaera</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus irabazi-asmorik gabeko hezkuntza-proiektu pertsonala da, Beñat Erezumak sortua eta kudeatua. Proiektu honek matematika euskaraz ikasteko baliabide digitalak eskaintzen ditu, doan eta guztientzat eskuragarri.
              </p>
              <p>
                Proiektu hau ez dago jarduera ekonomiko edo komertzial baten barruan. Ez da enpresa bat, ez elkarte bat, ez erakunde juridiko bat. Izaera pertsonala eta hezkuntza-helburua duen ekimen boluntarioa da.
              </p>
              <p>
                Aurrekoa kontuan hartuta, ez da identifikazio fiskal zenbaki publikorik (NAN/IFZ) ez helbide fisikorik argitaratzen, ez baitago zerga-betebeharrik sortzen duen jarduera ekonomikorik.
              </p>
            </div>
          </section>

          {/* Baldintzak */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Erabilera-Baldintzak</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                Webgune honetara sartuz, erabiltzaileak ondorengo baldintzak onartzen ditu:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Edukiak hezkuntza-helburuekin erabiltzea.</li>
                <li>Webguneko edukiak Creative Commons Aitortu-EzKomertziala-PartekatuBerdin 4.0 (CC BY-NC-SA 4.0) lizentziapean daude.</li>
                <li>Edukien erabilera komertzialik ez da baimenduta.</li>
                <li>Edukiak partekatzean, jatorrizko egiletzaren aitorpena mantendu behar da.</li>
              </ul>
            </div>
          </section>

          {/* Erantzukizuna */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Erantzukizun-Mugaketa</h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus-ek ahalik eta informazio zehatzena eta eguneratua eskaintzeko ahalegina egiten du, baina ez du bermatzen edukien zehaztasun absoluturik. Hezkuntza-baliabide osagarri gisa erabiltzea gomendatzen da.
              </p>
              <p>
                Webguneak kanpoko esteka batzuk eduki ditzake. mate.eus ez da kanpoko webguneen edukien arduradun.
              </p>
              <p>
                Edozein galdera edo oharretarako, jarri harremanetan{' '}
                <a href="mailto:info@berezuma.com" className="text-indigo-600 hover:text-indigo-800 underline">
                  info@berezuma.com
                </a>{' '}
                helbidean.
              </p>
            </div>
          </section>

          {/* Jabetza intelektuala */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Jabetza Intelektuala</h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus webguneko eduki guztiak (testuak, irudiak, kodea, diseinua eta simulagailuak) Beñat Erezumaren jabetza intelektuala dira, lizentzia-orrialdean zehaztutako baldintzetan baimenduta.
              </p>
              <p>
                Webgunearen izena, marka eta logotipoa erreserbatutako eskubideak dira.
              </p>
            </div>
          </section>

          {/* Aplikagarria den legedia */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Aplikagarria den Legedia</h2>
            <p className="text-slate-700 leading-relaxed">
              Lege-ohar hau indarrean dagoen Espainiako legediaren arabera arautzen da. Edozein eztabaidarako, Bilboko epaitegi eta auzitegiak izango dira eskudunak.
            </p>
          </section>

          {/* Beste orrialde legaletara estekak */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/pribatutasun-politika" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline">
              Pribatutasun Politika
            </Link>
            <Link to="/lizentzia" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline">
              Lizentzia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
