/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { trpc } from '../lib/trpc';
import { getMarksTrpcRoute } from './getMarks';
import { getProgramTrpcRoute } from './getProgram';
import { getProgramsTrpcRoute } from './getPrograms';
import { getSimilarProgramsTrpcRoute } from './getSimiliarPrograms';
import { getUserProfileTrpcRoute } from './getUserProfile';
import { loginTrpcRoute } from './login';
import { registerTrpcRoute } from './register';
import { removeMarkTrpcRoute } from './removeMark';
import { setMarkTrpcRoute } from './setMark';
import { updateProfileTrpcRoute } from './updateProfile';

export const trpcRouter = trpc.router({
  getMarks: getMarksTrpcRoute,
  getProgram: getProgramTrpcRoute,
  getPrograms: getProgramsTrpcRoute,
  getSimilarPrograms: getSimilarProgramsTrpcRoute,
  getUserProfile: getUserProfileTrpcRoute,
  login: loginTrpcRoute,
  register: registerTrpcRoute,
  removeMark: removeMarkTrpcRoute,
  setMark: setMarkTrpcRoute,
  updateProfile: updateProfileTrpcRoute,

  getTrainers: trpc.procedure.query(async ({ ctx }) => {
    const trainers = await ctx.prisma.trainer.findMany();
    return {
      trainers: trainers.map((t: any) => ({
        id: t.id,
        name: t.name,
        username: t.username,
        specialty: t.specialty,
        experience: t.experience,
        rating: t.rating,
        bio: t.bio,
        clientsCount: t.clientsCount,
        certificationsCount: t.certificationsCount,
        sports: t.sports,
        location: t.location ?? null,
        languages: t.languages ?? [],
        education: t.education ?? null,
        achievements: t.achievements ?? [],
        instagram: t.instagram ?? null,
        availableSlots: t.availableSlots ?? null,
        pricePerSession: t.pricePerSession ?? null,
        responseTime: t.responseTime ?? null,
      })),
    };
  }),

  getTrainer: trpc.procedure.input(z.object({ trainerId: z.string() })).query(async ({ input, ctx }) => {
    const trainer = await ctx.prisma.trainer.findUnique({
      where: { id: input.trainerId },
    });
    return { trainer: trainer ?? null };
  }),
});

export type TrpcRouter = typeof trpcRouter;
