import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

const RootLoading = () => {
	return (
		<Flex w='100vw' h={`calc(var(--vh) * 100)`} justifyContent="center" alignItems="center">
			<Spinner size="xl" />
		</Flex>
	);
};

export default RootLoading;
