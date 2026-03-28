'use client';

import { useState, useCallback } from 'react';

interface TestState {
  answers: Record<number, number>; // questionIndex -> selectedOptionIndex
  currentQuestion: number;
  isSubmitted: boolean;
}

interface UseTestProgressReturn {
  answers: Record<number, number>;
  currentQuestion: number;
  isSubmitted: boolean;
  selectAnswer: (questionIndex: number, optionIndex: number) => void;
  goToQuestion: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  submit: () => void;
  score: number | null; // only available after submit
  answeredCount: number;
}

/**
 * Manages test-taking state: answers, navigation, and submission.
 *
 * score is null until the test is submitted. After submission it reflects
 * the number of answered questions — the consuming component should compare
 * answers against the question's .answer field to compute a real score if
 * correctAnswers are needed; alternatively a correctAnswers array can be
 * passed and scored here. The spec exposes score as null until submit.
 *
 * @param totalQuestions - total number of questions in the test
 * @param correctAnswers - optional array of 0-indexed correct option indices,
 *   one per question. When provided, score is computed on submit.
 */
export function useTestProgress(
  totalQuestions: number,
  correctAnswers?: number[]
): UseTestProgressReturn {
  const [state, setState] = useState<TestState>({
    answers: {},
    currentQuestion: 0,
    isSubmitted: false,
  });
  const [score, setScore] = useState<number | null>(null);

  const selectAnswer = useCallback(
    (questionIndex: number, optionIndex: number) => {
      setState((prev) => {
        if (prev.isSubmitted) return prev;
        return {
          ...prev,
          answers: { ...prev.answers, [questionIndex]: optionIndex },
        };
      });
    },
    []
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalQuestions) return;
      setState((prev) => ({ ...prev, currentQuestion: index }));
    },
    [totalQuestions]
  );

  const goNext = useCallback(() => {
    setState((prev) => {
      const next = prev.currentQuestion + 1;
      if (next >= totalQuestions) return prev;
      return { ...prev, currentQuestion: next };
    });
  }, [totalQuestions]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      const prevIndex = prev.currentQuestion - 1;
      if (prevIndex < 0) return prev;
      return { ...prev, currentQuestion: prevIndex };
    });
  }, []);

  const submit = useCallback(() => {
    setState((prev) => {
      if (prev.isSubmitted) return prev;

      if (correctAnswers) {
        const computed = correctAnswers.reduce((acc, correct, i) => {
          return prev.answers[i] === correct ? acc + 1 : acc;
        }, 0);
        setScore(computed);
      } else {
        setScore(0);
      }

      return { ...prev, isSubmitted: true };
    });
  }, [correctAnswers]);

  const answeredCount = Object.keys(state.answers).length;

  return {
    answers: state.answers,
    currentQuestion: state.currentQuestion,
    isSubmitted: state.isSubmitted,
    selectAnswer,
    goToQuestion,
    goNext,
    goPrev,
    submit,
    score,
    answeredCount,
  };
}
