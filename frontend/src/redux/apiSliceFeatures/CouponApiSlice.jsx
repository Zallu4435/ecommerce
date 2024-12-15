import { crudApiSlice } from './crudApiSlice';

export const couponApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all coupons
    getCoupons: builder.query({
      query: () => '/coupons/getCoupons',
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Coupon', id })),
              { type: 'Coupon', id: 'coupons-LIST' },
            ]
          : [{ type: 'Coupon', id: 'coupons-LIST' }],
    }),

    // Fetch coupon details by ID
    getCouponById: builder.query({
      query: (id) => `/coupons/getCoupon/${id}`,
      providesTags: (result, error, id) => [{ type: 'Coupon', id }],
    }),

    // Fetch active coupons
    getActiveCoupons: builder.query({
      query: () => '/coupons/getActiveCoupons',
      providesTags: [{ type: 'Coupon', id: 'active-coupons' }],
    }),

    // Fetch coupon statistics
    getCouponStatistics: builder.query({
      query: () => '/coupons/getCouponStats',
      providesTags: [{ type: 'Coupon', id: 'coupon-stats' }],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useGetActiveCouponsQuery,
  useGetCouponStatisticsQuery,
  useAddEntityMutation: useAddProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteEntityMutation: useDeleteProductMutation,
  useBanEntityMutation: useBanProductMutation,
} = couponApiSlice;
