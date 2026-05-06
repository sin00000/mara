import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SteamEffect from '../components/SteamEffect';
import IngredientRenderer from '../components/IngredientRenderer';
import { SOUP_TYPES } from '../data/ingredients';

function seededRand(s) { const x = Math.sin(s+1)*10000; return x-Math.floor(x); }

const EAT_MESSAGES = [
  { text: '😤 첫 한 입...', sub: '第一口', heat: 0 },
  { text: '😮 오. 오 세상에.', sub: '天哪', heat: 1 },
  { text: '🥵 마라가 덮친다...', sub: '麻辣上头', heat: 2 },
  { text: '💦 땀이 나기 시작했다.', sub: '开始出汗', heat: 3 },
  { text: '🤤 멈출 수가 없다.', sub: '停不下来', heat: 3 },
  { text: '🔥 순수한 화염', sub: '火辣辣', heat: 4 },
  { text: '😭 너무 맛있다. 너무 아프다.', sub: '又痛又爽', heat: 4 },
  { text: '🏆 완식. 당신은 살아남았다.', sub: '你活下来了', heat: 5 },
];

// ── Sauce drip that falls from noodle tip back into soup ──────────────────
function SauceDrip({ soupColor, left, delay }) {
  return (
    <motion.div
      style={{
        position: 'absolute', bottom: 0, left: `${left}%`,
        width: 5, height: 9,
        borderRadius: '50% 50% 55% 55% / 40% 40% 60% 60%',
        background: `radial-gradient(circle at 35% 28%, rgba(255,210,60,0.65), ${soupColor}ee)`,
        transformOrigin: 'top center',
      }}
      animate={{
        y: [0, 12, 28, 48, 70],
        scaleY: [1, 1.35, 1.1, 0.7, 0.3],
        scaleX: [1, 0.8, 0.9, 1.1, 0.4],
        opacity: [0, 1, 0.9, 0.5, 0],
      }}
      transition={{ duration: 0.85, delay, repeat: Infinity, repeatDelay: 1.4 + delay * 0.6, ease: 'easeIn' }}
    />
  );
}

// ── Stretching noodle strands between chopstick tips and bowl ─────────────
// These must look like FOOD (wide, pale, droopy) not like chopstick sticks.
function NoodleStrands({ phase, soupColor }) {
  const show = phase === 'lifting' || phase === 'eating';
  const h = phase === 'eating' ? 110 : 66;

  // Wide, food-colored strands — clearly different from the lacquered chopsticks
  const strands = useMemo(() => [
    { left: '8%',  w: 11, skew: -4, sag: 6,  dur: 0.9, delay: 0    },
    { left: '30%', w: 9,  skew:  3, sag: 9,  dur: 1.0, delay: 0.05 },
    { left: '52%', w: 10, skew: -2, sag: 7,  dur: 0.85,delay: 0.02 },
  ], []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            position: 'absolute', bottom: 8, left: '12%', width: '50%', height: h,
            transformOrigin: 'top center', zIndex: 14,
          }}
        >
          {strands.map((s, i) => (
            <motion.div key={i}
              animate={{ x: [0, s.skew, -s.skew * 0.6, s.skew * 0.3, 0] }}
              transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
              style={{
                position: 'absolute', left: s.left, top: 0,
                width: s.w, height: '100%',
                // Pale amber/cream — unmistakably noodle-colored
                background: `linear-gradient(
                  180deg,
                  rgba(255,245,200,0.95) 0%,
                  rgba(240,215,140,0.92) 20%,
                  rgba(220,180,90,0.85)  45%,
                  ${soupColor}cc         70%,
                  rgba(200,150,60,0.80)  100%
                )`,
                // Droopy bottom edge = food, not stick
                borderRadius: '4px 4px 40% 40% / 4px 4px 20px 20px',
                boxShadow: `0 0 10px rgba(255,180,60,0.4), inset 0 0 5px rgba(255,255,255,0.25)`,
                filter: 'blur(0.4px)',
                transformOrigin: 'top center',
              }}
            >
              {/* Specular shine along noodle */}
              <div style={{
                position: 'absolute', top: '5%', left: '15%', width: '30%', height: '80%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 100%)',
                borderRadius: 4,
              }} />
            </motion.div>
          ))}

          {/* Sauce drips */}
          {phase === 'lifting' && [
            { left: 15, delay: 0 },
            { left: 55, delay: 0.55 },
          ].map((d, i) => <SauceDrip key={i} soupColor={soupColor} left={d.left} delay={d.delay} />)}

          {/* Steam from hot noodle */}
          <div style={{ position: 'absolute', top: -26, left: -8, width: 70, height: 30, zIndex: 15 }}>
            <SteamEffect count={3} intensity={0.55} className="w-full h-full" />
          </div>

          {/* Glossy sauce coating */}
          <motion.div
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 40%, transparent 75%)',
              borderRadius: 4,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Chopstick arm with ingredient and noodle ───────────────────────────────
