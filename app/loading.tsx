import { Loader2 } from 'lucide-react';
import React from 'react';

export default function Loading() {
	return (
		<div className="flex w-full min-h-svh justify-center items-center">
			<Loader2 className="animate-spin" />
		</div>
	);
};
