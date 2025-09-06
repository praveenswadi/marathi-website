// Data loader for dynamic imports
import atharvashirshaData from './atharvashirsha.json'
import gayatriData from './gayatri.json'
import mahamrityunjayaData from './mahamrityunjaya.json'

const dataMap = {
  'atharvashirsha': atharvashirshaData,
  'gayatri': gayatriData,
  'mahamrityunjaya': mahamrityunjayaData
}

export const loadCollectionData = (collectionId) => {
  return dataMap[collectionId] || null
}
