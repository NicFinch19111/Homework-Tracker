import { motion } from 'framer-motion';
import { useStore } from '../store';
import { playClickSound } from '../sounds';

export default function ChildSelector() {
  const { children, currentChild, setCurrentChild } = useStore();

  return (
    <div className="flex gap-4 justify-center mb-6">
      {children.map((child) => (
        <motion.button
          key={child.id}
          onClick={() => {
            playClickSound();
            setCurrentChild(child);
          }}
          className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all ${
            currentChild?.id === child.id
              ? 'bg-white text-gray-800 shadow-lg scale-110'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            borderColor: child.color,
            borderWidth: currentChild?.id === child.id ? 4 : 0,
          }}
        >
          <div className="text-4xl mb-2">{child.avatar}</div>
          <div>{child.name}</div>
        </motion.button>
      ))}
    </div>
  );
}
