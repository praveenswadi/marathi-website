// Utility functions for audio handling

// Collections that have audio files available
const COLLECTIONS_WITH_AUDIO = ['atharvashirsha']

/**
 * Check if a collection has audio files available
 * @param {string} collectionId - The ID of the collection
 * @returns {boolean} - True if audio is available for this collection
 */
export const hasAudioForCollection = (collectionId) => {
  return COLLECTIONS_WITH_AUDIO.includes(collectionId)
}

/**
 * Check if a specific verse has audio available
 * @param {string} collectionId - The ID of the collection
 * @param {number} verseId - The ID of the verse
 * @returns {boolean} - True if audio is available for this verse
 */
export const hasAudioForVerse = (collectionId, verseId) => {
  if (!hasAudioForCollection(collectionId)) {
    return false
  }
  
  // For atharvashirsha, we have audio files for verses 1-40
  if (collectionId === 'atharvashirsha') {
    return verseId >= 1 && verseId <= 40
  }
  
  return false
}

/**
 * Get the audio file path for a verse
 * @param {number} verseId - The ID of the verse
 * @returns {string} - The path to the audio file
 */
export const getAudioPath = (verseId) => {
  return `/audio/verse-${verseId}.mp3`
}
