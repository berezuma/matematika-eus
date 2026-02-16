import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import {
  BookOpen,
  Check,
  RefreshCw,
  Brain,
  ArrowRight,
  AlertTriangle,
  Layers,
  ListOrdered,
  X,
  BarChart3,
  Dice5,
  Target,
  TrendingUp,
  HeartPulse,
  Vote,
  Thermometer
} from 'lucide-react';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Stats Utilities ---

const mean = (arr) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

const median = (arr) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const mode = (arr) => {
  if (arr.length === 0) return '-';
  const freq = {};
  arr.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return 'Ez dago';
  const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
  return modes.join(', ');
};

const variance = (arr) => {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  return arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
};

const stdDev = (arr) => Math.sqrt(variance(arr));

const range = (arr) => {
  if (arr.length === 0) return 0;
  return Math.max(...arr) - Math.min(...arr);
};

// --- Bar Chart Component ---

const BarChart = ({ data, highlightMean, highlightMedian }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Frequency count
    const freq = {};
    data.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const keys = Object.keys(freq).map(Number).sort((a, b) => a - b);
    const maxFreq = Math.max(...Object.values(freq));

    if (keys.length === 0) return;

    const barWidth = Math.min(40, (chartW / keys.length) * 0.7);
    const gap = (chartW - barWidth * keys.length) / (keys.length + 1);

    // Y-axis grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= maxFreq; i++) {
      const y = padding.top + chartH - (i / maxFreq) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(i.toString(), padding.left - 8, y + 4);
    }

    // Bars
    keys.forEach((key, i) => {
      const x = padding.left + gap + i * (barWidth + gap);
      const barH = (freq[key] / maxFreq) * chartH;
      const y = padding.top + chartH - barH;

      // Gradient bar
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, '#ec4899');
      gradient.addColorStop(1, '#f9a8d4');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Value on top
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(freq[key], x + barWidth / 2, y - 6);

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '11px monospace';
      ctx.fillText(key.toString(), x + barWidth / 2, padding.top + chartH + 20);
    });

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(w - padding.right, padding.top + chartH);
    ctx.stroke();

    // Mean line
    if (highlightMean && data.length > 0) {
      const m = mean(data);
      const minKey = Math.min(...keys);
      const maxKey = Math.max(...keys);
      const range = maxKey - minKey || 1;
      const mx = padding.left + gap + ((m - minKey) / range) * (chartW - gap * 2 - barWidth) + barWidth / 2;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(mx, padding.top);
      ctx.lineTo(mx, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`x̄=${m.toFixed(1)}`, mx, padding.top - 4);
    }

    // Median line
    if (highlightMedian && data.length > 0) {
      const med = median(data);
      const minKey = Math.min(...keys);
      const maxKey = Math.max(...keys);
      const rangeVal = maxKey - minKey || 1;
      const medX = padding.left + gap + ((med - minKey) / rangeVal) * (chartW - gap * 2 - barWidth) + barWidth / 2;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(medX, padding.top);
      ctx.lineTo(medX, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Me=${med.toFixed(1)}`, medX, padding.top + chartH + 34);
    }

  }, [data, highlightMean, highlightMedian]);

  return (
    <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />
  );
};

// --- Dataset Visualizer ---

const DatasetVisualizer = () => {
  const [dataStr, setDataStr] = useState('4, 7, 2, 9, 4, 5, 7, 4, 8, 6');
  const [showMean, setShowMean] = useState(true);
  const [showMedian, setShowMedian] = useState(true);

  const data = dataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

  const presets = [
    { label: 'Notak', data: '4, 7, 2, 9, 4, 5, 7, 4, 8, 6' },
    { label: 'Tenperaturak', data: '15, 17, 16, 18, 20, 22, 19, 21, 23, 20, 18, 17' },
    { label: 'Simetrikoa', data: '1, 2, 3, 4, 5, 5, 4, 3, 2, 1' },
    { label: 'Asimetrikoa', data: '1, 1, 1, 2, 2, 3, 8, 15' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Datuak (koma bidez)</label>
        <input
          type="text"
          value={dataStr}
          onChange={(e) => setDataStr(e.target.value)}
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none font-mono"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setDataStr(p.data)}
              className="px-3 py-1 text-xs font-bold bg-pink-50 text-pink-600 rounded-full border border-pink-100 hover:bg-pink-100 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {data.length > 0 && (
        <>
          {/* Chart */}
          <BarChart data={data} highlightMean={showMean} highlightMedian={showMedian} />

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowMean(!showMean)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                showMean ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${showMean ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              Batezbestekoa (x̄)
            </button>
            <button
              onClick={() => setShowMedian(!showMedian)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                showMedian ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${showMedian ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              Mediana (Me)
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-blue-400 uppercase">Batezbestekoa</p>
              <p className="text-2xl font-mono font-bold text-blue-700">{mean(data).toFixed(2)}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-emerald-400 uppercase">Mediana</p>
              <p className="text-2xl font-mono font-bold text-emerald-700">{median(data).toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-purple-400 uppercase">Moda</p>
              <p className="text-2xl font-mono font-bold text-purple-700">{mode(data)}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-amber-400 uppercase">Bariantza</p>
              <p className="text-2xl font-mono font-bold text-amber-700">{variance(data).toFixed(2)}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-red-400 uppercase">Desb. Tipikoa</p>
              <p className="text-2xl font-mono font-bold text-red-700">{stdDev(data).toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Heina</p>
              <p className="text-2xl font-mono font-bold text-slate-700">{range(data).toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Dice Simulator ---

const DiceSimulator = () => {
  const [numDice, setNumDice] = useState(2);
  const [rolls, setRolls] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const canvasRef = useRef(null);

  const rollDice = () => {
    setIsRolling(true);
    const newRoll = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
    const sum = newRoll.reduce((a, b) => a + b, 0);
    setTimeout(() => {
      setRolls(prev => [...prev, sum]);
      setIsRolling(false);
    }, 200);
  };

  const rollMany = (n) => {
    const newRolls = [];
    for (let i = 0; i < n; i++) {
      const roll = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
      newRolls.push(roll.reduce((a, b) => a + b, 0));
    }
    setRolls(prev => [...prev, ...newRolls]);
  };

  // Draw frequency chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || rolls.length === 0) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 25, right: 15, bottom: 35, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const minVal = numDice;
    const maxVal = numDice * 6;
    const numBins = maxVal - minVal + 1;

    const freq = {};
    for (let i = minVal; i <= maxVal; i++) freq[i] = 0;
    rolls.forEach(v => { if (freq[v] !== undefined) freq[v]++; });
    const maxFreq = Math.max(...Object.values(freq), 1);

    const barWidth = Math.min(30, chartW / numBins * 0.8);
    const gap = (chartW - barWidth * numBins) / (numBins + 1);

    // Y grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const ySteps = Math.min(maxFreq, 5);
    for (let i = 0; i <= ySteps; i++) {
      const val = Math.round((i / ySteps) * maxFreq);
      const y = padding.top + chartH - (val / maxFreq) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val.toString(), padding.left - 6, y + 4);
    }

    // Bars
    for (let i = minVal; i <= maxVal; i++) {
      const idx = i - minVal;
      const x = padding.left + gap + idx * (barWidth + gap);
      const barH = (freq[i] / maxFreq) * chartH;
      const y = padding.top + chartH - barH;

      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, '#ec4899');
      gradient.addColorStop(1, '#fbcfe8');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0]);
      ctx.fill();

      // Frequency on top
      if (freq[i] > 0) {
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(freq[i], x + barWidth / 2, y - 4);
      }

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x + barWidth / 2, padding.top + chartH + 16);
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(w - padding.right, padding.top + chartH);
    ctx.stroke();

    // Expected distribution line (for 2 dice)
    if (numDice === 2 && rolls.length > 20) {
      ctx.strokeStyle = '#3b82f640';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = minVal; i <= maxVal; i++) {
        const idx = i - minVal;
        const x = padding.left + gap + idx * (barWidth + gap) + barWidth / 2;
        const combos = 6 - Math.abs(i - 7);
        const expected = (combos / 36) * rolls.length;
        const y = padding.top + chartH - (expected / maxFreq) * chartH;
        if (i === minVal) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [rolls, numDice]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dado kopurua</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => { setNumDice(n); setRolls([]); }}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  numDice === n ? 'bg-pink-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="px-5 py-2.5 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-500 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Dice5 size={18} /> Bota 1
          </button>
          <button
            onClick={() => rollMany(10)}
            className="px-5 py-2.5 bg-pink-100 text-pink-700 rounded-xl font-bold border border-pink-200 hover:bg-pink-200 transition-all"
          >
            ×10
          </button>
          <button
            onClick={() => rollMany(100)}
            className="px-5 py-2.5 bg-pink-100 text-pink-700 rounded-xl font-bold border border-pink-200 hover:bg-pink-200 transition-all"
          >
            ×100
          </button>
          <button
            onClick={() => setRolls([])}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold border border-slate-200 hover:bg-slate-200 transition-all"
          >
            Garbitu
          </button>
        </div>
      </div>

      <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 text-center text-sm font-bold text-pink-700">
        Guztira: {rolls.length} jaurtiketa
        {rolls.length > 0 && (
          <span className="text-slate-500 font-normal ml-2">
            | Batezbestekoa: {mean(rolls).toFixed(2)} | Mediana: {median(rolls).toFixed(1)}
          </span>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
        <canvas ref={canvasRef} width={700} height={280} className="w-full h-auto" />
      </div>

      {numDice === 2 && rolls.length > 20 && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
          <strong>Marra urdina:</strong> Espero zen banaketa teorikoa. Jaurtiketa gehiago eginda, barrak marretara hurbilduko dira (zenbaki handien legea).
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

export default function Estatistika() {
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('stat');

  useEffect(() => { generateProblem(); }, []);

  const generateProblem = () => {
    const types = ['mean', 'median', 'mode', 'range', 'probability'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'mean') {
      const len = Math.floor(Math.random() * 3) + 4;
      const data = Array.from({ length: len }, () => Math.floor(Math.random() * 10) + 1);
      const m = mean(data);
      prob = {
        type,
        display: `Datuak: ${data.join(', ')}\nBatezbestekoa = ?`,
        solution: Math.round(m * 100) / 100,
        hint: `Batu guztiak: ${data.join(' + ')} = ${data.reduce((a, b) => a + b, 0)}. Zatitu ${len}-z: ${data.reduce((a, b) => a + b, 0)} / ${len} = ${m.toFixed(2)}`
      };
    } else if (type === 'median') {
      const len = Math.floor(Math.random() * 2) * 2 + 5;
      const data = Array.from({ length: len }, () => Math.floor(Math.random() * 15) + 1);
      const med = median(data);
      const sorted = [...data].sort((a, b) => a - b);
      prob = {
        type,
        display: `Datuak: ${data.join(', ')}\nMediana = ?`,
        solution: med,
        hint: `Ordenatu: ${sorted.join(', ')}. Erdiko balioa: ${med}`
      };
    } else if (type === 'mode') {
      const base = Math.floor(Math.random() * 8) + 1;
      const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
      data.push(base, base);
      data.sort((a, b) => a - b);
      prob = {
        type,
        display: `Datuak: ${data.join(', ')}\nModa = ?`,
        solution: base,
        hint: `Gehien errepikatzen den balioa bilatu. ${base} balioak ${data.filter(v => v === base).length} aldiz agertzen da.`
      };
    } else if (type === 'range') {
      const data = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
      const r = Math.max(...data) - Math.min(...data);
      prob = {
        type,
        display: `Datuak: ${data.join(', ')}\nHeina = ?`,
        solution: r,
        hint: `Heina = Maximoa - Minimoa = ${Math.max(...data)} - ${Math.min(...data)} = ${r}`
      };
    } else {
      // Probability
      const subTypes = [
        () => {
          const total = Math.floor(Math.random() * 5) + 4;
          const red = Math.floor(Math.random() * (total - 1)) + 1;
          const p = Math.round((red / total) * 1000) / 1000;
          return {
            display: `Poltsa batean ${total} bola daude: ${red} gorri eta ${total - red} urdin.\nBola gorri bat ateratzeko probabilitatea? (0 eta 1 artean)`,
            solution: p,
            hint: `P = kasu onak / kasu guztiak = ${red} / ${total} = ${p}`
          };
        },
        () => {
          const face = Math.floor(Math.random() * 6) + 1;
          return {
            display: `Dado bat botatzen dugu.\n${face} ateratzeko probabilitatea? (dezimalekin)`,
            solution: Math.round((1/6) * 1000) / 1000,
            hint: `Dado batek 6 alde ditu, guztiak berdinak. P(${face}) = 1/6 = ${(1/6).toFixed(3)}`
          };
        },
        () => {
          return {
            display: `Dado bat botatzen dugu.\nZenbaki bikoitia ateratzeko probabilitatea? (dezimalekin)`,
            solution: 0.5,
            hint: `Bikoitiak: 2, 4, 6 → 3 aukera. P = 3/6 = 0.5`
          };
        },
      ];
      const sub = subTypes[Math.floor(Math.random() * subTypes.length)]();
      prob = { type: 'probability', ...sub };
    }

    setProblem(prob);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!problem) return;
    const val = parseFloat(userInput);
    if (isNaN(val)) { setFeedback('invalid'); return; }
    if (Math.abs(val - problem.solution) < 0.02) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-pink-600 transition-colors ${activeTab === 'concept' ? 'text-pink-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-pink-600 transition-colors ${activeTab === 'viz' ? 'text-pink-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('probability')} className={`hover:text-pink-600 transition-colors ${activeTab === 'probability' ? 'text-pink-600' : ''}`}>Probabilitatea</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-all shadow-sm shadow-pink-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Estatistika eta <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Probabilitatea</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Datuen analisia, grafikoak eta zorizko gertaerak. Mundua zenbakien bidez ulertzeko tresnak.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'probability', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-pink-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'probability' ? 'Probabilitatea' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world applications */}
            <Section title="Zertarako balio du?" icon={BookOpen} className="border-pink-200 ring-4 ring-pink-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                    <HeartPulse size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Medikuntza</h3>
                  <p className="text-sm text-slate-600">
                    Sendagaien eraginkortasuna neurtzeko entsegu klinikoak. Estatistikak erabakitzen du sendagai bat onartzen den.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Vote size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Inkestak eta Hauteskundeak</h3>
                  <p className="text-sm text-slate-600">
                    1000 pertsonari galdetuz, milioi baten iritzia aurresan dezakegu. Laginketa eta errorea ulertzea funtsezkoa da.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Thermometer size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Eguraldia</h3>
                  <p className="text-sm text-slate-600">
                    "Bihar euria egiteko %70 probabilitatea dago". Meteorologoak eredu probabilistikoak erabiltzen dituzte.
                  </p>
                </div>
              </div>
            </Section>

            {/* Measures of central tendency */}
            <Section title="Joera Zentraleko Neurriak" icon={Target}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Datu-multzo bat zenbaki <strong>bakar batez</strong> laburtzeko moduak. "Non dago datuaren erdigunea?"
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-5">
                    <p className="text-xs text-blue-400 uppercase font-bold tracking-widest mb-2">Batezbestekoa (x̄)</p>
                    <div className="bg-white p-3 rounded-lg border border-blue-200 mb-3">
                      <p className="font-mono text-lg font-bold text-blue-700 text-center">x̄ = Σxᵢ / n</p>
                    </div>
                    <p className="text-sm text-slate-600">Datu guztien batura, datu kopuruaz zatituta.</p>
                    <div className="mt-3 bg-blue-100/50 p-2 rounded-lg font-mono text-xs text-blue-800">
                      {'{2, 4, 6}'} → (2+4+6)/3 = <strong>4</strong>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl p-5">
                    <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest mb-2">Mediana (Me)</p>
                    <div className="bg-white p-3 rounded-lg border border-emerald-200 mb-3">
                      <p className="font-mono text-lg font-bold text-emerald-700 text-center">Erdiko balioa</p>
                    </div>
                    <p className="text-sm text-slate-600">Datuak ordenatu eta erdikoa hartu.</p>
                    <div className="mt-3 bg-emerald-100/50 p-2 rounded-lg font-mono text-xs text-emerald-800">
                      {'{1, 3, 7, 8, 9}'} → Me = <strong>7</strong>
                    </div>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-5">
                    <p className="text-xs text-purple-400 uppercase font-bold tracking-widest mb-2">Moda (Mo)</p>
                    <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3">
                      <p className="font-mono text-lg font-bold text-purple-700 text-center">Gehien errepikatzen dena</p>
                    </div>
                    <p className="text-sm text-slate-600">Maizago agertzen den balioa.</p>
                    <div className="mt-3 bg-purple-100/50 p-2 rounded-lg font-mono text-xs text-purple-800">
                      {'{2, 3, 3, 5, 7}'} → Mo = <strong>3</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>Noiz erabili bakoitza?</strong></p>
                    <p className="mt-1"><strong>Batezbestekoa:</strong> Datu simetrikoentzat. Balio muturreko batek asko aldatzen du!</p>
                    <p><strong>Mediana:</strong> Balio muturrekoak daudenean (adib. soldatak). Ez du muturrekoek eragiten.</p>
                    <p><strong>Moda:</strong> Datu kualitatiboentzat (adib. kolore gustukoena).</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Measures of dispersion */}
            <Section title="Sakabanaketa Neurriak" icon={TrendingUp}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  "Zenbat sakabanatuta daude datuak erdigunetik?" Bi datu-multzo batezbesteko berdina izan dezakete baina sakabanaketa oso ezberdina.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                    <p className="text-xs text-amber-400 uppercase font-bold tracking-widest mb-2">Heina</p>
                    <p className="font-mono text-lg font-bold text-amber-700 mb-2">H = Max - Min</p>
                    <p className="text-sm text-slate-600">Daturik handiena ken daturik txikiena. Sinpleena baina muturrekoei sentikorra.</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                    <p className="text-xs text-red-400 uppercase font-bold tracking-widest mb-2">Desbideratze Tipikoa (σ)</p>
                    <p className="font-mono text-lg font-bold text-red-700 mb-2">σ = √(Σ(xᵢ - x̄)² / n)</p>
                    <p className="text-sm text-slate-600">Batezbestetik zenbat aldentzen diren datuak batez beste. Garrantzitsuena!</p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Adibidea</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-300 mb-2">A taldea: <span className="font-mono text-pink-400">5, 5, 5, 5, 5</span></p>
                      <p className="text-sm">x̄ = 5, σ = <span className="text-emerald-400 font-bold">0</span></p>
                      <p className="text-xs text-slate-500 mt-1">Desbideratzea = 0, guztiak berdinak!</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 mb-2">B taldea: <span className="font-mono text-pink-400">1, 3, 5, 7, 9</span></p>
                      <p className="text-sm">x̄ = 5, σ = <span className="text-red-400 font-bold">2.83</span></p>
                      <p className="text-xs text-slate-500 mt-1">Batezbesteko berdina, baina askoz sakabanatuta!</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Datu Bisualizatzailea" icon={BarChart3}>
              <DatasetVisualizer />
            </Section>

          </div>
        )}

        {/* --- SECTION 3: PROBABILITY --- */}
        {activeTab === 'probability' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Probabilitate Oinarrizkoak" icon={Dice5}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"></div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Laplace-ren Erregela</p>
                    <p className="text-3xl md:text-4xl font-mono font-bold">
                      P(A) = <span className="text-pink-400">kasu onak</span> / <span className="text-slate-300">kasu guztiak</span>
                    </p>
                    <p className="text-slate-400 mt-4 text-sm">
                      Gertaera bat gertatzeko probabilitatea, kasu guztiak berdin posibleak direnean.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Ziurra</p>
                    <p className="text-3xl font-mono font-bold text-emerald-600 text-center">P = 1</p>
                    <p className="text-xs text-slate-500 mt-2 text-center">Beti gertatzen da</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Ezinezkoa</p>
                    <p className="text-3xl font-mono font-bold text-red-600 text-center">P = 0</p>
                    <p className="text-xs text-slate-500 mt-2 text-center">Inoiz ez da gertatzen</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Tartean</p>
                    <p className="text-3xl font-mono font-bold text-pink-600 text-center">0 &lt; P &lt; 1</p>
                    <p className="text-xs text-slate-500 mt-2 text-center">Gerta daiteke, baina ez beti</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-pink-50 border border-pink-100 rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 mb-3">Osagarria</h3>
                    <p className="font-mono text-lg font-bold text-pink-700 mb-2">P(Ā) = 1 - P(A)</p>
                    <p className="text-sm text-slate-600">Gertaera bat EZ gertatzeko probabilitatea.</p>
                    <div className="mt-2 bg-white p-2 rounded-lg border border-slate-200 font-mono text-xs">
                      6 ez ateratzea dado batean: 1 - 1/6 = <strong>5/6</strong>
                    </div>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 mb-3">Batuketa (independenteak)</h3>
                    <p className="font-mono text-lg font-bold text-rose-700 mb-2">P(A ∪ B) = P(A) + P(B)</p>
                    <p className="text-sm text-slate-600">A <strong>edo</strong> B gertatzeko probabilitatea (elkarrekiko baztertzaileak badira).</p>
                    <div className="mt-2 bg-white p-2 rounded-lg border border-slate-200 font-mono text-xs">
                      1 edo 6 ateratzea: 1/6 + 1/6 = <strong>2/6</strong>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Dado Simulagailua" icon={Dice5}>
              <DiceSimulator />
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-pink-200 ring-4 ring-pink-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-pink-50 border border-pink-100 px-6 py-2 rounded-full text-sm font-bold text-pink-700">
                    Puntuazioa: {score}
                  </div>
                </div>

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-pink-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'mean' ? 'Batezbestekoa' :
                         problem.type === 'median' ? 'Mediana' :
                         problem.type === 'mode' ? 'Moda' :
                         problem.type === 'range' ? 'Heina' :
                         'Probabilitatea'}
                      </div>
                      <div className="text-lg md:text-xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-lg font-bold"
                        />
                      </div>
                    </div>

                    {feedback && (
                      <div className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300 ${
                        feedback === 'correct' ? 'bg-green-100 text-green-700' :
                        feedback === 'invalid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {feedback === 'correct' ? <Check /> : feedback === 'invalid' ? <RefreshCw /> : <X />}
                          <span>
                            {feedback === 'correct' ? 'Bikain! Hori da.' :
                             feedback === 'invalid' ? 'Mesedez, sartu zenbaki bat.' :
                             'Saiatu berriro...'}
                          </span>
                        </div>
                        {feedback === 'incorrect' && (
                          <button onClick={() => setShowHint(true)} className="text-sm underline hover:text-red-900 mt-1">
                            Pista bat?
                          </button>
                        )}
                      </div>
                    )}

                    {showHint && feedback === 'incorrect' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 animate-in fade-in">
                        <strong>Pista:</strong> {problem.hint}
                      </div>
                    )}

                    <div className="flex gap-4 justify-center mt-6">
                      <button
                        onClick={checkAnswer}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all active:translate-y-0"
                      >
                        Egiaztatu
                      </button>
                      {feedback === 'correct' && (
                        <button
                          onClick={generateProblem}
                          className="px-8 py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-500 transition-all flex items-center gap-2 animate-in fade-in"
                        >
                          <ArrowRight size={18} /> Hurrengoa
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-pink-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
