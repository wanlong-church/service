import React, { Suspense } from 'react';
import { fetchGoogleSheetData } from '@/app/_thirdParty/googleSheet';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import SheetView from './sheet-view';

const DashboardPage = async () => {
	try {
		console.log('==== prefix: process.env.GOOGLE_PRIVATE_KEY', process.env.GOOGLE_PRIVATE_KEY);
		console.log('==== prefix: process.env', process.env);
	} catch (error) {
		console.log('error', error);
	}
	// const sheetDataPromise = fetchGoogleSheetData();/
	return (
		<Box h="full" p="3">
			{/* <Suspense
				fallback={
					<Flex w="full" h="full" justifyContent="center" alignItems="center">
						<Spinner size="xl" />
					</Flex>
				}
			>
				<SheetView sheetDataPromise={sheetDataPromise} />
			</Suspense> */}
		</Box>
	);
};

export default DashboardPage;
