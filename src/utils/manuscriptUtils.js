/**
 * Utility functions for manuscript functionality
 */

/**
 * Check if a collection has manuscripts available
 * @param {string} collectionId - The collection ID to check
 * @returns {Promise<boolean>} - True if manuscripts are available
 */
export async function hasManuscripts(collectionId) {
  try {
    const response = await fetch(`/manuscripts/${collectionId}/manifest.json`)
    return response.ok
  } catch (error) {
    console.error(`Error checking manuscripts for ${collectionId}:`, error)
    return false
  }
}

/**
 * Get list of collections that have manuscripts
 * @returns {Promise<string[]>} - Array of collection IDs with manuscripts
 */
export async function getCollectionsWithManuscripts() {
  const collectionsWithManuscripts = []
  
  // List of collection IDs to check
  const collectionIds = ['atharvashirsha', 'atharvashirsha-phalashruti', 'raamraksha']
  
  for (const collectionId of collectionIds) {
    const hasManuscript = await hasManuscripts(collectionId)
    if (hasManuscript) {
      collectionsWithManuscripts.push(collectionId)
    }
  }
  
  return collectionsWithManuscripts
}