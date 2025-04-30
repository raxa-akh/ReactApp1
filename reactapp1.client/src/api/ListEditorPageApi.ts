import axios from "axios";


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

type WithTwoStringsAndFunctions = (
    id: string | undefined,
    token: string,
    ...rest: Array<(e : any) => void>
) => void;


export const fetchShared: WithTwoStringsAndFunctions = async (id, token, setSharedUsers) => {
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