// Uses ONLY x/y translation (no rotation) so it's crystal-clear that the
// same chopstick is moving — rotation + transformOrigin caused the "different
// chopstick" visual confusion.
function ChopstickArm({ phase, ingredient, soupColor }) {
  const phaseStyles = {
    resting: { y: 0,   x: 0  },
    dipping: { y: 58,  x: 6  },
    lifting: { y: -26, x: 10 },
    eating:  { y: -65, x: 44 },
  };
  const s = phaseStyles[phase] || phaseStyles.resting;

  return (
    <motion.div
      animate={s}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', top: -38, right: 22, zIndex: 20 }}
    >
      <div style={{ position: 'relative', width: 36, height: 130 }}>
        {/* Sticks */}
        {[0, 1].map(i => (
          <div key={i} style={{
            position: 'absolute', left: 6 + i * 13, top: 0, width: 4, height: 114,
            background: 'linear-gradient(180deg, #d4b870 0%, #a0812c 35%, #7a5c12 65%, #4a3608 100%)',
            borderRadius: '2px 2px 1px 1px',
            boxShadow: `${i===0?'1.5px':'-1.5px'} 0 5px rgba(0,0,0,0.5)`,
            transform: `rotate(${i===0?2.5:-2.5}deg)`,
          }}>
            {/* Lacquered tip */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 26,
              background: 'linear-gradient(180deg, #9b0000, #4a0000)',
              borderRadius: '1px 1px 2px 2px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
            }}>
              {/* Glossy lacquer highlight */}
              <div style={{ position:'absolute', top:3, left:1, width:1.5, height:'60%', background:'rgba(255,255,255,0.25)', borderRadius:1 }} />
            </div>
            {/* Wooden grain lines */}
            {[1,2,3].map(g => (
              <div key={g} style={{ position:'absolute', top:`${15+g*18}%`, left:0, right:0, height:1, background:'rgba(0,0,0,0.15)' }} />
            ))}
          </div>
        ))}

        {/* Noodle + sauce drips anchored to chopstick tips */}
        <div style={{ position: 'absolute', bottom: 16, left: 0, width: 36 }}>
          <NoodleStrands phase={phase} soupColor={soupColor} />
        </div>

        {/* Gripped ingredient */}
        <AnimatePresence>
          {(phase === 'lifting' || phase === 'eating') && ingredient && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.12 } }}
              style={{
                position: 'absolute', bottom: 6, left: -6,
                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.65)) drop-shadow(0 0 6px rgba(200,80,0,0.4))',
              }}
            >
              <IngredientRenderer ingredient={ingredient} size={32} />
              {/* Sauce coating on ingredient */}
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 35% 30%, rgba(255,200,80,0.3), transparent 70%)`,
                  borderRadius: '50%',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sauce on chopstick tips when dipping */}
        {phase === 'dipping' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', bottom: 12, left: 4,
              width: 20, height: 6, borderRadius: '50%',
              background: `radial-gradient(ellipse, ${soupColor}aa, transparent)`,
              filter: 'blur(2px)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ── Surface ripple where ingredient was removed ────────────────────────────
function SurfaceRipple({ x, y, color, rippleKey }) {
  return (
    <AnimatePresence>
      {rippleKey > 0 && (
        <motion.div
          key={rippleKey}
          initial={{ scale: 0.1, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          exit={{}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: 18, height: 9, borderRadius: '50%',
            border: `1.5px solid ${color}88`,
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', zIndex: 8,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ── Finished empty bowl glow ───────────────────────────────────────────────
function EmptyBowlGlaze({ soupColor }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }}
    >
      {/* Oil residue on dry bowl */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 45% 60%, ${soupColor}55 0%, ${soupColor}22 40%, transparent 75%)`,
      }} />
      {/* Iridescent oil sheen */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '-60%',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,220,80,0.18) 30deg, rgba(255,120,0,0.12) 70deg, transparent 120deg, rgba(255,200,50,0.14) 200deg, transparent 260deg)',
        }}
      />
      {/* Glossy bowl bottom reflection */}
      <div style={{
        position: 'absolute', bottom: '15%', left: '20%', right: '20%', height: '30%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(3px)',
      }} />
      {/* Remaining chili flakes */}
      {[0,1,2].map(i => (
        <div key={i} style={{
          position: 'absolute',
          width: 3+i, height: 2,
          borderRadius: 1,
          background: '#7a0000',
          top: `${35+i*18}%`,
          left: `${20+i*22}%`,
          transform: `rotate(${i*55}deg)`,
          opacity: 0.6,
        }} />
      ))}
      {/* Warm glow text: 완식 */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', fontWeight: 900, color: 'rgba(255,180,80,0.8)',
          fontFamily: 'serif', letterSpacing: '0.2em',
          textShadow: '0 0 20px rgba(255,150,30,0.7)',
        }}
      >
        完食
      </motion.div>
    </motion.div>
  );
}

