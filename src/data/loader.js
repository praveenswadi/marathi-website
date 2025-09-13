// Data loader for dynamic imports
import atharvashirshaData from './atharvashirsha.json'
import atharvashirshaPhalashrutiData from './atharvashirsha-phalashruti.json'
import prarthanaData from './prarthana.json'
import raamrakshaData from './raamraksha.json'

const dataMap = {
  'atharvashirsha': atharvashirshaData,
  'atharvashirsha-phalashruti': atharvashirshaPhalashrutiData,
  'prarthana': prarthanaData,
  'raamraksha': raamrakshaData
}

export const loadCollectionData = (collectionId) => {
  return dataMap[collectionId] || null
}
