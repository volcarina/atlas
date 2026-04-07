/* eslint-disable @typescript-eslint/no-explicit-any */
import { trpc } from '../../lib/trpc';

export const getMarksTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  // Используем первого пользователя (до появления auth)
  const user = await ctx.prisma.user.findFirst();
  if (!user) return { marks: [] };

  const marks = await ctx.prisma.mark.findMany({
    where: { userId: user.id },
    include: {
      program: {
        select: { name: true, sport: true, level: true, duration: true },
      },
    },
    orderBy: { markedAt: 'desc' },
  });

  return {
    marks: marks.map(
      (m: {
        program: { name: any; sport: any; level: any; duration: any };
        mark: any;
        markedAt: { toISOString: () => any };
      }) => ({
        programName: m.program.name,
        mark: m.mark,
        markedAt: m.markedAt.toISOString(),
        programSport: m.program.sport,
        programLevel: m.program.level,
        programDuration: m.program.duration,
      })
    ),
  };
});
