export type Track = 'oc' | 'selective';
export type Grade = 'year-2' | 'year-3' | 'year-4' | 'year-5' | 'year-6';
export type Subject = 'maths' | 'reading' | 'thinking-skills' | 'writing';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const TRACK_GRADES: Record<Track, Grade[]> = {
  oc: ['year-2', 'year-3', 'year-4'],
  selective: ['year-5', 'year-6'],
};

export const SUBJECTS: Subject[] = ['maths', 'reading', 'thinking-skills', 'writing'];

// MC Question (used by Maths, Thinking Skills, and Reading)
export interface MCQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  answer: number; // 0-indexed
  topic: string;
  difficulty: Difficulty;
  workedSolution: string;
}

export interface TestMeta {
  subject: Subject;
  grade: Grade;
  track: Track;
  trial: number;
  questionCount: number;
}

export interface MCTest {
  testMeta: TestMeta;
  questions: MCQuestion[];
}

export interface ReadingPassage {
  title: string;
  text: string;
  type: 'fiction' | 'non-fiction' | 'poetry' | 'persuasive';
}

export interface ReadingTest {
  testMeta: TestMeta;
  passage: ReadingPassage;
  questions: MCQuestion[];
}

export interface WritingRubricLevel {
  excellent: string;
  satisfactory: string;
  developing: string;
}

export interface WritingRubric {
  ideas: WritingRubricLevel;
  structure: WritingRubricLevel;
  language: WritingRubricLevel;
  mechanics: WritingRubricLevel;
}

export interface SampleResponse {
  level: 'excellent' | 'satisfactory';
  text: string;
  annotations: string;
}

export interface WritingPromptData {
  id: string;
  type: 'narrative' | 'persuasive' | 'informational';
  text: string;
  timeLimit: number;
  wordGuide: string;
}

export interface WritingTest {
  testMeta: Omit<TestMeta, 'questionCount'>;
  prompt: WritingPromptData;
  rubric: WritingRubric;
  sampleResponses: SampleResponse[];
}

export type Test = MCTest | ReadingTest | WritingTest;

// Type guards
export function isReadingTest(test: Test): test is ReadingTest {
  return test.testMeta.subject === 'reading' && 'passage' in test;
}

export function isWritingTest(test: Test): test is WritingTest {
  return test.testMeta.subject === 'writing' && 'prompt' in test;
}

export function isMCTest(test: Test): test is MCTest {
  return !isReadingTest(test) && !isWritingTest(test);
}
