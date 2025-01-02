import sharp from 'sharp'
import { getLogger } from './log'
import { Transformations } from './typings'

const log = getLogger()

export const processImage = async (
  imagePath: string,
  {
    fit,
    trim,
    width,
    height,
    rotate,
    blur,
    format,
    background,
  }: Transformations
): Promise<Buffer> => {
  let image = sharp(imagePath)

  if (trim) {
    log.info('Trimming image')
    image = image.trim({
      ...(background ? { background } : {}),
    })
  }

  if (width || height || fit) {
    image = image.resize({
      width,
      height,
      fit,
      ...(background ? { background } : {}),
    })
  }

  if (rotate) {
    image = image.rotate(rotate)
  }

  if (blur) {
    image = image.blur(blur)
  }

  if (format) {
    image = image.toFormat(format)
  }

  return image.toBuffer()
}
