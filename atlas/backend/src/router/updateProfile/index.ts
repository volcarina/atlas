/* eslint-disable prettier/prettier */
import { z } from 'zod';
import { trpc, TRPCError } from '../../lib/trpc';

export const updateProfileTrpcRoute = trpc.procedure
  .input(
    z.object({
      name: z.string().nullable().optional(),
      email: z.string().email().nullable().optional(),
      birthDate: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      avatarColor: z.string().nullable().optional(),
      coverStyle: z.string().nullable().optional(),
      avatarPhoto: z.string().nullable().optional(),
      coverPhoto: z.string().nullable().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Необходима авторизация' });

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Пользователь не найден' });

    // Check email uniqueness if changing
    if (input.email && input.email !== user.email) {
      const existing = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new TRPCError({ code: 'CONFLICT', message: 'Этот email уже используется' });
    }

    const updated = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.email ? { email: input.email } : {}),
        ...(input.birthDate !== undefined ? { birthDate: input.birthDate ? new Date(input.birthDate) : null } : {}),
        ...(input.gender !== undefined ? { gender: input.gender } : {}),
        ...(input.avatarColor !== undefined ? { avatarColor: input.avatarColor } : {}),
        ...(input.coverStyle !== undefined ? { coverStyle: input.coverStyle } : {}),
        ...(input.avatarPhoto !== undefined ? { avatarPhoto: input.avatarPhoto } : {}),
        ...(input.coverPhoto !== undefined ? { coverPhoto: input.coverPhoto } : {}),
      },
    });

    return {
      user: {
        name: updated.name,
        email: updated.email,
        birthDate: updated.birthDate ? updated.birthDate.toISOString() : null,
        gender: updated.gender ?? null,
        avatarColor: updated.avatarColor ?? null,
        coverStyle: updated.coverStyle ?? null,
        avatarPhoto: updated.avatarPhoto ?? null,
        coverPhoto: updated.coverPhoto ?? null,
      },
    };
  });
