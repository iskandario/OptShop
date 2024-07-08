import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtGuCxGkKS_yP5pF3WnIkp10bs7zY-Cu8",
  authDomain: "optshop-bdc0d.firebaseapp.com",
  projectId: "optshop-bdc0d",
  storageBucket: "optshop-bdc0d.appspot.com",
  messagingSenderId: "1061985781183",
  appId: "1:1061985781183:web:b2f110878d2f4c58ba8d0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const suppliers = [
  {
    name: "Apple Москва",
    address: "Москва, Россия",
    products: [
      { 
        name: "iPhone 13", 
        type: "телефон",
        basePrice: 80000, 
        description: "Новый iPhone 13 с процессором A15 Bionic, 128 ГБ памяти.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/6277643/img_id9175808033848313085.jpeg/450x600"
      },
      { 
        name: "MacBook Pro 16", 
        type: "ноутбук",
        basePrice: 200000, 
       
        description: "MacBook Pro с процессором M1 Pro, 16 дюймов, 512 ГБ SSD.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/5242361/img_id2420073412246465223.jpeg/450x600"
      },
      { 
        name: "iPad Air 5",
        type: "планшет",
        basePrice: 90000,
       
        description: "Новый iPad Air 5 с дисплеем Liquid Retina.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/4119784/img_id3291615032371395830.jpeg/450x600"
      },
      { 
        name: "AirPods Max",
        type: "наушники",
        basePrice: 60000,
       
        description: "Наушники AirPods Max с высококачественным звуком и активным шумоподавлением.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/4420180/2a000001900eb70ffd817cbb3bec05c551c2/450x600"
      }
    ],
    shippingConditions: [
      { method: "автомобиль", costPerKm: 12, minDistance: 0, maxDistance: 2000 },
      { method: "самолет+автомобиль", costPerKm: 70, minDistance: 2000, maxDistance: Infinity }
    ]
  },
  {
    name: "Xiaomi Пекин",
    address: "Пекин, Китай",
    products: [
      { 
        name: "Xiaomi Mi 11", 
        type: "телефон",
        basePrice: 60000, 
        
        description: "Xiaomi Mi 11 с процессором Snapdragon 888, 128 ГБ памяти.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/12511153/2a0000018ff1b98a0196f4b9e823ed69ebf0/450x600"
      },
      { 
        name: "Xiaomi Mi TV 4S 55", 
        type: "телевизор",
        basePrice: 40000, 
        
        description: "Телевизор Xiaomi Mi TV 4S с диагональю 55 дюймов.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/1111879/img_id6952651931317045455.jpeg/450x600"
      },
      { 
        name: "Xiaomi Mi Band 7",
        type: "фитнес-трекер",
        basePrice: 6000,
       
        description: "Фитнес-браслет Xiaomi Mi Band 7 с новыми функциями.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/12301908/2a0000018f86ac355d1e8eece435ff69ee4b/450x600"
      }
    ],
    shippingConditions: [
      { method: "автомобиль", costPerKm: 15, minDistance: 0, maxDistance: 2000 },
      { method: "самолет+автомобиль", costPerKm: 65, minDistance: 2000, maxDistance: Infinity }
    ]
  },
  {
    name: "Samsung Сеул",
    address: "Сеул, Южная Корея",
    products: [
      { 
        name: "Samsung Galaxy S21", 
        type: "телефон",
        basePrice: 75000, 
        
        description: "Samsung Galaxy S21 с процессором Exynos 2100, 128 ГБ памяти.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/6462174/img_id7184296914693785157.jpeg/450x600"
      },
      { 
        name: "Samsung Galaxy Tab S7", 
        type: "планшет",
        basePrice: 60000, 
       
        description: "Планшет Samsung Galaxy Tab S7 с экраном 11 дюймов.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/4809583/img_id7408033712132393982.jpeg/450x600"
      },
      { 
        name: "Samsung Galaxy Watch 4",
        type: "умные часы",
        basePrice: 40000,
       
        description: "Samsung Galaxy Watch 4 с датчиком кислорода в крови и мониторингом сердечного ритма.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/7887763/img_id1834817174935119577.jpeg/450x600"
      },
      { 
        name: "Samsung Odyssey G9",
        type: "монитор",
        basePrice: 150000,
        
        description: "Игровой монитор Samsung Odyssey G9 с изогнутым экраном и частотой обновления 240 Гц.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/6583032/img_id1391899431516597701.png/450x600"
      }
    ],
    shippingConditions: [
      { method: "автомобиль", costPerKm: 18, minDistance: 0, maxDistance: 2000 },
      { method: "самолет+автомобиль", costPerKm: 75, minDistance: 2000, maxDistance: Infinity }
    ]
  },
  {
    name: "Huawei Шэньчжэнь",
    address: "Шэньчжэнь, Китай",
    products: [
      { 
        name: "Huawei P50 Pro", 
        type: "телефон",
        basePrice: 90000, 
        
        description: "Huawei P50 Pro с Leica Quad Camera и Kirin 9000 процессором.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/4785755/img_id5746831804157431837.jpeg/450x600"
      },
      { 
        name: "Huawei MateBook X Pro",
        type: "ноутбук",
        basePrice: 140000,
        
        description: "Ноутбук Huawei MateBook X Pro с дисплеем LTPS Touchscreen и процессором Intel Core i7.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/7980098/img_id6059049195227739780.jpeg/450x600"
      },
      { 
        name: "Huawei Watch GT 3",
        type: "умные часы",
        basePrice: 25000,
       
        description: "Huawei Watch GT 3 с двумя неделями автономной работы и мониторингом кислорода в крови.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/12374158/2a0000018de9f5f3750f4f934178e87ef6e2/450x600"
      },
      { 
        name: "Huawei MateView GT",
        type: "монитор",
        basePrice: 60000,
        
        description: "Монитор Huawei MateView GT с 34-дюймовым изогнутым экраном и частотой обновления 165 Гц.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/12421103/2a0000018da238961bc5adf383ecd39d4e46/450x600"
      },
      { 
        name: "Huawei FreeBuds 4i",
        type: "наушники",
        basePrice: 10000,
       
        description: "Беспроводные наушники Huawei FreeBuds 4i с активным шумоподавлением и продолжительностью работы до 10 часов.",
        imageUrl: "https://avatars.mds.yandex.net/get-mpic/12597455/2a0000018dc0be9e77e3a9951b6dabecf6f4/450x600"
      }
    ],
    shippingConditions: [
      { method: "автомобиль", costPerKm: 12, minDistance: 0, maxDistance: 2000 },
      { method: "самолет+автомобиль", costPerKm: 60, minDistance: 2000, maxDistance: Infinity }
    ]
  },
  {
    name: "Dell Техас",
    address: "Техас, США",
    products: [
      { 
        name: "Dell XPS 13", 
        type: "ноутбук",
        basePrice: 90000, 
       
        description: "Ноутбук Dell XPS 13 с процессором Intel Core i7.",
        imageUrl: "https://www.dell.com/image/XPS13_main.png"
      },
      { 
        name: "Dell Alienware M15", 
        type: "ноутбук",
        basePrice: 150000, 
        
        description: "Игровой ноутбук Dell Alienware M15 с процессором AMD Ryzen 9.",
        imageUrl: "https://www.dell.com/image/AlienwareM15_main.png"
      },
      { 
        name: "Dell UltraSharp 27",
        type: "монитор",
        basePrice: 40000, 
        
        description: "Монитор Dell UltraSharp 27 с разрешением 4K.",
        imageUrl: "https://www.dell.com/image/UltraSharp27_main.png"
      },
      { 
        name: "Dell OptiPlex 7080",
        type: "ПК",
        basePrice: 60000, 
        
        description: "Настольный ПК Dell OptiPlex 7080 с процессором Intel Core i5.",
        imageUrl: "https://www.dell.com/image/OptiPlex7080_main.png"
      },
      { 
        name: "Dell Latitude 9410", 
        type: "ноутбук",
        basePrice: 110000, 
        
        description: "Бизнес-ноутбук Dell Latitude 9410 с процессором Intel Core i7.",
        imageUrl: "https://www.dell.com/image/Latitude9410_main.png"
      }
    ],
    shippingConditions: [
      { method: "автомобиль", costPerKm: 20, minDistance: 0, maxDistance: 2000 },
      { method: "самолет+автомобиль", costPerKm: 80, minDistance: 2000, maxDistance: Infinity }
    ]
  }
];

async function addSupplier(supplier) {
  try {
    const docRef = await addDoc(collection(db, "suppliers"), supplier);
    console.log("Supplier added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding supplier: ", e);
  }
}

suppliers.forEach(async (supplier) => {
  await addSupplier(supplier);
});