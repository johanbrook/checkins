import CryptoJS from "crypto-js";

// Crypto functions (no bitcoin mining)

const SALT_LEN = 16;
const IV_LEN = SALT_LEN;
const KEY_SIZE = 256 / 32;
const ITERATIONS = 1_000;
const HASHER = CryptoJS.algo.SHA256;

/**
 * Encrypts a string with a passphrase using the AES algorithm. Returns the
 * cipher text encoded as base64.
 */
export const encrypt = (str: string, passphrase: string) => {
    const salt = CryptoJS.lib.WordArray.random(SALT_LEN);
    const iv = CryptoJS.lib.WordArray.random(IV_LEN);
    const key = CryptoJS.PBKDF2(passphrase, salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS,
        hasher: HASHER,
    });

    const cipher = CryptoJS.AES.encrypt(str, key, { iv }).ciphertext;

    return CryptoJS.lib.WordArray.create()
        .concat(salt)
        .concat(iv)
        .concat(cipher)
        .toString(CryptoJS.enc.Base64);
};

/**
 * Decrypts a base64 encoded string with a passphrase. Returns the decrypted
 * text as utf8 encoded string.
 */
export const decrypt = (str: string, passphrase: string) => {
    const wordArray = CryptoJS.enc.Base64.parse(str);

    // a word array is an array of numbers of 4 bytes. always divide each
    // slice by 4 = the length of each word.
    const salt = CryptoJS.lib.WordArray.create(
        wordArray.words.slice(0, SALT_LEN / 4)
    );
    const iv = CryptoJS.lib.WordArray.create(
        wordArray.words.slice(0 + SALT_LEN / 4, (SALT_LEN + IV_LEN) / 4)
    );

    const key = CryptoJS.PBKDF2(
        passphrase,
        salt,
        {
            keySize: KEY_SIZE,
            iterations: ITERATIONS,
            hasher: HASHER,
        }
    );

    const dec = CryptoJS.AES.decrypt(CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.lib.WordArray.create(
            wordArray.words.slice((SALT_LEN + IV_LEN) / 4)
        ),
    }), key, { iv });

    return dec.toString(CryptoJS.enc.Utf8);
}

/**
 * Hash a string with HMAC, returns the result encoded as base64.
 */
export const hash = (str: string, key: string): string =>
    CryptoJS.HmacSHA256(str, key).toString(CryptoJS.enc.Base64);
