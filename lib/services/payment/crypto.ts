import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const KEY_ENV = "BCH_ENCRYPTION_KEY";
const MNEMONIC_ENV = "BCH_WALLET_MNEMONIC_ENCRYPTED";

function getEncryptionKey(): Buffer {
  const keyHex = process.env[KEY_ENV];
  if (!keyHex) {
    throw new Error(`${KEY_ENV} is not set in .env`);
  }
  if (keyHex.length !== 64) {
    throw new Error(`${KEY_ENV} must be a 32-byte hex string`);
  }
  return Buffer.from(keyHex, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(16);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const parts = ciphertext.split(":");

  if (parts.length !== 3) {
    throw new Error(
      "Invalid ciphertext format. " + "Expected iv:authTag:encrypted",
    );
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
}

export function getMnemonic(): string {
  const ciphertext = process.env[MNEMONIC_ENV];

  if (!ciphertext) {
    throw new Error(`${MNEMONIC_ENV} is not set in .env`);
  }

  try {
    return decrypt(ciphertext);
  } catch {
    throw new Error(
      "Failed to decrypt mnemonic. " + "Check BCH_ENCRYPTION_KEY is correct.",
    );
  }
}
