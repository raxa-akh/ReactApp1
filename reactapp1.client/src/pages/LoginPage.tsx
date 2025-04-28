import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const { token, username: name, role, userId } = response.data;
            dispatch(login({ token, username: name, role, userId }));
            navigate('/');
        } catch {
            setError('ошибка');
        }
    };

    const handleRegister = async () => {
        navigate('/register')
    };

    return (
        <div>
            <h2>Вход Enter</h2>
            {error && <p>{error}</p>}
            <input placeholder="Name" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Войти</button>
            <button onClick={handleRegister}>Зарегестрироваться</button>
        </div>
    );
}
