// Utility functions for manuscript handling

/**
 * Get the manuscript directory path for a collection
 * @param {string} collectionId - The ID of the collection (e.g., 'atharvashirsha')
 * @returns {string} - The path to the manuscript directory
 */
export const getManuscriptDirectory = (collectionId) => {
  return `/manuscripts/${collectionId}/`
}

/**
 * Check if a collection has manuscript images available
 * This function attempts to load the manuscript directory to see if images exist
 * @param {string} collectionId - The ID of the collection
 * @returns {Promise<boolean>} - True if manuscripts are available
 */
export const hasManuscriptsForCollection = async (collectionId) => {
  try {
    const manifestPath = `/manuscripts/${collectionId}/manifest.json`
    const response = await fetch(manifestPath)
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Get list of manuscript images for a collection
 * Reads from a manifest.json file in the manuscript directory
 * @param {string} collectionId - The ID of the collection
 * @returns {Promise<Array>} - Array of manuscript image objects
 */
export const getManuscriptImages = async (collectionId) => {
  try {
    const manifestPath = `/manuscripts/${collectionId}/manifest.json`
    const response = await fetch(manifestPath)
    
    if (!response.ok) {
      return []
    }
    
    const manifest = await response.json()
    return manifest.images || []
  } catch (error) {
    console.error('Error loading manuscript manifest:', error)
    return []
  }
}

/**
 * Generate a manifest.json file content for a collection
 * This is a helper function to create the manifest structure
 * @param {Array} imageFilenames - Array of image filenames
 * @param {string} collectionId - The ID of the collection
 * @returns {Object} - Manifest object
 */
export const generateManifest = (imageFilenames, collectionId) => {
  const images = imageFilenames.map((filename, index) => ({
    id: index + 1,
    filename: filename,
    url: `/manuscripts/${collectionId}/${filename}`,
    title: `Manuscript Page ${index + 1}`,
    description: `Original manuscript page ${index + 1}`
  }))
  
  return {
    collection: collectionId,
    title: `${collectionId} Manuscript Images`,
    description: `Original manuscript pages for ${collectionId}`,
    images: images,
    generatedAt: new Date().toISOString()
  }
}
