import _ from 'lodash'
import { programs } from '../../lib/programs'
import { trpc } from '../../lib/trpc'

export const getProgramsTrpcRoute = trpc.procedure.query(() => {
  return {
    programs: programs.map((program) => _.pick(program, ['name', 'sport', 'description'])),
  }
})
