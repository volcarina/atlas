import { z } from 'zod';
import { trpc, TRPCError } from '../../lib/trpc';
import { users } from '../../lib/programs';

export const registerTrpcRoute = trpc.procedure
  .input(z.object({ email: z.string().email(), password: z.string().min(6), name: z.string() }))
  .mutation(({ input }) => {
    const exists = users.some((u) => u.email === input.email);
    if (exists) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Пользователь уже существует' });

    const newUser = {
      id: (users.length + 1).toString(),
      email: input.email,
      password: input.password,
      name: input.name,
    };
    users.push(newUser);

    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
    return { user: { id: newUser.id, email: newUser.email, name: newUser.name }, token };
  });
