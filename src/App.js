import './App.css';
import LoginPageManager from './components/loginPage/LoginPageManager';
import RegistrationPage from './components/registrationPage/registrationPage';
import ResetPasswordManager from './components/resetPassword/ResetPasswordManager';
import { ThemeProvider } from './hooks/ThemeContext';
import MainPage from './components/mainPage/mainPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './hooks/PrivateRoute';
import AuthProvider from './hooks/AuthProvider';
import React from "react";
import { generateKeysFromPemBuffer } from './utils/Cryptography';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.keyPair = { privateKey: null, publicKey: null };
        if (localStorage.getItem("privateKey") !== null && localStorage.getItem("publicKey") !== null) {
            this.keyPair = generateKeysFromPemBuffer(localStorage.getItem("privateKey"), localStorage.getItem("publicKey"));
        }
    }

    setKeyPair(pair) {
        this.keyPair = pair;
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <AuthProvider>
                        <ThemeProvider>
                            <Routes>
                                <Route path="/login" element={<LoginPageManager keyPair={this.keyPair} setKeyPair={this.setKeyPair.bind(this)} />} />
                                <Route path="/reset-password" element={<ResetPasswordManager />} />
                                <Route path="/register" element={<RegistrationPage keyPair={this.keyPair} setKeyPair={this.setKeyPair.bind(this)} />} />
                                <Route element={<PrivateRoute />}>
                                    <Route path="/*" element={<MainPage />} />
                                </Route>
                            </Routes>
                        </ThemeProvider>
                    </AuthProvider>
                </BrowserRouter>
            </div>
        );
    }
}