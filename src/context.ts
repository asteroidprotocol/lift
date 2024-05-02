import { AccountData, Coin, OfflineSigner } from '@cosmjs/proto-signing'
import { GasPrice } from '@cosmjs/stargate'
import { snakeCase } from 'change-case'
import path from 'path'
import loadAccount from './account.js'
import type { Config } from './config.js'
import loadConfig from './config.js'
import ExtendedClient from './extended-client.js'
import type { State } from './state.js'
import loadState from './state.js'

export class WorkspaceContext {
  network: string
  config: Config
  state: State
  signer: OfflineSigner
  account: AccountData
  client: ExtendedClient

  constructor(
    network: string,
    config: Config,
    state: State,
    signer: OfflineSigner,
    account: AccountData,
    client: ExtendedClient,
  ) {
    this.network = network
    this.config = config
    this.state = state
    this.signer = signer
    this.account = account
    this.client = client
  }
}

export class Contract {
  name: string
  folder: string
  instance: string
  context: WorkspaceContext

  constructor(
    context: WorkspaceContext,
    name: string,
    instance: string = 'default',
  ) {
    this.context = context
    this.name = name
    this.instance = instance

    const contractConfig = context.config.contracts[name]
    if (contractConfig && contractConfig.folder) {
      this.folder = contractConfig.folder
    } else {
      this.folder = name
    }
  }

  get path() {
    return path.join(
      process.cwd(),
      this.context.config.wasm.contract_dir,
      this.folder,
    )
  }

  get address() {
    const instanceContractAddress = this.state.addresses[this.instance]
    if (!instanceContractAddress) {
      throw new Error("Contract instance doesn't exist")
    }
    return instanceContractAddress
  }

  get schemaPath() {
    return path.join(this.path, 'schema')
  }

  get artifactPath() {
    return path.join(process.cwd(), 'artifacts', `${snakeCase(this.name)}.wasm`)
  }

  get state() {
    const contractState = this.context.state.getContractState(
      this.context.network,
      this.name,
    )
    if (!contractState) {
      throw new Error("Contract state doesn't exist")
    }
    return contractState
  }

  addCodeId(codeId: number) {
    return this.context.state.addCodeId(this.context.network, this.name, codeId)
  }

  addContractAddress(contractAddress: string) {
    return this.context.state.addContractAddress(
      this.context.network,
      this.name,
      contractAddress,
      this.instance,
    )
  }

  execute(msg: unknown, memo?: string, funds?: readonly Coin[]) {
    return this.context.client.execute(
      this.context.account.address,
      this.address,
      msg,
      'auto',
      memo,
      funds,
    )
  }

  query(msg: unknown) {
    return this.context.client.queryContractSmart(this.address, msg)
  }
}

export interface WorkspaceOptions {
  network: string
  account?: string
}

export interface ContractOptions extends WorkspaceOptions {
  instance: string
}

export async function createContext(
  options: WorkspaceOptions,
): Promise<WorkspaceContext> {
  // load config
  const config = await loadConfig()
  const network = config.networks[options.network]

  // load state
  const state = await loadState(network.network_variant)

  if (!options.account) {
    options.account = Object.keys(config.accounts)[0]
  }

  // load account
  const [signer, account] = await loadAccount(config, options.account)

  // connect client
  const client = await ExtendedClient.connectWithSigner(
    network.rpc_endpoint,
    signer,
    { gasPrice: GasPrice.fromString(config.gas_price) },
  )

  // create context
  return new WorkspaceContext(
    options.network,
    config,
    state,
    signer,
    account,
    client,
  )
}

export function getContract(
  context: WorkspaceContext,
  contractName: string,
  options: ContractOptions,
) {
  return new Contract(context, contractName, options.instance)
}
