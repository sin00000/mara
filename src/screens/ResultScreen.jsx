import { motion } from 'framer-motion';
import { SPICE_LEVELS, MALA_LEVELS, SOUP_TYPES, VIRAL_TITLES } from '../data/ingredients';
import IngredientRenderer from '../components/IngredientRenderer';
import SteamEffect from '../components/SteamEffect';

function getRank(config) {
  const spice = SPICE_LEVELS.find(s => s.id === config.spice)?.intensity || 0;
  const mala  = MALA_LEVELS.find(s => s.id === config.mala)?.intensity || 0;
  const total = spice + mala;
  const tier  = Math.min(6, Math.floor(total * 6 / 9));
  const titles = VIRAL_TITLES[tier] || VIRAL_TITLES[0];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    tier, spice, mala, total,
  };
}

function StatBar({ label, value, max = 5, color }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontSize: '0.65rem', color: 'rgba(200,120,80,0.7)', fontFamily: 'monospace', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: '0.65rem', color, fontFamily: 'monospace', fontWeight: 700 }}>
          {'█'.repeat(value)}{'░'.repeat(Math.max(0, max - value))}
        </div>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(50,0,0,0.5)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 6px ${color}66` }}
        />
      </div>
    </div>
  );
}

const TIER_STYLES = [
  { border: '#4caf50', glow: 'rgba(76,175,80,0.3)',   badge: '🌿', label: '현인' },
  { border: '#8bc34a', glow: 'rgba(139,195,74,0.3)',  badge: '🫚', label: '초보자' },
  { border: '#ffc107', glow: 'rgba(255,193,7,0.4)',   badge: '🌶', label: '입문자' },
  { border: '#ff9800', glow: 'rgba(255,152,0,0.4)',   badge: '🔥', label: '전사' },
  { border: '#ff5722', glow: 'rgba(255,87,34,0.5)',   badge: '💀', label: '베테랑' },
  { border: '#e53935', glow: 'rgba(229,57,53,0.6)',   badge: '☠️', label: '전설' },
  { border: '#b71c1c', glow: 'rgba(183,28,28,0.8)',   badge: '🌋', label: '신' },
];

export default function ResultScreen({ ingredients, config, onRestart }) {
  const rank      = getRank(config);
  const tier      = TIER_STYLES[rank.tier] || TIER_STYLES[0];
  const spiceLevel = SPICE_LEVELS.find(s => s.id === config.spice) || SPICE_LEVELS[0];
  const malaLevel  = MALA_LEVELS.find(s => s.id === config.mala) || MALA_LEVELS[0];
  const soupType   = SOUP_TYPES.find(s => s.id === config.soup) || SOUP_TYPES[0];

  const handleShare = async () => {
    const text =
      `나는 "${rank.title}"으로 사이버 마라탕에서 살아남았다! 🌶️🔥\n` +
      `매운 정도: ${spiceLevel.label} · 마라: ${malaLevel.label}\n` +
      `재료: ${ingredients.map(i => i.name).join(', ')}\n` +
      `\n당신도 도전해봐 → 사이버 마라탕`;

    if (navigator.share) {
      try { await navigator.share({ title: '사이버 마라탕 결과', text }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('결과가 클립보드에 복사됐습니다! 📋');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{
      background: `radial-gradient(ellipse at 50% 20%, ${tier.border}11 0%, #0a0000 50%, #000000 100%)`,
      padding: '24px 16px 48px',
      overflowX: 'hidden',
    }}>
      {/* Tier ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${tier.glow} 0%, transparent 60%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'rgba(255,80,0,0.5)', fontFamily: 'monospace', marginBottom: 4 }}>
            사이버 마라탕 · 결果
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,150,100,0.4)', fontFamily: 'serif' }}>
            赛博麻辣烫 · 结果
          </div>
        </motion.div>

        {/* Result card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'linear-gradient(160deg, rgba(25,3,3,0.98), rgba(10,1,1,0.98))',
            border: `1.5px solid ${tier.border}44`,
            borderRadius: 16,
            padding: '28px 24px',
            boxShadow: `0 0 44px ${tier.glow}, 0 20px 64px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04)`,
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Card dot pattern */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `radial-gradient(${tier.border}08 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }} />
          {/* Top accent */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, ${tier.border}66, transparent)`,
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Badge */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <motion.div
                animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
                style={{ fontSize: '3rem', display: 'block', marginBottom: 8 }}
              >
                {tier.badge}
              </motion.div>
              <div style={{
                display: 'inline-block', fontSize: '0.6rem', letterSpacing: '0.3em',
                color: tier.border, fontFamily: 'monospace', fontWeight: 700,
                border: `1px solid ${tier.border}44`, padding: '3px 12px', borderRadius: 12,
                background: `${tier.border}11`, marginBottom: 12,
                textShadow: `0 0 8px ${tier.border}`,
              }}>
                {tier.label} 등급
              </div>
            </div>

            {/* Viral title */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                fontSize: 'clamp(1.3rem, 6vw, 1.8rem)',
                fontWeight: 900, letterSpacing: '-0.01em', lineHeight: 1.2,
                background: `linear-gradient(135deg, ${tier.border}, #ff6b35, ${tier.border})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 12px ${tier.glow})`,
                marginBottom: 6,
              }}>
                "{rank.title}"
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,150,100,0.5)', fontFamily: 'serif', fontStyle: 'italic' }}>
                당신의 공식 마라탕 정체성
              </div>
            </div>

            {/* Stat bars */}
            <div style={{
              background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '14px 16px', marginBottom: 16,
              border: '1px solid rgba(80,10,10,0.4)',
            }}>
              <StatBar label="매운맛 등급" value={rank.spice} max={5} color={spiceLevel.color || '#ff4500'} />
              <StatBar label="마라 강도"   value={rank.mala}  max={4} color="#a64ca6" />
              <StatBar label="재료 수"     value={Math.min(ingredients.length, 12)} max={12} color="#ffa726" />
              {config.coriander && <StatBar label="고수 파워"  value={3} max={3} color="#4caf50" />}
              {config.garlic    && <StatBar label="마늘 숨"    value={3} max={3} color="#ffc107" />}
            </div>

            {/* Soup type */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', borderRadius: 8, marginBottom: 16,
              background: `${soupType.color}11`, border: `1px solid ${soupType.color}33`,
            }}>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(200,100,80,0.5)', fontFamily: 'monospace' }}>국물 베이스</div>
                <div style={{ fontSize: '0.8rem', color: soupType.color, fontWeight: 700 }}>{soupType.label}</div>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(200,100,80,0.4)', fontFamily: 'serif' }}>{soupType.chinese}</div>
            </div>

            {/* Ingredient chips */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(200,80,50,0.5)', fontFamily: 'monospace', marginBottom: 10 }}>
                사용한 재료 · 食材
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ingredients.map(ing => (
                  <div key={ing.id} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(30,5,5,0.6)', border: '1px solid rgba(80,15,15,0.4)',
                    borderRadius: 6, padding: '4px 10px',
                  }}>
                    <IngredientRenderer ingredient={ing} size={18} />
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'rgba(220,160,120,0.85)', fontWeight: 600 }}>{ing.name}</div>
                      <div style={{ fontSize: '0.5rem', color: 'rgba(180,80,50,0.5)', fontFamily: 'serif' }}>{ing.chinese}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative steam */}
          <div style={{ position: 'absolute', bottom: -24, right: 16, height: 70, width: 90, zIndex: 1 }}>
            <SteamEffect count={4} intensity={0.65} className="w-full h-full" />
          </div>
        </motion.div>

        {/* Add-ons */}
        {(config.coriander || config.garlic || config.sesame) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}
          >
            {config.coriander && <div style={{ fontSize: '0.65rem', color: '#4caf50', fontFamily: 'monospace', border: '1px solid #4caf5044', padding: '4px 12px', borderRadius: 20, background: '#4caf5011' }}>🌿 고수</div>}
            {config.garlic    && <div style={{ fontSize: '0.65rem', color: '#ffc107', fontFamily: 'monospace', border: '1px solid #ffc10744', padding: '4px 12px', borderRadius: 20, background: '#ffc10711' }}>🧄 마늘 추가</div>}
            {config.sesame    && <div style={{ fontSize: '0.65rem', color: '#ff9800', fontFamily: 'monospace', border: '1px solid #ff980044', padding: '4px 12px', borderRadius: 20, background: '#ff980011' }}>🥜 참깨 소스</div>}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 10 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${tier.border}44, ${tier.border}22)`,
              border: `1px solid ${tier.border}66`,
              color: tier.border, padding: '13px',
              borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
              letterSpacing: '0.12em', cursor: 'pointer',
              fontFamily: 'monospace', textTransform: 'uppercase',
            }}
          >
            📤 공유
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(30,3,3,0.9), rgba(15,1,1,0.9))',
              border: '1px solid rgba(100,15,15,0.5)',
              color: 'rgba(220,120,80,0.8)', padding: '13px',
              borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
              letterSpacing: '0.12em', cursor: 'pointer',
              fontFamily: 'monospace', textTransform: 'uppercase',
            }}
          >
            🔄 다시 시작
          </motion.button>
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{ fontSize: '0.52rem', color: 'rgba(150,50,30,0.32)', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
            사이버 마라탕 · 赛博麻辣烫 · v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
