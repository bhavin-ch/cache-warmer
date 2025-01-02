import express from 'express'
import path from 'path'
import { imageRouter } from './image-controller'
import rateLimit from 'express-rate-limit'
import { getLogger } from './log'

const log = getLogger()
const app = express()
const PORT = 3000

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

app.use('/static', express.static(path.join(__dirname, '../public')))
app.use('/images', imageRouter)

app.listen(PORT, () => {
  log.info(`Server running on http://localhost:${PORT}`)
})
