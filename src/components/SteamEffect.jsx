import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Three tiers: wispy fast strands, medium puffs, slow billowing clouds
const TIERS = [
  { count: 4, minW: 5,  maxW: 9,  blurMin: 3, blurMax: 5,  durMin: 1.6, durMax: 2.4, opMax: 0.55, rise: 90,  sway: 10 },
  { count: 4, minW: 10, maxW: 18, blurMin: 5, blurMax: 9,  durMin: 2.6, durMax: 3.6, opMax: 0.45, rise: 110, sway: 16 },
  { count: 3, minW: 20, maxW: 32, blurMin: 9, blurMax: 14, durMin: 3.8, durMax: 5.2, opMax: 0.30, rise: 130, sway: 22 },
];

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function SteamEffect({ count = 5, intensity = 1, className = '' }) {
  const particles = useMemo(() => {
    const list = [];
    let pid = 0;
    TIERS.forEach((tier, ti) => {
      const n = Math.max(1, Math.round(tier.count * (count / 5)));
      for (let i = 0; i < n; i++) {
        const s = pid * 7 + ti * 31 + i * 13;
        const w = tier.minW + seededRand(s) * (tier.maxW - tier.minW);
        const blur = tier.blurMin + seededRand(s + 1) * (tier.blurMax - tier.blurMin);
        const dur = tier.durMin + seededRand(s + 2) * (tier.durMax - tier.durMin);
        const delay = seededRand(s + 3) * dur;
        const x0 = 15 + seededRand(s + 4) * 70;
        const swayDir = seededRand(s + 5) > 0.5 ? 1 : -1;
        const swayAmt = tier.sway * (0.5 + seededRand(s + 6) * 0.8);
        const rise = tier.rise * (0.7 + seededRand(s + 7) * 0.6) * intensity;
        const opMax = tier.opMax * intensity;
        list.push({ id: pid++, w, blur, dur, delay, x0, swayDir, swayAmt, rise, opMax, tier: ti });
      }
    });
    return list;
  }, [count, intensity]);

  return (
    <div className={`absolute pointer-events-none ${className}`}
      style={{ zIndex: 10, inset: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x0}%`,
            bottom: 0,
            width: p.w,
            height: p.w * 1.8,
            borderRadius: '50%',
            background: p.tier === 0
              ? `radial-gradient(ellipse, rgba(255,240,230,${p.opMax}) 0%, transparent 70%)`
              : p.tier === 1
              ? `radial-gradient(ellipse, rgba(255,255,255,${p.opMax}) 0%, rgba(240,220,200,${p.opMax * 0.5}) 50%, transparent 80%)`
              : `radial-gradient(ellipse, rgba(255,255,255,${p.opMax}) 0%, rgba(220,200,180,${p.opMax * 0.3}) 60%, transparent 90%)`,
            filter: `blur(${p.blur}px)`,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -p.rise * 0.4, -p.rise],
            x: [0, p.swayDir * p.swayAmt * 0.5, p.swayDir * p.swayAmt, p.swayDir * p.swayAmt * 0.3, -p.swayDir * p.swayAmt * 0.4],
            scaleX: [1, 1.3 + p.tier * 0.3, 1.8 + p.tier * 0.5, 2.4 + p.tier * 0.4],
            scaleY: [1, 0.95, 0.85, 0.7],
            opacity: [0, p.opMax, p.opMax * 0.7, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}
