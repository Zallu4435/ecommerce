
import { useState, useEffect } from "react";
import { useCheckoutAddressQuery } from "../../../redux/apiSliceFeatures/addressPasswordApiSlice";
import { FaHandPointLeft, FaHandPointRight } from "react-icons/fa";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../../validation/schemas/addressSchema";

const ShippingAddress = ({ onAddressSelect }) => {
  const { data: addresses = [], isLoading, isError } = useCheckoutAddressQuery();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const {
    control,
    reset,
    getValues,
    formState: { errors } 
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
  });

  // Watch all form fields
  const formValues = useWatch({ control });

  useEffect(() => {
    if (addresses.length > 0) {
      reset(addresses[selectedAddressIndex]);
    }
  }, [addresses, selectedAddressIndex, reset]);

  useEffect(() => {
    handleAddressChange();
  }, [formValues, selectedAddressIndex]);

  // Initial load
  useEffect(() => {
    if (addresses.length > 0) {
      handleAddressChange();
    }
  }, [addresses]);

  const increment = () => {
    if (selectedAddressIndex < addresses.length - 1) {
      setSelectedAddressIndex(selectedAddressIndex + 1);
    }
  };

  const decrement = () => {
    if (selectedAddressIndex > 0) {
      setSelectedAddressIndex(selectedAddressIndex - 1);
    }
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
    setSelectedAddressIndex(0);
    handleAddressChange();
  };

  const handleAddressChange = () => {
    if (addresses.length > 0) {
      const selectedAddress = addresses[selectedAddressIndex] || {};
      const formValues = getValues();
      const combinedAddress = { ...selectedAddress, ...formValues };
      onAddressSelect(combinedAddress);
    } else {
      onAddressSelect(getValues());
    }
  };

  const fields = [
    "username",
    "phone",
    "zipCode",
    "house",
    "street",
    "landmark",
    "city",
    "state",
  ];

  if (isLoading) {
    return <div>Loading addresses...</div>;
  }

  if (isError) {
    return <div>Error loading addresses.</div>;
  }

  return (
    <div className="bg-white p-6 shadow-md rounded-md">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <div className="flex gap-10">
          <div className="flex items-center space-x-2">
            <div className="flex gap-4 text-2xl cursor-pointer">
              <FaHandPointLeft onClick={decrement} />
              <FaHandPointRight onClick={increment} />
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="bg-blue-500 text-md hover:bg-blue-600 text-white font-bold px-6 rounded"
          >
            New
          </button>
        </div>
      </div>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Controller
                name={field}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]?.message}</p>
              )}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default ShippingAddress;