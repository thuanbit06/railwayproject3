import React from "react";

const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
      {children}
    </div>
  </div>
);

export default AuthLayout;
