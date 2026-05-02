import { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';

const BOT_RESPONSES = {
  address: {
    keywords: ['address', 'location', 'change address', 'different address', 'new address'],
    reply: "Sure! I can update your pickup address. Would you like to use your saved addresses or enter a new one?",
    chips: ['Use Home Address', 'Use Office Address', 'Enter New Address']
  },
  reschedule: {
    keywords: ['reschedule', 'change time', 'different time', 'postpone', 'delay'],
    reply: "No problem! I can reschedule your pickup. Available slots for today are 5 PM, 7 PM, and 9 PM. Which works for you?",
    chips: ['5:00 PM', '7:00 PM', '9:00 PM', 'Tomorrow Morning']
  },
  stain: {
    keywords: ['stain', 'spot', 'mark', 'dirty', 'spill', 'ink', 'oil', 'wine'],
    reply: "For tough stains, here's expert advice:\n\n• **Coffee/Tea**: Blot immediately, cold water\n• **Oil**: Apply cornstarch, wait 15 min\n• **Ink**: Dab with rubbing alcohol\n• **Wine**: Salt immediately, then cold water\n\nOur experts will handle remaining stains during cleaning! 🧪",
    chips: ['Coffee Stain', 'Oil Stain', 'Ink Mark', 'Book Pickup']
  },
  tracking: {
    keywords: ['track', 'where', 'status', 'update', 'order', 'when'],
    reply: "Your order #LL-2847 is currently being **Expert Cleaned** at our facility. Estimated delivery: 9:00 PM tonight 🌙",
    chips: ['View Live Map', 'Call Driver', 'Order Details']
  },
  greeting: {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'],
    reply: "Namaste! 🙏 I'm LaundroBot, your personal laundry concierge. How can I help you today?",
    chips: ['Track My Order', 'Change Address', 'Stain Removal Help', 'Reschedule Pickup']
  },
  pricing: {
    keywords: ['price', 'cost', 'rate', 'how much', 'charges', 'fee'],
    reply: "Here's our pricing:\n\n🧥 Dry Cleaning — from ₹149\n👕 Premium Wash — from ₹89\n♨️ Steam Press — from ₹49\n👘 Couture Care — from ₹349\n\nPlatinum members get 20% off! ⭐",
    chips: ['Book Now', 'View Full Pricing', 'Membership Perks']
  },
  default: {
    reply: "I understand! Let me connect you with our support team for this. Meanwhile, is there anything else I can help with?",
    chips: ['Track Order', 'Change Address', 'Stain Help', 'Pricing']
  }
};

const getBotResponse = (text) => {
  const lower = text.toLowerCase();
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (key === 'default') continue;
    const entry = BOT_RESPONSES[key];
    if (entry.keywords?.some(kw => lower.includes(kw))) return entry;
  }
  return BOT_RESPONSES.default;
};

const initialMessages = [
  { id: 1, from: 'bot', text: "Namaste! 🙏 I'm **LaundroBot**, your AI laundry concierge.\n\nHow can I help you today?", time: '2:30 PM' },
];

