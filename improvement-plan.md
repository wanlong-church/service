# 萬隆服事表: data reliability improvement plan

Written 2026-10-28, from a full read of 2026年服事表 and 2027年服事表 (cell values and formulas) and of the app's data path.

**Goal.** Let the app tolerate format drift and data drift in the Google Sheet. When the sheet really is broken, the app should say what is wrong and where.

**Constraints.**

- Google Sheets stays the data source.
- No database, no separate backend, no new infrastructure.
- All code changes live in this Next.js app on App Engine, in its route handlers and client code. Sheet-side changes use only features built into Google Sheets.

---

## 1. How the data is wired today

### 1.1 The spreadsheet (same layout in both year files)

```
  hand-entered by different people
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
  │ 講台    │ │ 兒主    │ │ 禱告會  │ │ 愛宴    │
  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
      │  references by ROW NUMBER  (='講台'!B5)
      ▼          ▼          ▼          ▼
  ┌──────────────────────────────────────────┐
  │ Q1  Q2  Q3  Q4   (13 Sundays each)        │──► 計數  (COUNTIF per person per quarter)
  │ most roles typed here; 6 columns pulled   │
  │ from the side tabs above                  │
  └─────────────────────┬────────────────────┘
                        │ references by ROW NUMBER (='Q2'!C5)
                        │ VLOOKUP by date only in rows 42–54
                        ▼
                 ┌──────────────┐  ◄── side tabs are also
                 │ 總表  (A:V)   │      referenced directly,
                 └──────┬───────┘      by row number
                        ▼
      app: GET 總表!A:V (formatted values), both year files
```

| Tab    | Layout                                                                                                                                                                             | Who edits                                                                                                                                 | Formulas                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 講台   | Row 1 is the header `日期, 講員, 主題`. Rows 2–53 are 52 Sundays.                                                                                                                  | People                                                                                                                                    | 0                                  |
| 兒主   | Row 1 is the header `日期, （中小級）課程內容, （中小級）主理老師, （幼稚級）課程內容, （幼稚級）主理老師, 備註, 教師活動, 學生生日`. Rows 2–53 are Sundays; rows 55–58 are notes. | People                                                                                                                                    | 0                                  |
| 禱告會 | Header `日期, 主領, 特別主題`. Rows 2–53.                                                                                                                                          | People                                                                                                                                    | 0                                  |
| 愛宴   | Header `' ', 愛宴, 洗碗`. Rows 2–53 hold **only dates; no assignments in either year**.                                                                                            | People                                                                                                                                    | 0                                  |
| Q1–Q4  | Row 1 holds the 20 role headers. Rows 2–14 are 13 Sundays; row 16 is an editing note.                                                                                              | People type columns A, C–M, P, T. Columns B, N, O, Q, R, S are row-number references to 講台!B, 兒主!C, 兒主!E, 禱告會!B, 愛宴!B, 愛宴!C. | 78 each                            |
| 總表   | Row 1 is empty, row 2 is the header (22 columns), rows 3–54 are 52 Sundays.                                                                                                        | Nobody; every cell is a formula.                                                                                                          | 1,142 (2026), 1,144 (2027)         |
| 計數   | 26 names × Q1–Q4                                                                                                                                                                   | Formulas only                                                                                                                             | 99, all `=COUNTIF('Qn'!$C:$M,$A2)` |

Where each 總表 column comes from. Every entry is a row-number reference unless noted:

