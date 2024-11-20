import React from 'react';
import { NavLink } from 'react-router-dom';

const SecondaryNavbar = () => {
    return (
        <nav className= "bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32% shadow-md p-4">
            <div className="container mx-auto flex justify-center space-x-8">
                <NavLink
                    to="/home/upcoming-tests"
                    className={({ isActive }) => 
                        `text-lg px-4 py-2 rounded transition-colors duration-300 border border-solid 
                        ${isActive ? 'text-black  bg-gradient-to-r from-green-200 to-blue-300 ' : 'text-black hover:text-blue-600 ' }`
                    }
                >
                    Upcoming Tests
                </NavLink>
                
                <NavLink
                    to="/home/past-tests"
                    className={({ isActive }) => 
                        `text-lg px-4 py-2 rounded transition-colors duration-300 
                        ${isActive ? 'text-black  bg-gradient-to-r to-green-200 from-blue-300' : 'text-gray-700 hover:text-blue-600'}`
                    }
                >
                    Past Tests
                </NavLink>
            </div>
        </nav>
    );
};

export default SecondaryNavbar;
