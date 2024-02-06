/** google sheet 總表欄位 */
export type SheetField = {
	date: string;
	speaker: string;
	facilitator: string;
	communion: string;
	pianist: string;
	choir1: string;
	choir2: string;
	guitar: string;
	bass: string;
	drums: string;
	slides: string;
	soundControl: string;
	liveStream: string;
	youthLeaderMiddleGrade: string;
	nurseryCoordinator: string;
	nurseryAssistant: string;
	greeter: string;
	prayerMeeting: string;
	potluck: string;
	dishWashing: string;
	specialDay: string;
};
export type SheetFieldKey = keyof SheetField;
