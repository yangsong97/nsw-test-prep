'use client';

import { Suspense } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useTeacherMode } from '@/hooks/useTeacherMode';
import { makeTestId } from '@/lib/progress';
import { teacherUrl } from '@/lib/teacher';
import TestCard from '@/components/TestCard';
import { Track, Grade, Subject } from '@/lib/types';

interface TrialListClientProps {
  trials: number[];
  track: Track;
  grade: Grade;
  subject: Subject;
  /** Base path for trial hrefs (e.g. "/oc/year-3/maths") without ?teacher param. */
  basePath: string;
}

function TrialListInner({
  trials,
  track,
  grade,
  subject,
  basePath,
}: TrialListClientProps) {
  const { getResult } = useProgress();
  const isTeacher = useTeacherMode();

  return (
    <div className="space-y-3">
      {trials.map((trial) => {
        const testId = makeTestId(track, grade, subject, trial);
        const result = getResult(testId);
        const href = teacherUrl(`${basePath}/trial-${trial}`, isTeacher);
        return (
          <TestCard
            key={trial}
            trial={trial}
            href={href}
            completed={result ?? undefined}
          />
        );
      })}
    </div>
  );
}

/**
 * Client component that renders the trial test list with localStorage-backed
 * completion badges and teacher-mode-aware hrefs. Receives trial data as
 * props from the server component.
 * Suspense boundary prevents static build errors from useSearchParams.
 */
export default function TrialListClient(props: TrialListClientProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-3">
          {props.trials.map((trial) => (
            <TestCard
              key={trial}
              trial={trial}
              href={`${props.basePath}/trial-${trial}`}
            />
          ))}
        </div>
      }
    >
      <TrialListInner {...props} />
    </Suspense>
  );
}
