/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { trpc } from '../lib/trpc';
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMarksTrpcRoute } from './getMarks';
import { getProgramTrpcRoute } from './getProgram';
import { getProgramsTrpcRoute } from './getPrograms';
import { getUserProfileTrpcRoute } from './getUserProfile';
import { loginTrpcRoute } from './login';
import { registerTrpcRoute } from './register';
import { removeMarkTrpcRoute } from './removeMark';
import { setMarkTrpcRoute } from './setMark';
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMarks: getMarksTrpcRoute,
  getProgram: getProgramTrpcRoute,
  getPrograms: getProgramsTrpcRoute,
  getUserProfile: getUserProfileTrpcRoute,
  login: loginTrpcRoute,
  register: registerTrpcRoute,
  removeMark: removeMarkTrpcRoute,
  setMark: setMarkTrpcRoute,
  // @endindex

  getTrainers: trpc.procedure.query(async ({ ctx }) => {
    const trainers = await ctx.prisma.trainer.findMany();
    return {
      trainers: trainers.map(
        (t: {
          id: any;
          name: any;
          username: any;
          specialty: any;
          experience: any;
          rating: any;
          bio: any;
          clientsCount: any;
          certificationsCount: any;
        }) => ({
          id: t.id,
          name: t.name,
          username: t.username,
          specialty: t.specialty,
          experience: t.experience,
          rating: t.rating,
          bio: t.bio,
          clientsCount: t.clientsCount,
          certificationsCount: t.certificationsCount,
        })
      ),
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
