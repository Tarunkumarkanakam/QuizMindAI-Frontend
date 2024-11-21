// ModalComponent.jsx

import React from 'react';
import Modal from 'react-modal';
import { FaExclamationTriangle } from 'react-icons/fa';

Modal.setAppElement('#root');

const ModalComponent = ({ isOpen, onRequestClose, message, onProceed }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center">
        <FaExclamationTriangle className="text-yellow-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-center">Confirm Submission</h2>
        <p className="text-gray-700 text-center mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRequestClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
