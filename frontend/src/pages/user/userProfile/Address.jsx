import { useState } from 'react';
import AddressModal from '../../../modal/user/AddressModal';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    zip: '',
    street: '',
    editing: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = () => {
    if (addresses.length >= 7) {
      alert("You can only add up to 7 addresses.");
      return;
    }
    setAddresses([...addresses, formData]);
    setFormData({ country: '', state: '', city: '', zip: '', street: '', editing: false }); // Clear form
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setFormData({ ...addresses[index], editing: true });
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedAddresses = [...addresses];
    updatedAddresses[editingIndex] = formData;
    setAddresses(updatedAddresses);
    setEditingIndex(null);
    setFormData({ country: '', state: '', city: '', zip: '', street: '', editing: false }); // Clear form
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleOpenModal = () => {
    setFormData({ country: '', state: '', city: '', zip: '', street: '', editing: false });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Manage Addresses</h2>
      <div className="mb-8">
        <button
          onClick={handleOpenModal}
          className="w-full bg-indigo-500 text-white py-3 rounded-md mb-4 hover:bg-indigo-600 transition duration-300"
        >
          Add Address
        </button>
        {addresses.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Saved Addresses</h3>
            <ul className="space-y-4">
              {addresses.map((address, index) => (
                <li key={index} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div>
                    <p className="text-gray-900 dark:text-gray-100">
                      {Object.values(address).join(', ')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAddress(index)}
                      className="text-indigo-500 hover:text-indigo-700 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveAddress(index)}
                      className="text-red-500 hover:text-red-700 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-100">No addresses saved yet.</h3>
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingIndex !== null ? handleSaveEdit : handleAddAddress}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default AddressPage;
