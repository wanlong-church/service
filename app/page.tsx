import { Box, Flex, Button, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Page() {
	return (
		<Flex
			as="main"
			flexDir="column"
			justifyContent="center"
			bgColor="whitesmoke"
			h={`calc(var(--vh) * 100)`}
			w="100vw"
		>
			<Box mb="30">
				<Flex flexDir="column" alignItems="center">
					{/* TODO: 這裏要用動畫== 絕對要 */}
					<Text fontSize="20">歡迎來到</Text>
					<Text fontSize="32">萬隆基督的教會</Text>
					<Text fontSize="20">服事表</Text>
				</Flex>
			</Box>
			<Box>
				<Flex flexDir="column" alignItems="center">
					<Button as={Link} href="/dashboard" colorScheme="blue">
						進入服事表
					</Button>
				</Flex>
			</Box>
		</Flex>
	);
}
