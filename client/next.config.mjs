/** @type {import('next').NextConfig} */
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
})

const nextConfig = {
  env: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: '/google/auth',
        destination: `${process.env.SERVER_BASE_URL}/auth/google`,
      },
      {
        source: '/auth/google/callback',
        destination: `${process.env.SERVER_BASE_URL}/auth/google/callback`,
      },
      {
        source: '/add',
        destination: '/task/add',
      },
      {
        source: '/edit',
        destination: '/task/edit',
      },
    ]
  },
}

export default withSerwist(nextConfig)
