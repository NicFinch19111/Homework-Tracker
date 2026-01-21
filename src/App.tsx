import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { Subject } from './types';
import { getRandomFact } from './facts';
import { playClickSound } from './sounds';
import ChildSelector from './components/ChildSelector';
import SubjectButton from './components/SubjectButton';
import Timer from './components/Timer';
import RewardScreen from './components/RewardScreen';
import ProgressDashboard from './components/ProgressDashboard';
import InfoPage from './components/InfoPage';
import BonusChallenge from './components/BonusChallenge';

type AppState = 'subject-select' | 'timer' | 'reward';

function App() {
  const [appState, setAppState] = useState<AppState>('subject-select');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [currentFact, setCurrentFact] = useState<string>('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const { currentChild, addSession, addBonusPoints, getChildProgress } = useStore();

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentFact(getRandomFact(subject));
    setAppState('timer');
  };

  const handleTimerComplete = () => {
    if (currentChild && selectedSubject) {
      addSession(currentChild.id, selectedSubject);
      
      // Get the points from the last session added
      const progress = getChildProgress(currentChild.id);
      const lastSession = progress.weekSessions[progress.weekSessions.length - 1];
      setPointsEarned(lastSession?.points || 10);
      
      setShowReward(true);
    }
  };

  const handleRewardContinue = () => {
    setShowReward(false);
    setAppState('subject-select');
    setSelectedSubject(null);
  };

  const handleBonusComplete = (points: number) => {
    if (currentChild) {
      addBonusPoints(currentChild.id, points);
      setShowBonus(false);
    }
  };

  const getSubjectConfig = (subject: Subject) => {
    const configs = {
      maths: { emoji: '🔢', label: 'Maths', color: '#3b82f6' },
      reading: { emoji: '📚', label: 'Reading', color: '#10b981' },
      spelling: { emoji: '✏️', label: 'Spelling', color: '#a855f7' },
    };
    return configs[subject];
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white">
            📚 Homework Tracker
          </h1>
          <div className="flex gap-3">
            <motion.button
              onClick={() => {
                playClickSound();
                setShowBonus(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ Bonus
            </motion.button>
            <motion.button
              onClick={() => {
                playClickSound();
                setShowInfo(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ℹ️ Info
            </motion.button>
          </div>
        </div>

        <ChildSelector />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {appState === 'subject-select' && (
              <motion.div
                key="subject-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <ProgressDashboard />

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                  <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    Choose a subject to start!
                  </h2>
                  <div className="flex gap-6 justify-center flex-wrap">
                    <SubjectButton
                      subject="maths"
                      onClick={() => handleSubjectSelect('maths')}
                    />
                    <SubjectButton
                      subject="reading"
                      onClick={() => handleSubjectSelect('reading')}
                    />
                    <SubjectButton
                      subject="spelling"
                      onClick={() => handleSubjectSelect('spelling')}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {appState === 'timer' && selectedSubject && (
              <motion.div
                key="timer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-xl"
              >
                {/* Fun fact display */}
                {currentFact && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-400/90 text-gray-800 rounded-2xl p-4 mb-6 text-center font-semibold"
                  >
                    {currentFact}
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">
                    {getSubjectConfig(selectedSubject).emoji}
                  </div>
                  <h2 className="text-4xl font-bold text-white">
                    {getSubjectConfig(selectedSubject).label}
                  </h2>
                  <p className="text-xl text-white/80 mt-2">
                    10 minutes of focused work!
                  </p>
                </div>

                <Timer onComplete={handleTimerComplete} duration={600} />

                <div className="text-center mt-8">
                  <button
                    onClick={() => {
                      setAppState('subject-select');
                      setSelectedSubject(null);
                    }}
                    className="text-white/60 hover:text-white underline"
                  >
                    Cancel and go back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReward && (
          <RewardScreen 
            onContinue={handleRewardContinue} 
            starsEarned={1}
            pointsEarned={pointsEarned}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfo && <InfoPage onClose={() => setShowInfo(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showBonus && currentChild && (
          <BonusChallenge
            onComplete={handleBonusComplete}
            onClose={() => setShowBonus(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
