/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  // Rewrites убраны - используем прямые вызовы к API через axios
}

module.exports = nextConfig