| 總表 col | Header                             | Source                                                                                    |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| A        | 日期                               | Qn!A                                                                                      |
| B–H      | 講員 … 吉他                        | Qn!B–H. Rows 42–54 (Q4) use `VLOOKUP($A,'Q4'!$A:$T,k,0)` instead.                         |
| I–L      | 貝士, 鼓, 投影片, 音控直播         | Qn!I–L. 音控直播 comes from the Q tabs' 音控 column; their 直播 column (M) is never used. |
| M        | 兒主中年級                         | 兒主!C (Q!N is bypassed)                                                                  |
| N        | 幼兒主理                           | 兒主!E                                                                                    |
| O        | 招待                               | Qn!P                                                                                      |
| P        | 禱告會                             | 禱告會!B                                                                                  |
| Q, R     | 愛筵, 洗碗                         | 愛宴!B, 愛宴!C                                                                            |
| S        | 特別日子                           | Qn!T                                                                                      |
| T        | 講台主題                           | 講台!C                                                                                    |
| U, V     | (中小級)聚會內容, (初小級)聚會內容 | 兒主!B, 兒主!D                                                                            |

**The core weakness.** 1,028 of the 1,142 formulas in 2026 總表, and every pulled column in Q1–Q4, find "the same Sunday" by row number, not by date. Inserting, deleting, sorting, or cut-and-pasting a row in a side tab shifts those references or breaks them. Nothing errors. The cell shows a believable name for the wrong week, or `#REF!`.

### 1.2 The app

- `app/api/google-sheet/utility.ts` reads `總表!A:V` from both files with `Promise.all`, using formatted values.
- It skips row 1 and takes row 2 as the header. The header comes **from the current-year file only** and is applied to the next-year rows too (`const [, , ...nextYearRestRows]` discards the next-year header).
- Columns are mapped by exact header text (`COLUMN_MAPPING_REVERSE[header]`). Headers it doesn't know are dropped without notice; 貝士 and 鼓 are deliberately unmapped.
- Rows whose `new Date(row.date)` is invalid are dropped without notice.
- `route.ts` turns every failure into `{ error: 'Failed to fetch Google Sheet data' }` with status 500. The specific zh-TW messages thrown in `utility.ts` never reach the browser.
- `useGoogleSheet.ts` sets `throwOnError: true`. A failed sync replaces the whole page with `app/error.tsx`, even when a good copy of the roster is cached in localStorage.
- `desktop.tsx` and `mobile.tsx` render cell values as-is, so `#REF!` shows up as though it were a person.
- `PersonalView` matches duties with `cell.includes(user)`. `user` is free text typed into the search dialog.

---

## 2. Failure modes and what the app does now

| #   | What someone does in the sheet                                                      | Result in 總表                             | What the app does now                                                                     |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| F1  | Inserts, deletes, moves, or sorts a row in 講台, 兒主, 禱告會, or 愛宴              | References shift and point at another week | Shows the wrong week's data, with no warning                                              |
| F2  | Deletes a cell or row that a formula references                                     | `#REF!`                                    | Shows "#REF!" in the table and on personal cards                                          |
| F3  | Retypes a 總表 header: full-width `（）`, a trailing space, or 愛宴 instead of 愛筵 | Nothing visible                            | That column disappears from the app                                                       |
| F4  | Inserts a row above the 總表 header                                                 | The header moves to row 3                  | No field maps, every row is filtered out, and the page is empty with no error             |
| F5  | Inserts a column in 總表                                                            | V moves to W                               | `A:V` cuts off the last column                                                            |
| F6  | Changes the 總表 date format, or types a date as text                               | —                                          | `new Date()` fails and the rows are dropped. If the format changed, every row is dropped. |
| F7  | Renames the 總表 tab, unshares a file, or deletes the next-year file                | API returns 400, 403, or 404               | Full-page generic error. A next-year problem also takes down the current year.            |
| F8  | Next-year file has a different column order                                         | —                                          | Next-year values land under the wrong roles                                               |
| F9  | Types a short name (基立) instead of the full name (張基立)                         | —                                          | The personal view for 張基立 misses that duty                                             |

---

## 3. What is broken in the live sheets (2026-10-28)

I found these by reading both files in `FORMULA` mode and checking that every cross-tab reference points at a row with the same date as the row it sits in.

### 2026年服事表 (current year, served by the app)

