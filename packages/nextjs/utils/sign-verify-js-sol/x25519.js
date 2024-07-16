import { x25519 } from '@noble/curves/ed25519';

console.log("X25519 PUB KEY :: ", uint8ArrayToHex(x25519.getPublicKey(sipppKey)));