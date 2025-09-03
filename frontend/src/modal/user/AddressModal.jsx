import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../validation/schemas/addressSchema";

const AddressModal = ({ isOpen, onClose, onSave, formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: formData || {
      username: "",
      phone: "",
      zipCode: "",
      house: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
    },
    mode: "onBlur",
  });
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = previousOverflow || "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  if (!isOpen) return null;

  const inputFields = [
    { name: "username", label: "Full Name", placeholder: "Enter full name" },
    { name: "phone", label: "Phone", placeholder: "Enter phone number" },
    { name: "zipCode", label: "Zip Code", placeholder: "Enter zip code" },
    { name: "house", label: "House/Apartment", placeholder: "Enter address" },
    { name: "street", label: "Street", placeholder: "Enter street" },
    { name: "landmark", label: "Landmark (optional)", placeholder: "Nearby landmark" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-gray-600 dark:text-gray-300">
          {formData.editing ? "Edit Address" : "Add Address"}
        </h2>
        <form onSubmit={handleSubmit((data) => { onSave(data); onClose(); })} className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto pr-1 sm:pr-2 max-h-[50vh]">
            {inputFields.map(({ name, label, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  {label}
                </label>
                <input
                  id={name}
                  type="text"
                  placeholder={placeholder}
                  {...register(name)}
                  className={`w-full px-4 py-3 dark:border border-2 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 ${errors[name] ? 'border-red-500' : ''}`}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
                )}
              </div>
            ))}
          </div>
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
