import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-3xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
      <p className="text-lg text-gray-500 mt-2">
        Sorry, the page you are looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
