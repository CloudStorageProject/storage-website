import React from "react";
import LoginPage from "./loginPage";
import FullJoin from "./fulljoin";

export default class ResetPasswordManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stage: 0, };
        this.userData = { username: "", password: "", mnemonic: Array(24).fill("") }
        this.userNameRegex = /^[a-zA-Z0-9]+$/;
    }


    checkMnemonic = (mnemonic) => {
        let empty_mnemonic = false;
        for (let i = 0; i < 24; i++) {
            if (mnemonic[i] === "") {
                empty_mnemonic = true;
                break;
            }
        }
        if (!empty_mnemonic) {
            return null;
        } else {
            return "Please Enter All The Secret Phrases"
        }
    }

    setUserData(data) {
        this.userData = data;
        this.forceUpdate();
    }

    goToFullJoin() {
        this.setState({ stage: 1 });
    }

    goToLogin() {
        this.setState({ stage: 0 });
    }

    render() {
        return (
            (this.state.stage === 0 && <LoginPage userData={this.userData} setUserData={this.setUserData.bind(this)} goToFullLogin={this.goToFullJoin.bind(this)} />)
            ||
            (this.state.stage === 1 && <FullJoin userData={this.userData} setUserData={this.setUserData.bind(this)} checkMnemonic={this.checkMnemonic.bind(this)} goToLimitedLogin={this.goToLogin.bind(this)} />)
        );
    }
}