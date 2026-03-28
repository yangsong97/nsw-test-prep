import { notFound } from 'next/navigation';
import { Track, Grade, Subject, TRACK_GRADES, SUBJECTS } from '@/lib/types';
import { getAvailableTrials } from '@/lib/content';
import TeacherBannerWrapper from '@/components/TeacherBannerWrapper';
import TeacherLink from '@/components/TeacherLink';
import SubjectProgressClient from '@/components/SubjectProgressClient';

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
  const basePath = `/${typedTrack}/${typedGrade}`;

  // Build subject+trials data for SubjectProgressClient (server-side, no teacher logic)
  const subjects = (SUBJECTS as Subject[]).map((subject) => ({
    subject,
    trials: getAvailableTrials(typedTrack, typedGrade, subject),
    href: `${basePath}/${subject}`,
  }));

  return (
    <div>
      <TeacherBannerWrapper />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <TeacherLink href="/" className="hover:text-gray-700 transition-colors">
            Home
          </TeacherLink>
          <span className="mx-2">/</span>
          <TeacherLink href={`/${typedTrack}`} className="hover:text-gray-700 transition-colors">
            {formatTrack(typedTrack)}
          </TeacherLink>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{formatGrade(typedGrade)}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <p className="text-gray-600 text-lg">Choose a subject to start practising.</p>
        </div>

        {/* Subject cards with progress */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Select a Subject
          </h2>
          <SubjectProgressClient
            track={typedTrack}
            grade={typedGrade}
            subjects={subjects}
          />
        </div>
      </div>
    </div>
  );
}
