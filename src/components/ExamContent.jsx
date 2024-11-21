// ExamContent.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserAnswer } from "../utils/api";
import { getUserFromLocalStorage } from "../utils/auth";
import Navbar3 from "./Navbar3";
import Sidebar from "./Sidebar";
import Modal from './Modal';
import { useTimer } from "./TimerContext";
import TimerDisplay from "./TimerDisplay";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import '../temp.css'

const ExamContent = ({ examData, user, examId, initialSelectedAnswers, onLogout }) => {
  const [currentSection, setCurrentSection] = useState(Object.keys(examData)[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(initialSelectedAnswers);
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [openDropdown, setOpenDropdown] = useState(Object.keys(examData)[0]);
  const timeRemaining = useTimer();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    setVisitedQuestions((prev) => ({
      ...prev,
      [currentSection]: {
        ...(prev[currentSection] || {}),
        [currentQuestionIndex]: true,
      },
    }));
  }, [currentSection, currentQuestionIndex]);

  const handleNext = async () => {
    const question = examData[currentSection][currentQuestionIndex];
    // Save user answer if needed
    const sectionQuestions = examData[currentSection];
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < sectionQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      const sectionKeys = Object.keys(examData);
      const nextSectionIndex = sectionKeys.indexOf(currentSection) + 1;
      if (nextSectionIndex < sectionKeys.length) {
        const nextSectionName = sectionKeys[nextSectionIndex];
        setCurrentSection(nextSectionName);
        setCurrentQuestionIndex(0);
        setOpenDropdown(nextSectionName);
      }
    }
  };

  const handlePrevious = () => {
    const prevQuestionIndex = currentQuestionIndex - 1;
    if (prevQuestionIndex >= 0) {
      setCurrentQuestionIndex(prevQuestionIndex);
    } else {
      const sectionKeys = Object.keys(examData);
      const prevSectionIndex = sectionKeys.indexOf(currentSection) - 1;
      if (prevSectionIndex >= 0) {
        const prevSectionName = sectionKeys[prevSectionIndex];
        setCurrentSection(prevSectionName);
        setCurrentQuestionIndex(examData[prevSectionName].length - 1);
        setOpenDropdown(prevSectionName);
      }
    }
  };

  const handleSectionClick = (sectionName) => {
    setCurrentSection(sectionName);
    setCurrentQuestionIndex(0);
    setOpenDropdown(sectionName === openDropdown ? null : sectionName);
  };

  const handleOptionClick = async (optionId) => {
    const question = examData[currentSection][currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
    try {
      await saveUserAnswer(
        user.token,
        user.email,
        examId,
        question.id,
        optionId
      );
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    navigate('/ThankYou');
  };

  const handleQuestionClick = (sectionName, questionIndex) => {
    setCurrentSection(sectionName);
    setCurrentQuestionIndex(questionIndex);
    setVisitedQuestions((prev) => ({
      ...prev,
      [sectionName]: { ...(prev[sectionName] || {}), [questionIndex]: true },
    }));
    setOpenDropdown(sectionName);
  };

  const getQuestionStatusClass = (sectionName, questionIndex) => {
    const questionId = examData[sectionName][questionIndex].id;
    let temp = '';
    if (currentSection === sectionName && currentQuestionIndex === questionIndex) {
      // Current question: Highlighted with a blue background
      temp = 'relative question-highlight ';
    }
    if (selectedAnswers[questionId] !== undefined) {
      // Answered question: Green background
      return temp+'bg-green-500 text-white';
    } else if (visitedQuestions[sectionName] && visitedQuestions[sectionName][questionIndex]) {
      // Visited but unanswered question: Orange background
      return temp+'bg-orange-500 text-white';
    } else {
      // Unvisited question: Gray background
      return 'bg-gray-300';
    }
  };
  

  const currentQuestion = examData[currentSection][currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];

  const renderQuestionWithCode = (questionText) => {
    const parts = questionText.split(/(```\w*[\s\S]*?```)/).map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const language = part.match(/^```(\w+)/)?.[1] || 'text';
        const code = part.slice(part.indexOf('\n') + 1, -3);
        return (
          <SyntaxHighlighter language={language} style={dracula} key={index}>
            {code}
          </SyntaxHighlighter>
        );
      }
      return <span key={index}>{part}</span>;
    });
    return <div>{parts}</div>;
  };

  return (
    <>
      <Navbar3 />
      <div className="container mx-auto p-4 mt-20 flex flex-col md:flex-row select-none">
        {/* Sidebar */}
        <Sidebar
          examData={examData}
          currentSection={currentSection}
          currentQuestionIndex={currentQuestionIndex}
          handleSectionClick={handleSectionClick}
          handleQuestionClick={handleQuestionClick}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          getQuestionStatusClass={getQuestionStatusClass}
        />

        {/* Main Content */}
        <div className="w-full md:w-4/6 md:ml-6 bg-white p-6 rounded-lg shadow-lg">
          {/* Timer and Progress */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              {currentSection}
            </h2>
            <TimerDisplay />
          </div>

          {/* Question */}
          <div key={currentQuestion.id} className="mb-6">
            <h3 className="font-semibold text-lg mb-4">
              {`Question ${currentQuestionIndex + 1}:`}
            </h3>
            <div className="whitespace-pre-wrap text-gray-800 mb-6">
              {renderQuestionWithCode(currentQuestion.question)}
            </div>

            {/* Options */}
            <div className="space-y-4">
              {Object.entries(currentQuestion.answer).map(([optionId, optionText]) => (
                <div key={optionId}>
                  <button
                    onClick={() => handleOptionClick(optionId)}
                    className={`block w-full text-left px-4 py-3 rounded-md border transition duration-200 ${
                      selectedOption === optionId
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {optionText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-300 transition duration-200"
              disabled={currentQuestionIndex === 0 && currentSection === Object.keys(examData)[0]}
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition duration-200"
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              End Test
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        message="Are you sure you want to submit your answers?"
        onConfirm={handleSubmit}
        onCancel={() => setShowSubmitModal(false)}
      />
    </>
  );
};

export default ExamContent;
