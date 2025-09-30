/**
 * Utility functions for manuscript functionality
 */

// Predefined list of collections that have manuscripts
// This avoids unnecessary 404 requests for collections without manuscripts
// Update this list when adding new manuscript collections
const COLLECTIONS_WITH_MANUSCRIPTS = [
  'atharvashirsha',
  'atharvashirsha-phalashruti', 
  'raamraksha',
  'prarthana',
  'mahalakshmi-aarti'
]

/**
 * Check if a collection has manuscripts available
 * @param {string} collectionId - The collection ID to check
 * @returns {Promise<boolean>} - True if manuscripts are available
 */
export async function hasManuscripts(collectionId) {
  // First check if this collection is in our known list
  if (!COLLECTIONS_WITH_MANUSCRIPTS.includes(collectionId)) {
    return false
  }
  
  // Only make the fetch request if we know manuscripts should exist
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
  
  // Check each collection in our predefined list
  for (const collectionId of COLLECTIONS_WITH_MANUSCRIPTS) {
    const hasManuscript = await hasManuscripts(collectionId)
    if (hasManuscript) {
      collectionsWithManuscripts.push(collectionId)
    }
  }
  
  return collectionsWithManuscripts
}