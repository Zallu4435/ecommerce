import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { couponSchema } from '../../validation/admin/CouponFormValidation';
import { Input, InputContainer, Label } from '../../components/user/StyledComponents/StyledComponents';
import { toast } from 'react-toastify';
import { useAddEntityMutation } from '../../redux/apiSliceFeatures/crudApiSlice';
import { useGetAllCouponsQuery } from '../../redux/apiSliceFeatures/CouponApiSlice';

const AdminCouponCreateForm = () => {
  const navigate = useNavigate();
  const [addEntity] = useAddEntityMutation();
    const { refetch } = useGetAllCouponsQuery();

  // console.log(products?.products, "users")
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponCode: '',
      title: '',
      description: '',
      discount: '',
      minAmount: '',
      maxAmount: '',
      expiry: '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      // Convert string values to numbers for numeric fields
      const dataToSubmit = {
        ...formData,
        discount: parseFloat(formData.discount),
        minAmount: parseFloat(formData.minAmount),
        maxAmount: parseFloat(formData.maxAmount),
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

  return (
    <div className="dark:bg-black mx-[100px] min-h-screen flex w-full items-center justify-center p-4">
      <div className="w-[800px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 rounded-md shadow-md">
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
            <InputContainer>
              <Label className="dark:text-white">Coupon Code *</Label>
              <Controller
                name="couponCode"
                control={control}
                rules={{ required: 'Coupon code is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter unique coupon code"
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
                rules={{ required: 'Coupon title is required' }}
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
              <Label className="dark:text-white">Discount Percentage *</Label>
              <Controller
                name="discount"
                control={control}
                rules={{ required: 'Discount is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter discount percentage"
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
                rules={{ required: 'Minimum amount is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter minimum purchase amount"
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
                rules={{ required: 'Maximum amount is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter maximum discount amount"
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
                rules={{ required: 'Expiry date is required' }}
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
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter coupon description"
                  className="w-full h-40 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </InputContainer>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCouponCreateForm;

