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

        console.log('Создание нового списка');
        navigate('/my-lists'); 
    };

    return (
        <div>
            <h1>Список покупок</h1>
            <button onClick={handleCreateList}>Создать список</button>
        </div>
    );
}
