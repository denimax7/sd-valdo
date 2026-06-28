/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      // Google Drive / Google Photos CDN — usado pola galería
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;
