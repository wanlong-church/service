'use client';

import { ChakraProvider, theme } from '@chakra-ui/react';

/** 頂層 provider 集中在 Providers 一併傳入 */
export function Providers({ children }: { children: React.ReactNode }) {
	return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
