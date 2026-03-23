import { trpc } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getProgramTrpcRoute } from './getProgram'
import { getProgramsTrpcRoute } from './getPrograms'
import { getUserProfileTrpcRoute } from './getUserProfile'
import { loginTrpcRoute } from './login'
// @endindex

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getProgram: getProgramTrpcRoute,
  getPrograms: getProgramsTrpcRoute,
  getUserProfile: getUserProfileTrpcRoute,
  login: loginTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
