import React, { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '/Users/iskandargarifullin/OptShop/src/firebase_config.js';
import { setCartItems } from '/Users/iskandargarifullin/OptShop/src/reducers/CartReducer.js';
import cartIcon from '/Users/iskandargarifullin/OptShop/src/cart.svg';
import outIcon from '/Users/iskandargarifullin/OptShop/src/out.svg';
import logo from '/Users/iskandargarifullin/OptShop/src/logo.svg';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ordersIcon from '/Users/iskandargarifullin/OptShop/src/orders.svg';
import goodsIcon from '/Users/iskandargarifullin/OptShop/src/goods.svg';
import loginIcon from '/Users/iskandargarifullin/OptShop/src/login.svg';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  color: #333;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
`;



const Icon = styled.img`
  width: 24px; /* Указываем желаемую ширину и высоту для иконки */
  height: 24px;
`;

const OrdersLink = styled(NavLink)`
  display: flex;
  align-items: center;

  img {
    width: 24px; /* Указываем желаемую ширину и высоту для иконки */
    height: 24px;
    margin-right: 8px;
  }
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
    margin-right: 130px;
  }

  li {
    margin: 0;
  }

  a {
    color: #333;
    text-decoration: none;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s, transform 0.2s;

    &:hover {
      background-color: #f0f0f0;
      transform: scale(1.05);
    }
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Logo = styled.img`
  height: 40px;
  width: 40px;
  margin-left: 70px;
`;

const SiteTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
`;

const Tagline = styled.span`
  font-size: 1rem;
  color: #007bff;
  font-style: italic;
`;

const CartBadge = styled.span`
  background-color: red;
  border-radius: 50%;
  color: white;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  position: absolute;
  top: -10px;
  right: -10px;
`;

const CartContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Header = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.length;
  const location = useLocation();
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;
      const cartSnapshot = await getDocs(collection(db, 'carts', user.uid, 'items'));
      const items = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch(setCartItems(items));
    };

    fetchCartItems();
  }, [dispatch, user]);

  useEffect(() => {
    if (user && location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, location.pathname, navigate]);

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src={logo} alt="ОптШоп Логотип" />
        <div>
          <SiteTitle>ОптШоп</SiteTitle>
          <Tagline>У нас самые оптовые цены!</Tagline>
        </div>
      </LogoContainer>
      <Nav>
        <ul>
          <li>
            <NavLink to="/" end activeClassName="active-link">
              <Icon src={goodsIcon} alt="Товары" />
              Товары
            </NavLink>
          </li>
          <li>
            <OrdersLink to="/orders" activeClassName="active-link">
              <Icon src={ordersIcon} alt="Заказы" />
              Заказы
            </OrdersLink>
          </li>
          <li>
            {user ? (
              <Link to="/" onClick={() => auth.signOut()}>
                <Icon src={outIcon} alt="Выход" />
                Выход
              </Link>
            ) : (
              <NavLink to="/auth" activeClassName="active-link">
                <Icon src={loginIcon} alt="Авторизация" />
                Авторизация
              </NavLink>
            )}
          </li>
          <li>
            <CartContainer>
              <NavLink to="/cart" activeClassName="active-link">
                <Icon src={cartIcon} alt="Корзина" />
                Корзина
              </NavLink>
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </CartContainer>
          </li>
        </ul>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
