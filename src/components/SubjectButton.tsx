import { motion } from 'framer-motion';
import { Subject } from '../types';
import { playClickSound } from '../sounds';

interface SubjectButtonProps {
  subject: Subject;
  onClick: () => void;
}

const subjectConfig = {
  maths: { emoji: '🔢', label: 'Maths', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
  reading: { emoji: '📚', label: 'Reading', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
  spelling: { emoji: '✏️', label: 'Spelling', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
};

export default function SubjectButton({ subject, onClick }: SubjectButtonProps) {
  const config = subjectConfig[subject];

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`${config.color} ${config.hoverColor} text-white rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-4 min-w-[200px] min-h-[200px]`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-7xl">{config.emoji}</div>
      <div className="text-2xl font-bold">{config.label}</div>
    </motion.button>
  );
}
