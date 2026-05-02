import { useEffect, useState } from 'react';
import { useApp } from '../App';

// Fabric cloth SVG animation paths for background
const FabricWave = () => (
  <svg viewBox="0 0 390 200" className="fabric-wave" preserveAspectRatio="none">
    <defs>
      <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#98FF98" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path d="M0,100 C50,60 100,140 150,100 C200,60 250,140 300,100 C350,60 390,90 390,100 L390,200 L0,200 Z" fill="url(#waveGrad)">
      <animate attributeName="d" dur="4s" repeatCount="indefinite"
        values="
          M0,100 C50,60 100,140 150,100 C200,60 250,140 300,100 C350,60 390,90 390,100 L390,200 L0,200 Z;
          M0,110 C60,80 110,130 160,95 C210,65 260,135 310,95 C360,55 390,100 390,110 L390,200 L0,200 Z;
          M0,100 C50,60 100,140 150,100 C200,60 250,140 300,100 C350,60 390,90 390,100 L390,200 L0,200 Z
        " />
    </path>
  </svg>
);

export default function SplashScreen() {
  const { navigate } = useApp();
  const [phase, setPhase] = useState(0); // 0: initial, 1: logo reveal, 2: tagline, 3: exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => navigate('onboarding'), 3400);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div className="splash-screen">
      <style>{`
        .splash-screen {
          width: 100%; height: 100%;
          background: linear-gradient(160deg, #001540 0%, #002366 45%, #0a3278 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .splash-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }
        .splash-orb-1 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(212,175,55,0.25), transparent);
          top: -80px; right: -80px;
          animation: float 5s ease-in-out infinite;
        }
        .splash-orb-2 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(152,255,152,0.15), transparent);
          bottom: 60px; left: -60px;
          animation: float 6s ease-in-out infinite reverse;
        }
        .splash-orb-3 {
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(212,175,55,0.15), transparent);
          bottom: 200px; right: 40px;
          animation: float 7s ease-in-out infinite;
        }
        .fabric-wave {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 200px;
          opacity: 0.6;
        }
        .splash-logo-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          opacity: 0; transform: scale(0.7);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }
        .splash-logo-wrap.visible {
          opacity: 1; transform: scale(1);
        }
        .splash-logo-icon {
          width: 96px; height: 96px;
          background: linear-gradient(135deg, #C9952A, #D4AF37, #E8C94A);
          border-radius: 28px;
          display: flex; align-items: center; justify-content: center;
          font-size: 44px;
          box-shadow: 0 8px 40px rgba(212,175,55,0.5), 0 2px 0 rgba(255,255,255,0.15) inset;
          position: relative;
          animation: goldGlow 2s ease-in-out infinite 1s;
        }
        .splash-logo-icon::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 31px;
          background: linear-gradient(135deg, rgba(212,175,55,0.4), transparent, rgba(212,175,55,0.4));
          z-index: -1;
        }
        .splash-brand {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px; font-weight: 900;
          color: white; letter-spacing: -0.5px;
        }
        .splash-brand span { color: #D4AF37; }
        .splash-tagline {
          opacity: 0; transform: translateY(10px);
          transition: all 0.6s ease 0.2s;
          text-align: center;
        }
        .splash-tagline.visible {
          opacity: 1; transform: translateY(0);
        }
        .splash-tagline p {
          color: rgba(255,255,255,0.7);
          font-size: 14px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 500;
        }
        .splash-dots {
          position: absolute;
          bottom: 60px;
          display: flex; gap: 8px;
          z-index: 10;
        }
        .splash-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          animation: pulse 1.5s ease-in-out infinite;
        }
        .splash-dot:nth-child(2) { animation-delay: 0.2s; }
        .splash-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />
      <FabricWave />

      <div className={`splash-logo-wrap ${phase >= 1 ? 'visible' : ''}`}>
        <div className="splash-logo-icon">🧺</div>
        <div className="splash-brand">Laundro<span>Lux</span></div>
      </div>

      <div className={`splash-tagline ${phase >= 2 ? 'visible' : ''}`}>
        <p>Premium AI Laundry Concierge</p>
      </div>

      <div className="splash-dots">
        <div className="splash-dot" />
        <div className="splash-dot" />
        <div className="splash-dot" />
      </div>
    </div>
  );
}
