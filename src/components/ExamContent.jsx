import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserAnswer } from "../utils/api";
import { getUserFromLocalStorage, logoutUser } from "../utils/auth";
import NavBar2 from "./Navbar3";
import Sidebar from "./Sidebar";
import Modal from './Modal';
import { TimerProvider, useTimer } from "./TimerContext";
import TimerDisplay from "./TimerDisplay";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Navbar3 from "./Navbar3";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"


// const TimerDisplay = () => {
//   const timeRemaining = useTimer();

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   return (
//     <div className="timer text-2xl mb-4">
//       Time Remaining: {formatTime(timeRemaining)}
//     </div>
//   );
// };

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
        if (selectedAnswers[question.id] !== null) {
            // try {
            //     await saveUserAnswer(
            //         user.token,
            //         user.email,
            //         examId,
            //         question.id,
            //         selectedAnswers[question.id]
            //     );
            // } catch (error) {
            //     console.error('Failed to submit answer:', error);
            // }
        }

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
                setOpenDropdown(nextSectionName);  // Automatically open the dropdown for the next section
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
                setOpenDropdown(prevSectionName);  // Automatically open the dropdown for the previous section
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
        const question = examData[currentSection][currentQuestionIndex];
        if (selectedAnswers[question.id] !== null) {
            try {
                await saveUserAnswer(
                    user.token,
                    user.email,
                    examId,
                    question.id,
                    selectedAnswers[question.id]
                );
                setShowSubmitModal(false);  // Close the modal on successful submission
                navigate('/ThankYou');
            } catch (error) {
                console.error('Failed to submit answer:', error);
            }
        } else {
            alert('Please select an answer before submitting.');
        }
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
        if (selectedAnswers[examData[sectionName][questionIndex].id] !== undefined) {
            return 'bg-green-500 text-white';
        }
        if (visitedQuestions[sectionName] && visitedQuestions[sectionName][questionIndex]) {
            return 'bg-red-500 text-white';
        }
        return 'bg-gray-100 hover:bg-blue-100';
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
        < >
            <Navbar3 />
            <div className="container mx-auto p-4 mt-24 flex flex-col md:flex-row select-none">
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


                <div className="w-full md:w-4/6">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            {/* <h2 className="text-2xl font-bold">{currentSection}</h2> */}
                            <div className="ml-auto">
                                <TimerDisplay />
                            </div>
                        </div>
                        <div key={currentQuestion.id} className="mb-4">
                            {/* <h3 className="font-semibold text-2xl">{`Question ${
                currentQuestionIndex + 1
              }:`}</h3> */}
                            <div className="whitespace-pre-wrap text-xl">
                                {renderQuestionWithCode(currentQuestion.question)}
                            </div>
                            <div className="space-y-4 mt-4 py-5">
                                {Object.entries(currentQuestion.answer).map(([optionId, optionText]) => (
                                    <div key={optionId}>
                                        <button
                                            onClick={() => handleOptionClick(optionId)}
                                            className={`block w-full bg-gray-200 hover:bg-blue-300 text-left px-4 py-2 rounded ${selectedOption === optionId
                                                    ? 'bg-yellow-300 border border-solid border-yellow-400 text-white font-bold'
                                                    : ''
                                                }`}
                                        >
                                            {optionText}
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-between items-center px-4 mt-4">
                        <div className="flex justify-center w-full ">
                            <button
                                onClick={handlePrevious}
                                className="bg-gray-500 text-white px-4 py-2 rounded mx-2 transition-all duration-300 hover:bg-gray-700 hover:text-white-300 transform hover:scale-105 hover:shadow-md mr-40 inline-flex items-center"
                            >
                                <FaChevronLeft className="h-5 w-5 mr-2 "></FaChevronLeft>
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-blue-500 text-white px-4 py-2 rounded mx-2 transition-all duration-300 hover:bg-blue-700 hover:text- white-300 transform hover:scale-105  hover:shadow-md mr-40 ml-20 inline-flex items-center"
                            >
                                Next
                                <FaChevronRight className="h-5 w-5 ml-2 "></FaChevronRight>

                            </button>
                        </div>
                        <div className="ml-auto">
                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                End Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
