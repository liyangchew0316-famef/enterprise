import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialType, ColorOption, CustomPrintQuote, ChiliDrawing } from '../types';
import { DEFAULT_COLORS } from '../data/mockData';
import { ChiliDrawCanvas } from '../components/ChiliDrawCanvas';
import { 
  fetchChiliDrawingsFromFirestore, 
  saveChiliDrawingToFirestore, 
  deleteChiliDrawingFromFirestore,
  likeChiliDrawingInFirestore 
} from '../lib/firestoreService';
import { uploadCustomDesignToStorage } from '../lib/storageService';
import { 
  Sparkles, 
  Layers, 
  Sliders, 
  Clock, 
  Zap, 
  Heart, 
  Trash2, 
  ArrowRight, 
  Paintbrush, 
  Flame, 
  CheckCircle2, 
  Database,
  Cloud,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const CustomPrintView: React.FC = () => {
  const { addCustomPrintToCart, showToast } = useApp();

  // Active Drawing on Stage
  const [currentCanvasImage, setCurrentCanvasImage] = useState<string | null>(null);
  const [designTitle, setDesignTitle] = useState<string>('My Custom Spicy Cabai');

  // 3D Print Slicing & Material Specs
  const [material, setMaterial] = useState<MaterialType>('PLA');
  const [color, setColor] = useState<ColorOption>(DEFAULT_COLORS[0]);
  const [infillPercent, setInfillPercent] = useState<number>(20);
  const [layerHeight, setLayerHeight] = useState<'0.12' | '0.20' | '0.28'>('0.20');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Firebase Gallery State
  const [savedDrawings, setSavedDrawings] = useState<ChiliDrawing[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'canvas' | 'gallery'>('canvas');

  // Fixed physical geometry assumptions for Cabai Keyring (~18.5 cm³ baseline)
  const baseVolumeCm3 = 18.5;
  const scaledVolume = baseVolumeCm3 * Math.pow(scalePercent / 100, 3);
  const density = material === 'PLA' ? 1.24 : material === 'PETG' ? 1.27 : 1.21;
  const infillFactor = 0.35 + (infillPercent / 100) * 0.65;
  const estimatedWeightGrams = Math.round(scaledVolume * density * infillFactor);

  // Print Time Calculation
  const heightMultiplier = layerHeight === '0.12' ? 1.6 : layerHeight === '0.20' ? 1.0 : 0.75;
  const rawHours = (scaledVolume * 0.08 * heightMultiplier) + 0.35;
  const estimatedHours = Number(rawHours.toFixed(1));

  // Pricing formula
  const materialCostPerGram = material === 'PLA' ? 0.12 : material === 'PETG' ? 0.16 : 0.22;
  const machineRatePerHour = 3.50; // RM 3.50 per print hour
  const setupFee = 4.00; // Flat RM 4 setup

  const unitMaterialCost = estimatedWeightGrams * materialCostPerGram;
  const unitMachineCost = estimatedHours * machineRatePerHour;
  const calculatedUnitPrice = Math.max(9.90, Number((unitMaterialCost + unitMachineCost + setupFee).toFixed(2)));
  const totalQuotePrice = Number((calculatedUnitPrice * quantity).toFixed(2));

  // Fetch saved drawings from Firebase on mount
  const loadGalleryFromFirestore = async () => {
    setIsLoadingGallery(true);
    try {
      const docs = await fetchChiliDrawingsFromFirestore();
      setSavedDrawings(docs);
    } catch (err) {
      console.error('Failed to load gallery from Firebase:', err);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadGalleryFromFirestore();
  }, []);

  // Save to Firebase Handler
  const handleSaveToFirebase = async (drawingData: {
    title: string;
    creatorName: string;
    imageData: string;
    baseTemplate: string;
  }): Promise<boolean> => {
    const drawingId = `chili-${Date.now()}`;
    
    // Upload image to Firebase Storage for durable hosting
    let storageDownloadUrl = drawingData.imageData;
    try {
      if (drawingData.imageData.startsWith('data:')) {
        storageDownloadUrl = await uploadCustomDesignToStorage(drawingData.imageData, 'gallery_chili');
      }
    } catch (err) {
      console.warn('Could not upload to Firebase Storage, saving raw dataURL:', err);
    }

    const newDrawing: ChiliDrawing = {
      id: drawingId,
      title: drawingData.title,
      creatorName: drawingData.creatorName,
      imageData: storageDownloadUrl,
      customDesignUrl: storageDownloadUrl.startsWith('http') ? storageDownloadUrl : undefined,
      baseChiliTemplate: drawingData.baseTemplate,
      material,
      colorName: color.name,
      colorHex: color.hex,
      scalePercent,
      infillPercent,
      specialInstructions,
      estimatedPrice: totalQuotePrice,
      createdAt: new Date().toISOString(),
      likesCount: 1
    };

    const ok = await saveChiliDrawingToFirestore(newDrawing);
    if (ok) {
      setSavedDrawings(prev => [newDrawing, ...prev]);
      setCurrentCanvasImage(storageDownloadUrl);
      setDesignTitle(drawingData.title);
      showToast(`Chili "${drawingData.title}" saved to Firebase!`, 'success');
      return true;
    } else {
      showToast('Failed to save to Firebase. Please try again.', 'error');
      return false;
    }
  };

  // Add Custom Print to Cart (instant local addition; upload is deferred to Pay / Place Order)
  const handleAddToCart = (imgData?: string, customTitle?: string) => {
    const imagePayload = imgData || currentCanvasImage;
    const finalTitle = customTitle || designTitle;

    const quote: CustomPrintQuote = {
      fileName: `${finalTitle.replace(/\s+/g, '_')}.png`,
      designTitle: finalTitle,
      drawingImage: imagePayload || undefined,
      material,
      color,
      infillPercent,
      layerHeight,
      quantity,
      scalePercent,
      specialInstructions,
      volumeCm3: Number(scaledVolume.toFixed(1)),
      weightGrams: estimatedWeightGrams,
      estimatedHours,
      calculatedPrice: totalQuotePrice
    };

    addCustomPrintToCart(quote);
  };

  // Like a drawing
  const handleLikeDrawing = async (id: string, currentLikes: number = 0) => {
    const updated = await likeChiliDrawingInFirestore(id, currentLikes);
    setSavedDrawings(prev => prev.map(d => d.id === id ? { ...d, likesCount: updated } : d));
  };

  // Delete a drawing
  const handleDeleteDrawing = async (id: string) => {
    if (!window.confirm('Delete this design from Firebase?')) return;
    const ok = await deleteChiliDrawingFromFirestore(id);
    if (ok) {
      setSavedDrawings(prev => prev.filter(d => d.id !== id));
      showToast('Design deleted from Firebase.', 'info');
    }
  };

  // Load drawing into canvas
  const handleLoadDrawingIntoCanvas = (drawing: ChiliDrawing) => {
    setCurrentCanvasImage(drawing.imageData);
    setDesignTitle(drawing.title);
    if (drawing.material) setMaterial(drawing.material);
    setActiveTab('canvas');
    showToast(`Loaded "${drawing.title}" into canvas editor!`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a1c1c] via-[#2a2c2e] to-[#1a1c1c] text-white p-8 sm:p-10 rounded-3xl border-2 border-red-900/50 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 text-red-300 text-xs font-extrabold border border-red-800 shadow-inner">
            <Flame className="w-3.5 h-3.5 text-[#af101a] animate-pulse" />
            <span>CUSTOM CHILI DRAWING LAB & 3D MAKER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'canvas'
                  ? 'bg-[#af101a] text-white shadow-lg shadow-red-950/50'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Draw Studio</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('gallery');
                loadGalleryFromFirestore();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-[#af101a] text-white shadow-lg shadow-red-950/50'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>Firebase Cloud Gallery ({savedDrawings.length})</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Draw Your Own 3D Chili Keychain 🌶️
          </h1>
          <p className="text-gray-300 text-sm max-w-2xl mt-2">
            Draw, stamp 3D emojis, add embossed text labels directly on top of the signature Cabai pepper, and save your custom designs directly to Firebase Firestore for 3D printing!
          </p>
        </div>

      </div>

      {activeTab === 'canvas' ? (
        /* Main Studio Grid: Left Canvas + Slicing Specs (8 cols), Right Sticky Quote Card (4 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STEP 1: Interactive Canvas */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center shadow-xs">1</span>
                  <div>
                    <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                      Chili Canvas & 3D Drawing Pad
                    </h2>
                    <p className="text-xs text-gray-500">Pick brushes, stickers, or text to customize your pepper.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Database className="w-3.5 h-3.5" />
                  <span>Firestore Sync Ready</span>
                </div>
              </div>

              {/* Canvas Component */}
              <ChiliDrawCanvas
                key={currentCanvasImage || 'default-canvas'}
                initialImageData={currentCanvasImage || undefined}
                onCanvasChange={(img) => setCurrentCanvasImage(img)}
                onSaveToFirebase={handleSaveToFirebase}
                onOrderPrint={(img, title) => {
                  setCurrentCanvasImage(img);
                  setDesignTitle(title);
                  handleAddToCart(img, title);
                }}
              />
            </div>

            {/* STEP 2: Choose 3D Print Material */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center shadow-xs">2</span>
                <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                  3D Print Material: <strong className="text-[#af101a]">100% Eco PLA+</strong>
                </h2>
              </div>

              <div className="p-4 rounded-2xl border border-[#af101a] bg-red-50/50 ring-2 ring-red-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-[#1a1c1c] flex items-center gap-2">
                    <span>Eco PLA+ (Food-Safe &amp; Rigid Decor)</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#af101a] text-white text-[10px] font-black uppercase">Selected</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 max-w-xl">
                    Ultra-smooth surface finish with zero warping, perfectly tuned for vivid color canvas drawings, keychain loops, and crisp dimensional relief.
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] font-bold text-[#af101a]">RM 0.12 / gram</div>
                  <div className="text-[10px] text-gray-500">Pure Bio-Based PLA</div>
                </div>
              </div>
            </div>

            {/* STEP 3: Base Filament Color */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center shadow-xs">3</span>
                <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                  Base Filament Color: <strong className="text-[#af101a]">{color.name}</strong>
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {DEFAULT_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      color.name === c.name
                        ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: Infill Density & Layer Resolution */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center shadow-xs">4</span>
                <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                  Print Resolution & Infill Density
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Infill Density Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Internal Infill Density:</span>
                    <span className="text-[#af101a] font-extrabold">{infillPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={infillPercent}
                    onChange={(e) => setInfillPercent(Number(e.target.value))}
                    className="w-full accent-[#af101a]"
                  />
                  <div className="text-[11px] text-gray-500">
                    20% standard for keychains; 50%+ for ultra-solid feel.
                  </div>
                </div>

                {/* Layer Resolution */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">
                    Layer Resolution Precision
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '0.12', name: '0.12mm', label: 'Ultra Fine' },
                      { id: '0.20', name: '0.20mm', label: 'Standard' },
                      { id: '0.28', name: '0.28mm', label: 'Draft Speed' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setLayerHeight(opt.id as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          layerHeight === opt.id
                            ? 'bg-[#1a1c1c] text-white border-[#1a1c1c] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div>{opt.name}</div>
                        <div className="text-[10px] opacity-70">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Model Scaling Slider */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Physical Scale Factor:</span>
                  <span className="text-[#af101a] font-extrabold">{scalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="160"
                  step="10"
                  value={scalePercent}
                  onChange={(e) => setScalePercent(Number(e.target.value))}
                  className="w-full accent-[#af101a]"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Additional Maker Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Include dual-color loop ring or smooth surface ironing..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Sticky Quote Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-gray-200 shadow-xl space-y-5">
              
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-base text-[#1a1c1c] uppercase tracking-wider">
                  Custom Print Quote
                </h3>
                <span className="text-xs bg-red-100 text-[#af101a] font-extrabold px-2.5 py-0.5 rounded-full">
                  Live Calculator
                </span>
              </div>

              {/* Thumbnail of Current Drawing */}
              {currentCanvasImage ? (
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-900 p-1 shadow-inner">
                  <img 
                    src={currentCanvasImage} 
                    alt="Custom Drawing Preview" 
                    className="w-full h-40 object-contain rounded-xl"
                  />
                  <div className="text-center text-[11px] text-gray-400 py-1 font-bold truncate px-2">
                    {designTitle}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-400">
                  Draw on the canvas to generate custom preview
                </div>
              )}

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Design:</span>
                  <span className="font-bold text-gray-900 truncate max-w-[160px]">{designTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material & Color:</span>
                  <span className="font-bold text-gray-900">{material} ({color.name})</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Part Weight:</span>
                  <span className="font-bold text-gray-900">~{estimatedWeightGrams} grams</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Print Time:</span>
                  <span className="font-bold text-gray-900">~{estimatedHours} hours</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Filament Material Cost</span>
                  <span>RM {(estimatedWeightGrams * materialCostPerGram).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Studio Machine Runtime</span>
                  <span>RM {(estimatedHours * machineRatePerHour).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Studio Setup Fee</span>
                  <span>RM {setupFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-400">Total Custom Quote Price</div>
                <div className="font-heading font-extrabold text-3xl text-[#af101a]">
                  RM {totalQuotePrice.toFixed(2)}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Crafted at Subang Jaya Studio • SST 6% included
                </div>
              </div>

              <button
                onClick={() => handleAddToCart()}
                className="w-full py-4 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-950/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Add Custom Chili to Cart</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

        </div>
      ) : (
        /* Firebase Cloud Gallery View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Firebase Cloud Creations Gallery
              </h2>
              <p className="text-xs text-gray-500">
                Browse, like, or load custom 3D chili designs saved by makers into Firestore.
              </p>
            </div>

            <button
              onClick={loadGalleryFromFirestore}
              disabled={isLoadingGallery}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGallery ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoadingGallery ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#af101a] animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-bold">Connecting to Firebase Firestore...</p>
            </div>
          ) : savedDrawings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#af101a] flex items-center justify-center mx-auto">
                <Paintbrush className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-gray-900">No Chili Creations Saved Yet</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Be the first maker to draw on the chili image and save your custom artwork to Firebase!
              </p>
              <button
                onClick={() => setActiveTab('canvas')}
                className="px-5 py-2.5 bg-[#af101a] hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                Open Drawing Canvas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDrawings.map((drawing) => (
                <div 
                  key={drawing.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col group"
                >
                  {/* Image Display */}
                  <div className="relative h-60 bg-[#181a1b] p-2 flex items-center justify-center overflow-hidden">
                    <img 
                      src={drawing.imageData} 
                      alt={drawing.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-gray-700">
                      {drawing.material || 'PLA+'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>By {drawing.creatorName || 'Anonymous Maker'}</span>
                        <span>{new Date(drawing.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-base text-gray-900 group-hover:text-[#af101a] transition-colors">
                        {drawing.title}
                      </h3>
                      <div className="text-xs text-gray-500 mt-1">
                        Color: <span className="font-bold text-gray-800">{drawing.colorName || 'Chili Red'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLikeDrawing(drawing.id, drawing.likesCount || 0)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-[#af101a] text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#af101a]" />
                        <span>{drawing.likesCount || 0}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteDrawing(drawing.id)}
                          title="Delete from Firebase"
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleLoadDrawingIntoCanvas(drawing)}
                          className="px-3 py-1.5 rounded-lg bg-[#1a1c1c] text-white hover:bg-black text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Paintbrush className="w-3.5 h-3.5" />
                          <span>Load & Edit</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
