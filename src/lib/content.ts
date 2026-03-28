import fs from 'fs';
import path from 'path';
import { Track, Grade, Subject, Test, TRACK_GRADES, SUBJECTS } from './types';

/**
 * Loads and parses a test JSON file from content/{track}/{grade}/{subject}/trial-{n}.json
 * This module is ONLY for server components and generateStaticParams — do NOT import in client components.
 */
export function getTest(
  track: Track,
  grade: Grade,
  subject: Subject,
  trial: number
): Test {
  const filePath = path.join(
    process.cwd(),
    'content',
    track,
    grade,
    subject,
    `trial-${trial}.json`
  );
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Test;
}

/**
 * Returns the list of available trial numbers for a given track/grade/subject
 * by checking which trial-{n}.json files exist.
 */
export function getAvailableTrials(
  track: Track,
  grade: Grade,
  subject: Subject
): number[] {
  const dir = path.join(process.cwd(), 'content', track, grade, subject);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir);
  const trials: number[] = [];

  for (const file of files) {
    const match = file.match(/^trial-(\d+)\.json$/);
    if (match) {
      trials.push(parseInt(match[1], 10));
    }
  }

  return trials.sort((a, b) => a - b);
}

/**
 * Returns all valid { track, grade, subject, test } param combinations
 * for use with generateStaticParams. Iterates over TRACK_GRADES, SUBJECTS,
 * and available trials.
 */
export function getAllTestParams(): {
  track: Track;
  grade: Grade;
  subject: Subject;
  test: string;
}[] {
  const params: { track: Track; grade: Grade; subject: Subject; test: string }[] = [];

  for (const [track, grades] of Object.entries(TRACK_GRADES) as [Track, Grade[]][]) {
    for (const grade of grades) {
      for (const subject of SUBJECTS) {
        const trials = getAvailableTrials(track, grade, subject);
        for (const trial of trials) {
          params.push({ track, grade, subject, test: `trial-${trial}` });
        }
      }
    }
  }

  return params;
}
