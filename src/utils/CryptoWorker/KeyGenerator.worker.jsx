import forge from 'node-forge'
import { GenerationState, GenerationType } from './WorkerEnums'

// DO NOT REMOVE!!!!!
/* eslint-env worker */
/* eslint-disable no-restricted-globals */

if ('function' === typeof importScripts) {

    function generateKeys(prng) {
        // var creationState = forge.pki.rsa.createKeyPairGenerationState(2048, prng);
        // var step = function () {
        //     // run for 1000 ms
        //     if (!forge.pki.rsa.stepKeyPairGenerationState(creationState, 1000)) {
        //         setTimeout(step, 1);
        //         self.postMessage({ state: GenerationState.IN_PROGRESS });
        //     } else {
        //         const private_key = forge.pki.privateKeyToPem(creationState.keys.privateKey);
        //         const public_key = forge.pki.publicKeyToPem(creationState.keys.publicKey);
        //         self.postMessage({ state: GenerationState.COMPLETE, keys: { privateKey: private_key, publicKey: public_key } });
        //     }
        // };
        // setTimeout(step);

        let keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, prng: prng });
        const private_key = forge.pki.privateKeyToPem(keyPair.privateKey);
        const public_key = forge.pki.publicKeyToPem(keyPair.publicKey);
        self.postMessage({ state: GenerationState.COMPLETE, keys: { privateKey: private_key, publicKey: public_key } });
    }

    self.onmessage = async (event) => {
        switch (event.data.action) {
            case GenerationType.SHUTDOWN: {
                self.close();
                break;
            }
            case GenerationType.FROM_HEX: {
                const prng = forge.random.createInstance();
                prng.seedFileSync = () => forge.util.hexToBytes(event.data.data.seedHex);
                generateKeys(prng);
                break;
            }

            default: {
                const randomSeed = forge.util.bytesToHex(forge.random.getBytesSync(32));
                const prng = forge.random.createInstance();
                prng.seedFileSync = () => forge.util.hexToBytes(randomSeed);
                generateKeys(prng);
                break;
            }
        }
    }
}