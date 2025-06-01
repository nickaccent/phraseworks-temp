import React from 'react';
import { IoIosInformationCircle } from 'react-icons/io';

const Alert = (props) => {
  let baseClass = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ';
  let className = '';
  let icon = undefined;
  switch (props.severity) {
    case 'success':
      className = 'text-green-500 bg-green-100 ' + baseClass;
      icon = (
        <>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="sr-only">Check icon</span>
        </>
      );
      break;
    case 'error':
      className = 'text-red-500 bg-red-100 ' + baseClass;
      icon = (
        <>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
          <span className="sr-only">Error icon</span>
        </>
      );
      break;
    case 'warning':
      className = 'text-orange-500 bg-orange-100 ' + baseClass;
      icon = (
        <>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
          </svg>
          <span className="sr-only">Warning icon</span>
        </>
      );
      break;
    case 'info':
      className = 'bg-blue-100 text-blue-500 ' + baseClass;
      icon = <IoIosInformationCircle />;
      break;
    default:
      className = 'bg-blue-100 text-blue-500 ' + baseClass;
      icon = <IoIosInformationCircle />;
  }

  return (
    <div
      id="toast-success"
      className="flex items-center w-full max-w-xs p-4 mb-2 text-gray-500 bg-white rounded-lg shadow"
      role="alert"
    >
      <div className={className}>
        {icon}
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{props.children}.</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg   p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
        data-dismiss-target="#toast-success"
        aria-label="Close"
        onClick={() => {
          props.onClose();
        }}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
