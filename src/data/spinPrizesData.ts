import { SpinPrize } from '../types';

function createSvgBase64(svgString: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    try {
      return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgString.trim())))}`;
    } catch (e) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
    }
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const PRIZE_IMAGES = {
  discount_10: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#78350f"/>
      <circle cx="32" cy="32" r="27" fill="url(#goldGrad)" stroke="#fef08a" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="22" fill="#1c1917" stroke="#facc15" stroke-width="2"/>
      <text x="32" y="28" fill="#facc15" font-size="12" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif">10%</text>
      <text x="32" y="42" fill="#ffffff" font-size="8.5" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif">OFF</text>
      <polygon points="32,7 34,11 38,11 35,14 36,18 32,16 28,18 29,14 26,11 30,11" fill="#fde047"/>
    </svg>
  `),
  no_prize_1: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#18181b"/>
      <circle cx="32" cy="32" r="26" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <!-- Cute crying chili pepper -->
      <path d="M22 44 Q32 18 42 44 Q32 49 22 44" fill="#dc2626"/>
      <path d="M30 18 Q32 11 38 13" stroke="#22c55e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="35" r="2.5" fill="#ffffff"/>
      <circle cx="36" cy="35" r="2.5" fill="#ffffff"/>
      <circle cx="28" cy="35" r="1.2" fill="#09090b"/>
      <circle cx="36" cy="35" r="1.2" fill="#09090b"/>
      <path d="M29 41 Q32 38 35 41" stroke="#09090b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="40" cy="38" rx="2" ry="3.5" fill="#38bdf8"/>
    </svg>
  `),
  discount_20: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#7f1d1d"/>
          <stop offset="40%" stop-color="#dc2626"/>
          <stop offset="80%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#facc15"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#450a0a"/>
      <circle cx="32" cy="32" r="27" fill="url(#fireGrad)" stroke="#fef08a" stroke-width="2"/>
      <circle cx="32" cy="32" r="21" fill="#450a0a" stroke="#ea580c" stroke-width="1.5"/>
      <text x="32" y="28" fill="#fde047" font-size="12.5" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif">20%</text>
      <text x="32" y="42" fill="#ffffff" font-size="8.5" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif">SPICY</text>
    </svg>
  `),
  no_prize_2: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#0f172a"/>
      <circle cx="32" cy="32" r="26" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <!-- Trophy -->
      <path d="M22 20 L42 20 L38 34 Q32 42 26 34 Z" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
      <path d="M20 22 Q13 26 22 31" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M44 22 Q51 26 42 31" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="29" y="38" width="6" height="8" fill="#f59e0b"/>
      <rect x="23" y="46" width="18" height="5" rx="2" fill="#d97706"/>
      <polygon points="32,24 33.5,27 37,27 34,29 35.5,32 32,30 28.5,32 30,29 27,27 30.5,27" fill="#ffffff"/>
    </svg>
  `),
  rm5_off: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ee7b7"/>
          <stop offset="50%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#064e3b"/>
      <circle cx="32" cy="32" r="27" fill="url(#emeraldGrad)" stroke="#a7f3d0" stroke-width="2"/>
      <rect x="13" y="20" width="38" height="24" rx="4" fill="#064e3b" stroke="#6ee7b7" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="8" fill="#10b981" stroke="#a7f3d0" stroke-width="1"/>
      <text x="32" y="35" fill="#ffffff" font-size="9" font-weight="900" text-anchor="middle" font-family="Arial, sans-serif">RM5</text>
      <text x="16" y="27" fill="#6ee7b7" font-size="5" font-weight="bold" font-family="Arial, sans-serif">CASH</text>
      <text x="48" y="39" fill="#6ee7b7" font-size="5" font-weight="bold" text-anchor="end" font-family="Arial, sans-serif">VOUCHER</text>
    </svg>
  `),
  no_prize_3: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#18181b"/>
      <circle cx="32" cy="32" r="26" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <circle cx="32" cy="32" r="22" fill="#ef4444" stroke="#991b1b" stroke-width="1"/>
      <circle cx="32" cy="32" r="16" fill="#ffffff"/>
      <circle cx="32" cy="32" r="10" fill="#ef4444"/>
      <circle cx="32" cy="32" r="4" fill="#ffffff"/>
      <line x1="48" y1="16" x2="36" y2="28" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
      <polygon points="36,28 34,23 39,26" fill="#0284c7"/>
    </svg>
  `),
  no_prize_4: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#450a0a"/>
      <circle cx="32" cy="32" r="26" fill="#7f1d1d" stroke="#b91c1c" stroke-width="2"/>
      <path d="M23 42 Q32 20 41 42 Q32 47 23 42" fill="#22c55e"/>
      <path d="M30 20 Q32 13 37 15" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="20" y="24" width="24" height="18" rx="4" fill="#0284c7" opacity="0.7"/>
      <path d="M26 33 L38 33 M32 27 L32 39" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  no_prize_5: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#0f172a"/>
      <circle cx="32" cy="32" r="26" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <circle cx="32" cy="34" r="18" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <circle cx="32" cy="34" r="14" fill="#1e293b"/>
      <line x1="32" y1="34" x2="32" y2="24" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="34" x2="40" y2="34" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="34" r="2.5" fill="#fbbf24"/>
      <line x1="20" y1="18" x2="15" y2="13" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      <line x1="44" y1="18" x2="49" y2="13" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `),
  no_prize_6: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#18181b"/>
      <circle cx="32" cy="32" r="26" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <rect x="20" y="18" width="24" height="32" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
      <rect x="27" y="13" width="10" height="5" rx="1.5" fill="#38bdf8"/>
      <polygon points="34,22 26,34 32,34 30,46 38,34 32,34" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
    </svg>
  `),
  no_prize_7: createSvgBase64(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#0f172a"/>
      <circle cx="32" cy="32" r="26" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <rect x="17" y="32" width="30" height="20" rx="3" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
      <polygon points="15,32 32,18 49,32 15,32" fill="#c084fc" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="32" cy="41" r="3.5" fill="#fde047"/>
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
    textColor: '#e5e7eb'
  },
  {
    id: 2,
    type: 'discount_20',
    label: '20% OFF',
    description: 'Super Spicy 20% OFF Code',
    promoCode: 'SPICY20',
    discountType: 'percent',
    discountValue: 20,
    icon: '🔥',
    image: PRIZE_IMAGES.discount_20,
    isWin: true,
    color: '#ea580c',
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
    color: '#1e293b',
    textColor: '#e5e7eb'
  },
  {
    id: 4,
    type: 'rm5_off',
    label: 'RM5 OFF',
    description: 'RM5 Cash Voucher on Any Order',
    promoCode: 'LUCKYRM5',
    discountType: 'flat',
    discountValue: 5,
    icon: '💵',
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
    textColor: '#e5e7eb'
  },
  {
    id: 6,
    type: 'no_prize',
    label: '🌶️ 辣味不足',
    description: 'Need more chili power!',
    icon: '❄️',
    image: PRIZE_IMAGES.no_prize_4,
    isWin: false,
    color: '#450a0a',
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
    color: '#1e293b',
    textColor: '#e5e7eb'
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
    textColor: '#e5e7eb'
  },
  {
    id: 9,
    type: 'no_prize',
    label: '空空如也',
    description: 'Try again tomorrow',
    icon: '🎁',
    image: PRIZE_IMAGES.no_prize_7,
    isWin: false,
    color: '#1e293b',
    textColor: '#e5e7eb'
  }
];
