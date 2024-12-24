import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

export async function createKeys() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: "SHA-256" },
        },
        true,
        ["encrypt", "decrypt"]
    );

    const publicKey = await exportKeyToPEM(keyPair.publicKey, "spki");
    const privateKey = await exportKeyToPEM(keyPair.privateKey, "pkcs8");

    const encoder = new TextEncoder();
    const privateKeyBuffer = encoder.encode(privateKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", privateKeyBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

    const mnemonic = bip39.entropyToMnemonic(hashHex);

    return {
        publicKey,
        privateKey,
        mnemonic,
    };
}

async function exportKeyToPEM(key, format) {
    const exported = await crypto.subtle.exportKey(format, key);
    const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
    const exportedAsBase64 = btoa(exportedAsString);

    const keyType = format === "spki" ? "PUBLIC" : "PRIVATE";
    return `-----BEGIN ${keyType} KEY-----\n${exportedAsBase64.match(/.{1,64}/g).join("\n")}\n-----END ${keyType} KEY-----`;
}
