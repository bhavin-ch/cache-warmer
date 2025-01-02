import express, { Request, Response } from 'express'
import path from 'path'
import { processImage } from './image-service'
import { imageQuerySchema } from './schemas'
import { ZodError } from 'zod'
import { generateCacheKey, getCache, setCache } from './cache'
import { getLogger } from './log'

const log = getLogger()

export const imageRouter = express.Router()

imageRouter.get(
  '/:image',
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Get path & query parameters
      const { image } = req.params
      const query = imageQuerySchema.parse(req.query)

      // Generate a cache key from the full URL
      const fullUrl = req.originalUrl
      log.info(`fullUrl ${fullUrl}`)
      const cacheKey = generateCacheKey(image, query)

      // Check if the transformed image exists in the cache
      const cachedImage = await getCache(cacheKey)
      if (cachedImage) {
        log.info(`Cache hit for ${cacheKey}`)
        return res
          .contentType((query.format as string) ?? 'jpeg')
          .send(cachedImage)
      }

      if (!image) {
        return res.status(400).send('Image parameter is required')
      }

      const imagePath = path.join(
        __dirname,
        '../public/images',
        image as string
      )

      log.info(`Processing image: ${cacheKey}`)
      const buffer = await processImage(imagePath, query)

      // Cache the transformed image
      await setCache(cacheKey, buffer)

      return res.contentType(query.format ?? 'jpeg').send(buffer)
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors })
      }
      return res
        .status(500)
        .send(`Error processing image: ${(err as Error).message}`)
    }
  }
)
