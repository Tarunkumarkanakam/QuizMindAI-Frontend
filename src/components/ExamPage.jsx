import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getExamData, getAllUserAnswers } from "../utils/api";
import { getUserFromLocalStorage, logoutUser } from "../utils/auth";
import { TimerProvider } from "./TimerContext";
import ExamContent from "./ExamContent";
import ModalComponent from "./ModalComponent";

const ExamPage = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const duration = location.state?.duration;
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUserFromLocalStorage();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!examId || !user?.token || !user?.email) {
          throw new Error("Missing necessary data for fetching exam");
        }
  
        const [data, userAnswers] = await Promise.all([
          getExamData(examId, user.token, user.email),
          getAllUserAnswers(examId, user.token, user.email),
        ]);
  
        setExamData(data);
  
        const savedAnswers = userAnswers.reduce((acc, answer) => {
          acc[answer.questionId] = answer.selectedOption;
          return acc;
        }, {});
  
        setSelectedAnswers(savedAnswers); // Initialize the selected answers state
      } catch (error) {
        console.error("Failed to fetch exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    const disableRightClick = (event) => {
      event.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowWarning(true);
      }
    };


    const handleKeyDown = (event) => {
      console.log(event.key)
      if (event.key === "Escape" ||  event.key === "Alt" || event.key === "Control" || event.key === "Meta" || event.key === "Super"|| event.key === 'F12' || event.key==="F5") {
        setShowWarning(true);
        // logoutUser(navigate);
      }
    };


    const handleFullScreenExit = () => {
      if (!document.fullscreenElement) {
        setShowWarning(true);
      }
    };

    const handleAlwaysActiveWindowExt = () => {
      // if (!document.fullscreenElement) {
      console.log("Triggered")
        setShowWarning(true);
      // }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener("fullscreenchange", handleFullScreenExit);
    document.addEventListener("mozfullscreenchange", handleFullScreenExit);
    document.addEventListener("webkitfullscreenchange", handleFullScreenExit);
    document.addEventListener("msfullscreenchange", handleFullScreenExit);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener('copy', disableRightClick);
    document.addEventListener('paste', disableRightClick);
    document.addEventListener('cut', disableRightClick);
    window.addEventListener('blur', handleAlwaysActiveWindowExt);
    window.addEventListener('focus', handleAlwaysActiveWindowExt);

    fetchData();

    return () => {
      window.removeEventListener('blur', handleAlwaysActiveWindowExt);
      window.removeEventListener('focus', handleAlwaysActiveWindowExt);
      document.removeEventListener('copy', disableRightClick);
      document.removeEventListener('paste', disableRightClick);
      document.removeEventListener('cut', disableRightClick);
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener("fullscreenchange", handleFullScreenExit);
      document.removeEventListener("mozfullscreenchange", handleFullScreenExit);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenExit);
      document.removeEventListener("msfullscreenchange", handleFullScreenExit);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [examId, user?.email, user?.token]);

  const handleLogoutAndNavigate = () => {
    logoutUser(navigate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-2xl">No exam data available</div>
      </div>
    );
  }

  if (showWarning) {
    return (
      <div>
        <ModalComponent
          isOpen={true} // Use showWarning state directly
          onRequestClose={() => logoutUser(navigate)}
          message={"You performed an unauthorized action. Your exam is getting submitted. Contact the administrator."}
          onProceed={handleLogoutAndNavigate} // Pass the function directly
        />
      </div>
    );
  }

  return (
    <TimerProvider duration={duration}>
      <ExamContent examData={examData} user={user} examId={examId} initialSelectedAnswers={selectedAnswers} />
    </TimerProvider>
  );
};

export default ExamPage;
