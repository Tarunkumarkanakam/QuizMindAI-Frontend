import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalComponent = ({ isOpen, onRequestClose, message, onProceed }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-lg max-w-23 mx-auto p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex flex-col">
        {typeof message === 'string' ? (
          <p className="text-gray-700 text-center mb-6">{message}</p>
        ) : (
          message
        )}
        <div className="flex justify-end space-x-4">
          {onProceed && (
            <button
              onClick={onRequestClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          )}
          {onProceed && (
            <button
              onClick={onProceed}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Proceed
            </button>
          )}
          {!onProceed && (
            <button
              onClick={onRequestClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