| Cell         | Week, field            | Formula                             | Shows                                                    | Fix                          |
| ------------ | ---------------------- | ----------------------------------- | -------------------------------------------------------- | ---------------------------- |
| 總表!M51     | 12/6 兒主中年級        | `='兒主'!C53`                       | 聲蕙, the **12/27** teacher                              | `='兒主'!C50` (empty today)  |
| 總表!M54     | 12/27 兒主中年級       | `=#REF!`                            | **"#REF!" in the app**                                   | `='兒主'!C53` → 聲蕙         |
| 總表!P54     | 12/27 禱告會           | `='Q4'!Q15`, the row below the data | blank                                                    | `='禱告會'!B53` → 暫停       |
| 總表!I54:J54 | 12/27 貝士, 鼓         | no formula                          | nothing (the app doesn't map these columns)              | `='Q4'!I14`, `='Q4'!J14`     |
| 總表!U16:V17 | 4/5 and 4/12 聚會內容  | `='兒主'!B16` and so on             | the **following week's** lesson                          | `B15`/`D15`, `B16`/`D16`     |
| 總表!U18:V18 | 4/19 聚會內容          | `=#REF!`                            | "#REF!"                                                  | `='兒主'!B17`, `='兒主'!D17` |
| Q4!N5:N8     | 10/25–11/15 兒主中年級 | `='兒主'!C45` … `C48`               | next week's teacher. 10/25 shows 聲蕙; 兒主 says 石孟軒. | `C44` … `C47`                |
| Q4!N11       | 12/6 兒主中年級        | `='兒主'!C53`                       | 聲蕙                                                     | `C50`                        |

Q4!N is visible only in the Q4 tab, because 總表 reads 兒主 directly for that column. The U16:V18 pattern fits a row being inserted into 兒主 after 總表 was built. That row is 4/5 復活節主日, 兒主 row 15: references below it shifted down one, and the ones to the 4/19 row broke.

### 2027年服事表 (next year)

- It inherited the 總表!U16:V17 shift and the U18:V18 `#REF!` from the 2026 file. Nothing shows yet because 2027 兒主 is empty, but the wrong lessons will appear once it's filled in. The fix is the same as for 2026, because 2027's 兒主 rows line up: `B15/D15` through `B17/D17`.
- None of the late-2026 breakages are present, so the file was copied before those edits.
- It is mostly unfilled. Each Q tab has only 6 hand-typed role cells: 領會 and 擘餅 for weeks 1, 6, and 10. 兒主 and 愛宴 are empty, and 計數 is all zeros. 講台 (100 cells) and 禱告會 (68 cells) already hold new 2027 content.

### Name drift (2026)

The 兒主中年級 and 幼兒主理 cells use given names only: 基立 ×13, 聲蕙 ×13, 琬琪 ×14, 盈慧 ×14, 恩寧 ×4. 計數 and every other column use full names: 張基立, 廖聲蕙, 林琬琪, 侯盈慧, 彭恩寧. Anyone who searches their full name doesn't see their Sunday-school duties.

---

## 4. The plan, easiest first

Each numbered item can ship as its own PR (Conventional Commit type in brackets).

### Tier 0: sheet-side fixes and guard rails (no code, about 1 hour, needs edit access)

#### 0.1 Fix the cells in §3, in both files

This fixes the two December 2026 entries that are wrong now: 12/6 shows the wrong teacher, and 12/27 shows "#REF!".

#### 0.2 Protect the structure the app depends on

Use Data → Protect sheets and ranges:

- **總表, whole tab.** Restrict it to maintainers, or choose "Show a warning" to keep it open. 總表 is 100% formulas, so nobody needs to type into it.
- **Header rows.** Rows 1–2 of 總表, and row 1 of Q1–Q4, 講台, 兒主, 禱告會, and 愛宴.
- **Column A (dates)** in every tab.

#### 0.3 Data validation on name columns

Add a dropdown sourced from `計數!A2:A27` (the roster) on Q-tab columns C–M and 兒主 columns C and E. Use "Show warning", not "Reject input", so new people can still be entered. This stops short-name drift when the name is typed.

### Tier 1: low-hanging code fixes (each half a day or less)

#### 1.1 Keep showing cached data when a sync fails [fix]

In `app/service/_hooks/useGoogleSheet.ts`, change `throwOnError: true` to `throwOnError: (_error, query) => query.state.data === undefined`. A failed sync then shows the existing error toast and keeps the last good roster on screen. The full-page error appears only when nothing is cached.

To verify: load the app once, point `MAIN_SPREAD_SHEET_ID` at a bad ID locally, then press sync.

#### 1.2 Specific, actionable error messages [fix]

`route.ts` should stop replacing every error with a generic string. Classify the error in `utility.ts` and return `{ error, errorCode, sheet: 'current' | 'next' }`:

| Cause                                   | `errorCode`       | Message                                                                            |
| --------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| Missing env vars (already thrown today) | `CONFIG_MISSING`  | the existing 缺少必要的 Google Sheets API 環境變數…                                |
| Google 403                              | `SHEET_FORBIDDEN` | 服務帳號沒有讀取「{年}年服事表」的權限，請確認試算表已分享給 {GOOGLE_CLIENT_EMAIL} |
| Google 404                              | `SHEET_NOT_FOUND` | 找不到「{年}年服事表」，請確認 .env 的試算表 ID                                    |
| 400 `Unable to parse range`             | `TAB_NOT_FOUND`   | 找不到「總表」分頁，可能被改名或刪除                                               |
| 429                                     | `QUOTA`           | Google API 使用量已達上限，請稍後再試                                              |
| No header or zero valid rows (see 1.6)  | `NO_VALID_ROWS`   | 「總表」找不到表頭或任何有效日期，請確認第 2 列為表頭、A 欄為日期                  |

- On the server, call `Sentry.captureException` with `errorCode` as a tag so alerts group by cause. Server Sentry is already wired up in `instrumentation.ts`.
- `error.tsx` already displays `error.message`, so this needs no UI change.
- In `app/api/client.ts`, check `response.ok` before `response.json()`. An App Engine HTML error page currently surfaces as a JSON `SyntaxError`; map that case to 伺服器暫時無法回應，請稍後再試.
- `GOOGLE_CLIENT_EMAIL` is already committed in `.env`, so it's fine to show it.

#### 1.3 A next-year failure doesn't take down the current year [fix]

Switch from `Promise.all` to `Promise.allSettled`. If only the next-year fetch fails, return the current-year data plus a warning, which 2.2 surfaces; until then, log it and send it to Sentry. The next-year file is the one under construction, so it is the one most likely to break.

#### 1.4 Map each file with its own header row [fix]

Parse each file with its own row-2 header instead of reusing the current year's. This removes F8 entirely.

#### 1.5 Widen the read range [fix]

Change `SHEET_RANGE` from `總表!A:V` to `總表!A:Z`. Columns are mapped by header, so extra columns are ignored at no cost, and empty cells aren't returned. An inserted column then no longer cuts off `(初小級)聚會內容` (F5).

#### 1.6 Find the header by content, and fail loudly on empty results [fix]

- Scan the first 5 rows for the one that contains `日期`, instead of assuming row 2 (F4).
- If no header is found, or no rows survive the date filter, throw `NO_VALID_ROWS` instead of rendering an empty page.
- Count the rows dropped for bad dates and report them as issues (see 1.8 and 2.2).

#### 1.7 Tolerant header matching [fix]

- Normalize both sides before lookup with `s.normalize('NFKC').replace(/\s+/g, '')`. NFKC turns full-width `（）` into `()` and full-width digits into ASCII, and the replace drops stray spaces.
- Add a small alias list in `app/const.ts` for spellings that already coexist in the files: 愛筵 and 愛宴 (the tab is 愛宴, the header is 愛筵), and 音控直播 and 音控.
- Send a Sentry warning when an expected field is missing from the header, instead of dropping it without notice (F3).

#### 1.8 Treat spreadsheet error values as empty, and record them [fix]

In the row mapper, replace any value matching `/^#(REF!|N\/A|VALUE!|DIV\/0!|NAME\?|NUM!|ERROR!|NULL!)/` with `''`. Push `{ year, date, field, cell: '總表!M54', value: '#REF!' }` to an `issues` array. After this, the 12/27 "#REF!" no longer appears as a person (F2). The issues are shown to users in 2.2.

#### 1.9 Clear the persisted cache on deploy [fix]

- In `providers/query-client-provider.tsx`, set `persistOptions.buster` to the app version, exposed at build time as a `NEXT_PUBLIC_` variable. Do this before 2.2 changes the response shape. Otherwise a client can keep a 7-day-old cached payload in the old shape.
- Also fix `QUERY_KEY`. It embeds `process.env.MAIN_SPREAD_SHEET_ID`, which is undefined in the browser bundle. Either expose the ID as `NEXT_PUBLIC_` (it's committed in `.env` and isn't secret) or drop it from the key and rely on the buster.

### Tier 2: moderate (1–3 days each)

#### 2.1 Extract the parser and add fixture tests [test, refactor]

Do this before, or together with, 1.6–1.8.

- Move parsing into a pure function, for example `parseRosterSheet(values, { year }) → { rows, issues }` in `app/api/google-sheet/parse.ts`.
- Add vitest as a dev dependency. Use fixtures dumped from the real sheets (commands in Appendix A) plus mutated copies:
  - the header moved to row 3
  - a full-width header
  - an inserted column
  - `#REF!` and `#N/A` cells
  - a date typed as text
  - a next-year file with a different column order
  - an empty next-year file
- Add `npm test` to `ci.yaml`.

There is no test suite today. This is the safety net for every parser change in this plan.

#### 2.2 Show data issues to users and to maintainers [feat]

- The response becomes `{ data, issues, warnings }`, carrying the issues from 1.6 and 1.8 and the warning from 1.3.
- **UI.** Add a banner above the month accordion that can be dismissed: 表單有 N 個儲存格需要修正. It expands into a list of date · role · cell · problem. Each item links to the exact cell: `https://docs.google.com/spreadsheets/d/<id>/edit#gid=<sheetId>&range=M54`. The `sheetId` comes from one `spreadsheets.get` call with `fields=sheets.properties(sheetId,title)`. In the table, mark the affected cell with ⚠ instead of leaving it blank.
- **Maintainers.** Call Sentry `captureMessage` at warning level, fingerprinted by file and cell. Existing Sentry alerting then tells the maintainers without anyone opening the app, and the fingerprint keeps repeat fetches in one event group.

#### 2.3 Date parsing that ignores the display format [fix]

- Request `valueRenderOption: 'UNFORMATTED_VALUE'` with `dateTimeRenderOption: 'SERIAL_NUMBER'`. Real date cells then come back as serial numbers. Every date in both files is a real date cell today; for example, 兒主!A14 is `46110`.
- On the server, convert the serial to `yyyy-MM-dd` (epoch 1899-12-30). When a cell holds text instead, fall back to date-fns `parse` with `M/d/yyyy`, `M月d日`, and `yyyy/M/d`, taking the year from the file (F6).
- On the client, parse with `parseISO`, which uses local time; `new Date('2026-01-04')` is UTC midnight.
- Coerce every value with `String()`, because unformatted mode returns numbers for numeric cells.
- Add issues for dates that aren't Sundays, for duplicate dates, and for gaps in the 52-week sequence.

#### 2.4 Name matching that tolerates short names [fix]

- Split each cell on `[，,、/／&＆+＋\s]` and compare tokens exactly instead of using `includes`.
- Resolve the searched name to a roster name. The roster is 計數 column A, plus the 3-character names seen in the data.
- A 2-character token counts as that person when exactly one roster name ends with it. If two roster names end with it, record an issue instead of guessing.

This fixes the missing 兒主 duties for 張基立, 廖聲蕙, 林琬琪, 侯盈慧, and 彭恩寧 (F9). It also removes accidental substring matches, which would go wrong once two people share a given name.

#### 2.5 Sheet health-check page [feat]

Add `/service/health`, a route handler plus a page, read-only, using the same service account. It reads both files with one `batchGet` in `FORMULA` mode and one in `FORMATTED_VALUE` mode, about 80 KB each, and checks:

- all 10 tabs exist, and each source tab and 總表 has its expected headers;
- **every cross-tab reference in 總表 and Q1–Q4 points at a row with the same date.** This is the check that found every item in §3. Checking values alone can't catch a believable name for the wrong week.
- `#REF!` and `#N/A` cells, and cells in 總表 data rows that should hold a formula but are empty;
- 52 consecutive Sundays per file, and next-year headers identical to the current year's;
- names that aren't in the roster.

It shows a zh-TW checklist with links to each cell.

- Link the page from `error.tsx` and from the 2.2 banner.
- Add "open /service/health for the next-year file" to the README's year-rollover steps. Running that check would have caught the 2027 file inheriting 2026's broken references.

### Tier 3: fix the root cause (several days)

Row-number references are what make F1 and F2 possible. There are two ways to remove them.

#### 3.1 Option A, sheet-side: key 總表 by date [no code]

Rebuild 總表 with lookups by date. The sheet already does this in rows 42–54. For example:

```
=IFNA(VLOOKUP($A16,'兒主'!$A:$E,2,FALSE),"")
```

Ideally, write one `ARRAYFORMULA` per column, which leaves about 22 formulas instead of about 1,100. Use `IFNA` rather than `IFERROR`, so a real `#REF!` stays visible to 1.8 and 2.5. Do the same for the six pulled columns in Q1–Q4.

This is cheaper than option B and needs no app change. But the fix lives in the sheet, where it can be broken again, so pair it with the protection in 0.2.

#### 3.2 Option B, app-side: read the source tabs and join by date [feat]

Stop reading 總表. Instead, `batchGet` Q1–Q4, 講台, 兒主, 禱告會, and 愛宴 in one call, map each tab by its own headers, and join on the date serial. Inserting a row in 兒主 then changes nothing for the app.

- **Source map.** Add a declarative map in `app/const.ts` from each field to a (tab, header) pair:
  - speaker → 講台 / 講員, and sermonScope → 講台 / 主題
  - sundaySchool1 → 兒主 / （中小級）主理老師, and sundaySchool1Topic → 兒主 / （中小級）課程內容
  - prayer → 禱告會 / 主領
  - meal → 愛宴 / 愛宴
  - worshipLeader through greeter, and specialDay → Q1–Q4, by header
- **Decide with the sheet owners first:**
  - where the Q tabs and the side tabs disagree, which one wins (for example Q4!N versus 兒主!C);
  - whether 音控直播 should become separate 音控 and 直播 fields. The Q tabs keep them separate; 總表 drops 直播.
- **Roll out in two steps:**
  1. Shadow mode. Keep serving 總表, compute the joined result alongside it, and report every disagreement as an issue. This is a cheap cross-check that catches wrong-week references from values alone.
  2. Once the disagreements stay at zero for a few weeks, serve the joined result. Keep 總表 as the view people read, and as a fallback if a source tab fails.
- **Prerequisite:** the tests from 2.1.

---

## 5. Recommended order

| Step | Items                        | Why                                                                                         |
| ---- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| 1    | 0.1, 0.2                     | Fixes the upcoming 12/6 and 12/27 entries today, and blocks the most common way 總表 breaks |
| 2    | 1.1, 1.2, 1.3, 1.4, 1.5      | Small and independent. None of them changes how rows are parsed except 1.4.                 |
| 3    | 2.1, then 1.6, 1.7, 1.8, 1.9 | Tests are in place before parsing changes                                                   |
| 4    | 2.2, 2.3, 2.4                | Problems become visible to users and maintainers; date and name drift are tolerated         |
| 5    | 2.5, 0.3                     | Catches wrong-week data that no value-based check can                                       |
| 6    | 3.1 or 3.2                   | Removes the root cause                                                                      |

## 6. Constraints check

- Nothing here adds a database, cache server, queue, cron job, or separate backend. Everything is Next.js route handlers and client code, the Sentry setup that already exists, and features built into Google Sheets (protection, data validation, lookup formulas).
- API cost stays small. 2.5 and 3.2 each add about one `batchGet` per request, comparable to today's two `values.get` calls, and empty cells aren't returned.

---

## Appendix A: extraction results (gws 0.22.5, 2026-10-28)

All four success checks passed:

1. Both files return the 10 tabs `Q1, Q2, Q3, Q4, 愛宴, 總表, 兒主, 講台, 禱告會, 計數`, in that order.
2. 2026 `總表!A3:H3` with formatted values is `1/4/2026, 李耕心, 張基立, 郭安哲，周思聰, 曾彥勳, 謝得人, 孫珮琪, 陳靜怡`.
3. The same range as formulas is `='Q1'!A2 … ='Q1'!H2`.
4. `計數!B2` as a formula is `=COUNTIF('Q1'!$C:$M,$A2)`.

| Tab       | Rows        | 2026 non-empty / formulas | 2027 non-empty / formulas |
| --------- | ----------- | ------------------------- | ------------------------- |
| Q1        | 16          | 205 / 78                  | 118 / 78                  |
| Q2        | 16          | 204 / 78                  | 118 / 78                  |
| Q3        | 16          | 205 / 78                  | 118 / 78                  |
| Q4        | 16          | 207 / 78                  | 118 / 78                  |
| 愛宴      | 53          | 55 / 0                    | 55 / 0                    |
| 總表      | 54 (A1:V54) | 1,164 / 1,142             | 1,166 / 1,144             |
| 兒主      | 58          | 302 / 0                   | 64 / 0                    |
| 講台      | 53          | 158 / 0                   | 155 / 0                   |
| 禱告會    | 53          | 123 / 0                   | 123 / 0                   |
| 計數      | 27          | 129 / 99                  | 129 / 99                  |
| **Total** |             | **2,752 / 1,553**         | **2,164 / 1,555**         |

- **Functions.** Each file has `VLOOKUP` in 111 cells and `COUNTIF` in 99. The other formulas are plain cross-sheet references.
- **`#REF!` cells.** 2026 has 總表!U18, V18, and M54. 2027 has 總表!U18 and V18. They are in role and topic columns, not the date column, so the app does **not** drop those rows; it renders "#REF!".
- **Formula differences between the files.** There are 10, all of them the 2026 breakages in §3: Q4!N5:N8 and N11, and 總表!M51, I54, J54, M54, P54.
- **Corrections to the assumed ground truth:**
  - Q1–Q4 are not purely hand-entered. Six of their columns are formulas pulling from the side tabs.
  - 總表's `VLOOKUP`s are only in rows 42–54. Everything else is a row-number reference.

To re-dump either file:

```bash
RANGES='["Q1!A:Z","Q2!A:Z","Q3!A:Z","Q4!A:Z","愛宴!A:Z","總表!A:Z","兒主!A:Z","講台!A:Z","禱告會!A:Z","計數!A:Z"]'
SHEET=1F8NSEpo2w9TSQMVRrB4mij69wqluljL3Z8jpBaWIsaU   # 2026; 2027 is 1GSO9q707zconbWaRdQrc6pvWgGDpWlx4jGZhjgw9nxM
for MODE in FORMULA FORMATTED_VALUE; do
  gws sheets spreadsheets values batchGet --params \
    "{\"spreadsheetId\":\"$SHEET\",\"ranges\":$RANGES,\"valueRenderOption\":\"$MODE\"}" > "sheet-$MODE.json"
done
```
