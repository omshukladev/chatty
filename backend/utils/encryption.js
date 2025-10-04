import crypto from "crypto";

const algorithm = "aes-256-cbc"; // AES algorithm

// Generate a 32-byte key from your secret
const key = crypto.scryptSync(process.env.AES_SECRET, "salt", 32);

// Encrypt function
export function encryptText(text) {
  const iv = crypto.randomBytes(16); // random initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv); // crypto.createCipheriv(algorithm, key, iv) → encrypt
  let encrypted = cipher.update(text, "utf8", "hex");  //Take my plain text (utf8 string) → encrypt it → give me back the result as a hexadecimal string. utf8 (input encoding), hex (output encoding)
  encrypted += cipher.final("hex");
  // store iv + encrypted together
  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function
export function decryptText(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":"); // split the iv and encrypted text
  const decipher = crypto.createDecipheriv( // crypto.createDecipheriv(algorithm, key, iv) → decrypt 
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8"); // Take my encrypted text (hex string) → decrypt it → give me back the result as a utf8 string. hex (input encoding), utf8 (output encoding)
  decrypted += decipher.final("utf8"); // utf8 (output encoding)
  return decrypted;
}