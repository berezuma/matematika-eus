import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sigma, ArrowRight, Check, RefreshCw, Zap, ListOrdered } from 'lucide-react';
import useProgress from '../hooks/useProgress';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}>
    <div className="bg-indigo-100 px-6 py-4 flex items-center gap-3">
      {Icon && <Icon className="w-6 h-6 text-indigo-600" />}
      <h3 className="text-xl font-bold text-indigo-600">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function Inekuazioak() {
  useDocumentTitle('Inekuazioak eta Tarteak');
  const [activeTab, setActiveTab] = useState('Teoria');
  const tabs = ['Teoria', 'Laborategia', 'Formulak', 'Praktika'];

  // Laborategia state
  const [labA, setLabA] = useState('2');
  const [labB, setLabB] = useState('3');
  const [labC, setLabC] = useState('7');
  const [labOp, setLabOp] = useState('>');
  const [labResult, setLabResult] = useState(null);
  const [labSteps, setLabSteps] = useState([]);

  // Praktika state
  const { score: practiceScore, total: practiceTotal, addCorrect, addIncorrect, reset } = useProgress('inekuazioak');
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);

  // ---------- Laborategia helpers ----------
  const solveInequality = () => {
    const a = parseFloat(labA);
    const b = parseFloat(labB);
    const c = parseFloat(labC);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setLabSteps(['Sartu zenbaki baliodunak.']);
      setLabResult(null);
      return;
    }
    if (a === 0) {
      setLabSteps(['a ezin da 0 izan (ez da aldagai-termino bat egongo).']);
      setLabResult(null);
      return;
    }

    const steps = [];
    steps.push(`Hasierako inekuazioa: ${a}x + ${b} ${labOp} ${c}`);

    const rhs1 = c - b;
    steps.push(`1. urratsa: Kendu ${b} bi aldeetan → ${a}x ${labOp} ${rhs1}`);

    let finalOp = labOp;
    if (a < 0) {
      if (labOp === '>') finalOp = '<';
      else if (labOp === '<') finalOp = '>';
      else if (labOp === '>=') finalOp = '<=';
      else if (labOp === '<=') finalOp = '>=';
      steps.push(`2. urratsa: Zatitu ${a}-z bi aldeetan. a negatiboa denez, zeinua ALDATU egiten da!`);
    } else {
      steps.push(`2. urratsa: Zatitu ${a}-z bi aldeetan.`);
    }

    const solution = rhs1 / a;
    const solRounded = Math.round(solution * 1000) / 1000;
    steps.push(`Emaitza: x ${finalOp} ${solRounded}`);

    setLabSteps(steps);
    setLabResult({ value: solRounded, op: finalOp });
  };

  const getNumberLinePosition = (val) => {
    const min = val - 5;
    const max = val + 5;
    return ((val - min) / (max - min)) * 100;
  };

  // ---------- Praktika helpers ----------
  const generateProblem = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const negA = Math.random() < 0.3;
    const aVal = negA ? -a : a;
    const bVal = Math.floor(Math.random() * 21) - 10;
    const cVal = Math.floor(Math.random() * 21) - 10;
    const ops = ['>', '<', '>=', '<='];
    const op = ops[Math.floor(Math.random() * ops.length)];

    const rhs = cVal - bVal;
    let correctOp = op;
    if (aVal < 0) {
      if (op === '>') correctOp = '<';
      else if (op === '<') correctOp = '>';
      else if (op === '>=') correctOp = '<=';
      else if (op === '<=') correctOp = '>=';
    }
    const correctVal = Math.round((rhs / aVal) * 1000) / 1000;

    setCurrentProblem({
      a: aVal,
      b: bVal,
      c: cVal,
      op,
      correctOp,
      correctVal,
    });
    setPracticeAnswer('');
    setPracticeFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentProblem) return;
    const userVal = parseFloat(practiceAnswer);
    if (isNaN(userVal)) {
      setPracticeFeedback('Sartu zenbaki bat.');
      return;
    }
    const diff = Math.abs(userVal - currentProblem.correctVal);
    const isCorrect = diff < 0.01;

    if (isCorrect) {
      addCorrect();
      setPracticeFeedback('Ondo! Erantzun zuzena da.');
    } else {
      addIncorrect();
      setPracticeFeedback(
        `Oker. Erantzun zuzena: x ${currentProblem.correctOp} ${currentProblem.correctVal}`
      );
    }
  };

  const resetScore = () => {
    reset();
    setPracticeFeedback(null);
    setPracticeAnswer('');
    setCurrentProblem(null);
  };

  const opLabel = (op) => {
    if (op === '>') return '>';
    if (op === '<') return '<';
    if (op === '>=') return '\u2265';
    if (op === '<=') return '\u2264';
    return op;
  };

  // ---------- Render helpers ----------

  const renderTeoria = () => (
    <div className="space-y-8">
      {/* Zer dira inekuazioak */}
      <Section title="Zer dira inekuazioak?" icon={BookOpen}>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>Inekuazioa</strong> bi adierazpen matematiko konparatzeko erabiltzen den
            adierazpena da, baina berdintasunaren ordez, ordena-erlazio bat erabiltzen du:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
            {[
              { sym: '<', label: 'Txikiagoa' },
              { sym: '>', label: 'Handiagoa' },
              { sym: '\u2264', label: 'Txikiagoa edo berdina' },
              { sym: '\u2265', label: 'Handiagoa edo berdina' },
            ].map((item) => (
              <div
                key={item.sym}
                className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-200"
              >
                <span className="text-3xl font-bold text-indigo-600">{item.sym}</span>
                <p className="mt-1 text-sm text-indigo-700 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
          <p>
            Adibidez, <code className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">3x + 2 &gt; 8</code> inekuazioan,
            bilatzen dugu <em>x</em>-ren balio guztiak non <em>3x + 2</em> 8 baino handiagoa den.
          </p>
        </div>
      </Section>

      {/* Inekuazio linealak ebaztea */}
      <Section title="Inekuazio linealak nola ebatzi" icon={ListOrdered}>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>Inekuazio lineal bat ebazteko, ekuazio bat bezala tratatzen da, <strong>arau garrantzitsu batekin</strong>:</p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl my-4">
            <p className="font-bold text-red-700">Arau garrantzitsua!</p>
            <p className="text-red-600">
              Zenbaki <strong>negatibo</strong> batez biderkatu edo zatitzean,
              inekuazioaren <strong>zeinua ALDATU</strong> egin behar da.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-200">
            <p className="font-semibold text-indigo-700">Adibidea: Ebatzi 2x + 3 &gt; 7</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Kendu 3 bi aldeetan: <code className="bg-indigo-50 px-1 rounded">2x &gt; 4</code></li>
              <li>Zatitu 2-z bi aldeetan: <code className="bg-indigo-50 px-1 rounded">x &gt; 2</code></li>
            </ol>
            <p className="text-sm text-gray-500">Emaitza: x 2 baino handiagoa den edozein zenbaki da.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-200 mt-4">
            <p className="font-semibold text-indigo-700">Adibidea (negatiboarekin): Ebatzi -3x + 6 &le; 12</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Kendu 6 bi aldeetan: <code className="bg-indigo-50 px-1 rounded">-3x &le; 6</code></li>
              <li>Zatitu -3-z bi aldeetan <strong>(zeinua aldatu!)</strong>: <code className="bg-indigo-50 px-1 rounded">x &ge; -2</code></li>
            </ol>
            <p className="text-sm text-gray-500">Emaitza: x -2 baino handiagoa edo berdina den edozein zenbaki da.</p>
          </div>
        </div>
      </Section>

      {/* Tarteak */}
      <Section title="Tarte-notazioa" icon={Sigma}>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Inekuazio baten emaitza <strong>tarte</strong> moduan adieraz daiteke. Tarteak zenbaki-zuzen
            batean emaitza-multzoa irudikatzen du:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-2">
              <thead>
                <tr className="bg-indigo-50 text-indigo-700">
                  <th className="border border-indigo-200 px-4 py-2 text-left">Notazioa</th>
                  <th className="border border-indigo-200 px-4 py-2 text-left">Esanahia</th>
                  <th className="border border-indigo-200 px-4 py-2 text-left">Inekuazioa</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['(a, b)', 'a < x < b', 'Tarte irekia'],
                  ['[a, b]', 'a \u2264 x \u2264 b', 'Tarte itxia'],
                  ['[a, b)', 'a \u2264 x < b', 'Ezkerretik itxia, eskuinetik irekia'],
                  ['(a, b]', 'a < x \u2264 b', 'Ezkerretik irekia, eskuinetik itxia'],
                  ['(-\u221E, b)', 'x < b', 'Mugarik gabe ezkerretik'],
                  ['(-\u221E, b]', 'x \u2264 b', 'Mugarik gabe ezkerretik (itxia)'],
                  ['(a, +\u221E)', 'x > a', 'Mugarik gabe eskuinetik'],
                  ['[a, +\u221E)', 'x \u2265 a', 'Mugarik gabe eskuinetik (itxia)'],
                ].map(([notation, ineq, desc], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-4 py-2 font-mono font-semibold text-indigo-600">
                      {notation}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">{ineq}</td>
                    <td className="border border-gray-200 px-4 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            <strong>Oharra:</strong> Infinitua (&infin;) beti parentesi irekiarekin idazten da,
            inoiz ez kortxete itxiarekin, ezin baita &ldquo;heldu&rdquo;.
          </p>
        </div>
      </Section>

      {/* Zenbaki-zuzenean irudikatzea */}
      <Section title="Zenbaki-zuzenean irudikatzea" icon={ArrowRight}>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Inekuazio baten emaitza zenbaki-zuzen batean irudika daiteke:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Puntu bete (&#9679;)</strong>: Balioa tartean sartuta dago (&le; edo &ge;).</li>
            <li><strong>Puntu hutsa (&#9675;)</strong>: Balioa EZ dago tartean sartuta (&lt; edo &gt;).</li>
            <li><strong>Gezi bat</strong> norabide batean: Infinitu aldera hedatzen dela adierazten du.</li>
          </ul>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-4">
            <p className="font-semibold text-indigo-700 mb-3">Adibidea: x &gt; 2</p>
            <div className="relative h-8 mx-4">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 right-0 h-1.5 bg-indigo-500 -translate-y-1/2 rounded-r"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-indigo-600">2</div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 text-indigo-500 font-bold">&rarr;</div>
            </div>
            <p className="text-sm text-gray-500 mt-8">Puntu hutsa 2-n (ez da sartzen), gezia eskuinera.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-4">
            <p className="font-semibold text-indigo-700 mb-3">Adibidea: x &le; -1</p>
            <div className="relative h-8 mx-4">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 right-1/2 h-1.5 bg-indigo-500 -translate-y-1/2 rounded-l"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-indigo-500 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-indigo-600">-1</div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 text-indigo-500 font-bold">&larr;</div>
            </div>
            <p className="text-sm text-gray-500 mt-8">Puntu betea -1-en (sartzen da), gezia ezkerrera.</p>
          </div>
        </div>
      </Section>
    </div>
  );

  const renderLaborategia = () => (
    <div className="space-y-8">
      <Section title="Inekuazio-ebazlea" icon={Zap}>
        <div className="space-y-6">
          <p className="text-gray-700">
            Sartu <code className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">ax + b &#9671; c</code> formako
            inekuazio bat. Urratsez urrats ebatziko dugu.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">a</label>
              <input
                type="number"
                value={labA}
                onChange={(e) => setLabA(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">b</label>
              <input
                type="number"
                value={labB}
                onChange={(e) => setLabB(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Eragiketa</label>
              <select
                value={labOp}
                onChange={(e) => setLabOp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&ge;</option>
                <option value="<=">&le;</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">c</label>
              <input
                type="number"
                value={labC}
                onChange={(e) => setLabC(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <button
                onClick={solveInequality}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
              >
                Ebatzi
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 text-center text-lg font-mono text-indigo-700">
            {labA}x + {labB} {opLabel(labOp)} {labC}
          </div>

          {labSteps.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
              <h4 className="font-bold text-indigo-700 mb-2">Ebazpena urratsez urrats:</h4>
              {labSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          )}

          {labResult && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <span className="text-green-700 font-bold text-lg">
                  Emaitza: x {opLabel(labResult.op)} {labResult.value}
                </span>
              </div>

              {/* Number line visualization */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-indigo-700 mb-4">Zenbaki-zuzenean:</h4>
                <div className="relative h-12 mx-8">
                  {/* Base line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 -translate-y-1/2"></div>

                  {/* Tick marks */}
                  {Array.from({ length: 11 }, (_, i) => {
                    const val = labResult.value - 5 + i;
                    const pos = (i / 10) * 100;
                    return (
                      <div key={i}>
                        <div
                          className="absolute top-1/2 w-px h-3 bg-gray-400 -translate-y-1/2"
                          style={{ left: `${pos}%` }}
                        ></div>
                        <div
                          className="absolute top-full text-xs text-gray-500 -translate-x-1/2 mt-1"
                          style={{ left: `${pos}%` }}
                        >
                          {Math.round(val * 100) / 100}
                        </div>
                      </div>
                    );
                  })}

                  {/* Highlight region */}
                  {(labResult.op === '>' || labResult.op === '>=') && (
                    <div
                      className="absolute top-1/2 h-2 bg-indigo-400 -translate-y-1/2 rounded-r"
                      style={{ left: '50%', right: '0%' }}
                    ></div>
                  )}
                  {(labResult.op === '<' || labResult.op === '<=') && (
                    <div
                      className="absolute top-1/2 h-2 bg-indigo-400 -translate-y-1/2 rounded-l"
                      style={{ left: '0%', right: '50%' }}
                    ></div>
                  )}

                  {/* Point marker */}
                  <div
                    className={`absolute top-1/2 w-5 h-5 rounded-full border-3 border-indigo-500 -translate-x-1/2 -translate-y-1/2 ${
                      labResult.op === '>=' || labResult.op === '<='
                        ? 'bg-indigo-500'
                        : 'bg-white'
                    }`}
                    style={{ left: '50%', borderWidth: '3px' }}
                  ></div>
                </div>
              </div>

              {/* Interval notation */}
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <span className="text-indigo-700 font-semibold">Tarte-notazioa: </span>
                <span className="font-mono text-indigo-800 text-lg">
                  {labResult.op === '>' && `(${labResult.value}, +\u221E)`}
                  {labResult.op === '>=' && `[${labResult.value}, +\u221E)`}
                  {labResult.op === '<' && `(-\u221E, ${labResult.value})`}
                  {labResult.op === '<=' && `(-\u221E, ${labResult.value}]`}
                </span>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );

  const renderFormulak = () => (
    <div className="space-y-8">
      {/* Inekuazioen arauak */}
      <Section title="Inekuazioen arauak" icon={ListOrdered}>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Batuketa / Kenketa',
              content: 'Zenbaki bera bi aldeetan batu edo kendu daiteke zeinua aldatu gabe.',
              example: 'x + 3 > 5 → x > 2',
            },
            {
              title: 'Biderketa / Zatiketa (positiboa)',
              content: 'Zenbaki positibo batez biderkatu edo zatitu daiteke zeinua aldatu gabe.',
              example: '2x < 6 → x < 3',
            },
            {
              title: 'Biderketa / Zatiketa (negatiboa)',
              content: 'Zenbaki NEGATIBO batez biderkatu edo zatitzean, zeinua ALDATU egin behar da.',
              example: '-2x < 6 → x > -3',
            },
            {
              title: 'Transitibitatea',
              content: 'a < b eta b < c bada, orduan a < c.',
              example: 'x < 3 eta 3 < 5 → x < 5',
            },
          ].map((rule, i) => (
            <div key={i} className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
              <h4 className="font-bold text-indigo-700 mb-2">{rule.title}</h4>
              <p className="text-gray-700 text-sm mb-3">{rule.content}</p>
              <div className="bg-white rounded-lg px-3 py-2 font-mono text-sm text-indigo-600 border border-indigo-100">
                {rule.example}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tarte-notazioa */}
      <Section title="Tarte-notazioaren laburpena" icon={Sigma}>
        <div className="space-y-4 text-gray-700">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { notation: '(a, b)', meaning: 'Tarte irekia', set: '{x | a < x < b}' },
              { notation: '[a, b]', meaning: 'Tarte itxia', set: '{x | a \u2264 x \u2264 b}' },
              { notation: '[a, b)', meaning: 'Erdiirekia (eskuinetik)', set: '{x | a \u2264 x < b}' },
              { notation: '(a, b]', meaning: 'Erdiirekia (ezkerretik)', set: '{x | a < x \u2264 b}' },
              { notation: '(-\u221E, b)', meaning: 'b baino txikiagoak', set: '{x | x < b}' },
              { notation: '(-\u221E, b]', meaning: 'b baino txikiago edo berdinak', set: '{x | x \u2264 b}' },
              { notation: '(a, +\u221E)', meaning: 'a baino handiagoak', set: '{x | x > a}' },
              { notation: '[a, +\u221E)', meaning: 'a baino handiago edo berdinak', set: '{x | x \u2265 a}' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="font-mono font-bold text-indigo-600 text-lg min-w-[90px]">{item.notation}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.meaning}</p>
                  <p className="text-xs font-mono text-gray-500">{item.set}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Inekuazio konposatuak */}
      <Section title="Inekuazio konposatuak" icon={BookOpen}>
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>
            <strong>Inekuazio konposatuak</strong> bi inekuazio edo gehiago konbinatzen dituztenak dira.
            Bi mota nagusi daude:
          </p>

          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
            <h4 className="font-bold text-indigo-700 mb-2">Konjuntzioa (&ldquo;ETA&rdquo; / &cap;)</h4>
            <p className="text-sm mb-2">Bi baldintzak aldi berean bete behar dira.</p>
            <div className="bg-white rounded-lg px-3 py-2 font-mono text-sm text-indigo-600 border border-indigo-100">
              Adibidea: -1 &lt; x &le; 5 &rarr; (-1, 5]
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h4 className="font-bold text-purple-700 mb-2">Disjuntzioa (&ldquo;EDO&rdquo; / &cup;)</h4>
            <p className="text-sm mb-2">Gutxienez baldintza bat bete behar da.</p>
            <div className="bg-white rounded-lg px-3 py-2 font-mono text-sm text-purple-600 border border-purple-100">
              Adibidea: x &lt; -2 edo x &gt; 3 &rarr; (-&infin;, -2) &cup; (3, +&infin;)
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-2">Balio absolutua duten inekuazioak</h4>
            <div className="space-y-2 text-sm">
              <p><code className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">|x| &lt; a</code> &rarr; -a &lt; x &lt; a &rarr; (-a, a)</p>
              <p><code className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">|x| &gt; a</code> &rarr; x &lt; -a edo x &gt; a &rarr; (-&infin;, -a) &cup; (a, +&infin;)</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const renderPraktika = () => (
    <div className="space-y-8">
      <Section title="Inekuazioak praktikatu" icon={Zap}>
        <div className="space-y-6">
          {/* Score display */}
          <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-indigo-600 font-medium">Puntuazioa</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {practiceScore}/{practiceTotal}
                </p>
              </div>
              {practiceTotal > 0 && (
                <div className="text-center">
                  <p className="text-sm text-indigo-600 font-medium">Ehunekoa</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {Math.round((practiceScore / practiceTotal) * 100)}%
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={resetScore}
              className="flex items-center gap-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg px-4 py-2 hover:bg-indigo-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Berrezarri
            </button>
          </div>

          {/* Generate button */}
          {!currentProblem && (
            <div className="text-center">
              <button
                onClick={generateProblem}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl px-8 py-3 transition-colors text-lg"
              >
                Ariketa berria sortu
              </button>
            </div>
          )}

          {/* Problem display */}
          {currentProblem && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-sm text-gray-500 mb-2">Ebatzi inekuazio hau:</p>
                <p className="text-2xl font-mono font-bold text-indigo-700">
                  {currentProblem.a}x {currentProblem.b >= 0 ? '+' : '-'}{' '}
                  {Math.abs(currentProblem.b)} {opLabel(currentProblem.op)} {currentProblem.c}
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Idatzi <em>x</em>-ren balioa (zenbakia bakarrik). Adibidez, x &gt; 3 bada, idatzi 3.
                </p>
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Zure erantzuna (x-ren balioa):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={practiceAnswer}
                    onChange={(e) => setPracticeAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') checkAnswer();
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="Adib: 3.5"
                  />
                </div>
                <button
                  onClick={checkAnswer}
                  disabled={!!practiceFeedback}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold rounded-lg px-6 py-3 transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Egiaztatu
                </button>
              </div>

              {/* Feedback */}
              {practiceFeedback && (
                <div
                  className={`rounded-xl p-4 text-center font-semibold ${
                    practiceFeedback.startsWith('Ondo')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {practiceFeedback}
                </div>
              )}

              {/* Next button */}
              {practiceFeedback && (
                <div className="text-center">
                  <button
                    onClick={generateProblem}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl px-8 py-3 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Hurrengo ariketa
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-bold text-yellow-700 mb-2">Aholkuak:</h4>
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
              <li>Lehenik, b kendu bi aldeetan.</li>
              <li>Gero, a-z zatitu. Gogoratu: a negatiboa bada, zeinua aldatu!</li>
              <li>Emaitza zenbaki bat da (dezimalekin ere izan daiteke).</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Teoria':
        return renderTeoria();
      case 'Laborategia':
        return renderLaborategia();
      case 'Formulak':
        return renderFormulak();
      case 'Praktika':
        return renderPraktika();
      default:
        return renderTeoria();
    }
  };

  const tabIcons = {
    Teoria: BookOpen,
    Laborategia: Zap,
    Formulak: Sigma,
    Praktika: ListOrdered,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-500 rounded-lg p-2 group-hover:bg-indigo-600 transition-colors">
              <Sigma className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              MATE<span className="text-indigo-500">.EUS</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Inekuazioak eta{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
              Tarteak
            </span>
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Ikasi inekuazioak ebazten, tarteak ulertzen eta zenbaki-zuzenean irudikatzen.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-10">{renderContent()}</main>

      {/* Footer */}
      <RelatedTopics currentId="inekuazioak" />
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            Mate.eus &copy; 2026. Egilea:{' '}
            <a
              href="https://berezuma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Be&ntilde;at Erezuma
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
