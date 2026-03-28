'use client';

import { useSearchParams } from 'next/navigation';

/**
 * Client hook that returns true if ?teacher=true is present in the URL.
 *
 * IMPORTANT: This hook uses useSearchParams(), which requires a Suspense
 * boundary in the component tree above it during static/prerendered builds.
 * Wrap the consuming component in <Suspense> to avoid build errors.
 */
export function useTeacherMode(): boolean {
  const searchParams = useSearchParams();
  return searchParams.get('teacher') === 'true';
}
