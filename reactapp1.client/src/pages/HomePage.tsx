import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const token = useSelector((state: RootState) => state.auth.token);
    const navigate = useNavigate();

    const handleCreateList = () => {
        if (!token) {
            navigate('/login');
            return;
        }

        console.log('Мои списки');
        navigate('/my-lists'); 
    };

    const handleCheckOtherLists = () => {
        if (!token) {
            navigate('/login');
            return;
        }

        console.log('Чужие списки');
        navigate('/shared');
    };

    return (
        <div>
            <h1>Добро пожаловать!</h1>
            <button onClick={() => handleCreateList()}>Мои списки</button>
            <button onClick={() => handleCheckOtherLists()}>Чужие списки</button>
        </div>
    );
}
