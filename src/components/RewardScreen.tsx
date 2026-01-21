import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { playSuccessSound } from '../sounds';

interface RewardScreenProps {
  onContinue: () => void;
  starsEarned: number;
  pointsEarned: number;
}

const celebrations = [
  '🎉 Amazing job!',
  '⭐ You are a star!',
  '🏆 Well done!',
  '🎊 Fantastic work!',
  '💫 You did it!',
  '🌟 Brilliant!',
];

const confetti = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 0.5,
  duration: 1 + Math.random() * 2,
}));

export default function RewardScreen({ onContinue, starsEarned, pointsEarned }: RewardScreenProps) {
  const [message] = useState(
    celebrations[Math.floor(Math.random() * celebrations.length)]
  );

  const getPointsBreakdown = () => {
    const basePoints = 10;
    const bonusPoints = pointsEarned - basePoints;
    return { basePoints, bonusPoints };
  };

  const { basePoints, bonusPoints } = getPointsBreakdown();

  useEffect(() => {
    // Play celebration sound
    playSuccessSound();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col items-center justify-center z-50"
    >
      {/* Confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute text-4xl"
          initial={{ y: -100, x: `${piece.x}vw`, opacity: 1 }}
          animate={{ y: '100vh', opacity: 0 }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
        >
          {'🎊🎉⭐💫🌟'[Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="text-9xl mb-8"
      >
        ⭐
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl font-bold text-white mb-4"
      >
        {message}
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-8"
      >
        <div className="text-3xl text-white/90 mb-4">
          You earned {starsEarned} star{starsEarned !== 1 ? 's' : ''}!
        </div>
        <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto">
          <div className="text-5xl font-bold text-yellow-300 mb-3">
            🏆 +{pointsEarned} Points!
          </div>
          <div className="text-lg text-white/80 space-y-1">
            <div>✅ Session completed: {basePoints} pts</div>
            {bonusPoints > 0 && (
              <div className="text-yellow-300 font-semibold">
                🎯 Bonus: +{bonusPoints} pts!
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={onContinue}
        className="bg-white text-purple-600 px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:bg-gray-100"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue 🎯
      </motion.button>
    </motion.div>
  );
}
