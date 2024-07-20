"use client"

import { usePathname } from 'next/navigation'

type Pathname = '/full-calendar' | '/dashboard';
const titleMap: Record<Pathname, string> = { '/full-calendar': '服事總表', '/dashboard': '個人服事表' }  

export default function PageTitle () {
    const pathName = usePathname();
    const pageTitle = titleMap[pathName as Pathname] || '';
	return (
		<header className="flex justify-center bg-gray-200 border-b p-3">
			<h1 className="text-xl font-bold"> {pageTitle} </h1>
		</header>
	);
};
