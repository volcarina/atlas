import _ from 'lodash';
import { trpc } from '../../lib/trpc';
import { userProfile, getMarks, programs } from '../../lib/programs';

export const getUserProfileTrpcRoute = trpc.procedure.query(() => {
  const marks = getMarks();

  const enrichedMarks = marks.map((m) => {
    const program = programs.find((p) => p.name === m.programName);
    return {
      ...m,
      programSport: program?.sport ?? '',
      programLevel: program?.level ?? '',
      programDuration: program?.duration ?? 0,
    };
  });

  const userSports = _.countBy(enrichedMarks.map((m) => m.programSport).filter(Boolean));
  const topSports = Object.entries(userSports)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([sport]) => sport);

  const levelCounts = _.countBy(enrichedMarks.map((m) => m.programLevel).filter(Boolean));
  const topLevel = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const markedNames = new Set(marks.map((m) => m.programName));
  const hasTaste = topSports.length > 0;

  let similar: typeof programs;
  if (hasTaste) {
    const strict = programs.filter(
      (p) => topSports.includes(p.sport) && p.level === topLevel && !markedNames.has(p.name)
    );
    const relaxed = programs.filter((p) => topSports.includes(p.sport) && !markedNames.has(p.name));
    similar = _.sampleSize(strict.length >= 7 ? strict : relaxed, 7);
  } else {
    similar = programs
      .filter((p) => !markedNames.has(p.name))
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 7);
  }

  const similarPrograms = similar.map((p) => ({
    name: p.name,
    sport: p.sport,
    level: p.level,
    duration: p.duration,
  }));

  return {
    user: userProfile,
    marks: enrichedMarks,
    similarPrograms,
    topSports,
    hasTaste,
  };
});
