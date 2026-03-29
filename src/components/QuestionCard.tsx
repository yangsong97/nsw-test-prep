'use client';

import { MCQuestion } from '@/lib/types';
import WorkedSolution from './WorkedSolution';

interface QuestionCardProps {
  question: MCQuestion;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showCorrect: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
  showCorrect,
}: QuestionCardProps) {
  function getOptionClasses(index: number): string {
    const base =
      'flex items-start gap-3 w-full text-left rounded-lg border px-4 py-3 transition-colors cursor-pointer';

    if (showCorrect) {
      if (index === question.answer) {
        // Correct answer always highlighted green in review
        return `${base} border-green-500 bg-green-50 text-green-900`;
      }
      if (index === selectedAnswer && selectedAnswer !== question.answer) {
        // User's wrong choice highlighted red
        return `${base} border-red-400 bg-red-50 text-red-900`;
      }
      return `${base} border-gray-200 bg-white text-gray-500`;
    }

    // Normal mode
    if (index === selectedAnswer) {
      return `${base} border-indigo-500 bg-indigo-50 text-indigo-900`;
    }
    return `${base} border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-800`;
  }

  function getLetterCircleClasses(index: number): string {
    const base =
      'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold';

    if (showCorrect) {
      if (index === question.answer) {
        return `${base} bg-green-500 text-white`;
      }
      if (index === selectedAnswer && selectedAnswer !== question.answer) {
        return `${base} bg-red-400 text-white`;
      }
      return `${base} bg-gray-200 text-gray-500`;
    }

    if (index === selectedAnswer) {
      return `${base} bg-indigo-600 text-white`;
    }
    return `${base} bg-gray-200 text-gray-600`;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <p className="text-gray-900 font-medium mb-5 leading-relaxed">
        {question.question}
      </p>

      <div className="space-y-2.5">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClasses(index)}
            onClick={() => !showCorrect && onSelect(index)}
            disabled={showCorrect}
          >
            <span className={getLetterCircleClasses(index)}>
              {OPTION_LETTERS[index]}
            </span>
            <span className="pt-0.5 leading-snug">{option}</span>
          </button>
        ))}
      </div>

      {showCorrect && (
        <WorkedSolution solution={question.workedSolution} />
      )}
    </div>
  );
}
