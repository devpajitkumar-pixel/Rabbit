import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch orders

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk to update order delivery status

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data.order;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk to delete a order

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    return id;
  },
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        // Calculate totalsales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const OrderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id,
        );
        if (OrderIndex !== -1) {
          state.orders[OrderIndex] = updatedOrder;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload,
        );
      });
  },
});

export default adminOrderSlice.reducer;
