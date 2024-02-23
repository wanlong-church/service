'use client';

import React from 'react';
import { Box, Flex, FlexProps, Icon } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { RiFileList2Fill } from 'react-icons/ri';
import Link from 'next/link';

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
const Nav = ({ flexProps }: { flexProps?: FlexProps }) => {
	return (
		<Flex justifyContent="center" alignItems="center" {...flexProps}>
			{navInfo.map((nav) => (
				<Box key={nav.path} as={Link} href={nav.path} mx="3">
					<Icon as={nav.icon} boxSize={8} />
				</Box>
			))}
		</Flex>
	);
};

export default Nav;
