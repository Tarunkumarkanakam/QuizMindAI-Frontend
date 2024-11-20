import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import ModalComponent from "./ModalComponent";
import TestList from "./TestList";
import { requestFullscreen } from "../utils/fullscreenUtils";

const UpcomingTests = ({ tests }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onProceed, setOnProceed] = useState(null);
    const navigate = useNavigate();

    const handleClick = (test) => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = moment().tz(userTimeZone);
        const testStartTime = moment
            .tz(test.examStartTime, "Asia/Kolkata")
            .tz(userTimeZone);
        const testEndTime = moment
            .tz(test.examEndTime, "Asia/Kolkata")
            .tz(userTimeZone);

        if (now < testStartTime) {
            setModalMessage("Please wait, you still have time for your test.");
            setOnProceed(null);
            setModalIsOpen(true);
        } else {
            setModalMessage(
                <div>
                    <h2 className="text-xl font-semibold mb-3">Please review the general test instructions.</h2>

                    <div className="text-base leading-relaxed">
                        {/* <p><strong>Test Structure</strong></p> */}
                        <ul className="list-disc ml-4">
                            <li><strong>Sections and Questions:</strong>
                                <ul className="list-disc ml-4">
                                    <li>The test is divided into multiple sections, each with its own set of questions.</li>
                                </ul>
                            {/* </li> */}
                            {/* <li><strong>Question Palette:</strong> */}
                                <ul className="list-disc ml-4">
                                    <li>Each section has a question palette showing all question numbers. The palette drops down when a section is opened.</li>
                                    <li>Colors indicate question status:</li>
                                    <ul className="list-disc ml-4">
                                        <li>Green: Attempted questions.</li>
                                        <li>Gray: Unvisited questions.</li>
                                        <li>Red: Visited but unattempted questions.</li>
                                    </ul>
                                </ul>
                            </li>
                            <li><strong>Timer:</strong>
                                <ul className="list-disc ml-4">
                                    <li>A countdown timer covers the entire test duration. Upon timer completion, users are logged out automatically.</li>
                                </ul>
                            </li>
                            <li><strong>Malpractice Prevention:</strong>
                                <ul className="list-disc ml-4">
                                    <li>Attempting to switch tabs or exit the window logs the user out.</li>
                                </ul>
                            </li>
                        </ul>

                        <p><strong>Expected User Actions</strong></p>
                        <ul className="list-disc ml-4">
                            <li><strong>Navigating Sections and Questions:</strong>
                                <ul className="list-disc ml-4">
                                    <li>Users can open sections to see the question palette.</li>
                                    <li>Questions are selected from the palette for answering.</li>
                                </ul>
                            {/* </li> */}
                            {/* <li><strong>Answering Questions:</strong> */}
                                <ul className="list-disc ml-4">
                                    <li>Attempting a question changes its color to green.</li>
                                    <li>Visiting a question without answering changes its color to red.</li>
                                    <li>Unvisited questions remain gray.</li>
                                </ul>
                            </li>
                            {/* <li><strong>Time Management:</strong>
                                <ul className="list-disc ml-4">
                                    <li>Users must manage their time with the countdown timer. Test submission and logout are automatic at timer expiration.</li>
                                </ul>
                            </li> */}
                            {/* <li><strong>Avoiding Malpractice:</strong>
                                <ul className="list-disc ml-4">
                                    <li>Refrain from switching tabs or exiting the test window to avoid automatic logout.</li>
                                </ul>
                            </li> */}
                        </ul>

                        <p className="mt-4">When ready, click "Proceed".</p>
                    </div>

                </div>

            );
            const durationMs = testEndTime - testStartTime;
            const durationMin = Math.floor(durationMs / 60000);
            setOnProceed(() => () => {
                console.log("Full screen Request");
                const element = document.documentElement;
                requestFullscreen(element);
                navigate(`/exam/${test.examId}`, { state: { duration: durationMin } });
                setModalIsOpen(false);
            });
            setModalIsOpen(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("examDuration");
        localStorage.removeItem("user");
        navigate("/home");
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Tests</h2>
            {tests.length === 0 ? (
                <p>No Tests Available right now.</p>
            ) : (
                <TestList tests={tests} onClick={handleClick} />
            )}
            <ModalComponent
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                message={modalMessage}
                onProceed={onProceed}
            />
        </div>
    );
};

export default UpcomingTests;
