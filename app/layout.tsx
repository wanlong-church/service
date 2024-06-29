import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '萬隆服事表',
	description: '萬隆服事表',
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
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
