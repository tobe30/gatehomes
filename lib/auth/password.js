import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const DERIVED_KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, DERIVED_KEY_LENGTH, {
    maxmem: MAX_MEMORY,
  });

  return `${salt.toString("hex")}:${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex, extra] = String(storedHash ?? "").split(":");
  if (!saltHex || !hashHex || extra !== undefined) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  if (salt.length !== 16 || expected.length !== DERIVED_KEY_LENGTH) return false;

  const actual = Buffer.from(
    await scrypt(password, salt, DERIVED_KEY_LENGTH, { maxmem: MAX_MEMORY }),
  );

  return timingSafeEqual(actual, expected);
}
