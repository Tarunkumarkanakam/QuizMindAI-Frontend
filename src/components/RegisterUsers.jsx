import React, { useState } from 'react';
import { registerUsers } from '../utils/api';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ANavbar3 from './aNavbar3';
import AdminNavBar from './AdminNavBar';
import { getUserFromLocalStorage } from '../utils/auth';

const ITEMS_PER_PAGE = 8;

const RegisterUsers = () => {
    const [emails, setEmails] = useState('');
    const [registering, setRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleAdd = (e) => {
        e.preventDefault();
        const emailArray = emails.split(',').map(email => email.trim());
        const newUsers = emailArray.map(email => ({ email, password: '' }));
        setUsers([...users, ...newUsers]);
        setEmails('');
    };

    const handleConfirm = async () => {
        const user = getUserFromLocalStorage();
        const token = user?.token;
        const adminEmail = user?.email;
        console.log('Token:', token);
        setRegistering(true);

        if (!token) {
            setRegistrationStatus('User not authenticated');
            setRegistering(false);
            return;
        }

        try {
            const emailArray = users.map(user => user.email);
            const data = await registerUsers(token, emailArray, adminEmail);
            console.log('Users registered successfully:', data);

            if (Array.isArray(data)) {
                const updatedUsers = data.map(user => ({
                    email: user.userEmail,
                    password: user.password
                }));
                setUsers(updatedUsers);
                setRegistrationStatus('User(s) created successfully.');
                downloadExcel(updatedUsers);
            } else {
                console.error('Unexpected API response structure:', data);
            }
        } catch (error) {
            console.error('Error registering users:', error.response ? error.response.data : error.message);
            setRegistrationStatus('Failed to register users.');
        } finally {
            setRegistering(false);
        }
    };

    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "users.xlsx");
    };

    const handleDownloadTemplate = () => {
        const template = [{ email: '' }];
        downloadExcel(template);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const newUsers = json.map(item => ({ email: item.email, password: '' }));
            setUsers([...users, ...newUsers]);

            const user = getUserFromLocalStorage();
            const token = user?.token;
            const adminEmail = user?.emai;l
            console.log('Token:', token);
            setRegistering(true);

            if (!token) {
                setRegistrationStatus('User not authenticated');
                setRegistering(false);
                return;
            }

            try {
                const emailArray = newUsers.map(user => user.email);
                const data = await registerUsers(token, emailArray);
                console.log('Users registered successfully:', data);

                if (Array.isArray(data)) {
                    const updatedUsers = data.map(user => ({
                        email: user.userEmail,
                        password: user.password
                    }));
                    setUsers(updatedUsers);
                    setRegistrationStatus('User(s) created successfully.');
                    downloadExcel(updatedUsers);
                } else {
                    console.error('Unexpected API response structure:', data);
                }
            } catch (error) {
                console.error('Error registering users:', error.response ? error.response.data : error.message);
                setRegistrationStatus('Failed to register users.');
            } finally {
                setRegistering(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleEdit = (index) => {
        // Implement edit functionality
    };

    const handleDelete = (index) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const currentUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-teal-50">
            <ANavbar3 />
            <div className="flex">
                <AdminNavBar className="w-1/4 bg-gray-200" />
                <div className="flex-1 p-4 md:p-8">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleDownloadTemplate}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
                        >
                            Download Template
                        </button>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleUpload}
                            className="hidden"
                            id="upload"
                        />
                        <label
                            htmlFor="upload"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer"
                        >
                            Upload
                        </label>
                    </div>
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-4">
                        <div className="p-8">
                            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Register Users</h2>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-1">Emails (comma separated):</label>
                                    <input
                                        type="text"
                                        id="emails"
                                        value={emails}
                                        onChange={(e) => setEmails(e.target.value)}
                                        required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex space-x-4">
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAdd}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Add
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleConfirm}
                                        disabled={registering}
                                        className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${registering ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Confirm
                                    </motion.button>
                                </div>
                            </form>
                            {registrationStatus && (
                                <p className={`text-center mt-4 text-lg ${registrationStatus === 'Failed to register users.' ? 'text-red-600' : 'text-green-600'}`}>
                                    {registrationStatus}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left">S.No</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Password</th>
                                    <th className="py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-3 px-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">{user.password}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button onClick={() => handleEdit(index)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(index)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length > ITEMS_PER_PAGE && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterUsers;
