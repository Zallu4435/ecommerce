import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../server";

export const crudApiSlice = createApi({
  reducerPath: "crudApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}` }),
  tagTypes: ["Entity"],
  endpoints: (builder) => ({
    addEntity: builder.mutation({
      query: ({ entity, data }) => ({
        url: `/${entity}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { entity }) => [
        { type: "Entity", id: `${entity}-LIST` },
      ],
    }),

    updateEntity: builder.mutation({
      query: ({ entity, id, data }) => ({
        url: `/${entity}/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { entity, id }) => [
        { type: "Entity", id },
        { type: "Entity", id: `${entity}-LIST` },
      ],
    }),

    deleteEntity: builder.mutation({
      query: ({ entity, id }) => ({
        url: `/${entity}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { entity, id }) => [
        { type: "Entity", id },
        { type: "Entity", id: `${entity}-LIST` },
      ],
    }),

    banEntity: builder.mutation({
      query: ({ entity, id }) => ({
        url: `/${entity}/ban/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { entity, id }) => [
        { type: "Entity", id },
        { type: "Entity", id: `${entity}-LIST` },
      ],
    }),
  }),
});

export const {
  useAddEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
  useBanEntityMutation,
} = crudApiSlice;
