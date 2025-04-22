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

    const [newItemName, setNewItemName] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleAddItem = async () => {
        if (!token || !list || newItemName.trim() === '') return;

        try {
            await axios.post('/api/listitem', {
                listId: list.id,
                customName: newItemName,
                quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
            const res = await axios.get(`/api/shoppinglist/${list.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setList(res.data);
            setNewItemName('');
            setQuantity(1);
        } catch (err) {
            console.error('Ошибка добавления товара:', err);
        }
    };

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

    const toggleBought = async (itemId: number) => {
        try {
            await axios.put(`/api/listitem/${itemId}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const res = await axios.get(`/api/shoppinglist/${list?.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setList(res.data);
        } catch (err) {
            console.error('Ошибка при переключении:', err);
        }
    };

    const deleteItem = async (itemId: number) => {
        try {
            await axios.delete(`/api/listitem/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await axios.get(`/api/shoppinglist/${list?.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setList(res.data);
        } catch (err) {
            console.error('Ошибка при удалении:', err);
        }
    };

    return (
        <div>
            <h2>{list.name}</h2>

            <div>
                <input
                    placeholder="Товар"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button onClick={handleAddItem}>Добавить</button>
            </div>

            <ul>
                {list.items.map(item => (
                    <li key={item.id}>
                        {item.product?.name || item.customName} – {item.quantity} шт –
                        <strong> {item.isBought ? '✔ Куплено' : '❌ Не куплено'}</strong>
                        <button onClick={() => toggleBought(item.id)}>✔✖</button>
                        <button onClick={() => deleteItem(item.id)}>Удалить</button>
                    </li>
                ))}
            </ul>

        </div>
    );
}
