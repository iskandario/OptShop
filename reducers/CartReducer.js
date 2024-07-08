import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
    },
    addItemToCart(state, action) {
      state.items.push(action.payload);
    },
    updateCartItem(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItemFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const { setCartItems, addItemToCart, updateCartItem, removeItemFromCart } = cartSlice.actions;
export default cartSlice.reducer;
