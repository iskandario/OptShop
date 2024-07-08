import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header.js';
import ProductList from './components/ProductList/ProductList.js';
import Cart from './components/Cart/Cart.js';
import Checkout from './components/Checkout/Checkout.js';
import Auth from './components/Auth/Auth.js';
import Orders from './components/Orders/Orders.js'; // Import the Orders component
import styled from 'styled-components';
import { Provider } from 'react-redux';
import store from './store.js';
import GlobalStyle from '/Users/iskandargarifullin/OptShop/src/GlobalStyle.js';  // Import global styles

const AppContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f5f5f5;
`;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContainer>
          <GlobalStyle />  {/* Add global styles */}
          <Header />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/orders" element={<Orders />} /> {/* Add route for Orders component */}
          </Routes>
        </AppContainer>
      </Router>
    </Provider>
  );
}

export default App;
