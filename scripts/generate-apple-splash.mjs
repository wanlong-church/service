// Generates Apple PWA splash screens (apple-touch-startup-image) from the app
// icon, composited centered on the manifest background color. Run with:
//   node scripts/generate-apple-splash.mjs
// Output: public/splash/*.png  +  prints the <link> tags for layout.tsx.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'public/ios/1024.png')
const OUT_DIR = join(root, 'public/splash')
const BG = '#FFFFFF' // matches manifest background_color / theme_color

// [cssWidth, cssHeight, devicePixelRatio] — portrait, deduped across devices.
const DEVICES = [
  [320, 568, 2],
  [375, 667, 2],
  [375, 812, 3],
  [390, 844, 3],
  [393, 852, 3],
  [414, 736, 3],
  [414, 896, 2],
  [414, 896, 3],
  [428, 926, 3],
  [430, 932, 3],
  [768, 1024, 2],
  [810, 1080, 2],
  [820, 1180, 2],
  [834, 1112, 2],
  [834, 1194, 2],
  [1024, 1366, 2],
]

mkdirSync(OUT_DIR, { recursive: true })

const links = []
for (const [w, h, dpr] of DEVICES) {
  const pw = w * dpr
  const ph = h * dpr
  const logo = Math.round(Math.min(pw, ph) * 0.4)
  const file = `apple-splash-${pw}-${ph}.png`

  const resized = await sharp(SRC).resize(logo, logo, { fit: 'contain' }).png().toBuffer()
  await sharp({
    create: { width: pw, height: ph, channels: 4, background: BG },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(join(OUT_DIR, file))

  links.push(
    `<link rel="apple-touch-startup-image" media="screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)" href="/splash/${file}" />`
  )
}

console.log(links.join('\n'))
console.error(`\nGenerated ${DEVICES.length} splash images in public/splash/`)
