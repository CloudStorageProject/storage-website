import bgimg from '../img/greenBackroundLoginPage.jpg'
import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";

const RegistrationPhrasesConfirm = ({ userData, secretPhrases, keyPair, checkIndexes, randomizeIndexes, previousStage }) => {
    let [selectedPhrases, setSelectedPhrases] = useState({});
    let auth = useAuth();
    let handleSetSelectedPhrases = (e) => {
        setSelectedPhrases({ ...selectedPhrases, [e.target.name]: e.target.value });
    }

    let handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedPhrases[checkIndexes[0]] !== secretPhrases[checkIndexes[0]] || selectedPhrases[checkIndexes[1]] !== secretPhrases[checkIndexes[1]] || selectedPhrases[checkIndexes[2]] !== secretPhrases[checkIndexes[2]]) {
            return;
            // TODO: handle phrase mismatch
        }
        const data = {
            email: userData.email,
            username: userData.username,
            password: userData.password,
            keyPair: keyPair
        };

        try {
            if (auth.registerAction(data)) {
                // TODO: handle success
                document.location.href = "/main";
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