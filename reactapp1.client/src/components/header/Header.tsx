import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import cls from "./Header.module.css"
import  LogoutSVG from "@/assets/logout.svg?react";
export default function Header() {
    const { username, token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className={cls.header}>
            <span className={cls.logo}>
                <Link to="/">Shopping <span>App</span></Link>
            </span>
            <div className={cls.inner}>
                {token ? (
                    <>
                        <span>Привет, {username}!</span>
                        <button onClick={() => handleLogout()} className={cls.logout}><LogoutSVG style={{width: "20px"}}/></button>
                    </>
                ) : (
                    <Link to="/login">Войти</Link>
                )}
            </div>
                
        </header>
    );
}
