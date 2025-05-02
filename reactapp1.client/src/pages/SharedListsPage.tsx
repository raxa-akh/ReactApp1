import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import cls from "@/styles/SharedListsPage.module.css"
import Button from '@/components/button/Button';
import Navigation from '@/components/navigation/Navigation';

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
        <div className={cls.container}>
            <span className={cls.listsTitle}>Списки, доступные вам</span>
            {lists.length === 0 ? (
                <span className={cls.noLists}>Нет списков, к которым у вас есть доступ</span>
            ) : (
                <>
                    <ul className={cls.list}>
                        {lists.map(list => (
                            <li className={cls.listItem} key={list.id}>
                                <span className={cls.listName}>{list.name}</span>
                                <Button success={true} onClick={() => handleOpen(list.id)} text="Открыть"/> 
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <Navigation/>
        </div>

        
    );
}
