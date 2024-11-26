import { ServiceLink, ServiceTime, ServiceType, SheetField } from './type'

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
  'sundaySchool1',
  'sundaySchool2',
  'greeter',
  'prayer',
  'meal',
  'dishWashing',
] as const

export const SHEET_FIELDS = [
  'date',
  ...SERVICE_TYPES,
  'specialDay',
  'sermonScope',
  'sundaySchool1Topic',
  'sundaySchool2Topic',
] as const

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
  sundaySchool1: '兒主中年級',
  sundaySchool2: '幼兒主理',
  greeter: '招待',
  prayer: '禱告會',
  meal: '愛筵',
  dishWashing: '洗碗',
  specialDay: '特別日子',
  sermonScope: '講台主題',
  sundaySchool1Topic: '(中小級)聚會內容',
  sundaySchool2Topic: '(初小級)聚會內容',
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

/** 服事相關資料 */
const ATTEND_PRAYER = '提早到場，參加 9：50 分會前禱告'
const SUNDAY_SCHOOL = '與孩童一起在大堂敬拜後，再一同前往兒童主日學'
const COME_EARLY = '提早到場，9：30 以前需要抵達'

type ServiceMeta = {
  notes: string[]
  time: ServiceTime
  links?: ServiceLink[]
}

export const SERVICE_META: Record<ServiceType, ServiceMeta> = {
  speaker: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  worshipLeader: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  communion: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  pianist: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  choir1: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  choir2: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  guitar: {
    notes: [ATTEND_PRAYER],
    time: { start: '09:50', end: '11:30' },
  },
  slides: {
    notes: [`${COME_EARLY}，確認投影片內容`, ATTEND_PRAYER],
    time: { start: '09:30', end: '11:30' },
    links: [
      {
        text: '投影片操作手冊',
        url: 'https://schwannden.notion.site/fd061f29878e404b8681c1c52ed2e037',
      },
    ],
  },
  soundControl: {
    notes: [`${COME_EARLY}，架設音控直播器材`, ATTEND_PRAYER],
    time: { start: '09:30', end: '11:30' },
    links: [
      {
        text: '音控直播器材操作手冊',
        url: 'https://schwannden.notion.site/909928135b0542ebbd7c840d4b6a5b34',
      },
    ],
  },
  sundaySchool1: {
    notes: [SUNDAY_SCHOOL],
    time: { start: '09:50', end: '11:30' },
  },
  sundaySchool2: {
    notes: [SUNDAY_SCHOOL],
    time: { start: '09:50', end: '11:30' },
  },
  greeter: {
    notes: ['提早到場，接待教會會友'],
    time: { start: '09:40', end: '11:30' },
  },
  prayer: {
    notes: ['週五晚上 7：30 禱告會開始，列印程序單16份，準備同樣份數的詩歌本或者譜'],
    time: { start: '19:20', end: '20:30' },
  },
  meal: {
    notes: ['講道於 11:10~11:30 結束，愛宴準備須在 11:30 之前完成'],
    time: { start: '09:00', end: '11:30' },
  },
  dishWashing: {
    notes: ['愛宴結束後，等待弟兄姊妹洗完各自的碗，洗鍋子以及清潔廚房'],
    time: { start: '12:30', end: '13:30' },
  },
}

//#region React Query 相關變數
export const QUERY_KEY = {
  /** The key for useGoogleSheet, ensures that data is invalidated when the sheet is updated */
  GOOGLE_SHEET: `GOOGLE_SHEET_${process.env.MAIN_SPREAD_SHEET_ID}`,
  /** The key for useGoogleSheetUrl, ensures that data is invalidated when the sheet is updated */
  GOOGLE_SHEET_URL: `GOOGLE_SHEET_URL_${process.env.MAIN_SPREAD_SHEET_ID}`,
} as const
//#endregion
