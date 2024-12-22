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
        this.state = { registrationStage: 0 };
        this.userData = { name: "", username: "", email: "", password: "", confirmPassword: "" };
        this.secretPhrases = Array.apply("", Array(24)).map(function () { });
        this.checkIndexes = getUniqueRandomIntArr(3, 0, 24);
    }

    reRandomizeCheckIndexes() {
        this.checkIndexes = getUniqueRandomIntArr(3, 0, 24);
    }

    setUserData(data) {
        this.userData = data;
    }

    setSecretPhrases(phrases) {
        this.secretPhrases = phrases;
    }

    nextStage() {
        this.setState({ registrationStage: this.state.registrationStage + 1 });
    }

    previousStage() {
        this.setState({ registrationStage: this.state.registrationStage - 1 });
    }


    render() {
        return (
            (this.state.registrationStage == 0 && <RegistrationUserData userData={this.userData} setUserData={this.setUserData.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />) ||
            (this.state.registrationStage == 1 && <RegistrationSecretPhrases secretPhrases={this.secretPhrases} setSecretPhrases={this.setSecretPhrases.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />) ||
            (this.state.registrationStage == 2 && <RegistrationPhrasesConfirm userData={this.userData} secretPhrases={this.secretPhrases} checkIndexes={this.checkIndexes} randomizeIndexes={this.reRandomizeCheckIndexes.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />)
        );
    }
}