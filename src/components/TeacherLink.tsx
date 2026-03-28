'use client';

import Link from 'next/link';
import { Suspense, ComponentPropsWithoutRef } from 'react';
import { useTeacherMode } from '@/hooks/useTeacherMode';
import { teacherUrl } from '@/lib/teacher';

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

interface TeacherLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  children: React.ReactNode;
}

function TeacherLinkInner({ href, children, ...rest }: TeacherLinkProps) {
  const isTeacher = useTeacherMode();
  return (
    <Link href={teacherUrl(href, isTeacher)} {...rest}>
      {children}
    </Link>
  );
}

/**
 * A drop-in replacement for Next.js <Link> that automatically appends
 * ?teacher=true to the href when the current page has ?teacher=true.
 * Safe to use in static server-component pages — Suspense boundary
 * prevents SSR/build errors from useSearchParams.
 */
export default function TeacherLink({ href, children, ...rest }: TeacherLinkProps) {
  return (
    <Suspense fallback={<Link href={href} {...rest}>{children}</Link>}>
      <TeacherLinkInner href={href} {...rest}>
        {children}
      </TeacherLinkInner>
    </Suspense>
  );
}
