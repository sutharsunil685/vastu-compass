import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Compass, Info, AlertTriangle, CheckCircle, AlertCircle, RotateCw, 
  Map as MapIcon, ShieldCheck, Plus, Trash2, Move,
  ArrowRight, Download, Eye, EyeOff, LayoutGrid,
  Droplets, Flame, Mountain, Wind, Sun, Home, 
  Settings, Ruler, DoorClosed, Layers, Maximize,
  ArrowUpRight, Scale, Square as SquareIcon, RectangleHorizontal,
  User as PurushaIcon, Power, Car, Waves, Sprout, Shield, 
  Wrench, Utensils, BookOpen, Briefcase, Box, Bath,
  Wind as LaundryIcon, Warehouse, Trees, Zap, HardDrive, 
  RadioTower, Vault, Waves as PoolIcon, Flower2, ChevronUp, ChevronDown,
  Lock, ZapOff, Anchor, Target, FileDown, FileUp, ClipboardList, X,
  Maximize2, Printer
} from 'lucide-react';

/**
 * HELPER: Format decimal feet to architectural X' Y"
 */
const formatFtIn = (totalFeet) => {
  const ft = Math.floor(totalFeet);
  const inch = Math.round((totalFeet - ft) * 12);
  const inchStr = inch > 0 ? ` ${inch}"` : '';
  return `${ft}'${inchStr}`;
};

/**
 * AUTHENTIC VASTU RULE DATABASE - COMPREHENSIVE (30+ Elements)
 */
const VASTU_RULES = {
  main_entrance: { ideal: ['North', 'East', 'North-East'], forbidden: ['South-West', 'South'], priority: 'P1', remedy: 'Install yellow marble threshold and Copper Swastika helix.', science: 'Captures vital morning UV rays and positive geomagnetic flow.' },
  kitchen: { ideal: ['South-East'], forbidden: ['North-East', 'South-West'], priority: 'P1', remedy: 'Keep a copper helix in SE corner; face East while cooking.', science: 'Combines solar heat with SE wind patterns for moisture control.' },
  master_bedroom: { ideal: ['South-West'], forbidden: ['North-East', 'Center'], priority: 'P1', remedy: 'Use heavy wooden bed and shades of yellow/earth.', science: 'South-West is the most stable thermal zone for long-term rest.' },
  children_bedroom: { ideal: ['West', 'North-West'], forbidden: ['South-West'], priority: 'P2', remedy: 'Study desk must face East; use blue/green tones.', science: 'Promotes intellectual growth through transient air energy.' },
  simple_bedroom: { ideal: ['West', 'North-West'], forbidden: ['South-West'], priority: 'P2', remedy: 'Headboard to South; keep South wall heavy.', science: 'Ensures magnetic alignment of the body during sleep.' },
  guest_room: { ideal: ['North-West'], forbidden: ['South-West'], priority: 'P3', remedy: 'Keep the room airy and use light linen.', science: 'NW (Vayavya) represents transient air; ideal for guests.' },
  living_room: { ideal: ['North', 'East', 'North-West'], forbidden: ['South-West'], priority: 'P3', remedy: 'Keep heavy furniture in South and West side.', science: 'Common areas benefit from natural morning illumination.' },
  dining_room: { ideal: ['West', 'South'], forbidden: ['South-West'], priority: 'P2', remedy: 'Mirror on the North wall.', science: 'Privacy and digestion environment.' },
  bathroom: { ideal: ['East', 'North'], forbidden: ['South-West'], priority: 'P2', remedy: 'Geyser in the SE corner.', science: 'East sunlight naturally disinfects damp areas.' },
  toilet: { ideal: ['North-West', 'South'], forbidden: ['North-East', 'Center'], priority: 'P2', remedy: 'Bowl of sea salt inside.', science: 'Winds carry odors away from the house core.' },
  pooja_room: { ideal: ['North-East'], forbidden: ['South-West'], priority: 'P1', remedy: 'Light blue/white walls; no storage.', science: 'Highest spiritual energy zone.' },
  study_room: { ideal: ['North-East', 'North'], forbidden: ['South-East'], priority: 'P3', remedy: 'Table faces East.', science: 'Focus and hygiene.' },
  home_office: { ideal: ['West', 'South-West'], forbidden: ['South-East'], priority: 'P3', remedy: 'Sit facing North.', science: 'Professional stability.' },
  store_room: { ideal: ['North-West', 'South-West'], forbidden: ['North-East'], priority: 'P2', remedy: 'Heavy items in SW corner.', science: 'Ideal for weight and coolness.' },
  laundry: { ideal: ['North-West', 'South-East'], forbidden: ['North-East'], priority: 'P3', remedy: 'Drainage to North.', science: 'Chemical/Moisture handling.' },
  staircase: { ideal: ['South', 'West'], forbidden: ['North-East', 'Center'], priority: 'P1', remedy: 'Odd number steps.', science: 'Weight represents Earth energy.' },
  balcony: { ideal: ['North', 'East', 'North-East'], forbidden: ['South'], priority: 'P3', remedy: 'Light shrubs only.', science: 'Ventilation without Southern heat.' },
  basement: { ideal: ['North', 'East', 'North-East'], forbidden: ['South-West'], priority: 'P2', remedy: 'Keep NE corner open to sky.', science: 'Magnetic-sensitive NE zone.' },
  terrace: { ideal: ['South', 'West'], forbidden: ['North-East'], priority: 'P3', remedy: 'SW corner highest point.', science: 'Thermal protection.' },
  parking: { ideal: ['North-West', 'South-East'], forbidden: ['North-East'], priority: 'P3', remedy: 'Slope to North.', science: 'Moving Energy zone.' },
  garage: { ideal: ['North-West', 'South-East'], forbidden: ['South-West'], priority: 'P3', remedy: 'Yellow walls.', science: 'Stability avoidance.' },
  garden: { ideal: ['North', 'East', 'North-East'], forbidden: ['South-West'], priority: 'P3', remedy: 'Trees in SW.', science: 'Solar health for plants.' },
  water_tank_underground: { ideal: ['North-East', 'North'], forbidden: ['South-West'], priority: 'P1', remedy: 'Leakproof tank.', science: 'Thermal mass in NE.' },
  water_tank_overhead: { ideal: ['South-West', 'West'], forbidden: ['North-East'], priority: 'P1', remedy: 'Raised platform.', science: 'Balances magnetic pull.' },
  borewell: { ideal: ['North-East', 'North'], forbidden: ['South-West'], priority: 'P1', remedy: 'Avoid diagonals.', science: 'Groundwater access.' },
  septic_tank: { ideal: ['North-West'], forbidden: ['North-East', 'Center'], priority: 'P1', remedy: 'Away from walls.', science: 'Gas dissipation.' },
  electrical_panel: { ideal: ['South-East'], forbidden: ['North-East'], priority: 'P2', remedy: 'Keep it accessible and clean.', science: 'Fire element.' },
  inverter: { ideal: ['South-East', 'North-West'], forbidden: ['North-East'], priority: 'P3', remedy: 'Wooden stand.', science: 'Heat safety.' },
  generator_room: { ideal: ['South-East', 'North-West'], forbidden: ['North-East'], priority: 'P2', remedy: 'Soundproofing.', science: 'Noise isolation.' },
  locker: { ideal: ['North', 'South-West'], forbidden: ['South-East'], priority: 'P1', remedy: 'Locker door opens North (Kuber).', science: 'Fortune zone.' },
  swimming_pool: { ideal: ['North-East', 'East'], forbidden: ['South-West'], priority: 'P2', remedy: 'Filtration.', science: 'Microclimate zone.' },
  fountain: { ideal: ['North-East', 'North'], forbidden: ['South-East'], priority: 'P3', remedy: 'Flow to house.', science: 'Air ionization.' }
};

