import { Config } from '../../config.js'
import type { DeepPartial } from '../../types.js'

const config: DeepPartial<Config> = {
  gas_price: '0.01untrn',
  account_prefix: 'neutron',
  networks: {
    local: {
      chain_id: 'test-1',
      network_variant: 'Local',
      rpc_endpoint: 'http://localhost:26657',
    },
    testnet: {
      chain_id: 'pion-1',
      network_variant: 'Shared',
      rpc_endpoint: 'https://rpc-palvus.pion-1.ntrn.tech',
    },
    mainnet: {
      chain_id: 'neutron-1',
      network_variant: 'Shared',
      rpc_endpoint: 'https://rpc-kralum.neutron-1.neutron.org',
    },
  },
  accounts: {
    test1: {
      mnemonic:
        'banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass',
    },
    test2: {
      mnemonic:
        'veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only',
    },
    test3: {
      mnemonic:
        'obscure canal because tomorrow tribe sibling describe satoshi kiwi upgrade bless empty math trend erosion oblige donate label birth chronic hazard ensure wreck shine',
    },
  },
}
export default config
