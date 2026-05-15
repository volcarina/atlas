/* eslint-disable @typescript-eslint/no-explicit-any */
import { trpc, TRPCError } from '../../lib/trpc';

export const getUserProfileTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const userId = ctx.userId;
  if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Необходима авторизация' });

  const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Пользователь не найден' });

  const marks = await ctx.prisma.mark.findMany({
    where: { userId: user.id },
    include: {
      program: { select: { name: true, sport: true, level: true, duration: true, calories: true, nick: true } },
    },
    orderBy: { markedAt: 'desc' },
  });

  const enrichedMarks = marks.map(
    (m: {
      program: { name: any; sport: any; level: any; duration: any; calories: any; nick: any };
      mark: any;
      markedAt: { toISOString: () => any };
    }) => ({
      programName: m.program.name,
      programNick: m.program.nick,
      mark: m.mark,
      markedAt: m.markedAt.toISOString(),
      programSport: m.program.sport,
      programLevel: m.program.level,
      programDuration: m.program.duration,
      programCalories: m.program.calories,
    })
  );

  // Stats
  const completedMarks = enrichedMarks.filter((m: any) => m.mark === 'completed');
  const totalMinutes = completedMarks.reduce((sum: number, m: any) => sum + (m.programDuration ?? 0), 0);
  const totalCalories = completedMarks.reduce((sum: number, m: any) => sum + (m.programCalories ?? 0), 0);

  // Streak: count consecutive days with completed workouts ending today
  const completedDates = completedMarks
    .map((m: any) => m.markedAt.slice(0, 10))
    .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
    .sort()
    .reverse();

  let streak = 0;
  if (completedDates.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    let cursor = today;
    for (const d of completedDates) {
      if (d === cursor) {
        streak++;
        const prev = new Date(cursor);
        prev.setDate(prev.getDate() - 1);
        cursor = prev.toISOString().slice(0, 10);
      } else {
        break;
      }
    }
  }

  // Top sports
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

  const markedProgramIds = marks.map((m: { programId: any }) => m.programId);
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

  const similarPrograms = similar.map((p: { name: any; nick: any; sport: any; level: any; duration: any }) => ({
    name: p.name,
    nick: p.nick,
    sport: p.sport,
    level: p.level,
    duration: p.duration,
  }));

  return {
    user: {
      name: user.name,
      email: user.email,
      birthDate: user.birthDate ? user.birthDate.toISOString() : null,
      gender: user.gender ?? null,
      avatarColor: user.avatarColor ?? null,
      coverStyle: user.coverStyle ?? null,
      avatarPhoto: user.avatarPhoto ?? null,
      coverPhoto: user.coverPhoto ?? null,
      createdAt: user.createdAt.toISOString(),
    },
    marks: enrichedMarks,
    stats: {
      totalMinutes,
      totalCalories,
      streak,
    },
    similarPrograms,
    topSports,
    hasTaste,
  };
});
