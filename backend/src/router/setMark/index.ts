import { z } from 'zod';
import { trpc } from '../../lib/trpc';
import { setMark } from '../../lib/programs';

export const setMarkTrpcRoute = trpc.procedure
  .input(
    z.object({
      programName: z.string(),
      mark: z.enum(['completed', 'favorite', 'wantTo']),
    })
  )
  .mutation(({ input }) => {
    const marks = setMark(input.programName, input.mark);
    return { marks };
  });
