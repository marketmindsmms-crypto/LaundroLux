import { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';

// NLP parser - rule-based fabric & item detection
const parseBookingQuery = (text) => {
  const lower = text.toLowerCase();
  const items = [];
  const patterns = [
    { regex: /(\d+)\s*(?:silk\s+)?saree[s]?/gi, name: 'Silk Saree', service: 'Couture Care', fabric: 'silk', price: 349 },
    { regex: /(\d+)\s*(?:cotton\s+)?shirt[s]?/gi, name: 'Cotton Shirt', service: 'Premium Wash', fabric: 'cotton', price: 89 },
    { regex: /(\d+)\s*(?:woolen?\s+)?suit[s]?/gi, name: 'Woolen Suit', service: 'Dry Cleaning', fabric: 'wool', price: 249 },
    { regex: /(\d+)\s*(?:denim\s+)?jean[s]?/gi, name: 'Denim Jeans', service: 'Premium Wash', fabric: 'denim', price: 99 },
    { regex: /(\d+)\s*(?:cotton\s+)?trouser[s]?/gi, name: 'Cotton Trousers', service: 'Premium Wash', fabric: 'cotton', price: 89 },
    { regex: /(\d+)\s*(?:silk\s+)?kurta[s]?/gi, name: 'Silk Kurta', service: 'Couture Care', fabric: 'silk', price: 199 },
    { regex: /(\d+)\s*(?:linen\s+)?shirt[s]?/gi, name: 'Linen Shirt', service: 'Premium Wash', fabric: 'linen', price: 109 },
  ];

  patterns.forEach(({ regex, name, service, fabric, price }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      items.push({ id: Date.now() + Math.random(), name, service, fabric, price, qty: parseInt(match[1]) || 1 });
    }
  });

  let pickupTime = 'Tonight 8:00 PM';
  const timeMatch = lower.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (timeMatch) pickupTime = timeMatch[1].toUpperCase();
  if (lower.includes('tonight')) pickupTime = `Tonight ${timeMatch ? timeMatch[1].toUpperCase() : '8:00 PM'}`;
  if (lower.includes('tomorrow')) pickupTime = `Tomorrow ${timeMatch ? timeMatch[1].toUpperCase() : '10:00 AM'}`;

  return { items, pickupTime };
};

const suggestions = [
  "5 shirts & 1 silk saree tonight at 8 PM",
  "2 woolen suits tomorrow morning",
];

const MANUAL_CATEGORIES = [
  { id: 'wash', name: 'Wash', sub: 'Everyday', icon: '👕', items: [
    { name: 'Cotton Shirt', price: 89, fabric: 'cotton' }, { name: 'T-shirt', price: 59, fabric: 'cotton' },
    { name: 'Denim Jeans', price: 99, fabric: 'denim' }, { name: 'Trousers', price: 89, fabric: 'cotton' }
  ]},
  { id: 'dryclean', name: 'Dry Clean', sub: 'Delicates', icon: '🧼', items: [
    { name: 'Suit (2 Piece)', price: 349, fabric: 'wool' }, { name: 'Jacket', price: 249, fabric: 'wool' },
    { name: 'Silk Blouse', price: 199, fabric: 'silk' }
  ]},
  { id: 'ethnic', name: 'Ethnic', sub: 'Saree Care', icon: '👗', items: [
    { name: 'Silk Saree', price: 349, fabric: 'silk' }, { name: 'Lehenga', price: 599, fabric: 'silk' },
    { name: 'Kurta', price: 199, fabric: 'cotton' }, { name: 'Sherwani', price: 499, fabric: 'silk' }
  ]},
  { id: 'couture', name: 'Couture', sub: 'Designer', icon: '✨', items: [
    { name: 'Designer Gown', price: 899, fabric: 'various' }, { name: 'Couture Suit', price: 999, fabric: 'various' }
  ]},
  { id: 'stain', name: 'Stain', sub: 'Removal', icon: '🔥', items: [
    { name: 'Tough Stain Service', price: 199, fabric: 'various' }
  ]},
  { id: 'shoes', name: 'Shoe Care', sub: 'Cleaning', icon: '👞', items: [
    { name: 'Sneakers', price: 299, fabric: 'various' }, { name: 'Leather Shoes', price: 399, fabric: 'various' }
  ]},
  { id: 'blanket', name: 'Blanket', sub: 'Winter Wear', icon: '🛏', items: [
    { name: 'Heavy Blanket', price: 499, fabric: 'cotton' }, { name: 'Quilt / Comforter', price: 599, fabric: 'cotton' }
  ]},
  { id: 'home', name: 'Curtains', sub: 'Carpet Care', icon: '🏠', items: [
    { name: 'Curtain Panel', price: 249, fabric: 'various' }, { name: 'Small Carpet', price: 599, fabric: 'various' }
  ]},
];

