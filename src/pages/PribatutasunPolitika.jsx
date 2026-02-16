import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Shield, Server, Cookie, Eye, Mail } from 'lucide-react';

export default function PribatutasunPolitika() {
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
          <span className="font-semibold text-indigo-600">Pribatutasun Politika</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Shield size={16} />
            Datuen Babesa
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Pribatutasun Politika</h1>
          <p className="text-slate-500">Azken eguneraketa: 2026ko otsailaren 16a</p>
        </div>

        <div className="space-y-8">
          {/* Sarrera */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Konpromiso Orokorra</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus atariak <strong>ez du datu pertsonalik biltzen</strong>. Erabiltzaileen pribatutasuna errespetatzea funtsezko printzipio bat da proiektu honentzat.
              </p>
              <p>
                Webgune honetan ez da erregistro-sistemarik, erabiltzaile-konturik, posta-harpidetza sistemarik, formulariorik edo datu pertsonalak jasotzeko beste mekanismo bat ere existitzen.
              </p>
            </div>
          </section>

          {/* Cookieak */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Cookie size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Cookieak eta Jarraipen-Tresnak</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus-ek <strong>ez du cookierik erabiltzen</strong> erabiltzaileak jarraitzeko edo identifikatzeko. Ez da analitika-tresnarik (Google Analytics edo antzekoak) edo publizitate-jarraipen sistemarik erabiltzen.
              </p>
              <p>
                Hosting hornitzaileak (Vercel) teknikoki beharrezko cookieak erabil ditzake zerbitzuaren funtzionamendu egokirako, baina hauek ez dute erabiltzaileak identifikatzen edo jarraitzen.
              </p>
            </div>
          </section>

          {/* Hosting */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Server size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Hosting Hornitzailea</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus webgunea <strong>Vercel Inc.</strong>-en zerbitzarietan ostatatuta dago.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Enpresa:</strong> Vercel Inc.</li>
                <li><strong>Helbidea:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, Ameriketako Estatu Batuak</li>
                <li>
                  <strong>Pribatutasun politika:</strong>{' '}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                    vercel.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
              <p>
                Vercel-ek zerbitzariaren erregistroak (log fitxategiak) gorde ditzake, IP helbideak eta sarbide-datuak barne, plataformaren segurtasuna eta funtzionamendua bermatzeko. Datu hauek Vercel-en pribatutasun politikaren arabera kudeatzen dira.
              </p>
            </div>
          </section>

          {/* Hirugarrenen zerbitzuak */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Hirugarrenen Zerbitzuak</h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus-ek ez du hirugarrenen zerbitzu integratuek biltzen duten daturik kontrolatzen. Webguneak kanpoko baliabideak kargatzea saihestu egiten du erabiltzaileen pribatutasuna bermatzeko.
              </p>
            </div>
          </section>

          {/* Adingabekoak */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Adingabekoen Babesa</h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus hezkuntza-plataforma bat izanik, adingabekoek erabil dezakete. Datu pertsonalik biltzen ez denez, ez da adingabekoei buruzko informazio berezirik jasotzen edo tratatzen.
              </p>
            </div>
          </section>

          {/* Eskubideak */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Mail size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Harremanetarako</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                Pribatutasunarekin lotutako edozein galdera edo eskaera egiteko, jarri harremanetan helbide honetan:
              </p>
              <p>
                <a href="mailto:info@berezuma.com" className="text-indigo-600 hover:text-indigo-800 underline font-medium">
                  info@berezuma.com
                </a>
              </p>
              <p>
                Arduraduna: Beñat Erezuma
              </p>
            </div>
          </section>

          {/* Beste orrialde legaletara estekak */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/lege-oharra" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline">
              Lege Oharra
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
