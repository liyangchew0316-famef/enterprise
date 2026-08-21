import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SpinPrize } from '../types';
import { DEFAULT_SPIN_PRIZES, PRIZE_IMAGES } from '../data/spinPrizesData';
import { 
  fetchSpinPrizesFromFirestore, 
  subscribeToSpinPrizes, 
  saveSpinRecordToFirestore,
  fetchUserTodaySpinFromFirestore,
  SpinRecord
} from '../lib/firestoreService';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight, 
  RotateCw,
  PartyPopper,
  ShieldCheck,
  Flame,
  Database
} from 'lucide-react';

interface DailySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailySpinModal: React.FC<DailySpinModalProps> = ({ isOpen, onClose }) => {
  const { applyPromoCode, showToast, setCurrentView, currentUser } = useApp();
  
  const [prizes, setPrizes] = useState<SpinPrize[]>(DEFAULT_SPIN_PRIZES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [todayPrize, setTodayPrize] = useState<SpinPrize | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeLeftUntilMidnight, setTimeLeftUntilMidnight] = useState('');
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [isFromDatabase, setIsFromDatabase] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRotationRef = useRef(0);
  const imageElementsRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

  const getTodayDateKey = useCallback(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // 1. Fetch & Subscribe to Daily Spin Prizes from Firestore Database
  useEffect(() => {
    const unsubscribe = subscribeToSpinPrizes((dbPrizes) => {
      if (dbPrizes && dbPrizes.length > 0) {
        // Ensure each prize has an image URL fallback if not set in DB
        const enrichedPrizes = dbPrizes.map((p, idx) => {
          let imgUrl = p.image || p.imageUrl;
          if (!imgUrl) {
            const defaultItem = DEFAULT_SPIN_PRIZES[idx] || DEFAULT_SPIN_PRIZES.find(dp => dp.id === p.id);
            imgUrl = defaultItem?.image || PRIZE_IMAGES.discount_10;
          }
          return {
            ...p,
            image: imgUrl
          };
        });
        setPrizes(enrichedPrizes);
        setIsFromDatabase(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. Preload all slice image assets so canvas can draw actual pictures on the wheel
  useEffect(() => {
    let loadedCount = 0;
    const newMap = new Map<number, HTMLImageElement>();

    prizes.forEach((prize) => {
      const src = prize.image || prize.imageUrl || (DEFAULT_SPIN_PRIZES[prize.id]?.image) || PRIZE_IMAGES.discount_10;
      if (src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setImagesLoadedCount(prev => prev + 1);
        };
        img.onerror = () => {
          console.warn(`[DailySpin] Image failed to load for prize ${prize.id}, using fallback`);
        };
        newMap.set(prize.id, img);
      }
    });

    imageElementsRef.current = newMap;
  }, [prizes]);

  // 3. Check spin status for today from Firestore database & local storage
  useEffect(() => {
    const checkStatus = async () => {
      const todayKey = getTodayDateKey();
      
      // Check Firestore if user is authenticated
      if (currentUser?.uid) {
        try {
          const dbRecord = await fetchUserTodaySpinFromFirestore(currentUser.uid, todayKey);
          if (dbRecord) {
            setHasSpunToday(true);
            const foundPrize = prizes.find(p => p.id === dbRecord.prizeId) || DEFAULT_SPIN_PRIZES.find(p => p.id === dbRecord.prizeId);
            if (foundPrize) {
              setTodayPrize(foundPrize);
            }
            return;
          }
        } catch (e) {
          console.warn('[DailySpin] Error checking Firestore user spin:', e);
        }
      }

      // Check local storage for guest / fallback
      const savedDate = localStorage.getItem('cabai_daily_spin_date');
      const savedPrizeId = localStorage.getItem('cabai_daily_spin_prize');

      if (savedDate === todayKey) {
        setHasSpunToday(true);
        if (savedPrizeId !== null) {
          const found = prizes.find(p => p.id === parseInt(savedPrizeId, 10)) || DEFAULT_SPIN_PRIZES.find(p => p.id === parseInt(savedPrizeId, 10));
          if (found) setTodayPrize(found);
        }
      } else {
        setHasSpunToday(false);
        setTodayPrize(null);
      }
    };

    if (isOpen) {
      checkStatus();
    }
  }, [isOpen, currentUser, getTodayDateKey, prizes]);

  // 4. Countdown timer to midnight
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

  // 5. Sound effects (Ticker & Win)
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
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  };

  const playWinSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.25);
      });
    } catch (e) {}
  };

  // 6. Draw Lucky Wheel Canvas with Real Images & High-Res Graphics
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;
    const totalSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    ctx.clearRect(0, 0, width, height);

    // Outer rim border with gold/crimson gradient glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#af101a';
    ctx.stroke();

    // Inner rim accent ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();
    ctx.restore();

