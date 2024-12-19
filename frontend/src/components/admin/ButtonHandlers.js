import { useNavigate } from 'react-router-dom';
import {
  useAddEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
  useBanEntityMutation,
} from '../../redux/apiSliceFeatures/crudApiSlice'; // Adjust the path as needed
import { useGetUsersQuery } from '../../redux/apiSliceFeatures/userApiSlice';
import { useGetCategoriesQuery } from '../../redux/apiSliceFeatures/categoryApiSlice';

export const useButtonHandlers = () => {
  const navigate = useNavigate();

  // Initialize RTK Query mutations
  const [addEntity] = useAddEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();
  const [deleteEntity] = useDeleteEntityMutation();
  const [banEntity] = useBanEntityMutation();
  const { refetch } = useGetUsersQuery();
  const { refetch: refetchCategory } = useGetCategoriesQuery();


  const handleUpdate = async (id, type) => {
    console.log("hererererererere")
    try {
      navigate(`update/${type}/${id}`)
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      console.log(type, id, "from caegory")
      await deleteEntity({ entity: type, id }).unwrap();
      if (type === 'category') {
        refetchCategory();
      }
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const handleCreate = async (type, data) => {
    try {
      navigate(`create/${type}`)
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to create. Please try again.');
    }
  };

  const handleBan = async (type, id) => {
    try {
      console.log(type, "id from buttonhandler")
      await banEntity({ entity: type, id }).unwrap();
      refetch();
      // alert(`${type} with id ${id} banned successfully.`);
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
