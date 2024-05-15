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
  async redirects() {
    return [
      {
        source: '/google/auth',
        destination: `${process.env.SERVER_BASE_URL}/auth/google`,
        permanent: false,
      },
      {
        source: '/auth/google/callback',
        destination: `${process.env.SERVER_BASE_URL}/auth/google/callback`,
        permanent: false,
      },
    ]
  },
}

export default withSerwist(nextConfig)
