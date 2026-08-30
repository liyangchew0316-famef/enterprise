import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_LIST } from '../data/mockData';
import { Mail, Phone, MapPin, Send, ChevronDown, MessageSquare } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      showToast('Thank you! Your message has been sent to our Maker Studio team.', 'success');
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-mono-code font-bold text-[#FF4D5A] uppercase tracking-wider">GET IN TOUCH</span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Contact Cabai Maker Studio
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          Have a bulk order query or custom CAD project? Drop us a message or reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#111113] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h2 className="font-heading font-extrabold text-lg text-white">Send Us a Direct Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-code">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-white/80 block">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ahmad Faizal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#18181B] text-white border border-white/10 rounded-xl focus:outline-hidden focus:border-[#AF101A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="faizal@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-[#18181B] text-white border border-white/10 rounded-xl focus:outline-hidden focus:border-[#AF101A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-white/80 block">Message / Custom Print Inquiry Details</label>
              <textarea
                rows={4}
                required
                placeholder="Ask us about custom colors, corporate gifts, drawing designs, or 3D print specifications..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-[#18181B] text-white border border-white/10 rounded-xl focus:outline-hidden focus:border-[#AF101A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#AF101A] text-white font-extrabold rounded-xl hover:bg-[#E11D48] transition-colors flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Right Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#111113] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-extrabold text-base text-white uppercase tracking-wider">Studio Info</h2>
              <span className="text-[10px] font-mono-code font-extrabold bg-red-950/60 text-[#FF4D5A] border border-red-800/60 px-2.5 py-0.5 rounded-full">
                Live Studio
              </span>
            </div>

            <div className="flex items-start gap-3 text-white/80">
              <div className="w-9 h-9 rounded-xl bg-red-950/40 text-[#FF4D5A] border border-red-800/40 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-[#FF4D5A]" />
              </div>
              <div>
                <strong className="text-white block font-bold text-sm">Studio Location &amp; Dispatch</strong>
                <span className="text-white/70 font-medium">Bukit Mertajam, Penang, Malaysia</span>
                <span className="block text-[11px] text-white/40 mt-0.5">Express courier shipping to Penang, KL, Selangor &amp; all Malaysian states 🇲🇾</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/80">
              <div className="w-9 h-9 rounded-xl bg-red-950/40 text-[#FF4D5A] border border-red-800/40 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-5 h-5 text-[#FF4D5A]" />
              </div>
              <div className="flex-1">
                <strong className="text-white block font-bold text-sm">WhatsApp &amp; Phone:</strong>
                <a 
                  href="https://wa.me/60129058515" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline inline-flex items-center gap-1.5 mt-0.5"
                >
                  <span>+60 12-905 8515</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">Chat on WA</span>
                </a>
                <span className="block text-[11px] text-white/40 mt-0.5">Fast response for custom CAD &amp; order inquiries</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/80">
              <div className="w-9 h-9 rounded-xl bg-red-950/40 text-[#FF4D5A] border border-red-800/40 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-[#FF4D5A]" />
              </div>
              <div className="flex-1">
                <strong className="text-white block font-bold text-sm">Email Inquiry:</strong>
                <a 
                  href="mailto:enterprise.cabai@gmail.com" 
                  className="text-[#FF4D5A] hover:underline font-bold block mt-0.5"
                >
                  enterprise.cabai@gmail.com
                </a>
                <span className="block text-[11px] text-white/40 mt-0.5">Corporate quotations &amp; STL file attachments</span>
              </div>
            </div>

            <div className="p-4 bg-[#18181B] rounded-2xl border border-white/10 text-white/70 text-xs space-y-1">
              <span className="font-bold text-white block">⚡ Rapid 24–48hr Turnaround</span>
              <p className="text-[11px] leading-relaxed">
                All 3D models sliced and printed fresh in-house. Need an immediate quotation? Message our WhatsApp or consult <strong>Cabai AI</strong>.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6 pt-6">
        <div className="text-center">
          <h2 className="font-heading font-extrabold text-2xl text-white">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_LIST.map((faq, idx) => (
            <div key={idx} className="bg-[#111113] rounded-2xl border border-white/10 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-white flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-white/70 border-t border-white/10 bg-[#18181B] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
