'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Test,
  MCTest,
  ReadingTest,
  WritingTest,
  isMCTest,
  isReadingTest,
  isWritingTest,
} from '@/lib/types';
import { saveTestResult, makeTestId } from '@/lib/progress';
import { useTestProgress } from '@/hooks/useTestProgress';
import { useTeacherMode } from '@/hooks/useTeacherMode';
import QuestionCard from '@/components/QuestionCard';
import ReadingPassage from '@/components/ReadingPassage';
import TestProgress from '@/components/TestProgress';
import TeacherBanner from '@/components/TeacherBanner';
import WritingPrompt from '@/components/WritingPrompt';
import WritingRubric from '@/components/WritingRubric';
import PrintableWorksheet from '@/components/PrintableWorksheet';

// ---- Writing view (no scoring) ----
function WritingView({
  test,
  backHref,
}: {
  test: WritingTest;
  backHref: string;
}) {
  return (
    <div className="space-y-6">
      <WritingPrompt prompt={test.prompt} />
      <WritingRubric
        rubric={test.rubric}
        sampleResponses={test.sampleResponses}
      />
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to tests
        </Link>
      </div>
    </div>
  );
}

// ---- MC-based view (Maths, Thinking Skills, Reading) ----
interface MCViewProps {
  test: MCTest | ReadingTest;
  isTeacher: boolean;
  resultsHref: string;
  testId: string;
}

function MCView({ test, isTeacher, resultsHref, testId }: MCViewProps) {
  const questions = test.questions;
  const correctAnswers = questions.map((q) => q.answer);
  const {
    answers,
    currentQuestion,
    isSubmitted,
    selectAnswer,
    goToQuestion,
    goNext,
    goPrev,
    submit,
    answeredCount,
  } = useTestProgress(questions.length, correctAnswers);

  const router = useRouter();

  useEffect(() => {
    if (isSubmitted) {
      // Compute score
      const score = correctAnswers.reduce((acc, correct, i) => {
        return answers[i] === correct ? acc + 1 : acc;
      }, 0);

      // Save to localStorage
      saveTestResult(testId, score, questions.length);

      // Persist answers for the results page
      try {
        localStorage.setItem(
          `answers:${testId}`,
          JSON.stringify(answers)
        );
      } catch {
        // ignore localStorage failures
      }

      // Navigate to results
      router.push(`${resultsHref}?from=test`);
    }
  }, [isSubmitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const question = questions[currentQuestion];
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <TestProgress
        total={questions.length}
        answers={answers}
        current={currentQuestion}
        onNavigate={goToQuestion}
      />

      {/* Reading passage (sticky or above questions) */}
      {isReadingTest(test) && (
        <ReadingPassage passage={(test as ReadingTest).passage} />
      )}

      {/* Question */}
      <QuestionCard
        question={question}
        selectedAnswer={answers[currentQuestion] ?? null}
        onSelect={(optionIndex) => selectAnswer(currentQuestion, optionIndex)}
        showCorrect={false}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={isFirstQuestion}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex items-center gap-2">
          {answeredCount > 0 && !isSubmitted && (
            <button
              onClick={submit}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              Submit ({answeredCount}/{questions.length})
            </button>
          )}
        </div>

        <button
          onClick={goNext}
          disabled={isLastQuestion}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---- Inner client component that uses useTeacherMode ----
interface TestClientInnerProps {
  test: Test;
  backHref: string;
  resultsHref: string;
  testId: string;
  title: string;
}

function TestClientInner({
  test,
  backHref,
  resultsHref,
  testId,
  title,
}: TestClientInnerProps) {
  const isTeacher = useTeacherMode();
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';

  if (isPrintMode) {
    return <PrintableWorksheet test={test} title={title} backHref={backHref} />;
  }

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

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

        {/* Test content */}
        {isWritingTest(test) && (
          <WritingView test={test as WritingTest} backHref={backHref} />
        )}
        {(isMCTest(test) || isReadingTest(test)) && (
          <MCView
            test={test as MCTest | ReadingTest}
            isTeacher={isTeacher}
            resultsHref={resultsHref}
            testId={testId}
          />
        )}
      </div>
    </div>
  );
}

// ---- Public export: wraps inner in Suspense for useTeacherMode ----
export interface TestClientProps {
  test: Test;
  backHref: string;
  resultsHref: string;
  testId: string;
  title: string;
}

export default function TestClient(props: TestClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading…</div>}>
      <TestClientInner {...props} />
    </Suspense>
  );
}
