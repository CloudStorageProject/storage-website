import React, { useState } from 'react';
import bgimg from '../img/greenBackroundLoginPage.jpg';
import { generateKeysFromSecrets } from '../../utils/Cryptography';
import { useAuth } from '../../hooks/AuthProvider';
import './fulljoin.css'


const RegistrationSecretPhrases = ({ userData, setUserData, goToLimitedLogin, secrets, setSecrets }) => {
    const [inputPhrases, setInputPhrases] = useState(userData.secrets);
    const auth = useAuth();
    // TODO: if private and public keys available show prompt to login
    const handleInputChange = (index, value) => {
        const updatedPhrases = [...inputPhrases];
        updatedPhrases[index] = value;
        setInputPhrases(updatedPhrases);
        setUserData({ ...userData, secrets: updatedPhrases });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (secrets.privateKey === null || secrets.publicKey === null) {
            generateKeysFromSecrets(inputPhrases, setSecrets);
        }
        try {
            if (auth.fullLoginAction(userData, secrets)) {
                // TODO: handle success
            } else {
                // TODO: handle failure
            }
        } catch (error) {
            console.log(error);
            // TODO: handle error
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
                            {inputPhrases.map((phrase, index) => (
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
