/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  }
}

module.exports = nextConfig
