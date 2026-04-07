import { trpc } from '../../lib/trpc';

export const getUserProfileTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const user = await ctx.prisma.user.findFirst();
  if (!user) {
    return { user: null, marks: [], similarPrograms: [], topSports: [], hasTaste: false };
  }

  const marks = await ctx.prisma.mark.findMany({
    where: { userId: user.id },
    include: {
      program: { select: { name: true, sport: true, level: true, duration: true } },
    },
    orderBy: { markedAt: 'desc' },
  });

  const enrichedMarks = marks.map((m) => ({
    programName: m.program.name,
    mark: m.mark,
    markedAt: m.markedAt.toISOString(),
    programSport: m.program.sport,
    programLevel: m.program.level,
    programDuration: m.program.duration,
  }));

  // Считаем топ виды спорта
  const sportCount: Record<string, number> = {};
  for (const m of enrichedMarks) {
    if (m.programSport) sportCount[m.programSport] = (sportCount[m.programSport] ?? 0) + 1;
  }
  const topSports = Object.entries(sportCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([sport]) => sport);

  const levelCount: Record<string, number> = {};
  for (const m of enrichedMarks) {
    if (m.programLevel) levelCount[m.programLevel] = (levelCount[m.programLevel] ?? 0) + 1;
  }
  const topLevel = Object.entries(levelCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const markedProgramIds = marks.map((m) => m.programId);
  const hasTaste = topSports.length > 0;

  let similar;
  if (hasTaste) {
    similar = await ctx.prisma.program.findMany({
      where: {
        sport: { in: topSports },
        level: topLevel || undefined,
        id: { notIn: markedProgramIds },
      },
      take: 7,
      orderBy: { completedCount: 'desc' },
    });

    if (similar.length < 7) {
      similar = await ctx.prisma.program.findMany({
        where: {
          sport: { in: topSports },
          id: { notIn: markedProgramIds },
        },
        take: 7,
        orderBy: { completedCount: 'desc' },
      });
    }
  } else {
    similar = await ctx.prisma.program.findMany({
      where: { id: { notIn: markedProgramIds } },
      orderBy: { completedCount: 'desc' },
      take: 7,
    });
  }

  const similarPrograms = similar.map((p) => ({
    name: p.name,
    sport: p.sport,
    level: p.level,
    duration: p.duration,
  }));

  return {
    user: { name: user.name, email: user.email },
    marks: enrichedMarks,
    similarPrograms,
    topSports,
    hasTaste,
  };
});
