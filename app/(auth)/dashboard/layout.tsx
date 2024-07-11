import React from 'react';
import Nav from './nav';

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<div className="flex flex-col w-screen h-screen max-h-screen bg-white overflow-y-auto">
			<header className="flex justify-center bg-gray-200 border-b p-3">
				<h1 className="text-xl font-bold">服事表</h1>
			</header>
			<div className="h-[calc(100svh-90px)] overflow-auto">{children}</div>
			<div className="p-3 bg-gray-200 border-t">
				<Nav />
			</div>
		</div>
	);
};

export default DashboardLayout;
