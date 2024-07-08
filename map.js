const apiKey = '5b3ce3597851110001cf6248ea1d6b1612a0473aaf7f4b438ad430a3';

// Функция для геокодирования адреса
async function geocode(address) {
    const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates;
    } else {
        throw new Error('Не удалось геокодировать адрес');
    }
}

// Функция для расчета расстояния между двумя координатами
async function calculateDistance(coord1, coord2) {
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        },
        body: JSON.stringify({
            coordinates: [coord1, coord2]
        })
    });
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
        return {
            distance: data.routes[0].summary.distance / 1000, // расстояние в км
            duration: data.routes[0].summary.duration / 60 // время в минутах
        };
    } else {
        throw new Error('Не удалось рассчитать маршрут');
    }
}

async function main() {
    try {
        const address1 = 'Самара, Россия';
        const address2 = 'Москва, Россия';

        // Получение координат для обоих адресов
        const coord1 = await geocode(address1);
        const coord2 = await geocode(address2);

        // Расчет расстояния и времени
        const result = await calculateDistance(coord1, coord2);
        console.log(`Расстояние: ${result.distance.toFixed(2)} км, Время: ${result.duration.toFixed(2)} мин`);
    } catch (error) {
        console.error(error.message);
    }
}

main();
