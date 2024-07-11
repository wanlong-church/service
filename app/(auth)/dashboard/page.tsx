import { Suspense } from 'react';
import { fetchGoogleSheetData } from '@/app/_thirdParty/googleSheet';
import SheetView from './sheet-view';

const DashboardPage = async () => {
	const sheetDataPromise = fetchGoogleSheetData();
	return (
		<div className="h-full p-3">
			<Suspense
				fallback={
					<div className="flex w-full h-full justify-center items-center">
						<div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
					</div>
				}
			>
				<SheetView sheetDataPromise={sheetDataPromise} />
			</Suspense>
		</div>
	);
};

export default DashboardPage;
