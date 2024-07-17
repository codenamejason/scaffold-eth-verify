import { secp256k1 as Secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 as keccak256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

// Function to derive the Ethereum address from a private key
export function deriveEthereumAddress() {
  // Example private key (Use your actual private key here)
  const privateKeyHex = process.env.SIPPP_APP_KEY.slice(2);

  // Step 1: Convert the private key from hex to a Uint8Array
  const privateKey = hexToBytes(privateKeyHex);

  // Step 2: Derive the public key (in bytes format)
  const publicKey = Secp256k1.getPublicKey(privateKey);

  // Step 3: Remove the uncompressed prefix (0x04)
  const publicKeyNoPrefix = publicKey.slice(1);

  // Step 4: Hash the public key without the prefix using Keccak-256
  const addressBytes = keccak256(publicKeyNoPrefix).slice(-20); // Take last 20 bytes

  // Step 5: Convert the address bytes to a hexadecimal string
  const address = `0x${bytesToHex(addressBytes)}`;

  return address;
}
