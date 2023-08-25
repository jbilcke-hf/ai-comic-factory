import { computeSha256 } from "./computeSha256"

const secretFingerprint = `${process.env.SECRET_FINGERPRINT || ""}`

export function computeSecretFingerprint(input: string) {
  return computeSha256(`${secretFingerprint}_${input}`)
}