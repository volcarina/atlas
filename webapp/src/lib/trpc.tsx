import type { TrpcRouter } from '@atlas/backend/src/router/index';
import { createTRPCReact } from '@trpc/react-query';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

// eslint-disable-next-line react-refresh/only-export-components
export const trpc = createTRPCReact<TrpcRouter>();

function handleNetworkError(error: unknown) {
  const msg = (error as any)?.message ?? '';
  if (
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Failed to fetch') ||
    msg.includes('Load failed') ||
    msg.includes('NetworkError')
  ) {
    import('../components/NetworkStatus').then(({ triggerNetworkError }) => {
      triggerNetworkError?.('server-error');
    });
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleNetworkError,
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: handleNetworkError,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      headers() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
