import TeacherLink from "@/components/TeacherLink";
import TeacherBannerWrapper from "@/components/TeacherBannerWrapper";

export default function Home() {
  return (
    <div>
      <TeacherBannerWrapper />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NSW Test Prep
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice questions for NSW Opportunity Class (OC) and Selective School
            entrance exams. Build skills, track progress, and prepare with
            confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* OC Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                Years 2 &ndash; 4
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OC Prep</h2>
            <p className="text-gray-600 mb-6">
              Opportunity Class placement test preparation covering Maths, Reading,
              Thinking Skills, and Writing.
            </p>
            <TeacherLink
              href="/oc"
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Practising
            </TeacherLink>
          </div>

          {/* Selective Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                Years 5 &ndash; 6
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Selective Prep
            </h2>
            <p className="text-gray-600 mb-6">
              Selective High School placement test preparation covering Maths,
              Reading, Thinking Skills, and Writing.
            </p>
            <TeacherLink
              href="/selective"
              className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Practising
            </TeacherLink>
          </div>
        </div>
      </div>
    </div>
  );
}
