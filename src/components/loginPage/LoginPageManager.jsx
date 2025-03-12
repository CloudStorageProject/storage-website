import React from "react";
import LoginPage from "./loginPage";
import FullJoin from "./fulljoin";
import { useNotify } from "../../hooks/Notification/NotificationProvider";
import { NotificationType } from "../../hooks/Notification/NotificationTypes.tsx";

export default class ResetPasswordManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stage: 0, };
        this.userData = { username: "", password: "", mnemonic: Array(24).fill("") }
        this.userNameRegex = /^[a-zA-Z0-9]+$/;
    }

    checkUserData = (data) => {
        if (data.username.length < 4) {
            return "Username should contain at least 4 characters";
        } else if (!this.userNameRegex.test(data.username)) {
            return "Username should contain only letters and numbers";
        } else if (data.password.length < 8 || data.password.length > 128) {
            return "Password should contain at least 8 and at most 128 characters";
        } else if (!/[A-Z]/.test(data.password)) {
            return "Password should contain at least one uppercase letter";
        } else if (!/[a-z]/.test(data.password)) {
            return "Password should contain at least one lowercase letter";
        } else if (!/[0-9]/.test(data.password)) {
            return "Password should contain at least one number";
        }
        return null;
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
            (this.state.stage === 0 && <LoginPage userData={this.userData} setUserData={this.setUserData.bind(this)} checkUserData={this.checkUserData.bind(this)} goToFullLogin={this.goToFullJoin.bind(this)} />)
            ||
            (this.state.stage === 1 && <FullJoin userData={this.userData} setUserData={this.setUserData.bind(this)} checkMnemonic={this.checkMnemonic.bind(this)} goToLimitedLogin={this.goToLogin.bind(this)} />)
        );
    }
}