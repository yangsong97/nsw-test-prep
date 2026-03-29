'use client';

import { WritingRubric as WritingRubricType, SampleResponse } from '@/lib/types';

interface WritingRubricProps {
  rubric: WritingRubricType;
  sampleResponses: SampleResponse[];
}

const CRITERIA = [
  { key: 'ideas' as const, label: 'Ideas' },
  { key: 'structure' as const, label: 'Structure' },
  { key: 'language' as const, label: 'Language' },
  { key: 'mechanics' as const, label: 'Mechanics' },
];

const LEVELS = [
  { key: 'excellent' as const, label: 'Excellent', headerClass: 'text-green-700 bg-green-50', cellClass: 'text-green-800' },
  { key: 'satisfactory' as const, label: 'Satisfactory', headerClass: 'text-amber-700 bg-amber-50', cellClass: 'text-amber-800' },
  { key: 'developing' as const, label: 'Developing', headerClass: 'text-red-700 bg-red-50', cellClass: 'text-red-800' },
];

export default function WritingRubric({
  rubric,
  sampleResponses,
}: WritingRubricProps) {
  return (
    <div className="space-y-6">
      {/* Rubric table */}
      <div className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-sm">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
          <h3 className="text-base font-semibold text-amber-800">Marking Rubric</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-28">
                  Criteria
                </th>
                {LEVELS.map((level) => (
                  <th
                    key={level.key}
                    className={`px-4 py-3 text-left font-semibold ${level.headerClass}`}
                  >
                    {level.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((criterion, i) => (
                <tr
                  key={criterion.key}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 font-medium text-gray-700 align-top">
                    {criterion.label}
                  </td>
                  {LEVELS.map((level) => (
                    <td
                      key={level.key}
                      className={`px-4 py-3 align-top leading-relaxed ${level.cellClass}`}
                    >
                      {rubric[criterion.key][level.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample responses */}
      {sampleResponses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-amber-800">Sample Responses</h3>
          {sampleResponses.map((sample, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    sample.level === 'excellent'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {sample.level === 'excellent' ? 'Excellent' : 'Satisfactory'}
                </span>
                <span className="text-sm text-gray-500">Sample Response {i + 1}</span>
              </div>

              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {sample.text}
                </p>
                {sample.annotations && (
                  <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r px-4 py-3">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                      Teacher Annotations
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap">
                      {sample.annotations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
