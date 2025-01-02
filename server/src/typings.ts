export type Format = 'jpeg' | 'png' | 'webp'
export type Fit = 'contain' | 'cover' | 'fill' | 'inside' | 'outside'

export interface Transformations {
  fit?: Fit
  trim?: boolean
  width?: number
  height?: number
  rotate?: number
  blur?: number
  format?: Format
  background?: string
}
