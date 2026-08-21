import { SpinPrize } from '../types';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const PRIZE_IMAGES = {
  discount_10: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#goldGrad)" stroke="#78350f" stroke-width="2"/>
      <circle cx="32" cy="32" r="23" fill="#1c1917" stroke="#facc15" stroke-width="1.5"/>
      <text x="32" y="30" fill="#facc15" font-size="13" font-weight="900" text-anchor="middle" font-family="sans-serif">10%</text>
      <text x="32" y="43" fill="#ffffff" font-size="8.5" font-weight="800" text-anchor="middle" font-family="sans-serif">OFF</text>
      <polygon points="32,7 34,12 39,12 35,16 36,21 32,18 28,21 29,16 25,12 30,12" fill="#fde047"/>
    </svg>
  `),
  no_prize_1: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <path d="M22 42 Q32 20 42 42 Q32 46 22 42" fill="#ef4444"/>
      <path d="M30 18 Q32 12 38 14" stroke="#22c55e" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="34" r="2.5" fill="#ffffff"/>
      <circle cx="36" cy="34" r="2.5" fill="#ffffff"/>
      <circle cx="29" cy="34" r="1.2" fill="#18181b"/>
      <circle cx="37" cy="34" r="1.2" fill="#18181b"/>
      <path d="M29 40 Q32 37 35 40" stroke="#18181b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="40" cy="36" rx="2" ry="3" fill="#38bdf8"/>
    </svg>
  `),
  discount_20: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#facc15"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#fireGrad)" stroke="#450a0a" stroke-width="2"/>
      <circle cx="32" cy="32" r="23" fill="#450a0a" stroke="#ea580c" stroke-width="1.5"/>
      <path d="M32 10 Q38 20 35 26 Q40 24 38 32 Q32 46 26 36 Q22 28 32 10 Z" fill="#f97316" opacity="0.4"/>
      <text x="32" y="30" fill="#fde047" font-size="13" font-weight="900" text-anchor="middle" font-family="sans-serif">20%</text>
      <text x="32" y="43" fill="#ffffff" font-size="8" font-weight="800" text-anchor="middle" font-family="sans-serif">SPICY</text>
    </svg>
  `),
  no_prize_2: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <path d="M22 20 L42 20 L38 34 Q32 42 26 34 Z" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
      <path d="M20 22 Q14 26 22 30" stroke="#f59e0b" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M44 22 Q50 26 42 30" stroke="#f59e0b" stroke-width="2" fill="none" stroke-linecap="round"/>
      <rect x="29" y="38" width="6" height="8" fill="#f59e0b"/>
      <rect x="24" y="46" width="16" height="4" rx="2" fill="#d97706"/>
      <polygon points="32,24 33.5,27 37,27 34,29 35.5,32 32,30 28.5,32 30,29 27,27 30.5,27" fill="#ffffff"/>
    </svg>
  `),
  rm5_off: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#emeraldGrad)" stroke="#064e3b" stroke-width="2"/>
      <rect x="14" y="20" width="36" height="24" rx="4" fill="#064e3b" stroke="#6ee7b7" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="8" fill="#10b981" stroke="#a7f3d0" stroke-width="1"/>
      <text x="32" y="35" fill="#ecfdf5" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif">RM5</text>
      <text x="18" y="27" fill="#6ee7b7" font-size="5.5" font-weight="bold" font-family="sans-serif">CASH</text>
      <text x="46" y="39" fill="#6ee7b7" font-size="5.5" font-weight="bold" text-anchor="end" font-family="sans-serif">VOUCHER</text>
    </svg>
  `),
  no_prize_3: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <circle cx="32" cy="32" r="22" fill="#ef4444" stroke="#991b1b" stroke-width="1"/>
      <circle cx="32" cy="32" r="16" fill="#ffffff"/>
      <circle cx="32" cy="32" r="10" fill="#ef4444"/>
      <circle cx="32" cy="32" r="4" fill="#ffffff"/>
      <line x1="48" y1="16" x2="36" y2="28" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <polygon points="36,28 34,23 39,26" fill="#0284c7"/>
    </svg>
  `),
  no_prize_4: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#450a0a" stroke="#7f1d1d" stroke-width="2"/>
      <path d="M24 40 Q32 22 40 40 Q32 44 24 40" fill="#22c55e"/>
      <path d="M30 20 Q32 14 36 16" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="22" y="24" width="20" height="16" rx="4" fill="#0284c7" opacity="0.6"/>
      <path d="M28 32 L36 32 M32 28 L32 36 M29 29 L35 35 M35 29 L29 35" stroke="#e0f2fe" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `),
  no_prize_5: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <circle cx="32" cy="34" r="18" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="32" cy="34" r="14" fill="#1e293b"/>
      <line x1="32" y1="34" x2="32" y2="25" stroke="#fcd34d" stroke-width="2" stroke-linecap="round"/>
      <line x1="32" y1="34" x2="39" y2="34" stroke="#fcd34d" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="34" r="2" fill="#fbbf24"/>
      <line x1="20" y1="18" x2="16" y2="14" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="44" y1="18" x2="48" y2="14" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `),
  no_prize_6: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <rect x="20" y="18" width="24" height="32" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <rect x="28" y="14" width="8" height="4" rx="1" fill="#38bdf8"/>
      <polygon points="34,22 26,34 32,34 30,46 38,34 32,34" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
    </svg>
  `),
  no_prize_7: createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <rect x="18" y="32" width="28" height="18" rx="2" fill="#a855f7" stroke="#7e22ce" stroke-width="1.5"/>
      <polygon points="16,32 32,20 48,32 16,32" fill="#c084fc" stroke="#7e22ce" stroke-width="1.5"/>
      <circle cx="32" cy="40" r="3" fill="#fde047"/>
      <path d="M26 24 L24 20 M38 24 L40 20" stroke="#fde047" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `)
};

