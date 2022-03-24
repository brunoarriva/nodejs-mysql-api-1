const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'S3cr3tKeySensitiveDataEncrypt123';
const iv = crypto.randomBytes(16);

module.exports = {
  encrypt: (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
    };
  },
};
