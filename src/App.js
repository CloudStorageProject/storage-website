import './App.css';
import LoginPageManager from './components/loginPage/LoginPageManager';
import RegistrationPage from './components/registrationPage/registrationPage';
import ResetPasswordManager from './components/resetPassword/ResetPasswordManager';

import MainPage from './components/mainPage/mainPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './hooks/PrivateRoute';
import AuthProvider from './hooks/AuthProvider';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPageManager />} />
                        <Route path="/reset-password" element={<ResetPasswordManager />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/*" element={<MainPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
