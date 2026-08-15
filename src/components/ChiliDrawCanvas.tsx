import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Paintbrush, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  CloudUpload, 
  Sparkles, 
  Type, 
  Smile, 
  Check, 
  Palette, 
  Layers, 
  Flame, 
  Eye, 
  Maximize2,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { imageConfig } from '../config/assets';
import { ChiliDrawing } from '../types';

interface ChiliDrawCanvasProps {
  onSaveToFirebase?: (drawingData: {
    title: string;
    creatorName: string;
    imageData: string;
    baseTemplate: string;
  }) => Promise<boolean>;
  onOrderPrint?: (imageData: string, title: string) => void;
  onCanvasChange?: (imageData: string) => void;
  initialImageData?: string;
}

export type DrawingTool = 'brush' | 'eraser' | 'stamp' | 'text';

export const CHILI_TEMPLATES = [
  {
    id: 'signature',
    name: 'Signature Cabai 3D',
    description: 'Realistic 3D printed cabai pepper with keyring loop',
    imageSrc: imageConfig.products.cabaiKeychain
  },
  {
    id: 'outline',
    name: 'Pepper Outline',
    description: 'Crisp vector outline canvas for custom pattern coloring',
    svgType: 'outline'
  },
  {
    id: 'fiery',
    name: 'Fiery Habanero',
    description: 'Plump curved hot habanero pepper silhouette',
    svgType: 'habanero'
  },
  {
    id: 'mascot',
    name: 'Chili Mascot',
    description: 'Cute stylized pepper character ready for faces & stickers',
    svgType: 'mascot'
  }
];

