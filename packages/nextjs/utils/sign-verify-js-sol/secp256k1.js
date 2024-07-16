import { secp256k1 as secp } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { keccak_256 as keccak256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

// console.log('SIPPP KEY2 :: ', secp.etc.hexToBytes((process.env.SIPPP_APP_KEY as Hex).slice(2))); 

export function getAppPubKey() {
  const SIPPP_KEY_BYT = hexToBytes(process.env.SIPPP_APP_KEY.slice(2)); // as `0x${string}`
  const SIPPP_PUBKEY = secp.getPublicKey(SIPPP_KEY_BYT);

  console.log('SIPPP PUB KEY :: ', SIPPP_PUBKEY);
  return SIPPP_PUBKEY;
}

export async function appSign(message) {
  const messageHash = sha256(message);
  return await secp.sign(messageHash, hexToBytes(process.env.SIPPP_APP_KEY.slice(2)));
}

export function getAppAddress() {
  // Derive the Ethereum wallet address from the public key
  const SIPPP_PUBKEY = getAppPubKey();
  // const publicKeyBytes = SIPPP_PUBKEY; // Remove the '04' prefix
  const addressBytes = keccak256(SIPPP_PUBKEY).slice(-20); // Keccak hash and take last 20 bytes
  return `0x${bytesToHex(addressBytes)}`;
}

export function prepSignature(signature) {
  // Convert signature and messageHash to hex strings for readability
  const signatureHex = bytesToHex(signature);
  const messageHashHex = bytesToHex(messageHash);
  return signatureHex, messageHashHex;
}

// // const signature = await secp.signAsync(msgHash, sipppKey); // Sync methods below OLD?
// const signature = await secp.sign(msgHash, sipppKey); // Sync methods below
// const isValid = secp.verify(signature, msgHash, pubKey);
// console.log('IS VALID :: ', isValid)


// const recPubKey = signature.recoverPublicKey(hexToUint8Array(msgHash)).toRawBytes(); // Public key recovery
// console.log('RECOVERED PUBLIC KEY :: ', uint8ArrayToHex(recPubKey));


// let secpSig = secp.Signature.fromCompact(schnorrSig); // or .fromDER(sigDERHex)
// secpSig = secpSig.addRecoveryBit(0); // bit is not serialized into compact / der format
// const secpPubKey = secpSig.recoverPublicKey(secpSig.toCompactHex()).toRawBytes();
// console.log("SECP PUB KEY :: ", uint8ArrayToHex(secpPubKey));

// const pubKey = secp.getPublicKey(sipppKey);