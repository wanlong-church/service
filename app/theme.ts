import { mode } from '@chakra-ui/theme-tools';

export const theme = {
	styles: {
		global: {
			':root': {
				'--vh': '1vh',
			},
			'html, body': {
				color: 'gray.600',
				lineHeight: 'tall',
			},
			a: {
				color: 'teal.500',
			},
		},
	},
};
