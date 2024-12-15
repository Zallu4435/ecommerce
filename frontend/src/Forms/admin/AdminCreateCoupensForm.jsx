import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { couponSchema } from '../../validation/admin/CouponFormValidation';
import { Input, InputContainer, Label } from '../../components/user/StyledComponents/StyledComponents';
import { toast } from 'react-toastify';
import { useAddEntityMutation } from '../../redux/apiSliceFeatures/crudApiSlice';

const AdminCouponCreateForm = () => {
  const navigate = useNavigate();
  const [addEntity] = useAddEntityMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponCode: '',
      discount: '',
      expiry: '',
      maxDiscount: '',
      minPurchase: '',
    }
  });

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      await addEntity({ entity: "coupons", data: formData }).unwrap();
      toast.success("Coupon created successfully");
      navigate(-1);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="dark:bg-black mx-[160px] min-h-screen flex w-full items-center justify-center  p-4">
      <div className="w-[600px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 rounded-md shadow-md ">
        {/* Back Button */}
        <div className='flex justify-between'> 
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
            <Label className="dark:text-white">Discount *</Label>
            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="number" 
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

          <InputContainer>
            <Label className="dark:text-white">Max Discount *</Label>
            <Controller
              name="maxDiscount"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="Enter max discount" 
                  className="w-full"
                />
              )}
            />
            {errors.maxDiscount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxDiscount.message}
              </p>
            )}
          </InputContainer>

          <InputContainer>
            <Label className="dark:text-white">Min Purchase *</Label>
            <Controller
              name="minPurchase"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="Enter min purchase amount" 
                  className="w-full"
                />
              )}
            />
            {errors.minPurchase && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minPurchase.message}
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
