import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../server'

export const crudApiSlice = createApi({
  reducerPath: 'crudApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}` }),
  tagTypes: ['Entity'], // Generic tag for caching
  endpoints: (builder) => ({
    // Generic Add
    addEntity: builder.mutation({
      query: ({ entity, data }) => ({
        url: `/${entity}/create-product`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { entity }) => [{ type: 'Entity', id: `${entity}-LIST` }],
    }),

    // Generic Update
    updateEntity: builder.mutation({
      query: ({ entity, id, data }) => ({
        url: `/${entity}/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { entity, id }) => [
        { type: 'Entity', id },
        { type: 'Entity', id: `${entity}-LIST` },
      ],
    }),

    // Generic Delete
    deleteEntity: builder.mutation({
      query: ({ entity, id }) => ({
        url: `/${entity}/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { entity, id }) => [
        { type: 'Entity', id },
        { type: 'Entity', id: `${entity}-LIST` },
      ],
    }),

    // Generic Ban
    banEntity: builder.mutation({
      query: ({ entity, id }) => ({
        url: `/${entity}/ban/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { entity, id }) => [
        { type: 'Entity', id },
        { type: 'Entity', id: `${entity}-LIST` },
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
