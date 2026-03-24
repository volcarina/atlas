import { trpc } from '../../lib/trpc';
import { getMarks, programs } from '../../lib/programs';

export const getMarksTrpcRoute = trpc.procedure.query(() => {
  const marks = getMarks();
  const enriched = marks.map((m) => {
    const program = programs.find((p) => p.name === m.programName);
    return {
      ...m,
      programSport: program?.sport ?? '',
      programLevel: program?.level ?? '',
      programDuration: program?.duration ?? 0,
    };
  });
  return { marks: enriched };
});
