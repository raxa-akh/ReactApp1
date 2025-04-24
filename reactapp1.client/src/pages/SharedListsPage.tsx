import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

interface ListItem {
    id: number;
    productName?: string;
    customName?: string;
    quantity: number;
    isBought: boolean;
}

interface ShoppingList {
    id: number;
    name: string;
    createdAt: string;
    items: ListItem[];
}

export default function SharedListsPage() {
    const token = useSelector((state: RootState) => state.auth.token);
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        axios.get('/api/shoppinglist/shared', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setLists(res.data))
            .catch(err => console.error('Ошибка загрузки расшаренных списков:', err));
    }, [token]);

    const handleOpen = (id: number) => {
        navigate(`/list/${id}`);
    };

    return (
        <div>
            <h2>Списки, доступные вам</h2>
            {lists.length === 0 ? (
                <p>Нет списков, к которым у вас есть доступ</p>
            ) : (
                <ul>
                    {lists.map(list => (
                        <li key={list.id}>
                            {list.name} — {list.items.length} товаров
                            <button onClick={() => handleOpen(list.id)}>Открыть</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
