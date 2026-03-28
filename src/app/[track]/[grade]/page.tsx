import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Track, Grade, Subject, TRACK_GRADES, SUBJECTS } from '@/lib/types';
import SubjectCard from '@/components/SubjectCard';

export function generateStaticParams() {
  const params: { track: string; grade: string }[] = [];
  for (const [track, grades] of Object.entries(TRACK_GRADES) as [Track, Grade[]][]) {
    for (const grade of grades) {
      params.push({ track, grade });
    }
  }
  return params;
}

function formatGrade(grade: Grade): string {
  const num = grade.replace('year-', '');
  return `Year ${num}`;
}

function formatTrack(track: Track): string {
  return track === 'oc' ? 'OC Prep' : 'Selective Prep';
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ track: string; grade: string }>;
}) {
  const { track, grade } = await params;

  if (track !== 'oc' && track !== 'selective') {
    notFound();
  }
  const typedTrack = track as Track;

  const validGrades = TRACK_GRADES[typedTrack] as string[];
  if (!validGrades.includes(grade)) {
    notFound();
  }
  const typedGrade = grade as Grade;

  const pageTitle = `${formatGrade(typedGrade)} — ${formatTrack(typedTrack)}`;

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
        <span className="text-gray-900 font-medium">{formatGrade(typedGrade)}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
        <p className="text-gray-600 text-lg">Choose a subject to start practising.</p>
      </div>

      {/* Subject cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Select a Subject
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(SUBJECTS as Subject[]).map((subject) => (
            <SubjectCard
              key={subject}
              subject={subject}
              href={`/${typedTrack}/${typedGrade}/${subject}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
