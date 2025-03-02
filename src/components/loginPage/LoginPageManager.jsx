import React from "react";
import LoginPage from "./loginPage";
import FullJoin from "./fulljoin";

export default class ResetPasswordManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stage: 0, };
        this.userData = { username: "", password: "", mnemonic: Array(24).fill("") }
        this.userNameRegex = /^[a-zA-Z0-9]+$/;
        this.canProceed = false;
    }

    checkUserData = (data) => {
        let empty_mnemonic = false;
        for (let i = 0; i < 24; i++) {
            if (data.mnemonic[i] === "") {
                empty_mnemonic = true;
                break;
            }
        }
        if (!empty_mnemonic) {
            return true;
        } else if (!this.userNameRegex.test(data.username)) {
            return false;
            // TODO: Handle username error
        } else if (data.password.length < 8 || data.password.length > 128) {
            return false;
            // TODO: Handle password error
        } else if (!/[A-Z]/.test(data.password)) {
            return false;
            // TODO: Handle password Uppercase error
        } else if (!/[a-z]/.test(data.password)) {
            return false;
            // TODO: Handle password Lowercase error
        } else if (!/[0-9]/.test(data.password)) {
            return false;
            // TODO: Handle password Number error
        }
        return true;
    }

    setUserData(data) {
        this.userData = data;
        this.canProceed = this.checkUserData(data);
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
            (this.state.stage === 0 && <LoginPage canProceed={this.canProceed} userData={this.userData} setUserData={this.setUserData.bind(this)} goToFullLogin={this.goToFullJoin.bind(this)} />)
            ||
            (this.state.stage === 1 && <FullJoin canProceed={this.canProceed} userData={this.userData} setUserData={this.setUserData.bind(this)} goToLimitedLogin={this.goToLogin.bind(this)} />)
        );
    }
}