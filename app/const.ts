import { ServiceTime, ServiceType, SheetField } from './type'

/** 服事總表表頭順序 */
export const SERVICE_TYPES = [
  'speaker',
  'worshipLeader',
  'communion',
  'pianist',
  'choir1',
  'choir2',
  'guitar',
  'slides',
  'soundControl',
  'youthLeaderMiddleGrade',
  'nurseryCoordinator',
  'greeter',
  'prayer',
  'meal',
  'dishWashing',
] as const

export const SHEET_FIELDS = ['date', ...SERVICE_TYPES, 'specialDay'] as const

export const COLUMN_MAPPING: Record<SheetField, string> = {
  date: '日期',
  speaker: '講員',
  worshipLeader: '領會',
  communion: '擘餅',
  pianist: '司琴',
  choir1: '合音1',
  choir2: '合音2',
  guitar: '吉他',
  slides: '投影片',
  soundControl: '音控直播',
  youthLeaderMiddleGrade: '兒主中年級',
  nurseryCoordinator: '幼兒主理',
  greeter: '接待',
  prayer: '禱告會',
  meal: '愛筵',
  dishWashing: '洗碗',
  specialDay: '特別日子',
}

export const COLUMN_MAPPING_REVERSE: Record<string, SheetField> = Object.entries(
  COLUMN_MAPPING
).reduce(
  (acc, [key, value]) => {
    acc[value] = key as SheetField
    return acc
  },
  {} as Record<string, SheetField>
)

/** 服事注意事項 */
const ATTEND_PRAYER = '提早到場，參加 9：50 分會前禱告'
const SUNDAY_SCHOOL = '與孩童一起在大堂敬拜後，再一同前往兒童主日學'
const COME_EARLY = '提早到場，9：30 以前需要抵達'

export const SERVICE_NOTES: Record<ServiceType, string[]> = {
  speaker: [ATTEND_PRAYER],
  worshipLeader: [ATTEND_PRAYER],
  communion: [ATTEND_PRAYER],
  pianist: [ATTEND_PRAYER],
  choir1: [ATTEND_PRAYER],
  choir2: [ATTEND_PRAYER],
  guitar: [ATTEND_PRAYER],
  slides: [`${COME_EARLY}，確認投影片內容`, ATTEND_PRAYER],
  soundControl: [`${COME_EARLY}，架設音控直播器材`, ATTEND_PRAYER],
  youthLeaderMiddleGrade: [SUNDAY_SCHOOL],
  nurseryCoordinator: [SUNDAY_SCHOOL],
  greeter: ['提早到場，接待教會會友'],
  prayer: ['週五晚上 7：00 禱告會開始，列印程序單16份，準備同樣份數的詩歌本或者譜'],
  meal: ['講道於 11:10~11:30 結束，愛宴準備須在 11:30 之前完成'],
  dishWashing: ['愛宴結束後，等待弟兄姊妹洗完各自的碗，洗鍋子以及清潔廚房'],
}

export const SERVICE_TIME: Record<ServiceType, ServiceTime> = {
  // from 9:50 to 11:30
  speaker: { start: '09:50', end: '11:30' },
  worshipLeader: { start: '09:50', end: '11:30' },
  communion: { start: '09:50', end: '11:30' },
  pianist: { start: '09:50', end: '11:30' },
  choir1: { start: '09:50', end: '11:30' },
  choir2: { start: '09:50', end: '11:30' },
  guitar: { start: '09:50', end: '11:30' },
  slides: { start: '09:30', end: '11:30' },
  soundControl: { start: '09:30', end: '11:30' },
  youthLeaderMiddleGrade: { start: '09:50', end: '11:30' },
  nurseryCoordinator: { start: '09:50', end: '11:30' },
  greeter: { start: '09:40', end: '11:30' },
  prayer: { start: '18:50', end: '20:30' },
  meal: { start: '09:00', end: '11:30' },
  dishWashing: { start: '12:30', end: '13:30' },
}
