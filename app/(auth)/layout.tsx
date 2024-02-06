import { Box } from '@chakra-ui/react';
import React from 'react';

/** TODO: 撰寫非登入狀態進入時，返回登入頁 */
const AuthLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Box>
			<Box>AuthLayout</Box>
			{children}
		</Box>
	);
};

export default AuthLayout;
