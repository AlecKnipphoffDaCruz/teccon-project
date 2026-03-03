import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginTemplate from '../tamplates/LoginTamplate';
import { login } from "../../service/api/AuthService";

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (user: string, password: string) => {
        setLoading(true);
        try {
            await login({ user, password });
        } finally {
            setLoading(false);
            navigate("/coleta");
        }
    };

    return <LoginTemplate onLogin={handleLogin} loading={loading} />;
};

export default LoginPage;