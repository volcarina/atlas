/* eslint-disable prettier/prettier */
import { z } from 'zod';
import { trpc } from '../../lib/trpc';

export const getSimilarProgramsTrpcRoute = trpc.procedure
  .input(z.object({ programName: z.string(), sport: z.string(), level: z.string() }))
  .query(async ({ input, ctx }) => {
    // Похожие: сначала тот же спорт, исключаем текущую
    const sameSportPrograms = await ctx.prisma.program.findMany({
      where: {
        sport: input.sport,
        name: { not: input.programName },
      },
      select: {
        name: true,
        sport: true,
        level: true,
        duration: true,
        calories: true,
        description: true,
        rating: true,
        reviewsCount: true,
        completedCount: true,
      },
      orderBy: { rating: 'desc' },
      take: 6,
    });

    // Если не набрали 4 — добираем из других спортов того же уровня
    let similar = sameSportPrograms;
    if (similar.length < 4) {
      const otherSportPrograms = await ctx.prisma.program.findMany({
        where: {
          sport: { not: input.sport },
          level: input.level,
          name: { not: input.programName },
        },
        select: {
          name: true,
          sport: true,
          level: true,
          duration: true,
          calories: true,
          description: true,
          rating: true,
          reviewsCount: true,
          completedCount: true,
        },
        orderBy: { rating: 'desc' },
        take: 4 - similar.length,
      });
      similar = [...similar, ...otherSportPrograms];
    }

    return { similar: similar.slice(0, 4) };
  });
