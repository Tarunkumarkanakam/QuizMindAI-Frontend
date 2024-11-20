import React from "react";
import { motion } from "framer-motion";
import ANavbar3 from "../components/aNavbar3"
import AdminNavBar from "../components/AdminNavBar";
// import ProtectedRoute from "../components/ProtectedRoute";
// import CreateExamForm from "../components/CreateExamForm";
// import { Routes, Route } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ANavbar3/>
      <div className="flex flex-1">
        <AdminNavBar className="w-48" />
        <div className="flex-1 ml-16 p-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
          >
            QuizMind AI Welcomes You, Admin
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
