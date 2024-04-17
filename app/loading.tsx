import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
const RootLoading = () => {
	return (
		<Flex w="100vw" h="100vh" justifyContent="center" alignItems="center">
			<Spinner size="xl" />
		</Flex>
	);
};

export default RootLoading;
