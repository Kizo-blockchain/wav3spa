const kyberMainnet = require('./kyber-mainnet.json');
const uniswapMainnet = require('./uniswap-mainnet.json');
const dydxMainnet = require('./dydx-mainnet.json');
const tokensMainnet = require('./tokens-mainnet.json');
const projectToken = require('./projecttokens-mainnet.json');
const aaveKovan = require('./aave-kovan.json');

module.exports = {
  mainnet: {
  	aavelendingPool:aaveKovan,
    kyber: kyberMainnet,
    uniswap: uniswapMainnet,
    dydx: dydxMainnet,
    tokens: tokensMainnet,
    projectToken: projectToken
  }
};
