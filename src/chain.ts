export enum ChainType {
  Sei = 'sei',
  Osmosis = 'osmosis',
  Neutron = 'neutron',
  Custom = 'custom',
}

export const SUPPORTED_CHAINS = [
  ChainType.Sei,
  ChainType.Osmosis,
  ChainType.Neutron,
  ChainType.Custom,
]
