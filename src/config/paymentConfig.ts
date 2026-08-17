/**
 * ============================================================================
 * TOUCH 'N GO eWALLET & MALAYSIA NATIONAL QR PAYMENT CONFIGURATION
 * ============================================================================
 * Configure your business TNG eWallet / DuitNow QR image and merchant credentials.
 * The system displays this exact QR on the customer payment screen.
 */

export const TNG_PAYMENT_CONFIG = {
  // Merchant Display Name (as registered with Touch 'n Go)
  merchantName: 'CHEW LI YANG',
  
  // Wallet / System Name
  walletName: "Touch 'n Go eWallet",
  
  // QR Standard
  qrStandardName: 'Malaysia National QR (DuitNow)',

  // Configured QR Code Image Path (Local public asset or CDN URL)
  // Replace this with your own QR image URL or public path anytime
  qrImageUrl: '/tng_qr_chew_li_yang.jpg',

  // Fallback direct scan instructions
  instructions: [
    "Open your Touch 'n Go eWallet or any Malaysia mobile banking app.",
    "Tap 'Scan' and scan the Malaysia National QR code above.",
    "Verify recipient name: CHEW LI YANG.",
    "Enter the exact order amount in RM shown on your screen.",
    "Complete the transfer and return here to click 'Next' and 'Done Payment'."
  ],

  // Customer support contact for payment assistance
  supportContact: '+60 12-883 4910',
  supportEmail: 'support@cabaistudio.my'
};
