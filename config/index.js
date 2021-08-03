const dev = process.env.NODE_ENV === 'production'

export const server = dev ? 'https://calendar-qfxewf42y-vancampd.vercel.app/' : 'http://localhost:3000/' 