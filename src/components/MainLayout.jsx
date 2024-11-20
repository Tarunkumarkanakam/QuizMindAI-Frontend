// MainLayout.jsx

import React from 'react';
import ANavbar3 from './aNavbar3';
import AdminNavBar from './AdminNavBar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-teal-50">
      <ANavbar3 />
      <div className="flex">
        <AdminNavBar />
        <div className="flex-1 ml-20 transition-all duration-300 ease-in-out p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
