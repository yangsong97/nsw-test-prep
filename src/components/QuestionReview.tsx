'use client';

import { useState } from 'react';
import { MCQuestion } from '@/lib/types';
import WorkedSolution from './WorkedSolution';

interface QuestionReviewProps {
  questions: MCQuestion[];
  answers: Record<number, number>;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function QuestionReview({
  questions,
  answers,
}: QuestionReviewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function getStatus(index: number): 'correct' | 'incorrect' | 'skipped' {
    if (!(index in answers)) return 'skipped';
    return answers[index] === questions[index].answer ? 'correct' : 'incorrect';
  }

  function toggleExpand(index: number) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="space-y-2">
      {questions.map((question, index) => {
        const status = getStatus(index);
        const isExpanded = expandedIndex === index;
        const userAnswer = answers[index];
        const correctAnswer = question.answer;

        return (
          <div
            key={question.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          >
            {/* Summary row */}
            <button
              onClick={() => toggleExpand(index)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              {/* Question number */}
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>

              {/* Status icon */}
              <span className="flex-shrink-0">
                {status === 'correct' && (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === 'incorrect' && (
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {status === 'skipped' && (
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                )}
              </span>

              {/* Question short label */}
              <span className="flex-1 text-sm text-gray-700 truncate">
                {question.question.slice(0, 50)}
                {question.question.length > 50 ? '…' : ''}
              </span>

              {/* Answer summary */}
              <span className="flex-shrink-0 text-xs text-gray-500 hidden sm:block">
                {status === 'skipped' ? (
                  <span className="text-gray-400 italic">Skipped</span>
                ) : (
                  <>
                    Your: <span className={status === 'correct' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                      {OPTION_LETTERS[userAnswer]}
                    </span>
                    {status === 'incorrect' && (
                      <>
                        {' '}Correct:{' '}
                        <span className="text-green-600 font-semibold">
                          {OPTION_LETTERS[correctAnswer]}
                        </span>
                      </>
                    )}
                  </>
                )}
              </span>

              {/* Expand chevron */}
              <span className={`flex-shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">
                  {question.question}
                </p>

                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const isCorrectOption = optIndex === correctAnswer;
                    const isUserOption = optIndex === userAnswer;

                    let classes =
                      'flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm';

                    if (isCorrectOption) {
                      classes += ' border-green-400 bg-green-50 text-green-900';
                    } else if (isUserOption && !isCorrectOption) {
                      classes += ' border-red-300 bg-red-50 text-red-800';
                    } else {
                      classes += ' border-gray-200 bg-white text-gray-600';
                    }

                    return (
                      <div key={optIndex} className={classes}>
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                            isCorrectOption
                              ? 'bg-green-500 text-white'
                              : isUserOption
                              ? 'bg-red-400 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {OPTION_LETTERS[optIndex]}
                        </span>
                        <span>{option}</span>
                      </div>
                    );
                  })}
                </div>

                <WorkedSolution solution={question.workedSolution} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
