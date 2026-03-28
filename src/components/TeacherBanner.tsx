'use client';

interface TeacherBannerProps {
  isTeacher: boolean;
}

export default function TeacherBanner({ isTeacher }: TeacherBannerProps) {
  if (!isTeacher) return null;

  return (
    <div className="sticky top-14 z-40 w-full bg-amber-400 border-b border-amber-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-amber-900 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <p className="text-sm font-semibold text-amber-900">
          Teacher Mode &mdash; Worked solutions are visible
        </p>
      </div>
    </div>
  );
}
