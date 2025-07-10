import crypto from "crypto"
import { IV_LENGTH, REFRESH_TOKEN_ENCRYPTION_KEY } from "src/config";

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(Number(IV_LENGTH));
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(REFRESH_TOKEN_ENCRYPTION_KEY as string, "hex"), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const decrypt = (text: string): string => {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(REFRESH_TOKEN_ENCRYPTION_KEY as string), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}