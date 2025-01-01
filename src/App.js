
import './App.css';
import LoginPage from './components/loginPage/loginPage';
import RegistrationPage from './components/registrationPage/registrationPage';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './hooks/PrivateRoute';
import AuthProvider from './hooks/AuthProvider';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                     <Route element={<PrivateRoute />}>
                        <Route path="/" element={<p>Private Route</p>} />
                    </Route>
                </Routes>
            </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
