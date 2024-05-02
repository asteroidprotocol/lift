import { ChainType } from '../../chain.js'
import neutron from './neutron.js'
import osmosis from './osmosis.js'
import sei from './sei.js'
import unknown from './unknown.js'

export default function getTemplate(chain: ChainType) {
  if (chain == ChainType.Sei) {
    return sei
  } else if (chain == ChainType.Osmosis) {
    return osmosis
  } else if (chain == ChainType.Neutron) {
    return neutron
  }
  return unknown
}
