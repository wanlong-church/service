import { describe, expect, it, vi } from 'vitest'

// QUERY_KEY reads process.env at module load, so each key needs a fresh module
const loadQueryKey = async () => (await import('./const')).QUERY_KEY

describe('QUERY_KEY', () => {
  it('differs per spreadsheet, so a year rollover invalidates the cache', async () => {
    vi.stubEnv('NEXT_PUBLIC_MAIN_SPREAD_SHEET_ID', 'sheet-2026')
    const current = await loadQueryKey()
    expect(current.GOOGLE_SHEET).toBe('GOOGLE_SHEET_sheet-2026')
    expect(current.GOOGLE_SHEET_URL).toBe('GOOGLE_SHEET_URL_sheet-2026')

    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_MAIN_SPREAD_SHEET_ID', 'sheet-2027')
    const next = await loadQueryKey()
    expect(next.GOOGLE_SHEET).toBe('GOOGLE_SHEET_sheet-2027')
    expect(next.GOOGLE_SHEET_URL).toBe('GOOGLE_SHEET_URL_sheet-2027')
    expect(next.GOOGLE_SHEET).not.toBe(current.GOOGLE_SHEET)
    expect(next.GOOGLE_SHEET_URL).not.toBe(current.GOOGLE_SHEET_URL)
  })
})
