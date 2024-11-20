import React from 'react';
import Navbar3 from '../components/Navbar3'; // Adjust the path as necessary
import { removeUserFromLocalStorage } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
const ThankYouPage = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        removeUserFromLocalStorage();
        navigate('/');  // Redirect to login page after logout
    };
  return (
    <div className='bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32%'>
      <Navbar3 />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32% text-white p-4">
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h1 className="text-4xl font-bold mb-4 text-center">Thank You!</h1>
          <p className="text-lg mb-6 text-center">
            We appreciate your effort and time. Your submission has been received successfully.
          </p>
          <div className="flex justify-center">
            <button
              className="bg-[#36dab3] text-white py-2 px-4 rounded-lg shadow hover:bg-[#2ea287] transition duration-300"
              onClick={handleLogout}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
