// components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, message, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
        <h2
          className={`text-xl font-bold mb-4 ${
            isSuccess ? "text-green-500" : "text-red-500"
          }`}
        >
          {isSuccess ? "Success" : "Error"}
        </h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex justify-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
