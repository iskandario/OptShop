import { combineReducers } from 'redux';
import cartReducer from 'src/reducers/CartReducer.js'; // Импортируйте редьюсер корзины

const rootReducer = combineReducers({
  cart: cartReducer,
  // добавьте другие редьюсеры, если они у вас есть
});

export default rootReducer;

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.sendOrderEmail = functions.https.onRequest((req, res) => {
  const { email, orderData } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Подтверждение заказа',
    text: `Ваш заказ был оформлен успешно!\n\nСостав заказа:\n${orderData.items.map(item => `${item.name} - ${item.quantity} шт.`).join('\n')}\n\nСтоимость товаров без доставки: ${orderData.totalCostWithoutShipping} ₽\nСтоимость доставки: ${orderData.shippingCost} ₽\nИтоговая стоимость с доставкой: ${orderData.totalCost} ₽\n\nСпасибо за покупку!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    return res.status(200).send('Email sent successfully');
  });
});
