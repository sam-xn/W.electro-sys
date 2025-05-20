// Modal.js

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div className="max-w-full m-4 p-8 bg-[#eff1fc] rounded shadow border border-slate-500 text-lg text-red-700">
                {children}
            </div>

        </div>
    );
};

export default Modal;