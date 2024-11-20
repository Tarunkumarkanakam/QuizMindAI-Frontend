import React, { useState } from "react";
import ANavbar3 from "./aNavbar3";
import AdminNavBar from "./AdminNavBar";
import { createExam } from "../utils/api"; // Adjust the path if necessary
import { getUserFromLocalStorage } from "../utils/auth"; // Adjust the path if necessary

const CreateExamForm = () => {
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = getUserFromLocalStorage();
    const token = user?.token; // Assuming token is stored with the user object
    console.log(token)

    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      await createExam(token, examId, examName, examDescription);
      setMessage("Exam created successfully!");
      // Clear the form
      setExamId("");
      setExamName("");
      setExamDescription("");
    } catch (error) {
      console.error("Error creating exam:", error);
      setMessage("Failed to create exam.");
    }
  };

  return (
    <div className="min-h-screen bg-teal-50">
      <ANavbar3 />
      <div className="flex">
        <AdminNavBar />
        <div className="flex-1 p-12">
          <div className="max-w-3xl mx-auto mt-4 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create Exam</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="examId" className="block text-sm font-medium text-gray-700 mb-1">Exam ID:</label>
                  <input
                    type="text"
                    id="examId"
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="examName" className="block text-sm font-medium text-gray-700 mb-1">Exam Name:</label>
                  <input
                    type="text"
                    id="examName"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-1">Exam Description:</label>
                  <textarea
                    id="examDescription"
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    required
                    rows="4"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                >
                  Create Exam
                </button>
              </form>
              {message && (
                <p className={`mt-4 text-center text-lg ${message === "Failed to create exam." ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamForm;
