'use client';

import React from 'react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { BsArrowDownCircleFill } from 'react-icons/bs';

const icons = [1, 2, 3];
const NavIcons = ({ gutter }: { gutter?: number }) => {
	return (
		<>
			{icons.map((icon, id) => (
				<Icon key={icon} as={BsArrowDownCircleFill} mx={gutter ? gutter / 2 : 0} />
			))}
		</>
	);
};

export default NavIcons;
