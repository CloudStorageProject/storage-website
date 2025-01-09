import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import forge from 'node-forge'
window.Buffer = Buffer;

function generateKeys(prng) {
    // https://github.com/digitalbazaar/forge/issues/959
    // let keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 10, prng: prng }, async function callback(error, keyPair) {
    //     const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    //     const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    //     console.log("Key Original:", privateKeyPem, publicKeyPem);
    // });
    let keyPair = forge.pki.rsa.generateKeyPair({ bits: 4096, workers: 10, prng: prng });
    return { privateKey: keyPair.privateKey, publicKey: keyPair.publicKey };
}

export function createKeys() {
    const randomSeed = forge.util.bytesToHex(forge.random.getBytesSync(32));
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => forge.util.hexToBytes(randomSeed);
    return { keyPair: generateKeys(prng), mnemonic: bip39.entropyToMnemonic(randomSeed) };
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

export function exportPublicKeyToBase64(publicKey) {
    return Buffer.from(forge.pki.publicKeyToPem(publicKey), "utf-8").toString("base64");
}

export function exportPrivateKeyToBase64(privateKey) {
    return Buffer.from(forge.pki.privateKeyToPem(privateKey), "utf-8").toString("base64");
}

export function generateKeysFromSecrets(mnemonic) {
    const joined_mnemonic = mnemonic.join(' ');
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => forge.util.hexToBytes(bip39.mnemonicToEntropy(joined_mnemonic));
    let keyPair = generateKeys(prng);
    return { keyPair, mnemonic: joined_mnemonic };
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
    return publicKey.encrypt(data);
}

export function decryptData(data, privateKey) {
    return privateKey.decrypt(data);
}