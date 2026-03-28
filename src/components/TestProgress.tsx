'use client';

interface TestProgressProps {
  total: number;
  answers: Record<number, number>;
  current: number;
  onNavigate: (index: number) => void;
}

export default function TestProgress({
  total,
  answers,
  current,
  onNavigate,
}: TestProgressProps) {
  // For large tests (>20), show a windowed view: first 5, ..., window around current, ..., last 5
  const showAll = total <= 20;

  function getVisibleIndices(): (number | 'ellipsis-start' | 'ellipsis-end')[] {
    if (showAll) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const result: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    const firstGroup = new Set([0, 1, 2]);
    const lastGroup = new Set([total - 3, total - 2, total - 1]);
    const midGroup = new Set([current - 1, current, current + 1].filter(n => n >= 0 && n < total));

    let addedEllipsisStart = false;
    let addedEllipsisEnd = false;

    for (let i = 0; i < total; i++) {
      if (firstGroup.has(i) || lastGroup.has(i) || midGroup.has(i)) {
        result.push(i);
        addedEllipsisStart = false;
        addedEllipsisEnd = false;
      } else {
        // Determine if this gap comes before or after the middle
        const afterFirst = i > Math.max(...Array.from(firstGroup));
        const beforeMid = i < Math.min(...Array.from(midGroup));
        const afterMid = i > Math.max(...Array.from(midGroup));
        const beforeLast = i < Math.min(...Array.from(lastGroup));

        if (afterFirst && beforeMid && !addedEllipsisStart) {
          result.push('ellipsis-start');
          addedEllipsisStart = true;
        } else if (afterMid && beforeLast && !addedEllipsisEnd) {
          result.push('ellipsis-end');
          addedEllipsisEnd = true;
        }
      }
    }

    return result;
  }

  const visibleItems = getVisibleIndices();

  function getDotClasses(index: number): string {
    const isAnswered = index in answers;
    const isCurrent = index === current;

    if (isCurrent) {
      return isAnswered
        ? 'w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-300 ring-offset-1'
        : 'w-3 h-3 rounded-full bg-white border-2 border-indigo-500 ring-2 ring-indigo-300 ring-offset-1';
    }

    if (isAnswered) {
      return 'w-3 h-3 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors';
    }

    return 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors';
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-500">
          {answeredCount} / {total} answered
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {visibleItems.map((item, i) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span key={`${item}-${i}`} className="text-gray-400 text-xs leading-none px-0.5">
                &hellip;
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              aria-label={`Question ${item + 1}${item in answers ? ' (answered)' : ''}`}
              aria-current={item === current ? 'step' : undefined}
              className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              <span className={getDotClasses(item)} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
