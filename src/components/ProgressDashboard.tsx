import { useStore } from '../store';
import { motion } from 'framer-motion';

export default function ProgressDashboard() {
  const { currentChild, getChildProgress } = useStore();

  if (!currentChild) return null;

  const progress = getChildProgress(currentChild.id);
  const today = new Date();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const getSessionsForDay = (dayOffset: number) => {
    const date = new Date(today);
    const currentDay = date.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    date.setDate(date.getDate() - daysFromMonday + dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    return progress.weekSessions.filter((s) => s.date === dateStr);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{currentChild.avatar}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{currentChild.name}</h2>
            <div className="flex gap-4 text-white/80">
              <p>⭐ {progress.totalStars} Stars</p>
              <p className="font-bold text-yellow-300">🏆 {progress.totalPoints} Points</p>
            </div>
          </div>
        </div>

        {progress.currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-2xl font-bold text-xl"
          >
            🔥 {progress.currentStreak} Day Streak!
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white mb-3">This Week</h3>
        <div className="grid grid-cols-5 gap-3">
          {days.map((day, index) => {
            const sessions = getSessionsForDay(index);
            const subjects = ['maths', 'reading', 'spelling'];
            const completedSubjects = subjects.filter((subject) =>
              sessions.some((s) => s.subject === subject)
            );

            return (
              <div key={day} className="text-center">
                <div className="text-white/70 text-sm mb-2">{day}</div>
                <div className="bg-white/20 rounded-xl p-3 min-h-[80px] flex flex-col justify-center">
                  {completedSubjects.length > 0 ? (
                    <div className="space-y-1">
                      {completedSubjects.map((subject) => (
                        <div key={subject} className="text-2xl">
                          {subject === 'maths' && '🔢'}
                          {subject === 'reading' && '📚'}
                          {subject === 'spelling' && '✏️'}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/40 text-xl">-</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
