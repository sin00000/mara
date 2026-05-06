import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SteamEffect from './SteamEffect';
import BubbleEffect from './BubbleEffect';
import IngredientRenderer from './IngredientRenderer';

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ── Soup-surface splash rings when ingredient drops in ─────────────────────
function SplashRings({ soupColor }) {
  const dirs = [0, 1, 2, 3].map(i => ({
    angle: (i / 4) * Math.PI * 2,
    dist: 14 + i * 3,
  }));
  return (
    <div style={{
      position: 'absolute', top: '44%', left: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 9, pointerEvents: 'none',
    }}>
      {/* Expanding elliptical rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          initial={{ scale: 0.1, opacity: 0.85 }}
          animate={{ scale: 4 + i * 2.5, opacity: 0 }}
          transition={{ duration: 0.55 + i * 0.1, delay: i * 0.07, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 22, height: 11,
            borderRadius: '50%',
            border: `1.5px solid rgba(255,200,120,0.75)`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      ))}
      {/* Tiny soup splatter droplets */}
      {dirs.map((d, i) => (
        <motion.div key={`d${i}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(d.angle) * d.dist,
            y: [0, -18, Math.sin(d.angle) * 8],
            opacity: [1, 0.7, 0],
            scale: [1, 0.8, 0.2],
          }}
          transition={{ duration: 0.45, delay: 0.04, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 5, height: 7,
            borderRadius: '50% 50% 60% 60% / 40% 40% 60% 60%',
            background: `${soupColor}dd`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      ))}
    </div>
  );
}

// ── Chili oil with glossy specular highlights ──────────────────────────────
function ChiliOilLayer({ soupColor, isBoiling }) {
  const patches = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    x: 12 + seededRand(i * 11) * 76,    y: 15 + seededRand(i * 11 + 1) * 65,
    w: 14 + seededRand(i * 11 + 2) * 28, h: 8 + seededRand(i * 11 + 3) * 14,
    dx: (seededRand(i * 11 + 4) - 0.5) * 6, dy: (seededRand(i * 11 + 5) - 0.5) * 4,
    dur: 3 + seededRand(i * 11 + 6) * 3,
    hlx: 20 + seededRand(i * 11 + 7) * 40, hly: 15 + seededRand(i * 11 + 8) * 40,
  })), []);

  const glossSpots = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    x: 15 + seededRand(i * 19 + 99) * 70, y: 10 + seededRand(i * 19 + 100) * 70,
    w: 5 + seededRand(i * 19 + 101) * 10, h: 3 + seededRand(i * 19 + 102) * 6,
    dur: 1.5 + seededRand(i * 19 + 103) * 2.5,
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', zIndex: 3 }}>
      <motion.div
        animate={{ rotate: isBoiling ? [0, 360] : [0, 45] }}
        transition={{ duration: isBoiling ? 12 : 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '-60%',
          background: `conic-gradient(from 0deg,transparent 0deg,rgba(255,150,0,0.09) 25deg,rgba(255,210,60,0.07) 55deg,rgba(255,80,0,0.11) 80deg,transparent 110deg,rgba(255,120,0,0.07) 160deg,rgba(255,180,30,0.09) 200deg,transparent 230deg,rgba(255,60,0,0.10) 290deg,rgba(255,140,0,0.06) 330deg,transparent 360deg)`,
        }}
      />
      {patches.map((p, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.w, height: p.h,
            borderRadius: '50%', transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at ${p.hlx}% ${p.hly}%, rgba(255,210,80,0.45) 0%, rgba(255,140,20,0.28) 30%, rgba(200,60,0,0.12) 65%, transparent 85%)`,
            filter: 'blur(1.5px)',
          }}
          animate={isBoiling
            ? { x: [0,p.dx,-p.dx*.4,p.dx*.2,0], y: [0,p.dy,-p.dy*.3,p.dy*.5,0], scale:[1,1.08,0.96,1.04,1] }
            : { x: [0,p.dx*.25,0], y: [0,p.dy*.25,0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
        />
      ))}
      {glossSpots.map((g, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', left: `${g.x}%`, top: `${g.y}%`, width: g.w, height: g.h,
            borderRadius: '50%', transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.82) 0%, rgba(255,230,160,0.5) 35%, rgba(255,200,80,0.2) 60%, transparent 80%)',
            filter: 'blur(0.6px)',
          }}
          animate={{ opacity: [0.5,1,0.65,0.9,0.5], scale: [1,1.18,0.92,1.1,1] }}
          transition={{ duration: g.dur, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Peppercorns ────────────────────────────────────────────────────────────
function Peppercorns({ count = 8 }) {
  const corns = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: 8 + seededRand(i*23+200)*84, y: 12+seededRand(i*23+201)*72,
    size: 3.5+seededRand(i*23+202)*3, dur: 3+seededRand(i*23+203)*4,
    dx: (seededRand(i*23+204)-.5)*5, dy: (seededRand(i*23+205)-.5)*3,
  })), [count]);
  return (
    <>
      {corns.map((c,i) => (
        <motion.div key={i}
          style={{
            position:'absolute', left:`${c.x}%`, top:`${c.y}%`, width:c.size, height:c.size,
            borderRadius:'50%', transform:'translate(-50%,-50%)', zIndex:4,
            background:'radial-gradient(circle at 35% 28%, #6b3a1f 0%, #3d1f0a 55%, #1a0a03 100%)',
            boxShadow:'inset -0.5px -0.5px 1px rgba(255,255,255,0.12), 0 1px 3px rgba(0,0,0,0.7)',
          }}
          animate={{ x:[0,c.dx,-c.dx*.3,c.dx*.5,0], y:[0,c.dy,c.dy*.6,-c.dy*.2,0] }}
          transition={{ duration:c.dur, repeat:Infinity, ease:'easeInOut', delay:i*.28 }}
        />
      ))}
    </>
  );
}

// ── Chili flakes ────────────────────────────────────────────────────────────
function ChiliFlakes({ count = 12 }) {
  const flakes = useMemo(() => Array.from({ length: count }, (_, i) => {
    const s = i*29+300;
    const w = 3+seededRand(s)*5, h = 2+seededRand(s+1)*3;
    return {
      x:5+seededRand(s+2)*90, y:8+seededRand(s+3)*80, w, h,
      rot:seededRand(s+4)*180, dur:4+seededRand(s+5)*5,
      dx:(seededRand(s+6)-.5)*4, dy:(seededRand(s+7)-.5)*3,
      opacity:.65+seededRand(s+8)*.35,
    };
  }), [count]);
  return (
    <>
      {flakes.map((f,i) => (
        <motion.div key={i}
          style={{
            position:'absolute', left:`${f.x}%`, top:`${f.y}%`, width:f.w, height:f.h,
            borderRadius:'1px', background:'linear-gradient(135deg, #c62828 0%, #8b0000 60%, #4a0000 100%)',
            transform:`translate(-50%,-50%) rotate(${f.rot}deg)`, opacity:f.opacity,
            boxShadow:'0 0.5px 2px rgba(0,0,0,0.6)', zIndex:4,
          }}
          animate={{
            x:[0,f.dx,-f.dx*.5,f.dx*.3,0], y:[0,f.dy,f.dy*.4,-f.dy*.2,0],
            rotate:[f.rot,f.rot+15,f.rot-8,f.rot+5,f.rot],
          }}
          transition={{ duration:f.dur, repeat:Infinity, ease:'easeInOut', delay:i*.2 }}
        />
      ))}
    </>
  );
}

// ── Ingredient in soup – entry animation + submerge look ───────────────────
function SubmergedIngredient({ ingredient, cx, cy, size, isBoiling, idx }) {
  const submergeDepth = 0.55;
  return (
    // Outer: drop-in entry (plays once on mount because key=ing.id never changes)
    <motion.div
      initial={{ y: -65, opacity: 0, scale: 0.35 }}
      animate={{ y: 0,   opacity: 1, scale: 1    }}
      transition={{ type: 'spring', damping: 13, stiffness: 210 }}
      style={{ position:'absolute', left:`${cx}%`, top:`${cy}%`, transform:'translate(-50%,-50%)', zIndex:5 }}
    >
      {/* Inner: continuous bob */}
      <motion.div
        animate={isBoiling
          ? { y:[0,-2.5,0,-1.5,0], rotate:[0,1.5,-1,1.5,0] }
          : { y:[0,-1,0], rotate:[0,.5,0] }}
        transition={{ duration:2+idx*.35, repeat:Infinity, delay:idx*.25, ease:'easeInOut' }}
      >
        {/* Above-soup portion */}
        <div style={{ overflow:'hidden', height:size*(1-submergeDepth), filter:'drop-shadow(0 -2px 4px rgba(255,120,0,0.2))' }}>
          <IngredientRenderer ingredient={ingredient} size={size} />
        </div>
        {/* Below-soup portion: deeper color + blur */}
        <div style={{
          overflow:'hidden', height:size*submergeDepth, opacity:.82,
          filter:'saturate(1.5) brightness(0.72) blur(0.4px)',
          transform:`translateY(-${size*(1-submergeDepth)}px)`,
          clipPath:`inset(${size*(1-submergeDepth)}px 0 0 0)`,
        }}>
          <IngredientRenderer ingredient={ingredient} size={size} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main CyberPot ────────────────────────────────────────────────────────────
export default function CyberPot({
  selectedIngredients = [],
  soupColor = '#8b0000',
  isBoiling = false,
  size = 'md',
  splashKey = 0,           // increment to trigger a splash ring animation
}) {
  const sizes = {
    sm: { pot: 180, rim: 20, depth: 80 },
    md: { pot: 240, rim: 28, depth: 100 },
    lg: { pot: 320, rim: 36, depth: 130 },
  };
  const dim = sizes[size] || sizes.md;
  const ingSize = size === 'sm' ? 22 : size === 'lg' ? 34 : 27;

  // Splash rings state
  const [splashVer, setSplashVer] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  useEffect(() => {
    if (splashKey > 0) {
      setSplashVer(v => v + 1);
      setShowSplash(true);
      const t = setTimeout(() => setShowSplash(false), 900);
      return () => clearTimeout(t);
    }
  }, [splashKey]);

  return (
    <div style={{ position:'relative', width:dim.pot, height:dim.pot*.95, margin:'0 auto' }}>

      {/* Steam */}
      <div style={{ position:'absolute', bottom:dim.depth+dim.rim-8, left:0, right:0, height:130, zIndex:12 }}>
        <SteamEffect count={isBoiling?11:5} intensity={isBoiling?1.4:0.6} className="w-full h-full" />
      </div>

      {/*
        Shake wrapper — use marginLeft for centering (NOT css transform) so that
        Framer Motion's x/y animation doesn't conflict with translateX(-50%) and
        cause the pot to jump when boiling starts.
      */}
      <motion.div
        animate={isBoiling
          ? { x:[0,-1.5,1,-0.5,1.5,0,-1,.5,0], y:[0,1,-.5,1.5,-1,.5,0,-1.5,0] }
          : { x:0, y:0 }
        }
        transition={isBoiling
          ? { duration:.45, repeat:Infinity, ease:'easeInOut' }
          : { duration:.3, ease:'easeOut' }
        }
        style={{ position:'absolute', bottom:0, left:'50%', marginLeft:-(dim.pot/2), width:dim.pot, height:dim.depth+dim.rim }}
      >
        {/* Pot shell */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:dim.depth,
          borderRadius:'0 0 58% 58% / 0 0 78% 78%',
          background:'linear-gradient(175deg, #2e0c0c 0%, #1a0505 35%, #0f0202 70%, #080000 100%)',
          boxShadow:`inset 0 -10px 24px rgba(0,0,0,0.85),inset 6px 0 14px rgba(0,0,0,0.4),inset -6px 0 14px rgba(0,0,0,0.4),inset 0 10px 20px rgba(255,80,0,0.06),0 12px 36px rgba(0,0,0,0.7)`,
          border:'2px solid #3d1010', zIndex:2, overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:'12%', width:'22%', height:'100%', background:'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 70%)', borderRadius:'0 0 50% 50%' }} />
          <motion.div
            animate={isBoiling?{opacity:[.18,.35,.18]}:{opacity:.12}}
            transition={{ duration:1.2, repeat:Infinity }}
            style={{ position:'absolute', bottom:0, left:'10%', right:'10%', height:'55%', background:`radial-gradient(ellipse at 50% 100%, ${soupColor}55 0%, transparent 70%)`, borderRadius:'0 0 50% 50%' }}
          />
        </div>

        {/* Rim */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:dim.rim,
          borderRadius:dim.rim,
          background:'linear-gradient(180deg, #5a1a1a 0%, #3a0c0c 45%, #1e0606 100%)',
          boxShadow:`0 5px 14px rgba(0,0,0,0.65),inset 0 2px 5px rgba(255,255,255,0.07),inset 0 -2px 4px rgba(0,0,0,0.5)`,
          zIndex:6,
        }}>
          <div style={{ position:'absolute', top:2, left:'8%', width:'84%', height:4, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.11) 30%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.11) 70%, transparent)', borderRadius:4 }} />
          <motion.div
            animate={isBoiling?{opacity:[.5,1,.5]}:{opacity:.4}}
            transition={{ duration:1.1, repeat:Infinity }}
            style={{ position:'absolute', bottom:0, left:'5%', right:'5%', height:'60%', background:'linear-gradient(180deg, transparent 0%, rgba(255,120,30,0.18) 100%)', borderRadius:'0 0 50% 50%' }}
          />
        </div>

        {/* Soup surface */}
        <div style={{
          position:'absolute', top:dim.rim*.45, left:10, right:10, height:dim.depth-dim.rim*.55-4,
          borderRadius:'50%',
          background:`radial-gradient(ellipse at 42% 38%, ${soupColor}ff 0%, ${soupColor}ee 25%, ${soupColor}cc 55%, ${soupColor}88 80%, ${soupColor}55 100%)`,
          overflow:'hidden', zIndex:1,
          boxShadow:`inset 0 4px 16px rgba(0,0,0,0.5),inset 0 -2px 8px rgba(255,80,0,0.1)`,
        }}>
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.5) 0%, transparent 60%)` }} />
          <ChiliOilLayer soupColor={soupColor} isBoiling={isBoiling} />
          {isBoiling && <BubbleEffect count={14} color={soupColor} />}
          <ChiliFlakes count={10} />
          <Peppercorns count={7} />

          {/* Splash rings on ingredient add */}
          <AnimatePresence>
            {showSplash && <SplashRings key={splashVer} soupColor={soupColor} />}
          </AnimatePresence>

          {/* Ingredients – keyed by id so initial animation only plays on first mount */}
          {selectedIngredients.slice(0, 8).map((ing, idx) => {
            const angle = (idx / Math.max(selectedIngredients.length, 1)) * Math.PI * 2;
            const r = 22 + (idx % 3) * 11;
            const cx = 50 + Math.cos(angle) * r;
            const cy = 45 + Math.sin(angle) * r * 0.48;
            return (
              <SubmergedIngredient
                key={ing.id}
                ingredient={ing} cx={cx} cy={cy}
                size={ingSize} isBoiling={isBoiling} idx={idx}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Handles */}
      {[-1,1].map(side => (
        <div key={side} style={{
          position:'absolute', bottom:dim.depth*.28, [side===-1?'left':'right']:-22,
          width:26, height:44, borderRadius:10,
          background:'linear-gradient(90deg, #3d1212, #261010, #3d1212)',
          boxShadow:`${side===-1?'2px':'-2px'} 2px 8px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.04)`,
          zIndex:8,
        }} />
      ))}

      {/* Bottom glow */}
      <motion.div
        animate={isBoiling?{opacity:[.3,.55,.3],scaleX:[1,1.1,1]}:{opacity:.2}}
        transition={{ duration:1.5, repeat:Infinity }}
        style={{
          position:'absolute', bottom:-14, left:'15%', right:'15%', height:22,
          background:`radial-gradient(ellipse, ${soupColor}55 0%, transparent 75%)`,
          filter:'blur(10px)', zIndex:0,
        }}
      />
    </div>
  );
}
