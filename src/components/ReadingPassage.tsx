'use client';

import { ReadingPassage as ReadingPassageType } from '@/lib/types';

interface ReadingPassageProps {
  passage: ReadingPassageType;
}

const TYPE_LABELS: Record<ReadingPassageType['type'], string> = {
  fiction: 'Fiction',
  'non-fiction': 'Non-Fiction',
  poetry: 'Poetry',
  persuasive: 'Persuasive',
};

const TYPE_COLORS: Record<ReadingPassageType['type'], string> = {
  fiction: 'bg-purple-100 text-purple-700',
  'non-fiction': 'bg-blue-100 text-blue-700',
  poetry: 'bg-pink-100 text-pink-700',
  persuasive: 'bg-amber-100 text-amber-700',
};

export default function ReadingPassage({ passage }: ReadingPassageProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {passage.title}
        </h2>
        <span
          className={`flex-shrink-0 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[passage.type]}`}
        >
          {TYPE_LABELS[passage.type]}
        </span>
      </div>

      <div
        className={`text-gray-800 leading-relaxed ${
          passage.type === 'poetry'
            ? 'font-serif whitespace-pre-wrap text-base'
            : 'text-[0.9375rem] space-y-4'
        }`}
      >
        {passage.type === 'poetry' ? (
          passage.text
        ) : (
          passage.text
            .split('\n\n')
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para.replace(/\n/g, ' ')}</p>
            ))
        )}
      </div>
    </div>
  );
}
