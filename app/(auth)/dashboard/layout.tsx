import { Box } from '@chakra-ui/react';
import React from 'react';

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Box>
			<Box>DashboardLayout</Box>
			{children}
		</Box>
	);
};

export default DashboardLayout;