export const COLOR_PALETTE = [
  { name: 'Chili Red', hex: '#af101a', bg: 'bg-[#af101a]' },
  { name: 'Hot Crimson', hex: '#e11d48', bg: 'bg-rose-600' },
  { name: 'Spicy Orange', hex: '#ea580c', bg: 'bg-orange-600' },
  { name: 'Sun Yellow', hex: '#eab308', bg: 'bg-yellow-500' },
  { name: 'Stem Green', hex: '#16a34a', bg: 'bg-green-600' },
  { name: 'Neon Lime', hex: '#84cc16', bg: 'bg-lime-500' },
  { name: 'Electric Cyan', hex: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Royal Purple', hex: '#7c3aed', bg: 'bg-violet-600' },
  { name: 'Hot Pink', hex: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Metallic Gold', hex: '#d97706', bg: 'bg-amber-600' },
  { name: 'Pure White', hex: '#ffffff', bg: 'bg-white' },
  { name: 'Midnight Black', hex: '#09090b', bg: 'bg-zinc-950' }
];

export const STAMPS = [
  { id: 'flame', label: '🔥 Flame', char: '🔥' },
  { id: 'chili', label: '🌶️ Chili', char: '🌶️' },
  { id: 'cool', label: '😎 Cool', char: '😎' },
  { id: 'eyes', label: '👀 Eyes', char: '👀' },
  { id: 'sparkles', label: '✨ Sparkle', char: '✨' },
  { id: 'crown', label: '👑 Crown', char: '👑' },
  { id: 'heart', label: '💖 Heart', char: '💖' },
  { id: 'lightning', label: '⚡ Bolt', char: '⚡' },
  { id: 'star', label: '⭐ Star', char: '⭐' }
];

export const BRUSH_SIZES = [
  { label: 'Fine', size: 3 },
  { label: 'Medium', size: 8 },
  { label: 'Thick', size: 16 },
  { label: 'Chunky', size: 28 },
  { label: 'Super', size: 48 }
];

export const ChiliDrawCanvas: React.FC<ChiliDrawCanvasProps> = ({
  onSaveToFirebase,
  onOrderPrint,
  onCanvasChange,
  initialImageData
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [selectedTool, setSelectedTool] = useState<DrawingTool>('brush');
  const [selectedColor, setSelectedColor] = useState<string>('#af101a');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [activeTemplate, setActiveTemplate] = useState<string>('signature');
  const [selectedStamp, setSelectedStamp] = useState<string>('🔥');
  const [customText, setCustomText] = useState<string>('CABAI');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Canvas History Stack for Undo/Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Firebase Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [designTitle, setDesignTitle] = useState<string>('My Custom Chili Keychain');
  const [creatorName, setCreatorName] = useState<string>('Maker Enthusiast');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Canvas size
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 800;

  // Render Base Template onto Canvas
  const drawBaseTemplate = useCallback((ctx: CanvasRenderingContext2D, templateId: string) => {
    // Background
    ctx.fillStyle = '#181a1b';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle Grid pattern
    ctx.strokeStyle = '#26292b';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    if (templateId === 'signature') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageConfig.products.cabaiKeychain;
      img.onload = () => {
        // Draw image centered
        const pad = 60;
        ctx.drawImage(img, pad, pad, CANVAS_WIDTH - pad * 2, CANVAS_HEIGHT - pad * 2);
        // Save initial snapshot
        if (canvasRef.current) {
          const snap = canvasRef.current.toDataURL('image/png');
          setHistory([snap]);
          setHistoryStep(0);
        }
      };
      img.onerror = () => {
        drawFallbackVectorChili(ctx, 'signature');
      };
      return;
    }

    drawFallbackVectorChili(ctx, templateId);
  }, []);

  const drawFallbackVectorChili = (ctx: CanvasRenderingContext2D, type: string) => {
    ctx.save();

    // Studio drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 15;

    // Keyring ring hole at top
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(400, 100, 36, 0, Math.PI * 2);
    ctx.stroke();

    // Stem
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(385, 160);
    ctx.bezierCurveTo(390, 110, 410, 105, 415, 155);
    ctx.bezierCurveTo(440, 175, 450, 205, 430, 220);
    ctx.bezierCurveTo(400, 230, 370, 220, 365, 195);
    ctx.closePath();
    ctx.fill();

    // Main Chili Body
    ctx.beginPath();
    if (type === 'habanero') {
      // Plumper shape
      ctx.moveTo(370, 210);
      ctx.bezierCurveTo(240, 260, 240, 460, 310, 580);
      ctx.bezierCurveTo(350, 660, 400, 710, 410, 730);
      ctx.bezierCurveTo(425, 710, 490, 620, 530, 480);
      ctx.bezierCurveTo(570, 340, 500, 220, 430, 210);
    } else if (type === 'mascot') {
      // Cute stylized shape
      ctx.moveTo(370, 210);
      ctx.bezierCurveTo(270, 250, 280, 440, 320, 560);
      ctx.bezierCurveTo(350, 640, 390, 690, 420, 720);
      ctx.bezierCurveTo(450, 680, 510, 580, 530, 460);
      ctx.bezierCurveTo(550, 320, 480, 220, 430, 210);
    } else {
      // Classic curved chili
      ctx.moveTo(370, 210);
      ctx.bezierCurveTo(280, 260, 260, 420, 290, 530);
      ctx.bezierCurveTo(320, 630, 380, 700, 430, 740);
      ctx.bezierCurveTo(450, 720, 470, 650, 480, 570);
      ctx.bezierCurveTo(500, 440, 530, 320, 430, 210);
    }
    ctx.closePath();

    if (type === 'outline') {
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 12;
      ctx.stroke();
    } else {
      // Vibrant 3D gradient fill
      const grad = ctx.createLinearGradient(280, 210, 500, 700);
      grad.addColorStop(0, '#dc2626');
      grad.addColorStop(0.4, '#af101a');
      grad.addColorStop(0.85, '#7f1d1d');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fill();

      // 3D Highlight curve
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(340, 260);
      ctx.bezierCurveTo(310, 380, 330, 520, 380, 620);
      ctx.stroke();
    }

    ctx.restore();

    // Save snapshot
    if (canvasRef.current) {
      const snap = canvasRef.current.toDataURL('image/png');
      setHistory([snap]);
      setHistoryStep(0);
    }
  };

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (initialImageData) {
      const img = new Image();
      img.src = initialImageData;
      img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setHistory([initialImageData]);
        setHistoryStep(0);
        onCanvasChange?.(initialImageData);
      };
    } else {
      drawBaseTemplate(ctx, activeTemplate);
      const snap = canvas.toDataURL('image/png');
      onCanvasChange?.(snap);
    }
  }, [activeTemplate, drawBaseTemplate, initialImageData, onCanvasChange]);

  // Save State to History
  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snap = canvas.toDataURL('image/png');
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(snap);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    onCanvasChange?.(snap);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.src = history[prevStep];
      img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setHistoryStep(prevStep);
        onCanvasChange?.(history[prevStep]);
      };
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.src = history[nextStep];
      img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setHistoryStep(nextStep);
        onCanvasChange?.(history[nextStep]);
      };
    }
  };

  const handleClear = () => {
    if (window.confirm('Reset drawing canvas to base chili template?')) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawBaseTemplate(ctx, activeTemplate);
    }
  };

  // Coordinate mapper from event to canvas internal 800x800 resolution
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (selectedTool === 'stamp') {
      // Stamp character at position
      ctx.save();
      ctx.font = `${brushSize * 3 + 24}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillText(selectedStamp, pt.x, pt.y);
      ctx.restore();
      pushHistory();
      return;
    }

    if (selectedTool === 'text') {
      if (!customText.trim()) return;
      ctx.save();
      ctx.font = `bold ${brushSize * 2 + 22}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      // 3D Embossed text look
      ctx.fillStyle = '#000000';
      ctx.fillText(customText.toUpperCase(), pt.x + 2, pt.y + 2);
      ctx.fillStyle = selectedColor;
      ctx.fillText(customText.toUpperCase(), pt.x, pt.y);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeText(customText.toUpperCase(), pt.x, pt.y);
      ctx.restore();
      pushHistory();
      return;
    }

    setIsDrawing(true);
    setLastPoint(pt);

    // Initial dot
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = selectedTool === 'eraser' ? '#181a1b' : selectedColor;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    const pt = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (selectedTool === 'eraser') {
      ctx.strokeStyle = '#181a1b';
    } else {
      ctx.strokeStyle = selectedColor;
      ctx.shadowColor = selectedColor;
      ctx.shadowBlur = 4;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();

    setLastPoint(pt);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      pushHistory();
    }
  };

  // Local Download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `cabai_custom_chili_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Save to Firebase
  const handleFirebaseSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSaveToFirebase) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const ok = await onSaveToFirebase({
        title: designTitle.trim() || 'Custom Chili Keychain',
        creatorName: creatorName.trim() || 'Cabai Maker',
        imageData: dataUrl,
        baseTemplate: activeTemplate
      });

      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setIsSaveModalOpen(false);
          setSaveSuccess(false);
        }, 1200);
      }
    } catch (err) {
      console.error('Firebase save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Order Print handler
  const handleDirectOrder = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onOrderPrint) return;
    const dataUrl = canvas.toDataURL('image/png');
    onOrderPrint(dataUrl, designTitle);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Toolbar */}
      <div className="bg-[#1a1c1c] text-white p-4 sm:p-5 rounded-3xl border-2 border-red-900/40 shadow-xl space-y-4">
        
        {/* Template Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#af101a]" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Base Chili Canvas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CHILI_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => {
                  setActiveTemplate(tpl.id);
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) drawBaseTemplate(ctx, tpl.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTemplate === tpl.id
                    ? 'bg-[#af101a] text-white shadow-md shadow-red-950/50'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Selection Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setSelectedTool('brush')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedTool === 'brush'
                ? 'bg-[#af101a] text-white ring-2 ring-red-400/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            <span>Brush Draw</span>
          </button>

          <button
            onClick={() => setSelectedTool('eraser')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedTool === 'eraser'
                ? 'bg-[#af101a] text-white ring-2 ring-red-400/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>Eraser</span>
          </button>

          <button
            onClick={() => setSelectedTool('stamp')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedTool === 'stamp'
                ? 'bg-[#af101a] text-white ring-2 ring-red-400/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>3D Stickers</span>
          </button>

          <button
            onClick={() => setSelectedTool('text')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedTool === 'text'
                ? 'bg-[#af101a] text-white ring-2 ring-red-400/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Embossed Text</span>
          </button>
        </div>

        {/* Dynamic Tool Sub-Panel */}
        {selectedTool === 'stamp' && (
          <div className="p-3 bg-gray-900/90 rounded-2xl border border-gray-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-2 font-bold">Pick Sticker (Tap canvas to place):</span>
            {STAMPS.map(stamp => (
              <button
                key={stamp.id}
                onClick={() => setSelectedStamp(stamp.char)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                  selectedStamp === stamp.char
                    ? 'bg-[#af101a] text-white scale-110 shadow'
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                {stamp.label}
              </button>
            ))}
          </div>
        )}

        {selectedTool === 'text' && (
          <div className="p-3 bg-gray-900/90 rounded-2xl border border-gray-800 flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-400 font-bold">Text to Stamp (Tap canvas to place):</span>
            <input
              type="text"
              maxLength={15}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. CABAI HOT"
              className="px-3 py-1.5 text-xs bg-black border border-gray-700 rounded-lg text-white font-bold uppercase focus:border-[#af101a] outline-hidden"
            />
            <span className="text-[11px] text-gray-400">Click anywhere on the chili to stamp in 3D relief!</span>
          </div>
        )}

        {/* Color Palette & Brush Size Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          {/* Colors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400">Palette:</span>
            {COLOR_PALETTE.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.hex)}
                title={c.name}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  selectedColor === c.hex
                    ? 'border-white scale-125 shadow-md shadow-white/30'
                    : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              title="Custom Color"
              className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer"
            />
          </div>

          {/* Stroke Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Size:</span>
            {BRUSH_SIZES.map(b => (
              <button
                key={b.size}
                onClick={() => setBrushSize(b.size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  brushSize === b.size
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Canvas Drawing Stage */}
      <div 
        ref={containerRef}
        className="relative mx-auto max-w-2xl rounded-3xl overflow-hidden border-4 border-[#1a1c1c] shadow-2xl bg-[#181a1b] touch-none select-none"
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto aspect-square cursor-crosshair block"
        />

        {/* Floating Canvas Quick Actions Bar */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-700 shadow-xl">
          <button
            onClick={handleUndo}
            disabled={historyStep <= 0}
            title="Undo"
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            title="Redo"
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-30 transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-700" />
          <button
            onClick={handleClear}
            title="Reset Canvas"
            className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Instructions Overlay Badge */}
        <div className="absolute bottom-3 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-800 text-[11px] text-gray-300 flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-[#af101a]" />
          <span>Draw directly on the chili to customize your 3D print</span>
        </div>
      </div>

      {/* Canvas Bottom Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Local PNG Download */}
        <button
          onClick={handleDownload}
          className="py-3.5 px-4 rounded-2xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-gray-600" />
          <span>Download PNG</span>
        </button>

        {/* Save to Firebase Button */}
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-800 to-[#af101a] hover:from-red-900 hover:to-red-800 text-white font-extrabold text-xs shadow-md shadow-red-950/30 flex items-center justify-center gap-2 transition-all group"
        >
          <CloudUpload className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Save Design to Firebase</span>
        </button>

        {/* Direct Order 3D Print */}
        <button
          onClick={handleDirectOrder}
          className="py-3.5 px-4 rounded-2xl bg-[#1a1c1c] hover:bg-black text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-red-500" />
          <span>Order 3D Print of This</span>
        </button>

      </div>

      {/* Save to Firebase Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#af101a]">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-gray-900">
                  Save Chili to Firebase
                </h3>
                <p className="text-xs text-gray-500">
                  Store your customized artwork securely in the Cloud Firestore database.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Design Title</label>
                <input
                  type="text"
                  value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  placeholder="e.g. Cyberpunk Hot Pepper"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 font-bold text-gray-900 focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Creator / Maker Name</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Li Yang"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 font-medium text-gray-900 focus:outline-hidden focus:border-[#af101a]"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved successfully to Firebase Firestore!</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleFirebaseSave}
                className="flex-1 py-3 bg-[#af101a] hover:bg-red-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
