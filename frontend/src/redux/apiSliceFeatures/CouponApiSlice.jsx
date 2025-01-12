import { crudApiSlice } from "./crudApiSlice";

export const couponApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => "/coupons/getCoupons",
      providesTags: ["Coupon"],
    }),

    getCoupon: builder.query({
      query: (id) => `/coupons/coupon/${id}`,
      providesTags: (result, error, id) => [{ type: "Coupon", id }],
    }),

    // Fetch active coupons
    getActiveCoupons: builder.query({
      query: () => "/coupons/getActiveCoupons",
      providesTags: [{ type: "Coupon", id: "active-coupons" }],
    }),

    getCouponStatistics: builder.query({
      query: () => "/coupons/getCouponStats",
      providesTags: [{ type: "Coupon", id: "coupon-stats" }],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetCouponQuery,
  useGetActiveCouponsQuery,
  useGetCouponStatisticsQuery,
} = couponApiSlice;
