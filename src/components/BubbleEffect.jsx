import { motion } from 'framer-motion';
import { useMemo } from 'react';

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Ripple ring that appears when a bubble pops at the surface
function BubbleRipple({ x, color, delay, duration }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: '8%',
        width: 10,
        height: 5,
        borderRadius: '50%',
        border: `1px solid ${color}66`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
      animate={{
        scale: [0.5, 3.5, 5],
        opacity: [0.7, 0.3, 0],
        width: [10, 10, 10],
      }}
      transition={{
        duration: duration * 0.8,
        delay: delay + duration * 0.6,
        repeat: Infinity,
        repeatDelay: duration * 0.2,
        ease: 'easeOut',
      }}
    />
  );
}

export default function BubbleEffect({ count = 8, color = '#c62828', className = '' }) {
  const bubbles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const s = i * 17;
      return {
        id: i,
        x: 8 + seededRand(s) * 84,
        size: 3 + seededRand(s + 1) * 11,
        delay: seededRand(s + 2) * 2.5,
        duration: 0.8 + seededRand(s + 3) * 1.8,
        startDepth: 15 + seededRand(s + 4) * 50,
        wobble: (seededRand(s + 5) - 0.5) * 6,
      };
    }),
    [count]
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            bottom: `${b.startDepth}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            // Transparent bubble with bright specular + rim
            background: `radial-gradient(circle at 33% 28%,
              rgba(255,255,255,0.65) 0%,
              rgba(255,255,255,0.18) 25%,
              ${color}22 55%,
              transparent 75%
            )`,
            border: `1px solid ${color}55`,
            boxShadow: `inset 0 -1px 2px rgba(255,255,255,0.3), 0 0 4px ${color}33`,
          }}
          animate={{
            y: [0, -(b.startDepth * 2.2)],
            x: [0, b.wobble, -b.wobble * 0.5, b.wobble * 0.3, 0],
            scale: [0.6, 1, 1.05, 0.9, 0.3],
            opacity: [0, 0.95, 0.85, 0.5, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Surface ripples where large bubbles pop */}
      {bubbles.filter(b => b.size > 9).map(b => (
        <BubbleRipple
          key={`ripple-${b.id}`}
          x={b.x}
          color={color}
          delay={b.delay}
          duration={b.duration}
        />
      ))}
    </div>
  );
}
