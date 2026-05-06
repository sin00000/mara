import { motion } from 'framer-motion';
import SteamEffect from '../components/SteamEffect';

// Precomputed stable particle positions (avoid Math.random in render)
const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const s = i * 17;
  const r = (n) => { const x = Math.sin(n) * 10000; return x - Math.floor(x); };
  return {
    w: 2 + r(s) * 4,
    left: r(s + 1) * 100,
    top: r(s + 2) * 100,
    dur: 3 + r(s + 3) * 4,
    delay: r(s + 4) * 3,
    color: `rgba(${Math.round(200 + r(s + 5) * 55)}, ${Math.round(r(s + 6) * 20)}, 0, 0.65)`,
  };
});

export default function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 62%, #2d0606 0%, #0c0000 55%, #000000 100%)' }}>

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(180,0,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,0,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Ambient red particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute',
            width: p.w, height: p.w,
            borderRadius: '50%',
            background: p.color,
            left: `${p.left}%`,
            top: `${p.top}%`,
            zIndex: 1,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.25, 0.8, 0.25] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Pulse rings */}
      {[400, 620].map((sz, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', width: sz, height: sz, borderRadius: '50%',
            border: '1px solid rgba(200,0,0,' + (i === 0 ? '0.14' : '0.07') + ')',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      {/* Bowl hero */}
      <motion.div
        initial={{ scale: 0.72, opacity: 0, y: 44 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 5, marginBottom: 20 }}
      >
        {/* Steam */}
        <div style={{ position: 'relative', height: 90 }}>
          <SteamEffect count={8} intensity={1.6} className="w-full h-full" />
        </div>

        {/* Bowl body */}
        <div style={{
          width: 190, height: 95,
          background: 'linear-gradient(175deg, #1d0000 0%, #0e0000 100%)',
          borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          border: '2px solid #3d0909',
          boxShadow: '0 10px 40px rgba(0,0,0,0.85), inset 0 -12px 24px rgba(0,0,0,0.6), 0 0 50px rgba(200,0,0,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Soup */}
          <div style={{
            position: 'absolute', inset: '7px 7px 0 7px',
            background: 'radial-gradient(ellipse at 42% 32%, #d42c2c 0%, #810000 45%, #4a0000 100%)',
            borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          }}>
            {/* Oil shimmer */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-60%',
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,140,0,0.12) 40deg, transparent 80deg, rgba(255,80,0,0.08) 180deg, transparent 220deg, rgba(255,150,0,0.10) 300deg, transparent 360deg)',
              }}
            />
            {/* Gloss highlights */}
            {[
              { top: '18%', left: '28%', w: 14, h: 8 },
              { top: '38%', left: '58%', w: 9, h: 5 },
              { top: '55%', left: '20%', w: 7, h: 4 },
            ].map((s, i) => (
              <motion.div key={i}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.7 }}
                style={{
                  position: 'absolute', top: s.top, left: s.left,
                  width: s.w, height: s.h, borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), rgba(255,200,80,0.3) 50%, transparent)',
                }}
              />
            ))}
            {/* Chili flakes */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                position: 'absolute',
                width: 4 + (i % 3), height: 2 + (i % 2),
                borderRadius: 1,
                background: '#8b0000',
                top: `${18 + i * 11}%`,
                left: `${12 + i * 13}%`,
                transform: `rotate(${i * 42}deg)`,
                opacity: 0.8,
              }} />
            ))}
          </div>
          {/* Rim specular */}
          <div style={{
            position: 'absolute', top: 0, left: '12%', width: '76%', height: 4,
            background: 'rgba(255,255,255,0.07)', borderRadius: 4,
          }} />
        </div>

        {/* Bowl rim */}
        <div style={{
          width: 210, height: 22,
          background: 'linear-gradient(180deg, #411212, #210808)',
          borderRadius: 11,
          margin: '-11px auto 0',
          boxShadow: '0 5px 16px rgba(0,0,0,0.65)',
          position: 'relative', zIndex: 2,
        }}>
          <div style={{
            position: 'absolute', top: 4, left: '10%', width: '80%', height: 3,
            background: 'rgba(255,255,255,0.07)', borderRadius: 3,
          }} />
        </div>
      </motion.div>

      {/* Title block */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', zIndex: 5, padding: '0 20px' }}
      >
        <div style={{
          fontSize: '0.7rem', letterSpacing: '0.4em', color: '#ff4500',
          marginBottom: 8, fontFamily: 'monospace', textTransform: 'uppercase',
        }}>
          ─── 사이버 미식 체험 ───
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 9vw, 4.8rem)', fontWeight: 900,
          letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6,
          background: 'linear-gradient(180deg, #ff7043 0%, #c62828 42%, #8b0000 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 22px rgba(200,0,0,0.55))',
        }}>
          사이버
        </h1>
        <h1 style={{
          fontSize: 'clamp(2.8rem, 9vw, 4.8rem)', fontWeight: 900,
          letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 12,
          background: 'linear-gradient(180deg, #ffffff 0%, #ffd0cc 42%, #ff4500 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 22px rgba(255,100,0,0.45))',
        }}>
          마라탕
        </h1>
        <div style={{ fontSize: '1.4rem', letterSpacing: '0.12em', color: '#cc2200', marginBottom: 4, fontFamily: 'serif' }}>
          赛博麻辣烫
        </div>

        <p style={{
          fontSize: '0.85rem', color: 'rgba(255,155,105,0.72)', maxWidth: 300,
          margin: '0 auto 32px', lineHeight: 1.65, letterSpacing: '0.04em',
        }}>
          영화 같은 매운 의식이 기다린다.<br />
          나만의 그릇을 만들어라. 마라를 버텨라.
        </p>

        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 0 44px rgba(200,0,0,0.75)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #8b0000, #c62828, #8b0000)',
            border: '1px solid rgba(255,110,60,0.4)',
            color: '#fff', padding: '15px 52px', borderRadius: 4,
            fontSize: '1rem', fontWeight: 700, letterSpacing: '0.18em',
            cursor: 'pointer', textTransform: 'uppercase',
            boxShadow: '0 0 22px rgba(200,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.1)',
            fontFamily: 'monospace',
          }}
        >
          의식을 시작하라
        </motion.button>

        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ marginTop: 22, color: 'rgba(200,80,50,0.4)', fontSize: '0.68rem', letterSpacing: '0.3em', fontFamily: 'monospace' }}
        >
          위로 스와이프하여 입장
        </motion.div>
      </motion.div>
    </div>
  );
}
