import bgimg from '../img/greenBackroundLoginPage.jpg'


const RegistrationSecretPhrases = ({ secretPhrases, nextStage, previousStage }) => {
    let processedPhrases = secretPhrases.map((phrase, index) => {
        return `${index + 1}. ${phrase}`
    });

    let handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(processedPhrases.join(" "));
    };

    let handleDownload = (e) => {
        e.preventDefault();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(processedPhrases.join("\n")))
        element.setAttribute('download', 'secretPhrases.txt')
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (<div className="recovery-phrase-main-container">
        <div className="recovery-phrase-sub-container">
            <div className="recovery-phrase-tips">
                <p className="recovery-phrase-title">Write down your recovery phrase.</p>
                <p className="recovery-phrase-subtitle">You will need this in the next step.</p>
            </div>
            <div className="recovery-phrase-container">
                <div>
                    <div className="recovery-phrase-inputs">
                        {secretPhrases && secretPhrases.map((phrase, index) => {
                            return (
                                <div key={index} className="recovery-phrase-input"><span className="recovery-phrase-index">{index + 1}</span> {phrase}</div>
                            )
                        })}
                    </div>
                    <div className="recovery-phrase-controls" >
                        <button onClick={handleCopy}>Copy</button>
                        <button onClick={handleDownload}>Download</button>
                    </div>
                </div>
            </div>
            <div className="recovery-phrase-controls">
                <button onClick={previousStage}>BACK</button>
                <button onClick={nextStage}>CONTINUE</button>
            </div>
        </div>
    </div>);
}

export default RegistrationSecretPhrases;