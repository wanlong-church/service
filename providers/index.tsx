import ReactQueryProvider from './query-client-provider'

/** 頂層 providers 進入點 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>
}
