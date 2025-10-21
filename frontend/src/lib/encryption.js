import CryptoJS from "crypto-js";

const AES_SECRET = import.meta.env.AES_SECRET_FRONTEND;

// Converts hex string to CryptoJS WordArray
function hexToWordArray(hexStr) {
  return CryptoJS.enc.Hex.parse(hexStr);
}

export function decryptText(encryptedText) {
  if (!encryptedText) return "";

  try {
    const [ivHex, cipherText] = encryptedText.split(":");
    if (!ivHex || !cipherText) return encryptedText; // fallback if format is wrong

    const key = CryptoJS.enc.Utf8.parse(AES_SECRET); // still plain secret, not scrypt
    const iv = hexToWordArray(ivHex);

    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText || encryptedText; // fallback if decryption fails
  } catch (err) {
    console.warn("Decryption failed:", err);
    return encryptedText; // return original to avoid crash
  }
}
