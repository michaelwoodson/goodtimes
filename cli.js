#!/usr/bin/env node

const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const moment = require('moment');
const UBIABI = require('./UBIABI.json');
const ERC20ABI = require('./ERC20ABI.json');
const {getPrivateKey} = require('./utils');
const cron = require('node-cron');

(async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.fuse.io/'));
  const mainAccount = web3.eth.accounts.privateKeyToAccount(await getPrivateKey());
  web3.eth.defaultAccount = mainAccount;
  await claim(web3, mainAccount);
  const randomMinute = Math.floor(Math.random() * 60);
  const randomSecond = Math.floor(Math.random() * 60);
  console.log('');
  console.log(`Claim offset set to: ${randomMinute}:${String(randomSecond).padStart(2, '0')}`);
  console.log('Offset is to avoid higher transaction fees/instability if everyone claims at once.')
  console.log('');
  console.log('Make sure to buy some gas:')
  console.log('https://git.io/JtXAb');
  console.log('');
  console.log('Will automatically claim G$ every day if this script is left running.');
  console.log('WARNING: this will only work if this computer is kept awake e.g. used for mining or a server.')
  cron.schedule(`${randomSecond} ${randomMinute} 0 * * *`, () => claim(web3, mainAccount), {timezone: "Europe/London"});
})();

async function claim(web3, mainAccount) {
  const ubiContractAddress = '0xD7aC544F8A570C4d8764c3AAbCF6870CBD960D0D';
  const ubiContract = new web3.eth.Contract(UBIABI,ubiContractAddress, {from: mainAccount.address, chainId: 122});
  const claimAmount = await ubiContract.methods.checkEntitlement.call().then(_ => _.toNumber());
  if (claimAmount > 0) {
    console.log(`Claiming: ${claimAmount/100} G$`);
    try {
      const claimResult = await sendTransaction(web3, ubiContract.methods.claim(), ubiContractAddress, mainAccount);
      console.log('UBI collected.');
      await printNextClaimDate(web3, mainAccount, ubiContract);
    } catch (e) {
      console.error('Claim failed, try using the website wallet.', e);
    }
  } else {
    await printNextClaimDate(web3, mainAccount, ubiContract);
  }
}

async function printNextClaimDate(web3, mainAccount, ubiContract) {
  const erc20Contract = new web3.eth.Contract(ERC20ABI,'0x495d133B938596C9984d462F007B676bDc57eCEC', {from: mainAccount.address, chainId: 122});
  const startRef = await ubiContract.methods.periodStart.call().then(_ => moment(_.toNumber() * 1000))
  const curDay = await ubiContract.methods.currentDay.call().then(_ => _.toNumber())
  startRef.add(curDay + 1, 'days')
  console.log(`Next claim will be: ${startRef.format('lll')}`);
  const balance = await erc20Contract.methods.balanceOf(mainAccount.address).call().then(_ => _.toNumber());
  console.log(`Balance: ${balance/100} G$`);
}

async function sendTransaction(web3, call, to, mainAccount) {
  const gas = (await call.estimateGas().catch(e => console.log('estimate gas failed ', e))) || 200000;
  const gasPrice = (await web3.eth.getGasPrice().then(Web3Utils.toBN)).toString();
  const tx = {gas: gas*2, gasPrice, from: mainAccount.address, data: call.encodeABI(), to};
  const signedTx = await web3.eth.accounts.signTransaction(tx, mainAccount.privateKey);
  const results = await new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', h => {
        resolve(h);
      })
      .on('error', e => {
        console.log('sendTransaction error: ', e);
        reject(e);
      });
  });
  return results;
}
