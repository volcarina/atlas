/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { trpc } from '../../lib/trpc';
import { SPORTS, LEVELS } from '../../lib/programs';

export const getProgramsTrpcRoute = trpc.procedure
  .input(
    z
      .object({
        sport: z.string().optional(),
        level: z.string().optional(),
        maxDuration: z.number().optional(),
      })
      .optional()
  )
  .query(async ({ input, ctx }) => {
    const where: {
      sport?: string;
      level?: string;
      duration?: { lte: number };
    } = {};

    if (input?.sport && input.sport !== 'Все') {
      where.sport = input.sport;
    }
    if (input?.level && input.level !== 'Все') {
      where.level = input.level;
    }
    if (input?.maxDuration) {
      where.duration = { lte: input.maxDuration };
    }

    const programs = await ctx.prisma.program.findMany({
      where,
      include: {
        exercises: {
          select: { id: true, name: true },
        },
      },
      orderBy: { completedCount: 'desc' },
    });

    return {
      programs: programs.map(
        (p: {
          name: any;
          sport: any;
          level: any;
          duration: any;
          calories: any;
          description: any;
          rating: any;
          reviewsCount: any;
          completedCount: any;
          exercises: any;
        }) => ({
          name: p.name,
          sport: p.sport,
          level: p.level,
          duration: p.duration,
          calories: p.calories,
          description: p.description,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          completedCount: p.completedCount,
          exercises: p.exercises,
        })
      ),
      sports: SPORTS,
      levels: LEVELS,
    };
  });
