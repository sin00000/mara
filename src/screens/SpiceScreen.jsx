import { motion, AnimatePresence } from 'framer-motion';
import { SPICE_LEVELS, MALA_LEVELS, SOUP_TYPES } from '../data/ingredients';
import SteamEffect from '../components/SteamEffect';

// ── Live soup bowl preview ─────────────────────────────────────────────────
function LiveSoupBowl({ config }) {
  const soupType = SOUP_TYPES.find(s => s.id === config.soup) || SOUP_TYPES[0];
  const spiceLevel = SPICE_LEVELS.find(s => s.id === config.spice) || SPICE_LEVELS[0];

  return (
    <div style={{ textAlign: 'center', marginBottom: 22 }}>
      <div style={{
        fontSize: '0.58rem', color: 'rgba(255,100,50,0.4)',
        letterSpacing: '0.25em', fontFamily: 'monospace', marginBottom: 8,
      }}>
        실시간 미리보기
      </div>

      <div style={{ position: 'relative', width: 200, margin: '0 auto' }}>
        {/* Steam */}
        <div style={{ height: 52, position: 'relative' }}>
          <SteamEffect count={5} intensity={0.9} className="w-full h-full" />
        </div>

        {/* Bowl body */}
        <div style={{
          width: 200, height: 88,
          background: 'linear-gradient(175deg, #1d0000 0%, #0e0000 100%)',
          borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          border: '2px solid #3d0808',
          boxShadow: '0 8px 28px rgba(0,0,0,0.8), inset 0 -8px 16px rgba(0,0,0,0.5), 0 0 30px rgba(200,0,0,0.08)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Animated soup surface – color transitions with soup type */}
          <motion.div
            animate={{ backgroundColor: soupType.color }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: '6px 6px 0 6px',
              borderRadius: '0 0 50% 50% / 0 0 100% 100%',
            }}
          >
            {/* Oil shimmer layer */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-50%',
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,200,50,0.13) 40deg, transparent 80deg, rgba(255,100,0,0.09) 180deg, transparent 220deg)',
              }}
            />

            {/* Gloss specular spots */}
            {[
              { top: '18%', left: '26%', w: 15, h: 8 },
              { top: '46%', left: '62%', w: 9, h: 5 },
              { top: '62%', left: '22%', w: 6, h: 4 },
            ].map((s, i) => (
              <motion.div key={i}
                animate={{ opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 2.2 + i, repeat: Infinity, delay: i * 0.6 }}
                style={{
                  position: 'absolute', top: s.top, left: s.left,
                  width: s.w, height: s.h, borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), rgba(255,200,80,0.3) 50%, transparent)',
                }}
              />
            ))}

            {/* Floating chili flakes */}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                position: 'absolute',
                width: 3 + (i % 2), height: 2,
                borderRadius: 1,
                background: '#7a0000',
                top: `${22 + i * 13}%`,
                left: `${14 + i * 15}%`,
                transform: `rotate(${i * 40}deg)`,
                opacity: 0.75,
              }} />
            ))}

            {/* Peppercorns */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute',
                width: 4, height: 4, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #6b3a1f, #1a0a03)',
                top: `${30 + i * 20}%`,
                left: `${60 + i * 10}%`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.7)',
              }} />
            ))}
          </motion.div>

          {/* Rim gloss */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', width: '80%', height: 4,
            background: 'rgba(255,255,255,0.06)', borderRadius: 4,
          }} />
        </div>

        {/* Bowl rim */}
        <div style={{
          width: 220, height: 20, borderRadius: 10,
          background: 'linear-gradient(180deg, #411212, #210808)',
          margin: '-10px auto 0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative', zIndex: 2,
        }}>
          <div style={{ position:'absolute', top:3, left:'12%', width:'76%', height:3, background:'rgba(255,255,255,0.06)', borderRadius:3 }} />
          {/* Warm rim inner glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position:'absolute', bottom:0, left:'10%', right:'10%', height:'50%', background:`linear-gradient(180deg, transparent, ${soupType.color}22)`, borderRadius:'0 0 50% 50%' }}
          />
        </div>

        {/* Soup type label – animates in when changed */}
        <AnimatePresence mode="wait">
          <motion.div
            key={soupType.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 10, textAlign: 'center',
              fontSize: '0.72rem', fontWeight: 700,
              color: soupType.color,
              fontFamily: 'monospace', letterSpacing: '0.1em',
              textShadow: `0 0 10px ${soupType.color}`,
            }}
          >
            {soupType.label} · {soupType.chinese}
          </motion.div>
        </AnimatePresence>

        {/* Spice tint overlay hint */}
        {spiceLevel.intensity > 0 && (
          <motion.div
            animate={{ opacity: spiceLevel.intensity * 0.06 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 30, borderRadius: '0 0 50% 50% / 0 0 100% 100%',
              background: spiceLevel.color,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Selector row ───────────────────────────────────────────────────────────
function SelectorRow({ label, sublabel, options, value, onChange, getColor }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
        <div>
          <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#ff6b35', letterSpacing:'0.08em' }}>{label}</div>
          <div style={{ fontSize:'0.62rem', color:'rgba(255,150,100,0.5)', fontFamily:'serif' }}>{sublabel}</div>
        </div>
        <div style={{
          fontSize:'0.7rem', color:getColor?getColor(value):'#ff4500',
          fontFamily:'monospace', alignSelf:'flex-end',
          textShadow:`0 0 8px ${getColor?getColor(value):'#ff4500'}`,
        }}>
          {options.find(o=>o.id===value)?.label||'—'}
        </div>
      </div>
      <div style={{ display:'flex', gap:6 }}>
        {options.map(opt => {
          const active = value===opt.id;
          const col = opt.color||'#ff4500';
          return (
            <motion.button key={opt.id}
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={()=>onChange(opt.id)}
              style={{
                flex:1, padding:'8px 4px',
                border:active?`1.5px solid ${col}`:'1.5px solid rgba(80,10,10,0.4)',
                borderRadius:6,
                background:active?`linear-gradient(180deg, ${col}33, ${col}11)`:'rgba(15,3,3,0.7)',
                cursor:'pointer', textAlign:'center',
                boxShadow:active?`0 0 12px ${col}44`:'none', transition:'all 0.2s',
              }}
            >
              <div style={{ fontSize:'0.58rem', color:active?col:'rgba(200,100,80,0.5)', fontWeight:700, fontFamily:'monospace', lineHeight:1.3 }}>
                {opt.label}
              </div>
              {opt.chinese && (
                <div style={{ fontSize:'0.5rem', color:active?col+'aa':'rgba(150,60,40,0.4)', fontFamily:'serif' }}>
                  {opt.chinese}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleOption({ label, sublabel, value, onChange }) {
  return (
    <motion.button
      whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
      onClick={()=>onChange(!value)}
      style={{
        width:'100%', padding:'12px 16px',
        border:value?'1.5px solid rgba(255,100,50,0.5)':'1.5px solid rgba(60,10,10,0.4)',
        borderRadius:8,
        background:value?'linear-gradient(135deg, rgba(139,0,0,0.3), rgba(60,0,0,0.3))':'rgba(15,3,3,0.6)',
        cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center',
        boxShadow:value?'0 0 16px rgba(200,0,0,0.2)':'none', transition:'all 0.2s', marginBottom:8,
      }}
    >
      <div>
        <div style={{ fontSize:'0.8rem', fontWeight:600, color:value?'#ff6b35':'rgba(200,100,80,0.6)', textAlign:'left' }}>{label}</div>
        <div style={{ fontSize:'0.6rem', color:'rgba(180,80,50,0.4)', fontFamily:'serif' }}>{sublabel}</div>
      </div>
      <div style={{
        width:36, height:20, borderRadius:10,
        background:value?'linear-gradient(90deg, #c62828, #ff4500)':'rgba(50,10,10,0.8)',
        border:'1px solid rgba(100,20,20,0.5)', position:'relative', transition:'all 0.3s',
        boxShadow:value?'0 0 8px rgba(200,0,0,0.4)':'none',
      }}>
        <motion.div
          animate={{ x:value?16:2 }}
          transition={{ type:'spring', stiffness:400, damping:30 }}
          style={{
            position:'absolute', top:2, width:14, height:14, borderRadius:'50%',
            background:value?'#ff6b35':'rgba(100,30,30,0.8)',
            boxShadow:value?'0 0 6px rgba(255,100,50,0.6)':'none',
          }}
        />
      </div>
    </motion.button>
  );
}

const HEAT_MSGS = [
  '편안하다. 너무 편안해.',
  '슬슬 흥미로워지고 있다...',
  '혀가 얼얼해질 것이다.',
  '위험 구역 돌입.',
  '정말 확신하는가?',
];

export default function SpiceScreen({ config, onChange, onCook, onBack }) {
  const spiceIntensity = SPICE_LEVELS.find(s=>s.id===config.spice)?.intensity||0;
  const malaIntensity  = MALA_LEVELS.find(s=>s.id===config.mala)?.intensity||0;
  const totalIntensity = spiceIntensity + malaIntensity;
  const pct = totalIntensity / 9;
  const flameColor = pct<.3?'#4caf50':pct<.6?'#ff9800':pct<.8?'#ff5722':'#b71c1c';
  const heatMsgIdx = Math.min(HEAT_MSGS.length-1, Math.floor(pct*HEAT_MSGS.length));

  return (
    <div className="min-h-screen flex flex-col" style={{
      background:'radial-gradient(ellipse at 50% 100%, #1a0303 0%, #0a0000 50%, #000000 100%)',
    }}>
      {/* Header */}
      <div style={{
        padding:'16px 20px 8px', borderBottom:'1px solid rgba(180,0,0,0.2)',
        background:'rgba(10,0,0,0.9)', backdropFilter:'blur(12px)',
        position:'sticky', top:0, zIndex:20,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:600, margin:'0 auto' }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:'rgba(255,100,50,0.7)', fontSize:'0.8rem', cursor:'pointer', fontFamily:'monospace', letterSpacing:'0.1em' }}>
            ← 뒤로
          </button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'0.6rem', letterSpacing:'0.3em', color:'rgba(255,80,0,0.6)', fontFamily:'monospace' }}>2단계 / 3</div>
            <div style={{ fontSize:'1rem', fontWeight:700, color:'#ff6b35', letterSpacing:'0.08em' }}>맛 커스텀</div>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,150,100,0.5)', fontFamily:'serif' }}>调味 · 口味选择</div>
          </div>
          <div style={{ width:60 }} />
        </div>
      </div>

      <div style={{ maxWidth:500, margin:'0 auto', width:'100%', padding:'16px 16px 120px', overflowY:'auto' }}>

        {/* Live soup preview */}
        <LiveSoupBowl config={config} />

        {/* Heat index */}
        <div style={{ background:'rgba(20,3,3,0.8)', border:'1px solid rgba(100,10,10,0.5)', borderRadius:12, padding:'16px 20px', marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,150,100,0.6)', fontFamily:'monospace', letterSpacing:'0.1em' }}>화끈함 지수</div>
            <div style={{ fontSize:'1.4rem', fontWeight:900, color:flameColor, textShadow:`0 0 12px ${flameColor}` }}>{Math.round(pct*100)}%</div>
          </div>
          <div style={{ height:8, borderRadius:4, background:'rgba(50,0,0,0.5)', overflow:'hidden' }}>
            <motion.div
              animate={{ width:`${pct*100}%` }}
              transition={{ duration:0.5, ease:'easeOut' }}
              style={{ height:'100%', background:`linear-gradient(90deg, #4caf50, #ff9800, ${flameColor})`, borderRadius:4, boxShadow:`0 0 8px ${flameColor}88` }}
            />
          </div>
          <div style={{ fontSize:'0.6rem', color:'rgba(200,80,50,0.45)', fontFamily:'monospace', marginTop:6 }}>
            {HEAT_MSGS[heatMsgIdx]}
          </div>
        </div>

        <SelectorRow label="매운 정도" sublabel="辣度" options={SPICE_LEVELS} value={config.spice} onChange={v=>onChange('spice',v)} getColor={v=>SPICE_LEVELS.find(s=>s.id===v)?.color} />
        <SelectorRow label="마라 강도" sublabel="麻度" options={MALA_LEVELS} value={config.mala} onChange={v=>onChange('mala',v)} />
        <SelectorRow label="국물 베이스" sublabel="汤底" options={SOUP_TYPES} value={config.soup} onChange={v=>onChange('soup',v)} getColor={v=>SOUP_TYPES.find(s=>s.id===v)?.color} />

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#ff6b35', letterSpacing:'0.08em', marginBottom:4 }}>추가 토핑</div>
          <div style={{ fontSize:'0.62rem', color:'rgba(255,150,100,0.5)', fontFamily:'serif', marginBottom:12 }}>调味料选项</div>
          <ToggleOption label="고수" sublabel="香菜" value={config.coriander} onChange={v=>onChange('coriander',v)} />
          <ToggleOption label="마늘 추가" sublabel="大蒜" value={config.garlic} onChange={v=>onChange('garlic',v)} />
          <ToggleOption label="참깨 소스" sublabel="芝麻酱" value={config.sesame} onChange={v=>onChange('sesame',v)} />
        </div>
      </div>

      {/* Start cooking CTA */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:30,
        padding:'12px 20px 30px',
        background:'linear-gradient(0deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.8) 60%, transparent 100%)',
      }}>
        <div style={{ maxWidth:500, margin:'0 auto' }}>
          <motion.button
            whileHover={{ scale:1.02, boxShadow:'0 0 44px rgba(200,0,0,0.75)' }}
            whileTap={{ scale:0.97 }}
            onClick={onCook}
            className="glow-red"
            style={{
              width:'100%',
              background:'linear-gradient(135deg, #6d0000, #c62828, #6d0000)',
              border:'1px solid rgba(255,100,50,0.4)',
              color:'#fff', padding:'16px', borderRadius:6,
              fontSize:'1.05rem', fontWeight:900, letterSpacing:'0.2em',
              cursor:'pointer', fontFamily:'monospace', textTransform:'uppercase',
              boxShadow:'0 0 30px rgba(200,0,0,0.5)',
            }}
          >
            🔥 요리 시작
          </motion.button>
        </div>
      </div>
    </div>
  );
}
