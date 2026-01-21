# Homework Tracker 📚

An ADHD-friendly homework tracking app for children to complete daily 10-minute sessions in maths, reading, and spelling (Monday-Friday). Built with React, TypeScript, and Tailwind CSS.

## Features ✨

- **Visual Timer** - Circular countdown with color transitions
- **Instant Rewards** - Stars and celebrations after each session
- **Streak Tracking** - Track consecutive days of homework completion
- **Two Child Profiles** - Switch between children with custom avatars
- **Weekly Progress View** - See completed sessions at a glance
- **ADHD-Friendly Design** - Large buttons, clear visuals, minimal distractions
- **PWA Support** - Installable on devices, works offline

## Getting Started 🚀

### Prerequisites

You need to install **Node.js** (version 18 or higher) to run this project:

1. Download from [nodejs.org](https://nodejs.org/)
2. Install the LTS (Long Term Support) version
3. Restart your computer after installation

### Installation

1. Open a terminal in this folder
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How to Use 🎯

1. **Select a child** - Click on one of the two child avatars at the top
2. **Choose a subject** - Click on Maths 🔢, Reading 📚, or Spelling ✏️
3. **Complete the timer** - Work for 10 minutes (with optional pause)
4. **Earn rewards** - Get stars and celebrate your achievement!
5. **Track progress** - See your weekly progress and streak

## Customization 🎨

### Change Child Names and Avatars

Edit [src/store.ts](src/store.ts) and modify the `defaultChildren` array:

```typescript
const defaultChildren: Child[] = [
  { id: '1', name: 'Your Child Name', avatar: '🦄', color: '#f59e0b' },
  { id: '2', name: 'Other Child Name', avatar: '🦖', color: '#ec4899' },
];
```

### Change Timer Duration

In [src/App.tsx](src/App.tsx), change the duration (in seconds):

```typescript
<Timer onComplete={handleTimerComplete} duration={600} /> // 600 = 10 minutes
```

### Add Sounds

Place sound files in the `public` folder and update [src/components/RewardScreen.tsx](src/components/RewardScreen.tsx):

```typescript
const audio = new Audio('/celebration.mp3');
audio.play();
```

## Project Structure 📁

```
├── src/
│   ├── components/         # React components
│   │   ├── ChildSelector.tsx
│   │   ├── SubjectButton.tsx
│   │   ├── Timer.tsx
│   │   ├── RewardScreen.tsx
│   │   └── ProgressDashboard.tsx
│   ├── App.tsx            # Main application
│   ├── store.ts           # State management (Zustand)
│   ├── types.ts           # TypeScript types
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html
├── package.json
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

## Technology Stack 🛠️

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **Vite PWA** - Progressive Web App capabilities

## ADHD-Friendly Design Principles 🧠

- **Large, clear buttons** - Easy to tap/click
- **Immediate feedback** - Instant rewards and celebrations
- **Visual progress** - Clear indicators of time and achievement
- **Minimal distractions** - Focus on one task at a time
- **Positive reinforcement** - No penalties, only rewards
- **Limited decisions** - Simple 3-subject choice
- **Pause capability** - Allows short breaks when needed

## License

MIT License - Feel free to modify and use for your family!
