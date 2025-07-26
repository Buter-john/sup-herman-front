import React from "react";

interface AlertProps {
  title: string;
  error: string;
}

const AlertMessage: React.FC<AlertProps> = ({ title, error }) => {
  return (
    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">{title} </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default AlertMessage;
