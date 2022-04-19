const CONTRACT_NAME = process.env.CONTRACT_NAME || 'wallet-example'; 

function getConfig (env) {
  switch (env) {
    case 'development':
    case 'testnet':
      return {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://myfirstwallet.testnet.near.org",
        helperUrl: "https://myfirstwallet.testnet.near.org",
        explorerUrl: "https://myfirstwallet.testnet.near.org",
      }
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
  }
}

module.exports = getConfig
