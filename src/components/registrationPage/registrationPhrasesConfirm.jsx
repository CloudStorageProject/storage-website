import bgimg from '../img/greenBackroundLoginPage.jpg'
import { useState } from "react";
import { register, signOut } from "../../service/authService.jsx";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { createKeys } from '../../utils/Cryptography.jsx';

const RegistrationPhrasesConfirm = ({ userData, secretPhrases, checkIndexes, nextStage, previousStage, randomizeIndexes }) => {
    let [selectedPhrases, setSelectedPhrases] = useState([]);
    let signIn = useSignIn();
    let checkPhrase = (e) => {
        e.preventDefault();
    };
    let handleSetSelectedPhrases = (e) => {
        setSelectedPhrases({ ...selectedPhrases, [e.target.name]: e.target.value });
    }

    let handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPhrases[0] !== secretPhrases[0] || selectedPhrases[1] !== secretPhrases[1] || selectedPhrases[2] !== secretPhrases[2]) {
            return;
            // TODO: handle phrase mismatch
        }
        const { publicKey, privateKey, mnemonic } = await createKeys();
        document.cookie = `privateKey=${privateKey}; SameSite=Strict; Secure; path=/`;
        const data = {
            name: userData.name,
            email: userData.email,
            username: userData.username,
            password: userData.password,
            publicKey: publicKey,
        }

        try {
            const response = await register(data);
            // TODO: update to custom sign in
            if (signIn({
                auth: {
                    token: response.auth.token,
                    type: response.auth.type,
                },
                userState: response.userState
            })) {
                // TODO: handle success
            } else {
                // TODO: handle failure
            }
        } catch (error) {
            console.log(error);
            // TODO: handle error
        }
    }
    return (<div className="recovery-phrase-main-container">
        <div className="img-wrap-top-right">
            <img src={bgimg} className="img-confirm-top " alt="bg" />
        </div>
        <div className="recovery-phrase-sub-container">
            <div className="recovery-phrase-confirm">
                <p className="recovery-phrase-title">Confirm Your Recovery Phrase</p>
                <div className="divider-confirm"></div>
                <p className="recovery-phrase-subtitle">Please confirm your recovery phrase to ensure you’ve saved it correctly. Enter the words in the specified positions from your recovery phrase.</p>
            </div>
            <div className="phrase-confirm-inputs">
                <input type="text" className="recovery-confirm-input" placeholder={checkIndexes[0] + 1} name={checkIndexes[0]} onChange={(e) => { handleSetSelectedPhrases(e) }}></input>
                <input type="text" className="recovery-confirm-input" placeholder={checkIndexes[1] + 1} name={checkIndexes[1]} onChange={(e) => { handleSetSelectedPhrases(e) }}></input>
                <input type="text" className="recovery-confirm-input" placeholder={checkIndexes[2] + 1} name={checkIndexes[2]} onChange={(e) => { handleSetSelectedPhrases(e) }}></input>
            </div>
            <div className="recovery-phrase-controls">
                <button onClick={handleSubmit}>CONFIRM</button>
                <button onClick={() => {
                    randomizeIndexes();
                    previousStage();
                }}>SHOW THE PHRASE AGAIN</button>
            </div>
        </div>
        <div className="img-wrap-bottom-left">
            <img src={bgimg} className="img-confirm-bottom" alt="bg" />
        </div>
    </div>);
}

export default RegistrationPhrasesConfirm;