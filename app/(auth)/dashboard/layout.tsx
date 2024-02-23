import { Box, Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import Nav from './nav';

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
			<Box p="3" bgColor="#F7F7F7" borderTop="1px">
				<Nav />
			</Box>
		</Flex>
	);
};

export default DashboardLayout;
