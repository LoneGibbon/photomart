// Utility for securely saving and retrieving data from localStorage
// using AES encryption provided by crypto-js

import CryptoJS from "crypto-js";

// Secret key used for encryption/decryption
// ⚠️ In production, use a more secure key and store it safely (not hardcoded)
const SECRET_KEY = "a27bct2o91nch";

/**
 * Encrypts and saves a value into localStorage under the given key.
 *
 * @param {string} key - The localStorage key to store the encrypted value under.
 * @param {any} value - The JavaScript value to encrypt and store (objects, strings, etc).
 */
export const setEncryptedItem = (key, value) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET_KEY
  ).toString();
  localStorage.setItem(key, encrypted);
};

/**
 * Retrieves and decrypts a value from localStorage for the given key.
 *
 * @param {string} key - The localStorage key to retrieve the encrypted value from.
 * @returns {any|null} - Returns the decrypted JavaScript value, or null if decryption fails.
 */
export const getDecryptedItem = (key) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null; // No data found

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null; // Protect against corrupt data
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption error:", e);
    return null;
  }
};
