import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { removeUserFromLocalStorage } from '../utils/auth';
import logoCircle from '../assets/logo-circle.png';
import logoText from '../assets/logo-text.png';

const Navbar3 = () => {
    const [isLogoCircleAnimated, setIsLogoCircleAnimated] = useState(false);
    const [isLogoTextAnimated, setIsLogoTextAnimated] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeUserFromLocalStorage();
        navigate('/');  // Redirect to login page after logout
    };

    useEffect(() => {
        // Trigger logoCircle animation after a delay
        setTimeout(() => {
            setIsLogoCircleAnimated(true);
        }, 200);

        // Trigger logoText animation immediately
        setIsLogoTextAnimated(true);
    }, []);

    return (
        <div>
            <nav className="bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32% py-4">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <Link to="/home"> {/* Add Link component to wrap the logoCircle */}
                            <motion.img
                                src={logoCircle}
                                alt="QuizMind AI"
                                className="w-18 h-auto mr-2 cursor-pointer"
                                initial={{ rotate: 0 }}
                                animate={isLogoCircleAnimated ? { rotate: 360 } : {}}
                                transition={{ duration: 1 }}
                            />
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={isLogoTextAnimated ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="text-lg font-semibold"
                        >
                            <img
                                src={logoText}
                                alt="QuizMind AI"
                                className="w-auto h-8 md:h-auto"
                            />
                        </motion.div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="border border-solid border-gray-600 rounded-md font-semibold px-4 py-2 hover:bg-gray-600 hover:text-white transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar3;
