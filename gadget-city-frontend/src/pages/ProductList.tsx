import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { products } from '../services/productData';

const ProductList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => selectedBrand === 'all' || p.brand === selectedBrand);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Latest Gadgets</h1>
        
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="phone">Phones</option>
            <option value="laptop">Laptops</option>
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
          </select>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <p className="text-gray-500">{product.brand}</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">₱{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₱{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default ProductList;