import { SHEET_TAB } from '@/app/const'
import { GoogleSheetYear, SheetErrorCode } from '@/app/type'

export const SHEET_LABEL: Record<GoogleSheetYear, string> = {
  current: '今年度服事表',
  next: '下年度服事表',
}

const SHEET_ID_ENV: Record<GoogleSheetYear, string> = {
  current: 'MAIN_SPREAD_SHEET_ID',
  next: 'NEXT_YEAR_SPREAD_SHEET_ID',
}

/** OAuth token endpoint errors that mean the service account credentials are wrong */
const OAUTH_ERRORS = new Set(['invalid_grant', 'invalid_client', 'unauthorized_client'])

/** Node network error codes for a Google endpoint that cannot be reached */
const NETWORK_ERROR_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNREFUSED',
])

/** The fields of a GaxiosError (thrown by googleapis) that classification needs */
type GoogleApiErrorLike = {
  status?: number
  code?: string | number
  message?: string
  response?: { status?: number; data?: { error?: unknown } }
}

/**
 * An error from reading a Google Sheet. `message` is zh-TW text that can be shown to users as is.
 */
export class SheetError extends Error {
  readonly code: SheetErrorCode
  readonly sheet?: GoogleSheetYear

  constructor(code: SheetErrorCode, message: string, sheet?: GoogleSheetYear, cause?: unknown) {
    super(message, { cause })
    this.name = 'SheetError'
    this.code = code
    this.sheet = sheet
  }
}

export function toSheetError(error: unknown, sheet?: GoogleSheetYear): SheetError {
  if (error instanceof SheetError) return error

  const { status, code, message, response } = (error ?? {}) as GoogleApiErrorLike
  const httpStatus = status ?? response?.status
  const oauthError = response?.data?.error
  const originalMessage = message ?? String(error)
  const label = sheet ? SHEET_LABEL[sheet] : 'Google Sheet'
  const fail = (errorCode: SheetErrorCode, text: string) =>
    new SheetError(errorCode, text, sheet, error)

  if (
    httpStatus === 401 ||
    (typeof oauthError === 'string' && OAUTH_ERRORS.has(oauthError)) ||
    // Node crypto rejects a malformed GOOGLE_PRIVATE_KEY with ERR_OSSL_* codes
    String(code).startsWith('ERR_OSSL')
  ) {
    return fail(
      'AUTH_FAILED',
      '服務帳號驗證失敗，請確認 GOOGLE_CLIENT_EMAIL 與 GOOGLE_PRIVATE_KEY 是否正確'
    )
  }
  if (httpStatus === 403) {
    return fail(
      'SHEET_FORBIDDEN',
      `服務帳號沒有讀取${label}的權限，請將試算表分享給 ${process.env.GOOGLE_CLIENT_EMAIL}（檢視者即可）`
    )
  }
  if (httpStatus === 404) {
    return fail(
      'SHEET_NOT_FOUND',
      `找不到${label}，請確認 ${sheet ? SHEET_ID_ENV[sheet] : '試算表 ID'} 是否正確`
    )
  }
  if (httpStatus === 400 && originalMessage.startsWith('Unable to parse range')) {
    return fail('TAB_NOT_FOUND', `${label}中找不到「${SHEET_TAB}」分頁，可能被改名或刪除`)
  }
  if (httpStatus === 429) {
    return fail('QUOTA', 'Google Sheets 讀取次數已達上限，請稍後再試')
  }
  if ((httpStatus !== undefined && httpStatus >= 500) || NETWORK_ERROR_CODES.has(String(code))) {
    return fail('GOOGLE_UNAVAILABLE', '暫時無法連線到 Google Sheets，請稍後再試')
  }
  return fail('UNKNOWN', `讀取${label}時發生未預期的錯誤：${originalMessage}`)
}
