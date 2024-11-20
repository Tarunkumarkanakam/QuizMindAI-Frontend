import React from 'react';
import moment from 'moment-timezone';
import { motion } from 'framer-motion';

const TestList = ({ tests, onClick }) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleMouseMove = (event, setStyle) => {
        const { clientX, clientY, currentTarget } = event;
        const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = currentTarget;
        const x = (clientX - offsetLeft - offsetWidth / 2) / 20;
        const y = (clientY - offsetTop - offsetHeight / 2) / 20;
        setStyle({
            rotateX: y,
            rotateY: -x,
        });
    };

    const handleMouseLeave = (setStyle) => {
        setStyle({ rotateX: 0, rotateY: 0 });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {tests.map((test) => {
                const [style, setStyle] = React.useState({ rotateX: 0, rotateY: 0 });

                return (
                    <motion.div
                        key={test.examId}
                        className="w-96 h-80 p-6 rounded-lg cursor-pointer transition-transform duration-300 flex flex-col justify-between"
                        onClick={() => onClick(test)}
                        onMouseMove={(e) => handleMouseMove(e, setStyle)}
                        onMouseLeave={() => handleMouseLeave(setStyle)}
                        style={{
                            perspective: 1000,
                            transformStyle: 'preserve-3d',
                            transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg)`,
                            background: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <div>
                            <motion.h3
                                className="text-2xl font-bold"
                                style={{
                                    transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg)`,
                                }}
                            >
                                {test.examName}
                            </motion.h3>
                            <motion.p
                                className="mt-2 text-lg"
                                style={{
                                    transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg)`,
                                }}
                            >
                                {test.examDesc}
                            </motion.p>
                        </div>
                        <div>
                            <motion.p
                                className="mt-2 text-sm"
                                style={{
                                    transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg)`,
                                }}
                            >
                                Start Time: {moment.tz(test.examStartTime, 'Asia/Kolkata').tz(userTimeZone).format('Do MMMM YYYY hh:mm A')}
                            </motion.p>
                            <motion.p
                                className="mt-1 text-sm"
                                style={{
                                    transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg)`,
                                }}
                            >
                                End Time: {moment.tz(test.examEndTime, 'Asia/Kolkata').tz(userTimeZone).format('Do MMMM YYYY hh:mm A')}
                            </motion.p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TestList;
