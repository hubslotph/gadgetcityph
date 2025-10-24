import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

// Add loading component for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route 
          path="*" 
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
              <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;