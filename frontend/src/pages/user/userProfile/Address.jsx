import { useState } from "react";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useRemoveAddressMutation,
  useSetPrimaryAddressMutation,
  useGetAddressByIdQuery,
} from "../../../redux/apiSliceFeatures/userProfileApi";
import AddressModal from "../../../modal/user/AddressModal";
import { toast } from 'react-toastify'
import LoadingSpinner from "../../../components/LoadingSpinner";

const AddressPage = () => {
  const { data: addresses, isLoading, isError } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [editAddress] = useEditAddressMutation();
  const [removeAddress] = useRemoveAddressMutation();
  const [setPrimaryAddress] = useSetPrimaryAddressMutation();

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    zipCode: "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    isPrimary: false,
    editing: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddAddress = async (validated) => {
    if (addresses.length >= 7) {
      toast.warning("You can only add up to 7 addresses.");
      return;
    }
    try {
      await addAddress(validated).unwrap();
      toast.success('Address added successfully')
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add address')
      console.error("Failed to add address:", error);
    }
  };

  const handleEditAddress = async (index, address) => {
    setEditingIndex(index);
    try {
      const id = address._id || address.id;
      const res = await fetch(`/userProfile/address/${id}`, { credentials: 'include' });
      const full = await res.json();
      setFormData({ ...(full || address), editing: true });
    } catch (e) {
      setFormData({ ...address, editing: true });
    }
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (validated) => {
    try {
      const updatedAddress = { ...validated };
      await editAddress({
        id: addresses[editingIndex].id,
        updatedAddress,
      }).unwrap();
      setIsModalOpen(false);
      setEditingIndex(null);
      setFormData({
        username: "",
        phone: "",
        zipCode: "",
        house: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        isPrimary: false,
        editing: false,
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to edit')
      console.error("Failed to update address:", error);
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      await removeAddress(id).unwrap();
      toast.success('Address removed successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove address');
      console.error("Failed to delete address:", error);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await setPrimaryAddress(id).unwrap();
      toast.success('Primary address updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to set primary address');
      console.error("Failed to set primary address:", error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      username: "",
      phone: "",
      zipCode: "",
      house: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      isPrimary: false,
      editing: false,
    });
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Error...</p>;

  return (
    <div className="max-w-3xl mt-8 lg:mt-0 mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Manage Addresses
      </h2>
      <div className="mb-8">
        <button
          onClick={handleOpenModal}
          className="w-full bg-indigo-500 text-white py-3 rounded-md mb-4 hover:bg-indigo-600 transition duration-300"
        >
          Add Address
        </button>
        {addresses.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Saved Addresses
            </h3>
            <ul className="space-y-4">
              {addresses.map((address, index) => (
                <li
                  key={address.id}
                  className={`flex flex-col p-4 ${
                    address.isPrimary ? 'bg-indigo-50 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-800'
                  } rounded-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-gray-100">
                        {`${address.country}, ${address.state}, ${address.city}, ${address.zipCode ?? address.zip}, ${address.street}`}
                      </p>
                      {address.isPrimary && (
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                          Primary Address
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!address.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(address._id)}
                          className="text-yellow-500 hover:text-indigo-700 transition duration-300"
                        >
                          Make Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleEditAddress(index, address)}
                        className="text-indigo-500 hover:text-indigo-700 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveAddress(address._id)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                        disabled={address.isPrimary}
                        title={address.isPrimary ? "Cannot remove primary address" : ""}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-100">
            No addresses saved yet.
          </h3>
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingIndex !== null ? handleSaveEdit : handleAddAddress}
        formData={formData}
      />
    </div>
  );
};

export default AddressPage;