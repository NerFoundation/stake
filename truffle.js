/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "avocado armed also position solution total token maze deny neutral bless share";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks:{
    development:{
      host:"localhost",
      port:"8545",
      network_id:"*"
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/QWMgExFuGzhpu2jUr6Pq")
      },
      network_id: 1,
      gas: 4712388,
      gasPrice: 10000000000

    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/QWMgExFuGzhpu2jUr6Pq",0,9)
      },
      network_id: 3,
      gas: 4712388,
      gasPrice: 10000000000

    } 
  }
};
