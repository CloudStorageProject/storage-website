import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import forge from 'node-forge'
// import primeWorker from './prime.worker.js';
window.Buffer = Buffer;

function generateKeys(prng) {
    // https://github.com/digitalbazaar/forge/issues/959
    // let keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 10, prng: prng }, async function callback(error, keyPair) {
    //     const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    //     const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    //     console.log("Key Original:", privateKeyPem, publicKeyPem);
    // });

    let keyPair = forge.pki.rsa.generateKeyPair({ bits: 4096, workers: 10, prng: prng });
    return { privateKey: forge.pki.privateKeyToPem(keyPair.privateKey), publicKey: forge.pki.publicKeyToPem(keyPair.publicKey) };
}

export function createKeys(setSecrets) {
    const randomSeed = forge.util.bytesToHex(forge.random.getBytesSync(32));
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => forge.util.hexToBytes(randomSeed);
    const { privateKey, publicKey } = generateKeys(prng);
    setSecrets({ privateKey, publicKey, mnemonic: bip39.entropyToMnemonic(randomSeed) });
}

export function generateKeysFromSecrets(mnemonic, setSecrets) {
    const joined_mnemonic = mnemonic.join(' ');
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => forge.util.hexToBytes(bip39.mnemonicToEntropy(joined_mnemonic));
    const { privateKey, publicKey } = generateKeys(prng);
    setSecrets({ privateKey, publicKey, mnemonic: joined_mnemonic });
}

export function signMessage(message, privateKey) {
    const privateKeyPem = forge.pki.privateKeyFromPem(privateKey);
    let md = forge.md.sha1.create();
    md.update(message, 'utf8');
    let signature = privateKeyPem.sign(md);
    return signature;
}