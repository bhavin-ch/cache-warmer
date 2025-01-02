import Redis from 'ioredis'
import { getLogger } from './log'
import { Transformations } from './typings'

const log = getLogger()

// Initialize Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT ?? '6379'),
})

// Get the cache key from the full URL
export const generateCacheKey = (
  img: string,
  params: Transformations
): string => {
  return `${img}--${JSON.stringify(params)}`
}

// Get cached data
export const getCache = async (key: string): Promise<Buffer | null> => {
  const cachedData = await redisClient.getBuffer(key)
  return cachedData
}

// Set cached data
export const setCache = async (
  key: string,
  data: Buffer,
  ttl: number = 3600
): Promise<void> => {
  await redisClient.set(key, data, 'EX', ttl) // Cache expires after `ttl` seconds
}

export const cleanCache = async () => {
  try {
    // Get all keys matching the pattern for cached image URLs
    const keys = await redisClient.keys('/*')

    if (keys.length === 0) {
      log.info('No cached images found.')
      return
    }

    // Delete all matching keys
    await redisClient.del(...keys)
    log.info(`Successfully deleted ${keys.length} cached image(s).`)
  } catch (err) {
    log.error('Error cleaning cache:', err)
  } finally {
    redisClient.quit()
  }
}
