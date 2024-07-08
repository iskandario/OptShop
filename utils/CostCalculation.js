const calculateCost = (basePrice, quantity, distance, discountFactor, supplierCount) => {
  const bulkDiscount = quantity >= 10 ? 0.85 : 1;
  
  // Расчет стоимости доставки на основе расстояния
  const distanceCost = distance > 1000 
    ? 1000 + (distance - 1000) * 0.5 
    : distance > 500 
    ? 500 + (distance - 500) * 0.75 
    : distance * 1; 
  
  // Стоимость доставки увеличивается с учетом количества поставщиков
  const supplierMultiplier = supplierCount > 1 ? 1.2 : 1;
  
  // Полная стоимость товара
  return (basePrice * quantity * bulkDiscount * discountFactor) + (distanceCost * supplierMultiplier);
};

// Функция расчета примерной даты доставки
const calculateDeliveryDate = (distance) => {
  const averageSpeed = 60; // Средняя скорость грузовика км/ч
  const dailyTravelHours = 8; // Количество часов в день, которые грузовик проводит в пути
  const travelDays = Math.ceil(distance / (averageSpeed * dailyTravelHours));
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + travelDays);
  
  return deliveryDate;
};

export { calculateCost, calculateDeliveryDate };
