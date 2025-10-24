  import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { products } from '../services/productData';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-blue-600 hover:text-blue-700"
      >
        ← Back to products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">
              ₱{product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-lg text-gray-500 line-through">
                ₱{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Specifications</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            <button 
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              disabled={product.stock === 0}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>
    </motion.div>
  );
}