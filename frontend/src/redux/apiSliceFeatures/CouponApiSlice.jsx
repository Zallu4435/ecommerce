import { crudApiSlice } from './crudApiSlice';

export const couponApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all coupons
    getAllCoupons: builder.query({
      query: () => '/coupons/getCoupons', // Updated to match the new route for fetching all coupons
      providesTags: ['Coupon'],
    }),

    // Fetch coupon details by ID
    getCoupon: builder.query({
      query: (id) => `/coupons/coupon/${id}`, // Updated to match the new route for fetching a coupon by ID
      providesTags: (result, error, id) => [{ type: 'Coupon', id }],
    }),

    // Fetch active coupons
    getActiveCoupons: builder.query({
      query: () => '/coupons/getActiveCoupons', // Assuming there is a route for active coupons
      providesTags: [{ type: 'Coupon', id: 'active-coupons' }],
    }),

    // Fetch coupon statistics
    getCouponStatistics: builder.query({
      query: () => '/coupons/getCouponStats', // Assuming there is a route for coupon stats
      providesTags: [{ type: 'Coupon', id: 'coupon-stats' }],
    }),

  }),
});

export const {
  useGetAllCouponsQuery,
  useGetCouponQuery,
  useGetActiveCouponsQuery,
  useGetCouponStatisticsQuery,
} = couponApiSlice;
