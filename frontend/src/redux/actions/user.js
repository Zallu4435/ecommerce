import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { server } from "../../server";


export const loadUser = createAsyncThunk(
    "user/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${server}/user/getUser`, {
                withCredentials: true,
            });
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
