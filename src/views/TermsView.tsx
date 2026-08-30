import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Scale, 
  Lock, 
  RefreshCw, 
  HelpCircle 
} from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';

export const TermsView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn text-white">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-mono-code font-bold text-white/60 hover:text-[#FF4D5A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-[11px] font-mono-code font-semibold text-white/40">
          Last Updated: 20 August 2026
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#111113] p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-[#FF4D5A] text-xs font-mono-code font-extrabold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            Welcome to <strong className="text-white font-bold">Cabai Enterprise</strong>. By using our website and purchasing our products, you agree to the following Terms &amp; Conditions.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="bg-[#111113] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-xl space-y-8 text-white/80 text-sm leading-relaxed">

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <span>About Our Products</span>
          </h2>
          <p className="text-white/70">
            Cabai Enterprise sells 3D-printed products and customised items.
          </p>
          <div className="p-4 bg-[#18181B] rounded-2xl border border-white/10 text-xs text-white/70">
            Because our products may be made using 3D printing, there may be small differences in colour, texture, size, or surface finish between the product shown on the website and the final product.
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <span>Orders</span>
          </h2>
          <p className="text-white/70">
            Customers are responsible for checking their order details before completing a purchase, including:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-white/90 bg-[#18181B] p-4 rounded-2xl border border-white/10">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Product</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Quantity</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Size or colour</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Customisation details</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Delivery address</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Contact information</span>
            </li>
          </ul>
          <p className="text-xs text-white/50">
            Once an order has entered production, changes or cancellations may not be possible.
          </p>
          <p className="text-xs text-white/50">
            We reserve the right to refuse or cancel an order if there is an error in product information, pricing, availability, or for other reasonable reasons.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <span>Customised Products</span>
          </h2>
          <p className="text-white/70">
            For customised products, customers are responsible for providing accurate information, images, text, or designs.
          </p>
          <p className="text-white/70">
            Cabai Enterprise is not responsible for mistakes caused by incorrect information supplied by the customer.
          </p>
          <p className="text-xs bg-amber-950/40 p-3 rounded-xl border border-amber-800/60 text-amber-300">
            We may refuse a custom design if it contains unlawful, harmful, or inappropriate content.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <span>Prices and Payment</span>
          </h2>
          <p className="text-white/70">
            All prices displayed on our website are in <strong>Malaysian Ringgit (RM)</strong> unless otherwise stated.
          </p>
          <p className="text-white/70">
            An order will only be considered confirmed after the required payment has been successfully completed.
          </p>
          <p className="text-xs text-white/50">
            We reserve the right to correct pricing or product information errors before an order is confirmed.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">5</span>
            <span>Production and Delivery</span>
          </h2>
          <p className="text-white/70">
            Production time may vary depending on the product and order volume.
          </p>
          <p className="text-white/70">
            Estimated delivery times are provided as a guide and are not guaranteed.
          </p>
          <p className="text-white/70">
            Delivery delays may occur due to courier services, weather, public holidays, technical problems, or other circumstances outside our reasonable control.
          </p>
          <p className="text-xs text-white/70 font-semibold">
            Customers are responsible for providing a complete and accurate delivery address.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">6</span>
            <span>Returns and Refunds</span>
          </h2>
          <p className="text-white/70">
            Because many of our products may be made specifically for each customer, customised products may not be eligible for return or refund simply because the customer changes their mind.
          </p>
          <p className="text-white/70">
            If you receive a product that is damaged, defective, or significantly different from what was ordered, please contact us as soon as possible with your order details and clear photographs.
          </p>
          <p className="text-xs p-3 rounded-xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 font-medium">
            We will review the issue and, where appropriate, offer a replacement, repair, or refund.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">7</span>
            <span>Product Safety</span>
          </h2>
          <p className="text-white/70">
            Our products are intended to be used only for their stated purpose.
          </p>
          <p className="text-white/70">
            Customers should follow any usage instructions provided with the product.
          </p>
          <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Unless specifically stated otherwise, our 3D-printed products should not be treated as food-safe, medical devices, protective equipment, or safety-critical components.
            </span>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">8</span>
            <span>Intellectual Property</span>
          </h2>
          <p className="text-white/70">
            All website content, including logos, graphics, product photographs, designs, text, and other original materials belonging to Cabai Enterprise remains the property of Cabai Enterprise or its respective owners.
          </p>
          <p className="text-white/70">
            Customers must not copy, reproduce, redistribute, or commercially use our original designs or website content without permission.
          </p>
          <p className="text-xs text-white/70 font-semibold">
            Customers are responsible for ensuring that any design, image, logo, or artwork they upload for customisation does not infringe another person's intellectual property rights.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">9</span>
            <span>Website Use</span>
          </h2>
          <p className="text-white/70">You agree not to:</p>
          <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside bg-[#18181B] p-4 rounded-2xl border border-white/10">
            <li>Attempt to damage or disrupt the website;</li>
            <li>Access accounts or information belonging to other users;</li>
            <li>Use the website for unlawful purposes;</li>
            <li>Submit fraudulent orders or payment information;</li>
            <li>Copy or misuse website content.</li>
          </ul>
          <p className="text-xs text-white/50">
            We may restrict or terminate access to the website if these Terms are violated.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">10</span>
            <span>Privacy</span>
          </h2>
          <p className="text-white/70">
            We may collect information necessary to process orders, payments, deliveries, customer accounts, and customer support.
          </p>
          <p className="text-white/70">
            Personal information will be handled in accordance with our <strong>Privacy Policy</strong>.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">11</span>
            <span>Limitation of Liability</span>
          </h2>
          <p className="text-white/70">
            To the extent permitted by applicable law, Cabai Enterprise will not be responsible for indirect or consequential losses arising from the use of our products or website.
          </p>
          <p className="text-white/70">
            Nothing in these Terms is intended to exclude or limit any rights that cannot legally be excluded or limited.
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">12</span>
            <span>Changes to These Terms</span>
          </h2>
          <p className="text-white/70">
            Cabai Enterprise may update these Terms &amp; Conditions from time to time.
          </p>
          <p className="text-white/70">
            The latest version will be published on this website with the updated date.
          </p>
        </section>

        {/* Section 13 */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2.5 pb-2 border-b border-white/10">
            <span className="w-7 h-7 rounded-lg bg-red-950/80 text-[#FF4D5A] border border-red-800/80 font-mono-code font-bold text-xs flex items-center justify-center shrink-0">13</span>
            <span>Contact Us</span>
          </h2>
          <p className="text-white/70">
            If you have any questions about these Terms &amp; Conditions or an order, please contact Cabai Enterprise through the contact information provided on our website.
          </p>

          <div className="p-4 bg-[#18181B] rounded-2xl border border-white/10 space-y-2 text-xs text-white/70 font-mono-code">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span><strong className="text-white">Cabai Enterprise</strong> — {STUDIO_INFO.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>WhatsApp / Phone: <strong className="text-white">{STUDIO_INFO.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF4D5A] shrink-0" />
              <span>Email: <strong className="text-white">{STUDIO_INFO.email}</strong></span>
            </div>
          </div>

          <p className="text-xs text-white/50 font-semibold pt-2">
            By placing an order through our website, you acknowledge that you have read and agreed to these Terms &amp; Conditions.
          </p>
        </section>

      </div>

      {/* Bottom CTA to Shop */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setCurrentView('shop')}
          className="py-3 px-6 bg-[#AF101A] hover:bg-[#E11D48] text-white font-mono-code font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to 3D Shop Catalog</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
