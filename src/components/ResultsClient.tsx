'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Test, isMCTest, isReadingTest } from '@/lib/types';
import { useTeacherMode } from '@/hooks/useTeacherMode';
import TeacherBanner from '@/components/TeacherBanner';
import ResultsSummary from '@/components/ResultsSummary';
import QuestionReview from '@/components/QuestionReview';

interface ResultsClientInnerProps {
  test: Test;
  testId: string;
  backHref: string;
  retryHref: string;
  title: string;
}

function ResultsClientInner({
  test,
  testId,
  backHref,
  retryHref,
  title,
}: ResultsClientInnerProps) {
  const isTeacher = useTeacherMode();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    // Load saved answers from localStorage
    try {
      const raw = localStorage.getItem(`answers:${testId}`);
      if (raw) {
        setAnswers(JSON.parse(raw) as Record<number, number>);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [testId]);

  useEffect(() => {
    if (!isPrintMode) return;
    // Let React flush expanded questions into the DOM before printing
    const id = setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
    return () => clearTimeout(id);
  }, [isPrintMode]);

  if (!loaded) {
    return (
      <div className="p-8 text-center text-gray-400">Loading results…</div>
    );
  }

  // Only MC-based tests have results
  if (!isMCTest(test) && !isReadingTest(test)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 mb-4">Writing tasks do not have scored results.</p>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Back to tests
        </Link>
      </div>
    );
  }

  const questions = test.questions;
  const score = questions.reduce((acc, q, i) => {
    return answers[i] === q.answer ? acc + 1 : acc;
  }, 0);

  return (
    <div>
      <TeacherBanner isTeacher={isTeacher} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="mb-6 print:hidden">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to tests
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-500 text-sm">Results</p>
        </div>

        {/* Results summary */}
        <div className="space-y-8">
          <ResultsSummary
            score={score}
            total={questions.length}
            answers={answers}
            questions={questions}
          />

          {/* Question review */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Review</h2>
            <QuestionReview
              questions={questions}
              answers={answers}
              expandAll={isPrintMode}
            />
          </div>

          {/* Retry / back / print */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 print:hidden">
            <Link
              href={retryHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Try again
            </Link>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors"
            >
              Back to tests
            </Link>
            <button
              onClick={() => setIsPrintMode(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ResultsClientProps {
  test: Test;
  testId: string;
  backHref: string;
  retryHref: string;
  title: string;
}

export default function ResultsClient(props: ResultsClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading…</div>}>
      <ResultsClientInner {...props} />
    </Suspense>
  );
}
