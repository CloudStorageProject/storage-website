
import './App.css';
import LoginPage from './components/loginPage/loginPage';
import RegistrationPage from './components/registrationPage/registrationPage';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/" element={<RequireAuth fallbackPath="/login"></RequireAuth>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
