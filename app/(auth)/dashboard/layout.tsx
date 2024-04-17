import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Nav from './nav';
const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Flex flexDir="column" w="100vw" h="100vh" maxH="100vh" bgColor="white" overflowY="auto">
			<Flex as="header" justifyContent="center" bgColor="#F7F7F7" borderBottom="1px" p="3">
				<Text fontSize="large" fontWeight="bold">
					服事總表
				</Text>
			</Flex>
			<Box h={`calc(100vh - 90px)`} overflow="auto">
				{children}
			</Box>
			<Box p="3" bgColor="#F7F7F7" borderTop="1px">
				<Nav />
			</Box>
		</Flex>
	);
};

export default DashboardLayout;
