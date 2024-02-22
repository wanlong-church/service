import React from 'react';
import { Column, fetchGoogleSheetData, Row } from '../../_thirdParty/googleSheet';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { SHEET_COLUMN_ORDER } from '@/app/_thirdParty/googleSheet/const';

const Item = ({ row, header }: { row: Row; header: Column[] }) => {
	return (
		<>
			<AccordionItem>
				<h2>
					<AccordionButton>
						<Box as="span" flex="1" textAlign="left">
							{row.date}
						</Box>
						<AccordionIcon />
					</AccordionButton>
				</h2>
				<AccordionPanel pb={4}>
					{header.map((column, index) => {
						return (
							<Box key={index}>
								{column.name}: {row[column.id]}
							</Box>
						);
					})}
				</AccordionPanel>
			</AccordionItem>
		</>
	);
};
const SheetView = async () => {
	const { header, data } = await fetchGoogleSheetData();
	return (
		<>
			<Accordion defaultIndex={[0]} allowMultiple>
				{data.map((row) => {
					return <Item key={row.date} row={row} header={header} />;
				})}
			</Accordion>
		</>
	);
};

export default SheetView;
