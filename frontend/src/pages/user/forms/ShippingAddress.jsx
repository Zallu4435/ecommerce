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
      username: "",
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

      setSelectedAddressIndex(defaultIndex);
      setCurrentAddress(addresses[defaultIndex]);
      reset(addresses[defaultIndex]);
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
      username: "",
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
      <div className="text-center text-red-500">Error loading addresses.</div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-200 text-gray-800">
        Shipping Address
      </h2>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "username", placeholder: "Enter full name" },
              { name: "phone", placeholder: "Enter phone number" },
              { name: "zipCode", placeholder: "Enter zip code" },
              { name: "house", placeholder: "Enter house/apartment" },
              { name: "street", placeholder: "Enter street" },
              { name: "landmark", placeholder: "Enter landmark (optional)" },
              { name: "city", placeholder: "Enter city" },
              { name: "state", placeholder: "Enter state" }
            ].map(
              ({ name, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-2">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </label>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder={placeholder}
                        className="w-full p-3 dark:bg-gray-300 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm">{errors[name]?.message}</p>
                  )}
                </div>
              )
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md transition duration-200"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200 text-gray-800">
            Selected Address:
          </h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
            {currentAddress ? (
              <>
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-16 text-sm">Name:</span>
                    <span className="text-sm dark:text-gray-200 text-gray-700 font-medium">{currentAddress.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-16 text-sm">Phone:</span>
                    <span className="text-sm dark:text-gray-200 text-gray-700 font-medium">{currentAddress.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-16 text-sm">Street:</span>
                    <span className="text-sm dark:text-gray-200 text-gray-700">{currentAddress.street}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-16 text-sm">City:</span>
                    <span className="text-sm dark:text-gray-200 text-gray-700">{currentAddress.city}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-16 text-sm">State:</span>
                    <span className="text-sm dark:text-gray-200 text-gray-700">{currentAddress.state}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-16 text-sm">Zip:</span>
                    <span className="text-sm dark:text-gray-200 text-gray-700">{currentAddress.zipCode}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm dark:text-gray-200 text-gray-700">No address selected</p>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            {addresses.length > 1 && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-2 rounded-md transition duration-200"
              >
                Change Address
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-md transition duration-200"
            >
              New Address
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Select an Address:
            </h3>
            <ul className="space-y-3">
              {addresses.map((address, index) => (
                <li
                  key={index}
                  className={`cursor-pointer rounded-md p-3 transition duration-200 border ${index === selectedAddressIndex
                    ? "bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-700 text-white"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAddress(index)}
                    className="text-left w-full"
                  >
                    <div className="font-semibold mb-1">{address.username || address.name || 'No Name'}</div>
                    <div className="text-sm space-y-1">
                      <div className="flex gap-2">
                        <span className="opacity-70 w-12">Street:</span>
                        <span>{address.house ? `${address.house}, ` : ''}{address.street || address.address || 'No Street'}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="opacity-70 w-12">City:</span>
                        <span>{address.city || 'No City'}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="opacity-70 w-12">State:</span>
                        <span>{address.state || 'No State'}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="opacity-70 w-12">Zip:</span>
                        <span>{address.zipCode || address.zip || 'No Zip'}</span>
                      </div>
                      {address.phone && (
                        <div className="flex gap-2">
                          <span className="opacity-70 w-12">Phone:</span>
                          <span>{address.phone}</span>
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md transition duration-200"
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
