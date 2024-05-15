import type { NextFunction, Request, Response } from 'express'

export const validateHasParameters = (...args: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let data: any
    if (req.method === 'POST') data = req.body
    else data = req.query
    let valid = true

    for (const arg of args) {
      if (data[arg] === undefined) {
        res.status(403).json({ error: `${arg} not specified` })
        valid = false
        break
      }
    }

    if (valid) {
      next()
    }
  }
}
