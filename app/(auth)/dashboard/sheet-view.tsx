'use client';

import { endOfWeek, getYear, isWithinInterval, startOfWeek } from 'date-fns';
import React, { use, useEffect } from 'react';
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	AccordionProps,
	Box,
	Text,
} from '@chakra-ui/react';
import { Column, GoogleSheetResponse, Row } from '../../_thirdParty/googleSheet';
const SheetView = ({ sheetDataPromise }: { sheetDataPromise: Promise<GoogleSheetResponse> }) => {
	const sheetData = use<GoogleSheetResponse>(sheetDataPromise);
	const { header, data } = sheetData;
	/** 將 data 依照「年份」分組 */
	const groupedData = data.reduce<Record<string, Row[]>>((acc, row) => {
		const year = getYear(new Date(row.date));
		acc[year] = acc[year] || [];
		acc[year].push(row);
		return acc;
	}, {});
	/** 控制要渲染的欄位 */
	const renderHeader = header.filter((column) => column.id !== 'date');
	/** 預設頁面滑至當週的開合選單 */
	useEffect(() => {
		const index = data.findIndex((row) => isDateInThisWeek(new Date(row.date)));
		/** scroll margin 找不到解法，先定位到上一個元素呈現同一個效果 */
		const thisWeekService = index > 0 ? data[index - 1] : data[0];
		const elementId = thisWeekService ? `sheetAccordionItem_${new Date(thisWeekService.date).getTime()}` : '';
		const element = document.getElementById(elementId);
		if (element) {
			/** TODO: 這裡設定 { scrollBehavior: smooth } 會壞掉，超爛 */
			element.scrollIntoView();
		}
	}, [data]);

	return (
		<Box>
			{Object.entries(groupedData)
				.sort(([aYear], [bYear]) => parseInt(bYear) - parseInt(aYear))
				.map(([year, rows]) => {
					/** 預設開啟當週服事 */
					const thisWeekIndex = rows.findIndex((row) => isDateInThisWeek(new Date(row.date)));
					const defaultIndex = ~thisWeekIndex ? [thisWeekIndex] : void 0;

					return (
						<Box key={year} pos="relative" id={`dog${year}`}>
							<Box pos="sticky" top="0" mb="2" p="2" zIndex={1}>
								<Text fontSize="2xl" fontWeight="bold" textAlign="center" bgColor="gray.400">
									{year}
								</Text>
							</Box>
							<SheetAccordion
								rows={rows}
								header={renderHeader}
								accordionProps={{
									defaultIndex,
								}}
							/>
						</Box>
					);
				})}
		</Box>
	);
};
const SheetAccordion = ({
	rows,
	header,
	accordionProps = {},
}: {
	rows: Row[];
	header: Column[];
	accordionProps?: AccordionProps;
}) => {
	return (
		<Accordion {...accordionProps} allowMultiple>
			{rows.map((row, index) => (
				<SheetAccordionItem key={index} row={row} header={header} />
			))}
		</Accordion>
	);
};
const SheetAccordionItem = ({ row, header }: { row: Row; header: Column[] }) => {
	const date = new Date(row.date);
	const title = `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
	return (
		<Box id={`sheetAccordionItem_${date.getTime()}`}>
			<AccordionItem>
				<h2>
					<AccordionButton>
						<Box as="span" flex="1" textAlign="left">
							{title}
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
		</Box>
	);
};

//#region utils function
/** 判斷日期是否在本週 */
const isDateInThisWeek = (date: Date) => {
	const today = new Date();
	/** 確認年份相同 */
	const isSameYear = getYear(today) === getYear(date);
	/** 獲取本週的第一天（星期一）和最後一天（星期日）*/
	const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
	const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });

	return isSameYear && isWithinInterval(date, { start: startOfThisWeek, end: endOfThisWeek });
};

//#endregion

export default SheetView;
