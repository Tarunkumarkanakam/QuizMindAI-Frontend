import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
const NavBar = ({ toggleSidebar, sidebarVisible }) => {
  const navigate = useNavigate();

 

 

  const handleLogout = () => {
    // Implement your logout logic here, e.g., clear local storage, reset state, etc.
    // For demo purposes, let's assume clearing local storage
    localStorage.clear();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <nav className={`bg-gray-800 px-4 py-3 flex justify-between items-center fixed top-0 transition-all duration-300 z-10 ${sidebarVisible ? 'left-64 w-[calc(100%-16rem)]' : 'left-0 w-full'} h-20`}>
      <img
        src={logo}
        alt="Navigate_Labs"
        className="w-32 h-auto"
      />
      <div>
        <button
          className="text-white text-xl cursor-pointer ml-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
