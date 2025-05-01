import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import cls from "@/styles/HomePage.module.css"
import Button from '@/components/button/Button';
export default function HomePage() {
    const token = useSelector((state: RootState) => state.auth.token);
    const navigate = useNavigate();

    const handleCreateList = () => {
        if (!token) {
            navigate('/login');
            return;
        }

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
        <div className={cls.container}>
            <span className={cls.title}>Добро пожаловать!</span>
            <div className={cls.inner}>
                <Button onClick={() => handleCreateList()} text="Мои списки"/>
                <Button onClick={() => handleCheckOtherLists()} text="Другие списки"/>
            </div>
        </div>
    );
}
