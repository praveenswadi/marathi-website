// Utility functions for manuscript handling

/**
 * Check if a collection has manuscript images available
 * @param {string} collectionId - The collection ID to check
 * @returns {Promise<boolean>} - True if manuscripts are available
 */
export const hasManuscripts = async (collectionId) => {
  try {
    const response = await fetch(`/manuscripts/${collectionId}/manifest.json`)
    return response.ok
  } catch (error) {
    console.log(`No manuscripts found for collection: ${collectionId}`)
    return false
  }
}

/**
 * Get manuscript manifest for a collection
 * @param {string} collectionId - The collection ID
 * @returns {Promise<Object|null>} - Manifest object or null if not found
 */
export const getManifest = async (collectionId) => {
  try {
    const response = await fetch(`/manuscripts/${collectionId}/manifest.json`)
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(`Error loading manifest for ${collectionId}:`, error)
    return null
  }
}

/**
 * Get all available manuscript collections
 * @returns {Promise<Array>} - Array of collection IDs that have manuscripts
 */
export const getAvailableManuscriptCollections = async () => {
  const collections = ['atharvashirsha', 'atharvashirsha-phalashruti', 'raamraksha']
  const availableCollections = []
  
  for (const collectionId of collections) {
    const hasManuscript = await hasManuscripts(collectionId)
    if (hasManuscript) {
      availableCollections.push(collectionId)
    }
  }
  
  return availableCollections
}