const CATEGORIES = [
  { id: 'living', label: 'Living', icon: Home },
  { id: 'utility', label: 'Service', icon: Settings },
  { id: 'structural', label: 'Structure', icon: Layers },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'energy', label: 'Energy', icon: Power }
];

const ELEMENT_TEMPLATES = [
  { category: 'living', type: 'master_bedroom', label: 'Master Bed', color: 'bg-purple-700', icon: 'MB', defW: 14, defH: 14 },
  { category: 'living', type: 'children_bedroom', label: 'Child Bed', color: 'bg-indigo-600', icon: 'CB', defW: 12, defH: 12 },
  { category: 'living', type: 'guest_room', label: 'Guest Bed', color: 'bg-violet-400', icon: 'GR', defW: 10, defH: 12 },
  { category: 'living', type: 'living_room', label: 'Living', color: 'bg-cyan-500', icon: 'LR', defW: 16, defH: 20 },
  { category: 'living', type: 'dining_room', label: 'Dining', color: 'bg-rose-400', icon: 'DN', defW: 12, defH: 14 },
  { category: 'living', type: 'pooja_room', label: 'Pooja', color: 'bg-amber-400', icon: 'PR', defW: 6, defH: 6 },
  { category: 'living', type: 'study_room', label: 'Study', color: 'bg-emerald-500', icon: 'SR', defW: 10, defH: 10 },
  { category: 'living', type: 'locker', label: 'Locker', color: 'bg-yellow-600', icon: 'LK', defW: 4, defH: 4 },
  { category: 'utility', type: 'kitchen', label: 'Kitchen', color: 'bg-orange-500', icon: 'KT', defW: 10, defH: 14 },
  { category: 'utility', type: 'bathroom', label: 'Bath Only', color: 'bg-blue-300', icon: 'BA', defW: 6, defH: 6 },
  { category: 'utility', type: 'toilet', label: 'Toilet/WC', color: 'bg-slate-400', icon: 'TL', defW: 4, defH: 6 },
  { category: 'utility', type: 'store_room', label: 'Store', color: 'bg-amber-800', icon: 'ST', defW: 8, defH: 8 },
  { category: 'utility', type: 'septic_tank', label: 'Septic Tank', color: 'bg-zinc-800', icon: 'ST', defW: 8, defH: 6 },
  { category: 'structural', type: 'main_entrance', label: 'Entry Gate', color: 'bg-indigo-700', icon: 'EN', defW: 8, defH: 4 },
  { category: 'structural', type: 'staircase', label: 'Stairs', color: 'bg-emerald-700', icon: 'SC', defW: 8, defH: 16 },
  { category: 'structural', type: 'balcony', label: 'Balcony', color: 'bg-cyan-600', icon: 'BC', defW: 12, defH: 4 },
  { category: 'water', type: 'water_tank_underground', label: 'UG Tank', color: 'bg-blue-500', icon: 'UT', defW: 6, defH: 6 },
  { category: 'water', type: 'water_tank_overhead', label: 'OH Tank', color: 'bg-blue-900', icon: 'OT', defW: 6, defH: 6 },
  { category: 'water', type: 'borewell', label: 'Borewell', color: 'bg-cyan-800', icon: 'BW', defW: 4, defH: 4 },
  { category: 'energy', type: 'electrical_panel', label: 'E-Panel', color: 'bg-red-600', icon: 'EP', defW: 4, defH: 2 },
  { category: 'energy', type: 'inverter', label: 'Inverter', color: 'bg-orange-700', icon: 'IV', defW: 4, defH: 4 },
];

