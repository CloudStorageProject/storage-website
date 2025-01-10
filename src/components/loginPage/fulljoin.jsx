import React, { useEffect, useState } from 'react';
import bgimg from '../img/greenBackroundLoginPage.jpg';
import { exportPrivateKeyToBase64, exportPublicKeyToBase64, generateKeysFromSecrets } from '../../utils/Cryptography';
import { useAuth } from '../../hooks/AuthProvider';
import './fulljoin.css'


const RegistrationSecretPhrases = ({ userData, setUserData, goToLimitedLogin, keyPair, setKeyPair, }) => {
    const auth = useAuth();

    // TODO: if private and public keys available show prompt to login
    const handleInputChange = (index, value) => {
        const updatedPhrases = [...userData.mnemonic];
        updatedPhrases[index] = value;
        setUserData({ ...userData, mnemonic: updatedPhrases });
    };


    const performAuth = () => {
        try {
            if (auth.fullLoginAction(keyPair)) {
                // TODO: handle success
            } else {
                // TODO: handle failure
            }
        } catch (error) {
            console.error(error);
            // TODO: handle error
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyPair.privateKey === null || keyPair.publicKey === null) {
            let valid_mnemonic = true;
            for (let i = 0; i < userData.mnemonic.length; i++) {
                if (!userData.mnemonic[i] || userData.mnemonic[i] === ' ') {
                    valid_mnemonic = false;
                    break;
                }
            }
            if (!valid_mnemonic) {
                // TODO: Display empty mnemonic
                alert('Please enter the recovery phrases in the correct order.');
            } else {
                try {
                    let keys = generateKeysFromSecrets(userData.mnemonic);
                    setKeyPair(keys.keyPair);
                    keyPair = keys.keyPair;
                    performAuth();
                } catch (err) {
                    // TODO: Handle invalid mnemonic
                    console.error(err);
                }
            }
        } else {
            performAuth();
        }

    };

    return (
        <div className="recovery-phrase-main-container">
            <div className="img-wrap-top-left">
                <img src={bgimg} className="img-phrases-top" alt="bg" />
            </div>
            <div className="recovery-phrase-sub-container">
                <div className="recovery-phrase-tips">
                    <p className="recovery-phrase-title">Enter Your Recovery Phrases</p>
                    <p className="recovery-phrase-subtitle">Please enter the recovery phrases in the correct order.</p>
                </div>
                <div className="recovery-phrase-container">
                    <form onSubmit={handleSubmit}>
                        <div className="recovery-phrase-inputs">
                            {userData.mnemonic.map((phrase, index) => (
                                <div key={index} className="recovery-phrase-input">
                                    <input
                                        type="text"
                                        value={phrase}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        placeholder={`Phrase ${index + 1}`}
                                        className="recovery-phrase-input"
                                    />
                                </div>
                            ))}

                        </div>
                    </form>
                </div>
                <div className="recovery-phrase-controls">
                    <button type="button" onClick={goToLimitedLogin}>BACK</button>
                    <button type="submit" onClick={handleSubmit}>CONTINUE</button>
                </div>
            </div>
            <div className="img-wrap-bottom-right">
                <img src={bgimg} className="img-phrases-bottom" alt="bg" />
            </div>
        </div>
    );
};

export default RegistrationSecretPhrases;
