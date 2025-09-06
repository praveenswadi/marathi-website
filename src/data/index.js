// Data index for all verse collections
export const collections = [
  {
    id: 'atharvashirsha',
    title: 'अथर्वशीर्ष',
    description: 'Sanskrit verses with Marathi translations',
    filename: 'atharvashirsha.json'
  },
  {
    id: 'gayatri',
    title: 'गायत्री मंत्र',
    description: 'The sacred Gayatri Mantra',
    filename: 'gayatri.json'
  },
  {
    id: 'mahamrityunjaya',
    title: 'महामृत्युंजय मंत्र',
    description: 'The Great Death-Conquering Mantra',
    filename: 'mahamrityunjaya.json'
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
