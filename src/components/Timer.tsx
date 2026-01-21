import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  onComplete: () => void;
  duration: number; // in seconds
}

export default function Timer({ onComplete, duration }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onComplete]);

  const progress = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePause = () => {
    if (pauseCount < 2) {
      setIsPaused(!isPaused);
      if (!isPaused) {
        setPauseCount((prev) => prev + 1);
      }
    }
  };

  const getColor = () => {
    if (progress > 50) return '#10b981'; // green
    if (progress > 20) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <svg width="300" height="300" className="timer-ring">
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          <motion.circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke={getColor()}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl font-bold text-white">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xl text-white/80 mt-2">
            {isPaused ? 'Paused' : 'Keep going!'}
          </div>
        </div>
      </div>

      {timeLeft > 0 && (
        <motion.button
          onClick={handlePause}
          className={`px-8 py-4 rounded-xl text-xl font-bold ${
            pauseCount >= 2
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white shadow-lg`}
          whileHover={pauseCount < 2 ? { scale: 1.05 } : {}}
          whileTap={pauseCount < 2 ? { scale: 0.95 } : {}}
          disabled={pauseCount >= 2}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'} 
          {pauseCount > 0 && ` (${2 - pauseCount} left)`}
        </motion.button>
      )}

      {timeLeft <= duration / 2 && timeLeft > 0 && !isPaused && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl text-yellow-300 font-bold"
        >
          🌟 Halfway there! You're doing great!
        </motion.div>
      )}
    </div>
  );
}
