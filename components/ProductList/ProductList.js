import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '/Users/iskandargarifullin/OptShop/src/firebase_config.js';
import { useDispatch } from 'react-redux';
import { addItemToCart, updateCartItem } from '/Users/iskandargarifullin/OptShop/src/reducers/CartReducer.js';

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem;
  justify-content: center;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  width: 230px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: auto;
    max-height: 150px;
    object-fit: contain;
    border-radius: 4px;
    background-color: white;
  }
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #333;
  text-align: center;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  height: 50px;
  overflow: hidden;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0.5rem 0;
`;

const Button = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #218838;
    transform: scale(1.05);
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
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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
  width: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 1rem;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #218838;
    transform: scale(1.05);
  }
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  gap: 0.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: gray;
`;

const SearchInput = styled(Input)`
  width: 430px;
  margin-bottom: 0;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const SearchFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const DiscountInfo = styled.div`
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #555;
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'suppliers'));
      const productsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.products.forEach((product) => {
          productsData.push({ ...product, supplier: data.name });
        });
      });
      setProducts(productsData);
      setFilteredProducts(productsData);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filterType) {
      filtered = filtered.filter(product => product.type === filterType);
    }

    if (filterCompany) {
      filtered = filtered.filter(product => product.supplier === filterCompany);
    }

    if (sortOption) {
      filtered = filtered.sort((a, b) => {
        if (sortOption === 'price-asc') {
          return a.basePrice - b.basePrice;
        } else if (sortOption === 'price-desc') {
          return b.basePrice - a.basePrice;
        } else {
          return 0;
        }
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, filterType, filterCompany, sortOption, searchQuery]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const calculateDiscountPrice = (basePrice, quantity) => {
    let discount = 0;
    if (quantity >= 100) {
      discount = 0.20;
    } else if (quantity >= 50) {
      discount = 0.15;
    } else if (quantity >= 25) {
      discount = 0.10;
    } else if (quantity >= 10) {
      discount = 0.05;
    }
    return basePrice * quantity * (1 - discount);
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      setModalMessage('Количество должно быть больше нуля.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setModalMessage('Для добавления товара в корзину необходимо авторизоваться.');
      return;
    }

    try {
      const userCartRef = doc(collection(db, 'carts'), user.uid);
      const existingCartItem = (await getDocs(collection(userCartRef, 'items'))).docs.find(doc => doc.data().name === selectedProduct.name);

      if (existingCartItem) {
        const existingItemRef = doc(db, 'carts', user.uid, 'items', existingCartItem.id);
        await setDoc(existingItemRef, { quantity: existingCartItem.data().quantity + quantity }, { merge: true });
        dispatch(updateCartItem({ id: existingCartItem.id, quantity: existingCartItem.data().quantity + quantity }));
      } else {
        const newItem = {
          ...selectedProduct,
          quantity
        };
        await addDoc(collection(db, 'carts', user.uid, 'items'), newItem);
        dispatch(addItemToCart(newItem));
      }

      setModalMessage('Товар добавлен в корзину!');
      setSelectedProduct(null);
      setQuantity(1);
      setTimeout(() => {
        setModalMessage('');
        setShowModal(false);
      }, 2000);
    } catch (error) {
      setModalMessage('Ошибка при добавлении товара в корзину.');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalMessage('');
    setQuantity(1);
  };

  return (
    <>
      <SearchFiltersContainer>
        <SearchBar>
          <SearchInput 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Поиск товаров..."
          />
          <FilterButton onClick={() => setFilteredProducts(products)}>Найти</FilterButton>
        </SearchBar>
        <FiltersWrapper>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Все типы</option>
            <option value="телефон">Телефон</option>
            <option value="ноутбук">Ноутбук</option>
            <option value="планшет">Планшет</option>
            <option value="наушники">Наушники</option>
            <option value="телевизор">Телевизор</option>
            <option value="фитнес-трекер">Фитнес-трекер</option>
            <option value="умные часы">Умные часы</option>
            <option value="монитор">Монитор</option>
          </Select>
          <Select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
            <option value="">Все компании</option>
            <option value="Apple Москва">Apple</option>
            <option value="Xiaomi Пекин">Xiaomi</option>
            <option value="Samsung Сеул">Samsung</option>
            <option value="Huawei Шэньчжэнь">Huawei</option>
          </Select>
          <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Сортировка</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
          </Select>
        </FiltersWrapper>
      </SearchFiltersContainer>
      <ProductContainer>
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} onClick={() => handleCardClick(product)}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
            />
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
            <ProductPrice>{product.basePrice} ₽</ProductPrice>
            <Button onClick={(e) => { e.stopPropagation(); handleCardClick(product); }}>Добавить в корзину</Button>
          </ProductCard>
        ))}
      </ProductContainer>
      {showModal && selectedProduct && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <ModalTitle>{selectedProduct.name}</ModalTitle>
            <div>
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                style={{ width: '100%', marginBottom: '1rem', maxHeight: '300px', objectFit: 'contain', backgroundColor: 'white' }}
              />
              <p>{selectedProduct.description}</p>
              <p>Цена за единицу: {selectedProduct.basePrice} ₽</p>
              <Input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))} 
                min="1"
                placeholder="Количество" 
              />
              <DiscountInfo>
                <p>Цена с учетом оптовой скидки: {calculateDiscountPrice(selectedProduct.basePrice, quantity).toFixed(2)} ₽</p>
              </DiscountInfo>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ModalButton onClick={handleAddToCart}>Добавить в корзину</ModalButton>
              </div>
              {modalMessage && <p>{modalMessage}</p>}
            </div>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductList;
