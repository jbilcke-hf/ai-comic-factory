import { createHash } from 'node:crypto'

/**
 * Returns a SHA256 hash using SHA-3 for the given `content`.
 *
 * @see https://en.wikipedia.org/wiki/SHA-3
 *
 * @param {String} content
 *
 * @returns {String}
 */
export function computeSha256(strContent: string) {
  return createHash('sha3-256').update(strContent).digest('hex')
}