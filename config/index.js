const dev = process.env.NODE_ENV === 'production'

export const server = dev ? 'https://calendar-233fqog4t-vancampd.vercel.app/' : 'http://localhost:3000/'  