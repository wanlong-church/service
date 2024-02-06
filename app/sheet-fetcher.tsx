import React from 'react';
import { fetchGoogleSheetData } from './_thirdParty/googleSheet';

const SheetFetcher = async () => {
	return null;
	const result = await fetchGoogleSheetData();
	console.log({ result });
	return (
		<>
			{result.header.map((column, index) => {
				return <div key={index}>{column.name}</div>;
			})}
			{result.data.map((row, index) => {
				return <div key={index}>{JSON.stringify(row)}</div>;
			})}
		</>
	);
};

export default SheetFetcher;
