import React from 'react';
import Nav from './nav';
import PageTitle from './page-title';

export default function Layout ({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col w-screen h-screen max-h-screen bg-white overflow-y-auto">
			<PageTitle />
			<div className="h-[calc(100svh-90px)] overflow-auto">{children}</div>
			<div className="p-3 bg-gray-200 border-t">
				<Nav />
			</div>
		</div>
	);
};