    // Draw Slices with vibrant graphics, real loaded images, and legible labels
    prizes.forEach((prize, index) => {
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      // Transform context to slice angle
      const midAngle = startAngle + sliceAngle / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(midAngle);

      const iconDist = radius * 0.70;
      const textDist = radius * 0.32;
      const badgeRadius = 18;

      // 1. Draw rounded glowing picture container badge circle
      ctx.beginPath();
      ctx.arc(iconDist, 0, badgeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = prize.isWin ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.85)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = prize.isWin ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();

      // 2. Draw Slice Image Picture
      const img = imageElementsRef.current.get(prize.id);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(iconDist, 0, badgeRadius - 1, 0, 2 * Math.PI);
        ctx.clip();
        const drawSize = (badgeRadius - 1) * 2;
        ctx.drawImage(img, iconDist - drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
      } else {
        // Fallback emoji icon
        ctx.font = '16px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prize.icon || '🎁', iconDist, 1);
      }

      // 3. Draw Prize Title & Value Label
      ctx.save();
      ctx.fillStyle = prize.textColor || '#ffffff';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Shadow for text readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(prize.label, textDist + 16, 0);
      ctx.restore();

      // 4. Win indicator star
      if (prize.isWin) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ WIN', radius * 0.90, 0);
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
      ctx.arc(studX, studY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ffffff';
      ctx.fill();
    }

    // Center Hub with Cabai Brand Crest
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.fillStyle = '#18181b';
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌶️ CABAI', centerX, centerY - 4);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('SPIN', centerX, centerY + 9);

  }, [prizes]);

  // Redraw when prizes change or when image assets load
  useEffect(() => {
    drawWheel();
  }, [drawWheel, imagesLoadedCount]);

  // 7. Start Spin Handler
  const handleStartSpin = async () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setShowWinCelebration(false);
    setCopiedCode(false);

    // Fair Random Selection among active prizes
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const chosenPrize = prizes[winningIndex];

    const totalSlices = prizes.length;
    const sliceDeg = 360 / totalSlices;
    
    // Calculate final angle to align needle at top center
    const sliceCenterDeg = winningIndex * sliceDeg + sliceDeg / 2;
    const targetDeg = 360 - sliceCenterDeg;
    
    // 5 to 7 full 360 rotations
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
    setTimeout(async () => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setHasSpunToday(true);
      setTodayPrize(chosenPrize);

      const todayKey = getTodayDateKey();
      localStorage.setItem('cabai_daily_spin_date', todayKey);
      localStorage.setItem('cabai_daily_spin_prize', String(chosenPrize.id));

      // Save Spin Event to Firestore Database (spin_records)
      const record: SpinRecord = {
        id: `spin-${todayKey}-${currentUser?.uid || 'guest'}-${Date.now()}`,
        userId: currentUser?.uid || 'guest',
        prizeId: chosenPrize.id,
        prizeLabel: chosenPrize.label,
        isWin: chosenPrize.isWin,
        promoCode: chosenPrize.promoCode,
        discountType: chosenPrize.discountType,
        discountValue: chosenPrize.discountValue,
        dateKey: todayKey,
        createdAt: new Date().toISOString()
      };

      try {
        await saveSpinRecordToFirestore(record);
      } catch (err) {
        console.warn('[DailySpin] Note saving spin record:', err);
      }

      if (chosenPrize.isWin && chosenPrize.promoCode) {
        playWinSound();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
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
            {isFromDatabase && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                <Database className="w-2.5 h-2.5" />
                <span>Live DB</span>
              </span>
            )}
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
              <div 
                className="w-6 h-7 bg-amber-400 border-2 border-white rounded-t-sm shadow-md"
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
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    {todayPrize.image ? (
                      <img src={todayPrize.image} alt={todayPrize.label} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">{todayPrize.icon}</span>
                    )}
                  </div>
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

            {/* Prize Table Breakdown with Visual Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-gray-400 text-center">
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center gap-1">
                <img src={PRIZE_IMAGES.discount_10} alt="10% OFF" className="w-5 h-5" />
                <div className="font-bold text-amber-300">1x 10% OFF</div>
                <div className="text-[10px] text-gray-500">Storewide Code</div>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center gap-1">
                <img src={PRIZE_IMAGES.discount_20} alt="20% OFF" className="w-5 h-5" />
                <div className="font-bold text-amber-300">1x 20% OFF</div>
                <div className="text-[10px] text-gray-500">Super Spicy Code</div>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center gap-1">
                <img src={PRIZE_IMAGES.rm5_off} alt="RM5 OFF" className="w-5 h-5" />
                <div className="font-bold text-emerald-400">1x RM5 OFF</div>
                <div className="text-[10px] text-gray-500">Cash Voucher</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Fair 10-Slot Random RNG • Cloud Sync</span>
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
