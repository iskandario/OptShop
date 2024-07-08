import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '/Users/iskandargarifullin/OptShop/src/store.js';
import App from '/Users/iskandargarifullin/OptShop/src/App.js';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
