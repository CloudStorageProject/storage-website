import './App.css';
import LoginPageManager from './components/loginPage/LoginPageManager';
import RegistrationPage from './components/registrationPage/registrationPage';
import ResetPasswordManager from './components/resetPassword/ResetPasswordManager';
import PageStateProvider from './hooks/PageContext.jsx';
import MainPage from './components/mainPage/mainPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './hooks/PrivateRoute';
import AuthProvider from './hooks/AuthProvider';
import React from "react";
import NotificationProvider from './hooks/Notification/NotificationProvider.jsx';
import LandingPage from './components/landingPage/LandingPage.jsx'

export default class App extends React.Component {

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <NotificationProvider>
                        <PageStateProvider>
                            <AuthProvider >
                                <Routes>
                                    <Route path="/login" element={<LoginPageManager />} />
                                    <Route path="/reset-password" element={<ResetPasswordManager />} />
                                    <Route path="/register" element={<RegistrationPage />} />
                                    <Route path="/" element={<LandingPage />} />
                                    <Route element={<PrivateRoute />}>
                                        <Route path="/storage" element={<MainPage />} />
                                    </Route>
                                </Routes>
                            </AuthProvider>
                        </PageStateProvider>
                    </NotificationProvider>
                </BrowserRouter>
            </div>
        );
    }
}
