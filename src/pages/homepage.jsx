import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar3 from '../components/Navbar3';
import SecondaryNavbar from '../components/SecondaryNavbar';
import UpcomingTests from '../components/UpcomingTests';
import PastTests from '../components/PastTests';
import { getTestInformation } from '../utils/api';
import { getUserFromLocalStorage } from '../utils/auth';
import ExamPage from '../components/ExamPage';
import moment from 'moment-timezone';

const HomePage = () => {
    const [upcomingTests, setUpcomingTests] = useState([]);
    const [pastTests, setPastTests] = useState([]);

    useEffect(() => {
        const user = getUserFromLocalStorage();
        const fetchData = async () => {
            try {
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const tests = await getTestInformation(user.token, user.email);
                
                // Log the fetched test information
                console.log(tests);

                const now = moment().tz(userTimeZone);
                const upcoming = tests.filter(test => {
                    const testStartTime = moment.tz(test.examStartTime, 'Asia/Kolkata').tz(userTimeZone);
                    const thirtyMinutesLater = new Date(testStartTime.toDate().getTime() + 30 * 60000);
                    return now < testStartTime || now <= thirtyMinutesLater;
                });
                const past = tests.filter(test => {
                    const testStartTime = moment.tz(test.examStartTime, 'Asia/Kolkata').tz(userTimeZone);
                    const thirtyMinutesLater = new Date(testStartTime.toDate().getTime() + 30 * 60000);
                    return now > thirtyMinutesLater;
                });
                setUpcomingTests(upcoming);
                setPastTests(past);
            } catch (error) {
                console.error('Failed to fetch test information:', error);
            }
        };
        fetchData();
    }, []);

    const handlePastTestClick = (test) => {
        const now = new Date();
        const testStartTime = new Date(test.examStartTime);
        const thirtyMinutesLater = new Date(testStartTime.getTime() + 30 * 60000);

        if (now > thirtyMinutesLater) {
            alert('The test is completed.');
        } else {
            console.log('The test is still accessible.');
        }
    };

    const handleUpcomingTestClick = (test) => {
        const now = new Date();
        const testStartTime = new Date(test.examStartTime);

        if (now < testStartTime) {
            alert('The test hasn\'t started yet.');
        } else {
            console.log('Navigate to the test page.');
            // Add navigation logic here, for example:
            // navigate(/exam/${test.examId});
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-50 from-28% via-cyan-50 via-40% to-indigo-100 to-32%">
            <Navbar3 />
            <SecondaryNavbar />
            <div className="container mx-auto p-4 ">
                <Routes>
                    <Route
                        path="upcoming-tests"
                        element={<UpcomingTests tests={upcomingTests} onClick={handleUpcomingTestClick} />}
                    />
                    <Route
                        path="past-tests"
                        element={<PastTests tests={pastTests} onClick={handlePastTestClick} />}
                    />
                    <Route
                        path="exam/:examId"
                        element={<ExamPage />}
                    />
                    <Route
                        path="*"
                        element={<UpcomingTests tests={upcomingTests} onClick={handleUpcomingTestClick} />}
                    />
                </Routes>
            </div>
        </div>
    );
};

export default HomePage;
