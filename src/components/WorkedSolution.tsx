'use client';

interface WorkedSolutionProps {
  solution: string;
  isTeacher: boolean;
}

export default function WorkedSolution({ solution, isTeacher }: WorkedSolutionProps) {
  if (!isTeacher) return null;

  // Split solution into paragraphs, highlighting "Common mistake" sections
  const lines = solution.split('\n');

  return (
    <div className="mt-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg p-4">
      <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-3">
        Worked Solution
      </h3>
      <div className="text-sm text-gray-800 space-y-2">
        {lines.map((line, i) => {
          const isCommonMistake = line.toLowerCase().includes('common mistake');
          if (isCommonMistake) {
            return (
              <p key={i} className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-amber-800 font-medium">
                {line}
              </p>
            );
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i}>{line}</p>;
        })}
      </div>
    </div>
  );
}
