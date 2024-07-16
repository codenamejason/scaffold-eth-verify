//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
// pragma solidity ^0.4.23;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// import {SignatureUtils} from "solidity-sigutils/contracts/SignatureUtils.sol";

contract SipppAES {

  address private PUBLIC_KEY;
	constructor(address _publicKey) {
		PUBLIC_KEY = _publicKey;
	}

  bytes32 private _r;
  bytes32 private _s;
  uint8 private _v;

  // TRANSACTION DATA {"photoHash": "QmPetBdYiPPA83QZX81YZhj15oCtaYAyRUjfxgtwP8quuf", "pinSize": 2584998, "pinTime": "2024-06-30T19:38:55.039Z", "signedPhotoHash": "0x680e50670d09c45703c30470ac1c16a1210ea53f5572f845e57624ffd6678d6f27a84e2d1b27c80c248ba266c3e6f1e8b5c5d89fa65928cd163eaa47521860f51c", "timestamp": "2024-06-30T19:38:56.687Z"}
  string photoHex = "0x516d586e7366485a6774437131764572453251584a6974777357574e646d7a50437876414a76704275776e6a5751";
  string signedPhotoHex = "0x07735909f405a0c34a6361aa7203b3d9eea98c258f3370a15148e198a53640676e2b447680625c819696c77d49c6ad85ccec7c56be19eecd898ff4e94cbf6de21b";

  event Verified(bool verified);
  event PublicKey(address publicKey);

  function verifySignedHashIsSipppSigned(bytes32 data, bytes memory signature) public returns (bool verified) {

    (_r, _s, _v) = splitSignature(signature);
    verified = verifySignatureWithPublicKey(PUBLIC_KEY, data, _v, _r, _s);
    emit Verified(verified);
    return verified;
  }

  function verifySippp(
    bytes32 messageHash, 
    bytes memory signature, 
    address signer
  ) 
    public pure returns (bool) 
  {
    bytes32 r;
    bytes32 s;
    uint8 v;

    // Check the signature length
    if (signature.length != 65) {
        return false;
    }

    // Divide the signature in r, s and v variables
    assembly {
        r := mload(add(signature, 32))
        s := mload(add(signature, 64))
        v := byte(0, mload(add(signature, 96)))
    }

    // Version of signature should be 27 or 28
    if (v < 27) {
        v += 27;
    }

    if (v != 27 && v != 28) {
        return false;
    }

    // If the signature is valid, the address recovered from it should match the given address
    return ecrecover(messageHash, v, r, s) == signer;
  }

  // /// @notice Extracts the r, s, and v parameters to `ecrecover(...)` from the signature at position `_pos` in a densely packed signatures bytes array.
  // /// @dev Based on [OpenZeppelin's ECRecovery](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ECRecovery.sol)
  // /// @param _signatures The signatures bytes array
  // /// @param _pos The position of the signature in the bytes array (0 indexed)
  // function parseSignature(bytes memory _signatures, uint _pos) pure internal returns (uint8 v, bytes32 r, bytes32 s) {
  //   uint offset = _pos * 65;

  //   // Ensure _signatures length is sufficient
  //   require(_signatures.length >= offset + 65, "Signature length too short");

  //   assembly {
  //     // Load 32 bytes from _signatures[offset+32] into r
  //     r := mload(add(_signatures, add(32, offset)))
  //     // Load 32 bytes from _signatures[offset+64] into s
  //     s := mload(add(_signatures, add(64, offset)))
  //     // Load 1 byte from _signatures[offset+65] into v
  //     // v := byte(0, mload(add(_signatures, add(96, offset))))
  //     v := and(mload(add(_signatures, add(65, offset))), 0xff)
  //   }

  //   // EIP-2: If v is 0 or 1, it should be treated as 27 or 28 correspondingly
  //   if (v < 27) {
  //     v += 27;
  //   }

  //   // Ensure v is either 27 or 28 (for Ethereum's signature scheme)
  //   require(v == 27 || v == 28, "Invalid signature recovery identifier");

  //   // Return v, r, s
  //   return (v, r, s);
  // }

  function splitSignature(bytes memory signature) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
    require(signature.length == 65, "Invalid signature length");

    assembly {
      // First 32 bytes (r)
      r := mload(add(signature, 32))
      // Next 32 bytes (s)
      s := mload(add(signature, 64))
      // Last byte (v)
      v := byte(0, mload(add(signature, 96)))
    }

    // EIP-2: If v is 0 or 1, it should be treated as 27 or 28 correspondingly
    if (v < 27) {
      v += 27;
    }
    return (r, s, v);
  }

	function verifySignatureWithPublicKey(address expectedPublicKey, bytes32 dataHash, uint8 v, bytes32 r, bytes32 s) internal returns (bool) {
    // bytes32 hash = hashData(data);
    address actualPublicKey = recoverPublicKey(dataHash, v, r, s);
    emit PublicKey(actualPublicKey);
    emit PublicKey(expectedPublicKey);
    return (actualPublicKey == expectedPublicKey);
  }

  // // function verifyPublicKey(address expectedPublicKey, bytes memory data, uint8 v, bytes32 r, bytes32 s) internal returns (bool) {
  // //   bytes32 hash = hashData(data);
  // //   address actualPublicKey = recoverPublicKey(hash, v, r, s);
  // //   emit PublicKey(actualPublicKey);
  // //   emit PublicKey(expectedPublicKey);
  // //   return (actualPublicKey == expectedPublicKey);
  // // }

  function recoverPublicKey(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
    bytes32 eip712MessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    // bytes32 hash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), msg.value, nonce, payload));
    // bytes32 eip712MessageHash = keccak256(abi.encodePacked(hash));

    // Recover public key from signature
    // Using ecrecover to get the public key
    // v needs to be adjusted for Ethereum's specification (27 or 28)
    address publicKey = ecrecover(eip712MessageHash, v, r, s);
    return publicKey;
  }

  function hashData(bytes memory data) internal pure returns (bytes32) {
    return keccak256(data);
  }

}
