import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  Input,
  InputContainer,
  Label,
} from "../../../components/user/StyledComponents/StyledComponents.js";
import { toast } from "react-toastify";
import { useAddEntityMutation } from "../../../redux/apiSliceFeatures/crudApiSlice";
import { useGetAllCouponsQuery } from "../../../redux/apiSliceFeatures/CouponApiSlice";
import { useGetUsersQuery } from "../../../redux/apiSliceFeatures/userApiSlice";
import { useGetProductsQuery } from "../../../redux/apiSliceFeatures/productApiSlice";
import { couponSchema } from "../../../validation/admin/CouponFormValidation";
import UserModal from "./UserModal";
import ProductModal from "./ProductModal";

const AdminCouponCreateForm = () => {
  const navigate = useNavigate();
  const [addEntity] = useAddEntityMutation();
  const { refetch } = useGetAllCouponsQuery();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [userPage, setUserPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const { data: users = [], isFetching: isUserFetching } = useGetUsersQuery({ page: userPage, limit: 20 });
  const { data: products = [], isFetching: isProductFetching } = useGetProductsQuery({ page: productPage, limit: 20 });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponCode: "",
      title: "",
      description: "",
      discount: "",
      minAmount: "",
      maxAmount: "",
      expiry: "",
      applicableUsers: [],
      applicableProducts: [],
    },
  });

  const onSubmit = async (formData) => {
    try {
      const dataToSubmit = {
        ...formData,
        discount: parseFloat(formData.discount),
        minAmount: parseFloat(formData.minAmount),
        maxAmount: parseFloat(formData.maxAmount),
        applicableUsers: selectedUsers.map((user) => user.userId),
        applicableProducts: selectedProducts.map(
          (product) => product.productId
        ),
      };
      await addEntity({ entity: "coupons", data: dataToSubmit }).unwrap();
      await refetch();
      toast.success("Coupon created successfully");
      navigate(-1);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleUserSelect = (userId, username) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((user) => user.userId === userId);
      if (isSelected) {
        return prev.filter((user) => user.userId !== userId);
      } else {
        return [...prev, { userId, username }];
      }
    });
  };

  const handleProductSelect = (productId, productName) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some(
        (product) => product.productId === productId
      );
      if (isSelected) {
        return prev.filter((product) => product.productId !== productId);
      } else {
        return [...prev, { productId, productName }];
      }
    });
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user.userId !== userId));
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product.productId !== productId)
    );
  };

  const loadMoreUsers = useCallback((page) => {
    setUserPage(page);
    // Here you would typically fetch more users
    // For this example, we'll just simulate it by setting hasMoreUsers to false after the first load
    if (page > 1) {
      setHasMoreUsers(false);
    }
  }, []);

  const loadMoreProducts = useCallback((page) => {
    setProductPage(page);
    // Here you would typically fetch more products
    // For this example, we'll just simulate it by setting hasMoreProducts to false after the first load
    if (page > 1) {
      setHasMoreProducts(false);
    }
  }, []);

  return (
    <div className="dark:bg-black min-h-screen flex w-full mt-10 items-center justify-center">
      <div className="dark:bg-gray-900 px-10 w-full bg-orange-50 p-6 md:p-8 shadow-md">
        <div className="flex justify-between">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
            Create Coupon
          </h1>
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2" />
              <span>Back to Coupons</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: "couponCode", label: "Coupon Code", type: "text" },
              { name: "title", label: "Coupon Title", type: "text" },
              {
                name: "discount",
                label: "Discount Percentage",
                type: "number",
              },
              { name: "minAmount", label: "Minimum Amount", type: "number" },
              { name: "maxAmount", label: "Maximum Amount", type: "number" },
              { name: "expiry", label: "Expiry Date", type: "date" },
            ].map((field) => (
              <InputContainer key={field.name}>
                <Label className="dark:text-white">{field.label} *</Label>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type={field.type}
                      value={value}
                      onChange={onChange}
                      className="w-full dark:text-white dark:bg-gray-800"
                    />
                  )}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name].message}
                  </p>
                )}
              </InputContainer>
            ))}
          </div>

          <InputContainer className="col-span-2 mt-6">
            <Label className="dark:text-white">Description *</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full h-[100px] p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </InputContainer>

          <div>
            <InputContainer>
              <Label className="dark:text-white">Applicable Users *</Label>
              <button
                type="button"
                onClick={() => setShowUserModal(true)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white text-left"
              >
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} user(s) selected`
                  : "Click to select users"}
              </button>
              <div className="mt-2">
                {selectedUsers.map((user) => (
                  <span
                    key={user.userId}
                    className="inline-block dark:bg-blue-400 bg-blue-200 font-semibold rounded-md p-1 mr-2 mb-2"
                  >
                    {user.username}
                    <button
                      type="button"
                      onClick={() => handleUserRemove(user.userId)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Applicable Products *</Label>
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white text-left"
              >
                {selectedProducts.length > 0
                  ? `${selectedProducts.length} product(s) selected`
                  : "Click to select products"}
              </button>
              <div className="mt-2">
                {selectedProducts.map((product) => (
                  <span
                    key={product.productId}
                    className="inline-block dark:bg-green-400 bg-green-200 font-semibold rounded-md p-1 mr-2 mb-2"
                  >
                    {product.productName}
                    <button
                      type="button"
                      onClick={() => handleProductRemove(product.productId)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </InputContainer>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="px-6 py-3 text-md w-full font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Coupon
            </button>
          </div>
        </form>

        <UserModal
          showModal={showUserModal}
          setShowModal={setShowUserModal}
          users={users?.users || []}
          handleUserSelect={handleUserSelect}
          selectedUsers={selectedUsers}
          loadMoreUsers={loadMoreUsers}
          hasMoreUsers={hasMoreUsers}
          isUserFetching={isUserFetching}
        />

        <ProductModal
          showModal={showProductModal}
          setShowModal={setShowProductModal}
          products={products?.products || []}
          handleProductSelect={handleProductSelect}
          selectedProducts={selectedProducts}
          loadMoreProducts={loadMoreProducts}
          hasMoreProducts={hasMoreProducts}
          isProductFetching={isProductFetching}
        />
      </div>
    </div>
  );
};

export default AdminCouponCreateForm;
