import EthStore from '../build/contracts/EthStore.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
  contracts: [
    EthStore,
  ],
  // events: {
  //   EthStore: [],
  // },
  polls: {
    blocks: 1,
  },
}

export default drizzleOptions
