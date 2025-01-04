import React from "react";
import ResetPassword from "./resetPassword";
import VerifyPage from "./verifyPage";
import CreatePasswordPage from "./сreatePasswordPage";
import PasswordResetSuccessPage from "./passwordResetSuccessPage";


export default class ResetPasswordManager extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stage: 0
        };
        this.resetData = { email: "", code: "", password: "", confirmPassword: "" };
    }

    nextStage() {
        if (this.state.stage === 3) {
            // TODO: Redirect to login / mainPage
            document.location.href = "/login";
        };
        this.setState({ stage: this.state.stage + 1 });
    }

    previousStage() {
        if (this.state.stage === 0) {
            document.location.href = "/login";
        };
        this.setState({ stage: this.state.stage - 1 });
    }

    setUserData(data) {
        this.resetData = data;
    }

    render() {
        return (
            (this.state.stage === 0 && <ResetPassword userData={this.resetData} setUserData={this.setUserData.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />) ||
            (this.state.stage === 1 && <VerifyPage userData={this.resetData} setUserData={this.setUserData.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />) ||
            (this.state.stage === 2 && <CreatePasswordPage userData={this.resetData} setUserData={this.setUserData.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />) ||
            (this.state.stage === 3 && <PasswordResetSuccessPage userData={this.resetData} setUserData={this.setUserData.bind(this)} nextStage={this.nextStage.bind(this)} previousStage={this.previousStage.bind(this)} />)

        );
    }
}