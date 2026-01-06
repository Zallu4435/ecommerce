import { useState, useEffect } from "react";
import { useCheckoutAddressQuery } from "../../../redux/apiSliceFeatures/userProfileApi";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../../validation/schemas/addressSchema";
import { FaTimes } from "react-icons/fa";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ShippingAddress = ({ onAddressSelect }) => {
  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useCheckoutAddressQuery();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      zipCode: "",
      house: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
    },
    resolver: zodResolver(addressSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (addresses.length > 0) {
      const primaryIndex = addresses.findIndex((addr) => addr.isPrimary);
      const defaultIndex = primaryIndex !== -1 ? primaryIndex : 0;

      const selectedAddress = addresses[defaultIndex];
      setSelectedAddressIndex(defaultIndex);
      setCurrentAddress(selectedAddress);
      reset({
        ...selectedAddress,
        zipCode: selectedAddress.zipCode ? String(selectedAddress.zipCode) : ""
      });
    }
  }, [addresses, reset]);

  useEffect(() => {
    if (currentAddress) {
      onAddressSelect(currentAddress);
    }
  }, [currentAddress, onAddressSelect]);

  const onSubmit = (data) => {
    setCurrentAddress(data);
    setIsEditing(false);
  };

  const handleReset = () => {
    reset({
      fullName: "",
      phone: "",
      zipCode: "",
      house: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
    });
    setIsEditing(true);
  };

  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);
    setCurrentAddress(addresses[index]);
    setIsEditing(false);
    setShowModal(false);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        Error loading addresses.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all duration-300">
      <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white tracking-tight">
        Shipping Address
      </h2>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "fullName", placeholder: "Enter full name", label: "Full Name" },
              { name: "phone", placeholder: "Enter phone number", label: "Phone" },
              { name: "zipCode", placeholder: "Enter zip code", label: "Zip Code" },
              { name: "house", placeholder: "Enter house/apartment", label: "House No." },
              { name: "street", placeholder: "Enter street", label: "Street" },
              { name: "landmark", placeholder: "Enter landmark (optional)", label: "Landmark" },
              { name: "city", placeholder: "Enter city", label: "City" },
              { name: "state", placeholder: "Enter state", label: "State" }
            ].map(
              ({ name, placeholder, label }) => (
                <div key={name} className={name === 'street' || name === 'house' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                    {label}
                  </label>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder={placeholder}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                      />
                    )}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-xs font-medium mt-1.5 ml-2">{errors[name]?.message}</p>
                  )}
                </div>
              )
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-8 py-3.5 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Save Address
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Selected Location
            </h3>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 relative group overflow-hidden">
            {currentAddress ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Recipient</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{currentAddress.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentAddress.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Address</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {currentAddress.house}, {currentAddress.street}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentAddress.city}, {currentAddress.state} - <span className="font-bold">{currentAddress.zipCode}</span>
                  </p>
                  {currentAddress.landmark && (
                    <p className="text-xs italic text-blue-500 dark:text-blue-400 mt-1">Near {currentAddress.landmark}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 italic">Please select or add a shipping address to proceed.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            {addresses.length > 1 && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-6 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Choose Another
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3.5 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg"
            >
              Add New Address
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl relative border border-gray-100 dark:border-gray-800 animate-slideUp max-h-[85vh] flex flex-col">
            <button
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => setShowModal(false)}
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white pr-10 tracking-tight">
              Select Address
            </h3>
            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-3 flex-1">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAddress(index)}
                  className={`cursor-pointer rounded-[1.5rem] p-5 transition-all duration-300 border-2 text-left group ${index === selectedAddressIndex
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-blue-200 dark:hover:border-blue-900 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                    }`}
                >
                  <div className={`font-bold text-lg mb-2 ${index === selectedAddressIndex ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {address.fullName}
                  </div>
                  <div className="text-sm space-y-1 opacity-90 font-medium">
                    <p>{address.house}, {address.street}</p>
                    <p>{address.city}, {address.state} - {address.zipCode}</p>
                    <p className="text-xs mt-2 opacity-75">{address.phone}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-3 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
