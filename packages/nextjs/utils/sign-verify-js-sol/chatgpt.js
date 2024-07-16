import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { keccak_256 as keccak256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export async function signMessageWithPrivateKey() {
  
  const message = Buffer.from('hello world');
  const privateKeyHex = process.env.SIPPP_APP_KEY; //.slice(2);
  console.log("privateKeyHex :: ",privateKeyHex);

  // Convert the private key from hex to a Uint8Array
  const privateKey = hexToBytes(privateKeyHex.slice(2));
  console.log("privateKey :: ",privateKey);

  // Derive the public key (in bytes format)
  const publicKey = secp256k1.getPublicKey(privateKey);
  console.log("publicKey :: ",publicKey);

  // Convert the public key to a hexadecimal string
  const publicKeyHex = bytesToHex(publicKey.slice(1));
  console.log("publicKeyHex :: ",publicKeyHex);

  // Hash the message
  const messageHash = sha256(message);
  console.log("messageHash :: ",messageHash);

  // Pad the message hash to bytes32
  const messageHashBuffer = Buffer.alloc(32);
  Buffer.from(messageHash).copy(messageHashBuffer);
  console.log("messageHashBuffer :: ",messageHashBuffer);

  // Sign the message hash
  const signature = await secp256k1.sign(messageHash, privateKey);
  console.log("signature :: ",signature);

  // Convert r and s from BigInt to Uint8Array
  const rBytes = bigintToBytes(signature.r, 32);
  const sBytes = bigintToBytes(signature.s, 32);

  // Convert the signature to a hexadecimal string
  const rHex = bytesToHex(rBytes);
  const sHex = bytesToHex(sBytes);
  // const vHex = signature.v.toString(16).padStart(2, '0'); // v is typically an integer
  const vHex = signature.recovery.toString(16).padStart(2, '0'); // recovery is typically an integer

  const signatureHex = `${rHex}${sHex}${vHex}`;
  console.log("signatureHex :: ",signatureHex);

  // Derive the Ethereum wallet address from the public key
  const addressBytes = keccak256(publicKey.slice(1)).slice(-20); // Remove the first byte which is the prefix
  const address = `0x${bytesToHex(addressBytes)}`;
  console.log("addressBytes :: ",addressBytes);
  console.log("address :: ",address);

  const messageHashHex = bytesToHex(messageHashBuffer);
  console.log("messageHashHex :: ",messageHashHex);

  return {
    messageHash: messageHashBuffer,
    signature: Buffer.from(signatureHex, 'hex'),
    signerAddress: address
  };
}

function bigintToBytes(bn, length) {
  let hex = bn.toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  const bytes = new Uint8Array(length);
  for (let i = 0, j = 0; i < length; ++i, j += 2) {
    bytes[i] = parseInt(hex.slice(j, j + 2), 16);
  }
  return bytes;
}


// // Example private key (Use your actual private key here)
// const privateKeyHex = process.env.SIPPP_APP_KEY.slice(2); // 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
// // Run the function with 'hello world'
// signMessageWithPrivateKey(Buffer.from('hello world'), privateKeyHex).then(({ messageHash, signature, signerAddress }) => {
//   console.log('CHAT GPT OUT ::',{
//     messageHash,
//     signature,
//     signerAddress
//   });
// });
