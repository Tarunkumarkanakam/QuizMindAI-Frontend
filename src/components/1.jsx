import React, { useState, useEffect } from "react";
import ANavbar from "../components/aNavbar3";
import AdminNavbar from "../components/AdminNavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllSessionsOnAdmin,
  getAllSessions,
  updateSession,
} from "../utils/api";
import { getUserFromLocalStorage } from "../utils/auth";

const SessionManagement = () => {
  const [sessionIds, setSessionIds] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState([]);
  const [filteredSessionData, setFilteredSessionData] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 15;
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserFromLocalStorage();
        const token = user?.token;
        const email = user?.email;
        const sessions = await getAllSessionsOnAdmin(token, email);
        console.log(sessions);
        setSessionIds(sessions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session IDs:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = sessionData.filter((session) => {
      return (
        (searchEmail === "" ||
          session.userEmail
            .toLowerCase()
            .includes(searchEmail.toLowerCase())) &&
        (filterStatus === "" ||
          (filterStatus === "true" && session.lockStatus) ||
          (filterStatus === "false" && !session.lockStatus))
      );
    });
    setFilteredSessionData(filteredData);
  }, [sessionData, searchEmail, filterStatus]);

  const handleChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSessionId(sessionId);
    if (sessionId) {
      try {
        const user = getUserFromLocalStorage();
        const token = user?.token;
        const email = user?.email;
        const sessionDetails = await getAllSessions(email, sessionId, token);
        setSessionData(sessionDetails);
        setOriginalData(JSON.parse(JSON.stringify(sessionDetails))); // Deep copy to preserve original data
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    } else {
      setSessionData([]);
      setOriginalData([]);
    }
  };

  //This is for refresh button

  const fetchSessionDetails = async (sessionId) => {
    try {
      const user = getUserFromLocalStorage();
      const token = user?.token;
      const email = user?.email;
      const sessionDetails = await getAllSessions(email, sessionId, token);
      setSessionData(sessionDetails);
      setOriginalData(JSON.parse(JSON.stringify(sessionDetails))); // Deep copy to preserve original data
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const handleRefresh = async () => {
    if (selectedSessionId) {
      fetchSessionDetails(selectedSessionId);
    }
  };

  const handleSearch = (e) => {
    setSearchEmail(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleEdit = (sessionId) => {
    setEditingSessionId(sessionId);
  };

  const handleUpdate = async (session) => {
    try {
      // Convert exam start and end times to IST
      const options = { timeZone: "Asia/Kolkata", hour12: false };
      const formattedStartTime = new Date(session.examStartTime)
        .toLocaleString("sv-SE", options)
        .replace(" ", "T");
      const formattedEndTime = new Date(session.examEndTime)
        .toLocaleString("sv-SE", options)
        .replace(" ", "T");

      // Prepare updated session object with IST times
      const updatedSession = {
        ...session,
        examStartTime: formattedStartTime,
        examEndTime: formattedEndTime,
      };

      // Proceed with the update
      const user = getUserFromLocalStorage();
      const token = user?.token;
      const email = user?.email;

      await updateSession(email, session.sessionId, token, updatedSession);
      setEditingSessionId(null);

      // Refresh the session data to reflect the update
      const sessionDetails = await getAllSessions(
        email,
        selectedSessionId,
        token
      );
      setSessionData(sessionDetails);
      setOriginalData(JSON.parse(JSON.stringify(sessionDetails))); // Deep copy to preserve original data
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleInputChange = (value, sessionId, field) => {
    const updatedData = sessionData.map((session) => {
      if (session.id === sessionId) {
        return { ...session, [field]: value };
      }
      return session;
    });
    setSessionData(updatedData);
  };

  const handleDelete = async (sessionId) => {
    // Handle delete logic here
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSessionData.length / sessionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessionData.slice(
    indexOfFirstSession,
    indexOfLastSession
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ANavbar />
      <div className="flex flex-col md:flex-row">
        <AdminNavbar />
        <div className="flex-1 ml-16 transition-all duration-300 ease-in-out p-4">
          <div className="p-4 mb-4 md:flex md:items-center md:justify-between">
            <div className="md:flex md:space-x-4">
              <select
                value={selectedSessionId}
                onChange={handleChange}
                className="border rounded p-2 w-full md:w-auto"
                aria-label="Select Session ID"
              >
                <option value="">Select Session ID</option>
                {sessionIds.map((sessionId, index) => (
                  <option key={index} value={sessionId}>
                    {sessionId}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchEmail}
                onChange={handleSearch}
                placeholder="Search by Email"
                className="border rounded p-2 w-full md:w-auto mt-2 md:mt-0"
              />
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="border rounded p-2 w-full md:w-auto mt-2 md:mt-0"
              >
                <option value="">Filter by Status</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              <button
                onClick={handleRefresh}
                className="ml-4 px-4 py-2 border rounded bg-white text-indigo-500"
                disabled={!selectedSessionId}
              >
                Refresh
              </button>
            </div>
          </div>
          {filteredSessionData.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 divide-y divide-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentSessions.map((session, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {indexOfFirstSession + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {editingSessionId === session.id ? (
                            <input
                              type="text"
                              value={session.sessionId}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  session.id,
                                  "sessionId"
                                )
                              }
                              className="border rounded p-2 w-full"
                              readOnly
                            />
                          ) : (
                            session.sessionId
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {editingSessionId === session.id ? (
                            <input
                              type="text"
                              value={session.examId}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  session.id,
                                  "examId"
                                )
                              }
                              className="border rounded p-2 w-full"
                            />
                          ) : (
                            session.examId
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {editingSessionId === session.id ? (
                            <input
                              type="text"
                              value={session.userEmail}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  session.id,
                                  "userEmail"
                                )
                              }
                              className="border rounded p-2 w-full"
                            />
                          ) : (
                            session.userEmail
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {editingSessionId === session.id ? (
                            <DatePicker
                              selected={new Date(session.examStartTime)}
                              onChange={(date) =>
                                handleInputChange(
                                  date.toISOString(),
                                  session.id,
                                  "examStartTime"
                                )
                              }
                              showTimeSelect
                              dateFormat="yyyy-MM-dd HH:mm:ss"
                              className="border rounded p-2 w-full"
                            />
                          ) : (
                            new Date(session.examStartTime).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              }
                            )
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {editingSessionId === session.id ? (
                            <DatePicker
                              selected={new Date(session.examEndTime)}
                              onChange={(date) =>
                                handleInputChange(
                                  date.toISOString(),
                                  session.id,
                                  "examEndTime"
                                )
                              }
                              showTimeSelect
                              dateFormat="yyyy-MM-dd HH:mm:ss"
                              className="border rounded p-2 w-full"
                            />
                          ) : (
                            new Date(session.examEndTime).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              }
                            )
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                          {editingSessionId === session.id ? (
                            <select
                              value={session.lockStatus ? "true" : "false"}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value === "true",
                                  session.id,
                                  "lockStatus"
                                )
                              }
                              className="border rounded p-2 w-full"
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : session.lockStatus ? (
                            <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                              True
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs">
                              False
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                          {editingSessionId === session.id ? (
                            <button
                              onClick={() => handleUpdate(session)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(session.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(session.sessionId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevPage}
                  className="px-4 py-2 border rounded bg-white text-indigo-500"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredSessionData.length / sessionsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  className="px-4 py-2 border rounded bg-white text-indigo-500"
                  disabled={
                    currentPage ===
                    Math.ceil(filteredSessionData.length / sessionsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              {selectedSessionId
                ? `No sessions found for the selected criteria.`
                : "Select a Session ID"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
