import { z } from 'zod';
import { trpc, TRPCError } from '../../lib/trpc';
import { users } from '../../lib/programs';

export const loginTrpcRoute = trpc.procedure
  .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
  .mutation(({ input }) => {
    const user = users.find((u) => u.email === input.email && u.password === input.password);
    if (!user) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Неверный email или пароль' });

    const token = `fake-jwt-token-${user.id}-${Date.now()}`;
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  });
