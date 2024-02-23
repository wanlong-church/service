import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import SafariHacks from './safari-hacks';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '萬隆服侍表',
	description: '萬隆服侍表',
	manifest: '/manifest.json',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-TW">
			<body className={inter.className}>
				<Script src="/scripts/safariVh.js" strategy="beforeInteractive" />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
