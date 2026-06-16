// Apple PWA launch images (apple-touch-startup-image). The Next.js Metadata API
// has no first-class field for these, so we render the <link> tags directly —
// Next hoists them into <head>. Regenerate the referenced PNGs with
// `node scripts/generate-apple-splash.mjs` (keep this list in sync with it).

// [cssWidth, cssHeight, devicePixelRatio]
const DEVICES: [number, number, number][] = [
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

export default function AppleSplashScreens() {
  return (
    <>
      {DEVICES.map(([w, h, dpr]) => (
        <link
          key={`${w}-${h}-${dpr}`}
          rel="apple-touch-startup-image"
          href={`/splash/apple-splash-${w * dpr}-${h * dpr}.png`}
          media={`screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`}
        />
      ))}
    </>
  )
}
