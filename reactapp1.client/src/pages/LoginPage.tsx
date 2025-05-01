import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from "@/styles/LoginPage.module.css"
import Button from '../components/button/Button';
export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [flipped, setFlipped] = useState(false);

    const flipCard = () =>{
        setFlipped(!flipped)
        setError(null);
    }
    const handleLogin = async () => {

        if (username === "") {
            setError('Введите имя');
            return;
        }

        if (password === "") {
            setError('Введите пароль');
            return;
        }
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const { token, username: name, role, userId } = response.data;
            dispatch(login({ token, username: name, role, userId }));
            navigate('/');
        } catch {
            setError('Ошибка авторизации');
        }
    };


    const handleRegister = async () => {

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        if (username === "") {
            setError('Введите имя');
            return;
        }

        if (email === "") {
            setError('Введите почту');
            return;
        }

        try {
            await axios.post('/api/auth/register', {
                username,
                email,
                password
            });
            setUsername("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            setFlipped(false);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || 'Ошибка регистрации');
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.cardContainer}>
                    <div className={`${styles.card} ${flipped ? styles.flipped : ""}`} id="card">
                        <div className={styles.front}>
                            <span className={styles.title}>Вход</span>
                            <input className={styles.input} type="text" placeholder="Логин" required value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input className={styles.input} type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <Button onClick={() => handleLogin()} text="Войти"/>
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.secondBtn} onClick={() => flipCard()}>Нет аккаунта? Зарегистрироваться</button>
                        </div>
                        <div className={styles.back}>
                            <span className={styles.title}>Регистрация</span>
                            <input className={styles.input} type="text" placeholder="Имя" required value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input className={styles.input} type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input className={styles.input} type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <input className={styles.input} type="password" placeholder="Повторите пароль" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button className={styles.mainBtn} onClick={() => {handleRegister()}} >Зарегистрироваться</button>
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.secondBtn} onClick={() => flipCard()}>Уже есть аккаунт? Войти</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
