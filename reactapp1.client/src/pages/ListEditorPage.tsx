import { useParams } from 'react-router-dom';

export default function ListEditorPage() {
    const { id } = useParams();

    return (
        <div>
            <h2>Редактирование списка #{id}</h2>
            {/* Тут потом будут товары */}
        </div>
    );
}
