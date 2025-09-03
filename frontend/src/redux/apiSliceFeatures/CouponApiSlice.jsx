import { crudApiSlice } from "./crudApiSlice";

export const couponApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (args = {}) => {
        const { page = 1, limit = 5, search } = args || {};
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
        return `/coupons/getCoupons?page=${page}&limit=${limit}${searchParam}`;
      },
      providesTags: (result) => {
        const base = [{ type: "Coupon", id: "LIST" }];
        if (!result?.coupons) return base;
        return [
          ...base,
          ...result.coupons.map((c) => ({ type: "Coupon", id: c._id || c.id })),
        ];
      },
    }),

    getCoupon: builder.query({
      query: (id) => `/coupons/coupon/${id}`,
      providesTags: (result, error, id) => [
        { type: "Coupon", id },
      ],
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
