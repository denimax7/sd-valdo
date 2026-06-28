/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // Con output:export, a optimización de Next en servidor non está dispoñible.
    // Usamos unoptimized:true e confiamos no redimensionado do CDN de Google
    // (parámetro =wN en lh3.googleusercontent.com) + caché do CDN de Vercel.
    unoptimized: true,
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
