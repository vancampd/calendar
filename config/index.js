const dev = process.env.NODE_ENV !== 'production'

export const server = dev ? 'https://calendar-dusky-mu.vercel.app/' : 'http://localhost:3000' 