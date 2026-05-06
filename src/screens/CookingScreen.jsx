import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberPot from '../components/CyberPot';
import SteamEffect from '../components/SteamEffect';
import { SOUP_TYPES, SPICE_LEVELS } from '../data/ingredients';

const COOKING_STAGES = [
  { duration: 1200, message: '화구 점화 중...', submsg: '点火中', progress: 5 },
  { duration: 1500, message: '육수가 끓어오른다...', submsg: '汤底沸腾', progress: 20 },
  { duration: 1500, message: '고추 기름 투입...', submsg: '加入辣椒油', progress: 38 },
  { duration: 1500, message: '화자오 향이 피어오른다...', submsg: '花椒麻香', progress: 52 },
  { duration: 1500, message: '재료들이 뛰어든다...', submsg: '食材入锅', progress: 65 },
  { duration: 1500, message: '마라 마법 활성화...', submsg: '麻辣激活', progress: 80 },
  { duration: 1500, message: '거의 완성됐다...', submsg: '即将完成', progress: 95 },
  { duration: 1000, message: '✦ 완성 ✦', submsg: '完成', progress: 100 },
];

// Precomputed oil drops so positions are stable across renders
const OIL_DROPS = [
  { left: '22%', delay: 0.2 },
  { left: '48%', delay: 0.55 },
  { left: '68%', delay: 0.85 },
  { left: '35%', delay: 1.25 },
];

function ChiliOilDrop({ drop, soupColor }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 7, height: 12,
        borderRadius: '50% 50% 55% 55% / 40% 40% 60% 60%',
        background: `radial-gradient(circle at 35% 28%, rgba(255,210,60,0.6), ${soupColor}dd)`,
        top: '-12%',
        left: drop.left,
        boxShadow: `0 0 6px ${soupColor}88`,
      }}
      animate={{
        y: ['0%', '130%'],
        scaleX: [1, 0.75, 1.3, 1],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.3,
        delay: drop.delay,
        repeat: Infinity,
        repeatDelay: 2.2,
        ease: 'easeIn',
      }}
    />
  );
}

// Precomputed spice particles
const SPICE_PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const s = i * 13;
  const r = (n) => { const x = Math.sin(n) * 10000; return x - Math.floor(x); };
  const colors = ['#c62828', '#ff5722', '#ff9800', '#e91e63', '#8b0000'];
  return {
    col: colors[i % colors.length],
    w: 4 + r(s) * 6,
    h: 2 + r(s + 1) * 3,
    left: r(s + 2) * 100,
    dx: (r(s + 3) - 0.5) * 90,
    dy: 60 + r(s + 4) * 90,
    rot: (r(s + 5) - 0.5) * 360,
    dur: 1 + r(s + 6) * 0.8,
    delay: i * 0.15,
    repeatDelay: r(s + 7) * 2,
  };
});

function SpiceParticle({ p }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: p.w, height: p.h,
        borderRadius: 2,
        background: p.col,
        left: `${p.left}%`,
        top: '50%',
        opacity: 0,
      }}
      animate={{
        x: [0, p.dx],
        y: [0, -p.dy],
        rotate: [0, p.rot],
        opacity: [0, 0.95, 0],
        scale: [0, 1, 0.3],
      }}
      transition={{
        duration: p.dur,
        delay: p.delay,
        repeat: Infinity,
        repeatDelay: p.repeatDelay,
      }}
    />
  );
}

