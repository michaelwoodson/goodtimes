
const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const {encrypt, decrypt} = require('./cipher');
const os = require('os');

module.exports.getPrivateKey = getPrivateKey;

async function getPrivateKey() {
  const CONFIG_FILE = path.join(os.homedir(), '.GoodStake.config');
  if (fs.existsSync(CONFIG_FILE)) {
    const encryptedPrivateKey = fs.readFileSync(CONFIG_FILE);
    const password = await secretPrompt('Enter password');
    return decrypt(encryptedPrivateKey, password.padEnd(32)).toString();
  } else {
    const privateKey = await secretPrompt('Enter account private key');
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
