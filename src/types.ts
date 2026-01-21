export type Subject = 'maths' | 'reading' | 'spelling';

export type Child = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export type Session = {
  id: string;
  childId: string;
  subject: Subject;
  date: string;
  completed: boolean;
  stars: number;
  points: number;
};

export type ChildProgress = {
  childId: string;
  totalStars: number;
  totalPoints: number;
  currentStreak: number;
  weekSessions: Session[];
  unlockedRewards: string[];
};
