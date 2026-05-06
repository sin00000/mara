import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroScreen from './screens/IntroScreen';
import IngredientScreen from './screens/IngredientScreen';
import SpiceScreen from './screens/SpiceScreen';
import CookingScreen from './screens/CookingScreen';
import EatingScreen from './screens/EatingScreen';
import ResultScreen from './screens/ResultScreen';

const SCREENS = ['intro', 'ingredients', 'spice', 'cooking', 'eating', 'result'];

const defaultConfig = {
  spice: 'medium',
  mala: 'medium',
  soup: 'red',
  coriander: false,
  garlic: false,
  sesame: false,
};

function PageTransition({ children, screenKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [config, setConfig] = useState(defaultConfig);

  const goTo = (s) => setScreen(s);

  const toggleIngredient = (ing) => {
    setSelectedIngredients(prev => {
      const exists = prev.find(i => i.id === ing.id);
      if (exists) return prev.filter(i => i.id !== ing.id);
      return [...prev, ing];
    });
  };

  const updateConfig = (key, val) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  const restart = () => {
    setSelectedIngredients([]);
    setConfig(defaultConfig);
    setScreen('intro');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {screen === 'intro' && (
        <PageTransition screenKey="intro">
          <IntroScreen onStart={() => goTo('ingredients')} />
        </PageTransition>
      )}

      {screen === 'ingredients' && (
        <PageTransition screenKey="ingredients">
          <IngredientScreen
            selected={selectedIngredients}
            onToggle={toggleIngredient}
            onNext={() => goTo('spice')}
            onBack={() => goTo('intro')}
          />
        </PageTransition>
      )}

      {screen === 'spice' && (
        <PageTransition screenKey="spice">
          <SpiceScreen
            config={config}
            onChange={updateConfig}
            onCook={() => goTo('cooking')}
            onBack={() => goTo('ingredients')}
          />
        </PageTransition>
      )}

      {screen === 'cooking' && (
        <PageTransition screenKey="cooking">
          <CookingScreen
            ingredients={selectedIngredients}
            config={config}
            onDone={() => goTo('eating')}
          />
        </PageTransition>
      )}

      {screen === 'eating' && (
        <PageTransition screenKey="eating">
          <EatingScreen
            ingredients={selectedIngredients}
            config={config}
            onDone={() => goTo('result')}
          />
        </PageTransition>
      )}

      {screen === 'result' && (
        <PageTransition screenKey="result">
          <ResultScreen
            ingredients={selectedIngredients}
            config={config}
            onRestart={restart}
          />
        </PageTransition>
      )}
    </div>
  );
}
