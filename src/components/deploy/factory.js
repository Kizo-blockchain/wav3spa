import web3 from 'web3'

import FlashLoanFactory from './factory.json';

const instance = new web3.eth.Contract(FlashLoanFactory,'0xdA61D0e2BC742D2B0264CC8bf960d47c33405117')


export default instance;