import { notFound } from 'next/navigation';
import { Track, Grade, Subject, TRACK_GRADES, SUBJECTS } from '@/lib/types';
import { getTest, getAllTestParams } from '@/lib/content';
import { makeTestId } from '@/lib/progress';
import ResultsClient from '@/components/ResultsClient';

export function generateStaticParams() {
  return getAllTestParams();
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

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ track: string; grade: string; subject: string; test: string }>;
}) {
  const { track, grade, subject, test } = await params;

  // Validate track
  if (track !== 'oc' && track !== 'selective') {
    notFound();
  }
  const typedTrack = track as Track;

  // Validate grade
  const validGrades = TRACK_GRADES[typedTrack] as string[];
  if (!validGrades.includes(grade)) {
    notFound();
  }
  const typedGrade = grade as Grade;

  // Validate subject
  if (!(SUBJECTS as string[]).includes(subject)) {
    notFound();
  }
  const typedSubject = subject as Subject;

  // Parse trial number
  const trialMatch = test.match(/^trial-(\d+)$/);
  if (!trialMatch) {
    notFound();
  }
  const trialNumber = parseInt(trialMatch[1], 10);

  // Load test data (server-side at build time)
  let testData;
  try {
    testData = getTest(typedTrack, typedGrade, typedSubject, trialNumber);
  } catch {
    notFound();
  }

  const testId = makeTestId(typedTrack, typedGrade, typedSubject, trialNumber);
  const backHref = `/${typedTrack}/${typedGrade}/${typedSubject}`;
  const retryHref = `/${typedTrack}/${typedGrade}/${typedSubject}/trial-${trialNumber}`;
  const title = `${SUBJECT_LABELS[typedSubject]} — ${formatGrade(typedGrade)} — Trial ${trialNumber}`;

  return (
    <ResultsClient
      test={testData}
      testId={testId}
      backHref={backHref}
      retryHref={retryHref}
      title={title}
    />
  );
}
