'use client';

import { useEffect } from 'react';
import {
  Test,
  MCQuestion,
  ReadingTest,
  WritingTest,
  isMCTest,
  isReadingTest,
  isWritingTest,
} from '@/lib/types';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

function MCQuestionBlock({ question, index }: { question: MCQuestion; index: number }) {
  return (
    <div data-print-block className="mb-6">
      <p className="text-sm font-medium text-gray-900 mb-2">
        <span className="font-bold mr-2">{index + 1}.</span>
        {question.question}
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-6">
        {question.options.map((option, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-400 text-[10px] font-bold flex items-center justify-center text-gray-500">
              {OPTION_LETTERS[i]}
            </span>
            <span className="pt-0.5">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PrintableWorksheetProps {
  test: Test;
  title: string;
  backHref: string;
}

export default function PrintableWorksheet({ test, title, backHref }: PrintableWorksheetProps) {
  useEffect(() => {
    const id = setTimeout(() => window.print(), 300);
    return () => clearTimeout(id);
  }, []);

  const isReading = isReadingTest(test);
  const isWriting = isWritingTest(test);
  const questions = isWriting ? [] : (test as { questions: MCQuestion[] }).questions;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link — screen only */}
      <div className="mb-6 print:hidden">
        <a
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to tests
        </a>
      </div>

      {/* Header */}
      <div className="mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{questions.length > 0 ? `${questions.length} questions` : ''}</p>
        {/* Name line for paper */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Name:</span>
          <span className="flex-1 border-b border-gray-400" />
          <span className="font-medium ml-4">Date:</span>
          <span className="w-32 border-b border-gray-400" />
        </div>
      </div>

      {/* Reading passage */}
      {isReading && (
        <div data-print-block className="mb-8 border border-gray-200 rounded-lg p-5 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            {(test as ReadingTest).passage.title}
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            {(test as ReadingTest).passage.type}
          </p>
          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {(test as ReadingTest).passage.text}
          </div>
        </div>
      )}

      {/* Writing prompt */}
      {isWriting && (
        <div data-print-block className="mb-8">
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {(test as WritingTest).prompt.type}
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">
              {(test as WritingTest).prompt.text}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>Time: {(test as WritingTest).prompt.timeLimit} min</span>
              <span>{(test as WritingTest).prompt.wordGuide}</span>
            </div>
          </div>
          {/* Lined writing area placeholder */}
          <div className="mt-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="border-b border-gray-300 h-8" />
            ))}
          </div>
        </div>
      )}

      {/* MC Questions */}
      {questions.length > 0 && (
        <div>
          {questions.map((q, i) => (
            <MCQuestionBlock key={q.id} question={q} index={i} />
          ))}
        </div>
      )}

      {/* Print button — screen only */}
      <div className="mt-8 flex items-center gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Worksheet
        </button>
        <a
          href={backHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors"
        >
          Back to tests
        </a>
      </div>
    </div>
  );
}
