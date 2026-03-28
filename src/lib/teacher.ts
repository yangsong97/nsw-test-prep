/**
 * Pure utility functions for teacher mode URL param handling.
 * No React dependencies.
 */

/**
 * Checks if teacher mode is active based on the `teacher` search param.
 */
export function isTeacherMode(
  searchParams: Record<string, string | string[] | undefined>
): boolean {
  const value = searchParams['teacher'];
  return value === 'true';
}

/**
 * Appends ?teacher=true to a URL if isTeacher is true.
 * If the URL already has query params, appends with &teacher=true.
 */
export function teacherUrl(url: string, isTeacher: boolean): string {
  if (!isTeacher) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}teacher=true`;
}
