export const products = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'phone',
    brand: 'Apple',
    price: 89990,
    originalPrice: 94990,
    stock: 15,
    image: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=940&hei=1112&fmt=png-alpha',
    description: 'A17 Pro chip. Titanium design. Action button. 5x Telephoto.',
    specs: {
      screen: '6.7" Super Retina XDR OLED',
      chip: 'A17 Pro',
      camera: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      battery: '4422 mAh',
      storage: '256GB'
    },
    rating: 4.8,
    reviews: 256
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phone',
    brand: 'Samsung',
    price: 79990,
    originalPrice: 84990,
    stock: 20,
    image: 'https://images.samsung.com/ph/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-mo.jpg',
    description: 'Galaxy AI. 200MP Camera. S Pen included.',
    specs: {
      screen: '6.8" QHD+ Dynamic AMOLED 2X',
      chip: 'Snapdragon 8 Gen 3',
      camera: '200MP Main + 12MP Ultra Wide + 50MP 5x Telephoto',
      battery: '5000 mAh',
      storage: '256GB'
    },
    rating: 4.7,
    reviews: 189
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3 Pro',
    category: 'laptop',
    brand: 'Apple',
    price: 119990,
    originalPrice: 124990,
    stock: 10,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290',
    description: 'M3 Pro chip. 14.2-inch Liquid Retina XDR display. Up to 18 hours battery life.',
    specs: {
      screen: '14.2" Liquid Retina XDR',
      chip: 'M3 Pro',
      memory: '16GB Unified Memory',
      storage: '512GB SSD',
      battery: '18 hours'
    },
    rating: 4.9,
    reviews: 142
  },
  {
    id: '4',
    name: 'Samsung Galaxy Book4 Pro',
    category: 'laptop',
    brand: 'Samsung',
    price: 89990,
    originalPrice: 94990,
    stock: 8,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/ph/np940xfg-kb1ph/gallery/ph-galaxy-book4-pro-np940-np940xfg-kb1ph-thumb-537558675',
    description: 'Intel Core Ultra 7 Processor. AMOLED Display. Intel Arc Graphics.',
    specs: {
      screen: '14" 3K AMOLED Display',
      processor: 'Intel Core Ultra 7',
      memory: '16GB LPDDR5',
      storage: '512GB SSD',
      battery: 'Up to 15 hours'
    },
    rating: 4.7,
    reviews: 98
  }
];