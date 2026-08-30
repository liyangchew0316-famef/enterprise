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
      <div className="bg-[#111113] text-white p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#AF101A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 text-[#FF4D5A] text-xs font-mono-code font-extrabold border border-red-900/60 shadow-inner">
            <Flame className="w-3.5 h-3.5 text-[#FF4D5A] animate-pulse" />
            <span>CUSTOM CHILI DRAWING LAB &amp; 3D MAKER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-[#AF101A] text-white shadow-lg shadow-red-950/50'
                  : 'bg-[#18181B] text-white/70 hover:bg-white/10 border border-white/10'
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
              className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#AF101A] text-white shadow-lg shadow-red-950/50'
                  : 'bg-[#18181B] text-white/70 hover:bg-white/10 border border-white/10'
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
          <p className="text-white/70 text-sm max-w-2xl mt-2 font-mono-code">
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
            <div className="bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#AF101A] text-white text-xs font-mono-code font-extrabold flex items-center justify-center shadow-xs">1</span>
                  <div>
                    <h2 className="font-heading font-bold text-base text-white">
                      Chili Canvas &amp; 3D Drawing Pad
                    </h2>
                    <p className="text-xs text-white/50 font-mono-code">Pick brushes, stickers, or text to customize your pepper.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-code font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80">
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
            <div className="bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#AF101A] text-white text-xs font-mono-code font-extrabold flex items-center justify-center shadow-xs">2</span>
                <h2 className="font-heading font-bold text-base text-white">
                  3D Print Material: <strong className="text-[#FF4D5A]">100% Eco PLA+</strong>
                </h2>
              </div>

              <div className="p-4 rounded-2xl border border-[#AF101A] bg-[#18181B] shadow-md flex items-center justify-between">
                <div>
                  <div className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Eco PLA+ (Food-Safe &amp; Rigid Decor)</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#AF101A] text-white text-[10px] font-mono-code font-black uppercase">Selected</span>
                  </div>
                  <div className="text-xs text-white/60 mt-1 max-w-xl font-mono-code">
                    Ultra-smooth surface finish with zero warping, perfectly tuned for vivid color canvas drawings, keychain loops, and crisp dimensional relief.
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono-code">
                  <div className="text-[11px] font-bold text-[#FF4D5A]">RM 0.12 / gram</div>
                  <div className="text-[10px] text-white/40">Pure Bio-Based PLA</div>
                </div>
              </div>
            </div>

            {/* STEP 3: Base Filament Color */}
            <div className="bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#AF101A] text-white text-xs font-mono-code font-extrabold flex items-center justify-center shadow-xs">3</span>
                <h2 className="font-heading font-bold text-base text-white">
                  Base Filament Color: <strong className="text-[#FF4D5A]">{color.name}</strong>
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {DEFAULT_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold border transition-all cursor-pointer ${
                      color.name === c.name
                        ? 'border-[#AF101A] bg-red-950/60 text-[#FF4D5A] shadow-md'
                        : 'border-white/10 bg-[#18181B] text-white/70 hover:border-white/20'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: Infill Density & Layer Resolution */}
            <div className="bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#AF101A] text-white text-xs font-mono-code font-extrabold flex items-center justify-center shadow-xs">4</span>
                <h2 className="font-heading font-bold text-base text-white">
                  Print Resolution &amp; Infill Density
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Infill Density Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono-code font-bold text-white">
                    <span>Internal Infill Density:</span>
                    <span className="text-[#FF4D5A] font-extrabold">{infillPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={infillPercent}
                    onChange={(e) => setInfillPercent(Number(e.target.value))}
                    className="w-full accent-[#AF101A]"
                  />
                  <div className="text-[11px] text-white/40 font-mono-code">
                    20% standard for keychains; 50%+ for ultra-solid feel.
                  </div>
                </div>

                {/* Layer Resolution */}
                <div className="space-y-2">
                  <label className="text-xs font-mono-code font-bold text-white block">
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
                        className={`py-2 px-2 rounded-xl text-xs font-mono-code font-bold border text-center transition-all cursor-pointer ${
                          layerHeight === opt.id
                            ? 'bg-[#AF101A] text-white border-[#AF101A] shadow-md'
                            : 'bg-[#18181B] text-white/70 border-white/10 hover:bg-white/10'
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
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs font-mono-code font-bold text-white">
                  <span>Physical Scale Factor:</span>
                  <span className="text-[#FF4D5A] font-extrabold">{scalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="160"
                  step="10"
                  value={scalePercent}
                  onChange={(e) => setScalePercent(Number(e.target.value))}
                  className="w-full accent-[#AF101A]"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-mono-code font-bold text-white block">
                  Additional Maker Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Include dual-color loop ring or smooth surface ironing..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-3 text-xs bg-[#18181B] border border-white/10 rounded-xl focus:outline-hidden focus:border-[#AF101A] font-mono-code text-white placeholder-white/30"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Sticky Quote Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#111113] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-base text-white uppercase tracking-wider">
                  Custom Print Quote
                </h3>
                <span className="text-xs bg-red-950/80 text-[#FF4D5A] font-mono-code font-extrabold px-2.5 py-0.5 rounded-full border border-red-800/60">
                  Live Calculator
                </span>
              </div>

              {/* Thumbnail of Current Drawing */}
              {currentCanvasImage ? (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/60 p-1 shadow-inner">
                  <img 
                    src={currentCanvasImage} 
                    alt="Custom Drawing Preview" 
                    className="w-full h-40 object-contain rounded-xl"
                  />
                  <div className="text-center text-[11px] text-white/50 py-1 font-mono-code font-bold truncate px-2">
                    {designTitle}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-[#18181B] p-4 text-center text-xs text-white/40 font-mono-code">
                  Draw on the canvas to generate custom preview
                </div>
              )}

              <div className="space-y-2 text-xs text-white/70 font-mono-code">
                <div className="flex justify-between">
                  <span>Design:</span>
                  <span className="font-bold text-white truncate max-w-[160px]">{designTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material &amp; Color:</span>
                  <span className="font-bold text-white">{material} ({color.name})</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Part Weight:</span>
                  <span className="font-bold text-white">~{estimatedWeightGrams} grams</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Print Time:</span>
                  <span className="font-bold text-white">~{estimatedHours} hours</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-white/70 font-mono-code">
                <div className="flex justify-between">
                  <span>Filament Material Cost</span>
                  <span className="text-white">RM {(estimatedWeightGrams * materialCostPerGram).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Studio Machine Runtime</span>
                  <span className="text-white">RM {(estimatedHours * machineRatePerHour).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Studio Setup Fee</span>
                  <span className="text-white">RM {setupFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold text-white">Quantity:</span>
                <div className="flex items-center border border-white/10 bg-[#18181B] rounded-lg overflow-hidden font-mono-code">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-white/70 hover:bg-white/10 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-white/70 hover:bg-white/10 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-xs text-white/40 font-mono-code">Total Custom Quote Price</div>
                <div className="font-heading font-extrabold text-3xl text-[#FF4D5A]">
                  RM {totalQuotePrice.toFixed(2)}
                </div>
                <div className="text-[10px] text-white/40 mt-1 font-mono-code">
                  Crafted at Subang Jaya Studio • SST 6% included
                </div>
              </div>

              <button
                onClick={() => handleAddToCart()}
                className="w-full py-4 bg-[#AF101A] hover:bg-[#E11D48] text-white font-mono-code font-extrabold text-sm rounded-2xl shadow-xl shadow-red-950/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
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
              <h2 className="font-heading font-extrabold text-xl text-white">
                Firebase Cloud Creations Gallery
              </h2>
              <p className="text-xs text-white/50 font-mono-code">
                Browse, like, or load custom 3D chili designs saved by makers into Firestore.
              </p>
            </div>

            <button
              onClick={loadGalleryFromFirestore}
              disabled={isLoadingGallery}
              className="px-3.5 py-2 bg-[#18181B] hover:bg-white/10 text-white text-xs font-mono-code font-bold rounded-xl flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGallery ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoadingGallery ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#FF4D5A] animate-spin mx-auto" />
              <p className="text-xs text-white/50 font-mono-code font-bold">Connecting to Firebase Firestore...</p>
            </div>
          ) : savedDrawings.length === 0 ? (
            <div className="bg-[#111113] p-12 rounded-3xl border border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800/60 text-[#FF4D5A] flex items-center justify-center mx-auto">
                <Paintbrush className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-base text-white">No Chili Creations Saved Yet</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto font-mono-code">
                Be the first maker to draw on the chili image and save your custom artwork to Firebase!
              </p>
              <button
                onClick={() => setActiveTab('canvas')}
                className="px-5 py-2.5 bg-[#AF101A] hover:bg-[#E11D48] text-white text-xs font-mono-code font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Open Drawing Canvas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDrawings.map((drawing) => (
                <div 
                  key={drawing.id}
                  className="bg-[#111113] rounded-3xl border border-white/10 shadow-xl hover:border-white/20 transition-all overflow-hidden flex flex-col group"
                >
                  {/* Image Display */}
                  <div className="relative h-60 bg-black/60 p-2 flex items-center justify-center overflow-hidden border-b border-white/10">
                    <img 
                      src={drawing.imageData} 
                      alt={drawing.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono-code font-extrabold px-2.5 py-1 rounded-full border border-white/10">
                      {drawing.material || 'PLA+'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/40 mb-1 font-mono-code">
                        <span>By {drawing.creatorName || 'Anonymous Maker'}</span>
                        <span>{new Date(drawing.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-white group-hover:text-[#FF4D5A] transition-colors">
                        {drawing.title}
                      </h3>
                      <div className="text-xs text-white/50 mt-1 font-mono-code">
                        Color: <span className="font-bold text-white">{drawing.colorName || 'Chili Red'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLikeDrawing(drawing.id, drawing.likesCount || 0)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-[#FF4D5A] text-xs font-mono-code font-bold hover:bg-red-900/60 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#FF4D5A]" />
                        <span>{drawing.likesCount || 0}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteDrawing(drawing.id)}
                          title="Delete from Firebase"
                          className="p-2 text-white/40 hover:text-[#FF4D5A] rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleLoadDrawingIntoCanvas(drawing)}
                          className="px-3 py-1.5 rounded-lg bg-[#18181B] text-white border border-white/10 hover:bg-white/10 text-xs font-mono-code font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Paintbrush className="w-3.5 h-3.5" />
                          <span>Load &amp; Edit</span>
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
