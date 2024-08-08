/** @type {import('next').NextConfig} */
import nextPwa from "next-pwa";
const withPWA = nextPwa({
  dest: "public",
});
const nextConfig = {
  env: {
  },
  devIndicators: {
    autoPrerender: false,
  },
  pwa: {
    dest: 'public',
  },
};

export default process.env.NODE_ENV === 'development' ? nextConfig: withPWA(nextConfig);
