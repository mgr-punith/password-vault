export interface EncryptedData {
  ciphertext: string;
  iv: string;
}

export async function deriveKeyFromPassphrase(
  passphrase: string
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("vault-app-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptVaultData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  key: CryptoKey
): Promise<EncryptedData> {
  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );

    const result = {
      ciphertext: bufferToBase64(new Uint8Array(ciphertext)),
      iv: bufferToBase64(iv),
    };

    return result;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

export async function decryptVaultData(
  encrypted: EncryptedData,
  key: CryptoKey
): Promise<unknown> {
  try {
    if (!encrypted.ciphertext || !encrypted.iv) {
      throw new Error("Missing ciphertext or iv");
    }

    const ivArray = base64ToBuffer(encrypted.iv);
    const ciphertextArray = base64ToBuffer(encrypted.ciphertext);

    const iv = new Uint8Array(ivArray);
    const ciphertext = new Uint8Array(ciphertextArray);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    const decoded = new TextDecoder().decode(decrypted);

    return JSON.parse(decoded);
  } catch (error) {
    console.error("Decryption error details:", {
      error,
      encrypted,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error(
      "Failed to decrypt vault data. The data may be corrupted or the key is incorrect."
    );
  }
}

function bufferToBase64(buffer: Uint8Array): string {
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  if (!base64 || typeof base64 !== "string") {
    throw new Error("Invalid base64 input: must be a non-empty string");
  }

  const cleanBase64 = base64.trim();

  try {
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  } catch (error) {
    console.error("Base64 decode error:", {
      base64Sample: cleanBase64.substring(0, 50),
      error,
    });
    throw new Error("Invalid base64 string");
  }
}