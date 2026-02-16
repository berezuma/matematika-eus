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
  Mountain,
  Navigation,
  Waves,
  Eye
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import RelatedTopics from '../components/RelatedTopics';

// --- Utility Components ---

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`mb-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

// --- Unit Circle Interactive ---

const UnitCircle = () => {
  const canvasRef = useRef(null);
  const [angleDeg, setAngleDeg] = useState(45);
  const angleRad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  const tanVal = Math.cos(angleRad) !== 0 ? Math.tan(angleRad) : Infinity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 40;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i <= h; i += 30) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('1', cx + r, cy + 16);
    ctx.fillText('-1', cx - r, cy + 16);
    ctx.textAlign = 'right';
    ctx.fillText('1', cx - 8, cy - r + 4);
    ctx.fillText('-1', cx - 8, cy + r + 4);

    // Unit circle
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Angle arc
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const startAngle = 0;
    const endAngle = -angleRad;
    if (angleDeg >= 0) {
      ctx.arc(cx, cy, 30, startAngle, endAngle, true);
    } else {
      ctx.arc(cx, cy, 30, startAngle, endAngle, false);
    }
    ctx.stroke();

    // Angle label
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    const labelAngle = -angleRad / 2;
    ctx.textAlign = 'center';
    ctx.fillText(`${angleDeg}°`, cx + 45 * Math.cos(labelAngle), cy + 45 * Math.sin(labelAngle) + 4);

    // Radius line
    const px = cx + r * Math.cos(-angleRad);
    const py = cy + r * Math.sin(-angleRad);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Cosine line (horizontal projection)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.stroke();
    // cos label
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('cos', (cx + px) / 2, cy + 18);

    // Sine line (vertical projection)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    // sin label
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('sin', px + 8, (cy + py) / 2 + 4);

    // Tangent line (if visible)
    if (Math.abs(cosVal) > 0.01) {
      const tanEndY = cy - r * tanVal;
      if (tanEndY > -100 && tanEndY < h + 100) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx + r, cy);
        ctx.lineTo(cx + r, tanEndY);
        ctx.stroke();
        ctx.setLineDash([]);
        // tan label
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('tan', cx + r + 6, (cy + tanEndY) / 2 + 4);

        // Dashed line from point to tangent
        ctx.strokeStyle = '#10b98140';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r, tanEndY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Point on circle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Point coordinates
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = px > cx ? 'left' : 'right';
    const offsetX = px > cx ? 12 : -12;
    const offsetY = py < cy ? -12 : 16;
    ctx.fillText(`(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`, px + offsetX, py + offsetY);

    // Special angle markers on circle
    const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
    specialAngles.forEach(deg => {
      const rad = (deg * Math.PI) / 180;
      const sx = cx + r * Math.cos(-rad);
      const sy = cy + r * Math.sin(-rad);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [angleDeg, sinVal, cosVal, tanVal, angleRad]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
        <canvas ref={canvasRef} width={500} height={500} className="w-full h-auto" />
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-amber-600 uppercase">Angelua</label>
            <span className="text-sm font-mono bg-amber-100 text-amber-700 px-2 rounded font-bold">{angleDeg}°</span>
          </div>
          <input
            type="range" min="-360" max="360" step="1"
            value={angleDeg}
            onChange={(e) => setAngleDeg(parseInt(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-360°</span><span>0°</span><span>360°</span>
          </div>
        </div>

        {/* Quick angle buttons */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Angelu aipagarriak</p>
          <div className="flex flex-wrap gap-1.5">
            {[0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360].map(a => (
              <button
                key={a}
                onClick={() => setAngleDeg(a)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  angleDeg === a
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'
                }`}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>

        {/* Values display */}
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-blue-600 uppercase">cos({angleDeg}°)</span>
            <span className="font-mono font-bold text-blue-800">{cosVal.toFixed(4)}</span>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-red-600 uppercase">sin({angleDeg}°)</span>
            <span className="font-mono font-bold text-red-800">{sinVal.toFixed(4)}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-600 uppercase">tan({angleDeg}°)</span>
            <span className="font-mono font-bold text-emerald-800">
              {Math.abs(cosVal) < 0.001 ? '±∞' : tanVal.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
          <strong>Radianetan:</strong>{' '}
          <span className="font-mono">{(angleRad).toFixed(4)} rad</span>
          {angleDeg % 180 === 0 && angleDeg !== 0 && <span> = {angleDeg / 180}π</span>}
          {angleDeg % 90 === 0 && angleDeg % 180 !== 0 && <span> = {angleDeg / 90}π/2</span>}
        </div>
      </div>
    </div>
  );
};

