import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ContactData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  address: string;
  subject: string;
  message: string;
  howDidYouHearAboutUs: string;
  createdAt: string;
}

interface ContactsResponse {
  success: boolean;
  message: string;
  data: ContactData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface SingleContactResponse {
  success: boolean;
  message: string;
  data: ContactData;
}

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `/api/v1/contacts/getAllContacts?page=${page}&limit=${limit}`,
    }),
    getContactById: builder.query<SingleContactResponse, string>({
      query: (id) => `/api/v1/contacts/getSingleContact/${id}`,
    }),
    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/contacts/deleteContact/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetContactsQuery, useGetContactByIdQuery, useDeleteContactMutation } = contactApi;
