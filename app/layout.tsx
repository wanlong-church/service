import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import SafariHacks from './safari-hacks';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '萬隆服侍表',
	description: '萬隆服侍安排表',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-TW">
			<body className={inter.className}>
				<SafariHacks />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
