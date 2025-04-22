import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

interface ShoppingList {
    id: number;
    name: string;
}

export default function MyListsPage() {
    const token = useSelector((state: RootState) => state.auth.token);
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!token) return;

        try {
            const res = await axios.post(
                '/api/shoppinglist',
                { name: 'Новый список' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const newListId = res.data.id;
            navigate(`/list/${newListId}`);
        } catch (err) {
            console.error('Ошибка при создании списка:', err);
        }
    };


    useEffect(() => {
        if (!token) return;

        axios
            .get('/api/shoppinglist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setLists(res.data))
            .catch((err) => console.error('Ошибка загрузки списков:', err));
    }, [token]);

    const handleOpen = (id: number) => {
        navigate(`/list/${id}`);
    };

    return (
        <div>
            <button onClick={handleCreate}>Создать новый список</button>
            <h2>Мои списки</h2>
            {lists.length === 0 && <p>У вас пока нет списков</p>}
            <ul>
                {lists.map((list) => (
                    <li key={list.id}>
                        {list.name}{' '}
                        <button onClick={() => handleOpen(list.id)}>Открыть</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
