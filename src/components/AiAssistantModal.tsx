import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Selamat datang! I am **Cabai AI**, your 3D printing engineer. Ask me anything about material selection (PLA vs PETG vs TPU), slicing advice, custom model estimates, or our signature products like the Cabai Keychain! 🌶️",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: "User is browsing CABAI ENTERPRISE 3D Printing Store catalog in Malaysia."
        })
      });

      const data = await response.json();
      const aiReply = data.reply || "Selamat datang! I am Cabai AI. How can I help with your 3D printing, materials (PLA/PETG/TPU), or custom orders today? 🌶️";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI assistant fallback mode:', err);
      // Smart Client-Side Knowledge Engine
      const p = textToSend.toLowerCase();
      let smartReply = "Selamat datang! I am **Cabai AI**, your 3D printing engineer at **CABAI ENTERPRISE™**.\n\n• **Materials:** Eco PLA+ (everyday decor), Tough PETG (heat resistant), TPU (flexible).\n• **Products:** Cabai Keychain (RM 6.90), Custom 3D Chili (RM 5.00), Custom Safety Namebadge (RM 5.00).\n• **Contact & WhatsApp:** +60 12-905 8515 | enterprise.cabai@gmail.com\n• **The Hall of Glory:** Kong Zi Teng (CEO), Lim Ee Fun (CFO), H'ng Kai Yii (Operations Manager), Li Yang (Lead 3D Specialist & Slicer)! 🌶️";

      if (p.includes('hall') || p.includes('glory') || p.includes('team') || p.includes('founder') || p.includes('leader')) {
        smartReply = "🏆 **The Hall of Glory at CABAI ENTERPRISE:**\n\n1. **Kong Zi Teng** — **CEO (Chief Executive Officer)**: Strategic leader & enterprise growth.\n2. **Lim Ee Fun** — **CFO (Chief Financial Officer)**: Financial management & pricing.\n3. **H'ng Kai Yii** — **Manager (Operations & Studio Logistics)**: Operations lead & fleet dispatch.\n4. **Li Yang** — **Lead 3D Print Specialist & CAD Artisan**: Master slicer & creator of the iconic Cabai Keychain 🌶️!";
      } else if (p.includes('badge') || p.includes('custom badge') || p.includes('namebadge')) {
        smartReply = "🛡️ **Custom 3D Safety Namebadge (RM 5.00):**\nOur circular safety namebadges are printed in rigid PLA with durable safety pin backings! Choose from 12+ pre-made templates (School, Medical, Corporate, Cyberpunk, Barista, etc.) or upload your own image!";
      } else if (p.includes('draw') || p.includes('chili') || p.includes('keychain')) {
        smartReply = "🌶️ **Draw Custom Chili (RM 5.00) & Cabai Keychain (RM 6.90):**\n• **Draw Custom Chili:** Draw your own art on canvas, add stamps/emojis, and 3D print in 100% PLA!\n• **Cabai Keychain:** Signature 3D printed chili pepper in vivid red Eco PLA+ with key ring!";
      } else if (p.includes('material') || p.includes('pla')) {
        smartReply = "🧵 **3D Printing Material Guide:**\n\n• **Eco PLA+ (Standard):** Crisp finish, bright colors, rigid and eco-friendly. Used for all our badges, keychains, and custom chili drawings.\n• **Tough PETG:** Heat and weather resistant up to 75°C for heavy-duty brackets.\n• **Flexible TPU:** Rubberized 95A for cable clips and bumper pads.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: smartReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Who is in The Hall of Glory? 🏆",
    "Studio Info & WhatsApp 📍",
    "Tell me about the Cabai Keychain 🌶️",
    "PLA vs PETG vs TPU material guide",
    "How does custom 3D printing work?"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1a1c1c] text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#af101a] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-white">Cabai AI Engineer</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                  <Cpu className="w-3 h-3 text-red-400" />
                  Gemini Server Backend
                </span>
              </div>
              <p className="text-xs text-gray-400">Instant 3D Slicing & Material Expert</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2.5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-gray-500 font-semibold shrink-0 pl-1">Ask Cabai AI:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-3 py-1 bg-white hover:bg-red-50 text-gray-700 hover:text-[#af101a] border border-gray-200 hover:border-red-200 rounded-full shrink-0 font-medium transition-colors shadow-2xs disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-[#af101a] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#1a1c1c] text-white rounded-tr-none shadow-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-xs'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-gray-400 text-right' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  YOU
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-gray-500 italic bg-white p-3 rounded-xl border border-gray-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-[#af101a]" />
              Consulting Cabai AI backend server...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Cabai AI about materials, prices, or custom 3D prints..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#af101a] focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-2.5 bg-[#af101a] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
