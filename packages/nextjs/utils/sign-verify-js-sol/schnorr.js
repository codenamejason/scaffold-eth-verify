import { schnorr } from '@noble/curves/secp256k1';

console.log(" ");
console.log(" ::: TESTING SCHNORR ::: ");
console.log(" ");

export function schnorrSign(privateKey, message) {
  const msgHex = uint8ArrayToHex(message); // const schnorrMsg = new TextEncoder().encode('hello world');
  return schnorr.sign(msgHex, privateKey);
}

export function getSchnorrPubKey(privateKey) {
  const schnorrPubKey = schnorr.getPublicKey(privateKey);
  console.log("SCHNORR PUB KEY :: ", uint8ArrayToHex(schnorrPubKey));
  return schnorrPubKey;
}


// const schnorrValid = schnorr.verify(schnorrSig, schnorrMsg, schnorrPubKey);
// console.log(" ");
// console.log(" ::: TESTING SCHNORR ::: ");