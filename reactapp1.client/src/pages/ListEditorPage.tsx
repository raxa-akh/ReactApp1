import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Product {
    id: number;
    name: string;
}

interface ListItem {
    id: number;
    product?: Product;
    customName?: string;
    quantity: number;
    isBought: boolean;
}

interface ShoppingList {
    id: number;
    name: string;
    items: ListItem[];
}

export default function ListEditorPage() {
    const { id } = useParams<{ id: string }>();
    const token = useSelector((state: RootState) => state.auth.token);
    const [list, setList] = useState<ShoppingList | null>(null);

    useEffect(() => {
        if (!id || !token) return;

        axios.get(`/api/shoppinglist/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => setList(res.data))
            .catch(err => console.error('Ошибка загрузки списка:', err));
    }, [id, token]);

    if (!list) return <p>Загрузка...</p>;

    return (
        <div>
            <h2>{list.name}</h2>
            <ul>
                {list.items.map(item => (
                    <li key={item.id}>
                        {item.product?.name || item.customName} – {item.quantity} шт. –
                        <strong> {item.isBought ? '✔ Куплено' : '❌ Не куплено'}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}
