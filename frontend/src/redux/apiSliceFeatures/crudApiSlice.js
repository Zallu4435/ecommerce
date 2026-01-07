import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const crudApiSlice = createApi({
  reducerPath: "crudApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Entity", "Coupon", "User", "Review"],
  endpoints: (builder) => ({
    addEntity: builder.mutation({
      query: ({ entity, data }) => ({
        url: `/${entity}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { entity }) => {
        const baseInvalidations = [{ type: "Entity", id: `${entity}-LIST` }];
        if (entity === "coupons") {
          return [
            ...baseInvalidations,
            { type: "Coupon", id: "LIST" },
            { type: "Coupon", id: "active-coupons" },
          ];
        }
        return baseInvalidations;
      },
    }),

    updateEntity: builder.mutation({
      query: ({ entity, id, data }) => ({
        url: `/${entity}/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { entity, id }) => {
        const baseInvalidations = [
          { type: "Entity", id },
          { type: "Entity", id: `${entity}-LIST` },
        ];
        return baseInvalidations;
      },
    }),

    deleteEntity: builder.mutation({
      query: ({ entity, id }) => ({
        url: `/${entity}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { entity, id }) => {
        const baseInvalidations = [
          { type: "Entity", id },
          { type: "Entity", id: `${entity}-LIST` },
        ];
        if (entity === "coupons") {
          return [
            ...baseInvalidations,
            { type: "Coupon", id: "LIST" },
            { type: "Coupon", id: "active-coupons" },
          ];
        }
        if (entity === "reviews") {
          return [...baseInvalidations, "Review"];
        }
        return baseInvalidations;
      },
    }),

    banEntity: builder.mutation({
      query: ({ entity, id }) => ({
        url: `/${entity}/ban/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { entity, id }) => {
        const baseInvalidations = [
          { type: "Entity", id },
          { type: "Entity", id: `${entity}-LIST` },
        ];
        if (entity === "coupons") {
          return [
            ...baseInvalidations,
            { type: "Coupon", id: "LIST" },
            { type: "Coupon", id: "active-coupons" },
          ];
        }
        if (entity === "admin") {
          return [
            ...baseInvalidations,
            { type: "User", id: "LIST" },
            "User",
          ];
        }
        return baseInvalidations;
      },
    }),
  }),
});

export const {
  useAddEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
  useBanEntityMutation,
} = crudApiSlice;
