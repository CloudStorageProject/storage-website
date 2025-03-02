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

export default class App extends React.Component {

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <AuthProvider >
                        <ThemeProvider>
                            <Routes>
                                <Route path="/login" element={<LoginPageManager />} />
                                <Route path="/reset-password" element={<ResetPasswordManager />} />
                                <Route path="/register" element={<RegistrationPage />} />
                                <Route path="/" element={<p>Landing Page</p>} />
                                <Route element={<PrivateRoute />}>
                                    <Route path="/storage" element={<MainPage />} />
                                </Route>
                            </Routes>
                        </ThemeProvider>
                    </AuthProvider>
                </BrowserRouter>
            </div>
        );
    }
}