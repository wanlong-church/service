import { Box, Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import NavIcons from './nav-icons';

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Flex flexDir="column" w="100vw" h={`calc(var(--vh) * 100)`} maxH="100vh" bgColor="white" overflowY="auto">
			<Flex as="header" justifyContent="center" bgColor="#F7F7F7" borderBottom="1px" p="3">
				Dashboard
			</Flex>
			<Box h={`calc(var(--vh) * 100 - 90px)`} overflow="auto">
				{children}
			</Box>
			<Flex as="nav" justifyContent="center" p="3" bgColor="#F7F7F7" borderTop="1px">
				<NavIcons gutter={3} />
			</Flex>
		</Flex>
	);
};

export default DashboardLayout;
