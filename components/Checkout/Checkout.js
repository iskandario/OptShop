import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { geocode, calculateDistance } from '/Users/iskandargarifullin/OptShop/src/utils/geocode.js';  // Импортируйте ваши функции геокодирования и расчета расстояния
import { calculateCost } from '/Users/iskandargarifullin/OptShop/src/utils/CostCalculation.js';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CheckoutContainer = styled.div`
  padding: 1rem;
  background-color: #f5f5f5;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-in;
`;

const CheckoutTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  color: ${({ error }) => (error ? 'red' : 'green')};
  text-align: center;
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [totalCostWithoutShipping, setTotalCostWithoutShipping] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError('Вы должны быть авторизованы для оформления заказа.');
      return;
    }

    try {
      const userCoords = await geocode(address);
      const storeCoords = await geocode('Москва, Россия');  
      const { distance } = await calculateDistance(userCoords, storeCoords);

      const baseShippingCost = 500;  
      const costPerKm = 10;  
      const calculatedShippingCost = baseShippingCost + (costPerKm * distance);

      const discount = distance > 100 ? 0.9 : 1; 

      const cartSnapshot = await getDocs(collection(db, 'carts', user.uid, 'items'));
      const items = cartSnapshot.docs.map(doc => doc.data());

      const costWithoutShipping = items.reduce((acc, item) => acc + calculateCost(item.basePrice, item.quantity, 0, discount), 0);
      const totalCostWithShipping = costWithoutShipping + calculatedShippingCost;

      setTotalCostWithoutShipping(costWithoutShipping);
      setShippingCost(calculatedShippingCost);
      setTotalCost(totalCostWithShipping);

      const orderData = {
        userId: user.uid,
        items,
        address,
        totalCost: totalCostWithShipping,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      setLoading(false);
      setMessage('Заказ оформлен успешно!');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('Ошибка при оформлении заказа. Пожалуйста, проверьте введенный адрес и повторите попытку.');
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutTitle>Оформление заказа</CheckoutTitle>
      <Form onSubmit={handleCheckout}>
        <Input
          type="text"
          placeholder="Ваш адрес (например, Москва, Россия)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Оформить заказ'}
        </Button>
      </Form>
      {message && <Message>{message}</Message>}
      {error && <Message error>{error}</Message>}
      {totalCostWithoutShipping > 0 && <Message>Стоимость без доставки: {totalCostWithoutShipping.toFixed(2)} ₽</Message>}
      {shippingCost > 0 && <Message>Стоимость доставки: {shippingCost.toFixed(2)} ₽</Message>}
      {totalCost > 0 && <Message>Итоговая стоимость с доставкой: {totalCost.toFixed(2)} ₽</Message>}
    </CheckoutContainer>
  );
};

export default Checkout;
