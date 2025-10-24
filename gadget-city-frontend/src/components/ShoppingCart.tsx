import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CartItem } from '../types/Cart';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Reset error when cart opens
    if (isOpen) setError(null);
  }, [isOpen]);

  const handleQuantityChange = (item: CartItem, newValue: number) => {
    try {
      if (newValue < 1 || newValue > 99) {
        throw new Error('Quantity must be between 1 and 99');
      }
      updateQuantity(item.id, newValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      // Add your checkout logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Checkout successful!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
        role="presentation"
      />
      <div 
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto z-50"
        role="dialog"
        aria-labelledby="cart-heading"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="cart-heading" className="text-2xl font-bold">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <svg 
              className="w-16 h-16 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={onClose}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">₱{item.price.toLocaleString()}</p>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0 && value <= 99) {
                          updateQuantity(item.id, value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (value < 1) updateQuantity(item.id, 1);
                        if (value > 99) updateQuantity(item.id, 99);
                      }}
                      className="w-20 border rounded mt-2 px-2 py-1"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className={`w-full mt-4 py-2 rounded ${
                  isCheckingOut || items.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}