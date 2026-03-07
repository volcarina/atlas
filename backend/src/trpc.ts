import { initTRPC } from '@trpc/server'
import _ from 'lodash'
import { z } from 'zod'

const programs = _.times(100, (i) => ({
  name: `cool-name-${i}`,
  sport: `program ${i}`,
  description: `Description of program ${i}...`,
  text: _.times(100, (j) => `<p>Text paragrph ${j} of program ${i}...</p>`).join(''),
}))

const userProfile = {
  name: "Арина Волчек",
  email: "arina.volchek@example.com",
}

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getPrograms: trpc.procedure.query(() => {
    return { programs: programs.map((program) => _.pick(program, ['name', 'sport', 'description']))}
  }),
  getProgram: trpc.procedure.input(
    z.object({
      programTitle: z.string(),
    }),
  ).query(({input}) => {
    const program = programs.find((program) => program.name === input.programTitle)
    return { program: program || null }
  }),

  // ✅ НОВЫЙ ПРОЦЕДУРА ДЛЯ ПРОФИЛЯ
  getUserProfile: trpc.procedure.query(() => {
    return { user: userProfile }
  }),
})



export type TrpcRouter = typeof trpcRouter
