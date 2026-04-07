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

    // Находим тренера по виду спорта программы
    const trainer = await ctx.prisma.trainer.findFirst({
      where: { sports: { has: program.sport } },
    });

    // Фолбэк: первый тренер если не нашли
    const fallbackTrainer = trainer ?? (await ctx.prisma.trainer.findFirst());

    return { program, trainer: fallbackTrainer };
  });
