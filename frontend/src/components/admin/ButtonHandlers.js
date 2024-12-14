import { useNavigate } from 'react-router-dom';
import {
  useAddEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
  useBanEntityMutation,
} from '../../redux/apiSliceFeatures/crudApiSlice'; // Adjust the path as needed

export const useButtonHandlers = () => {
  const navigate = useNavigate();

  // Initialize RTK Query mutations
  const [addEntity] = useAddEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();
  const [deleteEntity] = useDeleteEntityMutation();
  const [banEntity] = useBanEntityMutation();

  const handleUpdate = async (id, type) => {
    try {
      navigate(`update/products/${id}`)
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteEntity({ entity: type, id }).unwrap();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const handleCreate = async (type, data) => {
    try {
      navigate(`create/products`)
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to create. Please try again.');
    }
  };

  const handleBan = async (id, type) => {
    try {
      await banEntity({ entity: type, id }).unwrap();
      alert(`${type} with id ${id} banned successfully.`);
    } catch (error) {
      console.error('Ban failed:', error);
      alert('Failed to ban. Please try again.');
    }
  };

  const handleView = async (id, type) => {
    try {
      navigate(`view/${type}/${id}`); // Navigate to the entity details page using type and id
    } catch (error) {
      console.error('view failed:', error);
      alert('Failed to ban. Please try again.');
    }

  };


  return { handleUpdate, handleDelete, handleCreate, handleBan, handleView };
};
