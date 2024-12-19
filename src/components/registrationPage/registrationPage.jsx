import RegistrationUserData from "./registrationUserData";
import RegistrationSecretPhrases from "./registrationSecretPhrases";
import RegistrationPhrasesConfirm from "./registrationPhrasesConfirm";
import React from 'react';
import "./registrationPage.css"


export default class RegistrationPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { registrationStage: 0 };
        this.userData = { name: "", username: "", email: "", password: "", confirmPassword: "" };
        this.secretPhrases = Array.apply("", Array(24)).map(function () { });
        this.checkIndexes = Array.from({ length: 3 }, () => Math.floor(Math.random() * 25));
    }

    reRandomizeCheckIndexes() {
        this.checkIndexes = Array.from({ length: 3 }, () => Math.floor(Math.random() * 25));
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