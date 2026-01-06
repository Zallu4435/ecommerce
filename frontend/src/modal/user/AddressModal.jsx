import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../validation/schemas/addressSchema";
import usePreventBodyScroll from "../../hooks/usePreventBodyScroll";
import { X, MapPin, Plus, Save } from "lucide-react";

const AddressModal = ({ isOpen, onClose, onSave, formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: formData || {
      fullName: "",
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

  // Prevent body scroll when modal is open
  usePreventBodyScroll(isOpen);

  useEffect(() => {
    if (formData) {
      reset({
        ...formData,
        zipCode: formData.zipCode ? String(formData.zipCode) : ""
      });
    }
  }, [formData, reset]);

  if (!isOpen) return null;

  const inputFields = [
    { name: "fullName", label: "Full Name", placeholder: "Enter recipient's name" },
    { name: "phone", label: "Phone Number", placeholder: "e.g. +91 9876543210" },
    { name: "zipCode", label: "Postal Code", placeholder: "e.g. 110001" },
    { name: "house", label: "Flat / House No.", placeholder: "e.g. House No. 42" },
    { name: "street", label: "Area / Street", placeholder: "e.g. MG Road, Civil Lines" },
    { name: "landmark", label: "Landmark (Optional)", placeholder: "e.g. Near Mall" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 animate-slideUp">

        {/* Header */}
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formData.editing ? "Edit Delivery Address" : "Add New Address"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please provide accurate details for smooth delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit((data) => { onSave(data); onClose(); })}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-white dark:bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {inputFields.map(({ name, label, placeholder }) => (
                <div key={name} className={name === 'street' || name === 'house' ? 'sm:col-span-2' : ''}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1"
                  >
                    {label}
                  </label>
                  <div className="relative group">
                    <input
                      id={name}
                      type="text"
                      placeholder={placeholder}
                      {...register(name)}
                      className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 rounded-2xl text-gray-900 dark:text-white transition-all duration-300 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 ${errors[name]
                        ? 'border-red-500/50 focus:border-red-500 ring-red-50 dark:ring-red-900/20'
                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 shadow-sm'
                        }`}
                    />
                  </div>
                  {errors[name] && (
                    <p className="text-red-500 text-xs font-medium mt-1.5 ml-2 animate-shake">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800/50 flex flex-col sm:flex-row gap-4 items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3.5 text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 dark:shadow-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {formData.editing ? (
                <>
                  <Save className="w-5 h-5" />
                  Update Address
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Save Address
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
