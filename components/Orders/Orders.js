import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '/Users/iskandargarifullin/OptShop/src/firebase_config.js';

const OrdersContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const OrderCard = styled.div`
  display: flex;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const OrderDetails = styled.div`
  padding: 1rem;
  flex: 1;
`;

const OrderImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  border: 2px solid white;
`;

const OrderInfo = styled.div`
  padding: 1rem;
  flex: 1;
`;

const OrderTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const OrderText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const OrderCost = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
`;

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  return (
    <OrdersContainer>
      <h2>Подтвержденные заказы</h2>
      {orders.length === 0 && <p>Нет подтвержденных заказов</p>}
      {orders.map((order) => (
        <OrderCard key={order.id}>
          <OrderDetails>
            {order.items.map((item) => (
              <div key={item.id}>
                <OrderImage src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name} />
                <OrderTitle>{item.name}</OrderTitle>
                <OrderText>Цена за единицу: {item.basePrice ? item.basePrice.toFixed(2) : ''} ₽</OrderText>
                <OrderText>Количество: {item.quantity}</OrderText>
                <OrderText>Итого: {item.basePrice && item.quantity ? (item.basePrice * item.quantity).toFixed(2) : ''} ₽</OrderText>
              </div>
            ))}
          </OrderDetails>
          <OrderInfo>
            <OrderCost>Итоговая стоимость: {order.totalCostWithShipping ? order.totalCostWithShipping.toFixed(2) : ''} ₽</OrderCost>
            <OrderText>Адрес доставки: {order.address}</OrderText>
            <OrderText>Электронная почта: {order.email}</OrderText>
            <OrderText>Общая стоимость: {order.totalCost ? order.totalCost.toFixed(2) : 'Загрузка...'} ₽</OrderText>
            <OrderText>Стоимость доставки: {order.shippingCost ? order.shippingCost.toFixed(2) : 'Загрузка...'} ₽</OrderText>
            <OrderText>Примерная дата доставки: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Загрузка...'}</OrderText>
          </OrderInfo>
        </OrderCard>
      ))}
    </OrdersContainer>
  );
}

export default Orders;
