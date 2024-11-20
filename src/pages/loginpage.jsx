import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { saveUserToLocalStorage } from '../utils/auth';
import Navbar2 from '../components/Navbar2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import icons
import icon1 from '../assets/01.png';
import icon2 from '../assets/02.png';
import icon3 from '../assets/03.png';
import icon4 from '../assets/04.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEmailError('');
        setPasswordError('');
        setLoading(true);

        try {
            const { token, role } = await login(email, password);
            saveUserToLocalStorage({ token, role, email });
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/home/upcoming-tests');
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                if (message === 'Invalid username') {
                    setEmailError('Malformed username');
                } else if (message === 'Invalid password') {
                    setPasswordError('Incorrect password');
                } else {
                    setPasswordError('Login failed. Please try again.');
                }
            } else {
                setPasswordError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='min-h-screen flex flex-col relative'>
            <Navbar2 />
            <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32% py-12 px-2 sm:px-6 lg:px-8 relative">
                <div className="max-w-md w-full p-6 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg relative">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold mt-9 text-gray-900">Sign in to your account</h2>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className={`rounded-md shadow-sm -space-y-px ${emailError ? 'border-red-500' : ''}`}>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="user@questai.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base ${emailError ? 'border-red-500' : ''}`}
                                required
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>
                        <div className={`relative ${passwordError ? 'border-red-500' : ''}`}>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base ${passwordError ? 'border-red-500' : ''}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash aria-label="Hide password" /> : <FaEye aria-label="Show password" />}
                            </button>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center mb-9 mt-8 py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-500 ease-in-out transform hover:scale-105"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Framer Motion Animation Section
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  
                    <motion.img
                        src={icon1}
                        alt="Icon 1"
                        style={{ position: 'absolute', top: '20%', left: '50%', originX: '50%', originY: '0', rotate: 0, width: '50px', height: '50px' }}
                        animate={{
                            rotate: 360,
                            originX: '40%',
                            originY: '0',
                            transition: { duration: 4, repeat: Infinity, ease: 'linear' }
                        }}
                    />
                   
                    <motion.img
                        src={icon2}
                        alt="Icon 2"
                        style={{ position: 'absolute', top: '50%', left: '30%', originX: '0', originY: '50%', rotate: 0, width: '50px', height: '50px' }}
                        animate={{
                            rotate: 360,
                            originX: '0',
                            originY: '50%',
                            transition: { duration: 3, repeat: Infinity, ease: 'linear' }
                        }}
                    />
                    <motion.img
                        src={icon3}
                        alt="Icon 3"
                        style={{ position: 'absolute', bottom: '10%', left: '50%', originX: '50%', originY: '85%', rotate: 0, width: '50px', height: '50px' }}
                        animate={{
                            rotate: 360,
                            originX: '50%',
                            originY: '80%',
                            transition: { duration: 5, repeat: Infinity, ease: 'linear' }
                        }}
                    />
                 
                    <motion.img
                        src={icon4}
                        alt="Icon 4"
                        style={{ position: 'absolute', top: '50%', right: '30%', originX: '90%', originY: '50%', rotate: 0, width: '50px', height: '50px' }}
                        animate={{
                            rotate: 360,
                            originX: '80%',
                            originY: '50%',
                            transition: { duration: 3.5, repeat: Infinity, ease: 'linear' }
                        }}
                    />
                </div> 

            </div> */}
        </div>
    );
};

export default LoginPage;
