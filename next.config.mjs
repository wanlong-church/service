/** @type {import('next').NextConfig} */
import nextPwa from 'next-pwa';
const withPWA = nextPwa({
	dest: 'public',
});
const nextConfig = {};

export default withPWA(nextConfig);
