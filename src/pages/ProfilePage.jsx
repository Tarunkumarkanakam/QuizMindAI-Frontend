import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar2'; // Adjust the import path as needed
import { getUserFromLocalStorage } from '../utils/auth'; // Adjust the import path as needed

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    email: '',
    phoneNo: '',
    department: ''
  });
  const [alternateEmail, setAlternateEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false); // State for saving status

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setAlternateEmail(storedUser.alternateEmail || '');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAlternateEmailChange = (e) => {
    setAlternateEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    // Check for empty fields and set errors
    if (!user.firstName) formErrors.firstName = 'Please fill this field';
    if (!user.lastName) formErrors.lastName = 'Please fill this field';
    if (!user.registrationNumber) formErrors.registrationNumber = 'Please fill this field';
    if (!alternateEmail) formErrors.alternateEmail = 'Please fill this field';
    if (!user.phoneNo) formErrors.phoneNo = 'Please fill this field';
    if (!user.department) formErrors.department = 'Please fill this field';

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Proceed with form submission
      setSaving(true); // Set saving state to true
      // Simulate saving process (can be replaced with actual saving logic)
      setTimeout(() => {
        console.log('Form submitted successfully');
        setSaving(false); // Reset saving state
      }, 1500); // Simulate a delay for visual effect
    }
  };

  return (
    <div>
      <Navbar /> {/* Assuming you have a separate Navbar component */}
      <div className="min-h-screen bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32% ">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-glass p-8 rounded-lg shadow-lg backdrop-blur-sm border border-white border-opacity-20">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Profile Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-gray-900">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.firstName ? 'border-red-500' : 'focus:border-blue-300'}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-gray-900">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.lastName ? 'border-red-500' : 'focus:border-blue-300'}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="registrationNumber" className="block text-gray-900">Registration Number</label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={user.registrationNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.registrationNumber ? 'border-red-500' : 'focus:border-blue-300'}`}
                  />
                  {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-900">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    readOnly
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="alternateEmail" className="block text-gray-900">Alternate Email</label>
                  <input
                    type="email"
                    id="alternateEmail"
                    value={alternateEmail}
                    onChange={handleAlternateEmailChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.alternateEmail ? 'border-red-500' : 'focus:border-blue-300'}`}
                  />
                  {errors.alternateEmail && <p className="text-red-500 text-xs mt-1">{errors.alternateEmail}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="phoneNo" className="block text-gray-900">Phone No</label>
                  <input
                    type="tel"
                    id="phoneNo"
                    name="phoneNo"
                    value={user.phoneNo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.phoneNo ? 'border-red-500' : 'focus:border-blue-300'}`}
                  />
                  {errors.phoneNo && <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="department" className="block text-gray-900">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={user.department}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.department ? 'border-red-500' : 'focus:border-blue-300'}`}
                  />
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button type="submit" className="bg-blue-500 text-gray-100 px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
