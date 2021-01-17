import config from "../config";
import configdev from "../config/configdev.js";

import async from 'async';
import * as moment from 'moment';
import {
  DEPLOY_FLASHLOAN,
  DEPLOY_FLASHLOANUSDT,
  DEPLOY_FLASHLOANUSDC,
  DEPLOY_FLASHLOAN_RETURNED,
  DEPLOY_FLASHLOAN_RECEIPT_RETURNED,
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  CLAIM,
  CLAIM_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_RETURNED,
  GET_YCRV_REQUIREMENTS,
  GET_YCRV_REQUIREMENTS_RETURNED,
  REGISTER_VOTE,
  REGISTER_VOTE_RETURNED,
  GET_VOTE_STATUS,
  GET_VOTE_STATUS_RETURNED,
  APPROVE_YFRB,
  STAKE_YFRB,
  UNSTAKE_YFRB,
  DAI_BALANCE,
  DEPLOY_NFT,
  BURN_NFT
} from '../constants';
import Web3 from 'web3';

import BigNumber from 'bignumber.js'


import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";
import swal from '@sweetalert/with-react';

const rp = require('request-promise');
const ethers = require('ethers');

// const path = require('path');
// const fs = require('fs-extra');
// const solc = require('solc');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }, 
  {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
];

let ERCVYPER = [{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "owner",
    "type": "address"
  }, {
    "indexed": true,
    "name": "spender",
    "type": "address"
  }, {
    "indexed": false,
    "name": "value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "name": "value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "payable": true,
  "stateMutability": "payable",
  "type": "fallback"
}, {
  "constant": true,
  "inputs": [{
    "name": "_owner",
    "type": "address"
  }, {
    "name": "_spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_spender",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "_owner",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "name": "balance",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "name": "",
    "type": "uint8"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_to",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_from",
    "type": "address"
  }, {
    "name": "_to",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}];


BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


class Store {
  constructor() {

    this.store = {
      // votingStatus: false,
      deployFlashloanStatus: false,
      deployFlashloanReceiptStatus: false,
      currentBlock: 0,
      universalGasPrice: '70',
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        // TrustWallet: injected,
        // WalletConnect: walletconnect,
        // WalletLink: walletlink,
        // Ledger: ledger,
        // Trezor: trezor,
        // Frame: frame,
        // Fortmatic: fortmatic,
        // Portis: portis,
        // Squarelink: squarelink,
        // Torus: torus,
        // Authereum: authereum
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      proposals: [
      ],
      claimableAsset: {
        id: 'YFRB',
        name: 'yfrb.finance',
        address: config.yfiAddress,
        abi: config.yfiABI,
        symbol: 'YFRB',
        balance: 0,
        decimals: 18,
        rewardAddress: '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d',
        rewardSymbol: 'aDAI',
        rewardDecimals: 18,
        claimableBalance: 0
      },
      rewardPools: [
        {
          id: 'YFRB',
          name: 'yfrb.finance',
          // website: 'curve.fi/y',
          // link: 'https://curve.fi/y',
         // YieldCalculatorLink: "https://yieldfarming.info/yfii/ycrv/",   //收益率器地址
          depositsEnabled: true,
          isVote: false,
          tokens: [
            {
              id: 'yFRB',
              address: '0x5d1b1019d0afa5e6cc047b9e78081d44cc579fc4',
              symbol: 'YFRB',
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.yCurveFiRewardsAddress,
              rewardsABI: config.yCurveFiRewardsABI,
              rewardsSymbol: 'YFRB',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            }
          ]
        },
       
      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {

          case DEPLOY_FLASHLOAN:
            // this.compileContract()
            this.deployFlashloan1(payload)
            break;
              case DEPLOY_FLASHLOANUSDT:
            // this.compileContract()
            this.deployFlashloan2(payload)
            break;
              case DEPLOY_FLASHLOANUSDC:
            // this.compileContract()
            this.deployFlashloan3(payload)
            break;
             case DEPLOY_NFT:
            // this.compileContract()
            this.deploySoundNFT(payload)
            break;
             case BURN_NFT:
            // this.compileContract()
            this.burnSoundNFT(payload)
            break;
          
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetual(payload);
            break;
            case APPROVE_YFRB:
            this.approvestake(payload);
            break;
          case STAKE_YFRB:
            this.stake(payload);
            break;
          case UNSTAKE_YFRB:
            this.withdraw(payload);
            break;
          case DAI_BALANCE:
            this.getdaibalance("0xff795577d9ac8bd7d90ee22b6c1703490b6512fd");
            break;
          case GET_REWARDS:
            this.getReward(payload);
            break;
          case EXIT:
            this.exit(payload);
            break;
          case CLAIM:
            this.claim(payload)
            break;
           default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber()

    store.setStore({ currentBlock: currentBlock })

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
  }


  getdaibalance = async (tokenadress) =>{

     const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = new web3.eth.Contract(minABI,configdev.daitoken_adress);

      const account = store.getStore('account')
      // Call balanceOf function
      var balance = await contract.methods.balanceOf(account.address).call();

      var decimal =  await contract.methods.decimals().call();

      const balances = balance / 10**decimal;
        

     //   console.log(balances);
    return(balances.toFixed(2).toString());

  }


   getbotowner = async (address) =>{

     const web3 = new Web3(store.getStore('web3context').library.provider);

     const contractArifact = require('../buildSol/contracts/Flashloan.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    let contract = new web3.eth.Contract(contractAbi,address);

      const account = store.getStore('account')
      // Call balanceOf function
      var owner = await contract.methods.getOwnerAddress().call();

       console.log(owner);

  }

   TokenAddress = async (address) =>{

     const web3 = new Web3(store.getStore('web3context').library.provider);

     const contractArifact = require('../buildSol/contracts/Flashloan.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    let contract = new web3.eth.Contract(contractAbi,address);

     // const account = store.getStore('account')
      // Call balanceOf function
      var owner = await contract.methods.getTradedTokenAddress().call();

       console.log(owner);

       return owner.toString();

  }


   withdrawfunds = (address) => {
    

    this._withdrawfunds(address, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DEPLOY_FLASHLOAN_RETURNED, res)
    })
  }

     _withdrawfunds = async (address,callback) =>{

     const web3 = new Web3(store.getStore('web3context').library.provider);

     const contractArifact = require('../buildSol/contracts/Flashloan.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    let contract = new web3.eth.Contract(contractAbi,address);

      const account = store.getStore('account')
      // Call balanceOf function
      var owner = await contract.methods.withdrawETHAndTokens().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        // }
      })
      .on('receipt', function(receipt){
        console.log(receipt);

        console.log("contractAddress"+ receipt.contractAddress)
      //  emitter.emit(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, receipt.contractAddress )
        // dispatcher.dispatch({ type: DEPLOY_FLASHLOAN_RECEIPT, content: {} })

      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
       console.log(owner);

  }
 


    getbottdaibalance = async (adress) =>{

     const web3 = new Web3(store.getStore('web3context').library.provider);
    const contractArifact = require('../buildSol/contracts/Flashloan.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    let contract = new web3.eth.Contract(contractAbi,adress);

      const account = store.getStore('account')
      // Call balanceOf function
      var balance = await contract.methods.getDaiBalance().call();

      var tokenadress = await contract.methods.getTradedTokenAddress().call();

      let erc20contract = new web3.eth.Contract(minABI,tokenadress);

      var decimal =  await erc20contract.methods.decimals().call();

      const balances = balance / 10**decimal;

    //  const digits =  Math.round((balances + Number.EPSILON) * 100) / 100
       
     //  console.log(digits);
      // var decimal =  await contract.methods.decimals().call();

     // const balances = balance / 10**decimal;
        

        console.log(balances);
    return(balances);

  }

  getyfrbbalance = async (tokenadress) => {

     const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = new web3.eth.Contract(minABI,configdev.yfrb_totken_address);

      const account = store.getStore('account')
      // Call balanceOf function
      var balance = await contract.methods.balanceOf(account.address).call();

      var decimal =  await contract.methods.decimals().call();

      const balances = balance / 10**decimal;
        
        // console.log("yfrb balance")
        // console.log(balances);
    return(balances);

  }

    geLPtyfrbbalance = async (tokenadress) => {

     const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = new web3.eth.Contract(minABI,configdev.lptoken_address);

      const account = store.getStore('account')
      // Call balanceOf function
      var balance = await contract.methods.balanceOf(account.address).call();

      var decimal =  await contract.methods.decimals().call();

      const balances = balance / 10**decimal;
        
        // console.log("yfrb balance")
        // console.log(balances);
    return(balances);

  }

    getdeployedflashloans = async () =>{

      
    const {mainnet: addresses} = require('../addresses')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractArifact = require('../buildSol/contracts/Factory.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;
    const account = store.getStore('account')

    const flashloan1Contract = new web3.eth.Contract(contractAbi,configdev.factory_smart_contract)
   
    var flashloans = await flashloan1Contract.methods.getUserflashloans(account.address).call();

     //console.log(flashloans);

    return flashloans;

  }

    getdeployednft = async () =>{

    const account = store.getStore('account')

    const {mainnet: addresses} = require('../addresses')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractArifact = require('../buildSol/contracts/Curve.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;


    const flashloan1Contract = new web3.eth.Contract(contractAbi,configdev.factory_nft)
   
    var nftshash = await flashloan1Contract.methods.getMatrixs(account.address).call();


    console.log(nftshash);
    
    return nftshash;

  }

  

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock: currentBlock })

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {
        if (pool.isVote) {
          async.parallel([
            (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) },
          ], (err, data) => {
            if(err) {
              console.log(err)
              return callbackInner(err)
            }
  
            token.balance = data[0]
            token.stakedBalance = data[1]
            token.rewardsAvailable = data[2]

            callbackInner(null, token)
          })
        } else {
          async.parallel([
            (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getHalfTime(web3, token, account, callbackInnerInner) }
          ], (err, data) => {
            if(err) {
              console.log(err)
              return callbackInner(err)
            }
  
            token.balance = data[0]
            token.stakedBalance = data[1]
            token.rewardsAvailable = data[2]
  
            token.halfTime = data[3]
          
  
            callbackInner(null, token)
          })
        }
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED)
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  getBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {
        if (pool.isVote) {
          async.parallel([
            (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) },
          ], (err, data) => {
            if(err) {
              console.log(err)
              return callbackInner(err)
            }
  
            token.balance = data[0]
            token.stakedBalance = data[1]
            token.rewardsAvailable = data[2]

            callbackInner(null, token)
          })
        } else {
          async.parallel([
            (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getHalfTime(web3, token, account, callbackInnerInner) }
          ], (err, data) => {
            if(err) {
              console.log(err)
              return callbackInner(err)
            }
  
            token.balance = data[0]
            token.stakedBalance = data[1]
            token.rewardsAvailable = data[2]
  
            token.halfTime = data[3]
          
  
            callbackInner(null, token)
          })
        }
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          callback()
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      callback()
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var earned = await erc20Contract.methods.earned(account.address).call({ from: account.address });
      earned = parseFloat(earned)/10**asset.decimals
      callback(null, parseFloat(earned))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getHalfTime = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var halfTime = await erc20Contract.methods.periodFinish().call({ from: account.address });

      callback(null, halfTime * 1000)
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  stake = (payload) => {

    const account = store.getStore('account');

    const { asset, amount } = payload.content

     this._callStake(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })

  }

  _callStake = async (asset, account, amount, callback) => {

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractstaking = require('../buildSol/contracts/MasterChef.json');

    const StakingContract = new web3.eth.Contract(contractstaking.abi, configdev.staking_smart_contract)

      let contract = new web3.eth.Contract(minABI,configdev.lptoken_address);

      var balance = await contract.methods.balanceOf(account.address).call();

      console.log(balance.toString());

     StakingContract.methods.deposit(
      0,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
     //.send({ from: account.address})
      .send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

 getPoolWeight = async () => {
  const account = store.getStore('account')
  const web3 = new Web3(store.getStore('web3context').library.provider);

  const contractstaking = require('../buildSol/contracts/MasterChef.json');
  const StakingContract = new web3.eth.Contract(contractstaking.abi, configdev.staking_smart_contract)
  
  const { allocPoint } = await StakingContract.methods.poolInfo(0).call()
 // console.log(allocPoint);

  const totalAllocPoint = await StakingContract.methods
    .totalAllocPoint()
    .call()

   // console.log(totalAllocPoint);

  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}


// Currently, there are 378 Neolastics in circulation.
// The reserve pool is currently 71.272845 ETH.
// Current Minting Cost 0.378 ETH.
// Current Burning Reward 0.37611 ETH.
// Total Ever Minted: 1215.
// Total Ever Paid: 443.444 ETH.

  
   getWave3Data = async () => {
  const account = store.getStore('account')
  
  const contractwave = require('../buildSol/contracts/Curve.json');
  const web3 = new Web3(store.getStore('web3context').library.provider);

  const WaveContract = new web3.eth.Contract(contractwave.abi, configdev.factory_nft)
 

    let mint_price =  await WaveContract.methods.getCurrentPriceToMint().call();
    let reservecut =  await  WaveContract.methods.getReserveCut().call();
    let pricetoburn = await  WaveContract.methods.getCurrentPriceToBurn().call();
   let currentSupply = await  WaveContract.methods.getCurrentSupply().call();

  


     return ({mint_price: web3.utils.fromWei(mint_price, 'ether'), reserve_cut:web3.utils.fromWei(reservecut, 'ether'),pricetoburn:web3.utils.fromWei(pricetoburn, 'ether'),currentsupply:web3.utils.fromWei(currentSupply, 'ether')})
   
   }

     withemergencydraw = (payload) => {
    const account = store.getStore('account')

  
    this._callemergencyWithdraw(account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }


  getEarned = async () => {
  const account = store.getStore('account')
  
  const contractstaking = require('../buildSol/contracts/MasterChef.json');
  const web3 = new Web3(store.getStore('web3context').library.provider);

  const StakingContract = new web3.eth.Contract(contractstaking.abi, configdev.staking_smart_contract)
 
    var balance = await StakingContract.methods.pendingYfrb(0, account.address).call();

     let contract = new web3.eth.Contract(minABI,configdev.yfrb_totken_address);

      // Call balanceOf function
   
       console.log(balance)

       var decimal =  await contract.methods.decimals().call();

     const balances = balance / 10**decimal;
     
     return balances ;
   }

     withemergencydraw = (payload) => {
    const account = store.getStore('account')

  
    this._callemergencyWithdraw(account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }


  _callemergencyWithdraw = async ( account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractstaking = require('../buildSol/contracts/MasterChef.json');

    const StakingContract = new web3.eth.Contract(contractstaking.abi, configdev.staking_smart_contract);
    
    var balance = await StakingContract.methods.pendingYfrb(0, account.address).call();

      let contract = new web3.eth.Contract(minABI,configdev.yfrb_totken_address);

      var decimal =  await contract.methods.decimals().call();

     var balances = balance * 10**decimal;

     console.log("balance ")
     console.log(balance)
     

    StakingContract.methods.emergencyWithdraw(0)
    .send({ from: account.address})
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdraw = (payload) => {
    const account = store.getStore('account')

    const { asset, amount } = payload.content

    this._callWithdraw(asset, account, amount, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }


  _callWithdraw = async (asset, account, amount, callback) => {
    
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractstaking = require('../buildSol/contracts/MasterChef.json');

    const StakingContract = new web3.eth.Contract(contractstaking.abi, configdev.staking_smart_contract);
    
    var balance = await StakingContract.methods.pendingYfrb(0, account.address).call();

     var balanceuser = await StakingContract.methods.userInfo(0, account.address).call();

      let contract = new web3.eth.Contract(minABI,configdev.yfrb_totken_address);

      var decimal =  await contract.methods.decimals().call();

     var balances = balance / 10**decimal;

     var real = balances/10;

     console.log("balance lp")
       console.log(balanceuser.amount)
     console.log(new BigNumber(balanceuser.amount).times(new BigNumber(1).div(100)).toString())
     console.log("balance reward")
     console.log(balances)
     

    StakingContract.methods.withdraw(0,
     new BigNumber(balanceuser.amount).times(new BigNumber(1)).toString(),
     )
    .send({ from: account.address,  gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getReward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callGetReward(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res)
    })
  }

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  exit = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callExit(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res)
    })
  }

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }


  approvestake = (payload) => {
    const account = store.getStore('account');

    const { asset, amount } = payload.content

     this.callapprovestake(account, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })

  }


 callapprovestake = async (account) => {


  const web3 = new Web3(store.getStore('web3context').library.provider);


  let contract = new web3.eth.Contract(minABI,configdev.lptoken_address);

    contract.methods
    .approve(configdev.staking_smart_contract, ethers.constants.MaxUint256)
    .send({ from: account.address })
        .on('transactionHash', function(hash){
        console.log(hash)

         swal({
          title: "Approving transfer",
          text: "",
          icon: "success"
        })
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        // }
         

      })
      .on('receipt', function(receipt){
        console.log(receipt);

        console.log("contractAddress"+ receipt.contractAddress)
      //  emitter.emit(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, receipt.contractAddress )
        // dispatcher.dispatch({ type: DEPLOY_FLASHLOAN_RECEIPT, content: {} })

      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return console.log(error.message)
          }
          console.log(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return console.log(error.message)
          }
          console.log(error)
        }
      })

}



  deployFlashloan1 = (payload) => {
    
    const account = store.getStore('account')
  
    this._callDeployFlashLoan1(account,configdev.daitoken_adress, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DEPLOY_FLASHLOAN_RETURNED, res)
    })
  }

   deployFlashloan2 = (payload) => {
    
    const account = store.getStore('account')
  
    this._callDeployFlashLoan1(account,configdev.usdt_token_address, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DEPLOY_FLASHLOAN_RETURNED, res)
    })
  }

    deployFlashloan3 = (payload) => {
    
    const account = store.getStore('account')
  
    this._callDeployFlashLoan1(account,configdev.usdc_token_address, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DEPLOY_FLASHLOAN_RETURNED, res)
    })
  }


  _callDeployFlashLoan1 = async (account,tokenadress, callback) => {

    const {mainnet: addresses} = require('../addresses')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractArifact = require('../buildSol/contracts/Factory.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    const flashloan1Contract = new web3.eth.Contract(contractAbi,configdev.factory_smart_contract)
   
    // console.log("flashloan1Contract", flashloan1Contract)
    // const payload = {
    //   data: bytecode,
    //   arguments: [
    //     addresses.aavelendingPool.solo,
    //     addresses.kyber.kyberNetworkProxy,
    //     addresses.uniswap.router,
    //     addresses.projectToken.YFRB,
    //      ]
    // }
    //


      
          

    flashloan1Contract.methods.createFlashloan(tokenadress).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
         swal({
          title: "Creating your flashloan Arbbot",
          text: "Don't forget to fund with Dai and add the smart contract address to the .env file of your bot.",
          icon: "success"
        })
         
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        // }
         

      })
      .on('receipt', function(receipt){
        console.log(receipt);

        console.log("contractAddress"+ receipt.contractAddress)
        emitter.emit(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, receipt.contractAddress )
        // dispatcher.dispatch({ type: DEPLOY_FLASHLOAN_RECEIPT, content: {} })

      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

   burnSoundNFT = (payload) => {
    
    const account = store.getStore('account')
    
     const { tokenid } = payload.content

    this._callBurnNFT(account,tokenid, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DEPLOY_FLASHLOAN_RETURNED, res)
    })
  }


    _callBurnNFT = async (account,tokenid, callback) => {

    const {mainnet: addresses} = require('../addresses')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractArifact = require('../buildSol/contracts/Curve.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    const NFTfactoryContract = new web3.eth.Contract(contractAbi,configdev.factory_nft)
   
    // console.log("flashloan1Contract", flashloan1Contract)
    // const payload = {
    //   data: bytecode,
    //   arguments: [
    //     addresses.aavelendingPool.solo,
    //     addresses.kyber.kyberNetworkProxy,
    //     addresses.uniswap.router,
    //     addresses.projectToken.YFRB,
    //      ]
    // }
    //



    var burn_price =  await NFTfactoryContract.methods.getCurrentPriceToBurn().call();


    console.log("tokenid")
     console.log(tokenid)
     console.log("burn_price");
    console.log(burn_price);

  

    NFTfactoryContract.methods.burn(tokenid).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'), value:burn_price})
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
         swal({
          title: "Creating your Sound Matrix nft",
          text: "",
          icon: "success"
        })
         
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        // }
         

      })
      .on('receipt', function(receipt){
        console.log(receipt);

        console.log("contractAddress"+ receipt.contractAddress)
        emitter.emit(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, receipt.contractAddress )
        // dispatcher.dispatch({ type: DEPLOY_FLASHLOAN_RECEIPT, content: {} })

      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }



   deploySoundNFT = (payload) => {
    
    const account = store.getStore('account')
    
     const { hash } = payload.content

    this._callDeployNFT(account,hash, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DEPLOY_FLASHLOAN_RETURNED, res)
    })
  }


    _callDeployNFT = async (account,hash, callback) => {

    const {mainnet: addresses} = require('../addresses')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const contractArifact = require('../buildSol/contracts/Curve.json');
    // const tokenContractAddress =  contractArifact.networks[networkId].address;
    const contractAbi = contractArifact.abi;
    const bytecode = contractArifact.bytecode;

    const NFTfactoryContract = new web3.eth.Contract(contractAbi,configdev.factory_nft)
   
    // console.log("flashloan1Contract", flashloan1Contract)
    // const payload = {
    //   data: bytecode,
    //   arguments: [
    //     addresses.aavelendingPool.solo,
    //     addresses.kyber.kyberNetworkProxy,
    //     addresses.uniswap.router,
    //     addresses.projectToken.YFRB,
    //      ]
    // }
    //



    let mint_price =  await NFTfactoryContract.methods.getCurrentPriceToMint().call();

  

    NFTfactoryContract.methods.mint(hash).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),value: mint_price})
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
         swal({
          title: "Creating your Sound Nft",
          text: "",
          icon: "success"
        })
         
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        console.log("contractAddress :"+ receipt.contractAddress)
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        // }
         

      })
      .on('receipt', function(receipt){
        console.log(receipt);

        console.log("contractAddress"+ receipt.contractAddress)
        emitter.emit(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, receipt.contractAddress )
        // dispatcher.dispatch({ type: DEPLOY_FLASHLOAN_RECEIPT, content: {} })

      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }



  claim = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')
    const { amount } = payload.content

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res)
      })
    })
  }

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(2);
    }

    claimContract.methods.claim(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimable = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_RETURNED)
    })
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        // return priceJSON.fast.toFixed(0)
        return priceJSON.standard.toFixed(2)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
 const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}
const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}

const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}





const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

 const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

 const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}


var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