export default function ChatbotScreen() {
  const { navigate } = useApp();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [quickChips, setQuickChips] = useState(['Track My Order', 'Change Address', 'Stain Help', 'Reschedule Pickup']);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setQuickChips([]);

    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg = { id: Date.now() + 1, from: 'bot', text: response.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
      if (response.chips) setQuickChips(response.chips);
    }, 1200 + Math.random() * 600);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <div key={i} dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} style={{ lineHeight: 1.6 }} />;
    });
  };

  return (
    <div className="chatbot-screen">
      <style>{`
        .chatbot-screen {
          width: 100%; height: 100%;
          background: var(--off-white);
          display: flex; flex-direction: column;
        }
        .cb-header {
          background: linear-gradient(135deg, #001540, #002366);
          padding: 54px 20px 16px;
          display: flex; align-items: center; gap: 14px;
          flex-shrink: 0;
        }
        .cb-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #E8C94A);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0; position: relative;
          box-shadow: 0 4px 16px rgba(212,175,55,0.4);
        }
        .cb-online-dot {
          position: absolute; bottom: 2px; right: 2px;
          width: 12px; height: 12px; background: #34C759;
          border-radius: 50%; border: 2px solid #001540;
          animation: pulse 2s infinite;
        }
        .cb-info { flex: 1; }
        .cb-name { font-size: 17px; font-weight: 800; color: white; font-family: 'Montserrat', sans-serif; }
        .cb-status { font-size: 12px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 6px; margin-top: 2px; }
        .messages-area {
          flex: 1; overflow-y: auto; padding: 20px 16px 10px;
          display: flex; flex-direction: column; gap: 12px;
          scrollbar-width: none;
        }
        .messages-area::-webkit-scrollbar { display: none; }
        .msg-row {
          display: flex; gap: 8px; align-items: flex-end;
          animation: slideUp 0.3s ease;
        }
        .msg-row.user { flex-direction: row-reverse; }
        .msg-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .msg-bubble {
          max-width: 78%; padding: 12px 16px;
          border-radius: 20px; font-size: 14px; line-height: 1.5;
        }
        .msg-bubble.bot {
          background: white; color: var(--text-primary);
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .msg-bubble.user {
          background: linear-gradient(135deg, #002366, #0a3278);
          color: white; border-bottom-right-radius: 6px;
        }
        .msg-time { font-size: 10px; color: var(--text-muted); margin-top: 4px; text-align: right; }
        .typing-bubble {
          background: white; border-radius: 20px; border-bottom-left-radius: 6px;
          padding: 14px 18px; display: flex; gap: 5px; align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          animation: slideUp 0.3s ease;
        }
        .t-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--navy);
          animation: bounce 1s ease-in-out infinite;
        }
        .t-dot:nth-child(2) { animation-delay: 0.2s; }
        .t-dot:nth-child(3) { animation-delay: 0.4s; }
        .quick-chips-row {
          padding: 8px 16px 12px; display: flex; gap: 8px;
          overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
        }
        .quick-chips-row::-webkit-scrollbar { display: none; }
        .quick-chip {
          background: white; border: 1.5px solid var(--gray-200);
          border-radius: 20px; padding: 8px 14px; white-space: nowrap;
          font-size: 13px; font-weight: 600; color: var(--navy);
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .quick-chip:active { background: var(--navy); color: white; border-color: var(--navy); transform: scale(0.96); }
        .input-bar {
          padding: 12px 16px; background: white;
          border-top: 1px solid var(--gray-200);
          display: flex; gap: 10px; align-items: flex-end;
          flex-shrink: 0; padding-bottom: 96px;
        }
        .cb-input {
          flex: 1; background: var(--gray-100); border: 2px solid transparent;
          border-radius: 20px; padding: 12px 16px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; resize: none; max-height: 80px;
          transition: all 0.2s; line-height: 1.4;
        }
        .cb-input:focus { background: white; border-color: var(--navy); }
        .cb-send {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #002366, #0a3278);
          border: none; cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(0,35,102,0.3);
        }
        .cb-send:active { transform: scale(0.88); }
        .cb-mic {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--gray-100); border: none; cursor: pointer;
          font-size: 18px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
        }
        .cb-mic:active { background: var(--gold); transform: scale(0.9); }
      `}</style>

      {/* Header */}
      <div className="cb-header">
        <div className="cb-avatar">
          🤖
          <div className="cb-online-dot" />
        </div>
        <div className="cb-info">
          <div className="cb-name">LaundroBot</div>
          <div className="cb-status">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759' }} />
            Online — AI Powered Concierge
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
          <div style={{ fontWeight: 700, color: '#D4AF37', fontSize: 12 }}>NLP v2.1</div>
          Powered by AI
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`msg-row ${msg.from}`}>
            {msg.from === 'bot' && (
              <div className="msg-avatar" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C94A)' }}>🤖</div>
            )}
            <div>
              <div className={`msg-bubble ${msg.from}`}>{renderText(msg.text)}</div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="msg-row">
            <div className="msg-avatar" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C94A)' }}>🤖</div>
            <div className="typing-bubble">
              <div className="t-dot" /><div className="t-dot" /><div className="t-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Chips */}
      {quickChips.length > 0 && (
        <div className="quick-chips-row">
          {quickChips.map((chip, i) => (
            <div key={i} className="quick-chip" onClick={() => sendMessage(chip)}>{chip}</div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="input-bar">
        <button className="cb-mic">🎙️</button>
        <textarea
          className="cb-input"
          placeholder="Ask anything about your laundry..."
          value={input}
          rows={1}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
        />
        <button className="cb-send" onClick={() => sendMessage(input)} disabled={!input.trim()}>➤</button>
      </div>
    </div>
  );
}
