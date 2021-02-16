
const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const {encrypt, decrypt} = require('./cipher');
const os = require('os');
const { exit } = require('process');
const Web3 = require('web3');

module.exports.getPrivateKey = getPrivateKey;

async function getPrivateKey() {
  const CONFIG_FILE = path.join(os.homedir(), '.GoodTimes.config');
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const encryptedPrivateKey = fs.readFileSync(CONFIG_FILE);
      const password = await secretPrompt('Enter password');
      return decrypt(encryptedPrivateKey, password.padEnd(32)).toString();
    } catch (e) {
      console.log(`Wrong password. Try again or delete ${CONFIG_FILE} to reset.`);
      exit(1);
    }
  } else {
    console.log('Find your private key in the "Export Wallet" section of the GoodDollar wallet.');
    const privateKey = await secretPrompt('Enter private key');
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.fuse.io/'));
      web3.eth.accounts.privateKeyToAccount(privateKey);
    } catch (e) {
      console.log('Oops, that\'s not a private key!');
      exit(1);
    }
    const password = await secretPrompt('Enter a password');
    const encrypted = encrypt(privateKey, password.padEnd(32));
    fs.writeFileSync(CONFIG_FILE, encrypted, {flag: 'a+'});
    return privateKey;
  }
}

async function secretPrompt(description) {
  return await new Promise((resolve, reject) => {
    prompt.get([{
      name: 'result',
      description,
      hidden: true,
      replace: '*'
    }], (err, {result}) => {
      if (err) {
        reject(err);
      } else {
        resolve(result)
      }
    });
  });
}
