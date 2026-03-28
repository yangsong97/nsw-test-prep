'use client';

import { WritingPromptData } from '@/lib/types';

interface WritingPromptProps {
  prompt: WritingPromptData;
}

const TYPE_LABELS: Record<WritingPromptData['type'], string> = {
  narrative: 'Narrative',
  persuasive: 'Persuasive',
  informational: 'Informational',
};

const TYPE_COLORS: Record<WritingPromptData['type'], string> = {
  narrative: 'bg-purple-100 text-purple-700',
  persuasive: 'bg-amber-100 text-amber-700',
  informational: 'bg-blue-100 text-blue-700',
};

export default function WritingPrompt({ prompt }: WritingPromptProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[prompt.type]}`}
        >
          {TYPE_LABELS[prompt.type]}
        </span>
      </div>

      <p className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
        {prompt.text}
      </p>

      <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            <span className="font-medium">{prompt.timeLimit} min</span> time limit
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>
            Word guide: <span className="font-medium">{prompt.wordGuide}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
