import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { type Express, type Request } from 'express';
import { type TrpcRouter } from '../router';
import { type AppContext } from './ctx';

export interface TrpcContext extends AppContext {
  userId: string | null;
}

// Extract userId from token "fake-jwt-token-{userId}-{timestamp}"
function extractUserId(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  const match = token.match(/^fake-jwt-token-([^-]+-[^-]+-[^-]+-[^-]+-[^-]+)-\d+$/);
  if (match) return match[1];
  // fallback for simple UUIDs
  const m2 = token.match(/^fake-jwt-token-(.+)-\d{13}$/);
  if (m2) return m2[1];
  return null;
}

export const trpc = initTRPC.context<TrpcContext>().create();

export { TRPCError };

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: ({ req }) => ({
        ...appContext,
        userId: extractUserId(req),
      }),
    })
  );
};
