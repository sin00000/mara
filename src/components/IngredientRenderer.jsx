// Renders realistic-looking ingredient shapes using layered CSS

export default function IngredientRenderer({ ingredient, size = 40, className = '' }) {
  const s = size;

  const shapes = {
    noodle: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            left: 4 + i * 2,
            top: 8 + i * 6,
            width: s - 10,
            height: 4,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${ingredient.renderColor}aa, ${ingredient.renderColor}, ${ingredient.renderColor}88)`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.4)`,
            transform: `rotate(${i * 5 - 5}deg)`,
            filter: 'blur(0.3px)',
          }} />
        ))}
      </div>
    ),
    slice: (
      <div className={className} style={{ width: s, height: s * 0.7, position: 'relative' }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: i * 8,
            left: 2,
            width: s - 4,
            height: 14,
            borderRadius: 3,
            background: `linear-gradient(180deg, ${ingredient.renderColor}cc 0%, ${ingredient.renderColor} 40%, ${ingredient.renderColor}88 100%)`,
            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), 0 3px 6px rgba(0,0,0,0.5)`,
          }}>
            {/* marbling */}
            <div style={{
              position: 'absolute', top: 3, left: 6, width: '60%', height: 2,
              background: 'rgba(255,255,255,0.15)', borderRadius: 2,
            }} />
          </div>
        ))}
      </div>
    ),
    curved: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        <div style={{
          width: s * 0.8,
          height: s * 0.5,
          borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
          background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.3), ${ingredient.renderColor} 50%)`,
          boxShadow: `inset 0 -4px 8px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.4)`,
          transform: 'rotate(-30deg)',
          margin: '8px auto',
          border: `1px solid ${ingredient.renderColor}cc`,
        }} />
      </div>
    ),
    cube: (
      <div className={className} style={{ width: s, height: s, position: 'relative', perspective: 100 }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 4 + i * 10,
            left: 4 + i * 4,
            width: s * 0.6,
            height: s * 0.6,
            borderRadius: 4,
            background: `radial-gradient(circle at 30% 30%, ${ingredient.renderColor}ff, ${ingredient.renderColor}99)`,
            boxShadow: `inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.4)`,
            opacity: i === 1 ? 0.7 : 1,
          }} />
        ))}
      </div>
    ),
    oval: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 4 + i * 6,
            left: 4 + i * 8,
            width: s * 0.45,
            height: s * 0.6,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), ${ingredient.renderColor} 50%, ${ingredient.renderColor}88)`,
            boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.2), 1px 3px 6px rgba(0,0,0,0.4)`,
            transform: `rotate(${i * 15}deg)`,
          }}>
            <div style={{
              position: 'absolute', top: '15%', left: '20%', width: '30%', height: '20%',
              background: 'rgba(255,255,255,0.3)', borderRadius: '50%',
            }} />
          </div>
        ))}
      </div>
    ),
    leaf: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: i * 6,
            left: 4 + i * 3,
            width: s * 0.55,
            height: s * 0.7,
            borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
            background: `linear-gradient(170deg, ${ingredient.renderColor}cc 0%, ${ingredient.renderColor} 60%, #2e7d32 100%)`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.15), 0 3px 6px rgba(0,0,0,0.4)`,
            transform: `rotate(${i * 8 - 8}deg)`,
          }}>
            <div style={{
              position: 'absolute', top: '10%', left: '45%', width: 1, height: '70%',
              background: 'rgba(255,255,255,0.3)',
            }} />
          </div>
        ))}
      </div>
    ),
    thin: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 4 + i * 6,
            left: 6,
            width: s - 12,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${ingredient.renderColor}, transparent)`,
            transform: `rotate(${i % 2 === 0 ? 3 : -3}deg)`,
            opacity: 0.8 + i * 0.04,
          }} />
        ))}
      </div>
    ),
    sheet: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 6, left: 4, width: s - 8, height: s - 12,
          borderRadius: 6,
          background: `linear-gradient(135deg, ${ingredient.renderColor}aa, ${ingredient.renderColor}66, ${ingredient.renderColor}99)`,
          boxShadow: `inset 0 1px 4px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.4)`,
          border: `1px solid ${ingredient.renderColor}55`,
        }} />
      </div>
    ),
    roll: (
      <div className={className} style={{ width: s, height: s * 0.6, position: 'relative' }}>
        <div style={{
          width: s - 4, height: s * 0.55,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${ingredient.renderColor}cc 0%, ${ingredient.renderColor}88 50%, ${ingredient.renderColor}44 100%)`,
          boxShadow: `inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.5)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', top: 4 + i * 8, left: 0, width: '100%', height: 2,
              background: `rgba(255,255,255,0.15)`,
            }} />
          ))}
        </div>
      </div>
    ),
    wavy: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 4 + i * 10,
            left: 2,
            width: s - 4,
            height: s * 0.45,
            borderRadius: '40% 60% 40% 60% / 50% 50% 50% 50%',
            background: `radial-gradient(ellipse, ${ingredient.renderColor} 0%, #1a0a00 100%)`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.1), 0 3px 6px rgba(0,0,0,0.6)`,
            transform: `rotate(${i * 20}deg) scaleX(${i === 1 ? 0.85 : 1})`,
            opacity: i === 1 ? 0.75 : 1,
          }} />
        ))}
      </div>
    ),
    cluster: (
      <div className={className} style={{ width: s, height: s, position: 'relative' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 0,
            left: 4 + i * 5,
            width: 4,
            height: s - 8,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${ingredient.renderColor} 0%, ${ingredient.renderColor}88 100%)`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.3)`,
          }}>
            <div style={{
              width: 8, height: 10, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,0.4), ${ingredient.renderColor})`,
              marginLeft: -2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }} />
          </div>
        ))}
      </div>
    ),
  };

  return shapes[ingredient.shape] || (
    <div className={className} style={{
      width: s, height: s, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4), ${ingredient.renderColor})`,
      boxShadow: `0 4px 8px rgba(0,0,0,0.4)`,
    }} />
  );
}