export default function CookingScreen({ ingredients, config, onDone }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const soupType = SOUP_TYPES.find(s => s.id === config.soup) || SOUP_TYPES[0];
  const spiceLevel = SPICE_LEVELS.find(s => s.id === config.spice) || SPICE_LEVELS[0];

  useEffect(() => {
    let elapsed = 0;
    const timers = [];
    COOKING_STAGES.forEach((stage, idx) => {
      const t = setTimeout(() => {
        setStageIdx(idx);
        setProgress(stage.progress);
        if (idx === COOKING_STAGES.length - 1) {
          setTimeout(() => setFinished(true), 1000);
        }
      }, elapsed);
      timers.push(t);
      elapsed += stage.duration;
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const isHot = stageIdx >= 2;
  const isVeryHot = stageIdx >= 5;

  // addon tags
  const tags = [
    { label: soupType.label, color: soupType.color },
    { label: spiceLevel.label, color: spiceLevel.color },
    config.coriander && { label: '고수', color: '#4caf50' },
    config.garlic && { label: '마늘 추가', color: '#ffc107' },
    config.sesame && { label: '참깨 소스', color: '#ff9800' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between" style={{
      background: `radial-gradient(ellipse at 50% 80%, ${soupType.color}22 0%, #1a0000 40%, #000000 100%)`,
      padding: '20px 16px 40px',
      overflow: 'hidden',
    }}>
      {/* Ambient heat glow */}
      <motion.div
        animate={{ opacity: isHot ? [0.3, 0.6, 0.3] : 0.1 }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 100%, ${soupType.color}44 0%, transparent 60%)`,
        }}
      />

      {/* Spice particles */}
      {isHot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          {SPICE_PARTICLES.map((p, i) => <SpiceParticle key={i} p={p} />)}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'rgba(255,80,0,0.6)', fontFamily: 'monospace', marginBottom: 6 }}>
            3단계 / 3
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ff6b35', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
            조리 중
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,150,100,0.5)', fontFamily: 'serif' }}>
            烹饪进行中
          </div>
        </motion.div>

        {/* Pot + effects */}
        <div style={{ position: 'relative', marginBottom: 30 }}>
          {isVeryHot && (
            <div style={{ position: 'absolute', top: -65, left: 0, right: 0, height: 90, zIndex: 8 }}>
              <SteamEffect count={12} intensity={2.2} className="w-full h-full" />
            </div>
          )}
          {isHot && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none' }}>
              {OIL_DROPS.map((d, i) => (
                <ChiliOilDrop key={i} drop={d} soupColor={soupType.color} />
              ))}
            </div>
          )}
          <CyberPot
            selectedIngredients={ingredients}
            soupColor={soupType.color}
            isBoiling={isHot}
            size="lg"
          />
        </div>

        {/* Status message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stageIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', marginBottom: 24 }}
          >
            <div style={{
              fontSize: stageIdx === COOKING_STAGES.length - 1 ? '1.5rem' : '1.05rem',
              fontWeight: 800,
              color: isVeryHot ? '#ff4500' : '#ff6b35',
              letterSpacing: '0.04em',
              textShadow: isVeryHot ? '0 0 20px rgba(255,70,0,0.7)' : 'none',
              marginBottom: 4, fontFamily: 'monospace',
            }}>
              {COOKING_STAGES[stageIdx]?.message}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,150,100,0.5)', fontFamily: 'serif' }}>
              {COOKING_STAGES[stageIdx]?.submsg}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div style={{
          background: 'rgba(30,3,3,0.8)', border: '1px solid rgba(100,10,10,0.4)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(200,80,50,0.6)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>조리</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: spiceLevel.color || '#ff4500', fontFamily: 'monospace' }}>{progress}%</div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(50,0,0,0.5)', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, #8b0000, ${spiceLevel.color || '#c62828'}, #ff4500)`,
                borderRadius: 3,
                boxShadow: '0 0 8px rgba(200,0,0,0.6)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {tags.map((tag, i) => (
              <div key={i} style={{
                fontSize: '0.52rem', padding: '2px 8px', borderRadius: 12,
                background: `${tag.color}22`, border: `1px solid ${tag.color}44`,
                color: tag.color, fontFamily: 'monospace', letterSpacing: '0.08em',
              }}>
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Done overlay */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.92)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: '4rem', marginBottom: 20 }}
            >
              🍲
            </motion.div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 900, color: '#ff6b35',
              letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: 8,
            }}>
              그릇이 완성됐습니다
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,150,100,0.6)', fontFamily: 'serif', marginBottom: 30 }}>
              您的麻辣烫已完成
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 44px rgba(200,0,0,0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onDone}
              style={{
                background: 'linear-gradient(135deg, #8b0000, #c62828)',
                border: '1px solid rgba(255,100,50,0.4)',
                color: '#fff', padding: '14px 48px', borderRadius: 6,
                fontSize: '1rem', fontWeight: 700, letterSpacing: '0.2em',
                cursor: 'pointer', fontFamily: 'monospace', textTransform: 'uppercase',
                boxShadow: '0 0 20px rgba(200,0,0,0.4)',
              }}
            >
              먹기 시작 →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
