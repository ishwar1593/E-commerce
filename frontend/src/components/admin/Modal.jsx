// Modal.jsx
import React from "react";
import { Dialog } from "@headlessui/react"; // Optional, if you want to use Dialog component for accessibility
import { Button } from "@/components/ui/button";

// Modal.jsx
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button onClick={onClose} className="absolute top-2 right-10 text-red-700 p-5 font-extrabold text-lg">X</button>
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  
