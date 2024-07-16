import shajs from 'sha.js';

console.log(" ::: TESTING SHA HASHING ::: ");
console.log(" ");
// sha256 of 'hello world'
const msgHash = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
const msgHashSha = shajs('sha256').update('hello world').digest('hex');
console.log('MSG HASH :::::: ', msgHash);
console.log('MSG HASH SHA :: ', msgHashSha);

const sipppKey = hexToUint8Array((process.env.SIPPP_APP_KEY).slice(2));