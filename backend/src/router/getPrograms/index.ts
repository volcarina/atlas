import _ from 'lodash'
import { z } from 'zod'
import { programs, SPORTS, LEVELS } from '../../lib/programs'
import { trpc } from '../../lib/trpc'

export const getProgramsTrpcRoute = trpc.procedure
  .input(
    z.object({
      sport: z.string().optional(),
      level: z.string().optional(),
      maxDuration: z.number().optional(),
    }).optional()
  )
  .query(({ input }) => {
    let filtered = programs

    if (input?.sport && input.sport !== 'Все') {
      filtered = filtered.filter((p) => p.sport === input.sport)
    }
    if (input?.level && input.level !== 'Все') {
      filtered = filtered.filter((p) => p.level === input.level)
    }
    if (input?.maxDuration) {
      filtered = filtered.filter((p) => p.duration <= input.maxDuration!)
    }

    return {
      programs: filtered.map((p) => _.pick(p, [
        'name', 'sport', 'level', 'duration', 'calories',
        'description', 'rating', 'reviewsCount', 'completedCount', 'exercises',
      ])),
      sports: SPORTS,
      levels: LEVELS,
    }
  })
