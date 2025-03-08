import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../types";

interface CartState {
  products: (ProductType & { count: number })[];
  count: number;
}

const initialState: CartState = {
  products: [],
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductType>) => {
      const existProduct = state.products.find(
        (product) => product._id === action.payload._id
      );

      if (existProduct) existProduct.count++;
      else state.products.push({ ...action.payload, count: 1 });

      state.count++;
    },
    removeFromCart: (state, action: PayloadAction<ProductType["_id"]>) => {
      const product = state.products.find(
        (product) => product._id === action.payload
      );

      if (!product) return;

      if (product.count <= 1) {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      } else {
        product.count--;
      }
      state.count--;
    },

    resetCart: () => initialState,
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
