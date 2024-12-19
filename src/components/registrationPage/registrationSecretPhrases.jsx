import { useState } from "react";
import bgimg from '../img/greenBackroundLoginPage.jpg'


const RegistrationSecretPhrases = ({ secretPhrases, setSecretPhrases, nextStage, previousStage }) => {
    let [phrases, setPhrases] = useState(secretPhrases);
    var regExp = /[!@#$%^&*(),.?":{}|<>\-_=+ ]/g;

    let setPhrase = (e) => {
        console.log(e.target.value, e.target.name);
        if (regExp.test(e.target.value)) {
            // TODO: handle invalid character
            e.target.value = e.target.value.replace(regExp, '');
            return;
        }
        e.preventDefault();
        let newPhrases = [...phrases];
        newPhrases[e.target.name] = e.target.value;
        setPhrases(newPhrases);
        setSecretPhrases(newPhrases);
    };

    let handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(phrases.join(" "));
    };

    let handleDownload = (e) => {
        e.preventDefault();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(phrases.join("\n")))
        element.setAttribute('download', 'secretPhrases.txt')
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (<div className="recovery-phrase-main-container">
        <div className="img-wrap-top-left">
            <img src={bgimg} className="img-phrases-top " alt="bg" />
        </div>
        <div className="recovery-phrase-sub-container">
            <div className="recovery-phrase-tips">
                <p className="recovery-phrase-title">Write down your recovery phrase.</p>
                <p className="recovery-phrase-subtitle">You will need this in the next step.</p>
            </div>
            <div className="recovery-phrase-container">
                <div className="recovery-phrase-inputs">
                    {phrases && phrases.map((phrase, index) => {
                        return (
                            <input type="text" className="recovery-phrase-input" placeholder={index + 1} key={index} name={index} onChange={setPhrase} value={phrase}></input>
                        )
                    })}
                </div>
                <div className="divider"></div>
                <div className="recovery-phrase-controls" >
                    <button onClick={handleCopy}>Copy</button>
                    <button onClick={handleDownload}>Download</button>
                </div>
            </div>
            <div className="recovery-phrase-controls">
                <button onClick={previousStage}>BACK</button>
                <button onClick={nextStage}>CONTINUE</button>
            </div>
        </div>
        <div className="img-wrap-bottom-right">
            <img src={bgimg} className="img-phrases-bottom" alt="bg" />
        </div>
    </div>);
}

export default RegistrationSecretPhrases;