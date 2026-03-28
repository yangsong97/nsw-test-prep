'use client';

import { useCallback } from 'react';
import {
  getProgress,
  saveTestResult,
  getTestResult,
  ProgressRecord,
  ProgressStore,
} from '@/lib/progress';

interface UseProgressReturn {
  getResult: (testId: string) => ProgressRecord | null;
  saveResult: (testId: string, score: number, total: number) => void;
  getAllResults: () => ProgressStore;
}

/**
 * Client hook for reading and writing test progress stored in localStorage.
 * SSR-safe: all localStorage access is guarded by typeof window checks inside
 * the underlying progress.ts utilities.
 */
export function useProgress(): UseProgressReturn {
  const getResult = useCallback((testId: string): ProgressRecord | null => {
    if (typeof window === 'undefined') return null;
    return getTestResult(testId);
  }, []);

  const saveResult = useCallback(
    (testId: string, score: number, total: number): void => {
      if (typeof window === 'undefined') return;
      saveTestResult(testId, score, total);
    },
    []
  );

  const getAllResults = useCallback((): ProgressStore => {
    if (typeof window === 'undefined') return {};
    return getProgress();
  }, []);

  return { getResult, saveResult, getAllResults };
}
