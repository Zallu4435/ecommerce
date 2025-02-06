import { useNavigate } from "react-router-dom";
import {
  useDeleteEntityMutation,
  useBanEntityMutation,
} from "../../redux/apiSliceFeatures/crudApiSlice";
import { useGetUsersQuery } from "../../redux/apiSliceFeatures/userApiSlice";
import { useGetCategoriesQuery } from "../../redux/apiSliceFeatures/categoryApiSlice";

export const useButtonHandlers = () => {
  const navigate = useNavigate();
  const [deleteEntity] = useDeleteEntityMutation();
  const [banEntity] = useBanEntityMutation();
  const { refetch } = useGetUsersQuery();
  const { refetch: refetchCategory } = useGetCategoriesQuery();

  const handleUpdate = async (id, type) => {
    try {
      navigate(`update/${type}/${id}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update. Please try again.");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteEntity({ entity: type, id }).unwrap();
      if (type === "category") {
        refetchCategory();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleCreate = async (type, data) => {
    try {
      navigate(`create/${type}`);
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to create. Please try again.");
    }
  };

  const handleBan = async (type, id) => {
    try {
      await banEntity({ entity: type, id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Ban failed:", error);
      alert("Failed to ban. Please try again.");
    }
  };

  const handleView = async (id, type) => {
    try {
      navigate(`view/${type}/${id}`);
    } catch (error) {
      console.error("view failed:", error);
      alert("Failed to ban. Please try again.");
    }
  };

  return { handleUpdate, handleDelete, handleCreate, handleBan, handleView };
};