export default function BookingScreen() {
  const { navigate, addToBucket, setBucketOpen, bucketCount } = useApp();
  
  // 'select' | 'ai_mode' | 'manual_cats' | 'manual_items'
  const [step, setStep] = useState('select'); 
  const [query, setQuery] = useState('');
  const [parsed, setParsed] = useState(null);
  const [typing, setTyping] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [manualQtys, setManualQtys] = useState({});
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'ai', text: "Tell me what you need." }
  ]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typing]);

  // AI Flow
  const handleParse = (text) => {
    if (!text.trim()) return;
    
    setChatHistory(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setQuery('');
    setTyping(true);
    
    setTimeout(() => {
      const result = parseBookingQuery(text);
      if (result.items.length === 0) {
        result.items = [{ id: Date.now(), name: 'Cotton Shirt', service: 'Premium Wash', fabric: 'cotton', price: 89, qty: 1 }];
      }
      setParsed(result);
      setTyping(false);
      setChatHistory(prev => [
        ...prev, 
        { id: Date.now()+1, sender: 'ai', text: "Got it 👍 Here's your order:" },
        { id: Date.now()+2, sender: 'ai', type: 'card', payload: result }
      ]);
    }, 1200);
  };

  const handleSuggestion = (s) => {
    handleParse(s);
  };

  // Manual Flow
  const handleCatSelect = (cat) => {
    setSelectedCat(cat);
    setManualQtys({});
    setStep('manual_items');
  };

  const updateQty = (itemName, delta) => {
    setManualQtys(prev => {
      const current = prev[itemName] || 0;
      return { ...prev, [itemName]: Math.max(0, current + delta) };
    });
  };

  const handleContinueManual = () => {
    selectedCat.items.forEach(item => {
      const qty = manualQtys[item.name] || 0;
      for (let i = 0; i < qty; i++) {
        addToBucket({
          id: Date.now() + Math.random() + i,
          name: item.name,
          service: selectedCat.name,
          fabric: item.fabric,
          price: item.price,
          customizations: {}
        });
      }
    });
    setBucketOpen(true);
    navigate('home');
  };
  // Shared Review Flow
  const handleConfirmAI = () => {
    parsed.items.forEach(item => addToBucket(item));
    setBucketOpen(true);
    navigate('home'); // Go home, bucket is open over it
  };

  return (
    <div className="booking-screen">
      <style>{`
        .booking-screen {
          width: 100%; height: 100%; background: var(--off-white);
          overflow-y: auto; overflow-x: hidden; scrollbar-width: none; padding-bottom: 100px;
        }
        .booking-screen::-webkit-scrollbar { display: none; }
        .bk-header {
          background: linear-gradient(135deg, #001540, #002366);
          padding: 54px 24px 24px; position: relative; overflow: hidden;
          border-radius: 0 0 28px 28px;
        }
        .bk-header-bg { position: absolute; border-radius: 50%; background: rgba(212,175,55,0.08); width: 200px; height: 200px; top: -60px; right: -60px; }
        .bk-title { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800; color: white; margin-bottom: 6px; }
        .bk-sub { font-size: 14px; color: rgba(255,255,255,0.6); }
        
        /* Dual Selection */
        .dual-card {
          background: white; border-radius: 20px; padding: 24px; margin: 20px;
          box-shadow: 0 4px 20px rgba(0,35,102,0.08); cursor: pointer;
          transition: all 0.2s; border: 2px solid transparent; position: relative; overflow: hidden;
        }
        .dual-card:active { transform: scale(0.98); }
        .dual-card.ai-mode { border-color: rgba(212,175,55,0.4); background: linear-gradient(180deg, #fff, #fffbf0); }
        .ai-glow { position: absolute; width: 100px; height: 100px; background: rgba(212,175,55,0.15); filter: blur(20px); border-radius: 50%; top: -20px; right: -20px; }
        
        /* AI Input */
        .bk-input-area {
          background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 16px;
          display: flex; gap: 12px; align-items: flex-end; margin-top: 20px;
        }
        .bk-textarea {
          flex: 1; background: transparent; border: none; outline: none;
          color: white; font-size: 15px; font-family: 'Inter', sans-serif; resize: none; min-height: 56px;
        }
        .bk-textarea::placeholder { color: rgba(255,255,255,0.4); }
        .bk-send-btn {
          width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #D4AF37, #E8C94A);
          border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        
        /* Manual Categories */
        .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 20px; }
        .cat-card {
          background: white; border-radius: 18px; padding: 20px 16px; cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align: center; border: 1px solid rgba(0,0,0,0.04);
          transition: transform 0.2s;
        }
        .cat-card:active { transform: scale(0.96); }
        
        /* Manual Items */
        .item-list { padding: 20px; }
        .m-item {
          background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .add-m-btn {
          background: rgba(0,35,102,0.1); color: var(--navy); border: none; border-radius: 12px;
          padding: 8px 16px; font-weight: 800; cursor: pointer; transition: background 0.2s;
        }
        .add-m-btn:active { background: rgba(0,35,102,0.2); }
      `}</style>

      {/* HEADER */}
      <div className="bk-header">
        <div className="bk-header-bg" />
        {step === 'select' && (
          <>
            <div className="bk-title">How would you like to book?</div>
            <div className="bk-sub">Choose AI for speed, or Manual for full control.</div>
          </>
        )}
        {step === 'ai_mode' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <button style={{background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, padding: 0}} onClick={()=>setStep('select')}>← Back</button>
              <div style={{ color: 'white', fontWeight: 800 }}>AI Concierge</div>
              <div style={{ width: 40 }}></div>
            </div>
          </>
        )}
        {step === 'manual_cats' && (
          <>
            <button style={{background:'none', border:'none', color:'rgba(255,255,255,0.7)', marginBottom:10, fontSize:14}} onClick={()=>setStep('select')}>← Back</button>
            <div className="bk-title">Select Services</div>
            <div className="bk-sub">Customize every detail.</div>
          </>
        )}
        {step === 'manual_items' && selectedCat && (
          <>
            <button style={{background:'none', border:'none', color:'rgba(255,255,255,0.7)', marginBottom:10, fontSize:14}} onClick={()=>setStep('manual_cats')}>← Back to Categories</button>
            <div className="bk-title">{selectedCat.name}</div>
            <div className="bk-sub">Add items to your bucket.</div>
          </>
        )}

      </div>

      {/* STEP: SELECT MODE */}
      {step === 'select' && (
        <div>
          <div className="dual-card ai-mode" onClick={() => setStep('ai_mode')}>
            <div className="ai-glow" />
            <div style={{fontSize:32, marginBottom:10}}>✨</div>
            <div style={{fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:4}}>AI Quick Book <span style={{fontSize:11, background:'#D4AF37', color:'white', padding:'2px 6px', borderRadius:8, marginLeft:4}}>RECOMMENDED</span></div>
            <div style={{fontSize:13, color:'var(--text-muted)'}}>Describe your laundry in plain words. Fast & smart.</div>
          </div>
          <div className="dual-card" onClick={() => setStep('manual_cats')}>
            <div style={{fontSize:32, marginBottom:10}}>🧺</div>
            <div style={{fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:4}}>Manual Booking</div>
            <div style={{fontSize:13, color:'var(--text-muted)'}}>Browse categories, select items, and customize.</div>
          </div>
        </div>
      )}

      {/* STEP: AI MODE (CHAT UI) */}
      {step === 'ai_mode' && (
        <div style={{ padding: '20px 20px 120px', minHeight: '100%', boxSizing: 'border-box' }}>
          {chatHistory.map(msg => (
            <div key={msg.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.type === 'card' ? (
                <div style={{ background: 'white', borderRadius: 20, padding: 20, width: '100%', maxWidth: 320, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 15, color: 'var(--text-primary)' }}>🧺 Order Summary</div>
                  
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Items:</div>
                  {msg.payload.items.map(item => (
                    <div key={item.id} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>• {item.name} ×{item.qty}</div>
                  ))}
                  
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, marginBottom: 4 }}>Service:</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>• {msg.payload.items[0]?.service || 'Premium Wash'}</div>

                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, marginBottom: 4 }}>Pickup:</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>• {msg.payload.pickupTime}</div>

                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, marginBottom: 4 }}>Delivery:</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>• Standard (24 hrs)</div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button style={{ flex: 1, padding: 12, background: 'var(--gray-100)', color: 'var(--text-primary)', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }} onClick={() => { setChatHistory(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Sure, what would you like to change?' }]); setParsed(null); }}>Edit</button>
                    <button style={{ flex: 2, padding: 12, background: 'linear-gradient(135deg, #002366, #0a3278)', color: 'white', borderRadius: 12, fontWeight: 800, border: 'none', cursor: 'pointer' }} onClick={handleConfirmAI}>Confirm</button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #002366, #0a3278)' : 'white', 
                  color: msg.sender === 'user' ? 'white' : 'var(--text-primary)', 
                  padding: '12px 16px', borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  maxWidth: '80%', fontSize: 14, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {msg.sender === 'ai' && <span style={{ fontSize: 18 }}>🤖</span>}
                  <span>{msg.text}</span>
                </div>
              )}
            </div>
          ))}
          
          {typing && (
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ background: 'white', padding: '12px 16px', borderRadius: '20px 20px 20px 4px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>Typing...</span>
              </div>
            </div>
          )}

          {!parsed && chatHistory.length === 1 && (
            <div style={{ marginTop: 24, paddingLeft: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: 1 }}>SUGGESTIONS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => handleSuggestion(s)} style={{ background: 'white', padding: '10px 14px', borderRadius: 20, fontSize: 13, border: '1px solid var(--gray-200)', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>💡 {s}</div>
                ))}
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      )}

      {/* CHAT INPUT BAR */}
      {step === 'ai_mode' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 20px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 12, alignItems: 'center', zIndex: 100 }}>
          <div style={{ flex: 1, background: 'var(--off-white)', borderRadius: 24, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--gray-200)' }}>
            <span style={{ fontSize: 18 }}>🎤</span>
            <input 
              type="text" 
              placeholder="Type your request..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleParse(query)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Inter, sans-serif' }} 
            />
          </div>
          <button 
            style={{ width: 48, height: 48, borderRadius: 24, background: 'linear-gradient(135deg, #D4AF37, #E8C94A)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', opacity: (!query.trim() || typing) ? 0.5 : 1 }}
            onClick={() => handleParse(query)}
            disabled={!query.trim() || typing}
          >
            ➤
          </button>
        </div>
      )}

      {/* STEP: MANUAL CATS */}
      {step === 'manual_cats' && (
        <div className="cat-grid">
          {MANUAL_CATEGORIES.map(cat => (
            <div key={cat.id} className="cat-card" onClick={() => handleCatSelect(cat)} style={{ textAlign: 'left', padding: '18px 16px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{cat.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{cat.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* STEP: MANUAL ITEMS */}
      {step === 'manual_items' && selectedCat && (
        <div className="item-list" style={{ paddingBottom: 140 }}>
          {selectedCat.items.map((item, idx) => (
            <div key={idx} className="m-item">
              <div>
                <div style={{fontWeight:800, fontSize:15, color:'var(--text-primary)'}}>{item.name}</div>
                <div style={{fontSize:13, color:'var(--text-muted)', marginTop:2}}>{item.fabric} • ₹{item.price}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gray-100)', border: 'none', fontSize: 16, fontWeight: 800, color: 'var(--navy)', cursor: 'pointer' }} onClick={() => updateQty(item.name, -1)}>-</button>
                <span style={{ fontSize: 16, fontWeight: 800, width: 20, textAlign: 'center' }}>{manualQtys[item.name] || 0}</span>
                <button style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--navy)', border: 'none', fontSize: 16, fontWeight: 800, color: 'white', cursor: 'pointer' }} onClick={() => updateQty(item.name, 1)}>+</button>
              </div>
            </div>
          ))}

          {(() => {
            const selectedItemsCount = selectedCat.items.reduce((sum, item) => sum + (manualQtys[item.name] || 0), 0);
            const selectedItemsTotal = selectedCat.items.reduce((sum, item) => sum + (manualQtys[item.name] || 0) * item.price, 0);

            if (selectedItemsCount === 0) return null;

            return (
              <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 20, background: 'white', borderTop: '1px solid var(--gray-200)', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }}>Estimated Price:</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>₹{selectedItemsTotal}</span>
                </div>
                <button style={{width:'100%', padding:16, background:'linear-gradient(135deg, #002366, #0a3278)', color:'white', borderRadius:16, fontWeight:800, border:'none', fontSize:16, boxShadow:'0 4px 15px rgba(0,35,102,0.2)', cursor: 'pointer'}} onClick={handleContinueManual}>
                  Continue ({selectedItemsCount} items)
                </button>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
