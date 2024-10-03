import { useMediaQuery as useMediaQueryHook } from '@uidotdev/usehooks'

const breakpoints = {
  small: 'only screen and (max-width : 768px)',
  medium: 'only screen and (min-width : 769px) and (max-width : 1200px)',
  large: 'only screen and (min-width : 1201px)',
}

export function useMediaQuery() {
  const isSmallDevice = useMediaQueryHook(breakpoints.small)
  const isMediumDevice = useMediaQueryHook(breakpoints.medium)
  const isLargeDevice = useMediaQueryHook(breakpoints.large)

  return {
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
  }
}