export const DEFAULT_SPIN_PRIZES: SpinPrize[] = [
  {
    id: 0,
    type: 'discount_10',
    label: '10% OFF',
    description: '10% OFF Storewide Promo Code',
    promoCode: 'CABAI10',
    discountType: 'percent',
    discountValue: 10,
    icon: '🥇',
    image: PRIZE_IMAGES.discount_10,
    isWin: true,
    color: '#af101a',
    textColor: '#ffffff'
  },
  {
    id: 1,
    type: 'no_prize',
    label: '谢谢参与',
    description: 'Better luck tomorrow!',
    icon: '🌶️',
    image: PRIZE_IMAGES.no_prize_1,
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
    image: PRIZE_IMAGES.discount_20,
    isWin: true,
    color: '#d97706',
    textColor: '#ffffff'
  },
  {
    id: 3,
    type: 'no_prize',
    label: '再接再厉',
    description: 'Keep your spirits up!',
    icon: '🏆',
    image: PRIZE_IMAGES.no_prize_2,
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
    image: PRIZE_IMAGES.rm5_off,
    isWin: true,
    color: '#059669',
    textColor: '#ffffff'
  },
  {
    id: 5,
    type: 'no_prize',
    label: '差一点点',
    description: 'Almost hit the jackpot!',
    icon: '🎯',
    image: PRIZE_IMAGES.no_prize_3,
    isWin: false,
    color: '#262626',
    textColor: '#9ca3af'
  },
  {
    id: 6,
    type: 'no_prize',
    label: '🌶️ 辣味不足',
    description: 'Need more chili power!',
    icon: '❄️',
    image: PRIZE_IMAGES.no_prize_4,
    isWin: false,
    color: '#3b070c',
    textColor: '#fca5a5'
  },
  {
    id: 7,
    type: 'no_prize',
    label: '明天再来',
    description: 'Spin refreshes at midnight',
    icon: '⏰',
    image: PRIZE_IMAGES.no_prize_5,
    isWin: false,
    color: '#1f2937',
    textColor: '#9ca3af'
  },
  {
    id: 8,
    type: 'no_prize',
    label: '运气充能中',
    description: 'Charging your lucky aura',
    icon: '⚡',
    image: PRIZE_IMAGES.no_prize_6,
    isWin: false,
    color: '#262626',
    textColor: '#9ca3af'
  },
  {
    id: 9,
    type: 'no_prize',
    label: '空空如也',
    description: 'Try again tomorrow',
    icon: '🎁',
    image: PRIZE_IMAGES.no_prize_7,
    isWin: false,
    color: '#1f2937',
    textColor: '#9ca3af'
  }
];
