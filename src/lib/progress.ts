import { Track, Grade, Subject } from './types';

const STORAGE_KEY = 'nsw-test-prep-progress';

export type ProgressRecord = { score: number; total: number; date: string };
export type ProgressStore = Record<string, ProgressRecord>;

/**
 * Reads all progress from localStorage.
 * Returns an empty object if nothing is stored or localStorage is unavailable.
 */
export function getProgress(): ProgressStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

/**
 * Saves a test result to localStorage.
 */
export function saveTestResult(
  testId: string,
  score: number,
  total: number
): void {
  if (typeof window === 'undefined') return;
  const progress = getProgress();
  progress[testId] = {
    score,
    total,
    date: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage may be unavailable (private browsing, storage quota)
  }
}

/**
 * Retrieves a single test result by testId.
 * Returns null if not found.
 */
export function getTestResult(testId: string): ProgressRecord | null {
  const progress = getProgress();
  return progress[testId] ?? null;
}

/**
 * Creates a consistent test ID string from test parameters.
 */
export function makeTestId(
  track: Track,
  grade: Grade,
  subject: Subject,
  trial: number
): string {
  return `${track}/${grade}/${subject}/trial-${trial}`;
}
