import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TimerProvider } from './components/TimerContext';
import disableConsole from './utils/disableConsole';

// Call disableConsole to disable console logs
//  disableConsole();

ReactDOM.createRoot(document.getElementById('root')).render(

   <TimerProvider>
    <App />
    </TimerProvider>

);