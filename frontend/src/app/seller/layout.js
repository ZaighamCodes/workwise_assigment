import React from 'react';
import Sidebar from './components/Sidebar';

export default function SellerLayout({ children }) {
  return (
    <div className="parent flex">
      <div className="seller-page-left">
        <Sidebar />
      </div>
      <div className="seller-page-right flex-1 p-4">
        {children}
      </div>
    </div>
  );
}
