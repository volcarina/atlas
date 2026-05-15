import { z } from 'zod';
import { trpc, TRPCError } from '../../lib/trpc';

export const registerTrpcRoute = trpc.procedure
  .input(z.object({ email: z.string().email(), password: z.string().min(6), name: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const exists = await ctx.prisma.user.findFirst({ where: { email: input.email } });

    if (exists) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Пользователь уже существует' });
    }

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    });

    const token = `fake-jwt-token-${user.id}-${Date.now()}`;
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  });
