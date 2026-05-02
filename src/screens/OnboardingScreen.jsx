import { useState } from 'react';
import { useApp } from '../App';

const slides = [
  {
    emoji: '⏱️',
    title: 'Your Time is Priceless',
    subtitle: 'Premium laundry picked up and delivered at your schedule. No waiting, no hassle.',
    bg: 'linear-gradient(160deg, #002366 0%, #001540 100%)',
    accent: '#D4AF37',
    illustration: '🕐',
  },
  {
    emoji: '🤖',
    title: 'AI-Powered Fabric Care',
    subtitle: 'Advanced fabric analysis ensures every garment gets the treatment it deserves.',
    bg: 'linear-gradient(160deg, #001A4D 0%, #002366 100%)',
    accent: '#98FF98',
    illustration: '🧬',
  },
  {
    emoji: '🚗',
    title: 'Pickup & Delivery at Your Convenience',
    subtitle: 'Schedule pickups in seconds. Track your order live. Delivered fresh to your door.',
    bg: 'linear-gradient(160deg, #001540 0%, #003399 100%)',
    accent: '#D4AF37',
    illustration: '📦',
  },
];

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'Hindi' },
  { code: 'ta', label: 'த', name: 'Tamil' },
  { code: 'kn', label: 'ಕ', name: 'Kannada' },
  { code: 'bn', label: 'বাং', name: 'Bengali' },
  { code: 'mr', label: 'म', name: 'Marathi' },
];

export default function OnboardingScreen() {
  const { navigate, setLanguage, language } = useApp();
  const [current, setCurrent] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  const next = () => {
    if (current < slides.length - 1) {
      setExiting(true);
      setTimeout(() => { setCurrent(c => c + 1); setExiting(false); }, 250);
    } else {
      navigate('login');
    }
  };

  const skip = () => navigate('login');

  const slide = slides[current];

  return (
    <div className="onboarding-screen" style={{ background: slide.bg }}>
      <style>{`
        .onboarding-screen {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: background 0.5s ease;
        }
        .ob-lang-btn {
          position: absolute; top: 54px; right: 24px; z-index: 20;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 8px 16px;
          color: white; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none;
          display: flex; align-items: center; gap: 6px;
        }
        .lang-dropdown {
          position: absolute; top: 90px; right: 16px; z-index: 100;
          background: white; border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.25);
          overflow: hidden; animation: scaleIn 0.2s ease;
          transform-origin: top right;
        }
        .lang-option {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px; cursor: pointer;
          font-size: 14px; font-weight: 500;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.15s;
        }
        .lang-option:last-child { border-bottom: none; }
        .lang-option:hover { background: #f8f8f8; }
        .lang-option.active { color: #002366; font-weight: 700; }
        .lang-code { 
          width: 32px; height: 32px; border-radius: 50%;
          background: #002366; color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
        }
        .ob-illustration {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          padding-top: 80px;
        }
        .ob-main-icon {
          font-size: 80px;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 8px 20px rgba(0,0,0,0.2));
        }
        .ob-circles {
          position: absolute; pointer-events: none;
        }
        .ob-circle {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ob-content {
          padding: 24px 32px 40px;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .ob-content.exiting {
          opacity: 0; transform: translateX(-20px);
        }
        .ob-slide-tag {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 12px;
          transition: color 0.5s ease;
        }
        .ob-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px; font-weight: 800;
          color: white; line-height: 1.15; margin-bottom: 14px;
          letter-spacing: -0.5px;
        }
        .ob-subtitle {
          font-size: 15px; color: rgba(255,255,255,0.65);
          line-height: 1.6; margin-bottom: 32px;
        }
        .ob-progress {
          display: flex; align-items: center; gap: 8px; margin-bottom: 24px;
        }
        .ob-pip {
          height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }
        .ob-pip.active {
          background: white; flex: 1 !important;
        }
        .ob-actions {
          display: flex; gap: 12px; align-items: center;
        }
        .ob-next-btn {
          flex: 1; padding: 16px;
          border: none; cursor: pointer;
          border-radius: 50px;
          font-size: 16px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ob-next-btn:active { transform: scale(0.97); }
        .ob-skip-btn {
          padding: 16px 20px; border: none;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); border-radius: 50px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .ob-skip-btn:hover { background: rgba(255,255,255,0.2); }
        .ob-bg-circle {
          position: absolute; border-radius: 50%;
          opacity: 0.06;
        }
      `}</style>

      {/* Background decorative circles */}
      <div className="ob-bg-circle" style={{ width: 400, height: 400, background: 'white', top: -100, right: -100 }} />
      <div className="ob-bg-circle" style={{ width: 200, height: 200, background: 'white', bottom: 200, left: -60 }} />

      {/* Language button */}
      <button className="ob-lang-btn" onClick={() => setLangOpen(!langOpen)}>
        🌐 {languages.find(l => l.code === language)?.label}
      </button>

      {langOpen && (
        <div className="lang-dropdown">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`lang-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
            >
              <div className="lang-code">{lang.label}</div>
              {lang.name}
            </div>
          ))}
        </div>
      )}

      {/* Illustration area */}
      <div className="ob-illustration">
        <div className="ob-main-icon">{slide.emoji}</div>
        <div style={{ fontSize: 120, opacity: 0.05, position: 'absolute', top: 80 }}>{slide.illustration}</div>
      </div>

      {/* Content */}
      <div className={`ob-content ${exiting ? 'exiting' : ''}`}>
        <div className="ob-slide-tag" style={{ color: slide.accent }}>
          Step {current + 1} of {slides.length}
        </div>
        <h2 className="ob-title">{slide.title}</h2>
        <p className="ob-subtitle">{slide.subtitle}</p>

        {/* Progress pips */}
        <div className="ob-progress">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`ob-pip ${i === current ? 'active' : ''}`}
              style={{ flex: i === current ? 1 : '0 0 20px' }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="ob-actions">
          {current < slides.length - 1 && (
            <button className="ob-skip-btn" onClick={skip}>Skip</button>
          )}
          <button
            className="ob-next-btn"
            onClick={next}
            style={{
              background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}CC)`,
              color: current === 0 ? '#002366' : '#001540',
            }}
          >
            {current < slides.length - 1 ? 'Continue' : 'Get Started'} →
          </button>
        </div>
      </div>
    </div>
  );
}
