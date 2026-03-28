'use client';

import { MCQuestion } from '@/lib/types';

interface ResultsSummaryProps {
  score: number;
  total: number;
  answers: Record<number, number>;
  questions: MCQuestion[];
}

export default function ResultsSummary({
  score,
  total,
  answers,
  questions,
}: ResultsSummaryProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrect = Object.keys(answers).filter(
    (i) => answers[Number(i)] !== questions[Number(i)]?.answer
  ).length;
  const skipped = total - Object.keys(answers).length;

  // Group by topic
  const topicMap: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 };
    topicMap[q.topic].total += 1;
    if (answers[i] === q.answer) topicMap[q.topic].correct += 1;
  });

  const topics = Object.entries(topicMap).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div className="space-y-6">
      {/* Score hero */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Your Score
        </p>
        <p className="text-6xl font-bold text-gray-900 mb-1">
          {score}
          <span className="text-4xl text-gray-400 font-normal"> / {total}</span>
        </p>
        <p className="text-2xl font-semibold text-indigo-600 mt-2">
          {percentage}%
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{score}</p>
          <p className="text-sm font-medium text-green-600 mt-1">Correct</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{incorrect}</p>
          <p className="text-sm font-medium text-red-600 mt-1">Incorrect</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-amber-700">{skipped}</p>
          <p className="text-sm font-medium text-amber-600 mt-1">Skipped</p>
        </div>
      </div>

      {/* Topic breakdown */}
      {topics.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Topic Breakdown
          </h3>
          <div className="space-y-3">
            {topics.map(([topic, { correct, total: topicTotal }]) => {
              const pct = topicTotal > 0 ? Math.round((correct / topicTotal) * 100) : 0;
              const barColor =
                pct >= 80
                  ? 'bg-green-500'
                  : pct >= 50
                  ? 'bg-amber-400'
                  : 'bg-red-400';

              return (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 capitalize">{topic}</span>
                    <span className="text-sm font-medium text-gray-600">
                      {correct}/{topicTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
