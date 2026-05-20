import { z } from 'zod';
import { trpc } from '../../lib/trpc';

export const getProgramTrpcRoute = trpc.procedure
  .input(z.object({ programTitle: z.string() }))
  .query(async ({ input, ctx }) => {
    const program = await ctx.prisma.program.findFirst({
      where: { name: input.programTitle },
      include: {
        exercises: {
          select: { id: true, name: true, order: true, duration: true, restAfter: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!program) return { program: null, trainer: null };

    const matchingTrainers = await ctx.prisma.trainer.findMany({
      where: { sports: { has: program.sport } },
    });

    let trainer = null;
    if (matchingTrainers.length > 0) {
      const idx = program.name.length % matchingTrainers.length;
      trainer = matchingTrainers[idx];
    } else {
      trainer = await ctx.prisma.trainer.findFirst();
    }

    return { program, trainer };
  });