// Precomputed background particles
const BG_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: seededRand(i*11)*100, top: seededRand(i*11+1)*100,
  dur: 3+seededRand(i*11+2)*4, delay: seededRand(i*11+3)*3,
  size: 2+seededRand(i*11+4)*3,
}));

// ── Main EatingScreen ──────────────────────────────────────────────────────
export default function EatingScreen({ ingredients, config, onDone }) {
  const [eatIdx, setEatIdx]           = useState(0);
  const [bowlFill, setBowlFill]       = useState(1);
  const [chopPhase, setChopPhase]     = useState('resting');
  const [currentIng, setCurrentIng]   = useState(null);
  const [visibleIngs, setVisibleIngs] = useState(ingredients.slice(0, 4));
  const [bites, setBites]             = useState(0);
  const [rippleKey, setRippleKey]     = useState(0);
  const [done, setDone]               = useState(false);
  const [bowlEmpty, setBowlEmpty]     = useState(false);

  const soupType   = SOUP_TYPES.find(s => s.id === config.soup) || SOUP_TYPES[0];
  const totalBites = Math.max(ingredients.length * 2, 12);  // at least 12 bites, cycle ingredients
  const msgIdx     = Math.min(eatIdx, EAT_MESSAGES.length - 1);
  const heatLevel  = EAT_MESSAGES[msgIdx]?.heat || 0;

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  useEffect(() => {
    if (done) return;
    const run = async () => {
      await delay(600);
      for (let i = 0; i < totalBites; i++) {
        // Map bite index to message index spread evenly across all bites
        setEatIdx(Math.min(Math.floor((i / totalBites) * (EAT_MESSAGES.length - 1)), EAT_MESSAGES.length - 2));
        const ing = ingredients[i % ingredients.length];
        setCurrentIng(ing);

        // Dip chopsticks into soup
        setChopPhase('dipping');
        await delay(700);

        // Lift with noodle stretch – hold longer so user can watch
        setChopPhase('lifting');
        await delay(1300);

        // Eat: chopstick pulls away
        setChopPhase('eating');
        await delay(550);

        // Update bowl — keep ≥12% so soup is always visible while eating.
        // The final drain to 0 happens explicitly after the loop.
        setBites(b => b + 1);
        setBowlFill(f => Math.max(0.12, f - 0.88 / totalBites));
        setRippleKey(k => k + 1);
        // Cycle ingredients: remove eaten one, rotate in the next
        setVisibleIngs(prev => {
          const without = prev.filter(v => v.id !== ing.id);
          const next = ingredients[(i + 4) % ingredients.length];
          const already = without.find(v => v.id === next.id);
          return already ? without.slice(0, 4) : [...without, next].slice(0, 4);
        });

        // Chopstick returns – linger before next bite
        setChopPhase('resting');
        setCurrentIng(null);
        await delay(950);
      }

      setEatIdx(EAT_MESSAGES.length - 1);
      setChopPhase('resting');
      // Drain the remaining soup visibly, then show empty bowl
      await delay(600);
      setBowlFill(0);
      await delay(900);
      setBowlEmpty(true);
      await delay(1800);
      setDone(true);
    };
    run();
  }, []);

  // Bowl width: responsive, max 320
  const bowlW = Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 32 : 320);
  const bowlH = Math.round(bowlW * 0.52);
  const rimH  = Math.round(bowlW * 0.075);

  // Vignette intensity increases with heat
  const vignetteOpacity = 0.05 + heatLevel * 0.06;

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: `radial-gradient(ellipse at 50% 80%, ${soupType.color}1a 0%, #080000 50%, #000000 100%)`,
      overflow: 'hidden', position: 'relative',
    }}>

      {/* Ambient heat vignette */}
      <motion.div
        animate={{ opacity: vignetteOpacity }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 100%, ${soupType.color}66 0%, transparent 55%)`,
        }}
      />

      {/* Background spice particles */}
      {BG_PARTICLES.map((p, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
            background: 'rgba(200,50,0,0.35)',
            left: `${p.left}%`, top: `${p.top}%`, zIndex: 0,
          }}
          animate={{ y: [-6,6,-6], opacity:[.15,.5,.15] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.delay }}
        />
      ))}

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, paddingBottom: 24, minHeight: '100vh' }}>

        {/* Mood message */}
        <div style={{ width: '100%', maxWidth: bowlW, padding: '0 4px', marginBottom: 16, textAlign: 'center', minHeight: 64 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIdx}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.94 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)', fontWeight: 800,
                color: heatLevel < 3 ? '#ff6b35' : heatLevel < 5 ? '#ff4500' : '#ff2200',
                letterSpacing: '0.03em', marginBottom: 4,
                textShadow: heatLevel >= 3 ? `0 0 ${10+heatLevel*4}px rgba(255,${Math.max(0,100-heatLevel*20)},0,0.7)` : 'none',
              }}>
                {EAT_MESSAGES[msgIdx]?.text}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,150,100,0.5)', fontFamily: 'serif' }}>
                {EAT_MESSAGES[msgIdx]?.sub}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Close-up Bowl Scene ── */}
        <div style={{ position: 'relative', width: bowlW, marginBottom: 20 }}>

          {/* Steam cloud above bowl */}
          <div style={{ position: 'absolute', top: -10, left: 0, right: 0, height: 90, zIndex: 12, pointerEvents: 'none' }}>
            <SteamEffect
              count={Math.max(3, Math.round(bowlFill * 8))}
              intensity={0.6 + bowlFill * 0.8}
              className="w-full h-full"
            />
          </div>

          {/* Chopstick arm */}
          <ChopstickArm phase={chopPhase} ingredient={currentIng} soupColor={soupType.color} />

          {/* Bowl body */}
          <div style={{
            position: 'relative',
            width: bowlW, height: bowlH + rimH,
            marginTop: 70,
          }}>
            {/* Rim */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: rimH,
              borderRadius: rimH,
              background: 'linear-gradient(180deg, #4d1515 0%, #2a0808 50%, #160404 100%)',
              boxShadow: `
                0 4px 14px rgba(0,0,0,0.7),
                inset 0 2px 5px rgba(255,255,255,0.07),
                inset 0 -2px 4px rgba(0,0,0,0.5),
                0 0 30px rgba(${soupType.color.replace('#','').match(/../g)?.map(h=>parseInt(h,16)).join(',') || '200,0,0'},0.12)
              `,
              zIndex: 6,
            }}>
              <div style={{ position:'absolute', top:3, left:'8%', width:'84%', height:4, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.12) 60%, transparent)', borderRadius:4 }} />
              {/* Warm inner rim light */}
              <motion.div
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ position:'absolute', bottom:0, left:'5%', right:'5%', height:'55%', background:`linear-gradient(180deg, transparent, ${soupType.color}22)`, borderRadius:'0 0 50% 50%' }}
              />
            </div>

            {/* Bowl body */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: bowlH,
              borderRadius: '0 0 55% 55% / 0 0 80% 80%',
              background: 'linear-gradient(175deg, #2a0808 0%, #160404 40%, #0a0000 80%, #050000 100%)',
              boxShadow: `
                inset 0 -12px 28px rgba(0,0,0,0.9),
                inset 8px 0 16px rgba(0,0,0,0.5),
                inset -8px 0 16px rgba(0,0,0,0.5),
                inset 0 8px 20px rgba(255,60,0,0.05),
                0 14px 40px rgba(0,0,0,0.8)
              `,
              border: '2px solid #3d1010',
              overflow: 'hidden', zIndex: 2,
            }}>
              {/* Interior metallic sheen */}
              <div style={{ position:'absolute', top:0, left:'10%', width:'25%', height:'100%', background:'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 70%)', borderRadius:'0 0 50% 50%' }} />

              {/* ── Soup fill level ── */}
              <motion.div
                animate={{ height: `${Math.max(0, bowlFill) * 92}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{
                  position: 'absolute', bottom: 0, left: 6, right: 6,
                  background: `radial-gradient(ellipse at 44% 35%, ${soupType.color}ff 0%, ${soupType.color}ee 30%, ${soupType.color}cc 60%, ${soupType.color}88 85%)`,
                  borderRadius: '0 0 50% 50% / 0 0 75% 75%',
                  overflow: 'hidden',
                  boxShadow: `inset 0 4px 20px rgba(0,0,0,0.55)`,
                }}
              >
                {/* Empty bowl glaze */}
                {bowlEmpty && <EmptyBowlGlaze soupColor={soupType.color} />}

                {/* Deep shadow at bowl bottom */}
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 115%, rgba(0,0,0,0.55) 0%, transparent 55%)` }} />

                {/* Oil layer */}
                {!bowlEmpty && (<>
                  <motion.div
                    animate={{ rotate: [0,360] }}
                    transition={{ duration:14, repeat:Infinity, ease:'linear' }}
                    style={{
                      position:'absolute', inset:'-55%',
                      background:'conic-gradient(from 0deg, transparent 0deg, rgba(255,160,0,0.1) 30deg, rgba(255,220,60,0.08) 60deg, transparent 100deg, rgba(255,80,0,0.1) 190deg, transparent 240deg)',
                    }}
                  />
                  {/* Glossy oil spots */}
                  {[
                    { top:'22%', left:'28%', w:18, h:9  },
                    { top:'48%', left:'62%', w:12, h:6  },
                    { top:'65%', left:'18%', w:8,  h:4  },
                  ].map((g,i) => (
                    <motion.div key={i}
                      animate={{ opacity:[.45,.85,.45] }}
                      transition={{ duration:2.5+i, repeat:Infinity, delay:i*.7 }}
                      style={{
                        position:'absolute', top:g.top, left:g.left, width:g.w, height:g.h, borderRadius:'50%',
                        background:'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.78), rgba(255,210,80,0.35) 50%, transparent)',
                      }}
                    />
                  ))}
                  {/* Peppercorns */}
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{
                      position:'absolute', width:5, height:5, borderRadius:'50%',
                      background:'radial-gradient(circle at 35% 30%, #6b3a1f, #1a0a03)',
                      top:`${28+i*16}%`, left:`${55+i*8}%`,
                      boxShadow:'0 1px 4px rgba(0,0,0,0.8)',
                    }} />
                  ))}
                  {/* Chili flakes */}
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} style={{
                      position:'absolute', width:3+(i%3), height:2,
                      borderRadius:1, background:'#8b0000',
                      top:`${18+i*12}%`, left:`${12+i*13}%`,
                      transform:`rotate(${i*40}deg)`, opacity:.7,
                    }} />
                  ))}
                </>)}

                {/* Surface ripple from chopstick */}
                <SurfaceRipple x={50} y={25} color={soupType.color} rippleKey={rippleKey} />

                {/* Remaining ingredients in bowl */}
                {!bowlEmpty && visibleIngs.map((ing, i) => {
                  const angle = (i / Math.max(visibleIngs.length, 1)) * Math.PI * 2 - Math.PI * 0.25;
                  const r = 26 + (i % 2) * 16;
                  const cx = 50 + Math.cos(angle) * r;
                  const cy = 44 + Math.sin(angle) * r * 0.44;
                  const ingSize = Math.round(bowlW * 0.165); // ~53px at 320 bowl width
                  return (
                    <motion.div
                      key={ing.id}
                      layout
                      initial={{ opacity: 0, scale: 0.4, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: [0,-3,0], rotate:[0,1.2,-0.8,0] }}
                      exit={{ opacity: 0, scale: 0.15, y: -44, transition: { duration: 0.3 } }}
                      transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, delay: i * 0.25 }}
                      style={{
                        position: 'absolute',
                        left: `${cx}%`, top: `${cy}%`,
                        transform: 'translate(-50%,-50%)',
                        zIndex: 5,
                        filter: `drop-shadow(0 3px 10px rgba(0,0,0,0.7)) drop-shadow(0 0 6px ${soupType.color}55)`,
                      }}
                    >
                      <IngredientRenderer ingredient={ing} size={ingSize} />
                      {/* Soup coating gloss */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `radial-gradient(circle at 35% 28%, rgba(255,200,60,0.18), transparent 65%)`,
                        borderRadius: '50%', pointerEvents: 'none',
                      }} />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Warm interior glow */}
              <motion.div
                animate={{ opacity:[.12,.22,.12] }}
                transition={{ duration:1.6, repeat:Infinity }}
                style={{ position:'absolute', bottom:0, left:'8%', right:'8%', height:'50%', background:`radial-gradient(ellipse at 50% 100%, ${soupType.color}44 0%, transparent 70%)`, borderRadius:'0 0 50% 50%' }}
              />
            </div>
          </div>
        </div>

        {/* Consumption stats */}
        <div style={{ width:'100%', maxWidth:bowlW, padding:'0 4px' }}>
          <div style={{
            background:'rgba(16,2,2,0.88)', border:'1px solid rgba(100,10,10,0.4)',
            borderRadius:10, padding:'12px 16px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <div style={{ fontSize:'0.62rem', color:'rgba(200,80,50,0.6)', fontFamily:'monospace', letterSpacing:'0.1em' }}>먹은 양</div>
              <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#ff6b35', fontFamily:'monospace' }}>{Math.round((1-bowlFill)*100)}%</div>
            </div>
            <div style={{ height:5, borderRadius:3, background:'rgba(50,0,0,0.5)', overflow:'hidden', marginBottom:8 }}>
              <motion.div
                animate={{ width:`${(1-bowlFill)*100}%` }}
                transition={{ duration:0.6 }}
                style={{ height:'100%', background:`linear-gradient(90deg, #8b0000, #ff4500)`, borderRadius:3, boxShadow:'0 0 8px rgba(255,70,0,0.5)' }}
              />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.58rem', color:'rgba(180,80,50,0.5)', fontFamily:'monospace' }}>
              <span>한 입: {bites}</span>
              <span>남은 재료: {Math.max(0, ingredients.length - bites)}개</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Completion overlay ── */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'radial-gradient(ellipse at 50% 60%, rgba(80,10,0,0.96) 0%, rgba(0,0,0,0.97) 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Empty bowl glow */}
            <motion.div
              animate={{ scale:[1,1.08,1], opacity:[0.4,0.8,0.4] }}
              transition={{ duration:2, repeat:Infinity }}
              style={{
                position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)',
                width:200, height:200, borderRadius:'50%',
                background:`radial-gradient(ellipse, ${soupType.color}22 0%, transparent 70%)`,
                filter:'blur(20px)',
              }}
            />

            <motion.div
              initial={{ scale:0, rotate:-20 }}
              animate={{ scale:1, rotate:0 }}
              transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
              style={{ fontSize:'4.5rem', marginBottom:12 }}
            >
              🏆
            </motion.div>

            <motion.div
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.35, duration:0.6 }}
              style={{ textAlign:'center', padding:'0 24px' }}
            >
              <div style={{
                fontSize:'1.6rem', fontWeight:900, color:'#ff6b35',
                letterSpacing:'0.12em', fontFamily:'monospace', marginBottom:6,
                textShadow:'0 0 24px rgba(255,100,0,0.6)',
              }}>
                완식 완료
              </div>
              <div style={{ fontSize:'0.85rem', color:'rgba(255,180,100,0.6)', fontFamily:'serif', marginBottom:6 }}>
                你吃完了整碗麻辣烫
              </div>
              <div style={{ fontSize:'0.65rem', color:'rgba(200,80,50,0.45)', fontFamily:'monospace', letterSpacing:'0.15em', marginBottom:32 }}>
                {bites}번의 젓가락질 · {ingredients.length}가지 재료 정복
              </div>

              <motion.button
                whileHover={{ scale:1.05, boxShadow:'0 0 36px rgba(200,0,0,0.65)' }}
                whileTap={{ scale:0.97 }}
                onClick={onDone}
                style={{
                  background:'linear-gradient(135deg, #8b0000, #c62828)',
                  border:'1px solid rgba(255,100,50,0.4)',
                  color:'#fff', padding:'15px 48px', borderRadius:6,
                  fontSize:'1rem', fontWeight:700, letterSpacing:'0.2em',
                  cursor:'pointer', fontFamily:'monospace', textTransform:'uppercase',
                  boxShadow:'0 0 22px rgba(200,0,0,0.4)',
                }}
              >
                내 칭호 보기 →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
