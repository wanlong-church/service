import React, { Suspense } from 'react';
import { fetchGoogleSheetData } from '@/app/_thirdParty/googleSheet';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import SheetView from './sheet-view';
const DashboardPage = async () => {
	// const sheetDataPromise = fetchGoogleSheetData();
	return (
		<Box h="full" p="3">
			嗚嗚壞掉惹
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