const App = () => {
  const [northOffset, setNorthOffset] = useState(0);
  const [plotSize, setPlotSize] = useState({ width: 30, length: 50 });
  const [rooms, setRooms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('living');
  const [showZones, setShowZones] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showPurusha, setShowPurusha] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCompassExpanded, setIsCompassExpanded] = useState(true);
  const canvasRef = useRef(null);

  const getZoneLabel = (x, y, offset) => {
    const dx = x - 50; const dy = y - 50;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    let adj = (angle - offset + 450) % 360;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return 'Center';
    if (adj >= 337.5 || adj < 22.5) return 'North';
    if (adj >= 22.5 && adj < 67.5) return 'North-East';
    if (adj >= 67.5 && adj < 112.5) return 'East';
    if (adj >= 112.5 && adj < 157.5) return 'South-East';
    if (adj >= 157.5 && adj < 202.5) return 'South';
    if (adj >= 202.5 && adj < 247.5) return 'South-West';
    if (adj >= 247.5 && adj < 292.5) return 'West';
    if (adj >= 292.5 && adj < 337.5) return 'North-West';
    return 'Unknown';
  };

  const getAudit = (room) => {
    const zone = getZoneLabel(room.x, room.y, northOffset);
    const rule = VASTU_RULES[room.type];
    if (!rule) return { status: 'GOOD', issues: [] };
    if (rule.forbidden.some(f => zone.includes(f))) return { status: 'CRITICAL', zone, rule };
    if (!rule.ideal.some(i => zone.includes(i))) return { status: 'WARN', zone, rule };
    return { status: 'GOOD', zone, rule };
  };

  const overallScore = useMemo(() => {
    if (rooms.length === 0) return 100;
    const total = rooms.reduce((acc, r) => {
      const audit = getAudit(r);
      const score = audit.status === 'GOOD' ? 100 : audit.status === 'WARN' ? 50 : 0;
      const mult = audit.rule?.priority === 'P1' ? 4 : audit.rule?.priority === 'P2' ? 2 : 1;
      return acc + (score * mult);
    }, 0);
    const weightSum = rooms.reduce((acc, r) => {
      const rule = VASTU_RULES[r.type];
      return acc + (rule?.priority === 'P1' ? 4 : rule?.priority === 'P2' ? 2 : 1);
    }, 0);
    return Math.round(total / weightSum);
  }, [rooms, northOffset]);

  const handleInteraction = (e) => {
    if (!draggingId && !resizingId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const xP = Math.min(Math.max(((touch.clientX - rect.left) / rect.width) * 100, 1), 99);
    const yP = Math.min(Math.max(((touch.clientY - rect.top) / rect.height) * 100, 1), 99);

    if (draggingId) setRooms(rooms.map(r => r.id === draggingId ? { ...r, x: xP, y: yP } : r));
    if (resizingId) {
      const room = rooms.find(item => item.id === resizingId);
      const newW = Math.max(Math.abs(xP - room.x) * 2, 2);
      const newH = Math.max(Math.abs(yP - room.y) * 2, 2);
      setRooms(rooms.map(item => item.id === resizingId ? { ...item, widthFt: (newW * plotSize.width) / 100, heightFt: (newH * plotSize.length) / 100 } : item));
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ rooms, plotSize, northOffset, timestamp: new Date().toISOString() });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `VastuProject_${new Date().getTime()}.vastu`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.rooms) {
           setRooms(data.rooms); setPlotSize(data.plotSize); setNorthOffset(data.northOffset);
        }
      } catch (err) { console.error("Import error", err); }
    };
    reader.readAsText(file);
  };

  const canvasAspectRatio = plotSize.width / plotSize.length;

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden select-none"
         onMouseMove={handleInteraction} onTouchMove={handleInteraction}
         onMouseUp={() => { setDraggingId(null); setResizingId(null); }} onTouchEnd={() => { setDraggingId(null); setResizingId(null); }}
         onClick={() => setSelectedId(null)}>
      
      {/* Header */}
      <header className="bg-white border-b px-4 md:px-8 py-3 flex justify-between items-center z-40 shadow-sm shrink-0 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
            <Compass className={draggingId ? 'animate-spin' : ''} size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black uppercase tracking-tight">VastuSetu <span className="text-indigo-600">Pro 8.0</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Complete Project Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2">
                <div className="w-16 md:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border">
                   <div className={`h-full transition-all duration-1000 ${overallScore > 75 ? 'bg-emerald-500' : overallScore > 45 ? 'bg-orange-500' : 'bg-rose-500'}`} style={{ width: `${overallScore}%` }} />
                </div>
                <span className="text-sm md:text-xl font-black tabular-nums">{overallScore}%</span>
             </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setIsReportOpen(true); }} className="bg-emerald-600 text-white p-2 md:px-4 md:py-2.5 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2">
            <ClipboardList size={16} /> <span className="hidden sm:inline">Audit Report</span>
          </button>
          
          <div className="flex gap-2 border-l pl-2 md:pl-6">
            <label className="cursor-pointer bg-slate-200 text-slate-600 p-2 rounded-xl hover:bg-slate-300 transition-colors" title="Import (.vastu)">
               <FileUp size={16} /> <input type="file" className="hidden" accept=".vastu" onChange={handleImport} />
            </label>
            <button onClick={(e) => { e.stopPropagation(); handleExport(); }} className="bg-slate-200 text-slate-600 p-2 rounded-xl hover:bg-slate-300 transition-colors" title="Export (.vastu)">
               <FileDown size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} absolute md:relative md:translate-x-0 z-30 w-72 md:w-80 bg-white border-r h-full flex flex-col shadow-xl md:shadow-none transition-transform duration-300 no-print`}>
          <div className="p-4 border-b flex gap-1 bg-slate-50 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-1 min-w-[50px] flex flex-col items-center p-2 rounded-xl transition-all border ${activeCategory === cat.id ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'border-transparent text-slate-400'}`}>
                <cat.icon size={14} />
                <span className="text-[8px] font-bold mt-1 uppercase w-full text-center truncate">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-b flex flex-col gap-3">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Geometry (Ft)</h3>
             <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-400 uppercase ml-1">Width</label>
                   <input type="number" value={plotSize.width} onChange={e => setPlotSize({...plotSize, width: Number(e.target.value)})} className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold border border-slate-200" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-400 uppercase ml-1">Length</label>
                   <input type="number" value={plotSize.length} onChange={e => setPlotSize({...plotSize, length: Number(e.target.value)})} className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold border border-slate-200" />
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ELEMENT_TEMPLATES.filter(t => t.category === activeCategory).map(t => (
                <button key={t.type} onClick={(e) => {
                  e.stopPropagation();
                  const newRoom = { id: Date.now(), name: t.label, x: 50, y: 50, type: t.type, rotation: 0, widthFt: t.defW, heightFt: t.defH };
                  setRooms([...rooms, newRoom]); setSelectedId(newRoom.id);
                }} className="flex flex-col items-center p-2 rounded-xl border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all group">
                  <div className={`w-8 h-8 rounded-lg ${t.color} flex items-center justify-center text-white font-black text-[10px] shadow-sm mb-1 uppercase`}>{t.icon}</div>
                  <span className="text-[7px] font-bold text-slate-600 text-center uppercase tracking-tighter leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 relative flex items-center justify-center bg-slate-200/50 overflow-hidden p-6 md:p-16">
          
          <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }} className="md:hidden absolute bottom-6 left-6 z-40 bg-white p-4 rounded-full shadow-2xl border text-indigo-600 no-print">
            {isSidebarOpen ? <X size={24} /> : <Plus size={24} />}
          </button>

          {/* Layer Controls */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 no-print">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
               <button onClick={(e) => { e.stopPropagation(); setShowZones(!showZones); }} className={`p-2 rounded-xl transition-all ${showZones ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`} title="Zone Grid"><LayoutGrid size={20} /></button>
               <button onClick={(e) => { e.stopPropagation(); setShowDimensions(!showDimensions); }} className={`p-2 rounded-xl transition-all ${showDimensions ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`} title="Rulers"><Ruler size={20} /></button>
               <button onClick={(e) => { e.stopPropagation(); setShowPurusha(!showPurusha); }} className={`p-2 rounded-xl transition-all ${showPurusha ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`} title="Vastu Purusha"><PurushaIcon size={20} /></button>
            </div>
          </div>

          {/* Collapsible Compass UI */}
          <div className={`absolute top-6 right-6 bg-white rounded-[2.5rem] shadow-xl border border-white z-20 transition-all duration-300 no-print ${isCompassExpanded ? 'w-48 md:w-56 p-5' : 'w-12 h-12 p-2'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsCompassExpanded(!isCompassExpanded); }}
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1 rounded-full shadow-lg border-2 border-white"
            >
               {isCompassExpanded ? <ChevronUp size={14} className="-rotate-90"/> : <Compass size={14} />}
            </button>
            
            {isCompassExpanded && (
              <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-slate-50 flex items-center justify-center bg-white shadow-inner" style={{ transform: `rotate(${northOffset}deg)` }}>
                  <div className="absolute -top-1 w-2.5 h-8 bg-rose-600 rounded-full shadow-lg ring-2 ring-white" />
                  <span className="absolute -top-8 font-black text-rose-600 text-2xl">N</span>
                  <div className="w-5 h-5 bg-white border-4 border-indigo-600 rounded-full shadow-xl z-10" />
                </div>
                <div className="w-full text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Align: {northOffset}°</span>
                  <input type="range" min="0" max="360" value={northOffset} onChange={e => setNorthOffset(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2" />
                </div>
              </div>
            )}
          </div>

          {/* The Smart Blueprint Canvas */}
          <div 
            ref={canvasRef}
            style={{ 
              width: `${Math.min(95, 95 * canvasAspectRatio)}%`, 
              height: `${Math.min(95, 95 / canvasAspectRatio)}%`,
              maxWidth: '800px', maxHeight: '800px'
            }}
            className="relative bg-white shadow-2xl border-[15px] md:border-[25px] border-slate-800 transition-all duration-300 rounded-[2rem] z-10 print:static print:w-full print:max-w-none print:shadow-none"
          >
            {/* Architectural Rulers on Plot Boundary */}
            {showDimensions && (
              <>
                <div className="absolute -top-12 left-0 right-0 h-10 pointer-events-none flex justify-between items-end pb-1 px-1 no-print">
                  {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <div key={v} className="flex flex-col items-center">
                       <span className="text-[9px] font-black text-slate-400">{formatFtIn(v * plotSize.width)}</span>
                       <div className="w-0.5 h-3 bg-slate-300 mt-0.5" />
                    </div>
                  ))}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200" />
                </div>
                <div className="absolute -left-16 top-0 bottom-0 w-14 pointer-events-none flex flex-col justify-between items-end pr-1 py-1 no-print">
                  {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <div key={v} className="flex items-center gap-1.5">
                       <span className="text-[9px] font-black text-slate-400">{formatFtIn(v * plotSize.length)}</span>
                       <div className="h-0.5 w-3 bg-slate-300" />
                    </div>
                  ))}
                  <div className="absolute inset-y-0 right-0 w-0.5 bg-slate-200" />
                </div>
              </>
            )}

            {/* Vastu Layers (Rotatable) */}
            <div className={`absolute inset-0 transition-transform duration-500 pointer-events-none ${showZones ? 'opacity-30' : 'opacity-0'}`} style={{ transform: `rotate(${northOffset}deg)` }}>
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 border-2 border-indigo-100">
                {['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'].map(z => (
                  <div key={z} className="border border-indigo-50/50 flex items-center justify-center font-black text-4xl md:text-5xl text-indigo-900/10 uppercase tracking-tighter">{z}</div>
                ))}
              </div>
            </div>

            {/* Room Entities */}
            {rooms.map(room => {
              const audit = getAudit(room);
              const t = ELEMENT_TEMPLATES.find(temp => temp.type === room.type);
              const wP = (room.widthFt / plotSize.width) * 100;
              const hP = (room.heightFt / plotSize.length) * 100;
              const isActive = selectedId === room.id;

              return (
                <div 
                  key={room.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(room.id); }}
                  onMouseDown={(e) => { 
                    e.stopPropagation(); 
                    if (e.target.closest('.resizer')) setResizingId(room.id); 
                    else setDraggingId(room.id);
                    setSelectedId(room.id);
                  }}
                  onTouchStart={(e) => {
                    // Mobile Touch Start for drag/resize
                    e.stopPropagation();
                    if (e.target.closest('.resizer')) setResizingId(room.id);
                    else setDraggingId(room.id);
                    setSelectedId(room.id);
                  }}
                  className={`absolute flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all z-20 group shadow-2xl rounded-2xl border-2 border-white/80
                    ${isActive ? 'ring-4 ring-indigo-500 z-30' : 'hover:scale-[1.02]'} 
                    ${t?.color || 'bg-white'} touch-none`}
                  style={{ 
                    left: `${room.x}%`, top: `${room.y}%`, 
                    width: `${wP}%`, height: `${hP}%`, 
                    transform: `translate(-50%, -50%) rotate(${room.rotation}deg)` 
                  }}
                >
                  <div className="p-1 rounded bg-white/20 shrink-0">
                    {room.type.includes('entrance') ? <ArrowUpRight className="text-white" size={14} /> : <Maximize className="text-white" size={14} />}
                  </div>
                  <span className="text-[7px] md:text-[9px] font-black text-white text-center leading-none uppercase truncate w-full px-2 tracking-tighter drop-shadow-sm">{room.name}</span>
                  
                  {isActive && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-2 z-[60] pointer-events-auto bg-white p-1.5 rounded-full shadow-2xl border border-slate-200 no-print">
                      <button onMouseDown={(e) => { e.stopPropagation(); setRooms(rooms.map(r => r.id === room.id ? {...r, rotation: (r.rotation + 90) % 360} : r)); }} onTouchStart={(e) => { e.stopPropagation(); setRooms(rooms.map(r => r.id === room.id ? {...r, rotation: (r.rotation + 90) % 360} : r)); }} className="bg-slate-50 p-2 rounded-full shadow-sm hover:text-indigo-600 hover:bg-indigo-50 border text-slate-600" title="Rotate"><RotateCw size={14} /></button>
                      <button onMouseDown={(e) => { e.stopPropagation(); setRooms(rooms.filter(r => r.id !== room.id)); setSelectedId(null); }} onTouchStart={(e) => { e.stopPropagation(); setRooms(rooms.filter(r => r.id !== room.id)); setSelectedId(null); }} className="bg-slate-50 p-2 rounded-full shadow-sm text-rose-500 hover:bg-rose-50 border" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  )}
                  
                  <div className="resizer absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center cursor-nwse-resize shadow-xl border-2 border-indigo-500 pointer-events-auto z-40 opacity-0 md:opacity-0 group-hover:opacity-100 no-print touch-none">
                    <Scale size={14} className="text-indigo-600" />
                  </div>

                  {showDimensions && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-slate-600 whitespace-nowrap bg-white/95 px-2 py-1 rounded shadow-lg border">
                      {formatFtIn(room.widthFt)} x {formatFtIn(room.heightFt)}
                    </div>
                  )}

                  <div className={`absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center shadow-2xl transform -rotate-[inherit]
                    ${audit.status === 'GOOD' ? 'bg-emerald-500' : audit.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-orange-500'}`}>
                    {audit.status === 'GOOD' ? <CheckCircle size={14} className="text-white" /> : <AlertTriangle size={14} className="text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl px-12 py-4 rounded-full border border-slate-200 shadow-2xl flex items-center gap-4 z-10 no-print">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
            <div className="flex flex-col"><span className="text-[12px] font-black text-slate-800 uppercase tracking-[0.4em]">Design & Audit Studio</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Mobile & Web Interaction Enabled</span></div>
          </div>
        </main>
      </div>

      {/* AUDIT REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-4 print:static print:bg-white print:p-0 no-print-background">
           <div className="bg-white w-full max-w-5xl h-full md:h-[90vh] rounded-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200 print:static print:h-auto print:rounded-none print:shadow-none print:overflow-visible">
              <div className="p-6 md:p-8 border-b flex justify-between items-center bg-emerald-50 shrink-0 no-print">
                 <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg"><ClipboardList /></div>
                    <div>
                       <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-emerald-900">Blueprint Vastu Audit</h2>
                       <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Generated for current Site Dimensions</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => window.print()} className="bg-slate-900 text-white p-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"><Printer size={18}/> Print Report</button>
                    <button onClick={() => setIsReportOpen(false)} className="bg-white p-3 rounded-full hover:bg-slate-50 border"><X /></button>
                 </div>
              </div>
              
              <div id="printable-report" className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 scrollbar-hide print:p-0 print:overflow-visible print:block w-full">
                 {/* Page 1 Header (Print Only) */}
                 <div className="hidden print:block border-b-4 border-slate-900 pb-4 mb-10 w-full">
                    <h1 className="text-4xl font-black uppercase text-slate-900 tracking-tighter">VastuSetu Audit Blueprint</h1>
                    <p className="font-bold text-slate-400 uppercase tracking-widest">Ref No: VS-{new Date().getTime().toString().slice(-6)} • Date: {new Date().toLocaleDateString()}</p>
                 </div>

                 {/* ENLARGED BLUEPRINT Snapshot in Report */}
                 <div className="relative bg-slate-50 border-2 border-slate-200 rounded-[3rem] p-12 md:p-16 flex items-center justify-center mb-10 shadow-inner print:bg-white print:border-slate-800 print:p-12 print:mb-12 print:break-after-page min-h-[500px] md:min-h-[700px]">
                    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                      <div 
                        style={{ 
                          width: canvasAspectRatio > 1 ? '100%' : `${100 * canvasAspectRatio}%`,
                          height: canvasAspectRatio > 1 ? `${100 / canvasAspectRatio}%` : '100%',
                          maxWidth: '750px',
                          maxHeight: '750px',
                          aspectRatio: `${plotSize.width}/${plotSize.length}`
                        }}
                        className="relative bg-white shadow-2xl border-[15px] md:border-[20px] border-slate-900 rounded-[1.5rem] flex items-center justify-center overflow-visible"
                      >
                        {/* Architectural Rulers on Snapshot */}
                        <div className="absolute -top-12 left-0 right-0 h-10 pointer-events-none flex justify-between items-end pb-1 px-1">
                            {[0, 0.25, 0.5, 0.75, 1].map(v => (
                              <div key={v} className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-400">{formatFtIn(v * plotSize.width)}</span>
                                <div className="w-0.5 h-3 bg-slate-300 mt-0.5" />
                              </div>
                            ))}
                        </div>
                        <div className="absolute -left-16 top-0 bottom-0 w-16 pointer-events-none flex flex-col justify-between items-end pr-1 py-1">
                            {[0, 0.25, 0.5, 0.75, 1].map(v => (
                              <div key={v} className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black text-slate-400">{formatFtIn(v * plotSize.length)}</span>
                                <div className="h-0.5 w-3 bg-slate-300" />
                              </div>
                            ))}
                        </div>

                        <div className={`absolute inset-0 opacity-20 pointer-events-none`} style={{ transform: `rotate(${northOffset}deg)` }}>
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 border-2 border-indigo-100">
                              {['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'].map(z => (
                                <div key={z} className="border border-indigo-50/50 flex items-center justify-center font-black text-3xl md:text-4xl text-indigo-900/10 uppercase tracking-tighter">{z}</div>
                              ))}
                            </div>
                        </div>
                        {rooms.map(room => (
                            <div 
                              key={room.id}
                              className={`absolute flex flex-col items-center justify-center rounded-[0.8rem] md:rounded-[1.2rem] border-2 border-white/50 shadow-lg ${ELEMENT_TEMPLATES.find(t => t.type === room.type)?.color}`}
                              style={{ 
                                left: `${room.x}%`, top: `${room.y}%`, 
                                width: `${(room.widthFt / plotSize.width) * 100}%`, height: `${(room.heightFt / plotSize.length) * 100}%`, 
                                transform: `translate(-50%, -50%) rotate(${room.rotation}deg)` 
                              }}
                            >
                              <span className="text-[6px] md:text-[9px] font-black text-white uppercase text-center truncate px-1 drop-shadow-sm">{room.name}</span>
                              <span className="text-[5px] md:text-[7px] font-mono text-white opacity-90 mt-0.5">{formatFtIn(room.widthFt)} x {formatFtIn(room.heightFt)}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                 </div>

                 {/* Audit Statistics */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 print:grid-cols-3 print:gap-4 print:bg-white print:mb-12">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col items-center justify-center print:bg-slate-900 print:border print:border-slate-800">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Overall Resonance</span>
                       <span className="text-6xl font-black text-emerald-400">{overallScore}%</span>
                    </div>
                    <div className="col-span-2 bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 print:bg-white print:border-emerald-500 flex flex-col justify-center">
                       <h4 className="font-black text-emerald-800 uppercase text-xs flex items-center gap-2 mb-3"><ShieldCheck /> Professional Summary</h4>
                       <p className="text-sm leading-relaxed text-emerald-700 font-medium italic">
                          {overallScore > 75 ? "Your blueprint demonstrates exceptional alignment with Cardinal Directions. The flow of energy is balanced and auspicious." : 
                           overallScore > 50 ? "The design is balanced but contains specific Element Conflicts in secondary zones. Implementing the listed remedies will stabilize the environment." :
                           "Alert: Significant Vastu Doshas identified in Primary Energy Quadrants. Structural realignment is strongly advised."}
                       </p>
                    </div>
                 </div>

                 {/* Element Audit List */}
                 <div className="space-y-8 print:p-0 w-full print:block">
                    <h3 className="text-2xl font-black uppercase tracking-tight border-b-4 pb-4 border-slate-900 flex items-center gap-3"><Target className="text-indigo-600" size={28}/> Detailed Element Audit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-1 print:gap-8 print:block">
                        {rooms.map(room => {
                          const audit = getAudit(room);
                          return (
                            <div key={room.id} className={`p-8 rounded-[2rem] border-2 shadow-sm print:break-inside-avoid print:bg-white print:mb-8 ${audit.status === 'GOOD' ? 'bg-white border-emerald-100' : audit.status === 'CRITICAL' ? 'bg-rose-50/30 border-rose-100' : 'bg-orange-50/30 border-orange-100'}`}>
                               <div className="flex justify-between items-center mb-6">
                                  <span className="font-black text-xl text-slate-900 uppercase tracking-tighter">{room.name}</span>
                                  <span className={`text-[10px] font-black px-5 py-2 rounded-full text-white uppercase shadow-sm ${audit.status === 'GOOD' ? 'bg-emerald-500' : audit.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-orange-500'}`}>
                                    {audit.status === 'GOOD' ? 'Harmonized' : audit.status}
                                  </span>
                               </div>
                               <div className="space-y-5">
                                  <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-black text-slate-500">
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">Zone: <span className="text-slate-900 ml-1">{audit.zone}</span></div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">Ideal: <span className="text-indigo-600 ml-1">{audit.rule?.ideal[0]}</span></div>
                                  </div>
                                  {audit.status !== 'GOOD' && (
                                    <div className="space-y-4">
                                      <div className="bg-white p-5 rounded-3xl border-l-8 border-slate-900 shadow-sm print:border print:border-slate-100">
                                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Scientific Perspective</p>
                                          <p className="text-sm text-slate-700 leading-relaxed font-medium italic">"{audit.rule?.science}"</p>
                                      </div>
                                      <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl print:bg-indigo-700">
                                          <p className="text-[10px] font-black uppercase opacity-60 mb-2 flex items-center gap-1"><Wrench size={12}/> Remedial Action (Upay)</p>
                                          <p className="text-sm font-bold leading-relaxed">"{audit.rule?.remedy}"</p>
                                      </div>
                                    </div>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                    </div>
                 </div>

                 <div className="hidden print:block pt-16 border-t-2 mt-16 text-center pb-8">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.6em]">Authorized VastuSetu Elite Report • Sthapatya Veda Division</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Global Style for Printing and Mobile Compass */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Force standard document flow instead of fixed viewport modal */
          html, body { 
            height: auto !important; 
            overflow: visible !important; 
            margin: 0 !important; 
            padding: 0 !important;
            background: white !important;
          }
          body * { visibility: hidden; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { 
            position: relative !important; 
            display: block !important;
            width: 100% !important; 
            height: auto !important; 
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Reset modal container to allow page breaks */
          .fixed.inset-0 { 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important; 
            height: auto !important; 
            display: block !important; 
            overflow: visible !important;
            background: transparent !important;
          }
          /* Remove layout scroll constraints */
          .bg-white.w-full.max-w-5xl {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            max-width: none !important;
            display: block !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:bg-slate-900 { background-color: #0f172a !important; }
          .print\\:bg-indigo-700 { background-color: #4338ca !important; }
          .print\\:bg-slate-50 { background-color: #f8fafc !important; }
          .print\\:border-slate-800 { border-color: #1e293b !important; }
          .print\\:border-emerald-500 { border-color: #10b981 !important; }
          .print\\:break-after-page { page-break-after: always !important; break-after: page !important; }
          .print\\:break-inside-avoid { page-break-inside: avoid !important; break-inside: avoid !important; }
          .print\\:block { display: block !important; }
        }
        input[type=range]::-webkit-slider-thumb { border: 2px solid white; height: 16px; width: 16px; border-radius: 50%; background: #4f46e5; cursor: pointer; -webkit-appearance: none; margin-top: -7px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="bg-slate-950 text-[9px] text-slate-500 py-2 text-center font-mono uppercase tracking-[0.5em] shrink-0 no-print">
        Blueprint: {formatFtIn(plotSize.width)} x {formatFtIn(plotSize.length)} • Calibration: {northOffset}° • Local Vault Secure
      </div>
    </div>
  );
};

export default App;