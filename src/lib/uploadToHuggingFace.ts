export async function uploadToHuggingFace(file: File) {
  const UPLOAD_URL = 'https://huggingface.co/uploads'

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: file, /// <- File inherits from Blob
  })

  const url = await response.text()

  return url
}