
import { Buffer } from 'buffer';
import forge from 'node-forge'
window.Buffer = Buffer;
import { createKeys, decryptData, encryptData, generateKeysFromSecrets, signMessage, verifyMessage } from '../utils/Cryptography'


const original = await createKeys().then((data) => data);
console.log("Original privateKey:", original.keyPair.privateKey);
console.log("Original publicKey:", original.keyPair.publicKey);
console.log("Original mnemonic:", original.mnemonic);

test('Test exporting and importing private key from mnemonic', async () => {
    const mnemonic = original.mnemonic;

    const recreated = await generateKeysFromSecrets(mnemonic.split(" ")).then((data) => data);
    console.log("Recreated privateKey:", recreated.keyPair.privateKey);
    console.log("Recreated publicKey:", recreated.keyPair.publicKey);
    console.log("Recreated mnemonic:", recreated.mnemonic);

    expect(forge.pki.privateKeyToPem(original.keyPair.privateKey)).toBe(forge.pki.privateKeyToPem(recreated.keyPair.privateKey));
    expect(forge.pki.publicKeyToPem(original.keyPair.publicKey)).toBe(forge.pki.publicKeyToPem(recreated.keyPair.publicKey));
    expect(original.mnemonic).toBe(recreated.mnemonic);

});


test('Test message sign and verify', () => {
    const message = "2132312123:gfewrfghh34f34gfv34g"

    const signed = signMessage(message, original.keyPair.privateKey);
    console.log("Signed message:", signed);

    const verified = verifyMessage(message, signed, original.keyPair.publicKey);
    console.log("Verified message:", verified);

    expect(verified).toBe(true);
});


test('Test message encrypt and decrypt', () => {
    const message = "Test messsage!!";

    const encrypted = encryptData(message, original.keyPair.publicKey);
    console.log("Encrypted message:", encrypted);

    const decrypted = decryptData(encrypted, original.keyPair.privateKey);
    console.log("Decrypted message:", decrypted);

    expect(decrypted).toBe(message);
});