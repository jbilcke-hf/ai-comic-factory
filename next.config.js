/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '8mb',
  },
}

module.exports = nextConfig
