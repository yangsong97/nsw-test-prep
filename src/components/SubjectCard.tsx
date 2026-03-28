'use client';

import Link from 'next/link';
import { Subject } from '@/lib/types';

interface SubjectCardProps {
  subject: Subject;
  href: string;
  completedCount?: number;
  totalCount?: number;
}

const SUBJECT_DISPLAY: Record<
  Subject,
  { label: string; emoji: string; color: string }
> = {
  maths: {
    label: 'Maths',
    emoji: '🧮',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  },
  reading: {
    label: 'Reading',
    emoji: '📖',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  },
  'thinking-skills': {
    label: 'Thinking Skills',
    emoji: '💡',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  },
  writing: {
    label: 'Writing',
    emoji: '✏️',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
  },
};

export default function SubjectCard({
  subject,
  href,
  completedCount,
  totalCount,
}: SubjectCardProps) {
  const display = SUBJECT_DISPLAY[subject];
  const showProgress =
    completedCount !== undefined && totalCount !== undefined && totalCount > 0;

  return (
    <Link
      href={href}
      className={`group block rounded-xl border p-5 shadow-sm hover:shadow-md transition-all ${display.color}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl" aria-hidden="true">
          {display.emoji}
        </span>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
          {display.label}
        </h3>
      </div>

      {showProgress && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            <span className="font-semibold text-gray-700">{completedCount}</span>
            <span className="text-gray-400">/{totalCount}</span> completed
          </span>
          {completedCount === totalCount && (
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              All done!
            </span>
          )}
        </div>
      )}

      {!showProgress && (
        <p className="text-sm text-gray-500">
          Start practising &rarr;
        </p>
      )}
    </Link>
  );
}
