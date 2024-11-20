// GenerateMCQ.jsx

import React, { useState } from 'react';
import { generateQuestions, saveQuestions } from '../utils/api';
import { getUserFromLocalStorage } from '../utils/auth';
import MainLayout from './MainLayout';
import { FiLoader } from 'react-icons/fi';

const GenerateMCQ = () => {
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(15); // Default to 15 questions
  const [complexity, setComplexity] = useState('Medium'); // Default complexity
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExamIdModal, setShowExamIdModal] = useState(false);
  const [examId, setExamId] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setMessage('Please enter a prompt.');
      return;
    }

    if (!numQuestions || numQuestions <= 0) {
      setMessage('Please enter a valid number of questions.');
      return;
    }

    setLoading(true);
    setMessage('');
    setQuestions([]);
    setSelectedQuestions([]);

    try {
      // Generate questions using the onNewQuestion callback
      await generateQuestions(prompt, topic, numQuestions, complexity, (newQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        setSelectedQuestions((prevSelected) => [...prevSelected, newQuestion]);
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      setMessage('Failed to generate questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (question) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleSubmit = () => {
    if (selectedQuestions.length === 0) {
      setMessage('Please select at least one question to save.');
      return;
    }

    setShowExamIdModal(true);
  };

  const handleSaveQuestions = async () => {
    if (!examId) {
      setMessage('Please enter an Exam ID.');
      return;
    }

    const user = getUserFromLocalStorage();
    const token = user?.token;

    if (!token) {
      setMessage('User not authenticated');
      return;
    }

    setLoading(true);
    setMessage('');
    setShowExamIdModal(false);

    try {
      await saveQuestions(token, selectedQuestions, examId);
      setMessage('Questions saved successfully!');
      setQuestions([]);
      setSelectedQuestions([]);
      setPrompt('');
      setExamId('');
    } catch (error) {
      console.error('Error saving questions:', error);
      setMessage('Failed to save questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Left 1/3rd: Prompt Input */}
        <div className="w-full lg:w-1/3 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Enter Prompt</h2>
          <textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="4"
            className="block w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Enter topic (optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Number of Questions:</label>
            <input
              type="number"
              min="1"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Complexity:</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Questions'
            )}
          </button>
          {message && (
            <p
              className={`mt-4 text-center text-lg ${
                message.includes('Failed') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Right 2/3rds: Generated Questions */}
        <div className="w-full lg:w-2/3 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Generated Questions</h2>
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border p-4 rounded-md shadow-sm bg-white">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question)}
                      onChange={() => handleSelectQuestion(question)}
                      className="mt-1 mr-2"
                    />
                    <div>
                      <p className="font-semibold">{question.questionText}</p>
                      <ul className="mt-2 space-y-1">
                        {question.options.map((option, idx) => (
                          <li
                            key={idx}
                            className={`pl-4 relative ${
                              idx === question.correctOptionIndex ? 'text-green-600' : ''
                            }`}
                          >
                            <span
                              className={`absolute left-0 top-0 font-bold ${
                                idx === question.correctOptionIndex ? 'text-green-600' : 'text-gray-600'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {option}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm text-gray-500">Topic: {question.topic}</p>
                      <details className="mt-2">
                        <summary className="text-sm text-gray-600 cursor-pointer">
                          Show Explanation
                        </summary>
                        <p className="mt-1 text-sm text-gray-700">{question.explanation}</p>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Selected Questions'
                )}
              </button>
            </div>
          ) : (
            <p className="text-gray-600">
              {loading ? 'Generating questions...' : 'No questions generated yet.'}
            </p>
          )}
        </div>
      </div>

      {/* Exam ID Modal */}
      {showExamIdModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Enter Exam ID</h3>
            <input
              type="text"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Exam ID"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowExamIdModal(false)}
                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestions}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md focus:outline-none"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default GenerateMCQ;
