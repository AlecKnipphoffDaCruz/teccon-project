import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import AccessRequestBanner from '../molecules/AccessRequestBanner';
import Button from '../atoms/Button';

const UserIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

interface LoginFormProps {
    onSubmit?: (user: string, password: string) => void;
    loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ user?: string; password?: string }>({});

    const validate = () => {
        const e: typeof errors = {};
        if (!user.trim()) e.user = 'Informe o usuário';
        if (!password.trim()) e.password = 'Informe a senha';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSubmit?.(user, password);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <FormField
                id="username"
                label="Usuário"
                icon={<UserIcon />}
                error={errors.user}
                inputProps={{
                    type: 'text',
                    placeholder: 'Digite seu usuário',
                    value: user,
                    onChange: (e) => { setUser(e.target.value); setErrors((prev) => ({ ...prev, user: undefined })); },
                    autoComplete: 'username',
                }}
            />

            <FormField
                id="password"
                label="Senha"
                icon={<LockIcon />}
                error={errors.password}
                inputProps={{
                    type: 'password',
                    placeholder: '••••••••',
                    value: password,
                    onChange: (e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); },
                    autoComplete: 'current-password',
                }}
            />

            <div className="flex justify-end -mt-2">
                <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-[#1A5FAD] transition-colors duration-200"
                >
                    Esqueci a senha
                </button>
            </div>

            <Button type="submit" loading={loading}>
                Entrar no sistema
            </Button>

            <AccessRequestBanner onClick={() => alert('Redirecionar para solicitação de acesso')} />
        </form>
    );
};

export default LoginForm;