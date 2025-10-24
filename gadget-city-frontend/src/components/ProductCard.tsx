import React, { useState } from 'react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get the main product image
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : { url: '/placeholder-product.jpg', alt: product.name };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product._id || product.id || '');
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const displayImage = product.images && product.images[currentImageIndex]
    ? product.images[currentImageIndex]
    : mainImage;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={displayImage.url}
          alt={displayImage.alt || product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.jpg';
          }}
        />

        {/* Image navigation dots */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Stock indicator */}
        {product.stock !== undefined && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
            product.stock > 10 ? 'bg-green-100 text-green-800' :
            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          {product.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-600">
              ₱{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₱{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {product.rating && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleCardClick}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}