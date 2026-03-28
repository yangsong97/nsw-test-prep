import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Track, Grade, Subject, TRACK_GRADES, SUBJECTS } from '@/lib/types';
import { getAvailableTrials } from '@/lib/content';
import TestCard from '@/components/TestCard';

export function generateStaticParams() {
  const params: { track: string; grade: string; subject: string }[] = [];
  for (const [track, grades] of Object.entries(TRACK_GRADES) as [Track, Grade[]][]) {
    for (const grade of grades) {
      for (const subject of SUBJECTS) {
        params.push({ track, grade, subject });
      }
    }
  }
  return params;
}

const SUBJECT_LABELS: Record<Subject, string> = {
  maths: 'Maths',
  reading: 'Reading',
  'thinking-skills': 'Thinking Skills',
  writing: 'Writing',
};

function formatGrade(grade: Grade): string {
  const num = grade.replace('year-', '');
  return `Year ${num}`;
}

function formatTrack(track: Track): string {
  return track === 'oc' ? 'OC Prep' : 'Selective Prep';
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ track: string; grade: string; subject: string }>;
}) {
  const { track, grade, subject } = await params;

  if (track !== 'oc' && track !== 'selective') {
    notFound();
  }
  const typedTrack = track as Track;

  const validGrades = TRACK_GRADES[typedTrack] as string[];
  if (!validGrades.includes(grade)) {
    notFound();
  }
  const typedGrade = grade as Grade;

  if (!(SUBJECTS as string[]).includes(subject)) {
    notFound();
  }
  const typedSubject = subject as Subject;

  const trials = getAvailableTrials(typedTrack, typedGrade, typedSubject);
  const subjectLabel = SUBJECT_LABELS[typedSubject];
  const gradeLabel = formatGrade(typedGrade);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${typedTrack}`} className="hover:text-gray-700 transition-colors">
          {formatTrack(typedTrack)}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${typedTrack}/${typedGrade}`} className="hover:text-gray-700 transition-colors">
          {gradeLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{subjectLabel}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {subjectLabel} — {gradeLabel}
        </h1>
        <p className="text-gray-600 text-lg">
          {trials.length > 0
            ? `${trials.length} trial test${trials.length !== 1 ? 's' : ''} available.`
            : 'No trial tests available yet. Check back soon!'}
        </p>
      </div>

      {/* Test cards */}
      {trials.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Trial Tests
          </h2>
          <div className="space-y-3">
            {trials.map((trial) => (
              <TestCard
                key={trial}
                trial={trial}
                href={`/${typedTrack}/${typedGrade}/${typedSubject}/trial-${trial}`}
              />
            ))}
          </div>
        </div>
      )}

      {trials.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-400 text-lg">Coming soon</p>
        </div>
      )}
    </div>
  );
}
