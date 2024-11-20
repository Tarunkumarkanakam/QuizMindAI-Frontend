import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Make sure to set the app element for accessibility

const ModalComponent = ({ isOpen, onRequestClose, message, onProceed }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-content bg-white rounded-lg shadow-lg overflow-y-auto w-11/12 max-w-4xl p-8 max-h-full"
            overlayClassName="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"
        >
            <div className="modal-body p-4 bg-gray-100 rounded-lg max-h-full overflow-y-auto"> 
                <div className="flex justify-between items-center mb-4">
                    {/* <h2 className="text-2xl font-bold">Notification</h2> */}
                </div>
                <div className="modal-message px-1 max-h-3/4 overflow-y-auto">
                    {message}
                </div>
                <div className="flex justify-end mt-4">
                    {onProceed && (
                        <button
                            onClick={onProceed}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Proceed
                        </button>
                    )}
                    
                </div>
            </div>
        </Modal>
    );
};

export default ModalComponent;
