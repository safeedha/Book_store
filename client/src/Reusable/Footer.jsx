import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 relative z-50">
      <div className="container mx-auto text-center">
        <p className="mb-4 text-sm">
          &copy; 2024 Book Loom. All rights reserved.
        </p>
        <ul className="flex justify-center space-x-6">
          <li>
            <a href="#" className="hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition-colors text-sm">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
