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
            {["username", "phone", "zipCode", "house", "street", "landmark", "city", "state"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full p-3 dark:bg-gray-300 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]?.message}</p>
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
                <p className="text-sm dark:text-gray-200 text-gray-700">
                  {currentAddress.username}
                </p>
                <p className="text-sm dark:text-gray-200 text-gray-700">
                  {currentAddress.street}
                </p>
                <p className="text-sm dark:text-gray-200 text-gray-700">
                  {currentAddress.city}, {currentAddress.state} - {currentAddress.zipCode}
                </p>
                <p className="text-sm dark:text-gray-200 text-gray-700">
                  {currentAddress.phone}
                </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
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
            <ul className="list-disc pl-5 space-y-2">
              {addresses.map((address, index) => (
                <li
                  key={index}
                  className={`cursor-pointer hover:underline text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition duration-200 ${
                    index === selectedAddressIndex ? "bg-blue-100 dark:bg-blue-700" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAddress(index)}
                    className="text-left w-full"
                  >
                    {`${address.username}, ${address.street}, ${address.city}`}
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
