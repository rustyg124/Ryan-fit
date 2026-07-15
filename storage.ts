import type { AppState } from './types';

const KEY = 'ryanfit_genesis_alpha';
const initial: AppState = {
  version: 1,
  active: null,
  sets: [],
  completed: [],
  settings: { voice: true, voiceName: '', voiceStyle: 'calm' }
};

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(initial);
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...structuredClone(initial),
      ...parsed,
      settings: { ...initial.settings, ...(parsed.settings ?? {}) }
    };
  } catch {
    return structuredClone(initial);
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};
