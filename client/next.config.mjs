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
}

export default withSerwist(nextConfig)
