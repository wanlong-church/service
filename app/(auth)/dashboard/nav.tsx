import React from 'react';
import { FaHome } from 'react-icons/fa';
import { RiFileList2Fill } from 'react-icons/ri';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';

const navInfo = [
	{
		name: '首頁',
		path: '/',
		icon: FaHome,
	},
	{
		name: '服事表',
		path: '/dashboard',
		icon: RiFileList2Fill,
	},
];

const Nav = ({ className }: { className?: ClassValue }) => {
	return (
		<div className={cn('flex justify-center items-center', className)}>
			{navInfo.map((nav) => (
				<div key={nav.path} className="mx-3">
					<Link href={nav.path}>
						<nav.icon className="w-8 h-8" />
					</Link>
				</div>
			))}
		</div>
	);
};

export default Nav;
