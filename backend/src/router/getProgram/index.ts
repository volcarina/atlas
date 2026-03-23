import { z } from 'zod'
import { programs } from '../../lib/programs'
import { trpc } from '../../lib/trpc'

export const getProgramTrpcRoute = trpc.procedure.input(z.object({ programTitle: z.string() })).query(({ input }) => {
  const program = programs.find((p) => p.name === input.programTitle)
  return { program: program || null }
})
