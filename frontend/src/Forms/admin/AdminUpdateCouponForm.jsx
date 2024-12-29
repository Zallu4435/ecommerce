import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { couponSchema } from "../../validation/admin/CouponFormValidation";
import {
  Input,
  InputContainer,
  Label,
} from "../../components/user/StyledComponents/StyledComponents";
import { toast } from "react-toastify";
import { useUpdateEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import {
  useGetAllCouponsQuery,
  useGetCouponQuery,
} from "../../redux/apiSliceFeatures/CouponApiSlice";
import { useGetUsersQuery } from "../../redux/apiSliceFeatures/userApiSlice";
import { useGetProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";

const AdminCouponUpdateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id, "from params");
  const [updateEntity] = useUpdateEntityMutation();

  const { data: couponData, error, isLoading } = useGetCouponQuery(id);
  const { refetch } = useGetAllCouponsQuery();
  const { data: userData } = useGetUsersQuery();
  const { data: productData } = useGetProductsQuery();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (couponData && userData && productData) {
      // Set the coupon form values
      setValue("couponCode", couponData?.coupon?.couponCode || "");
      setValue("title", couponData?.coupon?.title || "");
      setValue("description", couponData?.coupon?.description || "");
      setValue("discount", couponData?.coupon?.discount?.toString() || "");
      setValue("minAmount", couponData?.coupon?.minAmount?.toString() || "");
      setValue("maxAmount", couponData?.coupon?.maxAmount?.toString() || "");
      setValue("expiry", formatDate(couponData?.coupon?.expiry) || "");

      if (couponData?.coupon?.applicableUsers?.length > 0) {
        const mappedUsers = couponData?.coupon?.applicableUsers
          ?.map((userEmail) => {
            const user = userData?.users?.find((u) => u.email === userEmail); // Match by email
            if (user) {
              return { userId: user.id, username: user.email }; // Store userId and email
            }
            return null;
          })
          .filter(Boolean); // Filter out null values
        setSelectedUsers(mappedUsers || []);
      }

      // Map applicable products by matching product names
      if (couponData?.coupon?.applicableProducts?.length > 0) {
        const mappedProducts = couponData?.coupon?.applicableProducts
          ?.map((productName) => {
            const product = productData?.products?.find(
              (p) => p.productName === productName
            );
            if (product) {
              return {
                productId: product.id,
                productName: product.productName,
              }; // Match by name
            }
            return null;
          })
          .filter(Boolean); // Filter out nulls
        setSelectedProducts(mappedProducts || []);
      }
    }
  }, [couponData, userData, productData, setValue]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const onSubmit = async (formData) => {
    try {
      const updatedData = {
        ...formData,
        applicableUsers: selectedUsers.map((user) => user.userId),
        applicableProducts: selectedProducts.map(
          (product) => product.productId
        ),
      };
  
      await updateEntity({ entity: "coupons", id, data: updatedData }).unwrap();
      
      // Refetch the updated coupon data
      await refetch();
  
      toast.success("Coupon updated successfully");
  
      // Navigate back
      navigate(-1);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };
  
  const handleUserSelect = (userId, username) => {
    setSelectedUsers((prevUsers) => {
      const userExists = prevUsers.some((user) => user.userId === userId);
      if (userExists) {
        return prevUsers.filter((user) => user.userId !== userId);
      } else {
        return [...prevUsers, { userId, username }];
      }
    });
  };

  const handleProductSelect = (productId, productName) => {
    setSelectedProducts((prevProducts) => {
      const productExists = prevProducts.some(
        (product) => product.productId === productId
      );
      if (productExists) {
        return prevProducts.filter(
          (product) => product.productId !== productId
        );
      } else {
        return [...prevProducts, { productId, productName }];
      }
    });
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.userId !== userId)
    );
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.productId !== productId)
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="dark:bg-black w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-[800px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 rounded-md shadow-md">
        <div className="flex justify-between">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
            Update Coupon
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
            <InputContainer>
              <Label className="dark:text-white">Coupon Code *</Label>
              <Controller
                name="couponCode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full"
                  />
                )}
              />
              {errors.couponCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.couponCode.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Coupon Title *</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter coupon title"
                    className="w-full"
                  />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Discount *</Label>
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter discount value"
                    className="w-full"
                  />
                )}
              />
              {errors.discount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Minimum Amount *</Label>
              <Controller
                name="minAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter minimum amount"
                    className="w-full"
                  />
                )}
              />
              {errors.minAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minAmount.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Maximum Amount *</Label>
              <Controller
                name="maxAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter maximum amount"
                    className="w-full"
                  />
                )}
              />
              {errors.maxAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxAmount.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Expiry Date *</Label>
              <Controller
                name="expiry"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    placeholder="Select expiry date"
                    className="w-full"
                  />
                )}
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expiry.message}
                </p>
              )}
            </InputContainer>
          </div>

          <InputContainer className="col-span-2 mt-6">
            <Label className="dark:text-white">Description *</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter coupon description"
                  className="w-full h-30 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
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
                    className="inline-block bg-blue-200 rounded-md p-1 mr-2 mb-2"
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
                    className="inline-block bg-green-200 rounded-md p-1 mr-2 mb-2"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Coupon
            </button>
          </div>
        </form>

        {showUserModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3 max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center mb-4 rounded-t-lg">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-gray-100">
                  Select Users
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              <div className="sticky top-16 bg-white dark:bg-gray-800 p-4 mb-4 rounded-t-lg">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                <div className="space-y-2">
                  {userData?.users
                    ?.filter((user) =>
                      user.email
                        .toLowerCase()
                        .includes(userSearchQuery.toLowerCase())
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center rounded-md"
                        onClick={() => handleUserSelect(user.id, user.email)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.some(
                            (u) => u.userId === user.id
                          )}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <span className="text-gray-800 dark:text-gray-100">
                          {user.email}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showProductModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3 max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center rounded-t-lg">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-gray-100">
                  Select Products
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              <div className="sticky top-16 bg-white dark:bg-gray-800 p-4 rounded-t-lg">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                <div className="space-y-2">
                  {productData?.products
                    ?.filter((product) =>
                      product.productName
                        .toLowerCase()
                        .includes(productSearchQuery.toLowerCase())
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center rounded-md"
                        onClick={() =>
                          handleProductSelect(product.id, product.productName)
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(
                            (p) => p.productId === product.id
                          )}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <span className="text-gray-800 dark:text-gray-100">
                          {product.productName}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCouponUpdateForm;
