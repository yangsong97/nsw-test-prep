'use client';

import { Suspense } from 'react';
import TeacherBanner from '@/components/TeacherBanner';
import { useTeacherMode } from '@/hooks/useTeacherMode';

function TeacherBannerInner() {
  const isTeacher = useTeacherMode();
  return <TeacherBanner isTeacher={isTeacher} />;
}

/**
 * Client wrapper that reads ?teacher=true from the URL and conditionally
 * shows the TeacherBanner. Safe to use in server-rendered pages.
 * The Suspense boundary prevents static build errors from useSearchParams.
 */
export default function TeacherBannerWrapper() {
  return (
    <Suspense fallback={null}>
      <TeacherBannerInner />
    </Suspense>
  );
}
