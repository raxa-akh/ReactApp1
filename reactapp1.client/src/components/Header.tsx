import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const { username, token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <h2 style={{ display: 'inline-block', marginRight: 20 }}>
                <Link to="/">Shopping App</Link>
            </h2>

            {token ? (
                <>
                    <span style={{ marginRight: 10 }}>Привет, {username}!</span>
                    <button onClick={handleLogout}>Выйти</button>
                </>
            ) : (
                <Link to="/login">Войти</Link>
            )}
        </header>
    );
}