// --- Wave Graph ---

const WaveGraph = () => {
  const canvasRef = useRef(null);
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [showSin, setShowSin] = useState(true);
  const [showCos, setShowCos] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = 40;
    const cy = h / 2;
    const scaleX = (w - 60) / (4 * Math.PI);
    const scaleY = (h - 60) / 3;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = cx; x <= w; x += scaleX * Math.PI / 2) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += scaleY * 0.5) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    // X-axis labels (in π)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const piLabels = ['π/2', 'π', '3π/2', '2π', '5π/2', '3π', '7π/2', '4π'];
    for (let i = 1; i <= 8; i++) {
      const x = cx + i * scaleX * Math.PI / 2;
      if (x < w - 10) {
        ctx.fillText(piLabels[i - 1], x, cy + 16);
      }
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let v = -2; v <= 2; v++) {
      if (v === 0) continue;
      const y = cy - v * scaleY;
      if (y > 10 && y < h - 10) {
        ctx.fillText(v.toString(), cx - 6, y + 4);
      }
    }

    // Draw sine
    if (showSin) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = cx; px < w; px++) {
        const x = (px - cx) / scaleX;
        const y = amplitude * Math.sin(frequency * x);
        const py = cy - y * scaleY;
        if (px === cx) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Draw cosine
    if (showCos) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = cx; px < w; px++) {
        const x = (px - cx) / scaleX;
        const y = amplitude * Math.cos(frequency * x);
        const py = cy - y * scaleY;
        if (px === cx) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

  }, [amplitude, frequency, showSin, showCos]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 p-2">
        <canvas ref={canvasRef} width={700} height={350} className="w-full h-auto" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-amber-600 uppercase">Anplitudea (A)</label>
              <span className="text-xs font-mono bg-amber-100 text-amber-700 px-2 rounded font-bold">{amplitude}</span>
            </div>
            <input
              type="range" min="0.5" max="2" step="0.1"
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-orange-600 uppercase">Maiztasuna (ω)</label>
              <span className="text-xs font-mono bg-orange-100 text-orange-700 px-2 rounded font-bold">{frequency}</span>
            </div>
            <input
              type="range" min="0.5" max="3" step="0.5"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSin(!showSin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                showSin ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${showSin ? 'bg-red-500' : 'bg-slate-300'}`}></div>
              sin(x)
            </button>
            <button
              onClick={() => setShowCos(!showCos)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                showCos ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${showCos ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              cos(x)
            </button>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-xl text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Funtzioak</p>
            {showSin && <p className="font-mono text-red-400">y = {amplitude !== 1 ? amplitude : ''}sin({frequency !== 1 ? frequency : ''}x)</p>}
            {showCos && <p className="font-mono text-blue-400">y = {amplitude !== 1 ? amplitude : ''}cos({frequency !== 1 ? frequency : ''}x)</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Trigonometria() {
  useDocumentTitle('Trigonometria');
  const [activeTab, setActiveTab] = useState('concept');
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const { score, total, addCorrect, addIncorrect, reset } = useProgress('trig');

  useEffect(() => { generateProblem(); }, []);

  // Notable values for practice
  const notableValues = {
    'sin(0°)': 0, 'sin(30°)': 0.5, 'sin(45°)': 0.707, 'sin(60°)': 0.866, 'sin(90°)': 1,
    'sin(180°)': 0, 'sin(270°)': -1, 'sin(360°)': 0,
    'cos(0°)': 1, 'cos(30°)': 0.866, 'cos(45°)': 0.707, 'cos(60°)': 0.5, 'cos(90°)': 0,
    'cos(180°)': -1, 'cos(270°)': 0, 'cos(360°)': 1,
    'tan(0°)': 0, 'tan(30°)': 0.577, 'tan(45°)': 1, 'tan(60°)': 1.732,
    'tan(180°)': 0,
  };

  const generateProblem = () => {
    const types = ['notable', 'quadrant', 'identity', 'convert'];
    const type = types[Math.floor(Math.random() * types.length)];
    let prob;

    if (type === 'notable') {
      const keys = Object.keys(notableValues);
      const key = keys[Math.floor(Math.random() * keys.length)];
      const exactValues = {
        'sin(0°)': '0', 'sin(30°)': '1/2', 'sin(45°)': '√2/2', 'sin(60°)': '√3/2', 'sin(90°)': '1',
        'sin(180°)': '0', 'sin(270°)': '-1', 'sin(360°)': '0',
        'cos(0°)': '1', 'cos(30°)': '√3/2', 'cos(45°)': '√2/2', 'cos(60°)': '1/2', 'cos(90°)': '0',
        'cos(180°)': '-1', 'cos(270°)': '0', 'cos(360°)': '1',
        'tan(0°)': '0', 'tan(30°)': '√3/3', 'tan(45°)': '1', 'tan(60°)': '√3',
        'tan(180°)': '0',
      };
      prob = {
        type,
        display: `${key} = ?\n(dezimalekin, 3 hamartarrekin)`,
        solution: notableValues[key],
        hint: `Balio zehatza: ${key} = ${exactValues[key]}. Hamartarrez: ${notableValues[key]}`
      };
    } else if (type === 'quadrant') {
      const angles = [
        { deg: 150, q: 2 }, { deg: 210, q: 3 }, { deg: 315, q: 4 },
        { deg: 120, q: 2 }, { deg: 240, q: 3 }, { deg: 330, q: 4 },
        { deg: 45, q: 1 }, { deg: 135, q: 2 }, { deg: 225, q: 3 },
      ];
      const a = angles[Math.floor(Math.random() * angles.length)];
      prob = {
        type,
        display: `${a.deg}°-ko angelua zein koadrantetan dago?\n(1, 2, 3 edo 4)`,
        solution: a.q,
        hint: `1. koadrantea: 0°-90°, 2.: 90°-180°, 3.: 180°-270°, 4.: 270°-360°. ${a.deg}° → ${a.q}. koadrantea`
      };
    } else if (type === 'identity') {
      const angle = [30, 45, 60][Math.floor(Math.random() * 3)];
      const rad = (angle * Math.PI) / 180;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const result = Math.round((s * s + c * c) * 1000) / 1000;
      prob = {
        type,
        display: `sin²(${angle}°) + cos²(${angle}°) = ?`,
        solution: 1,
        hint: `Oinarrizko identitate trigonometrikoa: sin²(α) + cos²(α) = 1 beti, edozein angelurentzat!`
      };
    } else {
      // Convert degrees to radians (as multiples of pi, give numeric)
      const degs = [90, 180, 270, 360, 60, 120, 45];
      const deg = degs[Math.floor(Math.random() * degs.length)];
      const radNumeric = Math.round(((deg * Math.PI) / 180) * 1000) / 1000;
      prob = {
        type,
        display: `${deg}° bihurtu radianetara\n(dezimalekin, 3 hamartarrekin)`,
        solution: radNumeric,
        hint: `Formula: radianak = graduak × π / 180. Beraz: ${deg} × π / 180 = ${radNumeric}`
      };
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
    // Allow small tolerance for decimal answers
    if (Math.abs(val - problem.solution) < 0.01) {
      setFeedback('correct');
      addCorrect();
    } else {
      setFeedback('incorrect');
      addIncorrect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-800">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight">Mate<span className="text-indigo-600">.eus</span></span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('concept')} className={`hover:text-amber-600 transition-colors ${activeTab === 'concept' ? 'text-amber-600' : ''}`}>Teoria</button>
            <button onClick={() => setActiveTab('viz')} className={`hover:text-amber-600 transition-colors ${activeTab === 'viz' ? 'text-amber-600' : ''}`}>Laborategia</button>
            <button onClick={() => setActiveTab('table')} className={`hover:text-amber-600 transition-colors ${activeTab === 'table' ? 'text-amber-600' : ''}`}>Balio Taula</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all shadow-sm shadow-amber-200`}>Praktika</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Trigonometria</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Angeluak, sinua, kosinua eta tangentea. Zirkulu unitarioa eta uhinen mundua.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2">
          {['concept', 'viz', 'table', 'practice'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {t === 'concept' ? 'Teoria' : t === 'viz' ? 'Laborategia' : t === 'table' ? 'Balio Taula' : 'Praktika'}
            </button>
          ))}
        </div>

        {/* --- SECTION 1: CONCEPTS --- */}
        {activeTab === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Real-world applications */}
            <Section title="Zertarako balio du?" icon={BookOpen} className="border-amber-200 ring-4 ring-amber-50/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Mountain size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Topografia</h3>
                  <p className="text-sm text-slate-600">
                    Mendi baten altuera kalkulatu urrunetik, angelua eta distantzia neurtuz. Ingeniariek egunero erabiltzen dute.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <Navigation size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Nabigazioa</h3>
                  <p className="text-sm text-slate-600">
                    GPS-ak eta itsasontziek trigonometria erabiltzen dute kokapenaren eta norabidearen kalkulurako.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                    <Waves size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Soinua eta Argia</h3>
                  <p className="text-sm text-slate-600">
                    Soinu-uhinak sinu-funtzioak dira. Musika, irratia eta argia funtzio trigonometrikoekin deskribatzen dira.
                  </p>
                </div>
              </div>
            </Section>

            {/* Angle basics */}
            <Section title="Angeluak eta Neurriak" icon={Eye}>
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
                  <div className="grid md:grid-cols-2 gap-8 text-center">
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3">Graduak</p>
                      <p className="text-4xl font-mono font-bold text-amber-400">360°</p>
                      <p className="text-sm text-slate-400 mt-2">Zirkulu osoa = 360 gradu</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3">Radianak</p>
                      <p className="text-4xl font-mono font-bold text-orange-400">2π rad</p>
                      <p className="text-sm text-slate-400 mt-2">Zirkulu osoa = 2π radian</p>
                    </div>
                  </div>
                  <div className="text-center mt-6 pt-4 border-t border-slate-700">
                    <p className="font-mono text-lg text-slate-300">
                      <span className="text-amber-400">graduak</span> × π / 180 = <span className="text-orange-400">radianak</span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-3">
                  {[
                    { deg: '90°', rad: 'π/2', name: 'Angelu zuzena' },
                    { deg: '180°', rad: 'π', name: 'Angelu laua' },
                    { deg: '270°', rad: '3π/2', name: '3/4 bira' },
                    { deg: '360°', rad: '2π', name: 'Bira osoa' },
                  ].map((a, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                      <p className="text-2xl font-mono font-bold text-amber-700">{a.deg}</p>
                      <p className="text-sm font-mono text-orange-600">{a.rad}</p>
                      <p className="text-xs text-slate-500 mt-1">{a.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Sin, Cos, Tan definitions */}
            <Section title="sin, cos, tan — Definizioak" icon={Layers}>
              <div className="space-y-6">
                <p className="text-slate-600">
                  Triangelu angeluzuzen batean, angeluarekiko (<strong>α</strong>) hiru aldeen arteko erlazioak:
                </p>

                <div className="flex justify-center py-4">
                  <svg width="300" height="220" viewBox="0 0 300 220">
                    {/* Triangle */}
                    <polygon points="30,190 270,190 270,40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />
                    {/* Right angle marker */}
                    <rect x="250" y="170" width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Labels */}
                    <text x="150" y="210" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">Alboko kateto (a)</text>
                    <text x="290" y="120" textAnchor="start" fontSize="14" fontWeight="bold" fill="#0f172a" transform="rotate(90 290 120)">Kontrako kateto (b)</text>
                    <text x="130" y="105" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#f59e0b" transform="rotate(-29 130 105)">Hipotenusa (c)</text>
                    {/* Angle arc */}
                    <path d="M 60,190 A 30,30 0 0,0 55,170" fill="none" stroke="#ef4444" strokeWidth="2" />
                    <text x="70" y="175" fontSize="16" fontWeight="bold" fill="#ef4444">α</text>
                  </svg>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border-2 border-red-100 rounded-xl p-5 text-center">
                    <p className="text-xs text-red-400 uppercase font-bold tracking-widest mb-2">Sinua</p>
                    <p className="text-2xl font-mono font-bold text-red-700">sin(α) = b/c</p>
                    <p className="text-xs text-slate-500 mt-2">Kontrako katetoa / Hipotenusa</p>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-5 text-center">
                    <p className="text-xs text-blue-400 uppercase font-bold tracking-widest mb-2">Kosinua</p>
                    <p className="text-2xl font-mono font-bold text-blue-700">cos(α) = a/c</p>
                    <p className="text-xs text-slate-500 mt-2">Alboko katetoa / Hipotenusa</p>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl p-5 text-center">
                    <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest mb-2">Tangentea</p>
                    <p className="text-2xl font-mono font-bold text-emerald-700">tan(α) = b/a</p>
                    <p className="text-xs text-slate-500 mt-2">Kontrako katetoa / Alboko katetoa</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="shrink-0" size={20} />
                  <div>
                    <p><strong>SOH-CAH-TOA</strong> gogoratzeko trikimailua:</p>
                    <p className="font-mono mt-1">
                      <strong className="text-red-600">S</strong>in = <strong className="text-red-600">O</strong>pposite / <strong className="text-red-600">H</strong>ypotenuse &nbsp;|&nbsp;
                      <strong className="text-blue-600">C</strong>os = <strong className="text-blue-600">A</strong>djacent / <strong className="text-blue-600">H</strong>ypotenuse &nbsp;|&nbsp;
                      <strong className="text-emerald-600">T</strong>an = <strong className="text-emerald-600">O</strong>pposite / <strong className="text-emerald-600">A</strong>djacent
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Fundamental identities */}
            <Section title="Oinarrizko Identitateak" icon={ListOrdered}>
              <div className="space-y-4">
                {[
                  {
                    name: 'Identitate pitagorikoa',
                    formula: 'sin²(α) + cos²(α) = 1',
                    explanation: 'Beti betetzen da, edozein angelurentzat',
                    color: 'amber'
                  },
                  {
                    name: 'Tangente definizioa',
                    formula: 'tan(α) = sin(α) / cos(α)',
                    explanation: 'Tangentea sinuaren eta kosinuaren zatiketa da',
                    color: 'orange'
                  },
                  {
                    name: '1 + tan²',
                    formula: '1 + tan²(α) = 1 / cos²(α)',
                    explanation: 'Identitate pitagorikotik eratortzen da',
                    color: 'red'
                  },
                  {
                    name: 'Angelu bikoitza (sinua)',
                    formula: 'sin(2α) = 2·sin(α)·cos(α)',
                    explanation: 'Angelu bikoitzaren sinua',
                    color: 'rose'
                  },
                  {
                    name: 'Angelu bikoitza (kosinua)',
                    formula: 'cos(2α) = cos²(α) - sin²(α)',
                    explanation: 'Angelu bikoitzaren kosinua',
                    color: 'pink'
                  },
                ].map((id, i) => (
                  <div key={i} className={`p-5 rounded-xl bg-${id.color}-50 border border-${id.color}-100 hover:border-${id.color}-300 transition-colors`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{id.name}</h3>
                        <p className="font-mono text-xl font-bold text-slate-700">{id.formula}</p>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm text-${id.color}-600 font-medium`}>{id.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 2: LAB --- */}
        {activeTab === 'viz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Zirkulu Unitarioa" icon={Eye}>
              <UnitCircle />
            </Section>

            <Section title="Sinu eta Kosinu Uhinak" icon={Waves}>
              <WaveGraph />
            </Section>

          </div>
        )}

        {/* --- SECTION 3: VALUES TABLE --- */}
        {activeTab === 'table' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            <Section title="Angelu Aipagarrien Balioak" icon={ListOrdered}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-3 text-left font-bold text-slate-600 border-b border-slate-200">Angelua</th>
                      <th className="p-3 text-center font-bold text-slate-600 border-b border-slate-200">Rad</th>
                      <th className="p-3 text-center font-bold text-red-600 border-b border-slate-200">sin</th>
                      <th className="p-3 text-center font-bold text-blue-600 border-b border-slate-200">cos</th>
                      <th className="p-3 text-center font-bold text-emerald-600 border-b border-slate-200">tan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { deg: '0°', rad: '0', sin: '0', cos: '1', tan: '0' },
                      { deg: '30°', rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3' },
                      { deg: '45°', rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1' },
                      { deg: '60°', rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3' },
                      { deg: '90°', rad: 'π/2', sin: '1', cos: '0', tan: '∄' },
                      { deg: '120°', rad: '2π/3', sin: '√3/2', cos: '-1/2', tan: '-√3' },
                      { deg: '135°', rad: '3π/4', sin: '√2/2', cos: '-√2/2', tan: '-1' },
                      { deg: '150°', rad: '5π/6', sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
                      { deg: '180°', rad: 'π', sin: '0', cos: '-1', tan: '0' },
                      { deg: '270°', rad: '3π/2', sin: '-1', cos: '0', tan: '∄' },
                      { deg: '360°', rad: '2π', sin: '0', cos: '1', tan: '0' },
                    ].map((row, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-amber-50 transition-colors`}>
                        <td className="p-3 font-bold text-amber-700 font-mono border-b border-slate-100">{row.deg}</td>
                        <td className="p-3 text-center font-mono text-slate-600 border-b border-slate-100">{row.rad}</td>
                        <td className="p-3 text-center font-mono text-red-700 font-bold border-b border-slate-100">{row.sin}</td>
                        <td className="p-3 text-center font-mono text-blue-700 font-bold border-b border-slate-100">{row.cos}</td>
                        <td className="p-3 text-center font-mono text-emerald-700 font-bold border-b border-slate-100">{row.tan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                <strong>Trikimailua gogoratzeko:</strong> Sinuaren balioak 0°-tik 90°-ra: √0/2, √1/2, √2/2, √3/2, √4/2 = 0, 1/2, √2/2, √3/2, 1. Kosinuarena alderantziz!
              </div>
            </Section>

            <Section title="Koadranteko Zeinuak" icon={Layers}>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">II. Koadrantea</p>
                  <p className="text-xs text-slate-500">90° - 180°</p>
                  <div className="mt-2 space-y-1 font-mono text-sm">
                    <p><span className="text-red-600">sin +</span></p>
                    <p><span className="text-blue-600">cos −</span></p>
                    <p><span className="text-emerald-600">tan −</span></p>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">I. Koadrantea</p>
                  <p className="text-xs text-slate-500">0° - 90°</p>
                  <div className="mt-2 space-y-1 font-mono text-sm">
                    <p><span className="text-red-600">sin +</span></p>
                    <p><span className="text-blue-600">cos +</span></p>
                    <p><span className="text-emerald-600">tan +</span></p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">III. Koadrantea</p>
                  <p className="text-xs text-slate-500">180° - 270°</p>
                  <div className="mt-2 space-y-1 font-mono text-sm">
                    <p><span className="text-red-600">sin −</span></p>
                    <p><span className="text-blue-600">cos −</span></p>
                    <p><span className="text-emerald-600">tan +</span></p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">IV. Koadrantea</p>
                  <p className="text-xs text-slate-500">270° - 360°</p>
                  <div className="mt-2 space-y-1 font-mono text-sm">
                    <p><span className="text-red-600">sin −</span></p>
                    <p><span className="text-blue-600">cos +</span></p>
                    <p><span className="text-emerald-600">tan −</span></p>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        )}

        {/* --- SECTION 4: PRACTICE --- */}
        {activeTab === 'practice' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section title="Entrenamendua" icon={Brain} className="border-amber-200 ring-4 ring-amber-50/50">
              <div className="max-w-xl mx-auto">

                <div className="flex justify-center mb-6">
                  <div className="bg-amber-50 border border-amber-100 px-6 py-2 rounded-full text-sm font-bold text-amber-700 flex items-center gap-3">
                    <span>Puntuazioa: {score}/{total}</span>
                    {total > 0 && <span className="text-xs opacity-60">({Math.round((score / total) * 100)}%)</span>}
                  </div>
                </div>
                {total > 0 && (
                  <button onClick={() => reset()} className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors">
                    Puntuazioa berrezarri
                  </button>
                )}

                {problem && (
                  <div className="space-y-8 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        {problem.type === 'notable' ? 'Balio aipagarria' :
                         problem.type === 'quadrant' ? 'Koadrantea identifikatu' :
                         problem.type === 'identity' ? 'Identitatea aplikatu' :
                         'Gradu → Radian'}
                      </div>
                      <div className="text-xl md:text-2xl font-mono text-slate-800 font-bold whitespace-pre-line mt-4">
                        {problem.display}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 text-lg">= </span>
                        <input
                          type="number"
                          step="0.001"
                          placeholder="?"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-32 text-center p-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-lg font-bold"
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
                          className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-500 transition-all flex items-center gap-2 animate-in fade-in"
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

      <RelatedTopics currentId="trig" />
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Mate.eus &copy; 2026. Egilea: <a href="https://berezuma.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">Beñat Erezuma</a></p>
      </footer>

    </div>
  );
}
