import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import HomePage from "./pages/homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import ExamPage from "./components/ExamPage";
import AdminPage from "./pages/AdminPage.jsx";
import CreateExamForm from "./components/CreateExamForm.jsx";
import { TimerProvider } from "./components/TimerContext.jsx";
import ThankYouPage from "./pages/ThankYou.jsx";
import CreateSession from "../src/components/CreateSession.jsx";
import RegisterUsers from "./components/RegisterUsers.jsx";
import UserView from "./View/UserView.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SessionManagement from "./View/SessionManagment.jsx";
import GenerateMCQ from "./components/GenerateMCQ.jsx";

const App = () => {
  return (
    <TimerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home/*"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exam-creation"
            element={
              <ProtectedRoute>
                <CreateExamForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/session-creation"
            element={
              <ProtectedRoute>
                <CreateSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user-creation"
            element={
              <ProtectedRoute>
                <RegisterUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/view-user"
            element={
              <ProtectedRoute>
                <UserView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/session-management"
            element={
              <ProtectedRoute>
                <SessionManagement/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/:examId"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ThankYou"
            element={
              <ProtectedRoute>
                <ThankYouPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions/generate"
            element={
              <ProtectedRoute>
                <GenerateMCQ />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </TimerProvider>
  );
};

export default App;
