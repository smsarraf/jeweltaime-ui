import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

/**
 * Get auth headers for authenticated requests
 */
function getAuthHeaders() {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Upload a single file using the CMS media endpoint (POST /api/v1/media).
 * Returns the full MediaResponse object:
 *   { id, url, type, altText, originalFilename, fileSize, mimeType, isActive, createdAt }
 *
 * @param {File} file - The file to upload
 * @param {string} altText - Optional alt text for accessibility
 * @returns {Promise<object>} MediaResponse object
 */
export async function uploadFile(file, altText = '') {
  if (!file) throw new Error('No file provided')

  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${API_BASE}/api/v1/media`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    },
    params: { alt_text: altText || file.name || '' }
  })

  // Returns MediaResponse: { id, url, type, altText, originalFilename, fileSize, ... }
  if (response.data && response.data.url) {
    return response.data
  }

  throw new Error('Upload succeeded but no MediaResponse returned')
}

/**
 * Get just the URL from an uploaded file.
 *
 * @param {File} file - The file to upload
 * @param {string} altText - Optional alt text
 * @returns {Promise<string>} The uploaded file URL
 */
export async function uploadFileUrl(file, altText = '') {
  const media = await uploadFile(file, altText)
  return media.url
}

/**
 * Upload multiple files and return an array of MediaResponse objects.
 * Each file is uploaded individually since the CMS endpoint accepts one file at a time.
 *
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<object[]>} Array of MediaResponse objects
 */
export async function uploadFiles(files) {
  if (!files || files.length === 0) return []

  const uploads = files.map(file => uploadFile(file, file.name || ''))
  return Promise.all(uploads)
}

/**
 * Upload multiple files and return an array of URLs.
 *
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<string[]>} Array of uploaded file URLs
 */
export async function uploadFileUrls(files) {
  if (!files || files.length === 0) return []

  const uploads = files.map(file => uploadFileUrl(file, file.name || ''))
  return Promise.all(uploads)
}

/**
 * Upload a product thumbnail image and return the URL via the CMS media endpoint.
 *
 * @param {File} file - The image file
 * @param {string} altText - Optional alt text (defaults to filename)
 * @returns {Promise<string>} The uploaded thumbnail URL
 */
export async function uploadProductThumbnail(file, altText = '') {
  return uploadFileUrl(file, altText || file.name || 'Product image')
}

/**
 * Upload a variant image. The variant must already exist (have an ID).
 * Uses the variant-specific endpoint which associates the image with the variant.
 *
 * @param {number|string} variantId - The variant ID
 * @param {File} file - The image file
 * @returns {Promise<object>} The uploaded media response object with { id, url, type }
 */
export async function uploadVariantImage(variantId, file) {
  if (!variantId) throw new Error('Variant ID is required')
  if (!file) throw new Error('No file provided')

  const formData = new FormData()
  formData.append('files', file)

  const response = await axios.post(
    `${API_BASE}/api/v1/upload/variant/${variantId}`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  // Returns array of ProductMediaResponse
  if (response.data && Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0]
  }
  if (response.data && response.data.url) return response.data

  throw new Error('Variant image upload failed')
}

/**
 * Upload multiple variant images at once.
 *
 * @param {number|string} variantId - The variant ID
 * @param {File[]} files - Array of image files
 * @returns {Promise<object[]>} Array of uploaded media response objects
 */
export async function uploadVariantImages(variantId, files) {
  if (!files || files.length === 0) return []

  const formData = new FormData()
  files.forEach(file => formData.append('files', file))

  const response = await axios.post(
    `${API_BASE}/api/v1/upload/variant/${variantId}`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  if (response.data && Array.isArray(response.data)) {
    return response.data
  }

  return []
}