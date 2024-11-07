import setRateLimit from 'express-rate-limit'

const rateLimitMiddleware = (max = 5, windowMs = 60 * 1000) =>
  setRateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests, please try again later.',
    },
    headers: true,
    keyGenerator: async (req, _res) => {
      return req.clientIp as string
    },
  })

export default rateLimitMiddleware
