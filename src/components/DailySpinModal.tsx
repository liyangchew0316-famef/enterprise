import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SpinPrize } from '../types';
import { 
  X, 
  Sparkles, 
  Crown, 
  Gift, 
  Copy, 
  Check, 
  Clock, 
  Flame, 
  ArrowRight, 
  RotateCw,
  PartyPopper,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const SPIN_PRIZES: SpinPrize[] = [
  {
    id: 0,
    type: 'discount_10',
    label: '10% OFF',
    description: '10% OFF Storewide Promo Code',
    promoCode: 'CABAI10',
    discountType: 'percent',
    discountValue: 10,
    icon: '🥇',
    isWin: true,
    color: '#af101a',
    textColor: '#ffffff'
  },
  {
    id: 1,
    type: 'no_prize',
    label: '谢谢参与',
    description: 'Better luck tomorrow!',
    icon: '❌',
    isWin: false,
    color: '#262626',
    textColor: '#9ca3af'
  },
  {
    id: 2,
    type: 'discount_20',
    label: '20% OFF',
    description: 'Super Spicy 20% OFF Code',
    promoCode: 'SPICY20',
    discountType: 'percent',
    discountValue: 20,
    icon: '🥇',
    isWin: true,
    color: '#d97706',
    textColor: '#ffffff'
  },
  {
    id: 3,
    type: 'no_prize',
    label: '再接再厉',
    description: 'Keep your spirits up!',
    icon: '❌',
    isWin: false,
    color: '#1f2937',
    textColor: '#9ca3af'
  },
  {
    id: 4,
    type: 'rm5_off',
    label: 'RM5 OFF',
    description: 'RM5 Cash Voucher on Any Order',
    promoCode: 'LUCKYRM5',
    discountType: 'flat',
    discountValue: 5,
    icon: '🥈',
    isWin: true,
    color: '#059669',
    textColor: '#ffffff'
  },
  {
    id: 5,
    type: 'no_prize',
    label: '差一点点',
    description: 'Almost hit the jackpot!',
    icon: '❌',
    isWin: false,
    color: '#262626',
    textColor: '#9ca3af'
  },
  {
    id: 6,
    type: 'no_prize',
    label: '🌶️ 辣味不足',
    description: 'Need more chili power!',
    icon: '❌',
    isWin: false,
    color: '#3b070c',
    textColor: '#fca5a5'
  },
  {
    id: 7,
    type: 'no_prize',
    label: '明天再来',
    description: 'Spin refreshes at midnight',
    icon: '❌',
    isWin: false,
    color: '#1f2937',
    textColor: '#9ca3af'
  },
  {
    id: 8,
    type: 'no_prize',
    label: '运气充能中',
    description: 'Charging your lucky aura',
    icon: '❌',
    isWin: false,
    color: '#262626',
    textColor: '#9ca3af'
  },
  {
    id: 9,
    type: 'no_prize',
    label: '空空如也',
    description: 'Try again tomorrow',
    icon: '❌',
    isWin: false,
    color: '#1f2937',
    textColor: '#9ca3af'
  }
];

interface DailySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailySpinModal: React.FC<DailySpinModalProps> = ({ isOpen, onClose }) => {
  const { applyPromoCode, showToast, setCurrentView } = useApp();
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [todayPrize, setTodayPrize] = useState<SpinPrize | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeLeftUntilMidnight, setTimeLeftUntilMidnight] = useState('');
  const [showWinCelebration, setShowWinCelebration] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRotationRef = useRef(0);

  const getTodayDateKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Check spin status for today
  useEffect(() => {
    const todayKey = getTodayDateKey();
    const savedDate = localStorage.getItem('cabai_daily_spin_date');
    const savedPrizeId = localStorage.getItem('cabai_daily_spin_prize');

    if (savedDate === todayKey) {
      setHasSpunToday(true);
      if (savedPrizeId !== null) {
        const found = SPIN_PRIZES.find(p => p.id === parseInt(savedPrizeId, 10));
        if (found) setTodayPrize(found);
      }
    } else {
      setHasSpunToday(false);
      setTodayPrize(null);
    }
  }, [isOpen]);

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeLeftUntilMidnight(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio click tick
  const playTickerSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  };

  // Draw Lucky Wheel onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;
    const totalSlices = SPIN_PRIZES.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    ctx.clearRect(0, 0, width, height);

    // Outer rim shadow & glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#af101a';
    ctx.stroke();
    ctx.restore();

    // Draw Slices with vibrant graphics, icons, and labels
    SPIN_PRIZES.forEach((prize, index) => {
      const startAngle = index * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();

      // Inner radial slice shading
      const midAngle = startAngle + sliceAngle / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(midAngle);

      // Slice inner badge background pill for picture/icon
      const iconDist = radius * 0.72;
      const textDist = radius * 0.38;

      // Draw decorative glowing picture container circle
      ctx.beginPath();
      ctx.arc(iconDist, 0, 16, 0, 2 * Math.PI);
      ctx.fillStyle = prize.isWin ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.4)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = prize.isWin ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      // Draw Prize Picture / Emoji Icon
      ctx.font = '18px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(prize.icon, iconDist, 1);

      // Draw Prize Title & Value
      ctx.save();
      ctx.fillStyle = prize.textColor;
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw shadow for text legibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(prize.label, textDist + 14, 0);
      ctx.restore();

      // Win indicator star
      if (prize.isWin) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ WIN', radius * 0.92, 0);
      }

      ctx.restore();
      ctx.restore();
    });

    // Outer decorative studs/lights
    for (let i = 0; i < totalSlices * 2; i++) {
      const angle = (i * Math.PI) / totalSlices;
      const studX = centerX + (radius + 2) * Math.cos(angle);
      const studY = centerY + (radius + 2) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(studX, studY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ffffff';
      ctx.fill();
    }

    // Center Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1c1c';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌶️ CABAI', centerX, centerY - 4);
    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('SPIN', centerX, centerY + 8);

  }, []);

  const handleStartSpin = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setShowWinCelebration(false);
    setCopiedCode(false);

    // Exact 10 slots: 
    // 1x 10% OFF (id 0)
    // 1x 20% OFF (id 2)
    // 1x RM5 OFF (id 4)
    // 7x No Prize (ids 1, 3, 5, 6, 7, 8, 9)
    const winningIndex = Math.floor(Math.random() * SPIN_PRIZES.length);
    const chosenPrize = SPIN_PRIZES[winningIndex];

    const totalSlices = SPIN_PRIZES.length;
    const sliceDeg = 360 / totalSlices;
    
    // Calculate final angle so the needle at top (270 deg / top center) points exactly to chosen slice
    const sliceCenterDeg = winningIndex * sliceDeg + sliceDeg / 2;
    // We want sliceCenterDeg to align with top center (0 deg relative to canvas transform)
    const targetDeg = 360 - sliceCenterDeg;
    
    // Add 5 to 7 full rotations (1800 - 2520 deg)
    const extraRotations = (5 + Math.floor(Math.random() * 2)) * 360;
    const newTotalRotation = currentRotationRef.current + extraRotations + targetDeg;
    
    currentRotationRef.current = newTotalRotation;
    setRotationDegrees(newTotalRotation);

    // Audio tick ticker interval
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playTickerSound();
      if (tickCount > 25) {
        clearInterval(tickInterval);
      }
    }, 150);

    // Spin animation duration: 4.5 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setHasSpunToday(true);
      setTodayPrize(chosenPrize);

      const todayKey = getTodayDateKey();
      localStorage.setItem('cabai_daily_spin_date', todayKey);
      localStorage.setItem('cabai_daily_spin_prize', String(chosenPrize.id));

      if (chosenPrize.isWin && chosenPrize.promoCode) {
        setShowWinCelebration(true);
        showToast(`🎉 Congratulations! You won ${chosenPrize.label}! Code: ${chosenPrize.promoCode}`, 'success');
      } else {
        showToast(`Today's Result: ${chosenPrize.label}. Try again tomorrow! 🌶️`, 'info');
      }
    }, 4500);
  };

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    applyPromoCode(code);
    showToast(`Promo code "${code}" copied & applied to checkout!`, 'success');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={!isSpinning ? onClose : undefined}
    >
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1c1c1e] to-[#121214] text-white rounded-3xl border border-red-900/60 shadow-2xl overflow-hidden my-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative p-6 text-center border-b border-white/10 bg-gradient-to-r from-red-950/80 via-black to-red-950/80">
          {!isSpinning && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/30 border border-red-500/40 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cabai Lucky Wheel • 每天抽一次</span>
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center justify-center gap-2">
            <span>Daily Spin 🎡 每日幸运转盘</span>
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
            Spin the wheel once every day to win exclusive 10% / 20% OFF codes or RM5 cash vouchers!
          </p>
        </div>

        {/* Modal Body: Wheel & Controls */}
        <div className="p-6 flex flex-col items-center justify-center space-y-6">
          
          {/* Wheel Container with Top Indicator Needle */}
          <div className="relative flex items-center justify-center">
            
            {/* Top Indicator Needle */}
            <div className="absolute -top-3 z-20 flex flex-col items-center pointer-events-none drop-shadow-lg">
              <div className="w-6 h-7 bg-amber-400 border-2 border-white rounded-t-sm clip-polygon-triangle shadow-md"
                   style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
              />
              <div className="w-3 h-3 rounded-full bg-red-600 border border-white -mt-1.5 shadow-sm" />
            </div>

            {/* Rotating Canvas Element */}
            <div 
              className="w-72 h-72 sm:w-80 sm:h-80 rounded-full shadow-2xl transition-transform ease-out"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transitionDuration: isSpinning ? '4.5s' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.32, 1)'
              }}
            >
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Prize Status Card or Spin Button */}
          <div className="w-full max-w-md space-y-3">
            {hasSpunToday && todayPrize ? (
              <div className={`p-4 rounded-2xl border ${todayPrize.isWin ? 'bg-gradient-to-r from-red-950/80 to-amber-950/80 border-amber-500/50' : 'bg-gray-900 border-gray-800'} text-center space-y-3`}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{todayPrize.icon}</span>
                  <div className="text-left">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Today's Daily Spin Result</div>
                    <div className="text-base font-black text-white">{todayPrize.label} — {todayPrize.description}</div>
                  </div>
                </div>

                {todayPrize.isWin && todayPrize.promoCode ? (
                  <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="px-3 py-2 bg-black/60 border border-dashed border-amber-400/60 rounded-xl font-mono text-amber-300 font-black text-sm tracking-widest">
                      {todayPrize.promoCode}
                    </div>
                    <button
                      onClick={() => handleCopyAndApply(todayPrize.promoCode!)}
                      className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-green-900" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Applied to Checkout!' : 'Copy & Apply Voucher'}</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    No prize won today! Come back tomorrow for another chance to spin 🌶️
                  </p>
                )}

                {/* Countdown to Next Spin */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Next spin unlocks in: <strong className="text-amber-300 font-mono">{timeLeftUntilMidnight}</strong></span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartSpin}
                disabled={isSpinning}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-[#af101a] to-amber-600 hover:brightness-110 active:scale-98 text-white font-black text-base rounded-2xl shadow-xl shadow-red-950/60 border border-amber-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSpinning ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin" />
                    <span>Spinning the Lucky Wheel...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span>SPIN NOW (1 Free Daily Spin) 🎡</span>
                  </>
                )}
              </button>
            )}

            {/* Prize Table Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-gray-400 text-center">
              <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                <div className="font-bold text-amber-300">🥇 1x 10% OFF</div>
                <div className="text-[10px] text-gray-500">Storewide Code</div>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                <div className="font-bold text-amber-300">🥇 1x 20% OFF</div>
                <div className="text-[10px] text-gray-500">Super Spicy Code</div>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                <div className="font-bold text-emerald-400">🥈 1x RM5 OFF</div>
                <div className="text-[10px] text-gray-500">Cash Voucher</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Fair 10-Slot Random RNG</span>
          </div>
          <button
            onClick={() => {
              onClose();
              setCurrentView('shop');
            }}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Visit 3D Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
