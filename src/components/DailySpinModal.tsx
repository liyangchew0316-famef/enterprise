import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SpinPrize } from '../types';
import { DEFAULT_SPIN_PRIZES, PRIZE_IMAGES } from '../data/spinPrizesData';
import { 
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
  ShieldCheck,
  Database
} from 'lucide-react';

interface DailySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Direct Vector Illustration Drawers for 100% reliable canvas slice rendering
function drawSliceArt(ctx: CanvasRenderingContext2D, prizeId: number, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x, y);

  switch (prizeId) {
    case 0: { // 10% OFF Gold Medallion
      // Outer Gold Starburst / Medal
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#ca8a04';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r - 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#1c1917';
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('10%', 0, -3);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Arial, sans-serif';
      ctx.fillText('OFF', 0, 8);
      break;
    }
    case 1: { // Crying Chili Pepper (Try again)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#27272a';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#52525b';
      ctx.stroke();

      // Red chili body
      ctx.beginPath();
      ctx.moveTo(-6, 8);
      ctx.quadraticCurveTo(0, -10, 6, 8);
      ctx.quadraticCurveTo(0, 11, -6, 8);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      // Green stem
      ctx.beginPath();
      ctx.moveTo(-1, -9);
      ctx.quadraticCurveTo(2, -14, 5, -12);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#22c55e';
      ctx.stroke();

      // Eyes & teardrop
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2.5, 0, 1.5, 0, 2 * Math.PI);
      ctx.arc(2.5, 0, 1.5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(5, 2, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case 2: { // 20% OFF Super Spicy Flame
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#7f1d1d';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ea580c';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r - 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#450a0a';
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('20%', 0, -3);

      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 7.5px Arial, sans-serif';
      ctx.fillText('HOT 🔥', 0, 8);
      break;
    }
    case 3: { // Trophy
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Golden Cup
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-6, -7);
      ctx.lineTo(6, -7);
      ctx.lineTo(4, 2);
      ctx.quadraticCurveTo(0, 6, -4, 2);
      ctx.closePath();
      ctx.fill();

      // Handles
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-5.5, -3, 3, 0.5 * Math.PI, 1.5 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(5.5, -3, 3, 1.5 * Math.PI, 0.5 * Math.PI);
      ctx.stroke();

      // Base
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-5, 7, 10, 3);
      break;
    }
    case 4: { // RM5 Cash Voucher
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#064e3b';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#34d399';
      ctx.stroke();

      // Cash bill rectangle
      ctx.fillStyle = '#047857';
      ctx.fillRect(-11, -7, 22, 14);
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1;
      ctx.strokeRect(-11, -7, 22, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RM5', 0, 0);
      break;
    }
    case 5: { // Target / Bullseye
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#27272a';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#52525b';
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case 6: { // Frozen Chili / Low Heat
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#450a0a';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#7f1d1d';
      ctx.stroke();

      // Ice crystal snowflake
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -9); ctx.lineTo(0, 9);
      ctx.moveTo(-9, 0); ctx.lineTo(9, 0);
      ctx.moveTo(-6, -6); ctx.lineTo(6, 6);
      ctx.moveTo(-6, 6); ctx.lineTo(6, -6);
      ctx.stroke();
      break;
    }
    case 7: { // Alarm Clock (Tomorrow)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Clock face
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 2, 9, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 2, 7, 0, 2 * Math.PI);
      ctx.fill();

      // Hands
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 2); ctx.lineTo(0, -2);
      ctx.moveTo(0, 2); ctx.lineTo(4, 2);
      ctx.stroke();

      // Bells
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(-7, -6, 2.5, 0, 2 * Math.PI);
      ctx.arc(7, -6, 2.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case 8: { // Battery Charging
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#27272a';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#52525b';
      ctx.stroke();

      // Battery body
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -8, 12, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-6, -8, 12, 16);
      ctx.fillRect(-3, -11, 6, 3);

      // Lightning bolt
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(1, -5);
      ctx.lineTo(-3, 1);
      ctx.lineTo(0, 1);
      ctx.lineTo(-1, 5);
      ctx.lineTo(3, -1);
      ctx.lineTo(0, -1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 9:
    default: { // Gift Box
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Gift Box
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-8, -2, 16, 11);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-9.5, -6, 19, 4);

      // Ribbon
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-2, -6, 4, 15);
      break;
    }
  }

  ctx.restore();
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

  // 2. Preload all slice image assets
  useEffect(() => {
    const newMap = new Map<number, HTMLImageElement>();

    prizes.forEach((prize) => {
      const src = prize.image || prize.imageUrl || (DEFAULT_SPIN_PRIZES[prize.id]?.image) || PRIZE_IMAGES.discount_10;
      if (src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          setImagesLoadedCount(prev => prev + 1);
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
      const notes = [523.25, 659.25, 783.99, 1046.50];
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

  // 6. Draw Lucky Wheel Canvas with Real Pictures & Detailed Illustrations
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

    // Draw Slices with vibrant graphics and picture artwork
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

      const pictureDist = radius * 0.68;
      const textDist = radius * 0.30;
      const badgeRadius = 20;

      // 1. Draw Slice Picture / Illustration (Loaded Image OR Crisp Direct Canvas Vector)
      const img = imageElementsRef.current.get(prize.id);
      let drewImg = false;

      if (img && img.complete && img.naturalWidth > 0) {
        try {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pictureDist, 0, badgeRadius, 0, 2 * Math.PI);
          ctx.fillStyle = prize.isWin ? '#ffffff' : '#1e293b';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = prize.isWin ? '#fbbf24' : '#64748b';
          ctx.stroke();
          ctx.clip();
          
          const drawSize = badgeRadius * 2;
          ctx.drawImage(img, pictureDist - badgeRadius, -badgeRadius, drawSize, drawSize);
          ctx.restore();
          drewImg = true;
        } catch (e) {
          drewImg = false;
        }
      }

      // If image didn't draw, draw direct vector picture badge
      if (!drewImg) {
        drawSliceArt(ctx, prize.id, pictureDist, 0, badgeRadius);
      }

      // 2. Draw Prize Title & Value Label
      ctx.save();
      ctx.fillStyle = prize.textColor || '#ffffff';
      ctx.font = 'bold 12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Shadow for text readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(prize.label, textDist + 16, 0);
      ctx.restore();

      // 3. Win indicator star on winning slices
      if (prize.isWin) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 9px Arial, sans-serif';
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
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌶️ CABAI', centerX, centerY - 4);
    ctx.font = '9px Arial, sans-serif';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('SPIN', centerX, centerY + 9);

  }, [prizes]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel, imagesLoadedCount]);

  // 7. Start Spin Handler
  const handleStartSpin = async () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setCopiedCode(false);

    // Fair Random Selection among active prizes
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const chosenPrize = prizes[winningIndex];

    const totalSlices = prizes.length;
    const sliceDeg = 360 / totalSlices;
    
    // Align needle at top center
    const sliceCenterDeg = winningIndex * sliceDeg + sliceDeg / 2;
    const targetDeg = 360 - sliceCenterDeg;
    
    const extraRotations = (5 + Math.floor(Math.random() * 2)) * 360;
    const newTotalRotation = currentRotationRef.current + extraRotations + targetDeg;
    
    currentRotationRef.current = newTotalRotation;
    setRotationDegrees(newTotalRotation);

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playTickerSound();
      if (tickCount > 25) {
        clearInterval(tickInterval);
      }
    }, 150);

    setTimeout(async () => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setHasSpunToday(true);
      setTodayPrize(chosenPrize);

      const todayKey = getTodayDateKey();
      localStorage.setItem('cabai_daily_spin_date', todayKey);
      localStorage.setItem('cabai_daily_spin_prize', String(chosenPrize.id));

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
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
                  <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    {todayPrize.image ? (
                      <img src={todayPrize.image} alt={todayPrize.label} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">{todayPrize.icon}</span>
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
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center gap-1">
                <img src={PRIZE_IMAGES.discount_10} alt="10% OFF" className="w-7 h-7" />
                <div className="font-bold text-amber-300">10% OFF</div>
                <div className="text-[10px] text-gray-500">Storewide Code</div>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center gap-1">
                <img src={PRIZE_IMAGES.discount_20} alt="20% OFF" className="w-7 h-7" />
                <div className="font-bold text-amber-300">20% OFF</div>
                <div className="text-[10px] text-gray-500">Super Spicy Code</div>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center gap-1">
                <img src={PRIZE_IMAGES.rm5_off} alt="RM5 OFF" className="w-7 h-7" />
                <div className="font-bold text-emerald-400">RM5 OFF</div>
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
