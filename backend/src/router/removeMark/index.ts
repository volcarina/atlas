import { z } from 'zod';
import { trpc } from '../../lib/trpc';
import { removeMark } from '../../lib/programs';

export const removeMarkTrpcRoute = trpc.procedure
  .input(
    z.object({
      programName: z.string(),
    })
  )
  .mutation(({ input }) => {
    const marks = removeMark(input.programName);
    return { marks };
  });
