import { useEffect } from "react";

const AddressModal = ({ isOpen, onClose, onSave, formData, handleChange }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const inputFields = [
    { name: "country", label: "Country", placeholder: "Enter country" },
    { name: "state", label: "State", placeholder: "Enter state" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "zipCode", label: "Zip Code", placeholder: "Enter zip code" },
    { name: "street", label: "Street Address", placeholder: "Enter street address" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-600 dark:text-gray-300">
          {formData.editing ? "Edit Address" : "Add Address"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
            onClose();
          }}
          className="grid grid-cols-1 gap-6"
        >
          {inputFields.map(({ name, label, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                {label}
              </label>
              <input
                id={name}
                type="text"
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-3 dark:border border-2 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
            >
              {formData.editing ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
