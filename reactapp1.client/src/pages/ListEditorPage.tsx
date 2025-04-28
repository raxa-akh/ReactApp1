import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import * as signalR from '@microsoft/signalr';

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
    createdAt: string;
    ownerId: number;    
    items: ListItem[];
}

export default function ListEditorPage() {
    const { id } = useParams<{ id: string }>();
    const token = useSelector((state: RootState) => state.auth.token);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [list, setList] = useState<ShoppingList | null>(null);
    console.log(userId)
    const [newItemName, setNewItemName] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [editItem, setEditItem] = useState<ListItem | null>(null);
    const [editName, setEditName] = useState('');
    const [editQty, setEditQty] = useState(1);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const [sharedUsers, setSharedUsers] = useState<{ id: number; username: string }[]>([]);
    const [newUsername, setNewUsername] = useState('');
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    



    const fetchShared = async () => {
        if (!id || !token) return;
        axios.get(`/api/shoppinglist/${id}/access`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setSharedUsers(res.data))
            .catch(err => console.error('Ошибка загрузки доступов:', err));
    };

    const fetchList = async () => {
        if (!id || !token) return;
        const res = await axios.get(`/api/shoppinglist/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setList(res.data);
    };

    useEffect(() => {
        if (!id || !token) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7013/hubs/list", { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => {
                console.log('SignalR Connected.');
                newConnection.invoke('JoinListGroup', Number(id));

                newConnection.on('ListUpdated', async (listId: number) => {
                    if (Number(id) === listId) {
                        console.log('List updated');
                        fetchList();
                    }
                });

                setConnection(newConnection);
            })
            .catch(e => console.error('SignalR error:', e));

        fetchList();
        fetchShared();

        return () => {
            newConnection.stop();
        };
    }, [id, token]);

    if (!list) return <p>Загрузка...</p>;
    const isOwner = list?.ownerId === userId;
    const handleAddItem = async () => {
        if (!token || !list || newItemName.trim() === '') return;
        await axios.post('/api/listitem', {
            listId: list.id,
            customName: newItemName,
            quantity,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNewItemName('');
        setQuantity(1);
    };

    const openEditDialog = (item: ListItem) => {
        setEditItem(item);
        setEditName(item.customName || '');
        setEditQty(item.quantity);
        dialogRef.current?.showModal();
    };

    const saveEdit = async () => {
        if (!token || !list || !editItem) return;
        await axios.put(`/api/listitem/${editItem.id}`, {
            id: editItem.id,
            listId: list.id,
            quantity: editQty,
            isBought: editItem.isBought,
            customName: editName
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        dialogRef.current?.close();
        setEditItem(null);
    };

    const toggleBought = async (itemId: number) => {
        if (!list || !token) return;
        const item = list.items.find(i => i.id === itemId);
        if (!item) return;

        await axios.put(`/api/listitem/${itemId}`, {
            id: item.id,
            quantity: item.quantity,
            isBought: !item.isBought,
            customName: item.customName
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    const deleteItem = async (itemId: number) => {
        await axios.delete(`/api/listitem/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    const handleShare = async () => {
        if (!newUsername.trim() || !id) return;
        await axios.post(`/api/shoppinglist/${id}/access`, {
            targetUsername: newUsername
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewUsername('');
        fetchShared();
    };

    const handleRevoke = async (accessId: number) => {
        if (!id) return;
        await axios.delete(`/api/shoppinglist/${id}/access/${accessId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchShared();
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
                        <button onClick={() => openEditDialog(item)}>Редактировать</button>
                    </li>
                ))}
            </ul>

            <hr />
            {isOwner && (
                <>
                    <h3>Совместный доступ</h3>

                    <input
                        placeholder="Имя пользователя"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <button onClick={handleShare}>Предоставить доступ</button>

                    <ul>
                        {sharedUsers.map(user => (
                            <li key={user.id}>
                                {user.username}
                                <button onClick={() => handleRevoke(user.id)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <dialog ref={dialogRef}>
                <form method="dialog" onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
                    <h3>Редактировать товар</h3>
                    <label>
                        Название:
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Количество:
                        <input
                            type="number"
                            min={1}
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                        />
                    </label>
                    <br />
                    <menu>
                        <button type="submit">Сохранить</button>
                        <button type="button" onClick={() => dialogRef.current?.close()}>
                            Отмена
                        </button>
                    </menu>
                </form>
            </dialog>
        </div>
    );
}
