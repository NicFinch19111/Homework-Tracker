import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { playSuccessSound, playClickSound } from '../sounds';

interface BonusChallengeProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

type Challenge = {
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
};

const challenges: Challenge[] = [
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "64", "48"],
    correctIndex: 1,
    points: 20,
  },
  {
    question: "How do you spell the color of the sky?",
    options: ["BLEW", "BLUE", "BLU", "BLOO"],
    correctIndex: 1,
    points: 20,
  },
  {
    question: "Who wrote 'Harry Potter'?",
    options: ["J.R.R. Tolkien", "Roald Dahl", "J.K. Rowling", "Dr. Seuss"],
    correctIndex: 2,
    points: 20,
  },
  {
    question: "What is 15 + 27?",
    options: ["42", "41", "43", "40"],
    correctIndex: 0,
    points: 20,
  },
  {
    question: "Which word is spelled correctly?",
    options: ["BECUASE", "BEACUSE", "BECAUSE", "BECASUE"],
    correctIndex: 2,
    points: 20,
  },
];

export default function BonusChallenge({ onComplete, onClose }: BonusChallengeProps) {
  const [challenge] = useState(() => challenges[Math.floor(Math.random() * challenges.length)]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    playClickSound();
    setSelectedIndex(index);
    setIsAnswered(true);

    setTimeout(() => {
      if (index === challenge.correctIndex) {
        playSuccessSound();
        onComplete(challenge.points);
      } else {
        onClose();
      }
    }, 1500);
  };

  const isCorrect = selectedIndex === challenge.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">⚡</div>
          <h2 className="text-3xl font-bold text-white mb-2">Bonus Challenge!</h2>
          <p className="text-white/90 text-lg">Answer correctly for +{challenge.points} points!</p>
        </div>

        <div className="bg-white/20 rounded-2xl p-6 mb-6">
          <p className="text-2xl font-bold text-white text-center">
            {challenge.question}
          </p>
        </div>

        <div className="space-y-3">
          {challenge.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl text-xl font-bold transition-all ${
                isAnswered
                  ? index === challenge.correctIndex
                    ? 'bg-green-500 text-white'
                    : index === selectedIndex
                    ? 'bg-red-500 text-white'
                    : 'bg-white/30 text-white/50'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              {option}
              {isAnswered && index === challenge.correctIndex && ' ✓'}
              {isAnswered && index === selectedIndex && index !== challenge.correctIndex && ' ✗'}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-center text-xl font-bold ${
                isCorrect
                  ? 'bg-green-500/30 text-white'
                  : 'bg-red-500/30 text-white'
              }`}
            >
              {isCorrect ? '🎉 Correct! +' + challenge.points + ' points!' : '❌ Not quite! Try again later!'}
            </motion.div>
          )}
        </AnimatePresence>

        {!isAnswered && (
          <button
            onClick={onClose}
            className="w-full mt-4 text-white/70 hover:text-white py-2"
          >
            Skip challenge
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
