import { trpc } from '../../lib/trpc'
import { userProfile } from '../../lib/programs'

export const getUserProfileTrpcRoute = trpc.procedure.query(() => ({ user: userProfile }))
