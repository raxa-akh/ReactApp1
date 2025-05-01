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
    const [newListName, setNewListName] = useState('');
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!token || !newListName.trim()) return;

        try {
            const res = await axios.post(
                '/api/shoppinglist',
                { name: newListName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const newListId = res.data.id;
            setNewListName(''); 
            navigate(`/list/${newListId}`);
        } catch (err) {
            console.error('Ошибка при создании списка:', err);
        }
    };

    const handleDelete = async (id : number) => {
        if (!token) return;

        try {
            await axios.delete(
                `/api/shoppinglist/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setLists(lists.filter((e) => e.id !== id))
        } catch (err) {
            console.error('Ошибка при создании списка:', err);
        }
    }

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
            <h2>Мои списки</h2>

            <input
                type="text"
                placeholder="Введите название списка"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
            />
            <button onClick={handleCreate}>Создать список</button>

            {lists.length === 0 && <p>У вас пока нет списков</p>}
            <ul>
                {lists.map((list) => (
                    <li key={list.id}>
                        {list.name}{' '}
                        <button onClick={() => handleOpen(list.id)}>Открыть</button>
                        <button onClick={() => handleDelete(list.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
