import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import cartReducer from "./reducers/cart";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

export default rootReducer;
