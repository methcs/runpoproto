import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  // don't throw at import time in production build; only throw when token functionality is used
  // but log a warning for dev
  if (process.env.NODE_ENV !== 'production') {
    console.warn('JWT_SECRET is not set; generating insecure dev secret')
  }
}

export function signToken(payload: object) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not set')
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not set')
  return jwt.verify(token, JWT_SECRET)
}
