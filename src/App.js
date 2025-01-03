
import './App.css';
import LoginPage from './components/loginPage/loginPage';
import RegistrationPage from './components/registrationPage/registrationPage';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import ResetPassword from './components/resetPassword/resetPassword';
import VerifyPage from './components/verifyPage/verifyPage';
import CreatePasswordPage from './components/сreatePasswordPage/сreatePasswordPage';
import PasswordResetSuccessPage from './components/passwordResetSuccessPage/passwordResetSuccessPage';
import JoinFull from './components/fulljoin/fulljoin';

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/" element={<RequireAuth fallbackPath="/login"></RequireAuth>} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verification" element={<VerifyPage />} />
                    <Route path="/joinfull" element={<JoinFull />} />
                    <Route path="/create-new-password" element={<CreatePasswordPage />} />
                    <Route path="/create-new-password-success" element={<PasswordResetSuccessPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
