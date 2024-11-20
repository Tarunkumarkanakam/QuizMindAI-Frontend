import React, { useState, useEffect } from 'react';
import ANavbar3 from './aNavbar3';
import AdminNavBar from './AdminNavBar';
import { createSession, getAllUsers, getAllSessionsOnAdmin } from '../utils/api';
import { getUserFromLocalStorage } from '../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { components } from 'react-select';
import { FaCaretDown } from 'react-icons/fa';

const CreateSession = () => {
    const [sessionId, setSessionId] = useState('');
    const [examStart, setExamStart] = useState(new Date());
    const [examEnd, setExamEnd] = useState(new Date());
    const [examId, setExamId] = useState('');
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userEmails, setUserEmails] = useState([]);
    const [sessionIds, setSessionIds] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchUserEmails = async () => {
            const user = getUserFromLocalStorage();
            const token = user?.token;
            const adminEmail = user?.email;
            try {
                const users = await getAllUsers(token, adminEmail);
                // console.log('Fetched users:', users); // Log the fetched users
                const emailOptions = users.map(user => ({ value: user.userEmail, label: user.userEmail }));
                setUserEmails(emailOptions);
                // console.log('Email options:', emailOptions); // Log the email options
            } catch (error) {
                console.error('Error fetching user emails:', error);
            }
        };

        const fetchSessionIds = async () => {
            const user = getUserFromLocalStorage();
            const token = user?.token;
            const email = user?.email;
            try {
                const sessions = await getAllSessionsOnAdmin(token, email);
                // console.log('Fetched sessions:', sessions); // Log the fetched sessions
                setSessionIds(sessions);
                // console.log('Session options:', sessionOptions); // Log the session options
            } catch (error) {
                console.error('Error fetching session IDs:', error);
            }
        };

        fetchUserEmails();
        fetchSessionIds();
    }, []);

    const handleSelectAll = () => {
        setEmails(userEmails);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = getUserFromLocalStorage();
        const token = user?.token;
        const adminEmail = user?.email;
        setLoading(true);
        setMessage('');
        try {
            const emailList = emails.map(email => email.value);

            // Convert dates to IST string
            const options = { timeZone: 'Asia/Kolkata', hour12: false };
            const examStartTime = examStart.toLocaleString('sv-SE', options).replace(' ', 'T');
            const examEndTime = examEnd.toLocaleString('sv-SE', options).replace(' ', 'T');

            // console.log('Data to be sent to backend:', {
            //     token,
            //     sessionId,
            //     examStart: examStartTime,
            //     examEnd: examEndTime,
            //     examId,
            //     emailList
            // }); // Log the data before sending it to the backend

            const data = await createSession(token, sessionId, examStartTime, examEndTime, examId, emailList, adminEmail);
            // console.log('Response from backend:', data); // Log the response from the backend

            setMessage('Session created successfully!');
            setLoading(false);
        } catch (error) {
            console.error('Error creating session:', error);
            setMessage('Error creating session.');
            setLoading(false);
        }
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSessionSelect = (id) => {
        setSessionId(id);
        setShowDropdown(false);
    };

    const customComponents = {
        Menu: (props) => (
            <components.Menu {...props}>
                <div>
                    <button
                        type="button"
                        className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2"
                        onClick={handleSelectAll}
                    >
                        Select All
                    </button>
                </div>
                {props.children}
            </components.Menu>
        )
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: '10px',
            borderColor: '#6366F1',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#6366F1',
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            maxHeight: '300px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#6366F1' : 'white',
            color: state.isFocused ? 'white' : 'black',
            padding: '10px',
        }),
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <ANavbar3 />
            <div className="flex">
                <AdminNavBar className="ml-4" />
                <motion.div
                    className="flex-1 p-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-3xl mx-auto mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create Session</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex space-x-4">
                                    <div className="flex-1 relative">
                                        <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-1">
                                            Session ID:
                                        </label>
                                        <motion.input
                                            type="text"
                                            id="sessionId"
                                            value={sessionId}
                                            onChange={(e) => setSessionId(e.target.value)}
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <FaCaretDown
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                            onClick={handleDropdownToggle}
                                        />
                                        {showDropdown && (
                                            <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                {sessionIds.map((id, index) => (
                                                    <li
                                                        key={index}
                                                        className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white"
                                                        onClick={() => handleSessionSelect(id)}
                                                    >
                                                        {id}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-1">
                                            Emails:
                                        </label>
                                        <Select
                                            id="emails"
                                            isMulti
                                            options={userEmails}
                                            value={emails}
                                            onChange={(selectedOptions) => setEmails(selectedOptions)}
                                            className="block w-full"
                                            classNamePrefix="select"
                                            components={customComponents}
                                            styles={customStyles}
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label htmlFor="examStart" className="block text-sm font-medium text-gray-700 mb-1">
                                            Exam Start:
                                        </label>
                                        <DatePicker
                                            id="examStart"
                                            selected={examStart}
                                            onChange={(date) => {
                                                console.log(date),
                                                setExamStart(date)}
                                                
                                            }
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="MMMM d, yyyy HH:mm"
                                            timeCaption="time"
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="examEnd" className="block text-sm font-medium text-gray-700 mb-1">
                                            Exam End:
                                        </label>
                                        <DatePicker
                                            id="examEnd"
                                            selected={examEnd}
                                            onChange={(date) => setExamEnd(date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="MMMM d, yyyy HH:mm"
                                            timeCaption="time"
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label htmlFor="examId" className="block text-sm font-medium text-gray-700 mb-1">
                                            Exam ID:
                                        </label>
                                        <motion.input
                                            type="text"
                                            id="examId"
                                            value={examId}
                                            onChange={(e) => setExamId(e.target.value)}
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                                >
                                    {loading ? 'Creating...' : 'Create Session'}
                                </button>
                            </form>
                            <AnimatePresence>
                                {message && (
                                    <p className={`mt-4 text-center text-lg ${message === 'Error creating session.' ? 'text-red-600' : 'text-green-600'}`}>
                                        {message}
                                    </p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateSession;
