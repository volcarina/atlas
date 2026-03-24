import { z } from 'zod';
import { programs } from '../../lib/programs';
import { getTrainerBySport } from '../../lib/trainers';
import { trpc } from '../../lib/trpc';

export const getProgramTrpcRoute = trpc.procedure.input(z.object({ programTitle: z.string() })).query(({ input }) => {
  const program = programs.find((p) => p.name === input.programTitle);
  if (!program) return { program: null, trainer: null };

  const trainer = getTrainerBySport(program.sport);
  return { program, trainer };
});
