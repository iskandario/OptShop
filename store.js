import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '/Users/iskandargarifullin/OptShop/src/reducers/CartReducer.js';

const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});

export default store;
