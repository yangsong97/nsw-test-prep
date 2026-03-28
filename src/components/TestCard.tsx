'use client';

import Link from 'next/link';

interface TestCardProps {
  trial: number;
  href: string;
  completed?: { score: number; total: number };
}

export default function TestCard({ trial, href, completed }: TestCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Trial
          </p>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
            Trial {trial}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {completed ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                {completed.score}/{completed.total}
              </span>
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
          ) : (
            <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {completed && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${completed.total > 0 ? Math.round((completed.score / completed.total) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {completed.total > 0
              ? Math.round((completed.score / completed.total) * 100)
              : 0}
            % correct
          </p>
        </div>
      )}
    </Link>
  );
}
