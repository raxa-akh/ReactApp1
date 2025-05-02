import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import cls from "@/styles/MyListsPage.module.css"
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import Navigation from '@/components/navigation/Navigation';

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
        <div className={cls.container}>
            <span className={cls.title}>Мои списки</span>
            <div className={cls.newList}>
                <span className={cls.newListTitle}>Создать список</span>
                <div className={cls.newListInner}>
                    <Input type="text"
                        placeholder="Введите название списка"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        width="300px"
                        />
                    <Button success={true} text="Создать" onClick={() => handleCreate()}/>
                </div>
            </div>

            {lists.length === 0 ? <span className={cls.noLists}>У вас пока нет списков</span> :
                <div className={cls.lists}>
                    <span className={cls.listsTitle}>Ваши списки</span>
                    <ul className={cls.list}>
                        {lists.map((list) => (
                            <li className={cls.listItem} key={list.id}>
                                <span className={cls.listName}>{list.name}</span>
                                <div className={cls.buttons}>
                                    <Button error={true} text='Удалить' onClick={() => handleDelete(list.id)}/>
                                    <Button text='Открыть' onClick={() => handleOpen(list.id)}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            }
            <Navigation/>
        </div>
    );
}
