/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { trpc, TRPCError } from '../../lib/trpc';

export const removeMarkTrpcRoute = trpc.procedure
  .input(z.object({ programName: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Необходима авторизация' });

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Пользователь не найден' });

    const program = await ctx.prisma.program.findFirst({
      where: { name: input.programName },
    });

    if (program) {
      await ctx.prisma.mark.deleteMany({
        where: { userId: user.id, programId: program.id },
      });
    }

    const marks = await ctx.prisma.mark.findMany({
      where: { userId: user.id },
      include: {
        program: { select: { name: true } },
      },
    });

    return {
      marks: marks.map((m: { program: { name: any }; mark: any; markedAt: { toISOString: () => any } }) => ({
        programName: m.program.name,
        mark: m.mark,
        markedAt: m.markedAt.toISOString(),
      })),
    };
  });
