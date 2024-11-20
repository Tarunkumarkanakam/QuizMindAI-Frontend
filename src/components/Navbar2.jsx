import React from 'react';
import logo from '../assets/logo.png';

const Navbar2 = () => {
  return (
    <nav className="bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32% py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <img
          src={logo}
          alt="Navigate_Labs"
          className="w-60 h-auto"
        />
      </div>
    </nav>
  );
};

export default Navbar2;
