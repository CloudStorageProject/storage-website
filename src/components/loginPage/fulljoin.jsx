import React, { useEffect } from 'react';
import bgimg from '../img/greenBackroundLoginPage.jpg';
import { generateKeysFromSecrets } from '../../utils/Cryptography';
import { useAuth } from '../../hooks/AuthProvider';
import './fulljoin.css'
import { useNavigate } from 'react-router-dom';


const RegistrationSecretPhrases = ({ userData, canProceed, setUserData, goToLimitedLogin, }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    // TODO: if private and public keys available show prompt to login
    const handleInputChange = (index, value) => {
        const updatedPhrases = [...userData.mnemonic];
        updatedPhrases[index] = value;
        setUserData({ ...userData, mnemonic: updatedPhrases });
    };


    useEffect(() => {
        if (auth.keyPair.privateKey !== null || auth.keyPair.publicKey !== null) {
            performAuth();
        }
    }, [auth.keyPair]);

    const performAuth = () => {
        auth.fullLoginAction(auth.keyPair).then((res) => {
            if (res) {
                navigate("/storage");
            } else {
                // TODO: handle failure
            }
        }).catch((error) => {
            console.log(error);
            // TODO: handle error
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (auth.keyPair.privateKey === null || auth.keyPair.publicKey === null) {
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
                    generateKeysFromSecrets(userData.mnemonic).then(keys => {
                        auth.setKeyPair(keys.keyPair);
                    });
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
                    <button type="submit" disabled={!canProceed} onClick={handleSubmit}>CONTINUE</button>
                </div>
            </div>
            <div className="img-wrap-bottom-right">
                <img src={bgimg} className="img-phrases-bottom" alt="bg" />
            </div>
        </div>
    );
};

export default RegistrationSecretPhrases;