import { z } from 'zod';
import { trpc } from '../../lib/trpc';

export const getProgramTrpcRoute = trpc.procedure
  .input(z.object({ programTitle: z.string() }))
  .query(async ({ input, ctx }) => {
    const program = await ctx.prisma.program.findFirst({
      where: { name: input.programTitle },
      include: {
        exercises: { select: { id: true, name: true } },
      },
    });

    if (!program) return { program: null, trainer: null };

    // Находим всех тренеров по виду спорта программы
    const matchingTrainers = await ctx.prisma.trainer.findMany({
      where: { sports: { has: program.sport } },
    });

    // eslint-disable-next-line no-useless-assignment
    let trainer = null;
    if (matchingTrainers.length > 0) {
      // Детерминированно выбираем тренера на основе длины имени программы
      const idx = program.name.length % matchingTrainers.length;
      trainer = matchingTrainers[idx];
    } else {
      trainer = await ctx.prisma.trainer.findFirst();
    }

    return { program, trainer };
  });
