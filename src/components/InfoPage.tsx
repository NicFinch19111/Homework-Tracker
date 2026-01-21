import { motion } from 'framer-motion';

interface InfoPageProps {
  onClose: () => void;
}

export default function InfoPage({ onClose }: InfoPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-white">ℹ️ How to Use</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-3xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-white">
          {/* Getting Started */}
          <section className="bg-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              🚀 Getting Started
            </h3>
            <ol className="space-y-2 text-lg">
              <li>1️⃣ Click on your name at the top</li>
              <li>2️⃣ Choose a subject (Maths 🔢, Reading 📚, or Spelling ✏️)</li>
              <li>3️⃣ Work for 10 minutes</li>
              <li>4️⃣ Earn stars and points!</li>
            </ol>
          </section>

          {/* Point System */}
          <section className="bg-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              🏆 How to Earn Points
            </h3>
            <div className="space-y-3 text-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <strong>Complete a session:</strong> 10 points
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <strong>Streak bonus:</strong> +5 points for every 3 days in a row
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <strong>Daily completion:</strong> +10 points for finishing all 3 subjects in one day
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <strong>Bonus challenge:</strong> +20 points for quick questions
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              💡 Tips & Tricks
            </h3>
            <ul className="space-y-2 text-lg">
              <li>• Work every weekday to build your streak!</li>
              <li>• Complete all 3 subjects each day for bonus points</li>
              <li>• Click the ⚡ button for bonus challenges</li>
              <li>• You can pause twice if you need a quick break</li>
              <li>• Read the fun facts while you work!</li>
            </ul>
          </section>

          {/* Weekly Goal */}
          <section className="bg-yellow-400/20 rounded-2xl p-6 border-2 border-yellow-400">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              🎯 Weekly Goal
            </h3>
            <p className="text-lg">
              Complete <strong>15 sessions</strong> this week (3 subjects × 5 days) 
              to earn <strong>150+ points</strong>!
            </p>
          </section>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-white text-purple-600 py-4 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-colors"
        >
          Got it! Let's go! 🚀
        </button>
      </motion.div>
    </motion.div>
  );
}
