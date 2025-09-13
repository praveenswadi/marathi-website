// Data index for all verse collections
export const collections = [
  {
    id: 'atharvashirsha',
    title: 'अथर्वशीर्ष',
    description: 'Sanskrit verses with Marathi translations',
    filename: 'atharvashirsha.json'
  },
  {
    id: 'atharvashirsha-phalashruti',
    title: 'अथर्वशीर्षाची फलश्रुति',
    description: 'Benefits of reciting Atharvashirsha',
    filename: 'atharvashirsha-phalashruti.json'
  },
  {
    id: 'raamraksha',
    title: 'रामरक्षा',
    description: 'Sacred protective hymn dedicated to Lord Rama',
    filename: 'raamraksha.json'
  },
  {
    id: 'prarthana',
    title: 'प्रार्थना',
    description: 'Sacred prayers and devotional hymns',
    filename: 'prarthana.json'
  }
]

// Function to get collection by ID
export const getCollectionById = (id) => {
  return collections.find(collection => collection.id === id)
}

// Function to get all collections
export const getAllCollections = () => {
  return collections
}

// Function to get previous collection
export const getPreviousCollection = (currentId) => {
  const currentIndex = collections.findIndex(collection => collection.id === currentId)
  if (currentIndex <= 0) return null
  return collections[currentIndex - 1]
}

// Function to get next collection
export const getNextCollection = (currentId) => {
  const currentIndex = collections.findIndex(collection => collection.id === currentId)
  if (currentIndex === -1 || currentIndex >= collections.length - 1) return null
  return collections[currentIndex + 1]
}
