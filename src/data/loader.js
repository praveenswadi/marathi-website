// Data loader for dynamic imports
import atharvashirshaData from './atharvashirsha.json'
import atharvashirshaPhalashrutiData from './atharvashirsha-phalashruti.json'
import gayatriData from './gayatri.json'
import mahamrityunjayaData from './mahamrityunjaya.json'

const dataMap = {
  'atharvashirsha': atharvashirshaData,
  'atharvashirsha-phalashruti': atharvashirshaPhalashrutiData,
  'gayatri': gayatriData,
  'mahamrityunjaya': mahamrityunjayaData
}

export const loadCollectionData = (collectionId) => {
  return dataMap[collectionId] || null
}
