import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Gadget City PH
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;