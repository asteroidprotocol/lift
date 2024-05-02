import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import commands from './commands/index.js'

export {
  task,
  contractTask,
  workspaceCommand,
  contractCommand,
} from './task.js'

export { commands }

export function logTransaction(res: ExecuteResult) {
  console.log('transaction hash:', res.transactionHash)
}
