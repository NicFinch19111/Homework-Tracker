import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Child, Session, Subject, ChildProgress } from './types';

interface HomeworkStore {
  children: Child[];
  currentChild: Child | null;
  sessions: Session[];
  addSession: (childId: string, subject: Subject) => void;
  addBonusPoints: (childId: string, points: number) => void;
  setCurrentChild: (child: Child) => void;
  getChildProgress: (childId: string) => ChildProgress;
  calculateStreak: (childId: string) => number;
}

const defaultChildren: Child[] = [
  { id: '1', name: 'Ronnie', avatar: '⚽', color: '#f59e0b' },
  { id: '2', name: 'Hendley', avatar: '🦖', color: '#ec4899' },
];

export const useStore = create<HomeworkStore>()(
  persist(
    (set, get) => ({
      children: defaultChildren,
      currentChild: defaultChildren[0],
      sessions: [],

      addSession: (childId: string, subject: Subject) => {
        const { calculateStreak } = get();
        const currentStreak = calculateStreak(childId);
        
        // Base points: 10 per session
        let points = 10;
        
        // Streak bonus: +5 points for every 3-day streak
        if (currentStreak >= 3) {
          points += Math.floor(currentStreak / 3) * 5;
        }
        
        // Daily completion bonus: +10 if all 3 subjects done today
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = get().sessions.filter(
          (s) => s.childId === childId && s.date === today
        );
        const subjectsToday = new Set(todaySessions.map((s) => s.subject));
        if (subjectsToday.size === 2 && !subjectsToday.has(subject)) {
          points += 10; // Bonus for completing all 3 subjects
        }

        const newSession: Session = {
          id: Date.now().toString(),
          childId,
          subject,
          date: today,
          completed: true,
          stars: 1,
          points,
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));
      },

      addBonusPoints: (childId: string, points: number) => {
        // Add a bonus session to track bonus points
        const bonusSession: Session = {
          id: Date.now().toString(),
          childId,
          subject: 'maths', // Dummy subject for bonus
          date: new Date().toISOString().split('T')[0],
          completed: true,
          stars: 0,
          points,
        };
        set((state) => ({
          sessions: [...state.sessions, bonusSession],
        }));
      },

      setCurrentChild: (child: Child) => set({ currentChild: child }),

      calculateStreak: (childId: string) => {
        const { sessions } = get();
        const childSessions = sessions
          .filter((s) => s.childId === childId && s.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (childSessions.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        let currentDate = new Date(today);

        // Skip weekends
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate.setDate(currentDate.getDate() - 1);
        }

        for (let i = 0; i < 100; i++) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const hasSession = childSessions.some((s) => s.date === dateStr);

          if (hasSession) {
            streak++;
          } else {
            break;
          }

          // Move to previous weekday
          currentDate.setDate(currentDate.getDate() - 1);
          while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() - 1);
          }
        }

        return streak;
      },

      getChildProgress: (childId: string) => {
        const { sessions, calculateStreak } = get();
        const childSessions = sessions.filter((s) => s.childId === childId);
        const totalStars = childSessions.reduce((sum, s) => sum + s.stars, 0);
        const totalPoints = childSessions.reduce((sum, s) => sum + (s.points || 10), 0);

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday

        const weekSessions = childSessions.filter((s) => {
          const sessionDate = new Date(s.date);
          return sessionDate >= weekStart;
        });

        return {
          childId,
          totalStars,
          totalPoints,
          currentStreak: calculateStreak(childId),
          weekSessions,
          unlockedRewards: [],
        };
      },
    }),
    {
      name: 'homework-tracker-storage',
      version: 1,
      migrate: (persistedState: any) => {
        // Force update children to match defaultChildren
        return {
          ...persistedState,
          children: defaultChildren,
          currentChild: defaultChildren[0],
        };
      },
    }
  )
);
