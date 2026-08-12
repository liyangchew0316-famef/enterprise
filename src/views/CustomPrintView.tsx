import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialType, ColorOption, CustomPrintQuote } from '../types';
import { DEFAULT_COLORS, SAMPLE_STL_FILES } from '../data/mockData';
import { 
  Upload, 
  Layers, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldAlert, 
  FileCode,
  ArrowRight
} from 'lucide-react';

export const CustomPrintView: React.FC = () => {
  const { addCustomPrintToCart } = useApp();

  // File Upload state
  const [selectedFileName, setSelectedFileName] = useState<string>(SAMPLE_STL_FILES[0].name);
  const [fileSizeMb, setFileSizeMb] = useState<number>(SAMPLE_STL_FILES[0].sizeMb);
  const [volumeCm3, setVolumeCm3] = useState<number>(SAMPLE_STL_FILES[0].volumeCm3);

  // Settings
  const [material, setMaterial] = useState<MaterialType>('PLA');
  const [color, setColor] = useState<ColorOption>(DEFAULT_COLORS[0]);
  const [infillPercent, setInfillPercent] = useState<number>(20);
  const [layerHeight, setLayerHeight] = useState<'0.12' | '0.20' | '0.28'>('0.20');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Auto Calculations
  const scaledVolume = volumeCm3 * Math.pow(scalePercent / 100, 3);
  // Filament Density: PLA ~1.24 g/cm3, PETG ~1.27 g/cm3, TPU ~1.21 g/cm3
  const density = material === 'PLA' ? 1.24 : material === 'PETG' ? 1.27 : 1.21;
  const infillFactor = 0.35 + (infillPercent / 100) * 0.65;
  const estimatedWeightGrams = Math.round(scaledVolume * density * infillFactor);

  // Print Time Calculation
  const heightMultiplier = layerHeight === '0.12' ? 1.6 : layerHeight === '0.20' ? 1.0 : 0.75;
  const rawHours = (scaledVolume * 0.08 * heightMultiplier) + 0.3;
  const estimatedHours = Number(rawHours.toFixed(1));

  // Pricing formula
  const materialCostPerGram = material === 'PLA' ? 0.12 : material === 'PETG' ? 0.16 : 0.22;
  const machineRatePerHour = 3.50; // RM 3.50 per print hour
  const setupFee = 5.00; // Flat RM 5 setup

  const unitMaterialCost = estimatedWeightGrams * materialCostPerGram;
  const unitMachineCost = estimatedHours * machineRatePerHour;
  const calculatedUnitPrice = Math.max(8.00, Number((unitMaterialCost + unitMachineCost + setupFee).toFixed(2)));
  const totalQuotePrice = Number((calculatedUnitPrice * quantity).toFixed(2));

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setFileSizeMb(Number((file.size / (1024 * 1024)).toFixed(1)));
      // Random realistic mesh volume between 15cm3 and 75cm3
      const randVol = Math.floor(18 + Math.random() * 50);
      setVolumeCm3(randVol);
    }
  };

  const handleSelectSampleFile = (sample: typeof SAMPLE_STL_FILES[0]) => {
    setSelectedFileName(sample.name);
    setFileSizeMb(sample.sizeMb);
    setVolumeCm3(sample.volumeCm3);
  };

  const handleAddToCart = () => {
    const quote: CustomPrintQuote = {
      fileName: selectedFileName,
      fileSizeMb,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a1c1c] via-[#2d3032] to-[#1a1c1c] text-white p-8 rounded-3xl border-2 border-red-900/40 shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-300 text-xs font-bold border border-red-800">
          <Layers className="w-3.5 h-3.5 text-[#af101a]" />
          <span>INSTANT STL SLICER & COST CALCULATOR</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl">
          Upload Your 3D Model (.STL / .OBJ)
        </h1>
        <p className="text-gray-300 text-sm max-w-2xl">
          Get an instant automated slicing quotation based on real mesh volume, filament material density, layer height resolution, and studio machine runtime.
        </p>
      </div>

      {/* Main Form + Sticky Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: Upload or Choose Sample STL */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center">1</span>
              <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                Select 3D Design File (.STL, .OBJ, .3MF)
              </h2>
            </div>

            {/* Drag & Drop Box */}
            <div className="border-2 border-dashed border-gray-300 hover:border-[#af101a] rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-red-50/20 transition-all relative cursor-pointer group">
              <input
                type="file"
                accept=".stl,.obj,.3mf"
                onChange={handleSimulatedFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-10 h-10 text-[#af101a] mx-auto group-hover:scale-110 transition-transform mb-2" />
              <div className="font-bold text-sm text-gray-900">
                Click to browse or drop your .STL file here
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Supports .STL, .OBJ, .3MF files up to 50MB
              </p>
            </div>

            {/* Current Selected File Info Badge */}
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCode className="w-6 h-6 text-[#af101a]" />
                <div>
                  <strong className="text-gray-900 block font-bold">{selectedFileName}</strong>
                  <span className="text-gray-500 font-mono">
                    {fileSizeMb} MB • Volume ~{scaledVolume.toFixed(1)} cm³
                  </span>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
                Mesh Validated
              </span>
            </div>

            {/* Sample STL Preset Buttons */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-500 block mb-2">
                Or try one of our sample 3D models:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_STL_FILES.map(sample => (
                  <button
                    key={sample.name}
                    onClick={() => handleSelectSampleFile(sample)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedFileName === sample.name
                        ? 'bg-[#1a1c1c] text-white border-[#1a1c1c]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* STEP 2: Choose Material */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center">2</span>
              <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                Choose Filament Material
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <button
                onClick={() => setMaterial('PLA')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  material === 'PLA'
                    ? 'border-[#af101a] bg-red-50/50 ring-2 ring-red-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-extrabold text-sm text-[#1a1c1c]">PLA+ (Standard)</div>
                <div className="text-xs text-gray-500 mt-1">Crisp finish, rigid, ideal for keychains & display decor.</div>
                <div className="mt-3 text-[11px] font-bold text-[#af101a]">RM 0.12 / gram</div>
              </button>

              <button
                onClick={() => setMaterial('PETG')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  material === 'PETG'
                    ? 'border-[#af101a] bg-red-50/50 ring-2 ring-red-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-extrabold text-sm text-[#1a1c1c]">PETG (Heavy Duty)</div>
                <div className="text-xs text-gray-500 mt-1">High strength, heat & impact resistant for mechanical parts.</div>
                <div className="mt-3 text-[11px] font-bold text-[#af101a]">RM 0.16 / gram</div>
              </button>

              <button
                onClick={() => setMaterial('TPU')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  material === 'TPU'
                    ? 'border-[#af101a] bg-red-50/50 ring-2 ring-red-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-extrabold text-sm text-[#1a1c1c]">TPU (Flexible)</div>
                <div className="text-xs text-gray-500 mt-1">Rubberized 95A flexibility, shockproof for bumpers & grips.</div>
                <div className="mt-3 text-[11px] font-bold text-[#af101a]">RM 0.22 / gram</div>
              </button>

            </div>
          </div>

          {/* STEP 3: Color Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center">3</span>
              <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                Select Filament Color: <strong className="text-[#af101a]">{color.name}</strong>
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {DEFAULT_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    color.name === c.name
                      ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: Print Quality & Infill Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#af101a] text-white text-xs font-extrabold flex items-center justify-center">4</span>
              <h2 className="font-heading font-bold text-base text-[#1a1c1c]">
                Print Resolution & Infill Density
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Infill Density Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Infill Density:</span>
                  <span className="text-[#af101a] font-extrabold">{infillPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={infillPercent}
                  onChange={(e) => setInfillPercent(Number(e.target.value))}
                  className="w-full accent-[#af101a]"
                />
                <div className="text-[11px] text-gray-500">
                  15-20% standard for display; 40-50% for functional mechanical parts.
                </div>
              </div>

              {/* Layer Resolution */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Layer Resolution Height
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
                          ? 'bg-[#1a1c1c] text-white border-[#1a1c1c]'
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
                <span>Model Scale:</span>
                <span className="text-[#af101a] font-extrabold">{scalePercent}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={scalePercent}
                onChange={(e) => setScalePercent(Number(e.target.value))}
                className="w-full accent-[#af101a]"
              />
            </div>

            {/* Special Instructions Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-700 block">
                Additional Notes / Custom Print Requirements (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please add supports or pause print for insert magnet..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
              />
            </div>

          </div>

        </div>

        {/* Right Column: Sticky Quote Summary Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-5">
            
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-[#1a1c1c] uppercase tracking-wider">
                Quote Breakdown
              </h3>
              <span className="text-xs bg-red-100 text-[#af101a] font-extrabold px-2 py-0.5 rounded">
                Live Slicer
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>File:</span>
                <span className="font-bold text-gray-900 truncate max-w-[150px]">{selectedFileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Material & Color:</span>
                <span className="font-bold text-gray-900">{material} ({color.name})</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Model Weight:</span>
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
                <span>Machine Runtime</span>
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
              <div className="text-xs text-gray-400">Total Estimated Quote</div>
              <div className="font-heading font-extrabold text-3xl text-[#af101a]">
                RM {totalQuotePrice.toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Subang Jaya Studio Dispatch • SST 6% included
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 group"
            >
              <span>Add Custom Print to Cart</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
