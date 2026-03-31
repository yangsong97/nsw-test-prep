'use client';

import Link from 'next/link';

interface TestCardProps {
  trial: number;
  href: string;
  printHref: string;
  completed?: { score: number; total: number };
}

export default function TestCard({ trial, href, printHref, completed }: TestCardProps) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
      <div className="flex items-center justify-between p-5">
        <Link href={href} className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Trial
          </p>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
            Trial {trial}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {/* Print icon */}
          <Link
            href={printHref}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Print worksheet"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </Link>

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
            <Link href={href} className="text-gray-400 group-hover:text-indigo-500 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {completed && (
        <div className="px-5 pb-5 -mt-2">
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
    </div>
  );
}
