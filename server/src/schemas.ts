import { z } from 'zod'

const rgbRegex = /^(#?([0-9A-Fa-f]{3}){1,2})$/

const widthSchema = z
  .string()
  .optional()
  .or(z.number().optional())
  .transform((value) => (value ? parseInt(value as string, 10) : undefined))

const heightSchema = z
  .string()
  .optional()
  .or(z.number().optional())
  .transform((value) => (value ? parseInt(value as string, 10) : undefined))

const fitSchema = z
  .enum(['contain', 'cover', 'fill', 'inside', 'outside'])
  .optional()

const rotateSchema = z
  .string()
  .optional()
  .or(z.number().optional())
  .transform((value) => (value ? parseInt(value as string, 10) : undefined))

const blurSchema = z
  .string()
  .optional()
  .or(z.number().optional())
  .transform((value) => (value ? parseFloat(value as string) : undefined))

const formatSchema = z.enum(['jpeg', 'png', 'webp']).optional()

const trimSchema = z
  .string()
  .optional()
  .default('false')
  .transform((value) => value === 'true')

const backgroundSchema = z
  .string()
  .regex(rgbRegex, { message: 'Invalid RGB color format' })
  .optional()
  .transform((value) => {
    if (!value) return undefined
    value = value.startsWith('#') ? value : `#${value}`
    if (value.length === 4) {
      value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    }
    return value
  })

export const imageQuerySchema = z
  .object({
    fit: fitSchema,
    trim: trimSchema,
    w: widthSchema,
    width: widthSchema,
    h: heightSchema,
    height: heightSchema,
    r: rotateSchema,
    rotate: rotateSchema,
    b: blurSchema,
    blur: blurSchema,
    f: formatSchema,
    format: formatSchema,
    bg: backgroundSchema,
    background: backgroundSchema,
  })
  .transform((query) => {
    return {
      ...query,
      width: query.width ?? query.w,
      height: query.height ?? query.h,
      rotate: query.rotate ?? query.r,
      blur: query.blur ?? query.b,
      format: query.format ?? query.f,
      background: query.background ?? query.bg,
    }
  })
