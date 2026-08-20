import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ColorOption, MaterialType, KeycapCustomConfig, CartItem, Product } from '../types';
import { DEFAULT_COLORS } from '../data/mockData';
import { 
  Keyboard as KeyboardIcon, 
  Smile, 
  Type, 
  Upload, 
  Volume2, 
  Trash2, 
  CheckCircle2, 
  ShoppingBag, 
  Sparkles, 
  Minus, 
  Plus,
  Layers,
  Palette,
  ArrowRight
} from 'lucide-react';

interface KeyState {
  id: number;
  type: 'letter' | 'emoji' | 'image';
  value: string;
  imageUrl?: string;
  color: ColorOption;
}

const POPULAR_EMOJIS = [
  '🌶️', '🔥', '⚡', '👑', '⭐', '🚀', '💀', '❤️',
  '🎮', '⌨️', '🕹️', '👾', '🤖', '🎯', '🏆', '💎',
  '🐱', '🌸', '🍕', '🎲', '💯', '✨', '😎', '🥳'
];

const ALPHABET_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

interface KeyboardCustomizerProps {
  product?: Product;
  onAddedToCart?: () => void;
}

export const KeyboardCustomizer: React.FC<KeyboardCustomizerProps> = ({ product, onAddedToCart }) => {
  const { addToCart, showToast, setIsCartOpen } = useApp();

  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'alphabet' | 'emoji' | 'image'>('alphabet');
  const [switchType, setSwitchType] = useState<'blue' | 'red' | 'brown'>('blue');
  const [baseCaseColor, setBaseCaseColor] = useState<ColorOption>(DEFAULT_COLORS[1]); // Matte Black
  const [fontStyle, setFontStyle] = useState<'sans' | 'mono' | 'pixel'>('sans');
  const [wordInput, setWordInput] = useState('CABAI');
  const [quantity, setQuantity] = useState<number>(1);
  const [isPressedKey, setIsPressedKey] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 5-Key Keypad clicker default state
  const [keys, setKeys] = useState<KeyState[]>([
    { id: 0, type: 'letter', value: 'C', color: DEFAULT_COLORS[0] }, // Chili Red
    { id: 1, type: 'letter', value: 'A', color: DEFAULT_COLORS[2] }, // Chalk White
    { id: 2, type: 'letter', value: 'B', color: DEFAULT_COLORS[0] }, // Chili Red
    { id: 3, type: 'letter', value: 'A', color: DEFAULT_COLORS[2] }, // Chalk White
    { id: 4, type: 'letter', value: 'I', color: DEFAULT_COLORS[0] }, // Chili Red
  ]);

  const basePrice = product?.price || 12.00;
  const totalPrice = basePrice * quantity;

  // Mechanical Switch Sound Synthesizer
  const playSwitchSound = (type: 'blue' | 'red' | 'brown') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'blue') {
        // High pitched sharp click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'brown') {
        // Subtle tactile thud
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else {
        // Red Linear smooth quiet pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch (e) {}
  };

  const handleKeyClick = (index: number) => {
    setActiveKeyIndex(index);
    setIsPressedKey(index);
    playSwitchSound(switchType);
    setTimeout(() => setIsPressedKey(null), 150);
  };

  // Apply Letter to current key
  const handleSelectLetter = (char: string) => {
    setKeys(prev => prev.map((k, idx) => idx === activeKeyIndex ? { ...k, type: 'letter', value: char, imageUrl: undefined } : k));
    playSwitchSound(switchType);
  };

  // Word Autofill across all 5 keys
  const handleApplyWord = (word: string) => {
    setWordInput(word);
    const chars = word.toUpperCase().split('').slice(0, 5);
    setKeys(prev => prev.map((k, idx) => ({
      ...k,
      type: 'letter',
      value: chars[idx] || ' ',
      imageUrl: undefined
    })));
  };

  // Apply Emoji to current key
  const handleSelectEmoji = (emoji: string) => {
    setKeys(prev => prev.map((k, idx) => idx === activeKeyIndex ? { ...k, type: 'emoji', value: emoji, imageUrl: undefined } : k));
    playSwitchSound(switchType);
  };

  // Apply Image to current key
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setKeys(prev => prev.map((k, idx) => idx === activeKeyIndex ? { ...k, type: 'image', value: 'IMG', imageUrl: dataUrl } : k));
        showToast(`Image applied to Keycap #${activeKeyIndex + 1}! ⌨️`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Set Keycap Color
  const handleSetKeyColor = (color: ColorOption) => {
    setKeys(prev => prev.map((k, idx) => idx === activeKeyIndex ? { ...k, color } : k));
  };

  // Add Custom Keyboard to Cart
  const handleAddToCart = () => {
    const keySummary = keys.map((k, i) => `#${i + 1}:${k.type === 'image' ? 'Image' : k.value}`).join(' | ');
    const desc = `Custom 5-Key Mechanical Clicker (${switchType.toUpperCase()} switch, ${baseCaseColor.name} base) with custom keycaps [${keySummary}].`;

    const targetProduct: Product = product || {
      id: `custom-keyboard-${Date.now()}`,
      name: 'Cabai 5-Key Custom Fidget Mechanical Keyboard Clicker',
      category: 'keychains',
      price: basePrice,
      rating: 5.0,
      reviewsCount: 4,
      materials: ['PLA' as MaterialType],
      colors: [baseCaseColor, keys[0].color],
      inStock: true,
      stockQuantity: 99,
      tags: ['Keyboard', 'Custom Keycaps', 'Fidget Clicker', 'PLA'],
      description: desc,
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'],
      specifications: {
        material: 'PLA',
        weight: '45g',
        dimensions: '90mm x 25mm x 28mm',
        printTime: '1.2 hrs',
        layerHeight: '0.16mm',
        madeToOrder: true
      }
    };

    addToCart(
      targetProduct,
      baseCaseColor,
      'PLA',
      quantity,
      `Switches: ${switchType} | Keys: ${keySummary}`
    );

    showToast(`Custom Mechanical Keyboard added to cart! (RM ${totalPrice.toFixed(2)}) ⌨️`, 'success');
    setIsCartOpen(true);
    onAddedToCart?.();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 animate-fadeIn">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-[#af101a] text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Keyboard Studio</span>
          </div>
          <h2 className="font-heading font-black text-2xl text-gray-900">
            Custom Mechanical Keyboard &amp; Keycap Studio
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Click any keycap to customize with custom letters, emojis, or uploaded pictures! Test realistic clicky sound feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-bold">Base Price</div>
            <div className="font-heading font-black text-2xl text-[#af101a]">
              RM {basePrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE 3D MECHANICAL KEYBOARD VISUALIZER */}
      <div className="relative bg-gradient-to-b from-gray-900 via-[#1a1c1c] to-black rounded-3xl p-8 sm:p-12 text-white border border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center space-y-6">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 opacity-20 bg-radial from-red-600 via-transparent to-transparent pointer-events-none" />

        {/* Audio switch status bar */}
        <div className="relative z-10 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Sound Profile: <strong className="text-amber-300 capitalize">{switchType} Switch Click</strong> (Click keycaps to test!)</span>
        </div>

        {/* The 3D Keyboard Base Casing */}
        <div 
          className="relative z-10 p-4 sm:p-6 rounded-2xl shadow-2xl border-4 transition-all duration-300 flex items-center gap-3 sm:gap-4"
          style={{ 
            backgroundColor: baseCaseColor.hex,
            borderColor: 'rgba(255,255,255,0.15)',
            boxShadow: `0 20px 40px -10px ${baseCaseColor.hex}40, 0 10px 20px rgba(0,0,0,0.8)`
          }}
        >
          {keys.map((key, index) => {
            const isSelected = activeKeyIndex === index;
            const isPressed = isPressedKey === index;

            return (
              <button
                key={key.id}
                onClick={() => handleKeyClick(index)}
                className={`relative group w-14 h-16 sm:w-18 sm:h-20 rounded-xl transition-all duration-100 flex flex-col items-center justify-center cursor-pointer select-none ${
                  isPressed ? 'translate-y-2 scale-95 shadow-inner' : 'hover:-translate-y-1 shadow-lg'
                } ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black' : ''}`}
                style={{
                  backgroundColor: key.color.hex,
                  boxShadow: isPressed 
                    ? 'inset 0 4px 8px rgba(0,0,0,0.6)' 
                    : '0 8px 0 rgba(0,0,0,0.4), 0 12px 16px rgba(0,0,0,0.5)'
                }}
                title={`Keycap #${index + 1}: Click to customize`}
              >
                {/* 3D Keycap Top Face Relief */}
                <div className="absolute inset-1 rounded-lg border-t border-l border-white/40 pointer-events-none" />

                {/* Keycap Content */}
                {key.type === 'image' && key.imageUrl ? (
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-md overflow-hidden bg-black/40 p-0.5 border border-white/30">
                    <img src={key.imageUrl} alt={`Key ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
                  </div>
                ) : key.type === 'emoji' ? (
                  <span className="text-2xl sm:text-3xl filter drop-shadow-md">
                    {key.value}
                  </span>
                ) : (
                  <span className={`text-xl sm:text-2xl font-black text-gray-900 drop-shadow-sm ${
                    fontStyle === 'mono' ? 'font-mono' : fontStyle === 'pixel' ? 'tracking-widest font-serif' : 'font-sans'
                  }`}>
                    {key.value}
                  </span>
                )}

                {/* Key index tiny indicator */}
                <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-gray-800/60 pointer-events-none">
                  #{index + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Key Status Pill */}
        <div className="relative z-10 text-xs text-gray-400 flex items-center gap-2">
          <span>Editing Keycap:</span>
          <span className="px-2 py-0.5 bg-amber-400 text-black font-extrabold rounded-md">
            Key #{activeKeyIndex + 1} ({keys[activeKeyIndex].type.toUpperCase()}: {keys[activeKeyIndex].type === 'image' ? 'Uploaded Image' : keys[activeKeyIndex].value})
          </span>
        </div>
      </div>

      {/* CUSTOMIZATION CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Keycap Modes (Alphabet, Emoji, Image) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mode Selector Tabs */}
          <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveTab('alphabet')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'alphabet' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="w-4 h-4 text-[#af101a]" />
              <span>Alphabet / 字母</span>
            </button>

            <button
              onClick={() => setActiveTab('emoji')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'emoji' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Emoji / 表情</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'image' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Import Image / 图片</span>
            </button>
          </div>

          {/* TAB 1: ALPHABET & WORD AUTOFILL */}
          {activeTab === 'alphabet' && (
            <div className="space-y-4">
              {/* Word auto distributor */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Quick Word Auto-Fill across all 5 Keys (快速填充单词)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wordInput}
                    onChange={(e) => handleApplyWord(e.target.value)}
                    placeholder="e.g. CABAI, GAMER, LOVE, BOSS"
                    maxLength={5}
                    className="flex-1 px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-sm font-black tracking-widest text-gray-900 uppercase focus:border-[#af101a] outline-hidden"
                  />
                  <div className="flex gap-1">
                    {['CABAI', 'GAMER', 'CHILI', 'HKY'].map(preset => (
                      <button
                        key={preset}
                        onClick={() => handleApplyWord(preset)}
                        className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Single Letter Quick Pick Grid */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Letter for Key #{activeKeyIndex + 1}:
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                  {ALPHABET_KEYS.map((char) => (
                    <button
                      key={char}
                      onClick={() => handleSelectLetter(char)}
                      className={`h-10 rounded-xl font-black text-sm transition-transform cursor-pointer flex items-center justify-center ${
                        keys[activeKeyIndex].value === char && keys[activeKeyIndex].type === 'letter'
                          ? 'bg-[#af101a] text-white shadow-sm scale-105'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMOJI PICKER */}
          {activeTab === 'emoji' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-700">
                Click Emoji to assign to Keycap #{activeKeyIndex + 1}:
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5">
                {POPULAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSelectEmoji(emoji)}
                    className={`h-12 rounded-2xl text-2xl transition-transform hover:scale-115 flex items-center justify-center cursor-pointer ${
                      keys[activeKeyIndex].value === emoji && keys[activeKeyIndex].type === 'emoji'
                        ? 'bg-amber-100 border-2 border-amber-500 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT IMAGE */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">
                  Import Custom Image / Decal for Keycap #{activeKeyIndex + 1} (导入图片)
                </label>
                {keys[activeKeyIndex].type === 'image' && (
                  <button
                    onClick={() => handleSelectLetter('C')}
                    className="text-xs text-red-600 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset to Letter</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#af101a] bg-gray-50 hover:bg-red-50/20 rounded-2xl p-6 text-center cursor-pointer space-y-2 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-gray-200 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#af101a]" />
                </div>
                <div className="font-bold text-sm text-gray-800">
                  Click to browse image for Key #{activeKeyIndex + 1}
                </div>
                <div className="text-xs text-gray-400">
                  Auto scales to fit 3D keycap surface
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: Switch Type, Colors & Purchase (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Switch Type Selection */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <label className="block text-xs font-bold text-gray-700">
              Mechanical Switch Sound Profile (轴体类型)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'blue', name: 'Blue 蓝轴', desc: 'Clicky & Loud' },
                { id: 'brown', name: 'Brown 茶轴', desc: 'Tactile Bump' },
                { id: 'red', name: 'Red 红轴', desc: 'Linear Silent' }
              ].map(sw => (
                <button
                  key={sw.id}
                  onClick={() => {
                    setSwitchType(sw.id as any);
                    playSwitchSound(sw.id as any);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    switchType === sw.id 
                      ? 'bg-white border-[#af101a] text-[#af101a] shadow-xs ring-2 ring-[#af101a]/20' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-extrabold">{sw.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{sw.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
            {/* Base Case Color */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Keyboard Base Casing Color (底座颜色)
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setBaseCaseColor(c)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      baseCaseColor.name === c.name ? 'border-[#af101a] scale-110 shadow-sm' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Selected Keycap Color */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Keycap #{activeKeyIndex + 1} Color (当前按键颜色)
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleSetKeyColor(c)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      keys[activeKeyIndex].color.name === c.name ? 'border-[#af101a] scale-110 shadow-sm' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-200 text-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-gray-200 text-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-heading font-black text-2xl text-[#af101a]">
                  RM {totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gradient-to-r from-[#af101a] to-[#8d0a12] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Custom Keyboard to Cart (RM {totalPrice.toFixed(2)})</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
