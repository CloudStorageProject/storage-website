import React, { useEffect } from 'react';
import bgimg from '../img/greenBackroundLoginPage.jpg';
import { generateKeysFromSecrets } from '../../utils/Cryptography';
import { useAuth } from '../../hooks/AuthProvider';
import './fulljoin.css'
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../../hooks/Notification/NotificationProvider.jsx';
import { NotificationType } from '../../hooks/Notification/NotificationTypes.tsx';


const RegistrationSecretPhrases = ({ userData, checkMnemonic, setUserData, goToLimitedLogin, }) => {
    const auth = useAuth();
    const notify = useNotify();
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

    useEffect(() => {
        const handlePaste = (e) => {
            let split = e.clipboardData.getData("text").split(/\d+\. /);
            if (split.length === 1) { return; }
            else if (split.length === 25) {
                e.preventDefault();
                split.shift();
                split = split.map(el => el.replace(/\n/g, ''));
                setUserData({ ...userData, mnemonic: split });
            }
        }
        document.addEventListener("paste", handlePaste);
        return () => {
            document.removeEventListener("paste", handlePaste);
        };
    }, []);

    const performAuth = (keys) => {
        auth.fullLoginAction(keys.keyPair).then((res) => {
            if (res) {
                auth.setKeyPair(keys.keyPair);
                navigate("/storage");
            }
        }).catch((error) => {
            notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const mnemonic_check = checkMnemonic(userData.mnemonic)
        if (mnemonic_check) {
            notify.postNotification(mnemonic_check, NotificationType.INFO);
            return;
        }

        try {
            generateKeysFromSecrets(userData.mnemonic).then(keys => {
                performAuth(keys);
            });
        } catch (err) {
            // TODO: Handle invalid mnemonic
            console.error(err);
        }
    }



    return (
        <div className="recovery-phrase-main-container">
            <div className="recovery-phrase-sub-container">
                <div className="recovery-phrase-tips">
                    <p className="recovery-phrase-title">Enter Your Recovery Phrases</p>
                    <p className="recovery-phrase-subtitle">Please enter the recovery phrases in the correct order.</p>
                </div>
                <div className="recovery-phrase-container">
                    <form className='phrase-container' onSubmit={handleSubmit}>
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
        </div>
    );
};

export default RegistrationSecretPhrases;