// const nearAPI = require("near-api-js");
// require('dotenv').config()
// const { connect } = nearAPI
// const { keyStores, KeyPair } = nearAPI;
// const keyStore = new keyStores.InMemoryKeyStore();
// const PRIVATE_KEY = "ed25519:zsqLKxBVYsUTprCZey8Jt9mwpNuZPcfAGZPmsnWiLVSqU8Da63BkSjJv4e4g6P7SftfdGHj9g1M95rdZZcFhBaF"
// const keyPair = KeyPair.fromString(PRIVATE_KEY);
// // console.log(process.env);


//  const config = {
//   networkId: process.env.NETWORK_ID,
//   keyStore,
//   nodeUrl: process.env.NODE_URL,
//   walletUrl: process.env.WALLET_URL,
//   helperUrl: process.env.HELPER_URL,
//   explorerUrl: process.env.EXPLORER_URL,
// };



// export const GetBalance = async () => {
//   await keyStore.setKey("testnet", process.env.ACCOUNT_ID, keyPair);
//   const near = await connect(config);
//   const account = await near.account(process.env.ACCOUNT_ID);
//   const sum = await account.getAccountBalance();
//   console.log(sum);
//   // setBalance(sum.available)
//   // return sum.total
// }
// console.log(GetBalance());





