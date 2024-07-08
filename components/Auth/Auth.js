import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // заменяем useHistory на useNavigate
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth } from '/Users/iskandargarifullin/OptShop/src/firebase_config.js';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Input = styled.input`
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 200px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // заменяем useHistory на useNavigate

  const handleSignUp = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userDocRef = doc(getFirestore(), 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: new Date(),
      });

      const cartDocRef = await addDoc(collection(getFirestore(), 'carts'), {
        userId: user.uid,
        items: [],
      });

      console.log('Корзина создана:', cartDocRef.id);
      alert('Пользователь создан! Пожалуйста, проверьте вашу почту для подтверждения.');
      auth.currentUser.sendEmailVerification();
      navigate('/'); // Перенаправляем пользователя на страницу товаров
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Пользователь авторизован!');
      navigate('/'); // Перенаправляем пользователя на страницу товаров
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Инструкция по сбросу пароля отправлена на ваш email.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AuthContainer>
      <h2>Авторизация</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSignUp}>Зарегистрироваться</Button>
      <Button onClick={handleSignIn}>Войти</Button>
      <Button onClick={handlePasswordReset}>Сбросить пароль</Button>
    </AuthContainer>
  );
};

export default Auth;
