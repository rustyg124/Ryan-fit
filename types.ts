export type Phase = 'ready' | 'countdown' | 'set' | 'rest' | 'finished';

export interface Exercise {
  id: string;
  name: string;
  photo: string;
  location: string;
  setup: string;
  safety: string;
  why: string;
  sets: number;
  target: string;
  restSeconds: number;
}

export interface Workout {
  id: string;
  title: string;
  duration: string;
  purpose: string;
  exercises: Exercise[];
}

export interface SetLog {
  date: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  pain: number;
  seconds: number;
}

export interface ActiveSession {
  workoutId: string;
  exerciseIndex: number;
  setNumber: number;
  phase: Phase;
  setSeconds: number;
  restSeconds: number;
  weight: string;
  reps: string;
  pain: number;
  savedAt: string;
}

export interface AppState {
  version: number;
  active: ActiveSession | null;
  sets: SetLog[];
  completed: { date: string; workoutId: string }[];
  settings: {
    voice: boolean;
    voiceName: string;
    voiceStyle: 'calm' | 'direct' | 'gruff';
  };
}
