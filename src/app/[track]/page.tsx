import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Track, TRACK_GRADES, Grade } from '@/lib/types';

export function generateStaticParams() {
  return [{ track: 'oc' }, { track: 'selective' }];
}

const TRACK_TITLES: Record<Track, string> = {
  oc: 'OC Test Prep',
  selective: 'Selective Test Prep',
};

const TRACK_DESCRIPTIONS: Record<Track, string> = {
  oc: 'Opportunity Class placement test preparation',
  selective: 'Selective High School placement test preparation',
};

function formatGrade(grade: Grade): string {
  const num = grade.replace('year-', '');
  return `Year ${num}`;
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;

  if (track !== 'oc' && track !== 'selective') {
    notFound();
  }

  const typedTrack = track as Track;
  const grades = TRACK_GRADES[typedTrack];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{TRACK_TITLES[typedTrack]}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {TRACK_TITLES[typedTrack]}
        </h1>
        <p className="text-gray-600 text-lg">{TRACK_DESCRIPTIONS[typedTrack]}</p>
      </div>

      {/* Grade cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Select Your Year
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {grades.map((grade) => (
            <Link
              key={grade}
              href={`/${typedTrack}/${grade}`}
              className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {TRACK_TITLES[typedTrack].split(' ')[0]}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {formatGrade(grade)}
                  </h3>
                </div>
                <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
