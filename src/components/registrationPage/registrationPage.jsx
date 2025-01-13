import RegistrationUserData from "./registrationUserData";
import RegistrationSecretPhrases from "./registrationSecretPhrases";
import RegistrationPhrasesConfirm from "./registrationPhrasesConfirm";
import React from 'react';
import "./registrationPage.css"


function getUniqueRandomIntArr(count, min, max) {
    let uniqueSet = new Set();
    while (uniqueSet.size < count) {
        uniqueSet.add(Math.floor(Math.random() * (max - min + 1) + min));
    }
    return Array.from(uniqueSet);
}

export default class RegistrationPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { registrationStage: 0, keyPair: this.props.keyPair };
        this.userData = { name: "", username: "", email: "", password: "", confirmPassword: "" };
        this.secrets = {
            privateKey: null,
            publicKey: null,
            mnemonic: []
        }
        this.checkIndexes = getUniqueRandomIntArr(3, 0, 24);
    }

    setSecrets(secrets) {
        this.props.setKeyPair(secrets.keyPair);
        this.secrets.mnemonic = secrets.mnemonic.split(" ");
    }

    reRandomizeCheckIndexes() {
        this.checkIndexes = getUniqueRandomIntArr(3, 0, 24);
    }

    getSecretsState() {
        return this.privateKey != null && this.publicKey != null && this.secretPhrases != null;
    }

    setUserData(data) {
        this.userData = data;
    }

    nextStage() {
        this.setState({ registrationStage: this.state.registrationStage + 1 });
    }

    previousStage() {
        this.setState({ registrationStage: this.state.registrationStage - 1 });
    }


    render() {
        return (
            (this.state.registrationStage === 0 && <RegistrationUserData userData={this.userData} setSecrets={this.setSecrets.bind(this)} setUserData={this.setUserData.bind(this)} nextStage={this.nextStage.bind(this)} />) ||
            (this.state.registrationStage === 1 && <RegistrationSecretPhrases secretPhrases={this.secrets.mnemonic} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />) ||
            (this.state.registrationStage === 2 && <RegistrationPhrasesConfirm userData={this.userData} secretPhrases={this.secrets.mnemonic} keyPair={this.props.keyPair} checkIndexes={this.checkIndexes} randomizeIndexes={this.reRandomizeCheckIndexes.bind(this)} previousStage={this.previousStage.bind(this)} />)
        );
    }
}