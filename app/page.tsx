import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Page() {
	return (
		<div className="flex flex-col justify-center bg-whitesmoke h-screen w-screen">
			<div className="mb-3">
				<div className="flex flex-col items-center">
					<div className="text-xl">歡迎來到</div>
					<div className="text-3xl">萬隆基督的教會</div>
					<div className="text-xl">服事表</div>
				</div>
			</div>
			<div>
				<div className="flex flex-col items-center">
					<Link href="/dashboard">
						<Button>進入服事表</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
