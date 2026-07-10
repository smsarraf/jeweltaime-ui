/**
 * Converts a product name to a URL-friendly slug.
 * Removes special characters, replaces spaces with hyphens, and lowercases.
 * @param {string} text - The text to slugify
 * @returns {string} The slugified text
 */
export function toSlug(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // Remove special characters (keep letters, numbers, spaces, hyphens)
    .replace(/[\s_]+/g, '-')    // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-')        // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, '')    // Trim leading/trailing hyphens
}