import { ed25519 } from '@noble/curves/ed25519';

export function testEd25519() {
  const SIPPP_KEY = process.env.SIPPP_APP_KEY.slice(2) // as `0x${string}`
  // const priv = ed25519.utils.randomPrivateKey();

  const pub = ed25519.getPublicKey(SIPPP_KEY);

  const msg = new TextEncoder().encode('hello'); // Hex2Bytes line 46 of curves/abstract/utils.js

  const sig = ed25519.sign(msg, SIPPP_KEY);
  // verify() code on line 376 of @noble/curves/abstract/edwards.js
  console.log("ED25519 VERIFIED :: ",ed25519.verify(sig, msg, pub)) // Default mode: follows ZIP215
  // ed25519.verify(sig, msg, pub, { zip215: false }); // RFC8032 / FIPS 186-5
}