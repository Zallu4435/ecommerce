import { useNavigate } from 'react-router-dom';

export const useButtonHandlers = () => {
    const navigate = useNavigate();

    const handleUpdate = (id, type) =>  {
        navigate(`/update/${type}/${id}`);
    };

    const handleDelete = (id, type) => {
        console.log(`Delted ${type} with id: ${id}`);
    };

    const handleCreate = (type) => {
        navigate(`/create/${type}`);
    };

    const handleBan = (id, type) => {
        console.log(`Banned ${type} of id: ${id}`)
    };

    const handleView = (type) => {
        navigate(`/view/${type}`)
    }

    return { handleUpdate, handleDelete, handleCreate, handleBan, handleView };

}

