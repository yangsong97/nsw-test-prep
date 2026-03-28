'use client';

import { Suspense } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useTeacherMode } from '@/hooks/useTeacherMode';
import { makeTestId } from '@/lib/progress';
import { teacherUrl } from '@/lib/teacher';
import SubjectCard from '@/components/SubjectCard';
import { Track, Grade, Subject } from '@/lib/types';

interface SubjectWithTrials {
  subject: Subject;
  trials: number[];
  /** Base href without ?teacher param — teacher param is added client-side. */
  href: string;
}

interface SubjectProgressClientProps {
  track: Track;
  grade: Grade;
  subjects: SubjectWithTrials[];
}

function SubjectProgressInner({
  track,
  grade,
  subjects,
}: SubjectProgressClientProps) {
  const { getResult } = useProgress();
  const isTeacher = useTeacherMode();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {subjects.map(({ subject, trials, href }) => {
        const completedCount = trials.filter((trial) => {
          const testId = makeTestId(track, grade, subject, trial);
          return getResult(testId) !== null;
        }).length;

        return (
          <SubjectCard
            key={subject}
            subject={subject}
            href={teacherUrl(href, isTeacher)}
            completedCount={trials.length > 0 ? completedCount : undefined}
            totalCount={trials.length > 0 ? trials.length : undefined}
          />
        );
      })}
    </div>
  );
}

/**
 * Client component that renders subject cards with localStorage-backed
 * completion counts (e.g. "2/3 completed") and teacher-mode-aware hrefs.
 * Receives subject+trial data and base hrefs from the server component.
 * Suspense boundary prevents static build errors from useSearchParams.
 */
export default function SubjectProgressClient(props: SubjectProgressClientProps) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {props.subjects.map(({ subject, href }) => (
            <SubjectCard key={subject} subject={subject} href={href} />
          ))}
        </div>
      }
    >
      <SubjectProgressInner {...props} />
    </Suspense>
  );
}
