import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import forge from 'node-forge'
import { GenerationState, GenerationType } from "./CryptoWorker/WorkerEnums";

try {
    window.Buffer = Buffer;
} catch (error) {
    // console.error("Probably in worker: ", error);
}
const worker = new Worker(new URL('./CryptoWorker/KeyGenerator.worker.jsx', import.meta.url), { name: "KeyGenerator" });


async function generateKeys(action, data, callback) {
    // https://github.com/digitalbazaar/forge/issues/959
    // let keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 10, prng: prng }, async function callback(error, keyPair) {
    //     const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    //     const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    //     console.log("Key Original:", privateKeyPem, publicKeyPem);
    // });

    return new Promise((resolve, reject) => {
        worker.postMessage({ action: action, data: data });
        worker.onmessage = (event) => {
            if (event.data.state === GenerationState.COMPLETE) {
                resolve({ keys: generateKeysFromPem(event.data.keys.privateKey, event.data.keys.publicKey) });
            } else {
                console.log(event.data.state);
            }
        }
    });

    // let keyPair = forge.pki.rsa.generateKeyPair({ bits: 4096, workers: 10, prng: prng });
    // return { privateKey: keyPair.privateKey, publicKey: keyPair.publicKey };
}

export async function createKeys() {
    const randomSeed = forge.util.bytesToHex(forge.random.getBytesSync(32));
    let mnemonic = bip39.entropyToMnemonic(randomSeed);
    return await generateKeys(GenerationType.FROM_HEX, { seedHex: mnemonic }).then((state) => {
        return { keyPair: state.keys, mnemonic: mnemonic };
    });
}

export function generateKeysFromPem(privateKeyPem, publicKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    return { privateKey, publicKey };
}

export function generateKeysFromPemBuffer(privateKeyPem, publicKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(Buffer.from(privateKeyPem, "base64").toString("utf-8"));
    const publicKey = forge.pki.publicKeyFromPem(Buffer.from(publicKeyPem, "base64").toString("utf-8"));
    return { privateKey, publicKey };
}

export function exportPublicKeyFromPem(publicKeyPem) {
    return forge.pki.publicKeyFromPem(Buffer.from(publicKeyPem, "base64").toString("utf-8"));
}

export function exportPrivateKeyFromPem(privateKeyPem) {
    return forge.pki.privateKeyFromPem(Buffer.from(privateKeyPem, "base64").toString("utf-8"));
}

export function exportPublicKeyToBase64(publicKey) {
    return Buffer.from(forge.pki.publicKeyToPem(publicKey), "utf-8").toString("base64");
}

export function exportPrivateKeyToBase64(privateKey) {
    return Buffer.from(forge.pki.privateKeyToPem(privateKey), "utf-8").toString("base64");
}

export async function generateKeysFromSecrets(mnemonic) {
    if (!Array.isArray(mnemonic) && typeof mnemonic !== "string") {
        return null;
    } else if (typeof mnemonic !== "string") {
        mnemonic = mnemonic.join(" ");
    }
    return await generateKeys(GenerationType.FROM_HEX, { seedHex: mnemonic }).then((state) => {
        return { keyPair: state.keys, mnemonic: mnemonic };
    });
}

export function signMessage(message, privateKey) {
    let md = forge.md.sha256.create();
    md.update(message, 'utf8');
    return privateKey.sign(md);
}

export function verifyMessage(message, signature, publicKey) {
    let md = forge.md.sha256.create();
    md.update(message, 'utf8');
    return publicKey.verify(md.digest().bytes(), signature);
}

export function encryptData(data, publicKey) {
    const AES_KEY = forge.random.getBytesSync(32);
    const AES_IV = forge.random.getBytesSync(16);

    var cipher = forge.cipher.createCipher('AES-CBC', AES_KEY);
    cipher.start({ iv: AES_IV });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();

    const encryptedKey = publicKey.encrypt(AES_KEY, 'RSA-OAEP');
    const encryptedIV = publicKey.encrypt(AES_IV, 'RSA-OAEP');

    return {
        data: Buffer.from(cipher.output.getBytes(), "binary").toString("base64"),
        iv: Buffer.from(encryptedIV, "binary").toString("base64"),
        key: Buffer.from(encryptedKey, "binary").toString("base64")
    };
}

export function decryptData(data, privateKey, { iv, key }) {
    const AES_KEY = privateKey.decrypt(Buffer.from(key, "base64").toString("binary"), 'RSA-OAEP');
    const AES_IV = privateKey.decrypt(Buffer.from(iv, "base64").toString("binary"), 'RSA-OAEP');

    var decipher = forge.cipher.createDecipher('AES-CBC', AES_KEY);
    decipher.start({ iv: AES_IV });
    decipher.update(forge.util.createBuffer(Buffer.from(data, "base64").toString("binary")));
    decipher.finish();

    return Buffer.from(decipher.output.getBytes(), "binary");
}