import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db, auth } from '/Users/iskandargarifullin/OptShop/src/firebase_config.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '/Users/iskandargarifullin/OptShop/src/reducers/CartReducer.js';
import { calculateCost, calculateDeliveryDate } from '/Users/iskandargarifullin/OptShop/src/utils/CostCalculation.js';
import { geocode, calculateDistance } from '/Users/iskandargarifullin/OptShop/src/utils/geocode.js';
import deliveryIcon from '/Users/iskandargarifullin/OptShop/src/delivery.svg';

const CartContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const CartTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: white;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CartItemDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain; /* Changed to 'contain' to prevent cropping */
  border-radius: 8px;
  background-color: white; /* Ensures images are filled with white */
`;

const CartItemName = styled.div`
  font-size: 1.2rem;
  color: #333;
`;

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #cc0000;
  }
`;

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const CheckoutButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  margin-top: 10px;
  
  &:hover {
    background-color: #218838;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Input = styled.input`
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-top: 1rem;
  
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

const CostDetails = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const TotalCost = styled.p`
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

const OrderButton = styled.button`
  margin-top: 1rem;
`;

const ModalContent = styled.div`
  text-align: center;
`;

const OrderSummary = styled.div`
  margin-top: 2rem;
`;

const DeliveryDetails = styled.div`
  margin-top: 1rem;
`;

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [totalCostWithoutShipping, setTotalCostWithoutShipping] = useState(0);
  const [totalCostWithShipping, setTotalCostWithShipping] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [isShippingCalculated, setIsShippingCalculated] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      try {
        const cartSnapshot = await getDocs(collection(db, 'carts', user.uid, 'items'));
        const items = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        // Обновляем состояние Redux с элементами корзины
        dispatch(setCartItems(items));
  
        // Вызываем calculateTotalCostWithoutShipping после обновления состояния
        calculateTotalCostWithoutShipping(items);
      } catch (error) {
        console.error('Ошибка при получении элементов корзины:', error);
      }
    };
  
    fetchCartItems();
  }, [dispatch]);
  
  const calculateTotalCostWithoutShipping = (items) => {
    const total = items.reduce((acc, item) => acc + item.basePrice * item.quantity, 0);
    console.log('Total cost without shipping:', total); // Добавляем логирование
    setTotalCostWithoutShipping(total);
  };
  
  
  

  const handleRemoveItem = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, 'carts', user.uid, 'items', itemId));
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    dispatch(setCartItems(updatedItems));
    calculateTotalCostWithoutShipping(updatedItems);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCalculateShipping = async () => {
    setCalculating(true);
    setError('');
    setIsShippingCalculated(false); // Reset shipping calculation state
  
    if (!address) {
      setError('Введите действительный адрес.');
      setCalculating(false);
      return;
    }
  
    try {
      const userCoords = await geocode(address);
  
      const storeCoordsPromises = cartItems.map(item => geocode(item.supplierAddress));
      const storeCoords = await Promise.all(storeCoordsPromises);
  
      const distances = await Promise.all(storeCoords.map(coords => calculateDistance(userCoords, coords)));
  
      const maxDistance = Math.max(...distances.map(d => d.distance));
  
      const supplierCount = new Set(cartItems.map(item => item.supplierAddress)).size;
  
      const calculatedShippingCost = calculateCost(0, 0, maxDistance, 1, supplierCount);
  
      const totalCost = totalCostWithoutShipping + calculatedShippingCost; // Используем уже определенную функцию
      const calculatedDeliveryDate = calculateDeliveryDate(maxDistance);
  
      setShippingCost(calculatedShippingCost);
      setTotalCostWithShipping(totalCost);
      setDeliveryDate(calculatedDeliveryDate.toDateString());
      setIsShippingCalculated(true); // Mark shipping as calculated
      setCalculating(false);
      setShowModal(true); // Opening modal after calculating shipping
    } catch (error) {
      console.error('Error calculating shipping:', error);
      setCalculating(false);
      setError('Ошибка при расчете стоимости доставки. Пожалуйста, проверьте введенный адрес и повторите попытку.');
    }
  };
  

  const handleConfirmOrder = async () => {
    if (!isShippingCalculated) {
      setError('Сначала рассчитайте стоимость доставки.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        setError('Вы должны быть авторизованы для оформления заказа.');
        return;
      }

      const orderData = {
        items: cartItems,
        address,
        email: user.email,
        totalCost: totalCostWithShipping,
        createdAt: new Date(),
        shippingCost,
        totalCostWithShipping,
        deliveryDate,
      };

      await addDoc(collection(db, 'orders'), orderData);

     

      setLoading(false);
      setShowModal(false);
      setError('');
      setAddress('');
    } catch (error) {
      console.error('Error confirming order:', error);
      setLoading(false);
      setError('Ошибка при оформлении заказа. Пожалуйста, повторите попытку.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (!auth.currentUser) {
    return (
      <CartContainer>
        <CartTitle>Корзина</CartTitle>
        <Message error>Чтобы увидеть содержимое корзины, пожалуйста, войдите в свою учетную запись.</Message>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartTitle>Корзина</CartTitle>
      {cartItems.map(item => (
        <CartItem key={item.id}>
          <CartItemDetails>
            <CartItemImage src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.name} />
            <CartItemName>{item.name}</CartItemName>
          </CartItemDetails>
          <div>
            <p>Цена: {item.basePrice.toFixed(2)} ₽</p>
            <p>Количество: {item.quantity}</p>
            <RemoveButton onClick={() => handleRemoveItem(item.id)}>Удалить</RemoveButton>
          </div>
        </CartItem>
      ))}
      <CheckoutContainer>
        <div>
          <Input
            type="text"
            placeholder="Введите адрес доставки"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={loading || calculating}
          />
          {error && <Message error>{error}</Message>}
          <Button onClick={handleCalculateShipping} disabled={loading || calculating}>
            Рассчитать стоимость доставки
          </Button>
        </div>
       
      </CheckoutContainer>

      {showModal && (
        <Overlay onClick={handleModalClose}>
          <Modal>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h2>Информация о заказе</h2>
              <CostDetails>
                <h3>Стоимость доставки</h3>
                <DeliveryDetails>
                  <p>Общая стоимость без доставки: {totalCostWithoutShipping.toFixed(0)} ₽</p>
                  <p>Стоимость доставки: {shippingCost.toFixed(0)} ₽</p>
                  <p>Итоговая стоимость с доставкой: {(totalCostWithoutShipping+shippingCost).toFixed(0)} ₽</p>
                  <p>Примерная дата доставки: {deliveryDate}</p>
                </DeliveryDetails>
              </CostDetails>
              <CheckoutButton onClick={handleConfirmOrder} disabled={loading}>
              <img src={deliveryIcon} alt="Delivery Icon" />
                Оформить заказ
              </CheckoutButton>
              {loading && <p>Подождите, идет оформление заказа...</p>}
            </ModalContent>
          </Modal>
        </Overlay>
      )}
    </CartContainer>
  );
}

export default Cart;
