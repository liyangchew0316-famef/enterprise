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
        <span className="text-xs font-extrabold text-[#af101a] uppercase tracking-wider">GET IN TOUCH</span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900">
          Contact Cabai Maker Studio
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have a bulk order query or custom CAD project? Drop us a message or reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="font-heading font-extrabold text-lg text-gray-900">Send Us a Direct Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ahmad Faizal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="faizal@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">Message / STL Inquiry Details</label>
              <textarea
                rows={4}
                required
                placeholder="Ask us about custom colors, corporate gifts, or STL print specifications..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#af101a] text-white font-extrabold rounded-xl hover:bg-[#8d0a12] transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Right Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-xs">
            <h2 className="font-heading font-extrabold text-base text-gray-900 uppercase">Studio Info</h2>

            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-[#af101a] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block font-bold">Studio Location</strong>
                <span>Inside your computer</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-[#af101a] shrink-0" />
              <div>
                <strong className="text-gray-900 block font-bold">WhatsApp & Phone:</strong>
                <span>+60 11-6741 0881</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-[#af101a] shrink-0" />
              <div>
                <strong className="text-gray-900 block font-bold">Email Inquiry:</strong>
                <span>hello@cabai.enterprise.my</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6 pt-6">
        <div className="text-center">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_LIST.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed">
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
