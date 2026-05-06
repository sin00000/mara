import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INGREDIENTS } from '../data/ingredients';
import IngredientRenderer from '../components/IngredientRenderer';
import CyberPot from '../components/CyberPot';

const TYPE_COLORS = {
  vegetable: '#2e7d32', starch: '#5d4037', tofu: '#f57f17',
  meat: '#b71c1c', seafood: '#0277bd', mushroom: '#4e342e', protein: '#6a1b9a',
};

// Ingredient that falls from above the pot rim into the soup
function DropOverlay({ ingredient, dropKey }) {
  if (!ingredient) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dropKey}
        initial={{ y: -56, opacity: 1, scale: 0.9 }}
        animate={{ y: 60, opacity: 0, scale: 0.55 }}
        exit={{}}
        transition={{ duration: 0.65, ease: [0.5, 0, 0.9, 0.6] }}
        style={{
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30, pointerEvents: 'none',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))',
        }}
      >
        <IngredientRenderer ingredient={ingredient} size={38} />
        {/* Tiny trail droplets */}
        {[0, 1].map(i => (
          <motion.div key={i}
            initial={{ y: 0, opacity: 0.7, scale: 1 }}
            animate={{ y: [0, -(12 + i * 8)], opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            style={{
              position: 'absolute',
              top: -6 - i * 8, left: '50%', transform: 'translateX(-50%)',
              width: 5 - i, height: 7 - i,
              borderRadius: '50% 50% 60% 60% / 40% 40% 60% 60%',
              background: 'rgba(200,80,0,0.5)',
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default function IngredientScreen({ selected, onToggle, onNext, onBack }) {
  const canProceed = selected.length >= 2;
  const [droppingIng, setDroppingIng] = useState(null);
  const [dropKey, setDropKey] = useState(0);
  const [splashKey, setSplashKey] = useState(0);

  const handleToggle = (ing) => {
    const wasSelected = selected.find(s => s.id === ing.id);
    onToggle(ing);
    if (!wasSelected) {
      setDroppingIng(ing);
      setDropKey(k => k + 1);
      setSplashKey(k => k + 1);
      // Clear dropping overlay after animation
      setTimeout(() => setDroppingIng(null), 700);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'radial-gradient(ellipse at 50% 0%, #1a0505 0%, #0a0000 50%, #000000 100%)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 8px',
        borderBottom: '1px solid rgba(180,0,0,0.2)',
        background: 'rgba(10,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 600, margin: '0 auto' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: 'rgba(255,100,50,0.7)',
            fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em',
          }}>← 뒤로</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,80,0,0.6)', fontFamily: 'monospace' }}>1단계 / 3</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ff6b35', letterSpacing: '0.1em' }}>재료 선택</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,150,100,0.5)', fontFamily: 'monospace' }}>食材 · {selected.length}가지 선택됨</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onNext} disabled={!canProceed}
            style={{
              background: canProceed ? 'linear-gradient(135deg, #8b0000, #c62828)' : 'rgba(50,0,0,0.5)',
              border: 'none', color: canProceed ? '#fff' : 'rgba(255,255,255,0.3)',
              padding: '8px 16px', borderRadius: 4,
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              fontFamily: 'monospace', transition: 'all 0.3s',
            }}
          >
            다음 →
          </motion.button>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', width: '100%', padding: '16px 16px 100px' }}>

        {/* Pot preview with drop animation */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 20, overflow: 'hidden' }}
            >
              <div style={{ textAlign: 'center', marginBottom: 8, fontSize: '0.65rem', color: 'rgba(255,100,50,0.5)', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
                내 냄비 미리보기
              </div>
              {/* Wrapper for drop overlay */}
              <div style={{ position: 'relative', overflow: 'visible' }}>
                <DropOverlay ingredient={droppingIng} dropKey={dropKey} />
                <CyberPot
                  selectedIngredients={selected}
                  soupColor="#8b0000"
                  isBoiling={false}
                  size="sm"
                  splashKey={splashKey}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ingredient grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {INGREDIENTS.map((ing, idx) => {
            const isSelected = selected.find(s => s.id === ing.id);
            return (
              <motion.button
                key={ing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleToggle(ing)}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${TYPE_COLORS[ing.type]}44, ${TYPE_COLORS[ing.type]}22)`
                    : 'linear-gradient(135deg, rgba(30,5,5,0.9), rgba(15,2,2,0.9))',
                  border: isSelected
                    ? `1.5px solid ${TYPE_COLORS[ing.type]}88`
                    : '1.5px solid rgba(80,10,10,0.5)',
                  borderRadius: 8, padding: '12px 8px',
                  cursor: 'pointer', textAlign: 'center', position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: isSelected
                    ? `0 0 18px ${TYPE_COLORS[ing.type]}33, inset 0 1px 0 rgba(255,255,255,0.05)`
                    : '0 2px 8px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                }}
              >
                {isSelected && (
                  <motion.div
                    style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 0%, ${TYPE_COLORS[ing.type]}22 0%, transparent 70%)` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      style={{
                        position:'absolute', top:4, right:4, width:16, height:16, borderRadius:'50%',
                        background:TYPE_COLORS[ing.type],
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'0.5rem', color:'#fff', fontWeight:900,
                      }}
                    >✓</motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <IngredientRenderer ingredient={ing} size={44} />
                </div>
                <div style={{ fontSize:'0.45rem', letterSpacing:'0.15em', textTransform:'uppercase', color:TYPE_COLORS[ing.type], fontFamily:'monospace', marginBottom:2 }}>
                  {ing.typeKo}
                </div>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:isSelected?'#fff':'rgba(255,220,200,0.88)', lineHeight:1.2, marginBottom:2 }}>
                  {ing.name}
                </div>
                <div style={{ fontSize:'0.6rem', color:'rgba(255,180,120,0.55)', fontFamily:'serif' }}>
                  {ing.chinese}
                </div>
                <div style={{ fontSize:'0.52rem', color:'rgba(255,150,100,0.42)', marginTop:2, fontStyle:'italic' }}>
                  {ing.description}
                </div>
              </motion.button>
            );
          })}
        </div>

        {!canProceed && (
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ textAlign:'center', marginTop:24, fontSize:'0.7rem', color:'rgba(255,100,50,0.5)', fontFamily:'monospace', letterSpacing:'0.15em' }}
          >
            재료를 최소 2가지 선택하세요
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <AnimatePresence>
        {canProceed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            style={{
              position:'fixed', bottom:0, left:0, right:0, zIndex:30,
              padding:'12px 20px 26px',
              background:'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, transparent 100%)',
              backdropFilter:'blur(4px)',
            }}
          >
            <div style={{ maxWidth:500, margin:'0 auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:'0.65rem', color:'rgba(255,150,100,0.6)', fontFamily:'monospace' }}>
                <span>{selected.length}가지 재료 선택됨</span>
                <span style={{ textAlign:'right', maxWidth:'55%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {selected.map(s => s.name).join(' · ')}
                </span>
              </div>
              <motion.button
                whileHover={{ scale:1.02, boxShadow:'0 0 32px rgba(200,0,0,0.6)' }}
                whileTap={{ scale:0.98 }}
                onClick={onNext}
                style={{
                  width:'100%',
                  background:'linear-gradient(135deg, #8b0000, #c62828, #8b0000)',
                  border:'1px solid rgba(255,100,50,0.3)',
                  color:'#fff', padding:'14px', borderRadius:6,
                  fontSize:'0.95rem', fontWeight:700, letterSpacing:'0.2em',
                  cursor:'pointer', fontFamily:'monospace', textTransform:'uppercase',
                  boxShadow:'0 0 20px rgba(200,0,0,0.3)',
                }}
              >
                향신료 커스텀 →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
