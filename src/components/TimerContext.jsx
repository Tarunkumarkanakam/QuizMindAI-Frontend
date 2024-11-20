import React, { createContext, useContext, useState, useEffect } from 'react';
import { removeUserFromLocalStorage } from '../utils/auth';

const TimerContext = createContext();

export const TimerProvider = ({ duration, children }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          // Call logout function when timer reaches 0
          removeUserFromLocalStorage();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <TimerContext.Provider value={timeLeft}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
