import React, { useEffect, useState } from "react";
import ANavbar3 from "../components/aNavbar3";
import AdminNavBar from "../components/AdminNavBar";
import { getAllUsers } from "../utils/api";
import { getUserFromLocalStorage } from "../utils/auth";

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageInput, setPageInput] = useState("1"); 
  const user = getUserFromLocalStorage();
  const token = user?.token;
  const adminEmail = user?.email;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(token, adminEmail);
        setUsers(response);
        setTotalPages(Math.ceil(response.length / 10));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber)) {
      if (pageNumber < 1) {
        setCurrentPage(1);
      } else if (pageNumber > totalPages) {
        setCurrentPage(totalPages);
      } else {
        setCurrentPage(pageNumber);
      }
    }
  }, [pageInput, totalPages]);

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const renderTable = () => {
    const startIndex = (currentPage - 1) * 10;
    const selectedUsers = users.slice(startIndex, startIndex + 10);
    const tableHeaders =
      selectedUsers.length > 0 ? Object.keys(selectedUsers[0]) : [];

    return (
      <table className="min-w-full border-collapse block md:table shadow-lg bg-white">
        <thead className="block md:table-header-group">
          <tr className="block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
            {tableHeaders.map((header) => (
              <th
                key={header}
                className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell"
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {selectedUsers.map((user, index) => (
            <tr
              key={index}
              className="bg-white border border-gray-300 md:border-none block md:table-row hover:bg-gray-100 transition duration-300"
            >
              {tableHeaders.map((header) => (
                <td
                  key={header}
                  className="p-2 md:border md:border-gray-300 text-left block md:table-cell"
                >
                  {user[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center border rounded-full bg-white shadow-lg">
          <button
            onClick={handlePreviousPage}
            className={`px-4 py-2 border-l rounded-l-full ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex items-center space-x-2 px-4">
            <span className="text-blue-500">Page</span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              className="w-16 px-2 py-1 border text-center rounded"
            />
            <span className="text-blue-500">of {totalPages}</span>
          </div>
          <button
            onClick={handleNextPage}
            className={`px-4 py-2 border-r rounded-r-full ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ANavbar3 />
      <div className="flex">
        <AdminNavBar />
        <div className="p-4 flex-1">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : (
            <>
              {renderTable()}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;
