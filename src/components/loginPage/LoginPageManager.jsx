import React from "react";
import LoginPage from "./loginPage";
import FullJoin from "./fulljoin";

export default class ResetPasswordManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stage: 0, };
        this.userData = { username: "", password: "", mnemonic: Array(24).fill("") }
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
            (this.state.stage === 1 && <FullJoin userData={this.userData} setUserData={this.setUserData.bind(this)} goToLimitedLogin={this.goToLogin.bind(this)} keyPair={this.props.keyPair} setKeyPair={this.props.setKeyPair} />)
        );
    }
}