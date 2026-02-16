import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, FileText, Check, X, Share2, BookOpen } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Lizentzia() {
  useDocumentTitle('Lizentzia');
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
          <span className="font-semibold text-indigo-600">Lizentzia</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <FileText size={16} />
            Jabetza Intelektuala
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Lizentzia</h1>
          <p className="text-slate-500">Azken eguneraketa: 2026ko otsailaren 16a</p>
        </div>

        <div className="space-y-8">
          {/* CC lizentzia */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Share2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Creative Commons Lizentzia</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                mate.eus webguneko eduki guztiak (testuak, azalpenak, ariketak, simulagailuen diseinua eta hezkuntza-materialak){' '}
                <strong>Creative Commons Aitortu-EzKomertziala-PartekatuBerdin 4.0 Nazioartekoa (CC BY-NC-SA 4.0)</strong>{' '}
                lizentziapean argitaratuta daude.
              </p>
              <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="font-bold text-purple-800 mb-2">CC BY-NC-SA 4.0</p>
                <p className="text-sm text-purple-700">
                  Creative Commons Aitortu-EzKomertziala-PartekatuBerdin 4.0 Nazioartekoa
                </p>
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Lizentzia osoa irakurri (Creative Commons)
                </a>
              </div>
            </div>
          </section>

          {/* Zer egin dezakezu */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Check size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Baimendutako Erabilerak</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>Lizentzia honen arabera, honako hauek egin ditzakezu:</p>
              <ul className="space-y-3">
                {[
                  { text: 'Edukiak partekatu', desc: 'Materiala edozein euskarri edo formatutan kopiatu eta birbanatu.' },
                  { text: 'Edukiak moldatu', desc: 'Materiala nahasi, eraldatu eta beraren gainean eraiki.' },
                  { text: 'Hezkuntzan erabili', desc: 'Ikasgeletan, tutoretzetan eta hezkuntza-testuinguruetan libreki erabili.' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-800">{item.text}:</span>{' '}
                      <span>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Baldintzak */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Baldintzak</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>Aurreko erabilerak honako baldintza hauekin egin behar dira:</p>
              <ul className="space-y-3">
                {[
                  { label: 'Aitortu (BY)', desc: 'Jatorrizko egiletzaren aitorpena eman behar da: "Beñat Erezuma — mate.eus". Lizentziaren esteka eman eta aldaketarik egin den adierazi behar da.' },
                  { label: 'EzKomertziala (NC)', desc: 'Materiala ezin da helburu komertzialetarako erabili. Ezin da saldu, publizitate bidez monetizatu edo irabazizko jardueretan erabili.' },
                  { label: 'PartekatuBerdin (SA)', desc: 'Materiala nahasi, eraldatu edo beraren gainean eraikitzen bada, ekarpenak lizentzia berdinaren edo bateragarri baten pean banatu behar dira.' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded flex-shrink-0 mt-0.5">
                      {item.label}
                    </span>
                    <span className="text-sm">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Debekatutakoa */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <X size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Debekatutako Erabilerak</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <ul className="space-y-3">
                {[
                  'Edukiak helburu komertzialekin erabiltzea edo saltzea.',
                  'Egiletzaren aitorpena kentzea edo aldatzea.',
                  'Eratorritako lanak lizentzia murriztailegago baten pean banatzea.',
                  'mate.eus marka edo izena baimenik gabe erabiltzea.',
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Kodea */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Iturburu-Kodea</h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                Webgunearen iturburu-kodea (JavaScript, CSS eta HTML) eduki pedagogikoetatik bereizita dago. Kodearen lizentzia eduki-lizentziatik independentea izan daiteke.
              </p>
              <p>
                Kodearen berrerabilpenarekin lotutako galderak egiteko, jarri harremanetan{' '}
                <a href="mailto:info@berezuma.com" className="text-indigo-600 hover:text-indigo-800 underline">
                  info@berezuma.com
                </a>{' '}
                helbidean.
              </p>
            </div>
          </section>

          {/* Aitorpen eredua */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Aitorpen Eredua</h2>
            <div className="text-slate-700 leading-relaxed">
              <p className="mb-3">Edukiak partekatzean, honako aitorpen eredu hau erabiltzea gomendatzen da:</p>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm text-slate-600">
                Materiala "mate.eus" webgunetik hartua, Beñat Erezumak sortua.
                <br />
                Lizentzia: CC BY-NC-SA 4.0
                <br />
                https://mate.eus
              </div>
            </div>
          </section>

          {/* Beste orrialde legaletara estekak */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/lege-oharra" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline">
              Lege Oharra
            </Link>
            <Link to="/pribatutasun-politika" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline">
              Pribatutasun Politika
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
