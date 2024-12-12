import { useEffect } from 'react';


const AddressModal = ({ isOpen, onClose, onSave, formData, handleChange }) => {

  useEffect(() => {
    if (isOpen) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }

    return () => {
        document.body.classList.remove('modal-open');
    };
  }, [isOpen])

  if (!isOpen) return null;

  const inputFields = [
    { name: 'country', placeholder: 'Country' },
    { name: 'state', placeholder: 'State' },
    { name: 'city', placeholder: 'City' },
    { name: 'zipCode', placeholder: 'Zip Code' },
    { name: 'street', placeholder: 'Street Address' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          {formData.editing ? 'Edit Address' : 'Add Address'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
            onClose();
          }}
          className="grid grid-cols-1 gap-6"
        >
          {inputFields.map(({ name, placeholder }) => (
            <input
              key={name}
              type="text"
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
            />
          ))}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
            >
              {formData.editing ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
